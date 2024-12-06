export interface StreamOptions {
  url: string;
  format: 'mp4' | 'hls';
  quality?: '720p' | '1080p';
}

export async function getStreamUrl(options: StreamOptions): Promise<string> {
  // URL do seu servidor de conversão
  const CONVERSION_SERVER = 'http://seu-servidor:3000/convert';
  
  const params = new URLSearchParams({
    url: options.url,
    format: options.format,
    quality: options.quality || '720p'
  });

  return `${CONVERSION_SERVER}?${params.toString()}`;
} 