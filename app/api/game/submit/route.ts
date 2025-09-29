import { type NextRequest, NextResponse } from "next/server"
import { AntiCheatSystem } from "@/lib/anti-cheat"

// In-memory storage for demo (use Redis/database in production)
const activeSessions = new Map<string, any>()
const verifiedResults = new Map<string, any>()

export async function POST(request: NextRequest) {
  try {
    const gameResult = await request.json()

    if (!gameResult.sessionId) {
      return NextResponse.json({ error: "Missing session ID" }, { status: 400 })
    }

    // Get session data
    const session = activeSessions.get(gameResult.sessionId)
    if (!session) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 404 })
    }

    console.log("[v0] Validating game result for session:", gameResult.sessionId)

    // Validate the game result
    const validation = AntiCheatSystem.validateGameResult(gameResult, session)

    if (!validation.isValid) {
      console.log("[v0] Game result validation failed:", validation.reason)
      return NextResponse.json(
        {
          error: "Game result validation failed",
          reason: validation.reason,
          verified: false,
          score: 0,
        },
        { status: 400 },
      )
    }

    // Store verified result
    const verifiedResult = {
      sessionId: gameResult.sessionId,
      playerAddress: session.playerAddress,
      score: validation.score,
      signature: validation.signature,
      timestamp: Date.now(),
      gameMode: session.gameMode,
    }

    verifiedResults.set(gameResult.sessionId, verifiedResult)

    // Clean up session
    activeSessions.delete(gameResult.sessionId)

    console.log("[v0] Game result verified and stored")

    return NextResponse.json({
      verified: true,
      score: validation.score,
      signature: validation.signature,
      rewardEligible: true,
    })
  } catch (error) {
    console.error("[v0] Error submitting game result:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
