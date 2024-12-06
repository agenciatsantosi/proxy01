export function getProxiedImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('data:')) return url;
  
  // URLs que não precisam de proxy
  const directUrls = [
    'tmdb.org',
    'themoviedb.org',
    'postimg.cc'
  ];
  
  // Verifica se a URL é de um domínio que não precisa de proxy
  if (directUrls.some(domain => url.includes(domain))) {
    return url;
  }
  
  // Lista de proxies CORS
  const proxyUrls = [
    'https://images.weserv.nl/?url=',
    'https://cors.eu.org/',
    'https://api.allorigins.win/raw?url='
  ];

  // Usa o primeiro proxy
  return `${proxyUrls[0]}${encodeURIComponent(url)}`;
}