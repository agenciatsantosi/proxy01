import { useMemo } from 'react';
import { Channel } from '../types/iptv';

interface ContentListProps {
  title: string;
  items: Channel[];
  onItemSelect: (item: Channel) => void;
}

export default function ContentList({ title, items, onItemSelect }: ContentListProps) {
  const groupedItems = useMemo(() => {
    if (!items) return [];
    return items;
  }, [items]);

  if (!groupedItems.length) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {groupedItems.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-red-500 transition-all"
            onClick={() => onItemSelect(item)}
          >
            <div className="aspect-video relative">
              <img
                src={item.logo}
                alt={item.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium line-clamp-2">{item.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 