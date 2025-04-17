'use client';

import { useEffect, useState } from 'react';
import { web3Enable, web3Accounts } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

interface WalletConnectProps {
  onAccount: (account: InjectedAccountWithMeta) => void;
}

export default function WalletConnect({ onAccount }: WalletConnectProps) {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string>(''); // start with empty

  useEffect(() => {
    const connect = async () => {
      await web3Enable('1Click Ink Deployer');
      const all = await web3Accounts();
      setAccounts(all);
    };
    connect();
  }, []);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value);
    if (!isNaN(index)) {
      setSelectedIndex(e.target.value);
      onAccount(accounts[index]);
    }
  };

  return (
    <div className="w-full">
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
  );
}
