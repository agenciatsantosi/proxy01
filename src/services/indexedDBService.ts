const DB_NAME = 'iptvPlayerDB';
const DB_VERSION = 1;
const PLAYLISTS_STORE = 'playlists';
const CHUNKS_STORE = 'chunks';

export class IndexedDBService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (this.db) return; // Já inicializado

    return new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
          console.error('Error opening IndexedDB:', request.error);
          reject(request.error);
        };

        request.onsuccess = () => {
          this.db = request.result;
          console.log('IndexedDB initialized successfully');
          resolve();
        };

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          
          // Store para metadados das playlists
          if (!db.objectStoreNames.contains(PLAYLISTS_STORE)) {
            db.createObjectStore(PLAYLISTS_STORE, { keyPath: 'id' });
          }

          // Store para chunks de conteúdo
          if (!db.objectStoreNames.contains(CHUNKS_STORE)) {
            db.createObjectStore(CHUNKS_STORE, { keyPath: 'id' });
          }
        };
      } catch (error) {
        console.error('Error in IndexedDB initialization:', error);
        reject(error);
      }
    });
  }

  private getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): IDBObjectStore {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    const transaction = this.db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  async savePlaylistContent(playlistId: string, content: string): Promise<void> {
    try {
      await this.init(); // Garante que o DB está inicializado

      const chunkSize = 1024 * 1024; // 1MB chunks
      const chunks = [];
      
      // Divide o conteúdo em chunks
      for (let i = 0; i < content.length; i += chunkSize) {
        chunks.push({
          id: `${playlistId}_${Math.floor(i / chunkSize)}`,
          content: content.slice(i, i + chunkSize),
          timestamp: new Date().toISOString()
        });
      }

      const store = this.getStore(CHUNKS_STORE, 'readwrite');

      // Remove chunks antigos
      await new Promise<void>((resolve, reject) => {
        const clearRequest = store.delete(IDBKeyRange.bound(
          `${playlistId}_0`,
          `${playlistId}_${Number.MAX_SAFE_INTEGER}`
        ));
        clearRequest.onsuccess = () => resolve();
        clearRequest.onerror = () => reject(clearRequest.error);
      });

      // Salva os novos chunks
      for (const chunk of chunks) {
        await new Promise<void>((resolve, reject) => {
          const request = store.add(chunk);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }

    } catch (error) {
      console.error('Error saving playlist content:', error);
      throw error;
    }
  }

  async getPlaylistContent(playlistId: string): Promise<string> {
    try {
      await this.init(); // Garante que o DB está inicializado

      const store = this.getStore(CHUNKS_STORE);
      
      return new Promise((resolve, reject) => {
        const request = store.getAll(IDBKeyRange.bound(
          `${playlistId}_0`,
          `${playlistId}_${Number.MAX_SAFE_INTEGER}`
        ));

        request.onsuccess = () => {
          const chunks = request.result
            .sort((a, b) => {
              const aIndex = parseInt(a.id.split('_')[1]);
              const bIndex = parseInt(b.id.split('_')[1]);
              return aIndex - bIndex;
            })
            .map(chunk => chunk.content);
          
          resolve(chunks.join(''));
        };

        request.onerror = () => {
          console.error('Error reading playlist content:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Error getting playlist content:', error);
      throw error;
    }
  }

  async removePlaylistContent(playlistId: string): Promise<void> {
    try {
      await this.init(); // Garante que o DB está inicializado

      const store = this.getStore(CHUNKS_STORE, 'readwrite');
      
      return new Promise((resolve, reject) => {
        const request = store.delete(IDBKeyRange.bound(
          `${playlistId}_0`,
          `${playlistId}_${Number.MAX_SAFE_INTEGER}`
        ));

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error removing playlist content:', error);
      throw error;
    }
  }

  async clearAll(): Promise<void> {
    try {
      await this.init(); // Garante que o DB está inicializado

      const stores = [PLAYLISTS_STORE, CHUNKS_STORE];
      
      for (const storeName of stores) {
        const store = this.getStore(storeName, 'readwrite');
        await new Promise<void>((resolve, reject) => {
          const request = store.clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }
    } catch (error) {
      console.error('Error clearing database:', error);
      throw error;
    }
  }
}

export const indexedDBService = new IndexedDBService();
