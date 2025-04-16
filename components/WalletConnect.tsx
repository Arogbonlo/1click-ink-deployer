import { web3Enable, web3Accounts } from '@polkadot/extension-dapp';
import { useEffect, useState } from 'react';

export default function WalletConnect({ onAccount }) {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const connect = async () => {
      await web3Enable('1-Click ink Deployer');
      const all = await web3Accounts();
      setAccounts(all);
      if (all.length > 0) onAccount(all[0]);
    };
    connect();
  }, []);

  return (
    <div>
      <label className="block">Wallet:</label>
      <select>
        {accounts.map(acc => (
          <option key={acc.address}>{acc.meta.name} - {acc.address}</option>
        ))}
      </select>
    </div>
  );
}
