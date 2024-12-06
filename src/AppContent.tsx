import { Routes, Route, Navigate } from 'react-router-dom';
import { usePlaylist } from './contexts/PlaylistContext';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import PlaylistInput from './views/PlaylistInput';
import PlayerView from './views/PlayerView';
import SettingsView from './views/SettingsView';
import GroupMappingView from './views/GroupMappingView';
import TvView from './views/TvView';
import MoviesView from './views/MoviesView';
import SeriesView from './views/SeriesView';
import SeriesDetailsView from './views/SeriesDetailsView';
import FavoritesView from './views/FavoritesView';
import PlaylistsView from './views/PlaylistsView';

export default function AppContent() {
  const { selectedChannel } = usePlaylist();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {selectedChannel && <PlayerView />}
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-playlist" element={<PlaylistInput />} />
          <Route path="/playlists" element={<PlaylistsView />} />
          <Route path="/tv" element={<TvView />} />
          <Route path="/movies" element={<MoviesView />} />
          <Route path="/series" element={<SeriesView />} />
          <Route path="/series/:seriesName" element={<SeriesDetailsView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/settings/groups" element={<GroupMappingView />} />
          <Route path="/favorites" element={<FavoritesView />} />
          
          {/* Redireciona a rota raiz para /dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Redireciona qualquer rota não encontrada para /dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </div>
  );
}
