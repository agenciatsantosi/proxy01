import { useState } from 'react';
import classNames from 'classnames';

interface ProxyImageProps {
  src: string;
  alt?: string;
  className?: string;
  fallbackText?: string;
}

export default function ProxyImage({ src, alt = '', className = '', fallbackText }: ProxyImageProps) {
  const [error, setError] = useState(false);

  if (!src) {
    return (
      <div className={classNames(
        'w-full h-full flex items-center justify-center bg-gray-900',
        className
      )}>
        <span className="text-sm text-gray-400 px-2 text-center">
          {fallbackText || alt || 'Imagem não disponível'}
        </span>
      </div>
    );
  }

  const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(src)}`;

  if (error) {
    return (
      <div className={classNames(
        'w-full h-full flex items-center justify-center bg-gray-900',
        className
      )}>
        <span className="text-sm text-gray-400 px-2 text-center">
          {fallbackText || alt || 'Imagem não disponível'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={proxyUrl}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
