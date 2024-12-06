import { useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { usePlaylist } from '../contexts/PlaylistContext';
import { useState } from 'react';
import { Play, RefreshCw, Plus, ExternalLink, Trash2 } from 'lucide-react';
import ViewHeader from '../components/ViewHeader';
import toast from 'react-hot-toast';

export default function PlaylistsView() {
  const navigate = useNavigate();
  const { activeProfile, playlists, updatePlaylist, removePlaylist } = useProfile();
  const { handlePlaylistLoad } = usePlaylist();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPlaylistId, setLoadingPlaylistId] = useState<string | null>(null);

  const handlePlaylist = async (playlistId: string, content: string) => {
    try {
      setLoadingPlaylistId(playlistId);
      await handlePlaylistLoad(content);
      navigate('/dashboard');
      toast.success('Lista carregada com sucesso');
    } catch (error) {
      console.error('Erro ao carregar lista:', error);
      toast.error('Erro ao carregar lista');
    } finally {
      setLoadingPlaylistId(null);
    }
  };

  const handleRefresh = async (url: string, playlistId: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Erro ao atualizar lista');
      
      const content = await response.text();
      if (!content.trim().startsWith('#EXTM3U')) {
        throw new Error('Formato de lista inválido');
      }
      
      await updatePlaylist(playlistId, content);
      toast.success('Lista atualizada com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar lista:', error);
      toast.error('Erro ao atualizar lista. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (playlistId: string) => {
    try {
      await removePlaylist(playlistId);
      toast.success('Lista removida com sucesso');
    } catch (error) {
      console.error('Erro ao remover lista:', error);
      toast.error('Erro ao remover lista');
    }
  };

  if (!activeProfile) {
    navigate('/');
    return null;
  }

  return (
    <div className="p-6">
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

        <div className="grid gap-4">
          {playlists.map(playlist => (
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
              </div>
            </div>
          ))}

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
