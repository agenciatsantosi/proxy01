import { PlayCircle, CheckCircle } from 'lucide-react';
import { Channel, SeriesProgress } from '../../types/iptv';

interface EpisodeCardProps {
  episode: Channel;
  isActive: boolean;
  progress: SeriesProgress;
  onClick: () => void;
}

export function EpisodeCard({ episode, isActive, progress, onClick }: EpisodeCardProps) {
  const episodeProgress = progress[episode.id];
  const progressPercent = episodeProgress 
    ? (episodeProgress.time / episodeProgress.duration) * 100 
    : 0;

  const isCompleted = progressPercent > 90;

  return (
    <div 
      className={`group relative flex-shrink-0 w-72 bg-gray-800/90 backdrop-blur-sm rounded-lg 
        overflow-hidden hover:transform hover:scale-105 transition-all duration-300
        ${isActive ? 'ring-2 ring-red-500' : ''}`}
      onClick={onClick}
    >
      {/* Thumbnail com overlay */}
      <div className="relative aspect-video">
        <img 
          src={episode.logo} 
          alt={episode.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Status indicators */}
        <div className="absolute top-2 right-2 flex gap-2">
          {isCompleted && (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
        </div>

        {/* Play button no hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <PlayCircle className="w-16 h-16 text-white/90 drop-shadow-lg" />
        </div>

        {/* Barra de progresso */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
          <div 
            className="h-full bg-red-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Informações do episódio */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-white">
            Episódio {episode.seriesInfo?.episode}
          </h3>
          {episodeProgress?.lastWatched && (
            <span className="text-xs text-gray-400">
              {new Date(episodeProgress.lastWatched).toLocaleDateString()}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-400 line-clamp-2">
          {episode.name}
        </p>
      </div>
    </div>
  );
} 