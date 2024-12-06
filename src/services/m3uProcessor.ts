interface M3UEntry {
  title: string;
  url: string;
  groupTitle?: string;
  tvgId?: string;
  tvgName?: string;
  tvgLogo?: string;
}

export class M3UProcessor {
  private static CHUNK_SIZE = 50000; // Processa 50KB por vez
  private static PROCESS_DELAY = 10; // 10ms entre chunks para não travar a UI

  static async processM3UContent(content: string): Promise<M3UEntry[]> {
    const entries: M3UEntry[] = [];
    let currentEntry: Partial<M3UEntry> = {};
    
    // Divide o conteúdo em chunks para processamento
    const lines = content.split('\n');
    const chunks = this.splitIntoChunks(lines, this.CHUNK_SIZE);
    
    for (let i = 0; i < chunks.length; i++) {
      // Adiciona um pequeno delay entre chunks para não travar a UI
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, this.PROCESS_DELAY));
      }
      
      const chunk = chunks[i];
      for (const line of chunk) {
        const trimmedLine = line.trim();
        
        if (!trimmedLine) continue;
        
        if (trimmedLine.startsWith('#EXTINF:')) {
          currentEntry = this.parseExtInf(trimmedLine);
        } else if (!trimmedLine.startsWith('#')) {
          if (Object.keys(currentEntry).length > 0) {
            entries.push({
              ...currentEntry,
              url: trimmedLine
            } as M3UEntry);
            currentEntry = {};
          }
        }
      }
    }
    
    return entries;
  }
  
  private static parseExtInf(line: string): Partial<M3UEntry> {
    const entry: Partial<M3UEntry> = {};
    
    // Remove #EXTINF: e duração
    const mainPart = line.replace(/#EXTINF:-?\d+\s*,?\s*/, '');
    
    // Extrai atributos entre aspas
    const attributes = mainPart.match(/([a-zA-Z-]+)="([^"]*?)"/g) || [];
    for (const attr of attributes) {
      const [key, value] = attr.split('=');
      const cleanValue = value.replace(/"/g, '');
      
      switch (key.toLowerCase()) {
        case 'tvg-id':
          entry.tvgId = cleanValue;
          break;
        case 'tvg-name':
          entry.tvgName = cleanValue;
          break;
        case 'tvg-logo':
          entry.tvgLogo = cleanValue;
          break;
        case 'group-title':
          entry.groupTitle = cleanValue;
          break;
      }
    }
    
    // O título é o que sobra depois de remover os atributos
    entry.title = mainPart
      .replace(/([a-zA-Z-]+)="([^"]*?)"/g, '')
      .replace(/,\s*$/, '')
      .trim();
    
    return entry;
  }
  
  private static splitIntoChunks<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
  
  static async validateAndOptimizeM3U(content: string): Promise<string> {
    if (!content.includes('#EXTM3U')) {
      throw new Error('Conteúdo M3U inválido');
    }
    
    // Processa a lista de forma otimizada
    const entries = await this.processM3UContent(content);
    
    // Reconstrói a lista de forma otimizada
    let optimizedContent = '#EXTM3U\n';
    
    for (const entry of entries) {
      let extinf = '#EXTINF:-1';
      if (entry.tvgId) extinf += ` tvg-id="${entry.tvgId}"`;
      if (entry.tvgName) extinf += ` tvg-name="${entry.tvgName}"`;
      if (entry.tvgLogo) extinf += ` tvg-logo="${entry.tvgLogo}"`;
      if (entry.groupTitle) extinf += ` group-title="${entry.groupTitle}"`;
      extinf += `,${entry.title}\n`;
      
      optimizedContent += extinf + entry.url + '\n';
    }
    
    return optimizedContent;
  }
}
