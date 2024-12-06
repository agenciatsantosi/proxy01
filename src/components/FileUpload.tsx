import { useCallback, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { readFileChunks } from '../utils/fileReader';

interface FileUploadProps {
  onFileSelect: (content: string) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateAndReadFile = async (file: File) => {
    setError('');
    setIsLoading(true);

    try {
      if (!file.name.toLowerCase().endsWith('.m3u') && !file.name.toLowerCase().endsWith('.m3u8')) {
        throw new Error('Por favor, selecione um arquivo .m3u ou .m3u8');
      }

      // Removemos o limite de tamanho e usamos leitura em chunks
      const content = await readFileChunks(file);
      
      if (!content.includes('#EXTM3U')) {
        throw new Error('Arquivo inválido. Certifique-se de que é uma lista M3U válida');
      }

      onFileSelect(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao ler o arquivo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndReadFile(file);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndReadFile(file);
    }
  }, []);

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-700'
        }`}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
          {isLoading ? 'Carregando arquivo...' : 'Arraste e solte seu arquivo M3U aqui, ou'}
        </p>
        <label className="inline-block">
          <input
            type="file"
            accept=".m3u,.m3u8"
            onChange={handleFileInput}
            className="hidden"
            disabled={isLoading}
          />
          <span className={`px-4 py-2 text-sm text-white bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}>
            Selecionar Arquivo
          </span>
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}