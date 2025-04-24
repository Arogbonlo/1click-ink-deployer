'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  web3Enable,
  web3Accounts,
  web3FromSource
} from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import type { Signer } from '@polkadot/api/types';

interface WalletConnectProps {
  onAccount: (account: {
    address: string;
    signer: Signer;
  }) => void;
}

export default function WalletConnect({ onAccount }: WalletConnectProps) {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string>('');
  const [consent, setConsent] = useState<null | boolean>(null);
  const router = useRouter();

  useEffect(() => {
    const connect = async () => {
      const extensions = await web3Enable('1Click Ink Deployer');
      if (!extensions.length) {
        alert('⚠️ Please install or enable the Polkadot.js extension.');
        return;
      }

      const all = await web3Accounts();
      setAccounts(all);
    };

    if (consent === true) {
      connect();
    }

    if (consent === false) {
      router.push('/'); // Redirect to homepage
    }
  }, [consent]);

  const handleSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value);
    if (!isNaN(index)) {
      setSelectedIndex(e.target.value);
      const selected = accounts[index];
      const injector = await web3FromSource(selected.meta.source);

      onAccount({
        address: selected.address,
        signer: injector.signer,
      });
    }
  };

  return (
    <div className="w-full">
      {consent === null ? (
        <div className="bg-gray-800 text-white p-6 rounded shadow">
          <p className="mb-4 text-lg">🔐 This site wants to connect to your Polkadot wallet. Allow access?</p>
          <div className="flex gap-4">
            <button
              onClick={() => setConsent(true)}
              className="bg-green-500 px-4 py-2 rounded text-white"
            >
              Allow
            </button>
            <button
              onClick={() => setConsent(false)}
              className="bg-red-500 px-4 py-2 rounded text-white"
            >
              Deny
            </button>
          </div>
        </div>
      ) : (
        <div>
          <label className="block mb-2 text-sm font-medium text-white">Wallet:</label>
          <select
            value={selectedIndex}
            onChange={handleSelect}
            className="w-full border px-3 py-2 rounded bg-white text-black"
          >
            <option value="" disabled>
              Please select wallet
            </option>
            {accounts.map((acc, index) => (
              <option key={acc.address} value={index}>
                {acc.meta.name || `Account ${index + 1}`} – {acc.address.slice(0, 10)}...
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
