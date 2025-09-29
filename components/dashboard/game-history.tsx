"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { History, Search, Filter, Trophy, Target, Zap, Calendar, ExternalLink } from "lucide-react"

interface GameRecord {
  id: string
  mode: string
  score: number
  accuracy: number
  duration: number
  reward: number
  timestamp: string
  rank?: number
}

const mockGameHistory: GameRecord[] = [
  {
    id: "game_001",
    mode: "Reaction Arena",
    score: 720,
    accuracy: 85.2,
    duration: 60,
    reward: 72,
    timestamp: "2024-01-07T14:30:00Z",
    rank: 15,
  },
  {
    id: "game_002",
    mode: "Precision Challenge",
    score: 580,
    accuracy: 92.1,
    duration: 90,
    reward: 58,
    timestamp: "2024-01-06T16:45:00Z",
    rank: 23,
  },
  {
    id: "game_003",
    mode: "Survival Mode",
    score: 1250,
    accuracy: 78.9,
    duration: 180,
    reward: 125,
    timestamp: "2024-01-05T19:20:00Z",
    rank: 8,
  },
  {
    id: "game_004",
    mode: "Reaction Arena",
    score: 640,
    accuracy: 88.7,
    duration: 60,
    reward: 64,
    timestamp: "2024-01-05T12:15:00Z",
    rank: 19,
  },
  {
    id: "game_005",
    mode: "Precision Challenge",
    score: 420,
    accuracy: 95.3,
    duration: 90,
    reward: 42,
    timestamp: "2024-01-04T20:30:00Z",
    rank: 35,
  },
]

export function GameHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterMode, setFilterMode] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date")

  const filteredHistory = mockGameHistory
    .filter((game) => {
      const matchesSearch = game.mode.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterMode === "all" || game.mode === filterMode
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.score - a.score
        case "reward":
          return b.reward - a.reward
        case "accuracy":
          return b.accuracy - a.accuracy
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      }
    })

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`
  }

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "Reaction Arena":
        return <Target className="h-4 w-4 text-accent" />
      case "Precision Challenge":
        return <Zap className="h-4 w-4 text-primary" />
      case "Survival Mode":
        return <Trophy className="h-4 w-4 text-gaming-gold" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const totalGames = mockGameHistory.length
  const totalScore = mockGameHistory.reduce((sum, game) => sum + game.score, 0)
  const totalRewards = mockGameHistory.reduce((sum, game) => sum + game.reward, 0)
  const averageAccuracy = mockGameHistory.reduce((sum, game) => sum + game.accuracy, 0) / totalGames

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="game-card">
          <CardContent className="p-4 text-center">
            <History className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{totalGames}</div>
            <div className="text-sm text-muted-foreground">Total Games</div>
          </CardContent>
        </Card>

        <Card className="game-card">
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-gaming-gold mx-auto mb-2" />
            <div className="text-2xl font-bold">{totalScore.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Score</div>
          </CardContent>
        </Card>

        <Card className="game-card">
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">{totalRewards}</div>
            <div className="text-sm text-muted-foreground">ZC Earned</div>
          </CardContent>
        </Card>

        <Card className="game-card">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-neon-green mx-auto mb-2" />
            <div className="text-2xl font-bold">{averageAccuracy.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Avg Accuracy</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Game History
          </CardTitle>
          <CardDescription>View and analyze your past game performances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterMode} onValueChange={setFilterMode}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="Reaction Arena">Reaction Arena</SelectItem>
                <SelectItem value="Precision Challenge">Precision Challenge</SelectItem>
                <SelectItem value="Survival Mode">Survival Mode</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="score">Score</SelectItem>
                <SelectItem value="reward">Reward</SelectItem>
                <SelectItem value="accuracy">Accuracy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Game Records */}
          <div className="space-y-3">
            {filteredHistory.map((game) => (
              <div
                key={game.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border/40 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {getModeIcon(game.mode)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{game.mode}</span>
                      {game.rank && game.rank <= 10 && (
                        <Badge variant="outline" className="text-gaming-gold border-gaming-gold">
                          Top {game.rank}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(game.timestamp)}
                      </span>
                      <span>{formatDuration(game.duration)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <div className="font-bold text-lg">{game.score.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{game.accuracy}% accuracy</div>
                  </div>
                  <div>
                    <div className="font-medium text-accent">+{game.reward} ZC</div>
                    {game.rank && <div className="text-sm text-muted-foreground">Rank #{game.rank}</div>}
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredHistory.length === 0 && (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No games found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
