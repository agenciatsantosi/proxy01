import { Tv } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center gap-3">
        <Tv className="w-8 h-8 text-blue-500" />
        <div>
          <h1 className="text-xl font-bold text-white">
            IPTV Player
          </h1>
          <p className="text-sm text-gray-400">
            Carregue sua lista M3U ou insira uma URL para começar
          </p>
        </div>
      </div>
    </header>
  );
}