"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Trophy, Target, Zap, TrendingUp, Calendar, Award, Edit } from "lucide-react"
import { usePlayerStats } from "@/hooks/use-contract-read"
import { formatEther } from "viem"

// Mock performance data
const performanceData = [
  { date: "2024-01-01", score: 450, earnings: 45 },
  { date: "2024-01-02", score: 520, earnings: 52 },
  { date: "2024-01-03", score: 380, earnings: 38 },
  { date: "2024-01-04", score: 680, earnings: 68 },
  { date: "2024-01-05", score: 590, earnings: 59 },
  { date: "2024-01-06", score: 720, earnings: 72 },
  { date: "2024-01-07", score: 640, earnings: 64 },
]

const gameTypeStats = [
  { type: "Reaction", games: 25, avgScore: 580, totalEarnings: 145 },
  { type: "Precision", games: 18, avgScore: 420, totalEarnings: 126 },
  { type: "Survival", games: 12, avgScore: 750, totalEarnings: 180 },
]

export function PlayerProfile() {
  const { address } = useAccount()
  const { data: playerStats, isLoading } = usePlayerStats(address)
  const [selectedChart, setSelectedChart] = useState<"performance" | "gameTypes">("performance")

  const stats = playerStats
    ? {
        totalScore: Number(playerStats[1]),
        totalEarnings: Number.parseFloat(formatEther(playerStats[2])),
        gamesPlayed: Number(playerStats[3]),
      }
    : { totalScore: 0, totalEarnings: 0, gamesPlayed: 0 }

  const averageScore = stats.gamesPlayed > 0 ? Math.floor(stats.totalScore / stats.gamesPlayed) : 0
  const level = Math.floor(stats.totalScore / 1000) + 1
  const nextLevelProgress = ((stats.totalScore % 1000) / 1000) * 100

  const achievements = [
    { id: "first_game", name: "First Steps", description: "Play your first game", unlocked: stats.gamesPlayed >= 1 },
    { id: "veteran", name: "Veteran Player", description: "Play 10 games", unlocked: stats.gamesPlayed >= 10 },
    { id: "sharpshooter", name: "Sharpshooter", description: "Score 1000+ points", unlocked: stats.totalScore >= 1000 },
    { id: "collector", name: "Token Collector", description: "Earn 100+ ZC", unlocked: stats.totalEarnings >= 100 },
    { id: "consistent", name: "Consistent", description: "Play 5 days in a row", unlocked: false },
    { id: "high_scorer", name: "High Scorer", description: "Score 800+ in a single game", unlocked: false },
  ]

  const unlockedAchievements = achievements.filter((a) => a.unlocked)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="game-card animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-muted rounded-full" />
              <div className="flex-1">
                <div className="h-6 bg-muted rounded w-1/3 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="game-card">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-xl font-bold">
                  {address?.slice(2, 4).toUpperCase() || "??"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Unknown Player"}
                </h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Level {level}</span>
                  <span>•</span>
                  <span>{stats.gamesPlayed} games played</span>
                  <span>•</span>
                  <span>Member since Jan 2024</span>
                </div>
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">Level Progress</span>
                    <Badge variant="outline" className="text-xs">
                      {stats.totalScore % 1000}/1000 XP
                    </Badge>
                  </div>
                  <Progress value={nextLevelProgress} className="w-48" />
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="neon-border bg-transparent">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="game-card">
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-gaming-gold mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalScore.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Score</div>
          </CardContent>
        </Card>

        <Card className="game-card">
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalEarnings.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">ZC Earned</div>
          </CardContent>
        </Card>

        <Card className="game-card">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{averageScore}</div>
            <div className="text-sm text-muted-foreground">Avg Score</div>
          </CardContent>
        </Card>

        <Card className="game-card">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-neon-green mx-auto mb-2" />
            <div className="text-2xl font-bold">{level}</div>
            <div className="text-sm text-muted-foreground">Current Level</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <Card className="game-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Performance Analytics</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={selectedChart === "performance" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedChart("performance")}
              >
                Performance
              </Button>
              <Button
                variant={selectedChart === "gameTypes" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedChart("gameTypes")}
              >
                Game Types
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {selectedChart === "performance" ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgb(var(--card))",
                      border: "1px solid rgb(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gameTypeStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="type" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgb(var(--card))",
                      border: "1px solid rgb(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="avgScore" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-gaming-gold" />
            Achievements ({unlockedAchievements.length}/{achievements.length})
          </CardTitle>
          <CardDescription>Unlock achievements by playing games and reaching milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border transition-all ${
                  achievement.unlocked
                    ? "bg-accent/10 border-accent/20 text-accent"
                    : "bg-muted/10 border-muted/20 text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Award className={`h-4 w-4 ${achievement.unlocked ? "text-accent" : "text-muted-foreground"}`} />
                  <span className="font-medium">{achievement.name}</span>
                  {achievement.unlocked && (
                    <Badge variant="secondary" className="text-xs">
                      Unlocked
                    </Badge>
                  )}
                </div>
                <p className="text-sm">{achievement.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "Completed Reaction Arena", score: 720, reward: 72, time: "2 hours ago" },
              { action: "Unlocked Achievement: Sharpshooter", score: null, reward: 50, time: "1 day ago" },
              { action: "Completed Precision Challenge", score: 580, reward: 58, time: "2 days ago" },
              { action: "Daily Challenge Completed", score: null, reward: 25, time: "3 days ago" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
                <div className="text-right">
                  {activity.score && <p className="font-medium">{activity.score} points</p>}
                  <p className="text-sm text-accent">+{activity.reward} ZC</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
