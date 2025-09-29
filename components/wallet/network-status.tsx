"use client"

import { useNetwork, useSwitchNetwork } from "wagmi"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Wifi } from "lucide-react"
import { zenChainTestnet } from "@/lib/web3-config"

export function NetworkStatus() {
  const { chain } = useNetwork()
  const { switchNetwork, isLoading, pendingChainId } = useSwitchNetwork()

  if (!chain) {
    return (
      <Alert>
        <Wifi className="h-4 w-4" />
        <AlertDescription>No network detected. Please connect your wallet.</AlertDescription>
      </Alert>
    )
  }

  if (chain.id !== zenChainTestnet.id) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Please switch to ZenChain Testnet to play games and earn rewards.</span>
          <Button
            onClick={() => switchNetwork?.(zenChainTestnet.id)}
            disabled={!switchNetwork || isLoading}
            size="sm"
            variant="outline"
          >
            {isLoading && pendingChainId === zenChainTestnet.id ? "Switching..." : "Switch Network"}
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="border-accent/20 bg-accent/10">
      <CheckCircle className="h-4 w-4 text-accent" />
      <AlertDescription className="text-accent">
        Connected to ZenChain Testnet. Ready to play and earn!
      </AlertDescription>
    </Alert>
  )
}
