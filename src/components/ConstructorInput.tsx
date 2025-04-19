'use client';

import type { Constructor } from '@/types/constructor';

interface ConstructorInputProps {
  constructor: Constructor;
  onChange: (index: number, value: string) => void;
}

export default function ConstructorInput({ constructor, onChange }: ConstructorInputProps) {
  const args = constructor?.args || [];

  return (
    <div className="space-y-6 mt-6">
      <h3 className="text-lg font-semibold text-polkadot">Constructor Arguments</h3>

      {args.map((arg, index) => (
        <div key={index}>
          <label className="block text-sm font-medium text-white mb-1">
            {arg.label}:{' '}
            <span className="text-polkadot-light font-normal">
              {arg.type.displayName?.join(' ') || arg.type.type}
            </span>
          </label>

          <input
            type="text"
            onChange={(e) => onChange(index, e.target.value)}
            placeholder={`Enter ${arg.label}`}
            className="w-full px-4 py-2 bg-white text-black rounded-md border border-polkadot focus:outline-none focus:ring-2 focus:ring-polkadot-light transition"
          />
        </div>
      ))}
    </div>
  );
}
