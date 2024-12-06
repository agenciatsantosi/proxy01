import { usePlaylist } from '../contexts/PlaylistContext';
import { Tv } from 'lucide-react';
import { getProxiedImageUrl } from '../utils/imageProxy';
import ViewHeader from '../components/ViewHeader';
import { CONTENT_TYPES } from '../utils/constants';
import { Channel } from '../types/iptv';

export default function TvView() {
  const { channels, setSelectedChannel } = usePlaylist();
  const tvChannels = channels.filter(channel => channel.type === CONTENT_TYPES.TV);

  const handleChannelClick = (channel: Channel) => {
    console.log('Channel clicked:', channel);
    if (channel && channel.url) {
      setSelectedChannel(channel);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <ViewHeader title="TV ao Vivo" />
        
        {tvChannels.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {tvChannels.map(channel => (
              <div
                key={channel.id}
                onClick={() => handleChannelClick(channel)}
                className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
              >
                <div className="aspect-video relative bg-gray-900">
                  {channel.logo ? (
                    <img
                      src={getProxiedImageUrl(channel.logo)}
                      alt={channel.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = ''; // Clear the broken image
                        target.onerror = null; // Prevent infinite loop
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Tv className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-white font-medium truncate">{channel.name}</h3>
                  <p className="text-sm text-gray-400 truncate">{channel.group}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Tv className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Nenhum canal de TV encontrado na lista</p>
          </div>
        )}
      </div>
    </div>
  );
}