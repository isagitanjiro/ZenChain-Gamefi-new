import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo (use Redis/database in production)
const verifiedResults = new Map<string, any>()
const claimedRewards = new Set<string>()

export async function POST(request: NextRequest) {
  try {
    const { sessionId, playerAddress, signature } = await request.json()

    if (!sessionId || !playerAddress || !signature) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get verified result
    const verifiedResult = verifiedResults.get(sessionId)
    if (!verifiedResult) {
      return NextResponse.json({ error: "No verified result found for this session" }, { status: 404 })
    }

    // Check if reward already claimed
    if (claimedRewards.has(sessionId)) {
      return NextResponse.json({ error: "Reward already claimed for this session" }, { status: 400 })
    }

    // Verify player address matches
    if (verifiedResult.playerAddress !== playerAddress.toLowerCase()) {
      return NextResponse.json({ error: "Player address mismatch" }, { status: 403 })
    }

    // Verify signature
    if (verifiedResult.signature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 })
    }

    // Calculate reward based on score
    const baseReward = Math.floor(verifiedResult.score / 10) // 1 ZC per 10 points
    const bonusMultiplier = verifiedResult.gameMode === "survival" ? 1.5 : 1.0
    const finalReward = Math.floor(baseReward * bonusMultiplier)

    // Mark as claimed
    claimedRewards.add(sessionId)

    console.log("[v0] Reward claimed successfully:", {
      sessionId,
      playerAddress,
      reward: finalReward,
    })

    // In production, this would trigger the smart contract to mint tokens
    return NextResponse.json({
      success: true,
      reward: finalReward,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock transaction hash
      message: `Successfully claimed ${finalReward} ZC tokens!`,
    })
  } catch (error) {
    console.error("[v0] Error claiming reward:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
