import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, User } from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';

export default function ProfileView() {
  const navigate = useNavigate();
  const { profiles, createProfile, selectProfile } = useProfile();
  const [newProfileName, setNewProfileName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProfileName.trim()) {
      createProfile(newProfileName.trim());
      navigate('/dashboard');
    }
  };

  const handleSelectProfile = (profileId: string) => {
    selectProfile(profileId);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Selecione um Perfil
        </h1>

        <div className="grid gap-4">
          {profiles.map(profile => (
            <button
              key={profile.id}
              onClick={() => handleSelectProfile(profile.id)}
              className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              <span className="text-lg text-white">{profile.name}</span>
            </button>
          ))}

          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-4 p-4 bg-purple-600/20 rounded-lg hover:bg-purple-600/30 transition-colors"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg text-white">Criar Novo Perfil</span>
            </button>
          ) : (
            <form onSubmit={handleCreateProfile} className="space-y-4">
              <input
                type="text"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="Nome do perfil"
                className="w-full p-4 bg-gray-800/50 rounded-lg text-white placeholder-gray-400 border border-gray-700 focus:border-purple-500 focus:outline-none"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Criar Perfil
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 