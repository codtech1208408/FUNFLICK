import React from 'react';
import { FunFlickLogo } from './FunFlickLogo';

interface SplashScreenProps {
  onFinish?: () => void;
  onGetStarted?: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, onGetStarted }) => {
  const handleStart = () => {
    if (onGetStarted) onGetStarted();
    if (onFinish) onFinish();
  };

  return (
    <div className="w-full h-full min-h-full bg-[#090a0f] flex flex-col justify-between p-6 text-white select-none relative overflow-hidden animate-fade-in">
      {/* Background ambient lighting at bottom */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-t from-purple-600/30 via-rose-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top spacer */}
      <div className="h-6" />

      {/* Center Logo & Tagline (Screen 1) */}
      <div className="flex flex-col items-center text-center space-y-4 z-10 my-auto">
        <div className="relative">
          <FunFlickLogo size="xl" showWordmark={true} />
        </div>

        <p className="text-sm text-slate-300 font-medium tracking-wide">
          Comedy. Entertainment.
          <br />
          <span className="text-white font-bold">Always On!</span>
        </p>
      </div>

      {/* Bottom CTA Button & Tagline (Screen 1) */}
      <div className="w-full space-y-4 z-10 pb-4">
        <button
          onClick={handleStart}
          className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-rose-500/25 transition-all transform active:scale-95 flex items-center justify-center tracking-wide"
        >
          Get Started
        </button>

        <p className="text-center text-[11px] text-slate-400 font-medium tracking-wider">
          Watch • Create • Follow • Earn
        </p>
      </div>
    </div>
  );
};

