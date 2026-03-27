import { task } from "hardhat/config";
import { ArgumentType } from "hardhat/types/arguments";

const verifyAllTask = task(
  "verify-all",
  "Verify a contract on Etherscan, Blockscout, and Sourcify (uses the default Solidity build profile)",
)
  .addPositionalArgument({
    name: "address",
    description: "Deployed contract address",
  })
  .addOption({
    name: "contract",
    type: ArgumentType.STRING_WITHOUT_DEFAULT,
    description:
      "Fully qualified contract name, e.g. contracts/FeedFaceDisperse.sol:FeedFaceDisperse",
    defaultValue: undefined,
  })
  .addFlag({
    name: "noCompile",
    description: "Do not compile before verifying",
  })
  .setAction(() => import("./verify-all-task.js"))
  .build();

const feedfaceVerifyAllPlugin = {
  id: "feedface-verify-all",
  tasks: [verifyAllTask],
};

export default feedfaceVerifyAllPlugin;
