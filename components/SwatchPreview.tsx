import React, { useEffect, useState } from 'react';

type SwatchPreviewProps = {
  src?: string | null;
  alt: string;
  className?: string;
  labelClassName?: string;
  fallbackLabel?: string;
};

export const SwatchPreview: React.FC<SwatchPreviewProps> = ({
  src,
  alt,
  className = '',
  labelClassName = '',
  fallbackLabel = 'Coming soon',
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [src]);

  const shouldShowImage = Boolean(src) && !imageError;

  if (shouldShowImage) {
    return (
      <img
        src={src as string}
        alt={alt}
        onError={() => setImageError(true)}
        className={className}
      />
    );
  }

  return (
    <div
      className={[
        'relative overflow-hidden rounded border border-dashed border-amber-300 bg-gradient-to-br from-amber-50 via-white to-stone-100',
        'text-center text-[10px] font-medium tracking-wide text-amber-900/75 shadow-sm',
        className,
      ].join(' ')}
      aria-label={`${alt} unavailable`}
      role="img"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.30),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(217,119,6,0.12),_transparent_36%)]" />
      <div className="relative flex h-full w-full items-center justify-center px-2">
        <div className="space-y-1">
          <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full border border-amber-200 bg-white/80 text-amber-600 shadow-sm">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
              <path
                d="M4 15.5V7.75A2.75 2.75 0 0 1 6.75 5h10.5A2.75 2.75 0 0 1 20 7.75v6.5A2.75 2.75 0 0 1 17.25 17H9.4l-3.3 2.45c-.4.3-1 .01-1-.48V15.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M8.25 9.75h7.5M8.25 12.75h4.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className={labelClassName}>{fallbackLabel}</div>
        </div>
      </div>
    </div>
  );
};
