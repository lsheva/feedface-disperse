import type { HardhatRuntimeEnvironment } from "hardhat/types/hre";
import { isAddress } from "viem";

import { verifyOnAllExplorers } from "../scripts/lib/verifyOnAllExplorers.js";

export default async function verifyAllTaskAction(
  {
    address,
    contract,
    noCompile,
  }: {
    address: string;
    contract?: string;
    noCompile: boolean;
  },
  hre: HardhatRuntimeEnvironment,
): Promise<void> {
  if (!isAddress(address)) {
    throw new Error(`Invalid contract address: ${address}`);
  }

  if (!noCompile) {
    await hre.tasks.getTask("build").run({ quiet: true, noTests: true });
    console.log();
  }

  const { networkName } = await hre.network.connect();

  console.log(`Network:  ${networkName}`);
  console.log(`Address:  ${address}`);
  if (contract !== undefined) {
    console.log(`Contract: ${contract}`);
  }
  console.log();

  await verifyOnAllExplorers(hre, address as `0x${string}`, contract ? { contract } : undefined);
}
