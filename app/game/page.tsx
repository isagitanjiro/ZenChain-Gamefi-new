"use client"

import { useState } from "react"
import { GameArena } from "@/components/game/game-arena"
import { GameStats } from "@/components/game/game-stats"
import { GameModes } from "@/components/game/game-modes"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GamepadIcon, Zap, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function GamePage() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerStats, setPlayerStats] = useState({
    totalScore: 12450,
    gamesPlayed: 87,
    bestScore: 2850,
    accuracy: 78.5,
    zcEarned: 1250,
  })

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <GamepadIcon className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">ZenChain GameFi</span>
            </Link>
            <Badge variant="secondary" className="ml-2 neon-border bg-primary/10">
              <Zap className="mr-1 h-3 w-3" />
              Live
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-right">
              <div className="font-medium">{playerStats.zcEarned} ZC</div>
              <div className="text-muted-foreground">Earned</div>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="neon-border bg-transparent">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container pb-8">
        {!selectedMode ? (
          <div className="space-y-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight mb-4">Choose Your Game Mode</h1>
              <p className="text-lg text-muted-foreground">
                Select a game mode to start earning ZC tokens based on your performance
              </p>
            </div>
            <GameModes onSelectMode={setSelectedMode} />

            {/* Player Stats Preview */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
              <Card className="game-card text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">{playerStats.totalScore.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Score</div>
                </CardContent>
              </Card>
              <Card className="game-card text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-accent">{playerStats.gamesPlayed}</div>
                  <div className="text-sm text-muted-foreground">Games Played</div>
                </CardContent>
              </Card>
              <Card className="game-card text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-gaming-gold">{playerStats.bestScore.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Best Score</div>
                </CardContent>
              </Card>
              <Card className="game-card text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-neon-purple">{playerStats.accuracy}%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </CardContent>
              </Card>
              <Card className="game-card text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">{playerStats.zcEarned}</div>
                  <div className="text-sm text-muted-foreground">ZC Earned</div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="py-8">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedMode(null)}
                className="neon-border bg-transparent"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Modes
              </Button>
              <h1 className="text-2xl font-bold capitalize">{selectedMode} Arena</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <GameArena
                  gameMode={selectedMode}
                  onGameEnd={(score, hits, accuracy, survivalTime) => {
                    const zcReward = Math.floor(score / 10)
                    setPlayerStats((prev) => ({
                      ...prev,
                      totalScore: prev.totalScore + score,
                      gamesPlayed: prev.gamesPlayed + 1,
                      bestScore: Math.max(prev.bestScore, score),
                      zcEarned: prev.zcEarned + zcReward,
                    }))
                  }}
                />
              </div>
              <div className="lg:col-span-1">
                <GameStats playerStats={playerStats} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
