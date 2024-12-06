export function SeriesInfo({ series, episodes }: SeriesInfoProps) {
  return (
    <div className="p-6 bg-gray-900">
      <div className="flex gap-6">
        <img 
          src={series.seriesInfo?.poster} 
          alt={series.name}
          className="w-48 h-72 object-cover rounded-lg"
        />
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{series.name}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
            <span>{episodes.length} Episódios</span>
            <span>{new Set(episodes.map(ep => ep.seriesInfo?.season)).size} Temporadas</span>
          </div>
          {/* ... mais informações ... */}
        </div>
      </div>
    </div>
  );
} 