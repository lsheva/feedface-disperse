import { defineConfig } from "@wagmi/cli";
import { hardhat } from "@wagmi/cli/plugins";

export default defineConfig({
  plugins: [
    hardhat({
      artifacts: "./artifacts/contracts/FeedFaceDisperse.sol",
      project: ".",
      commands: {
        build: "pnpm hardhat compile",
        rebuild: "pnpm hardhat compile",
      },
    }),
  ],
  out: "./abi/FeedFaceDisperse.ts",
});
