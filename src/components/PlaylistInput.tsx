import { useState, useEffect } from 'react';
import { Upload, Link, Loader2, AlertCircle } from 'lucide-react';
import { fetchM3UContent } from '../utils/fetchM3U';
import { readFileChunks } from '../utils/fileReader';
import { useNavigate } from 'react-router-dom';
import { usePlaylist } from '../contexts/PlaylistContext';
import { M3UProcessor } from '../services/m3uProcessor';

interface PlaylistInputProps {
  onPlaylistLoad: (content: string) => void;
}

export default function PlaylistInput({ onPlaylistLoad }: PlaylistInputProps) {
  const navigate = useNavigate();
  const { handlePlaylistLoad } = usePlaylist();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState({ status: '', percent: 0 });

  useEffect(() => {
    if (!handlePlaylistLoad) {
      navigate('/');
    }
  }, [handlePlaylistLoad, navigate]);

  const updateProgress = (status: string, percent: number = 0) => {
    setProgress({ status, percent });
  };

  const handleSaveAndLoadPlaylist = async (content: string, name: string, url: string = '') => {
    try {
      updateProgress('Processando lista...', 30);
      
      // Processa e otimiza a lista
      const optimizedContent = await M3UProcessor.validateAndOptimizeM3U(content);
      
      updateProgress('Validando conteúdo...', 60);
      await onPlaylistLoad(optimizedContent);
      
      updateProgress('Salvando lista...', 80);
      await handlePlaylistLoad(optimizedContent);
      
      updateProgress('Concluído!', 100);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao processar lista:', error);
      setError(error instanceof Error ? error.message : 'Erro ao salvar a lista. Por favor, tente novamente.');
      throw error;
    }
  };

  const handleUrlSubmit = async () => {
    if (!url) return;
    
    setIsLoading(true);
    setError('');
    updateProgress('Carregando lista...', 10);
    
    try {
      const content = await fetchM3UContent(url);
      
      // Extrai o nome da URL ou usa um nome padrão
      const name = url.split('/').pop()?.split('?')[0] || 'Minha Lista';
      await handleSaveAndLoadPlaylist(content, name, url);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar lista');
    } finally {
      setIsLoading(false);
      setProgress({ status: '', percent: 0 });
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError('');
    updateProgress('Lendo arquivo...', 10);

    try {
      const content = await readFileChunks(file, (percent) => {
        updateProgress('Lendo arquivo...', 10 + (percent * 0.2));
      });
      await handleSaveAndLoadPlaylist(content, file.name);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao ler arquivo');
    } finally {
      setIsLoading(false);
      setProgress({ status: '', percent: 0 });
    }
  };

  // Se não houver perfil ativo, não renderiza nada
  if (!handlePlaylistLoad) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-xl w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            Adicionar Lista
          </h2>
        </div>

        <div className="space-y-8">
          <div
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFileChange({ target: { files: [file] } });
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="mb-4 text-gray-400">
              Arraste e solte seu arquivo M3U aqui, ou
            </p>
            <label className="inline-block">
              <input
                type="file"
                accept=".m3u,.m3u8"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">
                Selecionar Arquivo
              </span>
            </label>
          </div>

          <div className="space-y-4">
            <p className="text-center text-gray-400">Ou insira a URL da lista M3U</p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Link className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://exemplo.com/lista.m3u"
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleUrlSubmit}
                disabled={isLoading || !url}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading ? 'Carregando...' : 'Carregar'}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 text-red-400 bg-red-500/10 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}