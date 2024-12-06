import { useState, useEffect } from 'react';
import { Channel, SeriesProgress } from '../types/iptv';

export function useSeriesState(series: Channel, episodes: Channel[]) {
  const [currentEpisode, setCurrentEpisode] = useState(episodes[0]);
  const [progress, setProgress] = useState<SeriesProgress>({});
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  // Carrega dados salvos
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const savedProgress = localStorage.getItem(`series_${series.id}_progress`);
        const savedFavorites = localStorage.getItem('series_favorites');
        const savedHistory = localStorage.getItem('series_history');

        if (savedProgress) setProgress(JSON.parse(savedProgress));
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
        if (savedHistory) setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadSavedData();
  }, [series.id]);

  // Salva progresso automaticamente
  useEffect(() => {
    localStorage.setItem(`series_${series.id}_progress`, JSON.stringify(progress));
  }, [series.id, progress]);

  const updateProgress = (episodeId: string, time: number, duration: number) => {
    setProgress(prev => ({
      ...prev,
      [episodeId]: { time, duration, lastWatched: new Date().toISOString() }
    }));
  };

  const toggleFavorite = () => {
    setFavorites(prev => {
      const newFavorites = prev.includes(series.id)
        ? prev.filter(id => id !== series.id)
        : [...prev, series.id];
      
      localStorage.setItem('series_favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const addToHistory = (episodeId: string) => {
    setHistory(prev => {
      const newHistory = [episodeId, ...prev.filter(id => id !== episodeId)].slice(0, 100);
      localStorage.setItem('series_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  return {
    currentEpisode,
    setCurrentEpisode,
    progress,
    updateProgress,
    autoplayEnabled,
    setAutoplayEnabled,
    favorites,
    toggleFavorite,
    history,
    addToHistory
  };
} 