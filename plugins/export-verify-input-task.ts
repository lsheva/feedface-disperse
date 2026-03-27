import { writeFile } from "node:fs/promises";

import type { HardhatRuntimeEnvironment } from "hardhat/types/hre";

import { buildFullVerifyCompilerInput } from "../scripts/lib/buildFullVerifyCompilerInput.js";

export default async function exportVerifyInputTaskAction(
  {
    contract,
    out,
    noCompile,
  }: {
    contract: string;
    out: string | undefined;
    noCompile: boolean;
  },
  hre: HardhatRuntimeEnvironment,
): Promise<void> {
  if (!noCompile) {
    await hre.tasks.getTask("build").run({ quiet: true, noTests: true });
    console.log();
  }

  const { compilerInput, solcLongVersion, inputFqn } = await buildFullVerifyCompilerInput(
    hre.artifacts,
    contract,
  );

  const text = `${JSON.stringify(compilerInput, null, 2)}\n`;

  if (out !== undefined && out !== "") {
    await writeFile(out, text, "utf8");
    console.log(`Wrote Standard JSON Input to ${out}`);
    console.log(`solcLongVersion (explorer compiler field): ${solcLongVersion}`);
    console.log(`contractname (explorer contract field): ${inputFqn}`);
  } else {
    process.stdout.write(text);
  }
}
