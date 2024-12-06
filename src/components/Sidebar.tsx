import { Link, useLocation } from 'react-router-dom';
import { Tv, Film, PlaySquare, Heart, Settings, List } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { CONTENT_TYPES } from '../utils/constants';
import { memo, useMemo } from 'react';

const menuItems = [
  { to: '/tv', label: 'TV Online', icon: Tv },
  { to: '/movies', label: 'Filmes', icon: Film },
  { to: '/series', label: 'Séries', icon: PlaySquare },
  { to: '/favorites', label: 'Favoritos', icon: Heart },
  { to: '/playlists', label: 'Minhas Listas', icon: List },
  { to: '/settings', label: 'Configurações', icon: Settings },
] as const;

// Componente de item do menu memoizado
const MenuItem = memo(({ 
  to, 
  label, 
  icon: Icon, 
  isActive, 
  badge 
}: { 
  to: string; 
  label: string; 
  icon: typeof Tv; 
  isActive: boolean;
  badge?: number;
}) => (
  <Link
    to={to}
    className={`
      flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
      ${isActive
        ? 'bg-purple-600 text-white'
        : 'text-gray-400 hover:bg-gray-700'}
    `}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className="ml-auto px-2 py-0.5 text-sm bg-gray-700 rounded-full">
        {badge}
      </span>
    )}
  </Link>
));

MenuItem.displayName = 'MenuItem';

function Sidebar() {
  const location = useLocation();
  const { favorites } = useFavorites();
  
  // Calcula o total de favoritos apenas quando os favoritos mudarem
  const totalFavorites = useMemo(() => 
    favorites[CONTENT_TYPES.TV].length + 
    favorites[CONTENT_TYPES.SERIES].length + 
    favorites[CONTENT_TYPES.MOVIE].length,
    [favorites]
  );

  return (
    <aside className="w-64 min-h-screen bg-gray-800 p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">IPTV Player</h1>
      </div>

      <nav className="space-y-2">
        {menuItems.map(item => (
          <MenuItem
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            isActive={location.pathname === item.to}
            badge={item.to === '/favorites' ? totalFavorites : undefined}
          />
        ))}
      </nav>
    </aside>
  );
}

// Memoiza o componente Sidebar inteiro
export default memo(Sidebar);
