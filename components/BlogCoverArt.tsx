import React from 'react';

type BlogCoverTone = 'sky' | 'teal' | 'emerald' | 'indigo';
type BlogCoverVariant = 'card' | 'hero';

type BlogCoverArtProps = {
  title: string;
  imageSrc?: string | null;
  tone?: BlogCoverTone;
  variant?: BlogCoverVariant;
  className?: string;
  showCaption?: boolean;
};

const toneMap: Record<BlogCoverTone, {
  base: string;
  glowA: string;
  glowB: string;
  glowC: string;
  stroke: string;
}> = {
  sky: {
    base: 'from-sky-50 via-white to-cyan-100',
    glowA: 'rgba(186,230,253,0.92)',
    glowB: 'rgba(125,211,252,0.56)',
    glowC: 'rgba(59,130,246,0.18)',
    stroke: 'rgba(14,116,144,0.18)',
  },
  teal: {
    base: 'from-teal-50 via-white to-cyan-100',
    glowA: 'rgba(153,246,228,0.9)',
    glowB: 'rgba(45,212,191,0.52)',
    glowC: 'rgba(13,148,136,0.18)',
    stroke: 'rgba(13,148,136,0.18)',
  },
  emerald: {
    base: 'from-emerald-50 via-white to-teal-100',
    glowA: 'rgba(167,243,208,0.9)',
    glowB: 'rgba(110,231,183,0.5)',
    glowC: 'rgba(4,120,87,0.15)',
    stroke: 'rgba(4,120,87,0.16)',
  },
  indigo: {
    base: 'from-indigo-50 via-white to-sky-100',
    glowA: 'rgba(199,210,254,0.88)',
    glowB: 'rgba(125,211,252,0.44)',
    glowC: 'rgba(67,56,202,0.14)',
    stroke: 'rgba(67,56,202,0.16)',
  },
};

export const BlogCoverArt: React.FC<BlogCoverArtProps> = ({
  title,
  imageSrc,
  tone = 'sky',
  variant = 'card',
  className = '',
  showCaption = true,
}) => {
  const palette = toneMap[tone];
  const heightClass = variant === 'hero' ? 'aspect-[16/7]' : 'aspect-[16/9]';

  if (imageSrc) {
    return (
      <img
        src={imageSrc}
        alt={title}
        className={['w-full object-cover', heightClass, className].join(' ')}
      />
    );
  }

  return (
    <div
      className={[
        'relative isolate overflow-hidden rounded-3xl border border-white/70 shadow-sm',
        `bg-gradient-to-br ${palette.base}`,
        heightClass,
        className,
      ].join(' ')}
      role="img"
      aria-label={`${title} cover art`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(255,255,255,0.92),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.55),transparent_24%),radial-gradient(circle_at_50%_82%,rgba(255,255,255,0.38),transparent_22%)]" />
      <div className="absolute inset-0 opacity-60 mix-blend-multiply">
        <svg viewBox="0 0 1200 500" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M-40 130C90 35 190 50 325 114s248 100 390 54 264-54 485 20" stroke={palette.stroke} strokeWidth="74" />
            <path d="M-40 196C88 104 206 115 335 178s245 94 392 46 268-58 490 18" stroke={palette.stroke} strokeWidth="90" opacity="0.85" />
            <path d="M-40 268C96 184 200 196 330 252s242 84 388 36 270-58 502 15" stroke={palette.stroke} strokeWidth="82" opacity="0.78" />
            <path d="M-40 338C98 258 208 267 338 319s243 75 390 29 275-52 498 12" stroke={palette.stroke} strokeWidth="74" opacity="0.7" />
          </g>
        </svg>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.15),rgba(255,255,255,0.35))]" />
      <div className="absolute inset-0 opacity-75 mix-blend-multiply">
        <svg viewBox="0 0 1200 500" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
          <g fill="none" strokeLinecap="round">
            <path d="M-60 122C70 60 189 74 323 133s242 103 390 52 266-58 500 20" stroke={palette.glowA} strokeWidth="22" />
            <path d="M-60 194C82 122 201 126 332 186s243 96 388 45 266-59 490 16" stroke={palette.glowB} strokeWidth="20" />
            <path d="M-60 268C92 208 206 209 338 260s243 78 390 31 270-53 486 10" stroke={palette.glowC} strokeWidth="18" />
            <path d="M-60 338C98 282 209 285 342 334s245 70 393 25 270-48 477 8" stroke={palette.glowA} strokeWidth="16" opacity="0.85" />
          </g>
        </svg>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/55 to-transparent" />
      {showCaption && (
        <div className="relative flex h-full items-end justify-between p-4 md:p-6">
          <div className="max-w-[70%]">
            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-slate-600/75">
              Cover image
            </p>
            <p className="mt-2 text-sm md:text-base font-semibold text-slate-900/80">
              {variant === 'hero' ? 'Space for a full article hero image' : 'Space for a blog cover image'}
            </p>
          </div>
          <div className="rounded-full border border-white/80 bg-white/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-600 shadow-sm backdrop-blur-sm">
            Preview
          </div>
        </div>
      )}
    </div>
  );
};
