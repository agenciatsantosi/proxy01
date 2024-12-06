import { useEffect, useRef } from 'react';
import { Channel, SeriesProgress } from '../../types/iptv';
import { EpisodeCard } from './EpisodeCard';

interface EpisodeListProps {
  episodes: Channel[];
  currentEpisode: Channel;
  progress: SeriesProgress;
  onEpisodeSelect: (episode: Channel) => void;
}

export function EpisodeList({ 
  episodes, 
  currentEpisode, 
  progress, 
  onEpisodeSelect 
}: EpisodeListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentEpisodeRef = useRef<HTMLDivElement>(null);

  // Scroll para o episódio atual quando mudar
  useEffect(() => {
    if (currentEpisodeRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: currentEpisodeRef.current.offsetLeft - 100,
        behavior: 'smooth'
      });
    }
  }, [currentEpisode.id]);

  return (
    <div className="relative">
      {/* Gradientes para indicar scroll */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-900 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900 to-transparent z-10" />

      {/* Lista de episódios */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 p-4 overflow-x-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-red-500"
      >
        {episodes.map((episode) => (
          <div
            key={episode.id}
            ref={episode.id === currentEpisode.id ? currentEpisodeRef : null}
          >
            <EpisodeCard
              episode={episode}
              isActive={episode.id === currentEpisode.id}
              progress={progress}
              onClick={() => onEpisodeSelect(episode)}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 