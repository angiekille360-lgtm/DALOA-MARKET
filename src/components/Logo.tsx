import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon';
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  variant = 'full',
  onClick 
}) => {
  const [imageError, setImageError] = useState(false);

  const containerSizes = {
    sm: 'h-9',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24',
  };

  const imageSizes = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const subTextSizes = {
    sm: 'text-[9px] tracking-wider',
    md: 'text-[11px] tracking-widest',
    lg: 'text-xs tracking-[0.2em]',
    xl: 'text-sm tracking-[0.25em]',
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`inline-flex items-center gap-2.5 select-none ${
        onClick ? 'cursor-pointer hover:opacity-95 transition' : ''
      } ${className}`}
    >
      {/* Official Uploaded Logo from /logo.png */}
      {!imageError ? (
        <img
          src="/logo.png"
          alt="DALOA MARKET - Votre Marché Local"
          onError={() => setImageError(true)}
          className={`${imageSizes[size]} object-contain drop-shadow-xs rounded-xl shrink-0`}
        />
      ) : (
        /* Fallback placeholder: DALOA MARKET in Orange & Vert */
        <div
          className={`${imageSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0F5D2E] to-[#093d1e] p-1.5 shadow-sm shrink-0`}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <circle cx="50" cy="50" r="42" stroke="#FF6B00" strokeWidth="8" />
            <path
              d="M 50 20 C 35 20, 25 35, 25 50 C 25 68, 50 88, 50 88 C 50 88, 75 68, 75 50 C 75 35, 65 20, 50 20 Z"
              fill="#0F5D2E"
            />
            <rect x="36" y="44" width="28" height="18" rx="3" fill="#22c55e" />
            <circle cx="45" cy="40" r="4" fill="#FF6B00" />
            <circle cx="55" cy="38" r="4" fill="#eab308" />
          </svg>
        </div>
      )}

      {/* Brand Text (DALOA in green, MARKET in orange) */}
      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <span className={`font-black text-[#0F5D2E] ${textSizes[size]} tracking-tight flex items-center gap-1`}>
            DALOA
          </span>
          <span className={`font-bold text-[#FF6B00] ${subTextSizes[size]}`}>
            MARKET
          </span>
        </div>
      )}
    </div>
  );
};
