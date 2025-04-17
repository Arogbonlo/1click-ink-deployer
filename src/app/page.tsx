'use client';

import UploadForm from '@/components/UploadForm';
import WalletConnect from '@/components/WalletConnect';

export default function HomePage() {
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
    </main>
  );
}
