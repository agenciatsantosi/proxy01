import { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { fetchM3UContent } from '../utils/fetchM3U';
import { isValidUrl } from '../utils/validation';

interface UrlInputProps {
  onUrlSubmit: (content: string) => void;
  onError: (message: string) => void;
}

export default function UrlInput({ onUrlSubmit, onError }: UrlInputProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inputError, setInputError] = useState('');

  const handleSubmit = async () => {
    if (!url) return;

    if (!isValidUrl(url)) {
      setInputError('URL inválida. Por favor, insira uma URL válida.');
      return;
    }

    setIsLoading(true);
    setInputError('');
    
    try {
      const content = await fetchM3UContent(url);
      onUrlSubmit(content);
      setUrl('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar a lista';
      setInputError(message);
      onError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <p className="text-center mb-4 text-sm text-gray-600 dark:text-gray-400">
        Ou insira uma URL da lista M3U
      </p>
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setInputError('');
          }}
          placeholder="https://exemplo.com/lista.m3u"
          className={`flex-1 px-4 py-2 rounded-lg border ${
            inputError 
              ? 'border-red-300 dark:border-red-700' 
              : 'border-gray-200 dark:border-gray-700'
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
          disabled={isLoading}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !url}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? 'Carregando...' : 'Carregar'}
        </button>
      </div>
      
      {inputError && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>{inputError}</p>
        </div>
      )}
    </div>
  );
}