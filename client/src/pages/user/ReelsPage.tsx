import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { ReelCard, ReelData } from '../../components/video/ReelCard';
import { Flame } from 'lucide-react';

export const ReelsPage: React.FC = () => {
  const [reels, setReels] = useState<ReelData[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchReels = async () => {
    try {
      setLoading(true);
      const res = await api.get('/videos/reels', { params: { limit: 12 } });
      if (res.data.success) {
        setReels(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load reels', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  // Keyboard Navigation (Up/Down arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        scrollIndex(activeIndex + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        scrollIndex(activeIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, reels.length]);

  const scrollIndex = (targetIdx: number) => {
    if (targetIdx < 0 || targetIdx >= reels.length || !containerRef.current) return;
    const children = containerRef.current.children;
    if (children[targetIdx]) {
      children[targetIdx].scrollIntoView({ behavior: 'smooth' });
      setActiveIndex(targetIdx);
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight;
    const newIdx = Math.round(scrollTop / height);
    if (newIdx !== activeIndex && newIdx >= 0 && newIdx < reels.length) {
      setActiveIndex(newIdx);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-300">Loading FunFlick Comedy Reels...</p>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-3">
        <Flame className="w-16 h-16 text-rose-500" />
        <h2 className="text-xl font-bold text-white">No Reels Available</h2>
        <p className="text-xs text-slate-400">Check back later or upload your own comedy sketch!</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex-1 overflow-hidden flex items-center justify-center">
      {/* Snap Scrollable Reels Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="reels-container w-full h-full"
      >
        {reels.map((reel, idx) => (
          <div key={reel.id} className="w-full h-full flex items-center justify-center reel-section">
            <ReelCard reel={reel} isActive={idx === activeIndex} />
          </div>
        ))}
      </div>
    </div>
  );
};
