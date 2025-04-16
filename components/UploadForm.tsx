import React, { useState } from 'react';
import JSZip from 'jszip';
import { parseContractMetadata } from '../lib/parseContract';

export default function UploadForm({ onParsed }) {
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const zip = await JSZip.loadAsync(file);
    const metadata = await parseContractMetadata(zip);
    onParsed(metadata);
  };

  return (
    <div className="p-4 border rounded">
      <label className="block mb-2">Upload .contract file:</label>
      <input type="file" accept=".contract" onChange={handleFile} />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
