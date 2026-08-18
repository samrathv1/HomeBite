"use client"

import React, { useState } from 'react'

interface ChefAvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function ChefAvatar({ src, name, size = 'md', className = '' }: ChefAvatarProps) {
  const [imgError, setImgError] = useState(false)

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl'
  }

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  const fallbackBackground = 'bg-[#12666A] text-[#FBF6EC]'

  if (imgError || !src) {
    return (
      <div 
        className={`flex items-center justify-center rounded-full font-bold shadow-sm ${sizeClasses[size]} ${fallbackBackground} ${className}`}
        aria-label={name}
      >
        {initials || 'Chef'}
      </div>
    )
  }

  return (
    <div className={`relative rounded-full overflow-hidden shadow-sm ${sizeClasses[size]} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        className="object-cover w-full h-full"
        onError={() => setImgError(true)}
      />
    </div>
  )
}
