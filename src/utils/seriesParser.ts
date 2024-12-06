interface ParsedSeriesInfo {
  name: string;
  season: number;
  episode: number;
  group: string;
  logo?: string;
}

export function parseSeriesInfo(title: string, group: string): ParsedSeriesInfo {
  const cleanTitle = title.trim();
  
  // Padrões comuns de nomes de séries
  const patterns = [
    // S01E01 ou S1E1
    /^(.*?)[^\w]+(S|Temporada\s+)(\d{1,2})[^\w]+(E|Ep|Episodio\s+)(\d{1,2})/i,
    // 1x01
    /^(.*?)[^\w]+(\d{1,2})x(\d{1,2})/i,
  ];

  for (const pattern of patterns) {
    const match = cleanTitle.match(pattern);
    if (match) {
      return {
        name: match[1].trim(),
        season: parseInt(match[3]),
        episode: parseInt(match[5] || match[3]),
        group: group,
      };
    }
  }

  // Se não encontrar padrão, tenta extrair números
  const numberMatch = cleanTitle.match(/(\d+)/);
  return {
    name: cleanTitle.replace(/\d+/, '').trim(),
    season: 1,
    episode: numberMatch ? parseInt(numberMatch[1]) : 1,
    group: group,
  };
}