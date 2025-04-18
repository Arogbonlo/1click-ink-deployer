'use client';

import { deployContract } from '@/lib/deployContract';
import { CHAINS } from '@/constants/chains';
import type { Signer } from '@polkadot/types/types';

interface DeployButtonProps {
  wasmCode: Uint8Array | null;
  metadata: Record<string, unknown>;
  constructorName: string;
  args: string[];
  sender: {
    address: string;
    signer: Signer;
  };
  rpcUrl: string;
  onStatus: (msg: string) => void;
  setIsDeploying: (val: boolean) => void;
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
      onStatus('❌ Missing required deployment data');
      return;
    }

    setIsDeploying(true);
    onStatus('🚀 Deploying contract...');

    try {
      const result = await deployContract({
        wasmCode,
        metadata,
        constructorName,
        constructorArgs: args,
        senderAddress: sender.address,
        signer: sender.signer,
        rpcUrl,
      });

      const { blockHash } = result;
      const chain = CHAINS.find((c) => c.rpcUrl === rpcUrl);
      const explorerLink = chain?.explorer
        ? `${chain.explorer}${blockHash}`
        : blockHash;

      onStatus(`✅ Deployed! View Tx: ${explorerLink}`);
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      onStatus(`❌ Error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsDeploying(false);
    }
  };

  const isDisabled =
    !wasmCode || !metadata || !constructorName || !sender || args.includes('');

  return (
    <button
      onClick={handleDeploy}
      disabled={isDisabled}
      className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
        ${
          isDisabled
            ? 'bg-gray-500 cursor-not-allowed text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-blue-500/40'
        }`}
    >
      Deploy Contract
    </button>
  );
}