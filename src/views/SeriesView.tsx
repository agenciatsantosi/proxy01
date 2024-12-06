import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clapperboard } from 'lucide-react';
import { usePlaylist } from '../contexts/PlaylistContext';
import ViewHeader from '../components/ViewHeader';
import { Channel } from '../types/iptv';
import { getProxiedImageUrl } from '../utils/imageProxy';

export default function SeriesView() {
  const navigate = useNavigate();
  const { channels } = usePlaylist();
  const [searchTerm, setSearchTerm] = useState('');

  // Filtra apenas canais do tipo série
  const seriesChannels = useMemo(() => {
    return channels.filter(channel => 
      channel.type === 'series' && 
      (searchTerm 
        ? channel.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true)
    );
  }, [channels, searchTerm]);

  // Agrupa séries por título
  const groupedSeries = useMemo(() => {
    const groups: Record<string, Channel[]> = {};
    
    seriesChannels.forEach(channel => {
      const seriesName = channel.seriesInfo?.name || channel.name;
      if (!groups[seriesName]) {
        groups[seriesName] = [];
      }
      groups[seriesName].push(channel);
    });

    return groups;
  }, [seriesChannels]);

  const handleSeriesClick = (seriesName: string, episodes: Channel[]) => {
    // Navega para a página de detalhes da série
    navigate(`/series/${encodeURIComponent(seriesName)}`, {
      state: { episodes }
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <ViewHeader title="Séries" />
        
        {/* Barra de busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar séries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        {/* Grid de Séries */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Object.entries(groupedSeries).map(([seriesName, episodes]) => (
            <button
              key={seriesName}
              onClick={() => handleSeriesClick(seriesName, episodes)}
              className="group relative aspect-[2/3] rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {/* Poster */}
              <img
                src={getProxiedImageUrl(episodes[0].seriesInfo?.poster || episodes[0].logo || '')}
                alt={seriesName}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              
              {/* Gradiente e informações */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-white font-semibold text-lg">{seriesName}</h3>
                <p className="text-gray-300 text-sm">
                  {episodes.length} episódios
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Estado vazio */}
        {Object.keys(groupedSeries).length === 0 && (
          <div className="text-center py-12">
            <Clapperboard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              {searchTerm 
                ? 'Nenhuma série encontrada para sua busca'
                : 'Nenhuma série encontrada na lista'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}