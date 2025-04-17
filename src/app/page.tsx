'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import UploadForm from '@/components/UploadForm';
import { CHAINS } from '@/constants/chains';
import DeployButton from '@/components/DeployButton';
import ConstructorInput from '@/components/ConstructorInput';

const WalletConnect = dynamic(() => import('@/components/WalletConnect'), {
  ssr: false,
});

export default function HomePage() {
  const [selectedChain, setSelectedChain] = useState(CHAINS[0]);
  const [wasmCode, setWasmCode] = useState<Uint8Array | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [account, setAccount] = useState<any>(null);
  const [constructorName, setConstructorName] = useState<string | null>(null);
  const [selectedConstructor, setSelectedConstructor] = useState<any>(null);
  const [args, setArgs] = useState<string[]>([]);
  const [txStatus, setTxStatus] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  return (
    <main className="p-6 text-white space-y-6">
      <h1 className="text-3xl font-bold">Welcome to 1Click Ink Deployer</h1>
      <p></p>

      <div className="border-t border-gray-700 pt-6">
        <h2 className="text-xl font-semibold mb-4">Wallet Connect</h2>
        <WalletConnect onAccount={setAccount} />
      </div>

      <div className="border-t border-gray-700 pt-6">
        <h2 className="text-xl font-semibold mb-4">Upload Form</h2>
        <UploadForm
          onParsed={(meta: any, wasm: Uint8Array) => {
            setMetadata(meta);
            setWasmCode(wasm);
            const constructor = meta?.V3?.spec?.constructors?.[0];
            setConstructorName(constructor?.label ?? null);
            setSelectedConstructor(constructor);
            setArgs(Array(constructor?.args?.length).fill(''));
          }}
        />
      </div>

      <div className="border-t border-gray-700 pt-6">
        <h2 className="text-xl font-semibold mb-4">Select Network</h2>
        <select
          value={selectedChain.name}
          onChange={(e) => {
            const chain = CHAINS.find((c) => c.name === e.target.value);
            if (chain) setSelectedChain(chain);
          }}
          className="border px-3 py-2 rounded text-black w-full"
        >
          {CHAINS.map((chain) => (
            <option key={chain.name} value={chain.name}>
              {chain.name}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-300 mt-2">
          Selected RPC: <code>{selectedChain.rpcUrl}</code>
        </p>
      </div>

      {/* 🧠 Constructor Input */}
      {selectedConstructor && (
        <ConstructorInput
          constructor={selectedConstructor}
          onChange={(index, value) => {
            const updated = [...args];
            updated[index] = value;
            setArgs(updated);
          }}
        />
      )}

      {/* 🚀 Deploy Button Section */}
      <div className="border-t border-gray-700 pt-6">
        <h2 className="text-xl font-semibold mb-4">Deploy</h2>
        <DeployButton
          wasmCode={wasmCode}
          metadata={metadata}
          constructorName={constructorName || ''}
          args={args}
          sender={account}
          rpcUrl={selectedChain.rpcUrl}
          onStatus={setTxStatus}
          setIsDeploying={setIsDeploying}
        />
        {(
          !wasmCode ||
          !metadata ||
          !constructorName ||
          !account ||
          args.includes('')
        ) && (
          <p className="text-sm text-red-400 mt-2">
            Please connect your wallet, upload a valid .contract file, and fill all constructor inputs to enable the deploy button.
          </p>
        )}
        {isDeploying && <p className="text-sm text-blue-400">Deploying...</p>}
        {txStatus && (
          <p className="text-sm mt-2 text-green-400">
            {txStatus.includes('http') ? (
              <a href={txStatus.split(' ').pop()} target="_blank" className="underline">
                {txStatus}
              </a>
            ) : (
              txStatus
            )}
          </p>
        )}
      </div>
    </main>
  );
}
