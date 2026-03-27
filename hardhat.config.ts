import env from "node:process";
import hardhatToolboxViem from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable, defineConfig } from "hardhat/config";
import { bobaSepolia, liskSepolia, opBNBTestnet, shapeSepolia, zoraSepolia } from "viem/chains";

import feedfaceExportVerifyInput from "./plugins/export-verify-input.js";
import feedfaceVerifyAll from "./plugins/verify-all.js";

env.loadEnvFile(".env");

const accounts = [configVariable("PRIVATE_KEY")];
const alchemy = (chain: string) =>
  configVariable("ALCHEMY_API_KEY", `https://${chain}.g.alchemy.com/v2/{variable}`);
/** Public RPC (no API key). Prefer env overrides for production deploys. */
const http = (url: string) => url as unknown as ReturnType<typeof alchemy>;

export default defineConfig({
  verify: {
    etherscan: {
      apiKey: configVariable("ETHERSCAN_API_KEY"),
    },
  },
  chainDescriptors: {
    [bobaSepolia.id]: {
      name: bobaSepolia.name,
      blockExplorers: {
        etherscan: {
          ...bobaSepolia.blockExplorers.default,
          apiUrl: "https://api.routescan.io/v2/network/testnet/evm/28882/etherscan/api",
        },
      },
    },
    [liskSepolia.id]: {
      name: liskSepolia.name,
      blockExplorers: {
        blockscout: liskSepolia.blockExplorers.default,
      },
    },
    1740: {
      name: "Metal Sepolia",
      blockExplorers: {
        blockscout: {
          name: "Blockscout",
          url: "https://testnet.explorer.metall2.com",
          apiUrl: "https://testnet.explorer.metall2.com/api",
        },
      },
    },
    919: {
      name: "Mode Sepolia",
      blockExplorers: {
        blockscout: {
          name: "Modescout",
          url: "https://https://sepolia.explorer.mode.network",
          apiUrl: "https://https://sepolia.explorer.mode.network/api",
        },
        etherscan: {
          name: "Routescan",
          url: "https://testnet.modescan.io",
          apiUrl: "https://testnet.modescan.io/api",
        },
      },
    },
    [opBNBTestnet.id]: {
      name: "opBNB Testnet",
      blockExplorers: {
        etherscan: {
          ...opBNBTestnet.blockExplorers.default,
        },
      },
    },
    [shapeSepolia.id]: {
      name: "Shape Sepolia",
      blockExplorers: {
        blockscout: {
          ...shapeSepolia.blockExplorers.default,
          apiUrl: "https://sepolia.shapescan.xyz/api",
        },
      },
    },
    [zoraSepolia.id]: {
      name: "Zora Sepolia",
      blockExplorers: {
        etherscan: {
          ...zoraSepolia.blockExplorers.default,
        },
      },
    },
  },
  plugins: [hardhatToolboxViem, feedfaceVerifyAll, feedfaceExportVerifyInput],
  solidity: {
    version: "0.8.28",
    // Keeps implicit `production` profile closer to `default` (see Hardhat 3 compiler profiles).
    isolated: false,
    settings: { viaIR: true, evmVersion: "paris", optimizer: { enabled: true, runs: 10000000 } },
  },
  networks: {
    // Testnets (match README)
    sepolia: { type: "http", url: alchemy("eth-sepolia"), accounts },
    "arbitrum-sepolia": { type: "http", url: alchemy("arb-sepolia"), accounts },
    "avalanche-fuji": { type: "http", url: alchemy("avax-fuji"), accounts },
    automata: { type: "http", chainType: "op", url: http("https://1rpc.io/ata/testnet"), accounts },
    "base-sepolia": { type: "http", chainType: "op", url: alchemy("base-sepolia"), accounts },
    "boba-sepolia": { type: "http", url: alchemy("boba-sepolia"), accounts },
    "bnb-sepolia": { type: "http", url: alchemy("bnb-testnet"), accounts },
    "derive-testnet": {
      type: "http",
      chainType: "op",
      url: http("https://testnet-rpc.derive.xyz"),
      accounts,
    },
    "gnosis-sepolia": { type: "http", url: alchemy("gnosis-chiado"), accounts },
    "lisk-sepolia": {
      type: "http",
      chainType: "op",
      url: http("https://rpc.sepolia-api.lisk.com"),
      accounts,
    },
    "metal-sepolia": { type: "http", url: http("https://testnet.rpc.metall2.com"), accounts },
    "mode-sepolia": { type: "http", chainType: "op", url: alchemy("mode-sepolia"), accounts },
    "opbnb-testnet": { type: "http", chainType: "op", url: alchemy("opbnb-testnet"), accounts },
    "optimism-sepolia": { type: "http", chainType: "op", url: alchemy("opt-sepolia"), accounts },
    "orderly-sepolia": {
      type: "http",
      chainType: "op",
      url: http("https://testnet-rpc.orderly.org"),
      accounts,
    },
    "polygon-sepolia": { type: "http", url: alchemy("polygon-amoy"), accounts },
    "race-sepolia": { type: "http", chainType: "op", url: alchemy("race-sepolia"), accounts },
    "scroll-sepolia": { type: "http", url: alchemy("scroll-sepolia"), accounts },
    "shape-sepolia": { type: "http", url: alchemy("shape-sepolia"), accounts },
    "unichain-sepolia": {
      type: "http",
      chainType: "op",
      url: alchemy("unichain-sepolia"),
      accounts,
    },
    "worldchain-sepolia": {
      type: "http",
      chainType: "op",
      url: alchemy("worldchain-sepolia"),
      accounts,
    },
    "xlayer-sepolia": { type: "http", url: http("https://testrpc.xlayer.tech/terigon"), accounts },
    "zora-sepolia": { type: "http", chainType: "op", url: alchemy("zora-sepolia"), accounts },

    // Mainnets
    ethereum: { type: "http", url: alchemy("eth-mainnet"), accounts },
    arbitrum: { type: "http", url: alchemy("arb-mainnet"), accounts },
    base: { type: "http", chainType: "op", url: alchemy("base-mainnet"), accounts },
    optimism: { type: "http", chainType: "op", url: alchemy("opt-mainnet"), accounts },
    polygon: { type: "http", url: alchemy("polygon-mainnet"), accounts },
    avalanche: { type: "http", url: alchemy("avax-mainnet"), accounts },
    bnb: { type: "http", url: alchemy("bnb-mainnet"), accounts },
    gnosis: { type: "http", url: alchemy("gnosis-mainnet"), accounts },
    scroll: { type: "http", url: alchemy("scroll-mainnet"), accounts },
    linea: { type: "http", url: alchemy("linea-mainnet"), accounts },
    blast: { type: "http", url: alchemy("blast-mainnet"), accounts },
    zksync: { type: "http", url: alchemy("zksync-mainnet"), accounts },
    polygonZkEvm: { type: "http", url: alchemy("polygonzkevm-mainnet"), accounts },
    celo: { type: "http", url: alchemy("celo-mainnet"), accounts },
    mantle: { type: "http", url: alchemy("mantle-mainnet"), accounts },
    arbitrumNova: { type: "http", url: alchemy("arbnova-mainnet"), accounts },
    zora: { type: "http", chainType: "op", url: alchemy("zora-mainnet"), accounts },
    mode: { type: "http", chainType: "op", url: alchemy("mode-mainnet"), accounts },
    sonic: { type: "http", url: alchemy("sonic-mainnet"), accounts },
    unichain: { type: "http", chainType: "op", url: alchemy("unichain-mainnet"), accounts },
    ink: { type: "http", chainType: "op", url: alchemy("ink-mainnet"), accounts },
    berachain: { type: "http", url: alchemy("berachain-mainnet"), accounts },
    abstract: { type: "http", url: alchemy("abstract-mainnet"), accounts },
    soneium: { type: "http", url: alchemy("soneium-mainnet"), accounts },
    worldchain: { type: "http", chainType: "op", url: alchemy("worldchain-mainnet"), accounts },
    shape: { type: "http", url: alchemy("shape-mainnet"), accounts },
    metis: { type: "http", url: alchemy("metis-mainnet"), accounts },
    frax: { type: "http", chainType: "op", url: alchemy("frax-mainnet"), accounts },
    opbnb: { type: "http", chainType: "op", url: alchemy("opbnb-mainnet"), accounts },
  },
});
