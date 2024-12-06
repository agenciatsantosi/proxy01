import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SeasonSelectorProps {
  seasons: number[];
  currentSeason: number;
  onSeasonChange: (season: number) => void;
}

export function SeasonSelector({ seasons, currentSeason, onSeasonChange }: SeasonSelectorProps) {
  return (
    <div className="relative flex items-center gap-4 p-4">
      <button 
        className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white"
        onClick={() => {
          const currentIndex = seasons.indexOf(currentSeason);
          if (currentIndex > 0) {
            onSeasonChange(seasons[currentIndex - 1]);
          }
        }}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-red-500">
        <div className="flex gap-2">
          {seasons.map(season => (
            <button
              key={season}
              onClick={() => onSeasonChange(season)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all
                ${currentSeason === season 
                  ? 'bg-red-500 text-white scale-105' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
              Temporada {season}
            </button>
          ))}
        </div>
      </div>

      <button 
        className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white"
        onClick={() => {
          const currentIndex = seasons.indexOf(currentSeason);
          if (currentIndex < seasons.length - 1) {
            onSeasonChange(seasons[currentIndex + 1]);
          }
        }}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
} 