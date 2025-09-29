const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("ZCSwap Contract", () => {
  let zcSwap
  let zcToken
  let ztcToken
  let owner
  let user1
  let user2

  beforeEach(async () => {
    ;[owner, user1, user2] = await ethers.getSigners()

    // Deploy mock tokens
    const MockToken = await ethers.getContractFactory("MockERC20")
    zcToken = await MockToken.deploy("ZenChain Token", "ZC", ethers.utils.parseEther("1000000"))
    ztcToken = await MockToken.deploy("ZenChain Testnet Coin", "ZTC", ethers.utils.parseEther("1000000"))

    // Deploy swap contract
    const ZCSwap = await ethers.getContractFactory("ZCSwap")
    zcSwap = await ZCSwap.deploy(zcToken.address, ztcToken.address)
    await zcSwap.deployed()

    // Setup initial liquidity
    const initialZC = ethers.utils.parseEther("10000")
    const initialZTC = ethers.utils.parseEther("8500")

    await zcToken.transfer(zcSwap.address, initialZC)
    await ztcToken.transfer(zcSwap.address, initialZTC)
    await zcSwap.initializePool(initialZC, initialZTC)

    // Give users some tokens
    await zcToken.transfer(user1.address, ethers.utils.parseEther("1000"))
    await ztcToken.transfer(user1.address, ethers.utils.parseEther("1000"))
  })

  describe("Deployment", () => {
    it("Should set the correct token addresses", async () => {
      expect(await zcSwap.zcToken()).to.equal(zcToken.address)
      expect(await zcSwap.ztcToken()).to.equal(ztcToken.address)
    })

    it("Should initialize pool correctly", async () => {
      const poolInfo = await zcSwap.getPoolInfo()
      expect(poolInfo.zcReserve).to.equal(ethers.utils.parseEther("10000"))
      expect(poolInfo.ztcReserve).to.equal(ethers.utils.parseEther("8500"))
    })
  })

  describe("Swap Functionality", () => {
    it("Should calculate swap rates correctly", async () => {
      const amountIn = ethers.utils.parseEther("100")
      const expectedOut = await zcSwap.getSwapRate(zcToken.address, ztcToken.address, amountIn)

      // Should be approximately 85 ZTC for 100 ZC (minus fees)
      expect(expectedOut).to.be.closeTo(ethers.utils.parseEther("84.15"), ethers.utils.parseEther("1"))
    })

    it("Should execute swaps correctly", async () => {
      const amountIn = ethers.utils.parseEther("100")
      const minAmountOut = ethers.utils.parseEther("80")

      // Approve tokens
      await zcToken.connect(user1).approve(zcSwap.address, amountIn)

      const initialZCBalance = await zcToken.balanceOf(user1.address)
      const initialZTCBalance = await ztcToken.balanceOf(user1.address)

      await zcSwap.connect(user1).swap(zcToken.address, ztcToken.address, amountIn, minAmountOut)

      const finalZCBalance = await zcToken.balanceOf(user1.address)
      const finalZTCBalance = await ztcToken.balanceOf(user1.address)

      expect(initialZCBalance.sub(finalZCBalance)).to.equal(amountIn)
      expect(finalZTCBalance.gt(initialZTCBalance)).to.be.true
    })

    it("Should reject swaps with insufficient output", async () => {
      const amountIn = ethers.utils.parseEther("100")
      const minAmountOut = ethers.utils.parseEther("90") // Too high

      await zcToken.connect(user1).approve(zcSwap.address, amountIn)

      await expect(
        zcSwap.connect(user1).swap(zcToken.address, ztcToken.address, amountIn, minAmountOut),
      ).to.be.revertedWith("Insufficient output amount")
    })
  })

  describe("Pool Management", () => {
    it("Should update reserves after swaps", async () => {
      const amountIn = ethers.utils.parseEther("100")
      const minAmountOut = ethers.utils.parseEther("80")

      await zcToken.connect(user1).approve(zcSwap.address, amountIn)

      const initialPoolInfo = await zcSwap.getPoolInfo()

      await zcSwap.connect(user1).swap(zcToken.address, ztcToken.address, amountIn, minAmountOut)

      const finalPoolInfo = await zcSwap.getPoolInfo()

      expect(finalPoolInfo.zcReserve.gt(initialPoolInfo.zcReserve)).to.be.true
      expect(finalPoolInfo.ztcReserve.lt(initialPoolInfo.ztcReserve)).to.be.true
    })
  })
})
