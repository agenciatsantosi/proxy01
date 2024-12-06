import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { PlayerState } from '../../types/iptv';

interface HLSPlayerProps {
  url: string;
  playerState: PlayerState;
  onPlayerStateChange: (state: Partial<PlayerState>) => void;
  onError: (message: string) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export function HLSPlayer({ url, playerState, onPlayerStateChange, onError, videoRef }: HLSPlayerProps) {
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (!url) return;

    const video = videoRef.current;
    if (!video) return;

    try {
      video.src = url;
      video.load();
      video.play().catch(err => {
        console.error('Erro ao iniciar playback:', err);
        onError('Erro ao iniciar reprodução');
      });
    } catch (error) {
      console.error('Erro ao configurar vídeo:', error);
      onError('Erro ao configurar player');
    }

    return () => {
      if (video) {
        video.pause();
        video.src = '';
        video.load();
      }
    };
  }, [url, videoRef, onError]);

  return (
    <video
      ref={videoRef}
      className="w-full h-full"
      autoPlay
      playsInline
      controls
      onPlay={() => onPlayerStateChange({ isPlaying: true })}
      onPause={() => onPlayerStateChange({ isPlaying: false })}
      onWaiting={() => onPlayerStateChange({ isBuffering: true })}
      onPlaying={() => onPlayerStateChange({ isBuffering: false })}
      onError={(e) => {
        console.error('Erro no vídeo:', e);
        onError('Erro ao reproduzir vídeo');
      }}
    />
  );
}