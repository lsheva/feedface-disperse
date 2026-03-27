import { verifyContract } from "@nomicfoundation/hardhat-verify/verify";
import type { HardhatRuntimeEnvironment } from "hardhat/types/hre";

const DEFAULT_PROVIDERS = ["etherscan", "blockscout", "sourcify"] as const;

export type VerifyExplorerProvider = (typeof DEFAULT_PROVIDERS)[number];

export type VerifyOnAllExplorersOptions = {
  /** Defaults to etherscan, blockscout, sourcify. */
  providers?: readonly VerifyExplorerProvider[];
  /** Fully qualified name, e.g. `contracts/FeedFaceDisperse.sol:FeedFaceDisperse`. */
  contract?: string;
};

type HreGlobals = HardhatRuntimeEnvironment & {
  globalOptions: { buildProfile?: string | undefined };
};

/**
 * Runs `verifyContract` against each explorer. Uses the `default` Solidity build profile
 * while verifying so compiler input matches artifacts from normal `compile` / `run`
 * (Hardhat defaults verify to `production`, which can change the standard JSON payload).
 */
export async function verifyOnAllExplorers(
  hre: HardhatRuntimeEnvironment,
  address: `0x${string}`,
  options?: VerifyOnAllExplorersOptions,
): Promise<void> {
  const providers = options?.providers ?? DEFAULT_PROVIDERS;
  const hreVerify = hre as HreGlobals;
  const previousBuildProfile = hreVerify.globalOptions.buildProfile;
  hreVerify.globalOptions.buildProfile = "default";
  try {
    for (const provider of providers) {
      try {
        await verifyContract(
          {
            address,
            provider,
            ...(options?.contract !== undefined ? { contract: options.contract } : {}),
          },
          hre,
        );
        console.log(`  ${provider}: verified`);
      } catch (e) {
        console.log(`  ${provider}: ${e instanceof Error ? e.message : "failed"}`);
      }
    }
  } finally {
    hreVerify.globalOptions.buildProfile = previousBuildProfile;
  }
}
