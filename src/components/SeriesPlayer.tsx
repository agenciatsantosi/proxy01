import { useEffect, useState } from 'react';
import VideoPlayer from './VideoPlayer';
import SeriesEpisodeList from './SeriesEpisodeList';
import { Channel, PlayerState } from '../types/iptv';

// Chave para salvar progresso no localStorage
const PROGRESS_KEY = 'series_progress';

interface SeriesProgress {
  [seriesId: string]: {
    [episodeId: string]: number; // tempo em segundos
  };
}

interface SeriesPlayerProps {
  series: Channel;
  episodes: Channel[];
  onClose: () => void;
}

export default function SeriesPlayer({ series, episodes, onClose }: SeriesPlayerProps) {
  const [currentEpisode, setCurrentEpisode] = useState(episodes[0]);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: true,
    isMuted: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isBuffering: false,
    isFullscreen: false,
    showControls: true
  });

  // Carrega o progresso salvo
  useEffect(() => {
    const savedProgress = getSavedProgress(series.id, currentEpisode.id);
    if (savedProgress > 0) {
      setPlayerState(prev => ({
        ...prev,
        currentTime: savedProgress
      }));
    }
  }, [currentEpisode.id]);

  // Salva progresso periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      saveProgress(series.id, currentEpisode.id, playerState.currentTime);
    }, 5000);

    return () => clearInterval(interval);
  }, [series.id, currentEpisode.id, playerState.currentTime]);

  const handleEpisodeEnd = () => {
    if (!autoplayEnabled) return;

    const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id);
    if (currentIndex < episodes.length - 1) {
      setCurrentEpisode(episodes[currentIndex + 1]);
    }
  };

  const handleEpisodeSelect = (episode: Channel) => {
    setCurrentEpisode(episode);
    setPlayerState(prev => ({
      ...prev,
      currentTime: getSavedProgress(series.id, episode.id),
      isPlaying: true
    }));
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 p-4 flex items-center justify-between">
          <h1 className="text-white text-xl font-bold">{series.name}</h1>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={autoplayEnabled}
                onChange={(e) => setAutoplayEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600"
              />
              Autoplay
            </label>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Player */}
        <div className="flex-1">
          <VideoPlayer
            url={currentEpisode.url}
            playerState={playerState}
            onPlayerStateChange={setPlayerState}
            title={`${series.name} - S${currentEpisode.seriesInfo?.season}E${currentEpisode.seriesInfo?.episode}`}
            onEnded={handleEpisodeEnd}
          />
        </div>

        {/* Lista de Episódios */}
        <SeriesEpisodeList
          episodes={episodes}
          currentSeason={currentEpisode.seriesInfo?.season || 1}
          currentEpisode={currentEpisode.seriesInfo?.episode || 1}
          onEpisodeSelect={handleEpisodeSelect}
        />
      </div>
    </div>
  );
}

// Funções auxiliares para gerenciar progresso
function getSavedProgress(seriesId: string, episodeId: string): number {
  try {
    const progress: SeriesProgress = JSON.parse(
      localStorage.getItem(PROGRESS_KEY) || '{}'
    );
    return progress[seriesId]?.[episodeId] || 0;
  } catch {
    return 0;
  }
}

function saveProgress(seriesId: string, episodeId: string, time: number) {
  try {
    const progress: SeriesProgress = JSON.parse(
      localStorage.getItem(PROGRESS_KEY) || '{}'
    );
    
    if (!progress[seriesId]) {
      progress[seriesId] = {};
    }
    
    progress[seriesId][episodeId] = time;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Erro ao salvar progresso:', error);
  }
} 