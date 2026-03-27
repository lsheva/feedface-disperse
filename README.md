# FeedFaceDisperse

Batch ETH and ERC20 transfers from an EOA in a single transaction, with ERC20 permit support.

Deployed at `0x__TODO__` on most chains.

## Features

- Batch native ETH transfers to multiple recipients
- Batch ERC20 `transferFrom` via [SafeERC20](https://docs.openzeppelin.com/contracts/5.x/api/token/erc20#SafeERC20) (handles non-standard tokens like USDT)
- ERC2612 permit support — approve and transfer in a single tx without prior on-chain approval
- Excess ETH is automatically refunded to `msg.sender`

## Deployments

| Chain                       | Explorer                                                                                                                                        |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Ethereum                    | [etherscan.io](https://etherscan.io/address/0xFEED8f72DBc14fdf99D97E9CC1EAD65828a3FACE)                                                         |
| Arbitrum                    | [arbiscan.io](https://arbiscan.io/address/0xFEED8f72DBc14fdf99D97E9CC1EAD65828a3FACE)                                                           |
| Base                        | [basescan.org](https://basescan.org/address/0xFEED8f72DBc14fdf99D97E9CC1EAD65828a3FACE)                                                         |
| Optimism                    | [optimistic.etherscan.io](https://optimistic.etherscan.io/address/0xFEED8f72DBc14fdf99D97E9CC1EAD65828a3FACE)                                   |
| Polygon                     | [polygonscan.com](https://polygonscan.com/address/0x__TODO__)                                                                                   |
| Avalanche                   | [snowscan.xyz](https://snowscan.xyz/address/0x__TODO__)                                                                                         |
| BNB Chain                   | [bscscan.com](https://bscscan.com/address/0x__TODO__)                                                                                           |
| Gnosis                      | [gnosisscan.io](https://gnosisscan.io/address/0x__TODO__)                                                                                       |
| Scroll                      | [scrollscan.com](https://scrollscan.com/address/0x__TODO__)                                                                                     |
| Linea                       | [lineascan.build](https://lineascan.build/address/0x__TODO__)                                                                                   |
| Blast                       | [blastscan.io](https://blastscan.io/address/0x__TODO__)                                                                                         |
| zkSync                      | [era.zksync.network](https://era.zksync.network/address/0x__TODO__)                                                                             |
| Polygon zkEVM               | [zkevm.polygonscan.com](https://zkevm.polygonscan.com/address/0x__TODO__)                                                                       |
| Celo                        | [celoscan.io](https://celoscan.io/address/0x__TODO__)                                                                                           |
| Mantle                      | [mantlescan.xyz](https://mantlescan.xyz/address/0x__TODO__)                                                                                     |
| Arbitrum Nova               | [nova.arbiscan.io](https://nova.arbiscan.io/address/0x__TODO__)                                                                                 |
| Zora                        | [zorascan.xyz](https://zorascan.xyz/address/0x__TODO__)                                                                                         |
| Mode                        | [modescan.io](https://modescan.io/address/0x__TODO__)                                                                                           |
| Sonic                       | [sonicscan.org](https://sonicscan.org/address/0x__TODO__)                                                                                       |
| Unichain                    | [uniscan.xyz](https://uniscan.xyz/address/0x__TODO__)                                                                                           |
| Ink                         | [inkscan.xyz](https://inkscan.xyz/address/0x__TODO__)                                                                                           |
| Berachain                   | [berascan.io](https://berascan.io/address/0x__TODO__)                                                                                           |
| Abstract                    | [abscan.org](https://abscan.org/address/0x__TODO__)                                                                                             |
| Soneium                     | [soneiumscan.org](https://soneiumscan.org/address/0x__TODO__)                                                                                   |
| World Chain                 | [worldscan.org](https://worldscan.org/address/0x__TODO__)                                                                                       |
| Shape                       | [shapescan.xyz](https://shapescan.xyz/address/0x__TODO__)                                                                                       |
| Metis                       | [andromeda-explorer.metis.io](https://andromeda-explorer.metis.io/address/0x__TODO__)                                                           |
| Frax                        | [fraxscan.com](https://fraxscan.com/address/0x__TODO__)                                                                                         |
| opBNB                       | [opbnb.bscscan.com](https://opbnb.bscscan.com/address/0x__TODO__)                                                                               |
| --                          | --                                                                                                                                              |
| Testnets                    |                                                                                                                                                 |
| Sepolia                     | [sepolia.etherscan.io](https://sourcify.dev/server/repo-ui/11155111/0xFEED8f72DBc14fdf99D97E9CC1EAD65828a3FACE)                                 |
| Arbitrum Sepolia            | [arbitrum-sepolia.arbiscan.io](https://arbitrum-sepolia.arbiscan.io/address/0xFEED8f72DBc14fdf99D97E9CC1EAD65828a3FACE)                         |
| Base Sepolia                | [base-sepolia.basescan.org](https://base-sepolia.basescan.org/address/0xFEED8f72DBc14fdf99D97E9CC1EAD65828a3FACE)                               |
| Optimism Sepolia            | [optimism-sepolia.optimistic.etherscan.io](https://optimism-sepolia.optimistic.etherscan.io/address/0xFEED8f72DBc14fdf99D97E9CC1EAD65828a3FACE) |
| Polygon Sepolia             | [polygon-sepolia.polygonscan.com](https://polygon-sepolia.polygonscan.com/address/0x__TODO__) no funds                                          |
| BNB Chain Sepolia           | [bnb-sepolia.bscscan.com](https://bnb-sepolia.bscscan.com/address/0x__TODO__) no funds                                                          |
| Gnosis Sepolia              | [gnosis-sepolia.gnosisscan.io](https://gnosis-sepolia.gnosisscan.io/address/0x__TODO__) no funds                                                |
| Automata Testnet            | createx not deployed                                                                                                                            |
| Boba Sepolia Testnet        | 0xFEED8f72DBc14fdf99D97E9CC1EAD65828a3FACE                                                                                                      |
| Derive Testnet              | no funds                                                                                                                                        |
| Lisk Sepolia Testnet        | 0xFEED8f72DBc14fdf99D97E9CC1EAD65828a3FACE                                                                                                      |
| Metal Sepolia Testnet       | 0xFEED8f72DBc14fdf99D97E9CC1EAD65828a3FACE                                                                                                      |
| Mode Sepolia Testnet        | 0xFEED8f72DBc14fdf99D97E9CC1EAD65828a3FACE (not verified, block explorer is down)                                                               |
| opBNB Testnet               | 0xFEED8f72DBc14fdf99D97E9CC1EAD65828a3FACE                                                                                                      |
| Orderly Sepolia Testnet     | createx not deployed                                                                                                                            |
| RACE Sepolia Testnet        | alchemy not available                                                                                                                           |
| Scroll Sepolia Testnet      | 0xFEED8f72DBc14fdf99D97E9CC1EAD65828a3FACE                                                                                                      |
| Shape Sepolia Testnet       | 0xFEED8f72DBc14fdf99D97E9CC1EAD65828a3FACE                                                                                                      |
| Unichain Sepolia Testnet    | 0xFEED8f72DBc14fdf99D97E9CC1EAD65828a3FACE                                                                                                      |
| World Chain Sepolia Testnet | 0xFEED8f72DBc14fdf99D97E9CC1EAD65828a3FACE                                                                                                      |
| X Layer Sepolia Testnet     | no funds                                                                                                                                        |
| Zora Sepolia Testnet        | https://sepolia.explorer.zora.energy//address/0xFEED8f72DBc14fdf99D97E9CC1EAD65828a3FACE                                                        |
| Avalanche Fuji Testnet      | no funds                                                                                                                                        |

## Usage

```solidity
function disperse(
    EthTransfer[] calldata ethTransfers,
    TokenTransfer[] calldata tokenTransfers,
    Permit[] calldata permits
) external payable;
```

### Approval

Token transfers pull from `msg.sender` via `safeTransferFrom`, so the contract needs an ERC20 allowance. Two options:

- **Permit (gasless):** include a `Permit` entry for the token in the same call. The contract calls `token.permit(msg.sender, contract, ...)` before any transfers, so no prior on-chain approval is needed. Works for ERC2612-compliant tokens.
- **Classic `approve`:** call `token.approve(contractAddress, amount)` in a separate transaction beforehand. Required for tokens that don't support ERC2612 (e.g., USDT).

Permits only set allowances — they don't move tokens by themselves. To actually transfer tokens, include a `TokenTransfer` entry for each permitted token. A single permit can cover multiple transfers of the same token (to different recipients), since the allowance is shared.

ETH transfers are funded directly by `msg.value`. Excess ETH is refunded to the caller.

## Comparison with existing solutions

|                            | FeedFaceDisperse | [disperse.app](https://disperse.app) | [Gnosis MultiSend](https://github.com/safe-global/safe-smart-account) |
| -------------------------- | ---------------- | ------------------------------------ | --------------------------------------------------------------------- |
| ETH + ERC20 in one call    | Yes              | No (separate functions)              | Yes (generic call batching)                                           |
| Multiple tokens per call   | Yes              | No (one token per call)              | Yes                                                                   |
| ERC2612 permit             | Yes              | No                                   | No                                                                    |
| SafeERC20 (USDT, etc.)     | Yes              | No                                   | N/A (raw calls)                                                       |
| Same address across chains | Yes (CreateX)    | No                                   | Yes (CREATE2)                                                         |

**disperse.app** is the most widely used tool for this purpose. It exposes `disperseEther` and `disperseToken` as separate functions, each handling a single asset type. It predates ERC2612, so a separate `approve` transaction is always required for token transfers. It also uses a raw `transfer` call, which fails on non-standard tokens like USDT that don't return a boolean.

**Gnosis MultiSend** solves a broader problem — batching arbitrary contract calls into a single transaction. It requires a Smart Account (e.g., Safe) as the caller, so it can't be used directly from an EOA. You can replicate disperse behavior by encoding individual `transfer` calls, but there's no built-in support for permits or SafeERC20.

## Development

```bash
pnpm install
pnpm test
```

### Deploy

```bash
# 1. Compile and get init code hash
pnpm compile
pnpm init-code-hash

# 2. Mine a vanity salt with createXcrunch (see output of init-code-hash)

# 3. Deploy to a network
SALT=0x... pnpm deploy:network -- --network <network>
```

The deploy script automatically verifies the contract on Etherscan, Blockscout, and Sourcify.

## Author

Oleksandr (Shev) Shevchuk

## License

[MIT](LICENSE)
