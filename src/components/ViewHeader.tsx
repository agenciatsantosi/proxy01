import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ViewHeaderProps {
  title: string;
}

export default function ViewHeader({ title }: ViewHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={() => navigate('/dashboard')}
        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <h1 className="text-2xl font-bold text-white">{title}</h1>
    </div>
  );
} 