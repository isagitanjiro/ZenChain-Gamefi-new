require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-waffle")

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    zenchain: {
      url: "https://zenchain-testnet.api.onfinality.io/public",
      accounts: [process.env.PRIVATE_KEY], // Add your private key to .env
      chainId: 8408,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
}
