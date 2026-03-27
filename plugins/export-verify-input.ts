import { task } from "hardhat/config";
import { ArgumentType } from "hardhat/types/arguments";

const exportVerifyInputTask = task(
  "export-verify-input",
  "Print or save the Standard JSON Input used by hardhat-verify on its second attempt (full compiler input + library settings).",
)
  .addPositionalArgument({
    name: "contract",
    description:
      "Fully qualified contract name (e.g. contracts/FeedFaceDisperse.sol:FeedFaceDisperse)",
  })
  .addOption({
    name: "out",
    type: ArgumentType.STRING_WITHOUT_DEFAULT,
    description: "Write JSON to this file instead of stdout",
    defaultValue: undefined,
  })
  .addFlag({
    name: "noCompile",
    description: "Do not run build before reading artifacts",
  })
  .setAction(() => import("./export-verify-input-task.js"))
  .build();

const exportVerifyInputPlugin = {
  id: "feedface-export-verify-input",
  tasks: [exportVerifyInputTask],
};

export default exportVerifyInputPlugin;
