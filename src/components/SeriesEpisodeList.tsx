import { Channel } from '../types/iptv';

interface SeriesEpisodeListProps {
  episodes: Channel[];
  currentSeason: number;
  currentEpisode: number;
  onEpisodeSelect: (episode: Channel) => void;
}

export default function SeriesEpisodeList({ 
  episodes, 
  currentSeason, 
  currentEpisode, 
  onEpisodeSelect 
}: SeriesEpisodeListProps) {
  // Agrupa episódios por temporada
  const seasonGroups = episodes.reduce((groups, episode) => {
    const season = episode.seriesInfo?.season || 1;
    if (!groups[season]) {
      groups[season] = [];
    }
    groups[season].push(episode);
    return groups;
  }, {} as Record<number, Channel[]>);

  return (
    <div className="bg-gray-900 p-4">
      {/* Seletor de Temporadas */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {Object.keys(seasonGroups).map((season) => (
          <button
            key={season}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentSeason === Number(season)
                ? 'bg-red-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
            onClick={() => {
              const firstEpisode = seasonGroups[Number(season)][0];
              onEpisodeSelect(firstEpisode);
            }}
          >
            Temporada {season}
          </button>
        ))}
      </div>

      {/* Lista de Episódios */}
      <div className="flex gap-4 overflow-x-auto">
        {seasonGroups[currentSeason]?.map((episode) => (
          <div
            key={episode.id}
            className={`flex-shrink-0 w-64 bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 ${
              currentEpisode === episode.seriesInfo?.episode
                ? 'ring-2 ring-red-500'
                : ''
            }`}
            onClick={() => onEpisodeSelect(episode)}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-700">
              <img
                src={episode.logo}
                alt={episode.name}
                className="w-full h-full object-cover"
              />
              {/* Progresso */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                <div
                  className="h-full bg-red-500"
                  style={{
                    width: `${getEpisodeProgress(episode.id) * 100}%`
                  }}
                />
              </div>
            </div>

            {/* Info */}
            <div className="p-3">
              <h3 className="text-white font-medium mb-1">
                Episódio {episode.seriesInfo?.episode}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-2">
                {episode.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 