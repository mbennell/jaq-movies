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
  primary: {
    className: 'text-black font-semibold transition-all duration-300 hover:scale-105',
    style: {
      background: 'linear-gradient(90deg, #d4af37 0%, #f4d03f 100%)'
    }
  },
  secondary: {
    className: 'text-white hover:opacity-80 transition-all duration-300',
    style: {
      backgroundColor: '#8b1538'
    }
  },
  glass: {
    className: 'text-white hover:opacity-80 transition-all duration-300 border border-white/20',
    style: {
      background: 'rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)'
    }
  },
  ghost: {
    className: 'bg-transparent border transition-all duration-300 hover:text-black',
    style: {
      color: '#d4af37',
      borderColor: '#d4af37'
    }
  }
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
  const variantConfig = buttonVariants[variant]
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
        variantConfig.className,
        sizeVariants[size],
        className
      )}
      style={variantConfig.style}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.button>
  )
}