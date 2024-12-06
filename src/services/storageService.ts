const STORAGE_KEYS = {
  SERIES_PROGRESS: 'series_progress',
  FAVORITES: 'favorites',
  WATCH_HISTORY: 'watch_history',
  SETTINGS: 'player_settings'
} as const;

interface StorageData {
  progress: number;
  timestamp: number;
}

interface SeriesProgress {
  [episodeId: string]: StorageData;
}

export const storageService = {
  get<T>(key: string): T | null {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },

  set(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Erro ao salvar no storage:', error);
    }
  },

  saveSeriesProgress(seriesId: string, episodeId: string, progress: number): void {
    const key = `${STORAGE_KEYS.SERIES_PROGRESS}_${seriesId}`;
    const data = this.get<SeriesProgress>(key) || {};
    data[episodeId] = {
      progress,
      timestamp: Date.now()
    };
    this.set(key, data);
  },

  getSeriesProgress(seriesId: string): SeriesProgress {
    return this.get<SeriesProgress>(`${STORAGE_KEYS.SERIES_PROGRESS}_${seriesId}`) || {};
  },

  toggleFavorite(seriesId: string): boolean {
    const favorites = this.get<string[]>(STORAGE_KEYS.FAVORITES) || [];
    const isFavorite = favorites.includes(seriesId);
    
    if (isFavorite) {
      this.set(STORAGE_KEYS.FAVORITES, favorites.filter(id => id !== seriesId));
      return false;
    } else {
      this.set(STORAGE_KEYS.FAVORITES, [...favorites, seriesId]);
      return true;
    }
  },

  isFavorite(seriesId: string): boolean {
    const favorites = this.get<string[]>(STORAGE_KEYS.FAVORITES) || [];
    return favorites.includes(seriesId);
  },

  addToHistory(seriesId: string, episodeId: string): void {
    const history = this.get<string[]>(STORAGE_KEYS.WATCH_HISTORY) || [];
    const entry = `${seriesId}:${episodeId}`;
    
    this.set(STORAGE_KEYS.WATCH_HISTORY, [
      entry,
      ...history.filter(item => item !== entry)
    ].slice(0, 100));
  }
}; 