'use client'

interface ConstructorInputProps {
  constructor: any
  onChange: (index: number, value: string) => void
}

export default function ConstructorInput({ constructor, onChange }: ConstructorInputProps) {
  const args = constructor?.args || []

  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-lg font-semibold">Constructor Arguments</h3>
      {args.map((arg: any, index: number) => (
        <div key={index}>
          <label className="block text-sm mb-1">
            {arg.label}:{' '}
            <span className="text-gray-400">
              {arg.type.displayName?.join(' ') || arg.type.type}
            </span>
          </label>
          <input
            type="text"
            onChange={(e) => onChange(index, e.target.value)}
            placeholder={`Enter ${arg.label}`}
            className="w-full px-3 py-2 text-black rounded border"
          />
        </div>
      ))}
    </div>
  )
}
