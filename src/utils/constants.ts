export const CONTENT_TYPES = {
  TV: 'tv',
  SERIES: 'series',
  MOVIES: 'movie',
  OTHER: 'other'
} as const;

export type ContentType = typeof CONTENT_TYPES[keyof typeof CONTENT_TYPES];

// Constantes para processamento de listas
export const BATCH_SIZE = 1000;
export const BATCH_INTERVAL = 0; // Sem delay entre batches para máxima performance

// Constantes para armazenamento
export const STORAGE_KEYS = {
  PROFILES: 'quick_player_profiles',
  PLAYLISTS: 'quick_player_playlists',
  ACTIVE_PROFILE: 'quick_player_active_profile',
  CONTENT_MAPPINGS: 'quick_player_content_mappings',
  PLAYER_STATE: 'quick_player_player_state',
  MIGRATION_FLAG: 'quick_player_data_migrated',
  FAVORITES: 'quick_player_favorites'
} as const;

// Constantes para IndexedDB
export const DB_CONFIG = {
  NAME: 'iptvPlayerDB',
  VERSION: 1,
  STORES: {
    PLAYLISTS: 'playlists',
    CHUNKS: 'chunks',
    METADATA: 'metadata'
  }
} as const;

// Constantes para interface
export const UI_CONFIG = {
  GRID_COLUMNS: {
    SM: 2,
    MD: 3,
    LG: 4,
    XL: 5
  },
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
  SCROLL_THRESHOLD: 0.8
} as const;

// Constantes para player
export const PLAYER_CONFIG = {
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  BUFFER_LENGTH: 30,
  VOLUME_STEP: 0.1,
  SEEK_STEP: 10,
  AUTO_HIDE_CONTROLS: 3000
} as const;

// Constantes para validação
export const VALIDATION = {
  MAX_PLAYLIST_SIZE: 50 * 1024 * 1024, // 50MB
  SUPPORTED_FORMATS: ['.m3u', '.m3u8'],
  MAX_NAME_LENGTH: 100,
  MIN_NAME_LENGTH: 3
} as const;