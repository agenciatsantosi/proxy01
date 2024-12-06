import { ContentType, CONTENT_TYPES } from './constants';

export function detectContentType(name: string, group: string): ContentType {
  const normalizedName = name.toLowerCase();
  const normalizedGroup = group.toLowerCase();

  // Detecta séries
  if (
    normalizedGroup.includes('serie') || 
    normalizedGroup.includes('series') ||
    /s\d{2}e\d{2}/i.test(normalizedName) || // Padrão S01E01
    /temporada|episodio/i.test(normalizedName)
  ) {
    return CONTENT_TYPES.SERIES;
  }

  // Detecta filmes
  if (
    normalizedGroup.includes('filme') || 
    normalizedGroup.includes('filmes') ||
    normalizedGroup.includes('movie') ||
    normalizedGroup.includes('vod')
  ) {
    return CONTENT_TYPES.MOVIES;
  }

  // Se não for série nem filme, considera como TV
  if (
    normalizedGroup.includes('tv') ||
    normalizedGroup.includes('canal') ||
    normalizedGroup.includes('ao vivo') ||
    normalizedGroup.includes('live')
  ) {
    return CONTENT_TYPES.TV;
  }

  // Caso não identifique, retorna TV como padrão
  return CONTENT_TYPES.TV;
}
