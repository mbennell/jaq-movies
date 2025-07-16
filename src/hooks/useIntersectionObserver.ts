'use client'

import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number
  root?: Element | null
  rootMargin?: string
  triggerOnce?: boolean
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    triggerOnce = true
  } = options

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          setHasTriggered(true)
          
          if (triggerOnce) {
            observer.disconnect()
          }
        } else if (!triggerOnce && hasTriggered) {
          setIsIntersecting(false)
        }
      },
      {
        threshold,
        root,
        rootMargin
      }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [threshold, root, rootMargin, triggerOnce, hasTriggered])

  return { ref, isIntersecting }
}