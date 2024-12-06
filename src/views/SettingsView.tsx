import { Link } from 'react-router-dom';
import ViewHeader from '../components/ViewHeader';
import { Settings, Users, Tags } from 'lucide-react';

export default function SettingsView() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <ViewHeader title="Configurações" />
        
        <div className="grid gap-4 mt-6">
          <Link
            to="/settings/groups"
            className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Tags className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Grupos</h3>
              <p className="text-sm text-gray-400">Configurar nomenclaturas de grupos</p>
            </div>
          </Link>

          <Link
            to="/settings/profile"
            className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Perfis</h3>
              <p className="text-sm text-gray-400">Gerenciar perfis de usuário</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}