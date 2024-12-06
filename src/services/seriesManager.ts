import { Channel } from '../types/iptv';
import { parseSeriesInfo } from '../utils/seriesParser';

interface SeriesMetadata {
  name: string;
  seasons: {
    [key: string]: Channel[];
  };
  logo?: string;
  provider?: string;
  totalEpisodes: number;
}

interface SeriesGroup {
  name: string;
  series: {
    [key: string]: SeriesMetadata;
  };
}

export class SeriesManager {
  private static instance: SeriesManager;
  private groupedSeries: { [key: string]: SeriesGroup } = {};
  private isProcessing = false;
  private lastProcessedChannels: Channel[] = [];

  private constructor() {}

  static getInstance(): SeriesManager {
    if (!SeriesManager.instance) {
      SeriesManager.instance = new SeriesManager();
    }
    return SeriesManager.instance;
  }

  private shouldReprocess(channels: Channel[]): boolean {
    if (channels.length !== this.lastProcessedChannels.length) return true;
    return channels.some((channel, index) => 
      channel.id !== this.lastProcessedChannels[index]?.id ||
      channel.name !== this.lastProcessedChannels[index]?.name
    );
  }

  async processSeriesChannels(channels: Channel[]): Promise<{ [key: string]: SeriesGroup }> {
    // Se já estiver processando, retorna o cache atual
    if (this.isProcessing) {
      return this.groupedSeries;
    }

    // Se os canais são os mesmos e já foram processados, retorna o cache
    if (!this.shouldReprocess(channels)) {
      return this.groupedSeries;
    }

    this.isProcessing = true;
    this.lastProcessedChannels = [...channels];

    try {
      const seriesChannels = channels.filter(channel => channel.type === 'series');
      const groups: { [key: string]: SeriesGroup } = {};

      // Processa em chunks para não travar a UI
      const chunkSize = 100;
      for (let i = 0; i < seriesChannels.length; i += chunkSize) {
        const chunk = seriesChannels.slice(i, i + chunkSize);
        
        // Permite que a UI atualize entre chunks
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }

        for (const channel of chunk) {
          const parsedInfo = parseSeriesInfo(channel.name, channel.group || '', channel.logo);
          const provider = parsedInfo.group;
          const seriesName = parsedInfo.name;
          const seasonNumber = `S${String(parsedInfo.season).padStart(2, '0')}`;

          if (!groups[provider]) {
            groups[provider] = {
              name: provider,
              series: {}
            };
          }

          if (!groups[provider].series[seriesName]) {
            groups[provider].series[seriesName] = {
              name: seriesName,
              seasons: {},
              logo: channel.logo,
              provider,
              totalEpisodes: 0
            };
          }

          if (!groups[provider].series[seriesName].seasons[seasonNumber]) {
            groups[provider].series[seriesName].seasons[seasonNumber] = [];
          }

          groups[provider].series[seriesName].seasons[seasonNumber].push(channel);
          groups[provider].series[seriesName].totalEpisodes++;
        }
      }

      // Ordena os episódios em cada temporada
      Object.values(groups).forEach(group => {
        Object.values(group.series).forEach(series => {
          Object.values(series.seasons).forEach(episodes => {
            episodes.sort((a, b) => {
              const aInfo = parseSeriesInfo(a.name, a.group || '');
              const bInfo = parseSeriesInfo(b.name, b.group || '');
              return aInfo.episode - bInfo.episode;
            });
          });
        });
      });

      this.groupedSeries = groups;
      return groups;
    } finally {
      this.isProcessing = false;
    }
  }

  getGroupedSeries(): { [key: string]: SeriesGroup } {
    return this.groupedSeries;
  }
}
