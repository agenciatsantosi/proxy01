import { useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { PlayerState } from '../../types/iptv';

interface VideoControlsProps {
  playerState: PlayerState;
  onPlayerStateChange: (state: Partial<PlayerState>) => void;
  onFullscreenToggle: () => void;
  isFullscreen: boolean;
}

export function VideoControls({ 
  playerState, 
  onPlayerStateChange,
  onFullscreenToggle,
  isFullscreen
}: VideoControlsProps) {
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  if (!showControls) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onPlayerStateChange({ isPlaying: !playerState.isPlaying })}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          {playerState.isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white" />
          )}
        </button>

        <button
          onClick={() => onPlayerStateChange({ isMuted: !playerState.isMuted })}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          {playerState.isMuted ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </button>

        <button
          onClick={onFullscreenToggle}
          className="p-2 hover:bg-white/20 rounded-full transition-colors ml-auto"
        >
          {isFullscreen ? (
            <Minimize className="w-5 h-5 text-white" />
          ) : (
            <Maximize className="w-5 h-5 text-white" />
          )}
        </button>
      </div>
    </div>
  );
}