export function isValidM3UContent(content: string): boolean {
  if (!content || typeof content !== 'string') return false;
  return content.trim().startsWith('#EXTM3U');
}

export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}

export function validateM3UFile(file: File): string | null {
  if (!file) return 'Nenhum arquivo selecionado';
  
  const extension = file.name.toLowerCase().split('.').pop();
  if (!['m3u', 'm3u8'].includes(extension || '')) {
    return 'Por favor, selecione um arquivo .m3u ou .m3u8';
  }

  // Removemos o limite de tamanho para arquivos grandes
  return null;
}