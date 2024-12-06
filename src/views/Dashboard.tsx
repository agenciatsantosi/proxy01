import { useNavigate } from 'react-router-dom';
import { usePlaylist } from '../contexts/PlaylistContext';
import { CONTENT_TYPES } from '../utils/constants';
import { Tv, Film, PlaySquare } from 'lucide-react';
import ViewHeader from '../components/ViewHeader';

const categories = [
  {
    id: 'tv',
    name: 'TV Online',
    icon: Tv,
    type: CONTENT_TYPES.TV,
    path: '/tv',
    color: 'blue'
  },
  {
    id: 'movies',
    name: 'Filmes',
    icon: Film,
    type: CONTENT_TYPES.MOVIE,
    path: '/movies',
    color: 'green'
  },
  {
    id: 'series',
    name: 'Séries',
    icon: PlaySquare,
    type: CONTENT_TYPES.SERIES,
    path: '/series',
    color: 'purple'
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { channels } = usePlaylist();

  // Conta os itens por categoria
  const counts = channels.reduce((acc, channel) => {
    acc[channel.type] = (acc[channel.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <ViewHeader title="Dashboard" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => navigate(category.path)}
              className={`
                p-6 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors
                flex flex-col items-center text-center gap-4
                border-2 border-transparent hover:border-${category.color}-500/50
              `}
            >
              <div className={`
                p-4 rounded-full
                bg-${category.color}-500/10 text-${category.color}-400
              `}>
                <category.icon className="w-8 h-8" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-3xl font-bold text-gray-300">
                  {counts[category.type] || 0}
                </p>
                <p className="text-sm text-gray-400">
                  {counts[category.type] === 1 ? 'item' : 'itens'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
