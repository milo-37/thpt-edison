'use client'

import { Search } from 'lucide-react'

interface SearchInputProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
}: SearchInputProps) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: 'var(--space-2) var(--space-4) var(--space-2) var(--space-10)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-gray-300)',
          outline: 'none',
          fontSize: 'var(--font-size-sm)',
          transition: 'all var(--transition-fast)',
        }}
      />
      <Search
        size={16}
        style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-gray-400)',
          pointerEvents: 'none'
        }}
      />
    </div>
  )
}
