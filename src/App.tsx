import { ProfileProvider } from './contexts/ProfileContext';
import { PlaylistProvider } from './contexts/PlaylistContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import AppContent from './AppContent';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <ProfileProvider>
      <PlaylistProvider>
        <FavoritesProvider>
          <AppContent />
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid #374151'
              }
            }}
          />
        </FavoritesProvider>
      </PlaylistProvider>
    </ProfileProvider>
  );
}