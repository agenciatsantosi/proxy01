import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';
import { usePlaylist } from '../contexts/PlaylistContext';
import ViewHeader from '../components/ViewHeader';
import VideoPlayer from '../components/VideoPlayer';
import { getProxiedImageUrl } from '../utils/imageProxy';
import { CONTENT_TYPES } from '../utils/constants';

export default function MovieDetailsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { channels, setSelectedChannel, selectedChannel, playerState, updatePlayerState } = usePlaylist();

  const movie = channels.find(channel => 
    channel.id === id && channel.type === CONTENT_TYPES.MOVIES
  );

  useEffect(() => {
    if (movie) {
      setSelectedChannel(movie);
    } else {
      navigate('/movies');
    }
  }, [movie, setSelectedChannel, navigate]);

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Player de Vídeo */}
      <div className="w-full aspect-video bg-black">
        <VideoPlayer
          url={movie.url}
          playerState={playerState}
          onPlayerStateChange={updatePlayerState}
          title={movie.name}
        />
      </div>

      {/* Informações do Filme */}
      <div className="max-w-7xl mx-auto p-6">
        <ViewHeader title={movie.name} />
        
        <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-8">
          {/* Poster */}
          <div className="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden">
            {movie.logo ? (
              <img
                src={getProxiedImageUrl(movie.logo)}
                alt={movie.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Film className="w-20 h-20 text-gray-600" />
              </div>
            )}
          </div>

          {/* Detalhes */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-4">{movie.name}</h1>
            <div className="space-y-4 text-gray-300">
              <p className="text-lg">{movie.group}</p>
              {/* Adicione mais informações do filme conforme necessário */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 