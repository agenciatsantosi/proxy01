import { ContentType } from '../utils/constants';

export interface Channel {
  id: string;
  tvgId: string;
  name: string;
  logo: string;
  url: string;
  group: string;
  type: ContentType;
  seriesInfo?: {
    name: string;
    season: number;
    episode: number;
    poster?: string;
  };
}

export interface PlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isBuffering: boolean;
  isFullscreen: boolean;
  showControls: boolean;
}

export interface SeriesProgress {
  [episodeId: string]: {
    time: number;
    duration: number;
    lastWatched: string;
  };
}

export interface SeriesState {
  currentSeries: string | null;
  currentSeason: number;
  currentEpisode: number;
  episodes: Channel[];
}

export interface AuthCredentials {
  url: string;
  username: string;
  password: string;
}

export interface M3UAuthParams {
  username: string;
  password: string;
}

export interface SeriesPlayerProps {
  series: Channel;
  episodes: Channel[];
  onClose: () => void;
}

export interface SavedList {
  id: string;
  name: string;
  url: string;
  lastUpdate: string;
  channelCount: number;
}

export interface Profile {
  id: string;
  name: string;
  avatar?: string;
  createdAt: string;
  lastAccess: string;
}

export interface PlaylistData {
  id: string;
  name: string;
  url: string;
  content: string;
  lastUpdate: string;
  profileId: string;
}