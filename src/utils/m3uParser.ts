import { Channel } from '../types/iptv';
import { CONTENT_TYPES } from './constants';
import { getContentType, cleanGroupTitle } from './groupParser';
import { parseSeriesInfo } from './seriesParser';

function fixImageUrl(url: string): string {
  if (!url) return '';
  // Remove protocolos inseguros
  return url.replace(/^http:/, 'https:');
}

interface SeriesInfo {
  name: string;
  season: number;
  episode: number;
  poster?: string;
  isLegendado?: boolean;
}

function parseSeriesName(title: string): SeriesInfo {
  // Regex para extrair nome da série, temporada e episódio
  const regex = /^(.+?)(?:\s+S(\d+)\s*E(\d+))/i;
  const match = title.match(regex);

  if (match) {
    const [_, name, season, episode] = match;
    return {
      name: name.trim(),
      season: parseInt(season),
      episode: parseInt(episode),
      isLegendado: title.toLowerCase().includes('leg')
    };
  }

  return {
    name: title,
    season: 1,
    episode: 1,
    isLegendado: title.toLowerCase().includes('leg')
  };
}

export function parseM3U(content: string): Channel[] {
  const channels: Channel[] = [];
  const lines = content.split('\n');
  let currentChannel: Partial<Channel> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('#EXTINF:')) {
      // Extrai informações do canal
      const tvgIdMatch = line.match(/tvg-id="([^"]*)"/);
      const tvgNameMatch = line.match(/tvg-name="([^"]*)"/);
      const logoMatch = line.match(/tvg-logo="([^"]*)"/);
      const groupMatch = line.match(/group-title="([^"]*)"/);

      const name = line.split(',').pop()?.trim() || '';
      const group = groupMatch ? groupMatch[1] : '';
      const type = getContentType(group);

      currentChannel = {
        id: crypto.randomUUID(),
        tvgId: tvgIdMatch ? tvgIdMatch[1] : '',
        name,
        logo: logoMatch ? fixImageUrl(logoMatch[1]) : '',
        group,
        type
      };

      // Se for série, adiciona informações específicas
      if (type === CONTENT_TYPES.SERIES) {
        const seriesInfo = parseSeriesInfo(name, group);
        currentChannel.seriesInfo = {
          name: seriesInfo.name,
          season: seriesInfo.season,
          episode: seriesInfo.episode,
          poster: currentChannel.logo
        };
      }
    } else if (line.startsWith('http') && currentChannel) {
      channels.push({
        ...currentChannel,
        url: line
      } as Channel);
      currentChannel = null;
    }
  }

  return channels;
}

// Adicione ao arquivo de tipos
export interface SeriesState {
  currentSeries: string | null;
  currentSeason: number;
  currentEpisode: number;
  episodes: Channel[];
}