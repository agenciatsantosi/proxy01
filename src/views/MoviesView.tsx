import { usePlaylist } from '../contexts/PlaylistContext';
import { Film } from 'lucide-react';
import { getProxiedImageUrl } from '../utils/imageProxy';
import ViewHeader from '../components/ViewHeader';
import { CONTENT_TYPES } from '../utils/constants';
import { useState, useMemo } from 'react';
import VirtualGrid from '../components/VirtualGrid';
import { Channel } from '../types/iptv';

const MovieCard = ({ movie, onClick }: { movie: Channel; onClick: () => void }) => (
  <div
    onClick={onClick}
    className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all h-full"
  >
    <div className="aspect-[2/3] relative bg-gray-900">
      {movie.logo ? (
        <img
          src={getProxiedImageUrl(movie.logo)}
          alt={movie.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '';
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Film className="w-12 h-12 text-gray-600" />
        </div>
      )}
    </div>
    <div className="p-3">
      <h3 className="text-white font-medium line-clamp-2">{movie.name}</h3>
      <p className="text-sm text-gray-400 truncate">{movie.group}</p>
    </div>
  </div>
);

export default function MoviesView() {
  const { channels, setSelectedChannel } = usePlaylist();
  const [searchTerm, setSearchTerm] = useState('');

  const movies = useMemo(() => {
    return channels
      .filter(channel => channel.type === CONTENT_TYPES.MOVIES)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [channels]);

  const filteredMovies = useMemo(() => {
    if (!searchTerm) return movies;
    const search = searchTerm.toLowerCase();
    return movies.filter(movie => 
      movie.name.toLowerCase().includes(search) || 
      movie.group.toLowerCase().includes(search)
    );
  }, [movies, searchTerm]);

  const handleMovieClick = (movie: Channel) => {
    console.log('Movie clicked:', movie);
    if (movie && movie.url) {
      setSelectedChannel(movie);
    }
  };

  // Determina o número de colunas com base no tamanho da tela
  const getColumnCount = () => {
    if (window.innerWidth < 640) return 2; // mobile
    if (window.innerWidth < 768) return 3; // tablet
    if (window.innerWidth < 1024) return 4; // laptop
    return 5; // desktop
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <ViewHeader title="Filmes" />
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Buscar filmes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <VirtualGrid
            items={filteredMovies}
            columns={getColumnCount()}
            itemHeight={350} // Ajuste este valor conforme necessário
            renderItem={(movie) => (
              <MovieCard
                movie={movie}
                onClick={() => handleMovieClick(movie)}
              />
            )}
          />
        ) : (
          <div className="text-center py-12">
            <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              {searchTerm 
                ? 'Nenhum filme encontrado para sua busca'
                : 'Nenhum filme encontrado na lista'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}