import { useEffect, useRef, useState } from 'react';
import { getStreamUrl } from '../utils/streamUrl';
import { HLSPlayer } from './video/HLSPlayer';
import { PlayerState } from '../types/iptv';
import { VideoControls } from './video/VideoControls';
import { LoadingSpinner } from './LoadingSpinner';

interface VideoPlayerProps {
  url: string;
  title?: string;
  playerState: PlayerState;
  onPlayerStateChange: (state: Partial<PlayerState>) => void;
}

export default function VideoPlayer({ url, title, playerState, onPlayerStateChange }: VideoPlayerProps) {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log('Trying to play URL:', url);
    setIsLoading(true);
    setError('');

    // Usa o servidor local para converter se necessário
    const streamUrl = getStreamUrl(url);
    setCurrentUrl(streamUrl);
    setIsLoading(false);
  }, [url]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <div className="text-center p-4">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => {
              setError('');
              setCurrentUrl(getStreamUrl(url));
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      {isLoading && <LoadingSpinner />}
      
      <HLSPlayer
        url={currentUrl}
        playerState={playerState}
        onPlayerStateChange={onPlayerStateChange}
        onError={setError}
        videoRef={videoRef}
      />

      <VideoControls
        playerState={playerState}
        onPlayerStateChange={onPlayerStateChange}
        onFullscreenToggle={() => {
          if (videoRef.current) {
            if (!document.fullscreenElement) {
              videoRef.current.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
          }
        }}
        isFullscreen={!!document.fullscreenElement}
      />
    </div>
  );
}