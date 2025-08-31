import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useEffect } from 'react'

interface UseVirtualizationOptions<T> {
  items: T[]
  estimateSize: number
  overscan?: number
  scrollElement?: HTMLElement | null
}

export function useVirtualization<T>({
  items,
  estimateSize,
  overscan = 5,
  scrollElement,
}: UseVirtualizationOptions<T>) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollElement ?? parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  })

  useEffect(() => {
    virtualizer.measure()
  }, [items, virtualizer])

  return {
    parentRef,
    virtualizer,
    virtualItems: virtualizer.getVirtualItems(),
    totalSize: virtualizer.getTotalSize(),
  }
}
