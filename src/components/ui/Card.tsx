'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import Glass from './Glass'

interface CardProps {
  children: ReactNode
  className?: string
  backgroundImage?: string
  overlay?: boolean
  hover?: boolean
  onClick?: () => void
}

export default function Card({
  children,
  className,
  backgroundImage,
  overlay = true,
  hover = true,
  onClick
}: CardProps) {
  const cardStyle = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {}

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden cursor-pointer group',
        className
      )}
      style={cardStyle}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {/* Overlay for better text readability */}
      {overlay && backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      )}
      
      {/* Content */}
      <Glass 
        variant="card" 
        className={cn(
          'relative z-10 h-full',
          backgroundImage && 'bg-transparent backdrop-blur-sm'
        )}
      >
        {children}
      </Glass>
      
      {/* Hover effect */}
      {hover && (
        <div className="absolute inset-0 bg-cinema-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </motion.div>
  )
}