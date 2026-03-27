import path from "node:path";
import { createRequire } from "node:module";

import type { ArtifactManager } from "hardhat/types/artifacts";
import { getFullyQualifiedName, parseFullyQualifiedName } from "hardhat/utils/contract-names";

/** Same modules `ContractInformationResolver` / `verifyContract` use (not exported from package `exports`). */
const require = createRequire(import.meta.url);
const verifyInternalDir = path.join(path.dirname(require.resolve("@nomicfoundation/hardhat-verify")), "internal");
const { getBuildInfoAndOutput } = require(path.join(verifyInternalDir, "artifacts.js"));
const { resolveLibraryInformation } = require(path.join(verifyInternalDir, "libraries.js"));

type Hh3BuildInfo = {
  _format?: string;
  input?: Record<string, unknown>;
  userSourceNameMap?: Record<string, string>;
  solcLongVersion?: string;
  language?: string;
  sources?: unknown;
};

function getHh3CompilerInputAndMeta(buildInfo: Hh3BuildInfo, contractFqn: string) {
  if (buildInfo._format === "hh3-sol-build-info-1" && buildInfo.input !== undefined) {
    return {
      compilerInput: buildInfo.input,
      userSourceNameMap: buildInfo.userSourceNameMap ?? {},
      solcLongVersion: buildInfo.solcLongVersion,
    };
  }
  if (buildInfo.language === "Solidity" && buildInfo.sources !== undefined && buildInfo.input === undefined) {
    throw new Error(
      `Build info for "${contractFqn}" is missing the HH3 wrapper (expected _format "hh3-sol-build-info-1" with nested "input"). ` +
        `Remove stale artifacts/build-info JSON files and run \`hardhat compile --force\`.`,
    );
  }
  throw new Error(
    `Unrecognized build info shape for "${contractFqn}". Expected HH3 SolidityBuildInfo (hh3-sol-build-info-1).`,
  );
}

function unprefixedHex(hex: string): string {
  return hex.startsWith("0x") || hex.startsWith("0X") ? hex.slice(2) : hex;
}

export type FullVerifyCompilerInputResult = {
  /** Same object hardhat-verify sends as `sourceCode` (stringified) on the second attempt. */
  compilerInput: Record<string, unknown>;
  solcLongVersion: string;
  /** Value passed as `contractname` to Etherscan-compatible APIs. */
  inputFqn: string;
};

/**
 * Builds the full Standard JSON Input the same way as `@nomicfoundation/hardhat-verify`
 * after the minimal attempt fails: `buildInfo.input` with `settings.libraries` merged
 * from `resolveLibraryInformation` (same as `verification.js` second `attemptVerification`).
 */
export async function buildFullVerifyCompilerInput(
  artifacts: ArtifactManager,
  contractFqn: string,
): Promise<FullVerifyCompilerInputResult> {
  const found = await getBuildInfoAndOutput(artifacts, contractFqn);
  if (found === undefined) {
    throw new Error(
      `No build info for "${contractFqn}". Run \`hardhat build\` (or \`pnpm compile\`) first.`,
    );
  }
  const { buildInfo, buildInfoOutput } = found;
  const { compilerInput: baseCompilerInput, userSourceNameMap, solcLongVersion } = getHh3CompilerInputAndMeta(
    buildInfo as Hh3BuildInfo,
    contractFqn,
  );
  if (solcLongVersion === undefined || solcLongVersion === "") {
    throw new Error(`Missing solcLongVersion in build info for "${contractFqn}". Run \`hardhat compile --force\`.`);
  }

  const { sourceName, contractName } = parseFullyQualifiedName(contractFqn);
  let inputSourceName = userSourceNameMap[sourceName];
  if (inputSourceName === undefined) {
    const artifact = (await artifacts.readArtifact(contractFqn)) as { inputSourceName?: string };
    if (artifact.inputSourceName !== undefined) {
      inputSourceName = artifact.inputSourceName;
    }
  }
  if (inputSourceName === undefined) {
    throw new Error(`Missing userSourceNameMap entry for source "${sourceName}"`);
  }

  const compilerOutputContract = buildInfoOutput.output.contracts?.[inputSourceName]?.[contractName];
  if (compilerOutputContract === undefined) {
    throw new Error(`Compiler output not found for ${contractFqn}`);
  }

  const deployedObject = compilerOutputContract.evm?.deployedBytecode?.object;
  if (deployedObject === undefined || typeof deployedObject !== "string") {
    throw new Error("Missing evm.deployedBytecode.object in compiler output");
  }

  const deployedBytecode = unprefixedHex(deployedObject);

  const contractInformation = {
    compilerInput: baseCompilerInput,
    solcLongVersion,
    sourceName,
    userFqn: contractFqn,
    inputFqn: getFullyQualifiedName(inputSourceName, contractName),
    compilerOutputContract,
    deployedBytecode,
  };

  const libraryInformation = resolveLibraryInformation(contractInformation, {});

  const compilerInput = {
    ...contractInformation.compilerInput,
    settings: {
      ...(contractInformation.compilerInput.settings ?? {}),
      libraries: libraryInformation.libraries,
    },
  };

  return {
    compilerInput,
    solcLongVersion,
    inputFqn: contractInformation.inputFqn,
  };
}
