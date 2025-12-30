/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useEffect, useState, RefObject } from 'react'

const useIntersection = <T extends HTMLElement>(
  elementRef: RefObject<T | null>,
  options?: IntersectionObserverInit
): { isVisible: boolean } => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = elementRef.current
    if (!node) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
    }, options)

    observer.observe(node)
    return () => observer.disconnect()
  }, [elementRef, options?.root, options?.rootMargin, options?.threshold])

  return { isVisible }
}

export default useIntersection
