'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'card' | 'navigation' | 'modal'
  animate?: boolean
  hover?: boolean
}

const glassVariants = {
  default: {
    className: 'rounded-2xl border',
    style: {
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
    }
  },
  card: {
    className: 'p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5',
    style: {
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
    }
  },
  navigation: {
    className: 'px-4 py-2 rounded-2xl border',
    style: {
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
    }
  },
  modal: {
    className: 'p-8 rounded-2xl border',
    style: {
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
    }
  }
}

const animationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { 
    y: -4,
    transition: { duration: 0.2 }
  }
}

export default function Glass({ 
  children, 
  className, 
  variant = 'default', 
  animate = false,
  hover = false 
}: GlassProps) {
  const Component = animate ? motion.div : 'div'
  
  const motionProps = animate ? {
    initial: "hidden",
    animate: "visible",
    whileHover: hover ? "hover" : undefined,
    variants: animationVariants,
    transition: { duration: 0.3 }
  } : {}

  const variantConfig = glassVariants[variant]
  
  return (
    <Component
      className={cn(variantConfig.className, className)}
      style={variantConfig.style}
      {...motionProps}
    >
      {children}
    </Component>
  )
}