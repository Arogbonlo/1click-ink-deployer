'use client'

import { deployContract } from '@/lib/deployContract'
import { CHAINS } from '@/constants/chains'

interface DeployButtonProps {
  wasmCode: Uint8Array | null
  metadata: any
  constructorName: string
  args: string[]
  sender: any
  rpcUrl: string
  onStatus: (msg: string) => void
  setIsDeploying: (val: boolean) => void
}

export default function DeployButton({
  wasmCode,
  metadata,
  constructorName,
  args,
  sender,
  rpcUrl,
  onStatus,
  setIsDeploying,
}: DeployButtonProps) {
  const handleDeploy = async () => {
    if (!wasmCode || !metadata || !constructorName || !sender) {
      onStatus('❌ Missing required deployment data')
      return
    }

    setIsDeploying(true)
    onStatus('🚀 Deploying contract...')

    try {
      const result = await deployContract({
        wasmCode,
        metadata,
        constructorName,
        constructorArgs: args,
        senderAccount: sender,
        rpcUrl,
      })

      const txHash = result.toString()
      const chain = CHAINS.find(c => c.rpcUrl === rpcUrl)
      const explorerLink = chain?.explorer
        ? `${chain.explorer}${txHash}`
        : txHash

      onStatus(`✅ Deployed! View Tx: ${explorerLink}`)
    } catch (err: any) {
      console.error(err)
      onStatus(`❌ Error: ${err.message || 'Unknown error'}`)
    } finally {
      setIsDeploying(false)
    }
  }

  const isDisabled =
    !wasmCode || !metadata || !constructorName || !sender || args.includes('')

  return (
    <button
      onClick={handleDeploy}
      disabled={isDisabled}
      className={`mt-4 px-6 py-3 rounded text-white ${
        isDisabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      Deploy Contract
    </button>
  )
}
