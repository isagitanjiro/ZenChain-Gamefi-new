const hre = require("hardhat")

async function main() {
  console.log("🚀 Starting ZenChain GameFi Deployment Test...")

  const [deployer] = await hre.ethers.getSigners()
  console.log("Deploying contracts with account:", deployer.address)
  console.log("Account balance:", (await deployer.getBalance()).toString())

  try {
    // Deploy GameRewards contract
    console.log("\n📋 Deploying GameRewards contract...")
    const GameRewards = await hre.ethers.getContractFactory("GameRewards")
    const gameRewards = await GameRewards.deploy(deployer.address) // Using deployer as verifier for testing
    await gameRewards.deployed()
    console.log("✅ GameRewards deployed to:", gameRewards.address)

    // Deploy ZCSwap contract
    console.log("\n💱 Deploying ZCSwap contract...")
    const ZCSwap = await hre.ethers.getContractFactory("ZCSwap")
    const zcSwap = await ZCSwap.deploy(
      "0x0000000000000000000000000000000000000001", // Placeholder ZC token
      "0x0000000000000000000000000000000000000002", // Placeholder ZTC token
    )
    await zcSwap.deployed()
    console.log("✅ ZCSwap deployed to:", zcSwap.address)

    // Test basic functionality
    console.log("\n🧪 Testing basic contract functionality...")

    // Test GameRewards
    const totalRewards = await gameRewards.totalRewardsDistributed()
    console.log("Initial total rewards:", totalRewards.toString())

    const rewardForScore = await gameRewards.calculateReward(1000)
    console.log("Reward for 1000 points:", rewardForScore.toString())

    // Test ZCSwap
    const poolInfo = await zcSwap.getPoolInfo()
    console.log("Pool ZC Reserve:", poolInfo.zcReserve.toString())
    console.log("Pool ZTC Reserve:", poolInfo.ztcReserve.toString())

    console.log("\n✅ All contracts deployed and tested successfully!")
    console.log("\n📝 Contract Addresses:")
    console.log("GameRewards:", gameRewards.address)
    console.log("ZCSwap:", zcSwap.address)

    // Save addresses to file
    const fs = require("fs")
    const addresses = {
      GameRewards: gameRewards.address,
      ZCSwap: zcSwap.address,
      network: hre.network.name,
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
    }

    fs.writeFileSync(`deployments/${hre.network.name}-addresses.json`, JSON.stringify(addresses, null, 2))
    console.log(`\n💾 Addresses saved to deployments/${hre.network.name}-addresses.json`)
  } catch (error) {
    console.error("❌ Deployment failed:", error)
    process.exit(1)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
