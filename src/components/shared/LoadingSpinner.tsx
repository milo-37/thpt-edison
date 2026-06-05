import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export function LoadingSpinner({ size = 'md', color = 'var(--color-primary)' }: LoadingSpinnerProps) {
  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return { width: '20px', height: '20px', borderWidth: '2px' }
      case 'lg':
        return { width: '56px', height: '56px', borderWidth: '4px' }
      default:
        return { width: '36px', height: '36px', borderWidth: '3px' }
    }
  }

  const dimensions = getDimensions()

  return (
    <div
      style={{
        display: 'inline-block',
        ...dimensions,
        borderStyle: 'solid',
        borderColor: 'var(--color-gray-200)',
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
      aria-label="Loading..."
    />
  )
}

export default LoadingSpinner
