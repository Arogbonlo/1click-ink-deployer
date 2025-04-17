'use client'

import { web3Enable, web3Accounts } from '@polkadot/extension-dapp'
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { useEffect, useState } from 'react'

interface WalletConnectProps {
  onAccount: (account: InjectedAccountWithMeta) => void
}

export default function WalletConnect({ onAccount }: WalletConnectProps) {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    const connect = async () => {
      await web3Enable('1Click Ink Deployer')
      const all = await web3Accounts()
      setAccounts(all)
      if (all.length > 0) {
        setSelectedIndex(0)
        onAccount(all[0])
      }
    }

    connect()
  }, [onAccount])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value)
    setSelectedIndex(index)
    onAccount(accounts[index])
  }

  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium text-sm">Select Wallet:</label>
      {accounts.length > 0 ? (
        <select
          value={selectedIndex}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full text-black"
        >
          {accounts.map((acc, i) => (
            <option key={acc.address} value={i}>
              {acc.meta.name || `Account ${i + 1}`} – {acc.address.slice(0, 10)}...
            </option>
          ))}
        </select>
      ) : (
        <p className="text-sm text-red-500">⚠ No wallet accounts found.</p>
      )}
    </div>
  )
}
