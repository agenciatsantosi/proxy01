import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tv, Film, Clapperboard } from 'lucide-react';
import { usePlaylist } from '../contexts/PlaylistContext';
import ViewHeader from '../components/ViewHeader';
import ChannelList from '../components/ChannelList';

interface ChannelCounts {
  tv: number;
  series: number;
  movies: number;
}

export default function DashboardView() {
  const navigate = useNavigate();
  const { channels } = usePlaylist();
  const [selectedType, setSelectedType] = useState<'all' | 'tv' | 'series' | 'movie'>('all');

  // Calcula a contagem de canais por tipo
  const channelCounts = channels.reduce((acc, channel) => {
    switch (channel.type) {
      case 'tv':
        acc.tv++;
        break;
      case 'series':
        acc.series++;
        break;
      case 'movie':
        acc.movies++;
        break;
    }
    return acc;
  }, { tv: 0, series: 0, movies: 0 } as ChannelCounts);

  // Filtra os canais baseado no tipo selecionado
  const filteredChannels = selectedType === 'all' 
    ? channels 
    : channels.filter(channel => channel.type === selectedType);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <ViewHeader title="Dashboard" />

        {/* Resumo de canais */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button 
            onClick={() => setSelectedType('tv')}
            className={`bg-gray-800 rounded-lg p-4 transition-colors ${selectedType === 'tv' ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Tv className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">TV Online</p>
                <p className="text-xl font-bold text-white">{channelCounts.tv.toLocaleString()}</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => setSelectedType('series')}
            className={`bg-gray-800 rounded-lg p-4 transition-colors ${selectedType === 'series' ? 'ring-2 ring-purple-500' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Clapperboard className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Séries</p>
                <p className="text-xl font-bold text-white">{channelCounts.series.toLocaleString()}</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => setSelectedType('movie')}
            className={`bg-gray-800 rounded-lg p-4 transition-colors ${selectedType === 'movie' ? 'ring-2 ring-green-500' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Film className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Filmes</p>
                <p className="text-xl font-bold text-white">{channelCounts.movies.toLocaleString()}</p>
              </div>
            </div>
          </button>
        </div>

        {/* Lista de canais */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-white">
              {selectedType === 'all' ? 'Todos os Canais' : 
               selectedType === 'tv' ? 'TV Online' :
               selectedType === 'series' ? 'Séries' : 'Filmes'}
            </h2>
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedType === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Ver Todos
            </button>
          </div>

          <ChannelList channels={filteredChannels} />
        </div>
      </div>
    </div>
  );
}
