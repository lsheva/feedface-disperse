// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title FeedFaceDisperse
/// @author Oleksandr (Shev) Shevchuk
/// @notice Batch ETH and ERC20 transfers from an EOA in a single transaction.
/// @dev Permits only set allowances — they don't move tokens. Each permitted token still
///      needs a corresponding TokenTransfer entry. A single permit can cover multiple
///      transfers of the same token since the allowance is shared.
contract FeedFaceDisperse {
    using SafeERC20 for IERC20;

    /// @dev Reverts when an ETH transfer to a recipient fails.
    error EthTransferFailed();

    /// @dev Reverts when refunding excess ETH to msg.sender fails.
    error EthRefundFailed();

    /// @param to Recipient address.
    /// @param amount Wei to send.
    struct EthTransfer {
        address to;
        uint256 amount;
    }

    /// @param token ERC20 token address.
    /// @param to Recipient address.
    /// @param amount Token amount (in the token's smallest unit).
    struct TokenTransfer {
        address token;
        address to;
        uint256 amount;
    }

    /// @dev ERC2612 permit parameters. Sets an allowance from msg.sender to this contract.
    /// @param token ERC20Permit token address.
    /// @param value Allowance amount to grant.
    /// @param deadline Unix timestamp after which the permit signature expires.
    /// @param v Recovery byte of the permit signature.
    /// @param r First 32 bytes of the permit signature.
    /// @param s Second 32 bytes of the permit signature.
    struct Permit {
        address token;
        uint256 value;
        uint256 deadline;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    /// @notice Disperse ETH and ERC20 tokens to multiple recipients.
    /// @dev Execution order: permits → ETH transfers → token transfers → refund excess ETH.
    /// @param ethTransfers ETH sends funded by msg.value.
    /// @param tokenTransfers ERC20 transfers pulled from msg.sender via safeTransferFrom.
    /// @param permits ERC2612 permits executed before transfers to set allowances.
    function disperse(
        EthTransfer[] calldata ethTransfers,
        TokenTransfer[] calldata tokenTransfers,
        Permit[] calldata permits
    ) external payable {
        for (uint256 i = 0; i < permits.length;) {
            try IERC20Permit(permits[i].token).permit(
                msg.sender, address(this), permits[i].value, permits[i].deadline, permits[i].v, permits[i].r, permits[i].s
            ) {} catch {}
            unchecked {
                ++i;
            }
        }

        uint256 ethSpent;
        for (uint256 i = 0; i < ethTransfers.length;) {
            (bool ok,) = ethTransfers[i].to.call{value: ethTransfers[i].amount}("");
            if (!ok) revert EthTransferFailed();
            ethSpent += ethTransfers[i].amount;
            unchecked {
                ++i;
            }
        }

        for (uint256 i = 0; i < tokenTransfers.length;) {
            IERC20(tokenTransfers[i].token).safeTransferFrom(msg.sender, tokenTransfers[i].to, tokenTransfers[i].amount);
            unchecked {
                ++i;
            }
        }

        if (msg.value > ethSpent) {
            (bool ok,) = msg.sender.call{value: msg.value - ethSpent}("");
            if (!ok) revert EthRefundFailed();
        }
    }
}
