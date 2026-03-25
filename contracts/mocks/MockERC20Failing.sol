// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @dev Token that always returns false from transferFrom (instead of reverting).
contract MockERC20ReturnsFalse {
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        allowance[msg.sender][spender] = value;
        return true;
    }

    function transferFrom(address, address, uint256) external pure returns (bool) {
        return false;
    }
}

/// @dev Token that returns no data from transferFrom (like USDT) but succeeds.
contract MockERC20NoReturn {
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        allowance[msg.sender][spender] = value;
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external {
        uint256 allowed = allowance[from][msg.sender];
        if (allowed != type(uint256).max) {
            require(allowed >= value);
            allowance[from][msg.sender] = allowed - value;
        }
        require(balanceOf[from] >= value);
        balanceOf[from] -= value;
        balanceOf[to] += value;
    }
}
