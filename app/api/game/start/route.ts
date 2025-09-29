import { type NextRequest, NextResponse } from "next/server"
import { AntiCheatSystem } from "@/lib/anti-cheat"

// In-memory storage for demo (use Redis/database in production)
const activeSessions = new Map<string, any>()

export async function POST(request: NextRequest) {
  try {
    const { playerAddress, gameMode } = await request.json()

    if (!playerAddress || !gameMode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check rate limiting
    const recentSessions = Array.from(activeSessions.values())
    if (!AntiCheatSystem.checkRateLimit(playerAddress, recentSessions)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait before starting a new game." },
        { status: 429 },
      )
    }

    // Generate secure game session
    const session = AntiCheatSystem.generateGameSession(playerAddress, gameMode)

    // Store session (use Redis/database in production)
    activeSessions.set(session.sessionId, session)

    console.log("[v0] Game session started:", session.sessionId)

    return NextResponse.json({
      sessionId: session.sessionId,
      serverSeed: session.serverSeed,
      startTime: session.startTime,
    })
  } catch (error) {
    console.error("[v0] Error starting game session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
