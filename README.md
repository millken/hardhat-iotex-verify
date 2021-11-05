# hardhat-iotex-verify

Hardhat plugin for verifying contracts on IoTeX

[Hardhat](https://hardhat.org) plugin for integration with [IotexScout](https://iotexscout.io)'s contract verification service.

## What

This plugin helps you verify the source code for your Solidity contracts on [IotexScout](https://iotexscout.io).


## Installation

```bash
npm install --save-dev hardhat-iotex-verify
```

And add the following statement to your `hardhat.config.js`:

```js
require("hardhat-iotex-verify");
```

Or, if you are using TypeScript, add this to your `hardhat.config.ts`:

```js
import "hardhat-iotex-verify";
```

## Usage

```bash
npx hardhat iotexscout-verify <address> [--testnet]
```
