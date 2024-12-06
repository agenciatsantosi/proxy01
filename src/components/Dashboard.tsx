import { Tv, Video, Film, List, Settings, RefreshCw, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { activeProfile, playlists } = useProfile();

  const menuItems = [
    { icon: <Tv className="w-8 h-8 text-yellow-400" />, label: 'TV ao vivo', path: '/tv' },
    { icon: <Film className="w-8 h-8 text-white" />, label: 'Filmes', path: '/movies' },
    { icon: <Video className="w-8 h-8 text-white" />, label: 'Séries', path: '/series' },
    { icon: <List className="w-8 h-8 text-white" />, label: 'Listas', path: '/lists' },
    { icon: <Settings className="w-8 h-8 text-white" />, label: 'Configurações', path: '/settings' },
  ];

  // Se não houver playlists, mostra a tela de adicionar lista
  if (playlists.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Bem-vindo, {activeProfile?.name}!</h1>
          <p className="text-gray-300 mb-8">Você ainda não tem nenhuma lista. Adicione uma para começar.</p>
          <button
            onClick={() => navigate('/add-playlist')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Adicionar Lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
      {/* Logo */}
      <div className="p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-yellow-400">▶</span> Quick Player
          </h1>
          <button
            onClick={() => navigate('/add-playlist')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Adicionar Lista
          </button>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center p-6 bg-purple-800/50 rounded-xl hover:bg-purple-700/50 transition-colors group"
            >
              <div className="mb-3 transform group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <span className="text-white font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Botão Recarregar */}
        <div className="mt-8 flex justify-center">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-purple-800/50 rounded-lg hover:bg-purple-700/50 transition-colors text-white"
          >
            <RefreshCw className="w-5 h-5" />
            Recarregar
          </button>
        </div>

        {/* Informações do Sistema */}
        <div className="mt-8 text-right text-sm text-purple-300/60">
          <p>Versão: 2.0.2</p>
          <p>Página da web: https://quickplayer.app</p>
        </div>
      </div>
    </div>
  );
} 