const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("GameRewards Contract", () => {
  let gameRewards
  let owner
  let player1
  let player2
  let verifier

  beforeEach(async () => {
    ;[owner, player1, player2, verifier] = await ethers.getSigners()

    const GameRewards = await ethers.getContractFactory("GameRewards")
    gameRewards = await GameRewards.deploy(verifier.address)
    await gameRewards.deployed()
  })

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      expect(await gameRewards.owner()).to.equal(owner.address)
    })

    it("Should set the right verifier", async () => {
      expect(await gameRewards.verifier()).to.equal(verifier.address)
    })

    it("Should have correct initial values", async () => {
      expect(await gameRewards.totalRewardsDistributed()).to.equal(0)
      expect(await gameRewards.totalGamesPlayed()).to.equal(0)
    })
  })

  describe("Game Result Submission", () => {
    it("Should allow verifier to submit valid game results", async () => {
      const score = 1000
      const timestamp = Math.floor(Date.now() / 1000)
      const sessionId = ethers.utils.formatBytes32String("session1")

      // Generate signature
      const messageHash = ethers.utils.solidityKeccak256(
        ["address", "uint256", "uint256", "bytes32"],
        [player1.address, score, timestamp, sessionId],
      )
      const signature = await verifier.signMessage(ethers.utils.arrayify(messageHash))

      await expect(
        gameRewards.connect(verifier).submitGameResult(player1.address, score, timestamp, sessionId, signature),
      )
        .to.emit(gameRewards, "GameResultSubmitted")
        .withArgs(player1.address, score, timestamp, sessionId)
    })

    it("Should reject submissions from non-verifier", async () => {
      const score = 1000
      const timestamp = Math.floor(Date.now() / 1000)
      const sessionId = ethers.utils.formatBytes32String("session1")
      const signature = "0x" + "0".repeat(130)

      await expect(
        gameRewards.connect(player1).submitGameResult(player1.address, score, timestamp, sessionId, signature),
      ).to.be.revertedWith("Only verifier can submit results")
    })

    it("Should reject duplicate session IDs", async () => {
      const score = 1000
      const timestamp = Math.floor(Date.now() / 1000)
      const sessionId = ethers.utils.formatBytes32String("session1")

      const messageHash = ethers.utils.solidityKeccak256(
        ["address", "uint256", "uint256", "bytes32"],
        [player1.address, score, timestamp, sessionId],
      )
      const signature = await verifier.signMessage(ethers.utils.arrayify(messageHash))

      // First submission should succeed
      await gameRewards.connect(verifier).submitGameResult(player1.address, score, timestamp, sessionId, signature)

      // Second submission with same session ID should fail
      await expect(
        gameRewards.connect(verifier).submitGameResult(player1.address, score, timestamp, sessionId, signature),
      ).to.be.revertedWith("Session already processed")
    })
  })

  describe("Reward Distribution", () => {
    it("Should calculate rewards correctly", async () => {
      const score = 1000
      const expectedReward = Math.floor(score / 10) // 1 ZC per 10 points

      expect(await gameRewards.calculateReward(score)).to.equal(expectedReward)
    })

    it("Should distribute rewards after valid submission", async () => {
      const score = 1000
      const timestamp = Math.floor(Date.now() / 1000)
      const sessionId = ethers.utils.formatBytes32String("session1")

      const messageHash = ethers.utils.solidityKeccak256(
        ["address", "uint256", "uint256", "bytes32"],
        [player1.address, score, timestamp, sessionId],
      )
      const signature = await verifier.signMessage(ethers.utils.arrayify(messageHash))

      const initialBalance = await gameRewards.balanceOf(player1.address)

      await gameRewards.connect(verifier).submitGameResult(player1.address, score, timestamp, sessionId, signature)

      const finalBalance = await gameRewards.balanceOf(player1.address)
      const expectedReward = Math.floor(score / 10)

      expect(finalBalance.sub(initialBalance)).to.equal(expectedReward)
    })
  })

  describe("Leaderboard", () => {
    it("Should update leaderboard correctly", async () => {
      const score = 1000
      const timestamp = Math.floor(Date.now() / 1000)
      const sessionId = ethers.utils.formatBytes32String("session1")

      const messageHash = ethers.utils.solidityKeccak256(
        ["address", "uint256", "uint256", "bytes32"],
        [player1.address, score, timestamp, sessionId],
      )
      const signature = await verifier.signMessage(ethers.utils.arrayify(messageHash))

      await gameRewards.connect(verifier).submitGameResult(player1.address, score, timestamp, sessionId, signature)

      const playerStats = await gameRewards.getPlayerStats(player1.address)
      expect(playerStats.totalScore).to.equal(score)
      expect(playerStats.gamesPlayed).to.equal(1)
      expect(playerStats.highestScore).to.equal(score)
    })
  })
})
