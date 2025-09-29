"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, TrendingUp, Clock, Coins } from "lucide-react"
import { useTopPlayers, usePlayerStats } from "@/hooks/use-contract-read"

interface LeaderboardEntry {
  rank: number
  address: string
  totalScore: number
  totalEarnings: number
  gamesPlayed: number
  averageScore: number
}

export function Leaderboard() {
  const { address } = useAccount()
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "all">("all")
  const { data: topPlayersData, isLoading } = useTopPlayers(50)
  const { data: playerStats } = usePlayerStats(address)

  // Mock data for demonstration - in real app, this would come from the contract
  const mockLeaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      address: "0x1234...5678",
      totalScore: 15420,
      totalEarnings: 1542,
      gamesPlayed: 45,
      averageScore: 342,
    },
    {
      rank: 2,
      address: "0x2345...6789",
      totalScore: 14890,
      totalEarnings: 1489,
      gamesPlayed: 52,
      averageScore: 286,
    },
    {
      rank: 3,
      address: "0x3456...7890",
      totalScore: 13750,
      totalEarnings: 1375,
      gamesPlayed: 38,
      averageScore: 362,
    },
    {
      rank: 4,
      address: "0x4567...8901",
      totalScore: 12980,
      totalEarnings: 1298,
      gamesPlayed: 41,
      averageScore: 316,
    },
    {
      rank: 5,
      address: "0x5678...9012",
      totalScore: 11650,
      totalEarnings: 1165,
      gamesPlayed: 35,
      averageScore: 333,
    },
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-gaming-gold" />
      case 2:
        return <Medal className="h-5 w-5 text-gaming-silver" />
      case 3:
        return <Award className="h-5 w-5 text-gaming-bronze" />
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getRankCardClass = (rank: number) => {
    switch (rank) {
      case 1:
        return "leaderboard-gold"
      case 2:
        return "leaderboard-silver"
      case 3:
        return "leaderboard-bronze"
      default:
        return "game-card"
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const currentPlayerRank = mockLeaderboardData.findIndex((entry) => entry.address === address) + 1

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="game-card animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-muted rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
                <div className="h-6 bg-muted rounded w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Timeframe Selector */}
      <Card className="game-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-gaming-gold" />
                Global Leaderboard
              </CardTitle>
              <CardDescription>Top players ranked by total score and performance</CardDescription>
            </div>
            <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as "daily" | "weekly" | "all")}>
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="all">All Time</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
      </Card>

      {/* Current Player Rank */}
      {currentPlayerRank > 0 && (
        <Card className="game-card border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                  <span className="text-sm font-bold text-primary">#{currentPlayerRank}</span>
                </div>
                <div>
                  <p className="font-medium">Your Current Rank</p>
                  <p className="text-sm text-muted-foreground">
                    {formatAddress(address || "")} •{" "}
                    {mockLeaderboardData[currentPlayerRank - 1]?.totalScore.toLocaleString()} points
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-primary border-primary">
                Top {Math.round((currentPlayerRank / mockLeaderboardData.length) * 100)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockLeaderboardData.slice(0, 3).map((entry) => (
          <Card key={entry.rank} className={getRankCardClass(entry.rank)}>
            <CardContent className="p-6 text-center">
              <div className="mb-4">{getRankIcon(entry.rank)}</div>
              <Avatar className="h-16 w-16 mx-auto mb-4">
                <AvatarFallback className="text-lg font-bold">{entry.address.slice(2, 4).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-lg mb-1">{formatAddress(entry.address)}</h3>
              <p className="text-2xl font-bold text-primary mb-2">{entry.totalScore.toLocaleString()}</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-1">
                  <Coins className="h-3 w-3" />
                  <span>{entry.totalEarnings} ZC</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>Avg: {entry.averageScore}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Leaderboard */}
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="text-lg">Full Rankings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {mockLeaderboardData.map((entry, index) => (
              <div
                key={entry.address}
                className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${
                  entry.address === address ? "bg-primary/10 border-l-4 border-primary" : ""
                }`}
              >
                <div className="flex items-center justify-center w-8 h-8">
                  {entry.rank <= 3 ? getRankIcon(entry.rank) : <span className="text-sm font-bold">#{entry.rank}</span>}
                </div>

                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-sm font-bold">
                    {entry.address.slice(2, 4).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatAddress(entry.address)}</span>
                    {entry.address === address && (
                      <Badge variant="outline" className="text-xs">
                        You
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{entry.gamesPlayed} games</span>
                    <span>Avg: {entry.averageScore}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-lg">{entry.totalScore.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">{entry.totalEarnings} ZC</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="game-card">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">{mockLeaderboardData.length}</div>
            <div className="text-sm text-muted-foreground">Active Players</div>
          </CardContent>
        </Card>

        <Card className="game-card">
          <CardContent className="p-4 text-center">
            <Coins className="h-8 w-8 text-gaming-gold mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {mockLeaderboardData.reduce((sum, entry) => sum + entry.totalEarnings, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total ZC Distributed</div>
          </CardContent>
        </Card>

        <Card className="game-card">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {Math.round(
                mockLeaderboardData.reduce((sum, entry) => sum + entry.gamesPlayed, 0) / mockLeaderboardData.length,
              )}
            </div>
            <div className="text-sm text-muted-foreground">Avg Games/Player</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
