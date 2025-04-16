import React, { useState } from 'react';
import JSZip from 'jszip';
import { parseContractMetadata } from '../lib/parseContract';

type UploadFormProps = {
  onParsed: (metadata: unknown) => void;
};

export default function UploadForm({ onParsed }: UploadFormProps) {
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      const zip = await JSZip.loadAsync(file);
      const metadata = await parseContractMetadata(zip);
      onParsed(metadata);
    } catch (err) {
      console.error(err);
      setError('Failed to parse the contract file.');
    }
  };

  return (
    <div className="p-4 border rounded">
      <label className="block mb-2">Upload .contract file:</label>
      <input type="file" accept=".contract" onChange={handleFile} />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
