import UploadForm from '../components/UploadForm';
import WalletConnect from '../components/WalletConnect';
import { useState } from 'react';

export default function Home() {
  const [metadata, setMetadata] = useState(null);
  const [account, setAccount] = useState(null);

  return (
    <main className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">1-Click ink! Deployer</h1>
      <WalletConnect onAccount={setAccount} />
      <UploadForm onParsed={setMetadata} />
      {metadata && (
        <pre className="mt-4 bg-gray-100 p-2 text-sm">
          {JSON.stringify(metadata.V3.spec.constructors, null, 2)}
        </pre>
      )}
    </main>
  );
}
