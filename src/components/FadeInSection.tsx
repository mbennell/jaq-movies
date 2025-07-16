'use client'

import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

interface FadeInSectionProps {
  children: React.ReactNode
  delay?: number
  className?: string
  style?: React.CSSProperties
}

export default function FadeInSection({ 
  children, 
  delay = 0, 
  className = '', 
  style = {} 
}: FadeInSectionProps) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <div
      ref={ref}
      className={`fade-in ${isIntersecting ? 'visible' : ''} ${className}`}
      style={{
        ...style,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}