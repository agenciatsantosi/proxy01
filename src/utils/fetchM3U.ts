import { isValidUrl } from './validation';

export async function fetchM3UContent(url: string): Promise<string> {
  if (!isValidUrl(url)) {
    throw new Error('URL inválida. Por favor, insira uma URL válida.');
  }

  // Força HTTPS para evitar problemas de Mixed Content
  const secureUrl = url.replace(/^http:/, 'https:');
  
  // Lista de proxies CORS em ordem de preferência
  const proxyUrls = [
    `https://cors.eu.org/${url}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
    secureUrl,
  ];

  let lastError: Error | null = null;

  for (const proxyUrl of proxyUrls) {
    try {
      console.log('Tentando carregar lista via:', proxyUrl);
      
      const response = await fetch(proxyUrl, {
        headers: {
          'Accept': '*/*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const content = await response.text();
      
      if (content.includes('#EXTM3U')) {
        console.log('Lista M3U carregada com sucesso');
        return content;
      }

      throw new Error('Conteúdo M3U inválido');
    } catch (error) {
      console.warn('Falha ao tentar proxy:', proxyUrl, error);
      lastError = error instanceof Error ? error : new Error('Erro desconhecido');
      continue;
    }
  }

  throw new Error('Não foi possível carregar a lista M3U. Tente uma URL HTTPS ou verifique se a lista está acessível.');
}