export function QualityFilter({ 
  selectedQuality, 
  onChange 
}: {
  selectedQuality: 'SD' | 'HD' | 'FHD' | 'ALL',
  onChange: (quality: 'SD' | 'HD' | 'FHD' | 'ALL') => void
}) {
  return (
    <div className="flex gap-2">
      {['ALL', 'SD', 'HD', 'FHD'].map(quality => (
        <button
          key={quality}
          onClick={() => onChange(quality as any)}
          className={`px-3 py-1 rounded ${
            selectedQuality === quality 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-700'
          }`}
        >
          {quality}
        </button>
      ))}
    </div>
  );
} 