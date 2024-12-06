import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { Channel, PlayerState } from '../types/iptv';
import { CONTENT_TYPES } from '../utils/constants';
import { detectContentType } from '../utils/contentDetector';
import { parseSeriesInfo } from '../utils/seriesParser';

interface PlaylistContextType {
  channels: Channel[];
  selectedChannel: Channel | undefined;
  playerState: PlayerState;
  isLoading: boolean;
  setSelectedChannel: (channel: Channel | undefined) => void;
  handlePlaylistLoad: (content: string) => Promise<void>;
  updatePlayerState: (state: Partial<PlayerState>) => void;
}

const initialPlayerState: PlayerState = {
  isPlaying: false,
  isBuffering: false,
  isMuted: false,
  volume: 1,
  currentTime: 0,
  duration: 0,
  showControls: true,
  isFullscreen: false
};

// Função para gerar ID único
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

const parsePlaylist = (content: string): Promise<Channel[]> => {
  return new Promise((resolve) => {
    const channels: Channel[] = [];
    const lines = content.split('\n');
    let currentChannel: Partial<Channel> = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('#EXTINF:')) {
        const nameMatch = line.match(/,(.+)$/);
        const groupMatch = line.match(/group-title="([^"]+)"/i);
        const logoMatch = line.match(/tvg-logo="([^"]+)"/i);
        const idMatch = line.match(/tvg-id="([^"]+)"/i);
        
        const name = nameMatch?.[1]?.trim() || 'Sem Nome';
        const group = groupMatch?.[1]?.trim() || 'Sem Categoria';
        const logo = logoMatch?.[1]?.replace(/^http:/, 'https:');
        const id = idMatch?.[1]?.trim() || crypto.randomUUID();
        
        // Detecta o tipo de conteúdo baseado no nome e grupo
        const type = detectContentType(name, group);
        
        currentChannel = {
          id,
          name,
          group,
          logo,
          type,
          tvgId: idMatch?.[1]
        };

        // Se for série, adiciona informações extras
        if (type === CONTENT_TYPES.SERIES) {
          const seriesInfo = parseSeriesInfo(name, group);
          if (seriesInfo) {
            currentChannel.seriesInfo = seriesInfo;
          }
        }
      } else if (line.startsWith('http')) {
        if (currentChannel.name) {
          channels.push({ ...currentChannel, url: line } as Channel);
        }
        currentChannel = {};
      }
    }

    resolve(channels);
  });
};

export function PlaylistProvider({ children }: { children: ReactNode }) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel>();
  const [playerState, setPlayerState] = useState<PlayerState>(initialPlayerState);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlaylistLoad = useCallback(async (content: string) => {
    setIsLoading(true);
    try {
      const parsedChannels = await parsePlaylist(content);
      setChannels(parsedChannels);
    } catch (error) {
      console.error('Erro ao carregar playlist:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePlayerState = useCallback((state: Partial<PlayerState>) => {
    setPlayerState(prev => ({ ...prev, ...state }));
  }, []);

  const value = useMemo(() => ({
    channels,
    selectedChannel,
    playerState,
    isLoading,
    setSelectedChannel,
    handlePlaylistLoad,
    updatePlayerState,
  }), [channels, selectedChannel, playerState, isLoading, handlePlaylistLoad, updatePlayerState]);

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylist() {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylist deve ser usado dentro de um PlaylistProvider');
  }
  return context;
}