import { useState, useMemo, useCallback, useEffect } from 'react';
import { Channel } from '../types/iptv';
import { Search, Tv, Film, Clapperboard, Loader2 } from 'lucide-react';
import classNames from 'classnames';
import ProxyImage from './ProxyImage';

interface ChannelListProps {
  channels: Channel[];
  selectedChannel?: Channel;
  onChannelSelect?: (channel: Channel) => void;
}

export default function ChannelList({ channels, selectedChannel, onChannelSelect }: ChannelListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'series' | 'tv'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [visibleGroups, setVisibleGroups] = useState<number>(10);

  // Memoize channel counts
  const channelCounts = useMemo(() => {
    return channels.reduce((acc, channel) => {
      switch (channel.type) {
        case 'tv': acc.tv++; break;
        case 'series': acc.series++; break;
        case 'movie': acc.movies++; break;
      }
      return acc;
    }, { tv: 0, series: 0, movies: 0 });
  }, [channels]);

  // Memoize filtered channels
  const filteredChannels = useMemo(() => {
    return channels.filter(channel => {
      const matchesSearch = !searchTerm || 
        channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        channel.group?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || channel.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [channels, searchTerm, selectedType]);

  // Memoize grouped channels
  const groupedChannels = useMemo(() => {
    const groups = new Map<string, Channel[]>();
    
    filteredChannels.forEach(channel => {
      const group = channel.group || 'Sem Categoria';
      if (!groups.has(group)) {
        groups.set(group, []);
      }
      groups.get(group)!.push(channel);
    });

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .filter(([_, channels]) => channels.length > 0);
  }, [filteredChannels]);

  const handleChannelSelect = useCallback((channel: Channel) => {
    onChannelSelect?.(channel);
  }, [onChannelSelect]);

  const handleTypeSelect = useCallback((type: 'all' | 'movie' | 'series' | 'tv') => {
    setSelectedType(type);
    setSearchTerm('');
  }, []);

  const getFilterTitle = useCallback(() => {
    switch (selectedType) {
      case 'tv': return 'TV Online';
      case 'series': return 'Séries';
      case 'movie': return 'Filmes';
      default: return 'Todos os Canais';
    }
  }, [selectedType]);

  // Reset visible groups when type changes
  useEffect(() => {
    setIsLoading(true);
    setVisibleGroups(10);
    
    // Simula um pequeno delay para mostrar o loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedType]);

  // Aumenta o número de grupos visíveis quando chegar ao final do scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;
    if (bottom) {
      setVisibleGroups(prev => prev + 10);
    }
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {/* Categorias principais */}
      <div className="grid grid-cols-4 gap-1 p-2 bg-gray-900">
        <button
          onClick={() => handleTypeSelect('all')}
          className={classNames(
            'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            selectedType === 'all'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          )}
        >
          Todos
          <span className="block text-xs opacity-75">
            {channels.length}
          </span>
        </button>
        
        <button
          onClick={() => handleTypeSelect('tv')}
          className={classNames(
            'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex flex-col items-center',
            selectedType === 'tv'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          )}
        >
          <Tv className="w-4 h-4 mb-1" />
          TV Online
          <span className="block text-xs opacity-75">
            {channelCounts.tv}
          </span>
        </button>

        <button
          onClick={() => handleTypeSelect('series')}
          className={classNames(
            'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex flex-col items-center',
            selectedType === 'series'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          )}
        >
          <Clapperboard className="w-4 h-4 mb-1" />
          Séries
          <span className="block text-xs opacity-75">
            {channelCounts.series}
          </span>
        </button>

        <button
          onClick={() => handleTypeSelect('movie')}
          className={classNames(
            'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex flex-col items-center',
            selectedType === 'movie'
              ? 'bg-green-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          )}
        >
          <Film className="w-4 h-4 mb-1" />
          Filmes
          <span className="block text-xs opacity-75">
            {channelCounts.movies}
          </span>
        </button>
      </div>

      {/* Busca */}
      <div className="sticky top-0 bg-gray-800/95 backdrop-blur-sm p-4 z-10 border-b border-gray-700">
        <div className="relative">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar canal ou categoria..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Lista de canais */}
      <div 
        className="space-y-6 p-4 max-h-[calc(100vh-16rem)] overflow-y-auto"
        onScroll={handleScroll}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
            <span className="ml-2 text-gray-400">
              Carregando {getFilterTitle()}...
            </span>
          </div>
        ) : groupedChannels.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">
              {searchTerm 
                ? `Nenhum canal encontrado para "${searchTerm}"`
                : `Nenhum canal encontrado em ${getFilterTitle()}`}
            </p>
          </div>
        ) : (
          groupedChannels.slice(0, visibleGroups).map(([group, channels]) => (
            <div key={group} className="space-y-3">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider sticky top-0">
                {group}
                <span className="ml-2 text-gray-500">({channels.length})</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {channels.map(channel => (
                  <button
                    key={channel.id}
                    onClick={() => handleChannelSelect(channel)}
                    className={classNames(
                      'relative group aspect-video rounded-lg overflow-hidden transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500',
                      selectedChannel?.id === channel.id ? 'ring-2 ring-purple-500' : '',
                      'bg-gray-900'
                    )}
                  >
                    <ProxyImage
                      src={channel.logo}
                      alt={channel.name}
                      className="w-full h-full object-cover"
                      fallbackText={channel.name}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      {channel.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}

        {!isLoading && groupedChannels.length > visibleGroups && (
          <div className="text-center py-4">
            <Loader2 className="w-6 h-6 text-purple-500 animate-spin mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
}