'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import UploadForm from '@/components/UploadForm';
import { CHAINS } from '@/constants/chains';
import DeployButton from '@/components/DeployButton';
import ConstructorInput from '@/components/ConstructorInput';
import type { Constructor as ContractConstructor } from '@/types/constructor';
import type { Signer } from '@polkadot/api/types';

const WalletConnect = dynamic(() => import('@/components/WalletConnect'), {
  ssr: false,
});

type Chain = {
  name: string;
  rpcUrl: string;
  explorer: string;
};

type Account = {
  address: string;
  signer: Signer;
};

export default function HomePage() {
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [wasmCode, setWasmCode] = useState<Uint8Array | null>(null);
  const [metadata, setMetadata] = useState<Record<string, unknown> | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [constructorName, setConstructorName] = useState<string | null>(null);
  const [selectedConstructor, setSelectedConstructor] = useState<ContractConstructor | null>(null);
  const [args, setArgs] = useState<string[]>([]);
  const [txStatus, setTxStatus] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">Welcome to 1Click Ink Deployer</h1>
          <p className="mt-2 text-sm text-gray-300">
            Easily deploy your ink! contracts to Substrate chains
          </p>
        </div>

        {/* Wallet Connect */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Wallet Connect</h2>
          <WalletConnect onAccount={setAccount} />
        </div>

        {/* Upload Form */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Upload Form</h2>
          <UploadForm
            onParsed={(meta, wasm) => {
              try {
                setMetadata(meta as Record<string, unknown>);
                setWasmCode(wasm);
                const constructor = (meta as Record<string, any>)?.V3?.spec?.constructors?.[0];
                if (constructor) {
                  setConstructorName(constructor.label ?? null);
                  setSelectedConstructor(constructor);
                  setArgs(Array(constructor?.args?.length || 0).fill(''));
                } else {
                  setConstructorName(null);
                  setSelectedConstructor(null);
                  setArgs([]);
                }
              } catch (err) {
                console.error('❌ Error parsing metadata:', err);
                setMetadata(null);
                setConstructorName(null);
                setSelectedConstructor(null);
                setArgs([]);
              }
            }}
          />
        </div>

        {/* Select Network */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Select Network</h2>
          <select
            value={selectedChain?.name || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const chain = CHAINS.find((c) => c.name === e.target.value);
              if (chain) setSelectedChain(chain);
            }}
            className="w-full border px-3 py-2 rounded bg-white text-black"
          >
            <option value="" disabled>
              Please select network
            </option>
            {CHAINS.map((chain) => (
              <option key={chain.name} value={chain.name}>
                {chain.name}
              </option>
            ))}
          </select>
          {selectedChain && (
            <p className="text-sm text-gray-300 mt-2">
              Selected RPC: <code>{selectedChain.rpcUrl}</code>
            </p>
          )}
        </div>

        {/* Constructor Input */}
        {selectedConstructor && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg shadow-sm">
            <ConstructorInput
              constructor={selectedConstructor}
              onChange={(index, value) => {
                const updated = [...args];
                updated[index] = value;
                setArgs(updated);
              }}
            />
          </div>
        )}

        {/* Deploy Section */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg shadow-sm">
          {account && (
            <DeployButton
              wasmCode={wasmCode}
              metadata={metadata || {}}
              constructorName={constructorName || ''}
              args={args}
              sender={account}
              rpcUrl={selectedChain?.rpcUrl || ''}
              onStatus={setTxStatus}
              setIsDeploying={setIsDeploying}
            />
          )}

          {(
            !wasmCode ||
            !metadata ||
            !constructorName ||
            !account ||
            !selectedChain ||
            args.includes('')
          ) && (
            <p className="text-sm text-red-400 mt-2">
              Please connect your wallet, upload a valid .contract file, select a network,
              and fill all constructor inputs to enable the deploy button.
            </p>
          )}
          {isDeploying && <p className="text-sm text-blue-400">Deploying...</p>}
          {txStatus && (
            <p className="text-sm mt-2 text-green-400">
              {txStatus.includes('http') ? (
                <a
                  href={
                    txStatus
                      .split(' ')
                      .find((s) => s.startsWith('http')) ?? '#'
                  }
                  target="_blank"
                  className="underline"
                  rel="noopener noreferrer"
                >
                  View Transaction
                </a>
              ) : (
                txStatus
              )}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
