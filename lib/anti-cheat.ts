import { createHash, randomBytes } from "crypto"

export interface GameSession {
  sessionId: string
  playerAddress: string
  gameMode: string
  startTime: number
  serverSeed: string
  clientSeed?: string
}

export interface GameResult {
  sessionId: string
  score: number
  kills: number
  accuracy: number
  survivalTime: number
  gameEvents: GameEvent[]
  clientHash: string
}

export interface GameEvent {
  timestamp: number
  type: "hit" | "miss" | "spawn" | "death" | "powerup"
  data: any
}

export interface ValidationResult {
  isValid: boolean
  score: number
  reason?: string
  signature?: string
}

export class AntiCheatSystem {
  private static readonly MAX_SCORE_PER_SECOND = 50
  private static readonly MIN_REACTION_TIME = 100 // milliseconds
  private static readonly MAX_ACCURACY = 0.95 // 95% max accuracy to prevent perfect bots
  private static readonly SUSPICIOUS_PATTERNS_THRESHOLD = 3

  // Generate a secure game session
  static generateGameSession(playerAddress: string, gameMode: string): GameSession {
    const sessionId = randomBytes(16).toString("hex")
    const serverSeed = randomBytes(32).toString("hex")

    return {
      sessionId,
      playerAddress: playerAddress.toLowerCase(),
      gameMode,
      startTime: Date.now(),
      serverSeed,
    }
  }

  // Validate game results server-side
  static validateGameResult(result: GameResult, session: GameSession): ValidationResult {
    console.log("[v0] Validating game result for session:", result.sessionId)

    // Check session exists and matches
    if (result.sessionId !== session.sessionId) {
      return { isValid: false, score: 0, reason: "Invalid session ID" }
    }

    // Check timing constraints
    const gameTime = (Date.now() - session.startTime) / 1000
    if (gameTime < 10) {
      return { isValid: false, score: 0, reason: "Game too short" }
    }

    // Check score feasibility
    const maxPossibleScore = gameTime * this.MAX_SCORE_PER_SECOND
    if (result.score > maxPossibleScore) {
      return { isValid: false, score: 0, reason: "Score too high for game duration" }
    }

    // Check accuracy limits
    if (result.accuracy > this.MAX_ACCURACY) {
      return { isValid: false, score: 0, reason: "Accuracy suspiciously high" }
    }

    // Validate game events
    const eventValidation = this.validateGameEvents(result.gameEvents, gameTime)
    if (!eventValidation.isValid) {
      return eventValidation
    }

    // Check for suspicious patterns
    const patternCheck = this.detectSuspiciousPatterns(result.gameEvents)
    if (patternCheck.suspiciousCount >= this.SUSPICIOUS_PATTERNS_THRESHOLD) {
      return { isValid: false, score: 0, reason: "Suspicious gameplay patterns detected" }
    }

    // Generate server signature for verified result
    const signature = this.generateResultSignature(result, session)

    console.log("[v0] Game result validated successfully")
    return {
      isValid: true,
      score: Math.floor(result.score * 0.95), // Apply slight penalty for security
      signature,
    }
  }

  // Validate individual game events
  private static validateGameEvents(events: GameEvent[], gameTime: number): ValidationResult {
    let lastEventTime = 0
    let hitCount = 0
    let missCount = 0

    for (const event of events) {
      // Check event timing
      if (event.timestamp < lastEventTime) {
        return { isValid: false, score: 0, reason: "Events out of chronological order" }
      }

      // Check reaction times for hits
      if (event.type === "hit") {
        const reactionTime = event.timestamp - lastEventTime
        if (reactionTime < this.MIN_REACTION_TIME && lastEventTime > 0) {
          return { isValid: false, score: 0, reason: "Reaction time too fast" }
        }
        hitCount++
      }

      if (event.type === "miss") {
        missCount++
      }

      lastEventTime = event.timestamp
    }

    // Check hit/miss ratio
    const totalShots = hitCount + missCount
    if (totalShots > 0) {
      const accuracy = hitCount / totalShots
      if (accuracy > this.MAX_ACCURACY) {
        return { isValid: false, score: 0, reason: "Hit ratio too high" }
      }
    }

    return { isValid: true, score: 0 }
  }

  // Detect suspicious patterns in gameplay
  private static detectSuspiciousPatterns(events: GameEvent[]): { suspiciousCount: number } {
    let suspiciousCount = 0
    const hitTimes: number[] = []

    // Collect hit timestamps
    events.forEach((event) => {
      if (event.type === "hit") {
        hitTimes.push(event.timestamp)
      }
    })

    // Check for too regular timing patterns (bot-like behavior)
    if (hitTimes.length >= 5) {
      const intervals = []
      for (let i = 1; i < hitTimes.length; i++) {
        intervals.push(hitTimes[i] - hitTimes[i - 1])
      }

      // Check for suspiciously consistent intervals
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
      const variance =
        intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length

      if (variance < 100) {
        // Very low variance indicates bot-like behavior
        suspiciousCount++
      }
    }

    // Check for impossible movement patterns
    // (This would be expanded based on specific game mechanics)

    return { suspiciousCount }
  }

  // Generate cryptographic signature for verified results
  private static generateResultSignature(result: GameResult, session: GameSession): string {
    const data = `${result.sessionId}:${result.score}:${result.kills}:${session.serverSeed}`
    return createHash("sha256").update(data).digest("hex")
  }

  // Verify a result signature
  static verifyResultSignature(result: GameResult, session: GameSession, signature: string): boolean {
    const expectedSignature = this.generateResultSignature(result, session)
    return signature === expectedSignature
  }

  // Rate limiting for game sessions
  static checkRateLimit(playerAddress: string, recentSessions: GameSession[]): boolean {
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    const recentPlayerSessions = recentSessions.filter(
      (session) => session.playerAddress === playerAddress.toLowerCase() && session.startTime > oneHourAgo,
    )

    return recentPlayerSessions.length < 20 // Max 20 games per hour
  }
}
