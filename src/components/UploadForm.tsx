'use client';

import React, { useState } from 'react';
import JSZip from 'jszip';

type UploadFormProps = {
  onParsed?: (metadata: unknown, wasm: Uint8Array) => void;
};

export default function UploadForm({ onParsed }: UploadFormProps) {
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError('');
      const file = e.target.files?.[0];
      if (!file) return;

      const textContent = await file.text();
      let metadata;
      let wasmBinary;

      try {
        // Try parsing as JSON
        const json = JSON.parse(textContent);
        if (!json.source?.wasm) throw new Error('No wasm field in JSON');
        metadata = json;
        wasmBinary = Uint8Array.from(atob(json.source.wasm), (c) => c.charCodeAt(0));
        console.log('✅ Parsed .contract as JSON');
      } catch (jsonErr) {
        console.warn('📦 Not a valid JSON .contract, trying ZIP...', jsonErr);

        // Try parsing as ZIP (legacy)
        const arrayBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);

        const metadataFile = Object.keys(zip.files).find((name) => name.endsWith('.json'));
        const wasmFile = Object.keys(zip.files).find((name) => name.endsWith('.wasm'));

        if (!metadataFile || !wasmFile) throw new Error('WASM or metadata file not found in ZIP');

        const metaContent = await zip.files[metadataFile].async('string');
        metadata = JSON.parse(metaContent);
        wasmBinary = await zip.files[wasmFile].async('uint8array');
        console.log('✅ Parsed .contract as ZIP');
      }

      console.log('🧠 Parsed metadata:', metadata);
      console.log('📦 Extracted WASM size:', wasmBinary.length);

      if (onParsed) onParsed(metadata, wasmBinary);
    } catch (err) {
      console.error('Error during upload:', err);
      setError('❌ Failed to parse the .contract file. Please ensure it is a valid .contract JSON or a legacy ZIP archive from `cargo-contract`.');
    }
  };

  return (
    <div className="p-4 border rounded">
      <input type="file" accept=".contract" onChange={handleFile} />
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
