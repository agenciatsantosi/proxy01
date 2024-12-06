import { Profile, PlaylistData } from '../types/iptv';
import { indexedDBService } from './indexedDBService';

const PROFILES_KEY = 'quick_player_profiles';
const PLAYLISTS_KEY = 'quick_player_playlists';
const ACTIVE_PROFILE_KEY = 'quick_player_active_profile';

// Inicializa o IndexedDB
indexedDBService.init().catch(error => {
  console.error('Erro ao inicializar IndexedDB:', error);
});

// Função para migrar dados antigos
const migrateOldData = () => {
  try {
    // Verifica se já fez a migração
    const migrated = localStorage.getItem('data_migrated');
    if (migrated) return;

    // Migra perfis
    const oldProfiles = localStorage.getItem(PROFILES_KEY);
    if (oldProfiles) {
      const profiles = JSON.parse(oldProfiles);
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    }

    // Migra playlists
    const oldPlaylists = localStorage.getItem(PLAYLISTS_KEY);
    if (oldPlaylists) {
      const playlists = JSON.parse(oldPlaylists);
      localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
    }

    // Marca como migrado
    localStorage.setItem('data_migrated', 'true');
  } catch (error) {
    console.error('Erro na migração:', error);
  }
};

// Executa migração
migrateOldData();

export const profileService = {
  // Gerenciamento de Perfis
  getProfiles(): Profile[] {
    try {
      const profilesStr = localStorage.getItem(PROFILES_KEY);
      if (!profilesStr) return [];
      
      const profiles = JSON.parse(profilesStr);
      return Array.isArray(profiles) ? profiles : [];
    } catch (error) {
      console.error('Erro ao carregar perfis:', error);
      return [];
    }
  },

  createProfile(name: string, avatar?: string): Profile {
    try {
      const profiles = this.getProfiles();
      const newProfile: Profile = {
        id: crypto.randomUUID(),
        name,
        avatar,
        createdAt: new Date().toISOString(),
        lastAccess: new Date().toISOString()
      };

      profiles.push(newProfile);
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
      return newProfile;
    } catch (error) {
      console.error('Erro ao criar perfil:', error);
      throw new Error('Não foi possível criar o perfil');
    }
  },

  getActiveProfile(): Profile | null {
    try {
      const profileId = localStorage.getItem(ACTIVE_PROFILE_KEY);
      if (!profileId) return null;
      
      const profiles = this.getProfiles();
      return profiles.find(p => p.id === profileId) || null;
    } catch (error) {
      console.error('Erro ao obter perfil ativo:', error);
      return null;
    }
  },

  setActiveProfile(profileId: string) {
    localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
  },

  // Gerenciamento de Playlists
  async getPlaylists(profileId: string): Promise<PlaylistData[]> {
    try {
      const playlistsStr = localStorage.getItem(PLAYLISTS_KEY);
      if (!playlistsStr) return [];

      const allPlaylists: PlaylistData[] = JSON.parse(playlistsStr);
      if (!Array.isArray(allPlaylists)) return [];

      const profilePlaylists = allPlaylists.filter(p => p.profileId === profileId);
      
      // Carrega o conteúdo de cada playlist do IndexedDB
      const playlistsWithContent = await Promise.all(
        profilePlaylists.map(async playlist => {
          try {
            const content = await indexedDBService.getPlaylistContent(playlist.id);
            return { ...playlist, content };
          } catch (error) {
            console.error(`Erro ao carregar conteúdo da playlist ${playlist.id}:`, error);
            return { ...playlist, content: '' };
          }
        })
      );
      
      return playlistsWithContent;
    } catch (error) {
      console.error('Erro ao carregar playlists:', error);
      return [];
    }
  },

  async savePlaylist(profileId: string, name: string, url: string, content: string): Promise<PlaylistData> {
    try {
      const playlistsStr = localStorage.getItem(PLAYLISTS_KEY);
      const allPlaylists: PlaylistData[] = playlistsStr ? JSON.parse(playlistsStr) : [];
      
      // Verifica se já existe uma playlist com a mesma URL
      const existingPlaylist = allPlaylists.find(p => p.url === url && p.profileId === profileId);
      if (existingPlaylist) {
        // Atualiza a playlist existente
        existingPlaylist.lastUpdate = new Date().toISOString();
        await indexedDBService.savePlaylistContent(existingPlaylist.id, content);
        localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(allPlaylists));
        return {
          ...existingPlaylist,
          content
        };
      }

      // Cria uma nova playlist
      const newPlaylist: PlaylistData = {
        id: crypto.randomUUID(),
        name,
        url,
        content: '',
        lastUpdate: new Date().toISOString(),
        profileId
      };

      // Salva os metadados
      allPlaylists.push(newPlaylist);
      localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(allPlaylists));

      // Salva o conteúdo
      await indexedDBService.savePlaylistContent(newPlaylist.id, content);

      return {
        ...newPlaylist,
        content
      };
    } catch (error) {
      console.error('Erro ao salvar playlist:', error);
      throw new Error('Não foi possível salvar a playlist');
    }
  },

  async updatePlaylist(playlistId: string, content: string) {
    try {
      await indexedDBService.savePlaylistContent(playlistId, content);
    } catch (error) {
      console.error('Erro ao atualizar playlist:', error);
      throw new Error('Não foi possível atualizar a playlist');
    }
  },

  async removePlaylist(playlistId: string) {
    try {
      const playlistsStr = localStorage.getItem(PLAYLISTS_KEY);
      if (!playlistsStr) return;

      const allPlaylists: PlaylistData[] = JSON.parse(playlistsStr);
      const updatedPlaylists = allPlaylists.filter(p => p.id !== playlistId);
      
      localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(updatedPlaylists));
      
      // Remove o conteúdo do IndexedDB
      await indexedDBService.removePlaylistContent(playlistId);
    } catch (error) {
      console.error('Erro ao remover playlist:', error);
      throw new Error('Não foi possível remover a playlist');
    }
  }
};