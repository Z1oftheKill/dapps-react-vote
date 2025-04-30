import MainLayout from './layout'
import { http, createConfig, WagmiProvider } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http()
  }
})
const App: React.FC = () => {
  return (
    <WagmiProvider config={config}>
      <MainLayout></MainLayout>
    </WagmiProvider>
  )
}

export default App
