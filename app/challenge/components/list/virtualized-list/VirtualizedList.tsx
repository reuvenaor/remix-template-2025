import { useRef, useEffect, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Loader2, AlertCircle, SearchX } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'


export type VirtualizedListType<T> = T & {
  id: string
}

interface VirtualizedListProps<T> {
  items: VirtualizedListType<T>[]
  renderItem: (item: T, index: number) => React.ReactNode
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  isFetchingNextPage?: boolean
  hasNextPage?: boolean
  fetchNextPage?: () => void
  onRetry?: () => void
  emptyMessage?: string
  estimateSize?: number
  overscan?: number
  className?: string
  id?: string
  scrollPosition?: number
  onScrollPositionChange?: (position: number) => void
}

const VirtualizedListWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn('h-[600px] overflow-auto bg-background', className)}>
      {children}
    </div>
  )
}

export function VirtualizedList<T>({
  items,
  renderItem,
  isLoading = false,
  isError = false,
  error = null,
  isFetchingNextPage = false,
  hasNextPage = false,
  fetchNextPage,
  onRetry,
  emptyMessage = 'No items found',
  estimateSize = 180,
  overscan = 5,
  className,
  id,
  scrollPosition = 0,
  onScrollPositionChange,
}: VirtualizedListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null)
  const scrollingRef = useRef<number | null>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    getItemKey: (index) => items[index].id ?? index,
    overscan,
  })

  const handleScroll = useCallback(() => {
    if (!parentRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = parentRef.current
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight

    // Save scroll position
    if (onScrollPositionChange) {
      onScrollPositionChange(scrollTop)
    }

    if (scrollPercentage > 0.85 && hasNextPage && !isFetchingNextPage && fetchNextPage) {
      console.log('Triggering fetchNextPage!')
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, onScrollPositionChange])

  // Restore scroll position when items change
  useEffect(() => {
    if (parentRef.current && scrollPosition > 0 && items.length > 0) {
      parentRef.current.scrollTop = scrollPosition
    }
  }, [items.length])

  useEffect(() => {
    const scrollElement = parentRef.current
    if (!scrollElement) return

    const onScroll = () => {
      if (scrollingRef.current) {
        clearTimeout(scrollingRef.current)
      }
      scrollingRef.current = window.setTimeout(handleScroll, 150)
    }

    scrollElement.addEventListener('scroll', onScroll)
    return () => {
      scrollElement.removeEventListener('scroll', onScroll)
      if (scrollingRef.current) {
        clearTimeout(scrollingRef.current)
      }
    }
  }, [handleScroll])

  if (isLoading && items.length === 0) {
    return (
      <VirtualizedListWrapper className={className}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading items...</p>
        </div>
      </VirtualizedListWrapper>
    )
  }

  if (isError) {
    return (
      <VirtualizedListWrapper className={className}>
        <div className="flex flex-col items-center gap-3 px-4 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div className="space-y-2">
            <p className="font-semibold">Failed to load items</p>
            <p className="text-sm text-muted-foreground">
              {error?.message || 'An unexpected error occurred'}
            </p>
          </div>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm">
              Try Again
            </Button>
          )}
        </div>
      </VirtualizedListWrapper>
    )
  }

  if (items.length === 0) {
    return (
      <VirtualizedListWrapper className={className}>
        <div className="flex flex-col items-center gap-3 px-4 text-center">
          <SearchX className="h-8 w-8 text-muted-foreground" />
          <div className="space-y-2">
            <p className="font-semibold">No Results</p>
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        </div>
      </VirtualizedListWrapper>
    )
  }

  return (
    <div
      ref={parentRef}
      id={id}
      className={cn(
        'h-[600px] overflow-auto bg-background',
        className
      )}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = items[virtualItem.index]
          if (!item) return null

          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
              className="px-4 py-2"
            >
              {renderItem(item, virtualItem.index)}
            </div>
          )
        })}
      </div>

      {isFetchingNextPage && (
        <div className="sticky bottom-0 flex items-center justify-center bg-background/95 py-3 backdrop-blur">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading more...</span>
          </div>
        </div>
      )}
    </div>
  )
}