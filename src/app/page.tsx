'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import UploadForm from '@/components/UploadForm';
import { CHAINS } from '@/constants/chains';

const WalletConnect = dynamic(() => import('@/components/WalletConnect'), {
  ssr: false,
});

export default function HomePage() {
  const [selectedChain, setSelectedChain] = useState(CHAINS[0]);

  return (
    <main className="p-6 text-white space-y-6">
      <h1 className="text-3xl font-bold">Welcome to 1Click Ink Deployer</h1>
      <p>This is your custom Next.js homepage.</p>

      <div className="border-t border-gray-700 pt-6">
        <h2 className="text-xl font-semibold mb-4">Wallet Connect</h2>
        <WalletConnect />
      </div>

      <div className="border-t border-gray-700 pt-6">
        <h2 className="text-xl font-semibold mb-4">Upload Form</h2>
        <UploadForm />
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
    </main>
  );
}
