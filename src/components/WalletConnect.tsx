import { web3Enable, web3Accounts } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { useEffect, useState } from 'react';

interface WalletConnectProps {
  onAccount?: (account: InjectedAccountWithMeta) => void; // ✅ Made optional with `?`
}

export default function WalletConnect({ onAccount }: WalletConnectProps) {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);

  useEffect(() => {
    const connect = async () => {
      await web3Enable('1-Click ink Deployer');
      const all = await web3Accounts();
      setAccounts(all);
      if (all.length > 0 && onAccount) {
        onAccount(all[0]); // ✅ Only call if onAccount is provided
      }
    };
    connect();
  }, [onAccount]);

  return (
    <div>
      <label className="block">Wallet:</label>
      <select>
        {accounts.map((acc) => (
          <option key={acc.address}>
            {acc.meta.name} - {acc.address}
          </option>
        ))}
      </select>
    </div>
  );
}
