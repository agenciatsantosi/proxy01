import { AuthCredentials, M3UAuthParams } from '../types/iptv';

export async function fetchM3UWithAuth(credentials: AuthCredentials): Promise<string> {
  try {
    // Extrai o domínio base da URL
    const baseUrl = new URL(credentials.url).origin;
    
    // Monta os parâmetros
    const params: M3UAuthParams = {
      username: credentials.username,
      password: credentials.password,
      type: 'm3u_plus',
      output: 'ts'
    };

    // Constrói a URL com os parâmetros
    const queryString = new URLSearchParams(params as any).toString();
    const fullUrl = `${baseUrl}/get.php?${queryString}`;

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error('Falha na autenticação. Verifique suas credenciais.');
    }

    const content = await response.text();
    
    if (!content.includes('#EXTM3U')) {
      throw new Error('Formato de lista inválido');
    }

    return content;
  } catch (error) {
    console.error('Erro ao carregar lista:', error);
    throw new Error('Erro ao carregar a lista. Verifique sua conexão e credenciais.');
  }
} 

export async function getSeriesEpisodes(seriesId: string): Promise<Channel[]> {
  // Implementar lógica para buscar episódios
  const allChannels = await getAllChannels();
  const seriesEpisodes = allChannels.filter(
    channel => channel.type === 'series' && 
    channel.seriesInfo?.name === seriesId
  );

  return seriesEpisodes.sort((a, b) => {
    const aSeason = a.seriesInfo?.season || 0;
    const bSeason = b.seriesInfo?.season || 0;
    if (aSeason === bSeason) {
      return (a.seriesInfo?.episode || 0) - (b.seriesInfo?.episode || 0);
    }
    return aSeason - bSeason;
  });
} 