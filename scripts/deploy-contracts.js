const { ethers } = require("hardhat")

async function main() {
  console.log("Deploying contracts to ZenChain testnet...")

  // Get the deployer account
  const [deployer] = await ethers.getSigners()
  console.log("Deploying contracts with account:", deployer.address)

  // Deploy ZC Token
  const ZCToken = await ethers.getContractFactory("ZCToken")
  const zcToken = await ZCToken.deploy()
  await zcToken.deployed()
  console.log("ZC Token deployed to:", zcToken.address)

  // Deploy ZTC Token
  const ZTCToken = await ethers.getContractFactory("ZTCToken")
  const ztcToken = await ZTCToken.deploy()
  await ztcToken.deployed()
  console.log("ZTC Token deployed to:", ztcToken.address)

  // Deploy GameRewards contract
  const GameRewards = await ethers.getContractFactory("GameRewards")
  const gameRewards = await GameRewards.deploy(zcToken.address, deployer.address)
  await gameRewards.deployed()
  console.log("GameRewards deployed to:", gameRewards.address)

  // Deploy ZCSwap contract
  const ZCSwap = await ethers.getContractFactory("ZCSwap")
  const zcSwap = await ZCSwap.deploy(zcToken.address, ztcToken.address)
  await zcSwap.deployed()
  console.log("ZCSwap deployed to:", zcSwap.address)

  // Set GameRewards as minter for ZC Token
  await zcToken.transferOwnership(gameRewards.address)
  console.log("ZC Token ownership transferred to GameRewards")

  // Add initial liquidity to swap (1000 ZC : 500 ZTC)
  const zcAmount = ethers.utils.parseEther("1000")
  const ztcAmount = ethers.utils.parseEther("500")

  await zcToken.approve(zcSwap.address, zcAmount)
  await ztcToken.approve(zcSwap.address, ztcAmount)
  await zcSwap.addLiquidity(zcAmount, ztcAmount)
  console.log("Initial liquidity added to ZCSwap")

  console.log("\n=== Deployment Summary ===")
  console.log("ZC Token:", zcToken.address)
  console.log("ZTC Token:", ztcToken.address)
  console.log("GameRewards:", gameRewards.address)
  console.log("ZCSwap:", zcSwap.address)
  console.log("\nUpdate CONTRACT_ADDRESSES in lib/web3-config.ts with these addresses")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
