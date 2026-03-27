import hre from "hardhat";
import { artifacts, network } from "hardhat";
import { concat, getCreate2Address, keccak256, pad } from "viem";

import { ensureNativeBalanceForContractCall } from "./lib/ensureNativeBalanceForContractCall.js";
import { verifyOnAllExplorers } from "./lib/verifyOnAllExplorers.js";

const CREATEX = "0xba5Ed099633D3B313e4D5F7bdc1305d3c28ba5Ed" as const;

const createXAbi = [
  {
    type: "function",
    name: "deployCreate2",
    inputs: [
      { name: "salt", type: "bytes32" },
      { name: "initCode", type: "bytes" },
    ],
    outputs: [{ name: "newContract", type: "address" }],
    stateMutability: "payable",
  },
] as const;

const salt = process.env.SALT as `0x${string}` | undefined;
if (!salt) {
  console.error(
    "SALT env var is required. Run init-code-hash first, then mine with createXcrunch.",
  );
  process.exit(1);
}

const { viem, networkName } = await network.connect();
const [deployer] = await viem.getWalletClients();
const publicClient = await viem.getPublicClient();

const artifact = await artifacts.readArtifact("FeedFaceDisperse");
const bytecode = artifact.bytecode as `0x${string}`;
const initCodeHash = keccak256(bytecode);

// Replicate CreateX _guard for permissioned deploy (sender in first 20 bytes, byte 20 = 0x00)
// guardedSalt = keccak256(bytes32(uint256(uint160(msg.sender))) || salt)
const senderPadded = pad(deployer.account.address, { size: 32 });
const guardedSalt = keccak256(concat([senderPadded, salt]));

const expectedAddress = getCreate2Address({
  from: CREATEX,
  salt: guardedSalt,
  bytecodeHash: initCodeHash,
});

console.log(`Network:          ${networkName}`);
console.log(`Deployer:         ${deployer.account.address}`);
console.log(`Init code hash:   ${initCodeHash}`);
console.log(`Expected address: ${expectedAddress}`);
console.log();

const createXCode = await publicClient.getCode({ address: CREATEX });
if (!createXCode || createXCode === "0x") {
  console.error(`CreateX is not deployed on this network at ${CREATEX}. Cannot use deployCreate2.`);
  process.exit(1);
}

console.log(`CreateX is deployed on this network at ${CREATEX}. Using deployCreate2.`);

const existingDeployment = await publicClient.getCode({ address: expectedAddress });
if (existingDeployment && existingDeployment !== "0x") {
  console.log("CREATE2 target already has code at the expected address. Skipping deploy.");
} else {
  const balanceError = await ensureNativeBalanceForContractCall(publicClient, deployer.account, {
    address: CREATEX,
    abi: createXAbi,
    functionName: "deployCreate2",
    args: [salt, bytecode],
  });
  if (balanceError) {
    console.error(balanceError);
    process.exit(1);
  }

  console.log("Deploying via CreateX.deployCreate2...");

  const { request } = await publicClient.simulateContract({
    address: CREATEX,
    abi: createXAbi,
    functionName: "deployCreate2",
    args: [salt, bytecode],
  });

  const hash = await deployer.writeContract(request);

  console.log(`Tx hash: ${hash}`);
  console.log("Waiting for confirmation...");

  const receipt = await publicClient.waitForTransactionReceipt({
    hash,
    confirmations: 5,
  });

  if (receipt.status === "reverted") {
    console.error("Transaction reverted!");
    process.exit(1);
  }
  console.log(`Deployed at: ${expectedAddress}`);
  console.log();
}

await verifyOnAllExplorers(hre, expectedAddress);
