"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, RotateCcw, TargetIcon, Zap } from "lucide-react"
import { toast } from "sonner"

interface GameArenaProps {
  gameMode: string
  onGameEnd?: (score: number, hits: number, accuracy: number, survivalTime: number) => void
}

interface Target {
  id: string
  x: number
  y: number
  size: number
  color: string
  points: number
}

interface GameState {
  score: number
  hits: number
  misses: number
  timeLeft: number
  combo: number
  targets: Target[]
}

const GAME_DURATION = 60
const TARGET_SPAWN_RATE = 1000
const TARGET_LIFETIME = 3000

export function GameArena({ gameMode, onGameEnd }: GameArenaProps) {
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const gameLoopRef = useRef<NodeJS.Timeout>()
  const targetSpawnRef = useRef<NodeJS.Timeout>()

  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    hits: 0,
    misses: 0,
    timeLeft: GAME_DURATION,
    combo: 0,
    targets: [],
  })

  const [gameStarted, setGameStarted] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)

  const generateTarget = useCallback((): Target => {
    const colors = [
      "rgb(34, 197, 94)",
      "rgb(59, 130, 246)",
      "rgb(251, 191, 36)",
      "rgb(239, 68, 68)",
      "rgb(147, 51, 234)",
    ]
    const sizes = [40, 50, 60, 30]
    const size = sizes[Math.floor(Math.random() * sizes.length)]
    const points = size === 30 ? 50 : size === 40 ? 30 : size === 50 ? 20 : 10

    return {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * ((gameAreaRef.current?.clientWidth || 800) - size),
      y: Math.random() * ((gameAreaRef.current?.clientHeight || 400) - size),
      size,
      color: colors[Math.floor(Math.random() * colors.length)],
      points,
    }
  }, [])

  const spawnTarget = useCallback(() => {
    if (!gameStarted || gameEnded) return
    setGameState((prev) => ({
      ...prev,
      targets: [...prev.targets, generateTarget()],
    }))
  }, [gameStarted, gameEnded, generateTarget])

  const hitTarget = useCallback((targetId: string) => {
    setGameState((prev) => {
      const target = prev.targets.find((t) => t.id === targetId)
      if (!target) return prev

      const newCombo = prev.combo + 1
      const comboMultiplier = Math.floor(newCombo / 5) + 1
      const points = target.points * comboMultiplier

      toast.success(`Hit! +${points} points${newCombo > 1 ? ` (${newCombo}x combo)` : ""}`)

      return {
        ...prev,
        score: prev.score + points,
        hits: prev.hits + 1,
        combo: newCombo,
        targets: prev.targets.filter((t) => t.id !== targetId),
      }
    })
  }, [])

  const missTarget = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      misses: prev.misses + 1,
      combo: 0,
    }))
    toast.error("Miss! Combo reset")
  }, [])

  const startGame = useCallback(() => {
    setGameStarted(true)
    setGameEnded(false)
    setGameState({
      score: 0,
      hits: 0,
      misses: 0,
      timeLeft: GAME_DURATION,
      combo: 0,
      targets: [],
    })

    gameLoopRef.current = setInterval(() => {
      setGameState((prev) => {
        if (prev.timeLeft <= 1) {
          return { ...prev, timeLeft: 0 }
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 }
      })
    }, 1000)

    targetSpawnRef.current = setInterval(spawnTarget, TARGET_SPAWN_RATE)
  }, [spawnTarget])

  const endGame = useCallback(() => {
    setGameStarted(false)
    setGameEnded(true)

    if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    if (targetSpawnRef.current) clearInterval(targetSpawnRef.current)

    const accuracy = gameState.hits + gameState.misses > 0 ? gameState.hits / (gameState.hits + gameState.misses) : 0
    const survivalTime = GAME_DURATION - gameState.timeLeft

    onGameEnd?.(gameState.score, gameState.hits, accuracy, survivalTime)

    const zcReward = Math.floor(gameState.score / 10)
    toast.success(`Game Complete! Earned ${zcReward} ZC tokens`)
  }, [gameState, onGameEnd])

  const resetGame = useCallback(() => {
    setGameStarted(false)
    setGameEnded(false)
    setGameState({
      score: 0,
      hits: 0,
      misses: 0,
      timeLeft: GAME_DURATION,
      combo: 0,
      targets: [],
    })

    if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    if (targetSpawnRef.current) clearInterval(targetSpawnRef.current)
  }, [])

  useEffect(() => {
    if (gameState.timeLeft === 0 && gameStarted) {
      endGame()
    }
  }, [gameState.timeLeft, gameStarted, endGame])

  useEffect(() => {
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
      if (targetSpawnRef.current) clearInterval(targetSpawnRef.current)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prev) => ({
        ...prev,
        targets: prev.targets.filter(() => Math.random() > 0.15),
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const accuracy =
    gameState.hits + gameState.misses > 0 ? (gameState.hits / (gameState.hits + gameState.misses)) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Game Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="game-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{gameState.timeLeft}s</div>
            <div className="text-sm text-muted-foreground">Time Left</div>
          </CardContent>
        </Card>
        <Card className="game-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">{gameState.hits}</div>
            <div className="text-sm text-muted-foreground">Hits</div>
          </CardContent>
        </Card>
        <Card className="game-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{gameState.misses}</div>
            <div className="text-sm text-muted-foreground">Misses</div>
          </CardContent>
        </Card>
        <Card className="game-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gaming-gold">{accuracy.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </CardContent>
        </Card>
      </div>

      {/* Score and Combo */}
      <Card className="game-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Score: {gameState.score.toLocaleString()}</CardTitle>
            {gameState.combo > 0 && (
              <Badge variant="outline" className="text-gaming-gold border-gaming-gold glow-effect">
                Combo x{gameState.combo}
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Game Area */}
      <Card className="game-card">
        <CardContent className="p-0">
          <div
            ref={gameAreaRef}
            className="relative w-full h-96 game-arena rounded-lg overflow-hidden cursor-crosshair"
            onClick={(e) => {
              if (gameStarted && !gameEnded) {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top

                const hitTargetId = gameState.targets.find((target) => {
                  const distance = Math.sqrt(
                    (x - target.x - target.size / 2) ** 2 + (y - target.y - target.size / 2) ** 2,
                  )
                  return distance <= target.size / 2
                })?.id

                if (hitTargetId) {
                  hitTarget(hitTargetId)
                } else {
                  missTarget()
                }
              }
            }}
          >
            {/* Targets */}
            {gameState.targets.map((target) => (
              <div
                key={target.id}
                className="absolute rounded-full cursor-pointer transition-all hover:scale-110 target-spawn"
                style={{
                  left: target.x,
                  top: target.y,
                  width: target.size,
                  height: target.size,
                  backgroundColor: target.color,
                  boxShadow: `0 0 20px ${target.color}40`,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  hitTarget(target.id)
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                  {target.points}
                </div>
              </div>
            ))}

            {/* Game State Overlays */}
            {!gameStarted && !gameEnded && (
              <div className="absolute inset-0 flex items-center justify-center glass-effect">
                <div className="text-center space-y-4">
                  <TargetIcon className="h-16 w-16 text-primary mx-auto animate-float" />
                  <h3 className="text-2xl font-bold">Ready to Play?</h3>
                  <p className="text-muted-foreground">Click targets to earn points and ZC tokens</p>
                  <Button onClick={startGame} size="lg" className="glow-effect">
                    <Play className="mr-2 h-4 w-4" />
                    Start Game
                  </Button>
                </div>
              </div>
            )}

            {gameEnded && (
              <div className="absolute inset-0 flex items-center justify-center glass-effect">
                <div className="text-center space-y-4">
                  <Zap className="h-16 w-16 text-gaming-gold mx-auto animate-float" />
                  <h3 className="text-2xl font-bold">Game Complete!</h3>
                  <div className="space-y-2">
                    <p className="text-lg">
                      Final Score: <span className="text-primary font-bold">{gameState.score.toLocaleString()}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Accuracy: {accuracy.toFixed(1)}% ({gameState.hits} hits, {gameState.misses} misses)
                    </p>
                    <p className="text-sm text-gaming-gold">Earned: {Math.floor(gameState.score / 10)} ZC tokens</p>
                  </div>
                  <Button onClick={resetGame} variant="outline" className="neon-border bg-transparent">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Play Again
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Bar */}
      {gameStarted && !gameEnded && (
        <Card className="game-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Game Progress</span>
              <span className="text-sm text-muted-foreground">
                {GAME_DURATION - gameState.timeLeft}s / {GAME_DURATION}s
              </span>
            </div>
            <Progress value={((GAME_DURATION - gameState.timeLeft) / GAME_DURATION) * 100} className="h-2" />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
