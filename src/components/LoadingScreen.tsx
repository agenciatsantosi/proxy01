import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
      <p className="text-white text-lg">Carregando...</p>
    </div>
  );
} 