import { useState } from 'react';
import { AuthCredentials } from '../types/iptv';
import { Loader2 } from 'lucide-react';

interface AuthFormProps {
  onSubmit: (credentials: AuthCredentials) => Promise<void>;
}

export function AuthForm({ onSubmit }: AuthFormProps) {
  const [credentials, setCredentials] = useState<AuthCredentials>({
    username: '',
    password: '',
    url: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onSubmit(credentials);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao autenticar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          URL do Servidor
        </label>
        <input
          type="url"
          value={credentials.url}
          onChange={e => setCredentials(prev => ({ ...prev, url: e.target.value }))}
          placeholder="http://exemplo.com:8080"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Usuário
        </label>
        <input
          type="text"
          value={credentials.username}
          onChange={e => setCredentials(prev => ({ ...prev, username: e.target.value }))}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Senha
        </label>
        <input
          type="password"
          value={credentials.password}
          onChange={e => setCredentials(prev => ({ ...prev, password: e.target.value }))}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
          required
        />
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {isLoading ? 'Carregando...' : 'Carregar Lista'}
      </button>
    </form>
  );
} 