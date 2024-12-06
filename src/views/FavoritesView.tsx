import { useState } from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import { CONTENT_TYPES } from '../utils/constants';
import { Tv, Film, PlaySquare, Heart } from 'lucide-react';
import ViewHeader from '../components/ViewHeader';
import ChannelCard from '../components/ChannelCard';

const tabs = [
  { id: CONTENT_TYPES.TV, label: 'TV Online', icon: Tv },
  { id: CONTENT_TYPES.MOVIE, label: 'Filmes', icon: Film },
  { id: CONTENT_TYPES.SERIES, label: 'Séries', icon: PlaySquare },
];

export default function FavoritesView() {
  const { favorites } = useFavorites();
  const [activeTab, setActiveTab] = useState(CONTENT_TYPES.TV);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <ViewHeader title="Meus Favoritos" />

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
              <span className="ml-2 px-2 py-0.5 text-sm rounded-full bg-gray-700">
                {favorites[tab.id].length}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {favorites[activeTab].length > 0 ? (
            favorites[activeTab].map(channel => (
              <ChannelCard key={channel.id} channel={channel} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-800 rounded-lg">
              <Heart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                Você ainda não tem {activeTab === CONTENT_TYPES.TV ? 'canais' : activeTab === CONTENT_TYPES.MOVIE ? 'filmes' : 'séries'} favoritos.
                <br />
                Adicione alguns favoritos para vê-los aqui.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
