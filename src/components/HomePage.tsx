import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Channel } from '../types/iptv';
import { usePlaylist } from '../contexts/PlaylistContext';
import VideoPlayer from './VideoPlayer';
import ContentList from './ContentList';
import PlaylistInput from './PlaylistInput';
import { Tv } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();
  const { channels, selectedChannel, playerState, handlePlaylistLoad, setSelectedChannel, updatePlayerState } = usePlaylist();

  const filteredContent = useMemo(() => {
    if (!channels || channels.length === 0) return {
      movies: [],
      series: [],
      tv: []
    };

    return {
      movies: channels.filter(channel => channel.type === 'movie'),
      series: channels.filter(channel => channel.type === 'series'),
      tv: channels.filter(channel => channel.type === 'tv')
    };
  }, [channels]);

  const handleSeriesSelect = (series: Channel) => {
    navigate(`/series/${encodeURIComponent(series.seriesInfo?.name || '')}`);
  };

  if (channels.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-xl">
            <div className="text-center mb-8">
              <Tv className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">IPTV Player</h1>
              <p className="text-gray-400">
                Carregue sua lista M3U para começar a assistir
              </p>
            </div>
            
            <PlaylistInput onPlaylistLoad={handlePlaylistLoad} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {selectedChannel && (
        <div className="w-full aspect-video bg-black">
          <VideoPlayer
            url={selectedChannel.url}
            playerState={playerState}
            onPlayerStateChange={updatePlayerState}
            title={selectedChannel.name}
          />
        </div>
      )}

      <div className="container mx-auto p-4">
        {filteredContent.tv.length > 0 && (
          <ContentList
            title="TV ao Vivo"
            items={filteredContent.tv}
            onItemSelect={setSelectedChannel}
          />
        )}

        {filteredContent.movies.length > 0 && (
          <ContentList
            title="Filmes"
            items={filteredContent.movies}
            onItemSelect={setSelectedChannel}
          />
        )}

        {filteredContent.series.length > 0 && (
          <ContentList
            title="Séries"
            items={filteredContent.series}
            onItemSelect={handleSeriesSelect}
          />
        )}
      </div>
    </div>
  );
} 