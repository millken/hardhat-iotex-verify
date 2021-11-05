import {
  TASK_COMPILE_SOLIDITY,
  TASK_COMPILE_SOLIDITY_COMPILE,
} from "hardhat/builtin-tasks/task-names";
import { subtask, task, types } from "hardhat/config";
import {
  CompilerDownloader,
  CompilerPlatform,
} from "hardhat/internal/solidity/compiler/downloader";
import { getCompilersDir } from "hardhat/internal/util/global-dir";
import { NomicLabsHardhatPluginError } from "hardhat/plugins";

import {
  MAINNET_BROWSER_URL,
  mainnetVerifyURL,
  pluginName,
  TASK_IOTEXSCOUT_VERIFY,
  TESTNET_BROWSER_URL,
  testnetVerifyURL,
} from "./constants";
import { submitSourcesToIotexScout } from "./iotexscout";
import { Store, VerifyApiResponse } from "./types";

const store: Store = {
  inputJSON: "",
  longVersion: "",
  platform: "",
};

subtask(TASK_COMPILE_SOLIDITY_COMPILE, async (taskArgs: any, { run }) => {
  const compilersCache = await getCompilersDir();
  const downloader = new CompilerDownloader(compilersCache);
  const {
    longVersion,
    platform: desiredPlatform,
  } = await downloader.getCompilerBuild(taskArgs.solcVersion);

  store.longVersion = longVersion;
  store.platform = desiredPlatform;
  store.settings = taskArgs.input.settings;
  store.inputJSON = JSON.stringify(taskArgs.input);
  // break task no return
});

task(TASK_IOTEXSCOUT_VERIFY, "Verifies contract on IotexScout")
  .addPositionalParam("address", "Address of the smart contract to verify")
  .addFlag("testnet", "verify on IoTeX testnet specified by --testnet option")
  .setAction(async (args, hre) => {
    const address: string = args.address;
    if (
      address === "" ||
      address.length !== 41 ||
      address.substr(0, 2) !== "io"
    ) {
      throw new NomicLabsHardhatPluginError(
        pluginName,
        `${address} is an invalid address.`
      );
    }
    const apiUrl = args.testnet ? testnetVerifyURL : mainnetVerifyURL;
    // const apiUrl = "http://192.168.0.202:8084/api/verifyByInputJSON";
    console.log(
      "verify contract address: " +
        args.address +
        " on IoTeX " +
        (args.testnet ? "testnet" : "mainnet")
    );
    console.log("preparing data...");
    try {
      await hre.run(TASK_COMPILE_SOLIDITY, { quiet: true, force: true });
    } catch {}
    console.log("version: " + store.longVersion);
    console.log("platform: " + store.platform);
    console.log("settings: " + JSON.stringify(store.settings));
    console.log("verifing data...");
    const result = await submitSourcesToIotexScout(apiUrl, args.address, store);
    if (!result.isOk()) {
      throw new NomicLabsHardhatPluginError(
        pluginName,
        `The API responded with a failure status.
    Reason: ${result.message}`
      );
    } else {
      const contractURL =
        (args.testnet ? TESTNET_BROWSER_URL : MAINNET_BROWSER_URL) +
        "/address/" +
        address +
        "#code";
      console.log(
        `Successfully verified contract address ${address} on IotexScout.
      ${contractURL}`
      );
    }
  });
