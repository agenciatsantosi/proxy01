import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { Play, ArrowLeft } from 'lucide-react';
import { usePlaylist } from '../contexts/PlaylistContext';
import { Channel } from '../types/iptv';

export default function SeriesDetailsView() {
  const { seriesName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { setSelectedChannel } = usePlaylist();
  const episodes = location.state?.episodes as Channel[] || [];

  // Agrupa episódios por temporada
  const seasonGroups = useMemo(() => {
    const groups: Record<number, Channel[]> = {};
    
    episodes.forEach(episode => {
      const season = episode.seriesInfo?.season || 1;
      if (!groups[season]) {
        groups[season] = [];
      }
      groups[season].push(episode);
    });

    // Ordena episódios dentro de cada temporada
    Object.values(groups).forEach(seasonEpisodes => {
      seasonEpisodes.sort((a, b) => 
        (a.seriesInfo?.episode || 0) - (b.seriesInfo?.episode || 0)
      );
    });

    return groups;
  }, [episodes]);

  // Redireciona se não houver episódios
  useEffect(() => {
    if (episodes.length === 0) {
      navigate('/series');
    }
  }, [episodes, navigate]);

  if (episodes.length === 0) return null;

  const firstEpisode = episodes[0];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={firstEpisode.seriesInfo?.poster || firstEpisode.logo}
            alt={seriesName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <button
            onClick={() => navigate('/series')}
            className="absolute top-6 left-6 text-white hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-4xl font-bold text-white mb-4">{seriesName}</h1>
            <div className="flex items-center gap-4 text-gray-300 text-sm">
              <span>{Object.keys(seasonGroups).length} Temporadas</span>
              <span>{episodes.length} Episódios</span>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes List */}
      <div className="max-w-7xl mx-auto p-6">
        {Object.entries(seasonGroups).map(([season, seasonEpisodes]) => (
          <div key={season} className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Temporada {season}
            </h2>
            
            <div className="space-y-4">
              {seasonEpisodes.map((episode) => (
                <button
                  key={episode.id}
                  onClick={() => setSelectedChannel(episode)}
                  className="w-full flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
                >
                  {/* Thumbnail ou número do episódio */}
                  <div className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center">
                    <Play className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                  </div>

                  {/* Informações do episódio */}
                  <div className="flex-1 text-left">
                    <h3 className="text-white font-medium">
                      Episódio {episode.seriesInfo?.episode}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {episode.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}