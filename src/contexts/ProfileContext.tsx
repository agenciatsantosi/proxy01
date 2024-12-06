import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile, PlaylistData } from '../types/iptv';
import { profileService } from '../services/profileService';

interface ProfileContextType {
  activeProfile: Profile | null;
  profiles: Profile[];
  playlists: PlaylistData[];
  createProfile: (name: string, avatar?: string) => void;
  selectProfile: (profileId: string) => void;
  savePlaylist: (name: string, url: string, content: string) => Promise<PlaylistData>;
  updatePlaylist: (playlistId: string, content: string) => void;
  removePlaylist: (playlistId: string) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistData[]>([]);

  // Carrega perfis ao iniciar
  useEffect(() => {
    setProfiles(profileService.getProfiles());
    const active = profileService.getActiveProfile();
    if (active) {
      setActiveProfile(active);
      loadPlaylists(active.id);
    }
  }, []);

  const createProfile = (name: string, avatar?: string) => {
    const newProfile = profileService.createProfile(name, avatar);
    setProfiles(prev => [...prev, newProfile]);
    selectProfile(newProfile.id);
  };

  const selectProfile = (profileId: string) => {
    profileService.setActiveProfile(profileId);
    const profile = profiles.find(p => p.id === profileId) || null;
    setActiveProfile(profile);
    if (profile) {
      loadPlaylists(profile.id);
    }
  };

  const loadPlaylists = async (profileId: string) => {
    try {
      const playlists = await profileService.getPlaylists(profileId);
      setPlaylists(playlists);
    } catch (error) {
      console.error('Erro ao carregar playlists:', error);
      setPlaylists([]);
    }
  };

  const savePlaylist = async (name: string, url: string, content: string) => {
    try {
      if (!activeProfile) {
        throw new Error('Nenhum perfil ativo');
      }

      const playlist = await profileService.savePlaylist(activeProfile.id, name, url, content);
      setPlaylists(prev => [...prev, playlist]);
      return playlist;
    } catch (error) {
      console.error('Erro ao salvar playlist:', error);
      throw error;
    }
  };

  const updatePlaylist = (playlistId: string, content: string) => {
    profileService.updatePlaylist(playlistId, content);
    if (activeProfile) {
      loadPlaylists(activeProfile.id);
    }
  };

  const removePlaylist = async (playlistId: string) => {
    try {
      await profileService.removePlaylist(playlistId);
      setPlaylists(prev => prev.filter(p => p.id !== playlistId));
    } catch (error) {
      console.error('Erro ao remover playlist:', error);
      throw error;
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        activeProfile,
        profiles,
        playlists,
        createProfile,
        selectProfile,
        savePlaylist,
        updatePlaylist,
        removePlaylist,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}