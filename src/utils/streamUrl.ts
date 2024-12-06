const PROXY_SERVERS = [
  'https://cors.eu.org/',
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://proxy.cors.sh/',
  'https://api.codetabs.com/v1/proxy?quest='
];

let currentProxyIndex = 0;

const LOCAL_SERVER = 'http://localhost:3001';

export function getProxiedStreamUrl(url: string): string {
  if (!url) return '';
  
  // Se já for MP4, tenta direto primeiro
  if (url.endsWith('.mp4')) {
    try {
      return url;
    } catch {
      // Se falhar, usa proxy
    }
  }

  // Para MKV e outros formatos, usa o servidor local
  return `${LOCAL_SERVER}/stream?url=${encodeURIComponent(url)}`;
}

export function getNextProxyUrl(url: string): string | null {
  currentProxyIndex = (currentProxyIndex + 1) % PROXY_SERVERS.length;
  return getProxiedStreamUrl(url);
}

// Função para processar a URL do stream antes de usar
export async function processStreamUrl(url: string): Promise<string> {
  try {
    // Tenta acessar diretamente primeiro
    const response = await fetch(url, { method: 'HEAD' });
    if (response.ok) return url;
    
    // Se falhar, usa proxy
    return getProxiedStreamUrl(url);
  } catch {
    // Em caso de erro, retorna URL com proxy
    return getProxiedStreamUrl(url);
  }
}

export function getStreamUrl(url: string): string {
  // Para qualquer formato de vídeo, usa o servidor de conversão
  return `${LOCAL_SERVER}/stream?url=${encodeURIComponent(url)}`;
}