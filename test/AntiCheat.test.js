const { expect } = require("chai")
const { AntiCheatSystem } = require("../lib/anti-cheat")

describe("Anti-Cheat System", () => {
  let playerAddress
  let gameSession

  beforeEach(() => {
    playerAddress = "0x1234567890123456789012345678901234567890"
    gameSession = AntiCheatSystem.generateGameSession(playerAddress, "arena")
  })

  describe("Session Generation", () => {
    it("Should generate valid game sessions", () => {
      expect(gameSession.sessionId).to.be.a("string")
      expect(gameSession.playerAddress).to.equal(playerAddress.toLowerCase())
      expect(gameSession.gameMode).to.equal("arena")
      expect(gameSession.serverSeed).to.be.a("string")
      expect(gameSession.startTime).to.be.a("number")
    })
  })

  describe("Game Result Validation", () => {
    it("Should validate legitimate game results", () => {
      const gameResult = {
        sessionId: gameSession.sessionId,
        score: 1000,
        kills: 20,
        accuracy: 0.8,
        survivalTime: 45,
        gameEvents: [
          { timestamp: Date.now(), type: "hit", data: { targetId: "1" } },
          { timestamp: Date.now() + 500, type: "hit", data: { targetId: "2" } },
          { timestamp: Date.now() + 1000, type: "miss", data: {} },
        ],
        clientHash: "test-hash",
      }

      // Simulate game duration
      gameSession.startTime = Date.now() - 50000 // 50 seconds ago

      const validation = AntiCheatSystem.validateGameResult(gameResult, gameSession)
      expect(validation.isValid).to.be.true
      expect(validation.score).to.be.a("number")
      expect(validation.signature).to.be.a("string")
    })

    it("Should reject results with impossible scores", () => {
      const gameResult = {
        sessionId: gameSession.sessionId,
        score: 100000, // Impossibly high
        kills: 20,
        accuracy: 0.8,
        survivalTime: 45,
        gameEvents: [],
        clientHash: "test-hash",
      }

      gameSession.startTime = Date.now() - 50000

      const validation = AntiCheatSystem.validateGameResult(gameResult, gameSession)
      expect(validation.isValid).to.be.false
      expect(validation.reason).to.include("Score too high")
    })

    it("Should reject results with impossible accuracy", () => {
      const gameResult = {
        sessionId: gameSession.sessionId,
        score: 1000,
        kills: 20,
        accuracy: 1.0, // 100% accuracy is suspicious
        survivalTime: 45,
        gameEvents: [],
        clientHash: "test-hash",
      }

      gameSession.startTime = Date.now() - 50000

      const validation = AntiCheatSystem.validateGameResult(gameResult, gameSession)
      expect(validation.isValid).to.be.false
      expect(validation.reason).to.include("Accuracy suspiciously high")
    })

    it("Should reject results from invalid sessions", () => {
      const gameResult = {
        sessionId: "invalid-session-id",
        score: 1000,
        kills: 20,
        accuracy: 0.8,
        survivalTime: 45,
        gameEvents: [],
        clientHash: "test-hash",
      }

      const validation = AntiCheatSystem.validateGameResult(gameResult, gameSession)
      expect(validation.isValid).to.be.false
      expect(validation.reason).to.include("Invalid session ID")
    })
  })

  describe("Rate Limiting", () => {
    it("Should allow reasonable number of games", () => {
      const recentSessions = []
      for (let i = 0; i < 10; i++) {
        recentSessions.push({
          playerAddress: playerAddress.toLowerCase(),
          startTime: Date.now() - i * 60000, // Games every minute
        })
      }

      const allowed = AntiCheatSystem.checkRateLimit(playerAddress, recentSessions)
      expect(allowed).to.be.true
    })

    it("Should reject excessive gaming", () => {
      const recentSessions = []
      for (let i = 0; i < 25; i++) {
        recentSessions.push({
          playerAddress: playerAddress.toLowerCase(),
          startTime: Date.now() - i * 60000, // Too many games
        })
      }

      const allowed = AntiCheatSystem.checkRateLimit(playerAddress, recentSessions)
      expect(allowed).to.be.false
    })
  })

  describe("Signature Verification", () => {
    it("Should generate and verify signatures correctly", () => {
      const gameResult = {
        sessionId: gameSession.sessionId,
        score: 1000,
        kills: 20,
        accuracy: 0.8,
        survivalTime: 45,
        gameEvents: [],
        clientHash: "test-hash",
      }

      gameSession.startTime = Date.now() - 50000

      const validation = AntiCheatSystem.validateGameResult(gameResult, gameSession)
      expect(validation.isValid).to.be.true

      const isValidSignature = AntiCheatSystem.verifyResultSignature(gameResult, gameSession, validation.signature)
      expect(isValidSignature).to.be.true
    })
  })
})
