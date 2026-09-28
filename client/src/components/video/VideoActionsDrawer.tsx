import React from 'react';
import { Share2, Bookmark, Flag, HeartCrack } from 'lucide-react';

interface VideoActionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  videoId?: string;
  title?: string;
  isSaved?: boolean;
}

export const VideoActionsDrawer: React.FC<VideoActionsDrawerProps> = ({
  isOpen,
  onClose,
  videoId,
  title,
  isSaved = false
}) => {
  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-fade-in select-none">
      <div className="w-full bg-white text-slate-800 rounded-t-3xl p-5 space-y-4 shadow-2xl border-t border-slate-100">
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto" />

        {/* 4 Quick Action Items (Screen 8) */}
        <div className="grid grid-cols-4 gap-2 py-3 text-center">
          {/* Share */}
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200/70 transition shadow-xs">
              <Share2 className="w-5 h-5 text-slate-700" />
            </div>
            <span className="text-[10.5px] font-semibold text-slate-700">Share</span>
          </button>

          {/* Save */}
          <button
            onClick={() => {
              alert('Video saved to your collection!');
              onClose();
            }}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200/70 transition shadow-xs">
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-500 text-amber-500' : 'text-slate-700'}`} />
            </div>
            <span className="text-[10.5px] font-semibold text-slate-700">Save</span>
          </button>

          {/* Report */}
          <button
            onClick={() => {
              alert('Thank you for reporting. Our moderation team will review this video.');
              onClose();
            }}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200/70 transition shadow-xs">
              <Flag className="w-5 h-5 text-slate-700" />
            </div>
            <span className="text-[10.5px] font-semibold text-slate-700">Report</span>
          </button>

          {/* Not Interested */}
          <button
            onClick={() => {
              alert('We will show fewer videos like this.');
              onClose();
            }}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200/70 transition shadow-xs">
              <HeartCrack className="w-5 h-5 text-slate-700" />
            </div>
            <span className="text-[10.5px] font-semibold text-slate-700">Not Interested</span>
          </button>
        </div>

        {/* Cancel Button (Screen 8) */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition shadow-xs"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

