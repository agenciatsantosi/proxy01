import { createContext, useContext, useEffect, useState } from 'react';
import { CONTENT_TYPES, STORAGE_KEYS } from '../utils/constants';
import { Channel } from '../types/Channel';
import toast from 'react-hot-toast';

interface FavoritesContextData {
  favorites: {
    [CONTENT_TYPES.TV]: Channel[];
    [CONTENT_TYPES.SERIES]: Channel[];
    [CONTENT_TYPES.MOVIE]: Channel[];
  };
  addFavorite: (channel: Channel) => void;
  removeFavorite: (channelId: string, type: string) => void;
  isFavorite: (channelId: string, type: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextData | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoritesContextData['favorites']>({
    [CONTENT_TYPES.TV]: [],
    [CONTENT_TYPES.SERIES]: [],
    [CONTENT_TYPES.MOVIE]: [],
  });

  useEffect(() => {
    const loadFavorites = () => {
      try {
        const savedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        toast.error('Erro ao carregar favoritos');
      }
    };

    loadFavorites();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
      toast.error('Erro ao salvar favoritos');
    }
  }, [favorites]);

  const addFavorite = (channel: Channel) => {
    try {
      setFavorites(prev => ({
        ...prev,
        [channel.type]: [...prev[channel.type], channel],
      }));
      toast.success('Adicionado aos favoritos');
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
      toast.error('Erro ao adicionar favorito');
    }
  };

  const removeFavorite = (channelId: string, type: string) => {
    try {
      setFavorites(prev => ({
        ...prev,
        [type]: prev[type].filter(channel => channel.id !== channelId),
      }));
      toast.success('Removido dos favoritos');
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      toast.error('Erro ao remover favorito');
    }
  };

  const isFavorite = (channelId: string, type: string) => {
    return favorites[type].some(channel => channel.id === channelId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
