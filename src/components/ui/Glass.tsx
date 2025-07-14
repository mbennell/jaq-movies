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
  default: 'glass',
  card: 'glass-card p-6',
  navigation: 'glass px-4 py-2',
  modal: 'glass p-8'
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

  return (
    <Component
      className={cn(glassVariants[variant], className)}
      {...motionProps}
    >
      {children}
    </Component>
  )
}