import { getProxiedImageUrl } from '../utils/imageProxy';
import { Play, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Channel } from '../types/Channel';
import { useFavorites } from '../contexts/FavoritesContext';
import { CONTENT_TYPES } from '../utils/constants';

interface ChannelCardProps {
  channel: Channel;
}

export default function ChannelCard({ channel }: ChannelCardProps) {
  const navigate = useNavigate();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(channel.id, channel.type);

  const handlePlay = () => {
    navigate(`/player/${channel.id}`);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorite) {
      removeFavorite(channel.id, channel.type);
    } else {
      addFavorite(channel);
    }
  };

  return (
    <div 
      className="group relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
      onClick={handlePlay}
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gray-900 relative">
        {channel.logo ? (
          <img 
            src={getProxiedImageUrl(channel.logo)} 
            alt={channel.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.png';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <span className="text-gray-500 text-lg">{channel.name[0]}</span>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-2 right-2 flex gap-2">
            <button 
              className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              onClick={handlePlay}
              title="Reproduzir"
            >
              <Play className="w-4 h-4" />
            </button>
            <button 
              className={`p-2 rounded-full ${
                favorite 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-700 text-gray-300'
              } hover:bg-red-700 transition-colors`}
              onClick={handleFavorite}
              title={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-white font-medium truncate" title={channel.name}>
          {channel.name}
        </h3>
        <p className="text-sm text-gray-400 truncate">
          {channel.group}
        </p>
      </div>

      {/* Badge */}
      <div className="absolute top-2 left-2">
        <span className={`
          px-2 py-1 text-xs rounded-full
          ${channel.type === CONTENT_TYPES.TV ? 'bg-blue-500/20 text-blue-400' : 
            channel.type === CONTENT_TYPES.MOVIE ? 'bg-green-500/20 text-green-400' :
            'bg-purple-500/20 text-purple-400'}
        `}>
          {channel.type === CONTENT_TYPES.TV ? 'TV' : 
           channel.type === CONTENT_TYPES.MOVIE ? 'Filme' : 'Série'}
        </span>
      </div>
    </div>
  );
}