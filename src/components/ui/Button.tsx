'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps {
  children: ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const buttonVariants = {
  primary: 'bg-gradient-to-r from-cinema-gold to-yellow-400 text-cinema-black font-semibold hover:from-yellow-400 hover:to-cinema-gold',
  secondary: 'bg-cinema-burgundy text-white hover:bg-opacity-80',
  glass: 'glass text-white hover:bg-opacity-60',
  ghost: 'bg-transparent text-cinema-gold border border-cinema-gold hover:bg-cinema-gold hover:text-cinema-black'
}

const sizeVariants = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
}

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  type = 'button'
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cinema-gold focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
        buttonVariants[variant],
        sizeVariants[size],
        className
      )}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.button>
  )
}