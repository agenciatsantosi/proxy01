import { CONTENT_TYPES, ContentType } from './constants';

// Padrões para identificar grupos de filmes
const MOVIE_GROUP_PATTERNS = [
  /^VOD/i,
  /^FILME/i,
  /^FILMES/i,
  /MOVIES/i
];

// Padrões para identificar grupos de séries
const SERIES_GROUP_PATTERNS = [
  /^SERIES/i,
  /^SERIE/i
];

export function getContentType(group: string = ''): ContentType {
  if (MOVIE_GROUP_PATTERNS.some(pattern => pattern.test(group))) {
    return CONTENT_TYPES.MOVIES;
  }

  if (SERIES_GROUP_PATTERNS.some(pattern => pattern.test(group))) {
    return CONTENT_TYPES.SERIES;
  }

  if (/^TV|LIVE/i.test(group)) {
    return CONTENT_TYPES.TV;
  }

  return CONTENT_TYPES.OTHER;
}

export function cleanGroupTitle(group: string = ''): string {
  const contentType = getContentType(group);
  let cleanTitle = group.trim();

  if (contentType === CONTENT_TYPES.MOVIES) {
    // Remove prefixos comuns de filmes
    cleanTitle = cleanTitle
      .replace(/^(VOD|FILME[S]?|MOVIES)\s*[-:]?\s*/i, '')
      .trim();
  } else if (contentType === CONTENT_TYPES.SERIES) {
    // Remove prefixos comuns de séries
    cleanTitle = cleanTitle
      .replace(/^(SERIES|SERIE)\s*[-:]?\s*/i, '')
      .trim();
  }

  return cleanTitle || 'Outros';
} 