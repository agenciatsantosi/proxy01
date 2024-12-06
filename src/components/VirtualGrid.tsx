import React, { useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface VirtualGridProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  columns: number;
  itemHeight: number;
  gap?: number;
}

export default function VirtualGrid<T>({
  items,
  renderItem,
  columns,
  itemHeight,
  gap = 16
}: VirtualGridProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [parentWidth, setParentWidth] = useState(0);

  useEffect(() => {
    if (parentRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        setParentWidth(entries[0].contentRect.width);
      });
      resizeObserver.observe(parentRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const rows = Math.ceil(items.length / columns);
  
  const rowVirtualizer = useVirtualizer({
    count: rows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight + gap,
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      className="w-full h-[80vh] overflow-auto"
      style={{
        contain: 'strict',
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * columns;
          const rowItems = items.slice(startIndex, startIndex + columns);

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${itemHeight}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                }}
              >
                {rowItems.map((item, i) => (
                  <div key={i}>{renderItem(item)}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
