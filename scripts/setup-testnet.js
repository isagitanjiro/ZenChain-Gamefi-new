const hre = require("hardhat")

async function main() {
  console.log("🌐 Setting up ZenChain Testnet Environment...")

  const [deployer] = await hre.ethers.getSigners()
  console.log("Setup account:", deployer.address)

  try {
    // Check network
    const network = await hre.ethers.provider.getNetwork()
    console.log("Connected to network:", network.name, "Chain ID:", network.chainId)

    if (network.chainId !== 8408) {
      // ZenChain testnet chain ID
      console.log("⚠️  Warning: Not connected to ZenChain testnet (Chain ID: 8408)")
      console.log("Current Chain ID:", network.chainId)
    }

    // Check balance
    const balance = await deployer.getBalance()
    console.log("Account balance:", hre.ethers.utils.formatEther(balance), "ETH")

    if (balance.lt(hre.ethers.utils.parseEther("0.1"))) {
      console.log("⚠️  Low balance detected. You may need testnet tokens.")
      console.log("Visit ZenChain testnet faucet to get test tokens.")
    }

    // Test contract deployment (dry run)
    console.log("\n🧪 Testing contract compilation...")
    const GameRewards = await hre.ethers.getContractFactory("GameRewards")
    const ZCSwap = await hre.ethers.getContractFactory("ZCSwap")
    console.log("✅ All contracts compiled successfully")

    // Estimate gas costs
    console.log("\n⛽ Estimating deployment costs...")
    const gameRewardsDeployTx = GameRewards.getDeployTransaction(deployer.address)
    const gameRewardsGasEstimate = await hre.ethers.provider.estimateGas(gameRewardsDeployTx)

    const zcSwapDeployTx = ZCSwap.getDeployTransaction(
      "0x0000000000000000000000000000000000000001",
      "0x0000000000000000000000000000000000000002",
    )
    const zcSwapGasEstimate = await hre.ethers.provider.estimateGas(zcSwapDeployTx)

    const gasPrice = await hre.ethers.provider.getGasPrice()
    const totalGas = gameRewardsGasEstimate.add(zcSwapGasEstimate)
    const totalCost = totalGas.mul(gasPrice)

    console.log("GameRewards gas estimate:", gameRewardsGasEstimate.toString())
    console.log("ZCSwap gas estimate:", zcSwapGasEstimate.toString())
    console.log("Total gas needed:", totalGas.toString())
    console.log("Estimated cost:", hre.ethers.utils.formatEther(totalCost), "ETH")

    // Create deployments directory
    const fs = require("fs")
    if (!fs.existsSync("deployments")) {
      fs.mkdirSync("deployments")
      console.log("📁 Created deployments directory")
    }

    console.log("\n✅ Testnet setup complete!")
    console.log("\n📋 Next steps:")
    console.log("1. Ensure you have sufficient testnet tokens")
    console.log("2. Run: npm run deploy:testnet")
    console.log("3. Update frontend environment variables")
    console.log("4. Test the application")
  } catch (error) {
    console.error("❌ Setup failed:", error)
    process.exit(1)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
