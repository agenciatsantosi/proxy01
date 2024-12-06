import { useEffect, useState } from 'react';
import { Plus, Trash2, RefreshCw, ExternalLink, Play, Tv, Film, Clapperboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { usePlaylist } from '../contexts/PlaylistContext';
import ViewHeader from '../components/ViewHeader';
import { Channel } from '../types/iptv';

interface ChannelCounts {
  tv: number;
  series: number;
  movies: number;
  total: number;
}

export default function ListView() {
  const navigate = useNavigate();
  const { activeProfile, playlists, updatePlaylist, removePlaylist } = useProfile();
  const { handlePlaylistLoad } = usePlaylist();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPlaylistId, setLoadingPlaylistId] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Função para contar canais por tipo
  const countChannelTypes = (content: string): ChannelCounts => {
    const counts = { tv: 0, series: 0, movies: 0, total: 0 };
    
    try {
      const lines = content.split('\n');
      let currentType = '';

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('#EXTINF:')) {
          const groupMatch = line.match(/group-title="([^"]+)"/i);
          const group = groupMatch ? groupMatch[1].toLowerCase() : '';
          
          // Determina o tipo baseado no grupo
          if (group.includes('film') || group.includes('vod') || group.includes('movie')) {
            currentType = 'movie';
          } else if (group.includes('serie')) {
            currentType = 'series';
          } else {
            currentType = 'tv';
          }
        } else if (line.startsWith('http')) {
          counts.total++;
          switch (currentType) {
            case 'tv': counts.tv++; break;
            case 'series': counts.series++; break;
            case 'movie': counts.movies++; break;
          }
        }
      }
    } catch (error) {
      console.error('Erro ao contar canais:', error);
    }

    return counts;
  };

  const handlePlaylist = async (playlistId: string, content: string) => {
    try {
      setLoadingPlaylistId(playlistId);
      setError('');
      await handlePlaylistLoad(content);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao carregar lista:', error);
      setError('Erro ao carregar lista. Por favor, tente novamente.');
    } finally {
      setLoadingPlaylistId(null);
    }
  };

  const handleRefresh = async (url: string, playlistId: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Erro ao atualizar lista');
      
      const content = await response.text();
      if (!content.trim().startsWith('#EXTM3U')) {
        throw new Error('Formato de lista inválido');
      }
      
      await updatePlaylist(playlistId, content);
      setError('');
    } catch (error) {
      console.error('Erro ao atualizar lista:', error);
      setError('Erro ao atualizar lista. Verifique sua conexão e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (playlistId: string) => {
    try {
      await removePlaylist(playlistId);
    } catch (error) {
      console.error('Erro ao remover lista:', error);
      setError('Erro ao remover lista');
    }
  };

  useEffect(() => {
    if (!activeProfile) {
      navigate('/');
    }
  }, [activeProfile, navigate]);

  if (!activeProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <ViewHeader title="Minhas Listas" />
          <button
            onClick={() => navigate('/add-playlist')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Adicionar Lista
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          {playlists.map(playlist => {
            const counts = countChannelTypes(playlist.content);
            
            return (
              <div
                key={playlist.id}
                className="bg-gray-800 rounded-lg p-4"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white mb-1">
                        {playlist.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Última atualização: {new Date(playlist.lastUpdate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePlaylist(playlist.id, playlist.content)}
                        disabled={loadingPlaylistId === playlist.id}
                        className={`p-2 text-gray-400 hover:text-green-500 transition-colors ${
                          loadingPlaylistId === playlist.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title="Carregar Lista"
                      >
                        <Play className={`w-5 h-5 ${loadingPlaylistId === playlist.id ? 'animate-pulse' : ''}`} />
                      </button>
                      
                      {playlist.url && (
                        <>
                          <button
                            onClick={() => handleRefresh(playlist.url, playlist.id)}
                            disabled={isLoading}
                            className="p-2 text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-50"
                            title="Atualizar Lista"
                          >
                            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                          </button>
                          <a
                            href={playlist.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-purple-500 transition-colors"
                            title="Abrir URL"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        </>
                      )}
                      
                      <button
                        onClick={() => handleRemove(playlist.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remover Lista"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="bg-gray-900/50 rounded p-2">
                      <p className="text-gray-400 text-sm">Total</p>
                      <p className="text-white font-medium">{counts.total}</p>
                    </div>
                    <div className="bg-gray-900/50 rounded p-2">
                      <p className="text-gray-400 text-sm">TV</p>
                      <p className="text-white font-medium">{counts.tv}</p>
                    </div>
                    <div className="bg-gray-900/50 rounded p-2">
                      <p className="text-gray-400 text-sm">Filmes</p>
                      <p className="text-white font-medium">{counts.movies}</p>
                    </div>
                    <div className="bg-gray-900/50 rounded p-2">
                      <p className="text-gray-400 text-sm">Séries</p>
                      <p className="text-white font-medium">{counts.series}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {playlists.length === 0 && (
            <div className="text-center py-12 bg-gray-800 rounded-lg">
              <Plus className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                Você ainda não tem nenhuma lista.
                <br />
                Clique em "Adicionar Lista" para começar.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}