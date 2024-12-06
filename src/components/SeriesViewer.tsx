import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Channel } from '../types/iptv';
import { getSeriesEpisodes } from '../services/iptvService';
import SeriesPlayer from './series/SeriesPlayer';
import { LoadingScreen } from './LoadingScreen';

export function SeriesViewer() {
  const { seriesId } = useParams<{ seriesId: string }>();
  const navigate = useNavigate();
  const [series, setSeries] = useState<Channel | null>(null);
  const [episodes, setEpisodes] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSeries = async () => {
      if (!seriesId) return;
      
      setLoading(true);
      setError(null);

      try {
        const episodes = await getSeriesEpisodes(seriesId);
        if (episodes.length === 0) {
          throw new Error('Série não encontrada');
        }

        setSeries(episodes[0]);
        setEpisodes(episodes);
      } catch (error) {
        console.error('Erro ao carregar série:', error);
        setError(error instanceof Error ? error.message : 'Erro ao carregar série');
      } finally {
        setLoading(false);
      }
    };

    loadSeries();
  }, [seriesId]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !series) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">{error || 'Série não encontrada'}</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <SeriesPlayer 
      series={series}
      episodes={episodes}
      onClose={() => navigate('/')}
    />
  );
} 