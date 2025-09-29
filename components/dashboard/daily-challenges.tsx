"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Target, Trophy, Zap, Clock, CheckCircle, Lock, Gift } from "lucide-react"

interface Challenge {
  id: string
  title: string
  description: string
  type: "daily" | "weekly" | "special"
  difficulty: "easy" | "medium" | "hard"
  reward: number
  progress: number
  maxProgress: number
  completed: boolean
  expiresAt: string
  icon: React.ComponentType<{ className?: string }>
}

const mockChallenges: Challenge[] = [
  {
    id: "daily_1",
    title: "Quick Reflexes",
    description: "Score 500+ points in Reaction Arena",
    type: "daily",
    difficulty: "easy",
    reward: 25,
    progress: 450,
    maxProgress: 500,
    completed: false,
    expiresAt: "2024-01-08T00:00:00Z",
    icon: Target,
  },
  {
    id: "daily_2",
    title: "Accuracy Master",
    description: "Achieve 90%+ accuracy in any game mode",
    type: "daily",
    difficulty: "medium",
    reward: 40,
    progress: 87,
    maxProgress: 90,
    completed: false,
    expiresAt: "2024-01-08T00:00:00Z",
    icon: Zap,
  },
  {
    id: "daily_3",
    title: "Consistent Player",
    description: "Play 3 games today",
    type: "daily",
    difficulty: "easy",
    reward: 20,
    progress: 3,
    maxProgress: 3,
    completed: true,
    expiresAt: "2024-01-08T00:00:00Z",
    icon: Trophy,
  },
  {
    id: "weekly_1",
    title: "Score Champion",
    description: "Accumulate 5,000 total points this week",
    type: "weekly",
    difficulty: "hard",
    reward: 150,
    progress: 3200,
    maxProgress: 5000,
    completed: false,
    expiresAt: "2024-01-14T00:00:00Z",
    icon: Trophy,
  },
  {
    id: "weekly_2",
    title: "Mode Explorer",
    description: "Play each game mode at least once this week",
    type: "weekly",
    difficulty: "medium",
    reward: 75,
    progress: 2,
    maxProgress: 3,
    completed: false,
    expiresAt: "2024-01-14T00:00:00Z",
    icon: Target,
  },
  {
    id: "special_1",
    title: "New Year Bonus",
    description: "Score 1000+ points in a single game",
    type: "special",
    difficulty: "hard",
    reward: 200,
    progress: 0,
    maxProgress: 1000,
    completed: false,
    expiresAt: "2024-01-31T23:59:59Z",
    icon: Gift,
  },
]

export function DailyChallenges() {
  const [selectedType, setSelectedType] = useState<"all" | "daily" | "weekly" | "special">("all")

  const filteredChallenges = mockChallenges.filter((challenge) =>
    selectedType === "all" ? true : challenge.type === selectedType,
  )

  const completedChallenges = mockChallenges.filter((c) => c.completed).length
  const totalRewards = mockChallenges.filter((c) => c.completed).reduce((sum, c) => sum + c.reward, 0)
  const availableRewards = mockChallenges.filter((c) => !c.completed).reduce((sum, c) => sum + c.reward, 0)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-accent border-accent"
      case "medium":
        return "text-primary border-primary"
      case "hard":
        return "text-destructive border-destructive"
      default:
        return "text-muted-foreground border-muted-foreground"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "daily":
        return "text-accent border-accent bg-accent/10"
      case "weekly":
        return "text-primary border-primary bg-primary/10"
      case "special":
        return "text-gaming-gold border-gaming-gold bg-gaming-gold/10"
      default:
        return "text-muted-foreground border-muted-foreground"
    }
  }

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expires = new Date(expiresAt)
    const diff = expires.getTime() - now.getTime()

    if (diff <= 0) return "Expired"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days}d ${hours % 24}h`
    }

    return `${hours}h ${minutes}m`
  }

  return (
    <div className="space-y-6">
      {/* Challenge Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="game-card">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">{completedChallenges}</div>
            <div className="text-sm text-muted-foreground">Completed Today</div>
          </CardContent>
        </Card>

        <Card className="game-card">
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-gaming-gold mx-auto mb-2" />
            <div className="text-2xl font-bold">{totalRewards}</div>
            <div className="text-sm text-muted-foreground">ZC Earned</div>
          </CardContent>
        </Card>

        <Card className="game-card">
          <CardContent className="p-4 text-center">
            <Gift className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{availableRewards}</div>
            <div className="text-sm text-muted-foreground">ZC Available</div>
          </CardContent>
        </Card>
      </div>

      {/* Challenge Filters */}
      <Card className="game-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Daily Challenges
              </CardTitle>
              <CardDescription>Complete challenges to earn bonus ZC tokens</CardDescription>
            </div>
            <div className="flex gap-2">
              {["all", "daily", "weekly", "special"].map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type as any)}
                  className="capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Challenge List */}
      <div className="space-y-4">
        {filteredChallenges.map((challenge) => {
          const IconComponent = challenge.icon
          const progressPercentage = (challenge.progress / challenge.maxProgress) * 100

          return (
            <Card key={challenge.id} className={`game-card ${challenge.completed ? "opacity-75" : ""}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-2 rounded-lg ${challenge.completed ? "bg-accent/20" : "bg-muted/20"}`}>
                      {challenge.completed ? (
                        <CheckCircle className="h-6 w-6 text-accent" />
                      ) : (
                        <IconComponent className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{challenge.title}</h3>
                        <Badge variant="outline" className={getTypeColor(challenge.type)}>
                          {challenge.type}
                        </Badge>
                        <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground mb-4">{challenge.description}</p>

                      {!challenge.completed && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>
                              {challenge.progress.toLocaleString()} / {challenge.maxProgress.toLocaleString()}
                            </span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                        </div>
                      )}

                      <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeRemaining(challenge.expiresAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          <span>+{challenge.reward} ZC</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {challenge.completed ? (
                      <Badge variant="outline" className="text-accent border-accent">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    ) : progressPercentage >= 100 ? (
                      <Button size="sm" className="glow-effect">
                        Claim Reward
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-primary border-primary">
                        <Lock className="h-3 w-3 mr-1" />
                        In Progress
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredChallenges.length === 0 && (
        <Card className="game-card">
          <CardContent className="p-12 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No challenges available for the selected filter</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
