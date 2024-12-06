import { useEffect, useState } from 'react';
import VideoPlayer from '../VideoPlayer';
import { Channel, PlayerState } from '../../types/iptv';
import { SeriesHeader } from './SeriesHeader';
import { SeriesNavigation } from './SeriesNavigation';
import { useSeriesState } from '../../hooks/useSeriesState';
import { storageService } from '../../services/storageService';

interface SeriesPlayerProps {
  series: Channel;
  episodes: Channel[];
  onClose: () => void;
}

// Mudando para export default
export default function SeriesPlayer({ series, episodes, onClose }: SeriesPlayerProps) {
  const {
    currentEpisode,
    setCurrentEpisode,
    progress,
    updateProgress,
    autoplayEnabled,
    setAutoplayEnabled,
    favorites,
    toggleFavorite
  } = useSeriesState(series, episodes);

  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: true,
    isMuted: false,
    volume: 1,
    currentTime: 0,
    duration: 0,
    isBuffering: false,
    isFullscreen: false,
    showControls: true
  });

  const handlePlayerStateChange = (state: Partial<PlayerState>) => {
    setPlayerState(prev => {
      const newState = { ...prev, ...state };
      if (state.currentTime) {
        updateProgress(currentEpisode.id, state.currentTime, prev.duration);
      }
      return newState;
    });
  };

  const handleEpisodeEnd = () => {
    if (!autoplayEnabled) return;

    const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id);
    if (currentIndex < episodes.length - 1) {
      setCurrentEpisode(episodes[currentIndex + 1]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="h-full flex flex-col">
        <SeriesHeader
          series={series}
          currentEpisode={currentEpisode}
          isFavorite={favorites.includes(series.id)}
          autoplayEnabled={autoplayEnabled}
          onToggleFavorite={toggleFavorite}
          onToggleAutoplay={() => setAutoplayEnabled(!autoplayEnabled)}
          onClose={onClose}
        />

        <div className="flex-1">
          <VideoPlayer
            url={currentEpisode.url}
            playerState={playerState}
            onPlayerStateChange={handlePlayerStateChange}
            title={`${series.name} - S${currentEpisode.seriesInfo?.season}E${currentEpisode.seriesInfo?.episode}`}
            onEnded={handleEpisodeEnd}
          />
        </div>

        <SeriesNavigation
          episodes={episodes}
          currentEpisode={currentEpisode}
          onEpisodeSelect={setCurrentEpisode}
        />
      </div>
    </div>
  );
} 