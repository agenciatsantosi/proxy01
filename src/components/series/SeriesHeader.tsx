import { Heart, X } from 'lucide-react';
import { Channel } from '../../types/iptv';

interface SeriesHeaderProps {
  series: Channel;
  currentEpisode: Channel;
  isFavorite: boolean;
  autoplayEnabled: boolean;
  onToggleFavorite: () => void;
  onToggleAutoplay: () => void;
  onClose: () => void;
}

export function SeriesHeader({
  series,
  currentEpisode,
  isFavorite,
  autoplayEnabled,
  onToggleFavorite,
  onToggleAutoplay,
  onClose
}: SeriesHeaderProps) {
  return (
    <div className="relative">
      {/* Background com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />

      <div className="relative px-6 py-4 flex items-center justify-between">
        {/* Informações da série */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {series.name}
          </h1>
          <p className="text-gray-300 text-sm">
            Temporada {currentEpisode.seriesInfo?.season} • 
            Episódio {currentEpisode.seriesInfo?.episode}
          </p>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-4">
          {/* Favorito */}
          <button
            onClick={onToggleFavorite}
            className={`p-2 rounded-full transition-colors ${
              isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Autoplay */}
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={autoplayEnabled}
              onChange={(e) => onToggleAutoplay()}
              className="w-4 h-4 rounded border-gray-600 text-red-500 focus:ring-red-500"
            />
            Autoplay
          </label>

          {/* Fechar */}
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
} 