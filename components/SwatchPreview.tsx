import React, { useEffect, useState } from 'react';

type SwatchPreviewProps = {
  src?: string | null;
  alt: string;
  className?: string;
  labelClassName?: string;
  fallbackLabel?: string;
  variant?: 'badge' | 'card';
};

const sharedFallbackLabelClasses = 'text-[10px] font-semibold tracking-[0.18em] uppercase';

export const SwatchPreview: React.FC<SwatchPreviewProps> = ({
  src,
  alt,
  className = '',
  labelClassName = '',
  fallbackLabel = 'Coming soon',
  variant = 'card',
}) => {
  const [imageError, setImageError] = useState(false);
  const effectiveLabel = variant === 'badge' ? 'Soon' : fallbackLabel;

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
        'relative isolate overflow-hidden rounded border border-sky-200 bg-slate-50',
        className,
      ].join(' ')}
      aria-label={`${alt} unavailable`}
      role="img"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(186,230,253,0.95),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(153,246,228,0.55),transparent_28%),radial-gradient(circle_at_70%_84%,rgba(14,165,233,0.22),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.03),rgba(255,255,255,0.10))]" />
      <div className="absolute inset-0 opacity-70 mix-blend-multiply">
        <svg viewBox="0 0 200 120" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M-10 26C18 10 42 14 69 25s52 17 79 8 47-9 72 3" stroke="rgba(8,47,73,0.20)" strokeWidth="12" />
            <path d="M-10 42C21 28 46 32 73 41s50 16 77 7 49-7 70 4" stroke="rgba(14,116,144,0.22)" strokeWidth="15" />
            <path d="M-10 60C16 46 42 50 68 58s47 14 76 6 50-9 74 2" stroke="rgba(45,212,191,0.18)" strokeWidth="13" />
            <path d="M-10 78C18 68 43 72 68 79s49 13 77 5 48-8 72 3" stroke="rgba(15,118,110,0.14)" strokeWidth="16" />
            <path d="M-10 92C18 85 41 88 66 94s49 11 76 5 48-6 72 2" stroke="rgba(15,23,42,0.08)" strokeWidth="10" />
          </g>
        </svg>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_72%,rgba(255,255,255,0.38),transparent_28%)]" />
      <div className="relative flex h-full w-full items-center justify-center px-2 text-sky-950/80">
        <div className={variant === 'badge' ? 'space-y-1.5 text-center' : 'space-y-2 text-center'}>
          <div className={[
            'mx-auto flex items-center justify-center rounded-full border bg-white/80 shadow-sm backdrop-blur',
            variant === 'badge'
              ? 'h-6 w-6 border-sky-200 text-sky-700'
              : 'h-9 w-9 border-teal-200 text-teal-700',
          ].join(' ')}>
            <svg viewBox="0 0 24 24" className={variant === 'badge' ? 'h-3.5 w-3.5' : 'h-4.5 w-4.5'} fill="none" aria-hidden="true">
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
          <div className={[sharedFallbackLabelClasses, 'text-sky-900/80', labelClassName].join(' ')}>
            {effectiveLabel}
          </div>
          {variant === 'card' && (
            <div className="mx-auto max-w-[11rem] rounded-full border border-white/70 bg-white/45 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.24em] text-slate-600/80 backdrop-blur-sm">
              Swatch image pending
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
