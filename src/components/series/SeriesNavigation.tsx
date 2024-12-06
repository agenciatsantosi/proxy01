import { useState } from 'react';
import { Channel } from '../../types/iptv';

interface SeriesNavigationProps {
  episodes: Channel[];
  currentEpisode: Channel;
  onEpisodeSelect: (episode: Channel) => void;
}

export function SeriesNavigation({ episodes, currentEpisode, onEpisodeSelect }: SeriesNavigationProps) {
  const [selectedSeason, setSelectedSeason] = useState(currentEpisode.seriesInfo?.season || 1);

  const seasons = [...new Set(episodes.map(ep => ep.seriesInfo?.season || 1))];
  const seasonEpisodes = episodes.filter(ep => ep.seriesInfo?.season === selectedSeason);

  return (
    <div className="bg-gray-900">
      {/* Seletor de Temporadas */}
      <SeasonSelector 
        seasons={seasons}
        currentSeason={selectedSeason}
        onSeasonChange={setSelectedSeason}
      />

      {/* Lista de Episódios */}
      <EpisodeList 
        episodes={seasonEpisodes}
        currentEpisode={currentEpisode}
        onEpisodeSelect={onEpisodeSelect}
      />
    </div>
  );
} 