'use client'

import React, { useState } from 'react';
import JSZip from 'jszip';
import { parseContractMetadata } from '../lib/parseContract';

type UploadFormProps = {
  onParsed?: (metadata: unknown, wasm: Uint8Array) => void;
};

export default function UploadForm({ onParsed }: UploadFormProps) {
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      const zip = await JSZip.loadAsync(file);

      // Parse metadata
      const metadata = await parseContractMetadata(zip);

      const wasmFile = Object.keys(zip.files).find((name) => name.endsWith('.wasm'));
      if (!wasmFile) throw new Error('WASM file not found in contract archive');

      const wasmContent = await zip.files[wasmFile].async('uint8array');

      if (onParsed) {
        onParsed(metadata, wasmContent);
      }
    } catch (err) {
      console.error(err);
      setError('❌ Failed to parse the .contract file. Please make sure it is valid.');
    }
  };

  return (
    <div className="p-4 border rounded">
       <input type="file" accept=".contract" onChange={handleFile} />
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
