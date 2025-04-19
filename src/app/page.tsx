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
    <div
    className="min-h-screen bg-black text-white" >

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-polkadot">1Click Ink Deployer</h1>
          <p className="mt-2 text-sm text-polkadot-light">
            Deploy your ink! contracts to Substrate chains — no hassle.
          </p>
        </div>

        {/* Wallet Connect */}
        <section className="bg-white/5 border border-polkadot/30 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-polkadot mb-4">Connect Your Wallet</h2>
          <WalletConnect onAccount={setAccount} />
        </section>

        {/* Upload Form */}
        <section className="bg-white/5 border border-polkadot/30 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-polkadot mb-4">Upload Contract</h2>
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
        </section>

        {/* Select Network */}
        <section className="bg-white/5 border border-polkadot/30 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-polkadot mb-4">Select Network</h2>
          <select
            value={selectedChain?.name || ''}
            onChange={(e) => {
              const chain = CHAINS.find((c) => c.name === e.target.value);
              if (chain) setSelectedChain(chain);
            }}
            className="w-full border border-polkadot-light px-3 py-2 rounded bg-white text-black focus:ring-2 focus:ring-polkadot"
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
            <p className="text-sm text-polkadot-light mt-2">
              RPC: <code className="text-white">{selectedChain.rpcUrl}</code>
            </p>
          )}
        </section>

        {/* Constructor Input */}
        {selectedConstructor && (
          <section className="bg-white/5 border border-polkadot/30 p-6 rounded-lg shadow-md">
            <ConstructorInput
              constructor={selectedConstructor}
              onChange={(index, value) => {
                const updated = [...args];
                updated[index] = value;
                setArgs(updated);
              }}
            />
          </section>
        )}

        {/* Deploy Section */}
        <section className="bg-white/5 border border-polkadot/30 p-6 rounded-lg shadow-md">
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
            <p className="text-sm text-white mt-2">
              Please connect your wallet, upload a valid .contract file, select a network,
              and fill all constructor inputs to enable the deploy button.
            </p>
          )}

          {isDeploying && <p className="text-sm text-polkadot-light">Deploying...</p>}

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
                  className="underline text-polkadot-light"
                  rel="noopener noreferrer"
                >
                  View Transaction
                </a>
              ) : (
                txStatus
              )}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
