"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Zap, TrendingUp, Clock, Award } from "lucide-react"

interface GameStatsProps {
  playerStats?: {
    totalScore: number
    gamesPlayed: number
    bestScore: number
    accuracy: number
    zcEarned: number
  }
}

export function GameStats({ playerStats }: GameStatsProps) {
  const stats = playerStats || {
    totalScore: 12450,
    gamesPlayed: 87,
    bestScore: 2850,
    accuracy: 78.5,
    zcEarned: 1250,
  }

  const averageScore = stats.gamesPlayed > 0 ? Math.floor(stats.totalScore / stats.gamesPlayed) : 0

  return (
    <div className="space-y-4">
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-gaming-gold" />
            Player Stats
          </CardTitle>
          <CardDescription>Your gaming performance overview</CardDescription>
        </CardHeader>
      </Card>

      <Card className="game-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Score</span>
            </div>
            <Badge variant="outline" className="text-primary border-primary">
              {stats.totalScore.toLocaleString()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="game-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">ZC Earned</span>
            </div>
            <Badge variant="outline" className="text-accent border-accent">
              {stats.zcEarned} ZC
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="game-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Games Played</span>
            </div>
            <Badge variant="secondary">{stats.gamesPlayed}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="game-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gaming-gold" />
              <span className="text-sm font-medium">Average Score</span>
            </div>
            <Badge variant="outline" className="text-gaming-gold border-gaming-gold">
              {averageScore.toLocaleString()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badges */}
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Award className="h-4 w-4 text-gaming-gold" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          {stats.gamesPlayed >= 1 && (
            <Badge variant="outline" className="text-xs">
              🎮 First Game
            </Badge>
          )}
          {stats.gamesPlayed >= 10 && (
            <Badge variant="outline" className="text-xs">
              🔥 Veteran Player
            </Badge>
          )}
          {stats.totalScore >= 1000 && (
            <Badge variant="outline" className="text-xs">
              🎯 Sharpshooter
            </Badge>
          )}
          {stats.zcEarned >= 100 && (
            <Badge variant="outline" className="text-xs">
              💰 Token Collector
            </Badge>
          )}
          {stats.gamesPlayed === 0 && (
            <p className="text-xs text-muted-foreground">Play games to unlock achievements!</p>
          )}
        </CardContent>
      </Card>

      {/* Daily Challenge */}
      <Card className="game-card border-accent/20 bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm text-accent">
            <Zap className="h-4 w-4" />
            Daily Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-2">Score 500+ points in a single game</p>
          <Badge variant="outline" className="text-xs text-accent border-accent">
            +50 ZC Bonus
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}
