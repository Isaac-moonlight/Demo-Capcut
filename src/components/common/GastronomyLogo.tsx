import React, { useRef } from 'react';

interface GastronomyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onTripleClick?: () => void;
  showText?: boolean;
  className?: string;
}

export const GastronomyLogo: React.FC<GastronomyLogoProps> = ({
  size = 'md',
  onTripleClick,
  showText = true,
  className = '',
}) => {
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      if (onTripleClick) {
        onTripleClick();
      }
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 1000);
    }
  };

  const dimensions = {
    sm: { w: 38, h: 38, textSize: 'text-base', subSize: 'text-[9px]' },
    md: { w: 50, h: 50, textSize: 'text-xl', subSize: 'text-[10px]' },
    lg: { w: 72, h: 72, textSize: 'text-2xl', subSize: 'text-xs' },
    xl: { w: 96, h: 96, textSize: 'text-3xl', subSize: 'text-sm' },
  }[size];

  return (
    <div
      onClick={handleClick}
      className={`inline-flex items-center gap-3 select-none cursor-pointer group ${className}`}
      title="DineFlow Pro - Haute Gastronomie"
    >
      <div className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
        {/* Glow ambient */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-400/30 to-amber-600/20 blur-md pointer-events-none" />

        <svg
          width={dimensions.w}
          height={dimensions.h}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative drop-shadow-[0_4px_12px_rgba(245,158,11,0.25)]"
        >
          <defs>
            {/* Metallic Gold Gradient */}
            <linearGradient id="goldSheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="25%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="75%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            {/* Silver Chrome Cutlery Gradient */}
            <linearGradient id="silverChrome" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#e2e8f0" />
              <stop offset="70%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            {/* Shield Outer Gradient */}
            <radialGradient id="shieldBg" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#1e2230" />
              <stop offset="85%" stopColor="#0b0e14" />
            </radialGradient>
          </defs>

          {/* 1. French Coat of Arms / Blason Contour */}
          <path
            d="M60 6 C85 6 106 18 106 44 C106 82 60 114 60 114 C60 114 14 82 14 44 C14 18 35 6 60 6 Z"
            fill="url(#shieldBg)"
            stroke="url(#goldSheen)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Inner Golden Rim Line */}
          <path
            d="M60 12 C80 12 99 21 99 44 C99 76 60 105 60 105 C60 105 21 76 21 44 C21 21 40 12 60 12 Z"
            fill="none"
            stroke="url(#goldSheen)"
            strokeWidth="1.2"
            strokeOpacity="0.6"
            strokeDasharray="2 2"
          />

          {/* 2. Laurel Wreath (Couronne de Lauriers sur les côtés) */}
          <g stroke="url(#goldSheen)" strokeWidth="1.5" fill="none" opacity="0.85">
            {/* Left branch */}
            <path d="M26 40 C24 55 30 75 42 88" />
            <ellipse cx="26" cy="46" rx="3.5" ry="2" transform="rotate(-30 26 46)" fill="url(#goldSheen)" />
            <ellipse cx="28" cy="58" rx="3.5" ry="2" transform="rotate(-15 28 58)" fill="url(#goldSheen)" />
            <ellipse cx="33" cy="70" rx="3.5" ry="2" transform="rotate(10 33 70)" fill="url(#goldSheen)" />
            <ellipse cx="40" cy="81" rx="3.5" ry="2" transform="rotate(35 40 81)" fill="url(#goldSheen)" />

            {/* Right branch */}
            <path d="M94 40 C96 55 90 75 78 88" />
            <ellipse cx="94" cy="46" rx="3.5" ry="2" transform="rotate(30 94 46)" fill="url(#goldSheen)" />
            <ellipse cx="92" cy="58" rx="3.5" ry="2" transform="rotate(15 92 58)" fill="url(#goldSheen)" />
            <ellipse cx="87" cy="70" rx="3.5" ry="2" transform="rotate(-10 87 70)" fill="url(#goldSheen)" />
            <ellipse cx="80" cy="81" rx="3.5" ry="2" transform="rotate(-35 80 81)" fill="url(#goldSheen)" />
          </g>

          {/* 3. Three Michelin-Style Stars (3 étoiles dorées au sommet) */}
          {/* Middle star */}
          <path
            d="M60 16 L61.8 21.2 L67.3 21.2 L62.8 24.5 L64.5 29.8 L60 26.5 L55.5 29.8 L57.2 24.5 L52.7 21.2 L58.2 21.2 Z"
            fill="url(#goldSheen)"
          />
          {/* Left star */}
          <path
            d="M48 20 L49.3 23.8 L53.3 23.8 L50.1 26.1 L51.3 29.9 L48 27.6 L44.7 29.9 L45.9 26.1 L42.7 23.8 L46.7 23.8 Z"
            fill="url(#goldSheen)"
            opacity="0.9"
          />
          {/* Right star */}
          <path
            d="M72 20 L73.3 23.8 L77.3 23.8 L74.1 26.1 L75.3 29.9 L72 27.6 L68.7 29.9 L69.9 26.1 L66.7 23.8 L70.7 23.8 Z"
            fill="url(#goldSheen)"
            opacity="0.9"
          />

          {/* 4. Service Cloche (Dôme de Haute Cuisine) */}
          {/* Cloche Knob */}
          <circle cx="60" cy="36" r="3.2" fill="url(#goldSheen)" />
          {/* Cloche Dome */}
          <path
            d="M40 54 C40 43 49 39 60 39 C71 39 80 43 80 54 Z"
            fill="url(#goldSheen)"
            opacity="0.9"
          />
          {/* Cloche Platter Tray Rim */}
          <rect x="36" y="54" width="48" height="3" rx="1.5" fill="url(#goldSheen)" />
          {/* Cloche Steam Curve */}
          <path
            d="M56 34 C55 31 57 29 55 27"
            stroke="url(#goldSheen)"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M64 34 C65 31 63 29 65 27"
            stroke="url(#goldSheen)"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* 5. Crossed Silver Cutlery (Fourchette & Couteau de précision) */}
          <g transform="translate(60, 75)">
            {/* Knife (diagonal right to left) */}
            <g transform="rotate(-38)">
              {/* Blade */}
              <path
                d="M-2 -28 C-2 -28 3 -18 3 -4 L2 0 L-2 0 Z"
                fill="url(#silverChrome)"
              />
              {/* Handle */}
              <rect x="-2" y="0" width="4" height="26" rx="2" fill="url(#silverChrome)" stroke="#64748b" strokeWidth="0.5" />
              <circle cx="0" cy="18" r="1" fill="#475569" />
            </g>

            {/* Fork (diagonal left to right) */}
            <g transform="rotate(38)">
              {/* Fork 4 Tines */}
              <path
                d="M-4 -28 L-4 -16 C-4 -12 -1 -10 -1 -4 L-1 0 L1 0 L1 -4 C1 -10 4 -12 4 -16 L4 -28 L3 -28 L3 -18 L1.5 -18 L1.5 -28 L0.5 -28 L0.5 -18 L-0.5 -18 L-0.5 -28 L-1.5 -28 L-1.5 -18 L-3 -18 L-3 -28 Z"
                fill="url(#silverChrome)"
              />
              {/* Handle */}
              <rect x="-2" y="0" width="4" height="26" rx="2" fill="url(#silverChrome)" stroke="#64748b" strokeWidth="0.5" />
              <circle cx="0" cy="18" r="1" fill="#475569" />
            </g>

            {/* Center Golden Seal */}
            <circle cx="0" cy="0" r="4.5" fill="url(#goldSheen)" />
            <circle cx="0" cy="0" r="2.2" fill="#0b0e14" />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col tracking-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-display-luxury font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent ${dimensions.textSize}`}>
              DineFlow
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500/20 to-amber-600/30 text-amber-300 border border-amber-500/30">
              PRO
            </span>
          </div>
          <span className={`font-serif-luxury italic text-stone-400 dark:text-stone-400 ${dimensions.subSize}`}>
            Haute Gastronomie & Cave d’Exception
          </span>
        </div>
      )}
    </div>
  );
};
