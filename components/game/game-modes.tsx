"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Target, Zap, Users, Clock, Trophy, Crosshair } from "lucide-react"

interface GameModesProps {
  onSelectMode: (mode: string) => void
}

const gameModes = [
  {
    id: "reaction",
    title: "Reaction Arena",
    description: "Test your reflexes by clicking targets as fast as possible",
    icon: Target,
    difficulty: "Easy",
    baseReward: "10-50 ZC",
    duration: "60s",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
  },
  {
    id: "precision",
    title: "Precision Challenge",
    description: "Hit moving targets with pixel-perfect accuracy",
    icon: Crosshair,
    difficulty: "Medium",
    baseReward: "20-80 ZC",
    duration: "90s",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  {
    id: "survival",
    title: "Survival Mode",
    description: "Survive waves of challenges with increasing difficulty",
    icon: Zap,
    difficulty: "Hard",
    baseReward: "50-200 ZC",
    duration: "Until death",
    color: "text-gaming-gold",
    bgColor: "bg-gaming-gold/10",
    borderColor: "border-gaming-gold/20",
  },
  {
    id: "multiplayer",
    title: "Multiplayer Arena",
    description: "Compete against other players in real-time",
    icon: Users,
    difficulty: "Expert",
    baseReward: "100-500 ZC",
    duration: "3 rounds",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
    comingSoon: true,
  },
]

export function GameModes({ onSelectMode }: GameModesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {gameModes.map((mode) => {
        const IconComponent = mode.icon
        return (
          <Card
            key={mode.id}
            className={`game-card hover:scale-105 transition-transform cursor-pointer ${mode.bgColor} ${mode.borderColor}`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <IconComponent className={`h-8 w-8 ${mode.color}`} />
                <div className="flex gap-2">
                  <Badge variant="outline">{mode.difficulty}</Badge>
                  {mode.comingSoon && <Badge variant="secondary">Coming Soon</Badge>}
                </div>
              </div>
              <CardTitle className="text-xl">{mode.title}</CardTitle>
              <CardDescription className="text-base">{mode.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-gaming-gold" />
                  <span>{mode.baseReward}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{mode.duration}</span>
                </div>
              </div>
              <Button
                onClick={() => onSelectMode(mode.id)}
                disabled={mode.comingSoon}
                className="w-full"
                variant={mode.comingSoon ? "secondary" : "default"}
              >
                {mode.comingSoon ? "Coming Soon" : "Play Now"}
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
