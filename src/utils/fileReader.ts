export async function readFileChunks(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunkSize = 1024 * 1024; // 1MB chunks
    const reader = new FileReader();
    let offset = 0;
    let result = '';

    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));

    reader.onload = (e) => {
      if (e.target?.result) {
        result += e.target.result;
        offset += chunkSize;
        const progress = Math.min(100, Math.round((offset / file.size) * 100));
        onProgress?.(progress);

        if (offset < file.size) {
          // Adiciona um pequeno delay entre chunks para não travar a UI
          setTimeout(() => readNextChunk(), 10);
        } else {
          resolve(result);
        }
      }
    };

    const readNextChunk = () => {
      const slice = file.slice(offset, offset + chunkSize);
      reader.readAsText(slice);
    };

    readNextChunk();
  });
}