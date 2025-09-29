"use client"

import { useState, useCallback } from "react"
import { useAccount } from "wagmi"
import { GameArena } from "./game-arena"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface GameSession {
  sessionId: string
  serverSeed: string
  startTime: number
}

interface GameEvent {
  timestamp: number
  type: "hit" | "miss" | "spawn" | "death" | "powerup"
  data: any
}

export function SecureGameWrapper({ gameMode }: { gameMode: string }) {
  const { address } = useAccount()
  const [gameSession, setGameSession] = useState<GameSession | null>(null)
  const [gameEvents, setGameEvents] = useState<GameEvent[]>([])
  const [isStartingGame, setIsStartingGame] = useState(false)
  const [isSubmittingResult, setIsSubmittingResult] = useState(false)
  const [gameResult, setGameResult] = useState<any>(null)

  // Start a secure game session
  const startSecureGame = async () => {
    if (!address) return

    setIsStartingGame(true)
    try {
      const response = await fetch("/api/game/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerAddress: address,
          gameMode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to start game")
      }

      setGameSession({
        sessionId: data.sessionId,
        serverSeed: data.serverSeed,
        startTime: data.startTime,
      })

      setGameEvents([])
      console.log("[v0] Secure game session started:", data.sessionId)
      toast.success("Secure game session started!")
    } catch (error) {
      console.error("[v0] Error starting secure game:", error)
      toast.error(error instanceof Error ? error.message : "Failed to start game")
    } finally {
      setIsStartingGame(false)
    }
  }

  // Record game events for anti-cheat validation
  const recordGameEvent = useCallback((type: GameEvent["type"], data: any) => {
    const event: GameEvent = {
      timestamp: Date.now(),
      type,
      data,
    }
    setGameEvents((prev) => [...prev, event])
    console.log("[v0] Game event recorded:", event)
  }, [])

  // Submit game result for server validation
  const submitGameResult = async (score: number, kills: number, accuracy: number, survivalTime: number) => {
    if (!gameSession || !address) return

    setIsSubmittingResult(true)
    try {
      const gameResult = {
        sessionId: gameSession.sessionId,
        score,
        kills,
        accuracy,
        survivalTime,
        gameEvents,
        clientHash: generateClientHash(gameSession.sessionId, score),
      }

      const response = await fetch("/api/game/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gameResult),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Game validation failed")
      }

      if (data.verified) {
        setGameResult({
          ...data,
          originalScore: score,
          verifiedScore: data.score,
        })
        toast.success(`Game verified! Score: ${data.score}`)
      } else {
        toast.error("Game validation failed: " + data.reason)
      }
    } catch (error) {
      console.error("[v0] Error submitting game result:", error)
      toast.error(error instanceof Error ? error.message : "Failed to submit result")
    } finally {
      setIsSubmittingResult(false)
    }
  }

  // Claim verified reward
  const claimReward = async () => {
    if (!gameResult || !address) return

    try {
      const response = await fetch("/api/game/claim-reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: gameSession?.sessionId,
          playerAddress: address,
          signature: gameResult.signature,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to claim reward")
      }

      toast.success(data.message)
      setGameResult(null)
      setGameSession(null)
    } catch (error) {
      console.error("[v0] Error claiming reward:", error)
      toast.error(error instanceof Error ? error.message : "Failed to claim reward")
    }
  }

  // Generate client-side hash for additional security
  const generateClientHash = (sessionId: string, score: number): string => {
    return btoa(`${sessionId}:${score}:${Date.now()}`)
  }

  if (!address) {
    return (
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Shield className="h-12 w-12 text-purple-400 mx-auto" />
            <p className="text-gray-300">Connect your wallet to play secure games</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (gameResult) {
    return (
      <Card className="bg-slate-800/50 border-green-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
            Game Verified!
          </CardTitle>
          <CardDescription className="text-gray-300">
            Your game result has been validated by our anti-cheat system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="text-sm text-gray-400">Original Score</div>
              <div className="text-2xl font-bold text-white">{gameResult.originalScore}</div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="text-sm text-gray-400">Verified Score</div>
              <div className="text-2xl font-bold text-green-400">{gameResult.verifiedScore}</div>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-green-400 mb-2">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Security Verified</span>
            </div>
            <p className="text-sm text-gray-300">
              Your gameplay has passed all anti-cheat validations and is eligible for rewards.
            </p>
          </div>

          <Button
            onClick={claimReward}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            Claim ZC Reward
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!gameSession) {
    return (
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="h-5 w-5 mr-2 text-purple-400" />
            Secure Gaming
          </CardTitle>
          <CardDescription className="text-gray-300">
            Start a verified game session with anti-cheat protection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-purple-400 mb-2">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Anti-Cheat Protection</span>
            </div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Server-side score validation</li>
              <li>• Reaction time monitoring</li>
              <li>• Pattern detection algorithms</li>
              <li>• Cryptographic result signing</li>
            </ul>
          </div>

          <Button
            onClick={startSecureGame}
            disabled={isStartingGame}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isStartingGame ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Starting Secure Session...
              </>
            ) : (
              `Start Secure ${gameMode} Game`
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Security Status */}
      <Card className="bg-slate-800/50 border-green-500/20">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-green-400">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Secure Session Active</span>
            </div>
            <div className="text-sm text-gray-400">Session: {gameSession.sessionId.slice(0, 8)}...</div>
          </div>
        </CardContent>
      </Card>

      {/* Game Arena */}
      <GameArena
        gameMode={gameMode}
        onGameEvent={recordGameEvent}
        onGameEnd={submitGameResult}
        isSubmitting={isSubmittingResult}
      />
    </div>
  )
}
