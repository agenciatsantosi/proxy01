import { useCallback, memo } from 'react';
import { usePlaylist } from '../contexts/PlaylistContext';
import VideoPlayer from '../components/VideoPlayer';
import { ArrowLeft } from 'lucide-react';

// Header do player memoizado
const PlayerHeader = memo(({ 
  channelName, 
  channelGroup, 
  onBack 
}: { 
  channelName: string; 
  channelGroup: string; 
  onBack: () => void;
}) => (
  <div className="bg-gray-900 p-4 flex items-center gap-4">
    <button
      onClick={onBack}
      className="text-gray-400 hover:text-white transition-colors"
    >
      <ArrowLeft className="w-6 h-6" />
    </button>
    <div>
      <h2 className="text-white font-medium">{channelName}</h2>
      <p className="text-gray-400 text-sm">{channelGroup}</p>
    </div>
  </div>
));

PlayerHeader.displayName = 'PlayerHeader';

// Container do player memoizado
const PlayerContainer = memo(({ 
  url, 
  title, 
  playerState, 
  onPlayerStateChange 
}: { 
  url: string; 
  title: string; 
  playerState: any; 
  onPlayerStateChange: (state: any) => void;
}) => (
  <div className="flex-1 relative bg-black">
    <VideoPlayer
      url={url}
      title={title}
      playerState={playerState}
      onPlayerStateChange={onPlayerStateChange}
    />
  </div>
));

PlayerContainer.displayName = 'PlayerContainer';

function PlayerView() {
  const { selectedChannel, playerState, setSelectedChannel, updatePlayerState } = usePlaylist();

  const handleBack = useCallback(() => {
    setSelectedChannel(undefined);
  }, [setSelectedChannel]);

  if (!selectedChannel) return null;

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-50">
      <PlayerHeader
        channelName={selectedChannel.name}
        channelGroup={selectedChannel.group}
        onBack={handleBack}
      />
      <PlayerContainer
        url={selectedChannel.url}
        title={selectedChannel.name}
        playerState={playerState}
        onPlayerStateChange={updatePlayerState}
      />
    </div>
  );
}

// Memoiza o componente PlayerView inteiro
export default memo(PlayerView);
