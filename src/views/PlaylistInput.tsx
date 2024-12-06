import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { usePlaylist } from '../contexts/PlaylistContext';
import { Plus, Link, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PlaylistInput() {
  const navigate = useNavigate();
  const { createProfile } = useProfile();
  const { handlePlaylistLoad } = usePlaylist();
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !name) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Erro ao carregar lista');
      
      const content = await response.text();
      if (!content.trim().startsWith('#EXTM3U')) {
        throw new Error('Formato de lista inválido');
      }

      await createProfile(name);
      await handlePlaylistLoad(content);
      
      navigate('/dashboard');
      toast.success('Lista carregada com sucesso');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar lista. Verifique a URL e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!name) {
      toast.error('Digite um nome para o perfil');
      return;
    }

    setIsLoading(true);

    try {
      const content = await file.text();
      if (!content.trim().startsWith('#EXTM3U')) {
        throw new Error('Formato de arquivo inválido');
      }

      await createProfile(name);
      await handlePlaylistLoad(content);
      
      navigate('/dashboard');
      toast.success('Lista carregada com sucesso');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar arquivo. Verifique se é uma lista M3U válida.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            IPTV Player
          </h1>
          <p className="text-gray-400">
            Carregue sua lista M3U para começar
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nome do Perfil
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Minha Lista"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                URL da Lista
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full px-4 py-2 flex items-center justify-center gap-2
                bg-purple-600 text-white rounded-lg
                hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              `}
            >
              <Link className="w-5 h-5" />
              {isLoading ? 'Carregando...' : 'Carregar URL'}
            </button>
          </form>

          <div className="mt-4 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">ou</span>
            </div>
          </div>

          <div className="mt-4">
            <label className={`
              w-full px-4 py-2 flex items-center justify-center gap-2
              bg-gray-700 text-white rounded-lg cursor-pointer
              hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            `}>
              <Upload className="w-5 h-5" />
              {isLoading ? 'Carregando...' : 'Carregar Arquivo'}
              <input
                type="file"
                accept=".m3u,.m3u8"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isLoading}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
