import { getDefaultWallets } from "@rainbow-me/rainbowkit"
import { configureChains, createConfig } from "wagmi"
import { jsonRpcProvider } from "wagmi/providers/jsonRpc"

// ZenChain Testnet Configuration
export const zenChainTestnet = {
  id: 8408,
  name: "ZenChain Testnet",
  network: "zenchain-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "ZenChain",
    symbol: "ZEN",
  },
  rpcUrls: {
    public: { http: ["https://zenchain-testnet.api.onfinality.io/public"] },
    default: { http: ["https://zenchain-testnet.api.onfinality.io/public"] },
  },
  blockExplorers: {
    default: { name: "ZenChain Explorer", url: "https://zenchain-testnet.blockscout.com" },
  },
  testnet: true,
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [zenChainTestnet],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: chain.rpcUrls.default.http[0],
      }),
    }),
  ],
)

const { connectors } = getDefaultWallets({
  appName: "ZenChain GameFi",
  projectId: "your-project-id", // Replace with your WalletConnect project ID
  chains,
})

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export { chains }

// Contract Addresses (Deploy these to ZenChain testnet)
export const CONTRACT_ADDRESSES = {
  ZC_TOKEN: "0x...", // ZC Token contract address
  ZTC_TOKEN: "0x...", // ZTC Token contract address
  GAME_REWARDS: "0x...", // GameRewards contract address
  ZC_SWAP: "0x...", // ZCSwap contract address
}
