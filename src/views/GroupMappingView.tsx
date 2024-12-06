import { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import ViewHeader from '../components/ViewHeader';

interface GroupMapping {
  id: string;
  pattern: string;
  type: 'movie' | 'series' | 'tv';
}

export default function GroupMappingView() {
  const [mappings, setMappings] = useState<GroupMapping[]>([]);
  const [newPattern, setNewPattern] = useState('');
  const [selectedType, setSelectedType] = useState<'movie' | 'series' | 'tv'>('movie');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Carregar mapeamentos salvos
    const loadMappings = () => {
      const saved = localStorage.getItem('groupMappings');
      if (saved) {
        try {
          setMappings(JSON.parse(saved));
        } catch (e) {
          setError('Erro ao carregar mapeamentos');
        }
      }
    };
    loadMappings();
  }, []);

  const saveMappings = (newMappings: GroupMapping[]) => {
    try {
      localStorage.setItem('groupMappings', JSON.stringify(newMappings));
      setSuccess('Mapeamentos salvos com sucesso');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError('Erro ao salvar mapeamentos');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleAddMapping = () => {
    if (!newPattern.trim()) {
      setError('Digite um padrão de grupo');
      return;
    }

    const newMapping: GroupMapping = {
      id: Date.now().toString(),
      pattern: newPattern.trim(),
      type: selectedType,
    };

    const updatedMappings = [...mappings, newMapping];
    setMappings(updatedMappings);
    saveMappings(updatedMappings);
    setNewPattern('');
  };

  const handleRemoveMapping = (id: string) => {
    const updatedMappings = mappings.filter(m => m.id !== id);
    setMappings(updatedMappings);
    saveMappings(updatedMappings);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <ViewHeader title="Configuração de Grupos" />
        
        <div className="bg-gray-800 rounded-lg p-6 mt-6">
          <h2 className="text-lg font-medium text-white mb-4">Mapeamento de Grupos</h2>
          
          {/* Formulário de adição */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={newPattern}
              onChange={(e) => setNewPattern(e.target.value)}
              placeholder='Ex: "FILMES", "VOD", "FILME"'
              className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as 'movie' | 'series' | 'tv')}
              className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="movie">Filmes</option>
              <option value="series">Séries</option>
              <option value="tv">TV</option>
            </select>
            <button
              onClick={handleAddMapping}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Adicionar
            </button>
          </div>

          {/* Mensagens de feedback */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 text-red-400 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-500/10 text-green-400 rounded-lg">
              {success}
            </div>
          )}

          {/* Lista de mapeamentos */}
          <div className="space-y-3">
            {mappings.map((mapping) => (
              <div
                key={mapping.id}
                className="flex items-center justify-between bg-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center gap-4">
                  <span className="text-white">{mapping.pattern}</span>
                  <span className="px-2 py-1 text-sm rounded-md bg-gray-600 text-gray-300">
                    {mapping.type === 'movie' ? 'Filmes' : mapping.type === 'series' ? 'Séries' : 'TV'}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveMapping(mapping.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remover"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            {mappings.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                Nenhum mapeamento configurado
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-400">
          <h3 className="font-medium mb-2">Como funciona?</h3>
          <p>Adicione padrões de nomes de grupos (group-title) e associe com o tipo de conteúdo correto.</p>
          <p className="mt-2">Por exemplo, se sua lista tem grupos como "FILMES", "VOD", "FILME", você pode mapear todos eles como "Filmes".</p>
        </div>
      </div>
    </div>
  );
}
