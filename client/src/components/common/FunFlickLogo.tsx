import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
}

export const FunFlickLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Official FunFlick Icon */}
      <svg
        viewBox="0 0 100 100"
        className={`${iconSizes[size]} drop-shadow-[0_4px_12px_rgba(244,63,94,0.35)] transition-transform hover:scale-105`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ff-border-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="30%" stopColor="#fb7185" />
            <stop offset="65%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          <linearGradient id="ff-play-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>

          <linearGradient id="ff-top-reel" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>

        {/* Top reel film perforations */}
        <path
          d="M 38 18 L 48 18 L 44 26 L 34 26 Z"
          fill="url(#ff-top-reel)"
          rx="1"
        />
        <path
          d="M 52 18 L 64 18 L 60 26 L 48 26 Z"
          fill="url(#ff-top-reel)"
          rx="1"
        />

        {/* Outer Curved Squircle Frame */}
        <rect
          x="12"
          y="24"
          width="76"
          height="66"
          rx="24"
          stroke="url(#ff-border-grad)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="#0c0e17"
        />

        {/* Play Triangle */}
        <path
          d="M 40 40.5 C 40 37.8 43.1 36.2 45.4 37.7 L 66.8 51.2 C 69 52.6 69 55.9 66.8 57.3 L 45.4 70.8 C 43.1 72.3 40 70.7 40 68.0 Z"
          fill="url(#ff-play-grad)"
        />

        {/* Playful Burst Sparkle Rays */}
        <rect x="74" y="42" width="10" height="4.5" rx="2.2" fill="#fbbf24" transform="rotate(-30 74 42)" />
        <rect x="77" y="55" width="10" height="4.5" rx="2.2" fill="#f43f5e" />
        <rect x="74" y="67" width="10" height="4.5" rx="2.2" fill="#38bdf8" transform="rotate(30 74 67)" />
      </svg>

      {/* Official FunFlick Lowercase Wordmark */}
      {showWordmark && (
        <span className={`font-extrabold tracking-tight ${textSizes[size]} leading-none`}>
          <span className="text-[#f59e0b]">f</span>
          <span className="text-[#fb7185]">u</span>
          <span className="text-[#f43f5e]">n</span>
          <span className="text-[#c084fc]">f</span>
          <span className="text-[#a855f7]">l</span>
          <span className="text-[#60a5fa]">i</span>
          <span className="text-[#38bdf8]">c</span>
          <span className="text-[#0284c7]">k</span>
        </span>
      )}
    </div>
  );
};
