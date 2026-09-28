import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { ReelCard, ReelData } from '../../components/video/ReelCard';
import { DEFAULT_REELS } from './HomeFeed';

export const ReelsPage: React.FC = () => {
  const [reels, setReels] = useState<ReelData[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const getMappedDefaultReels = (): ReelData[] => {
    return DEFAULT_REELS.map((item) => ({
      id: item.id,
      creatorId: item.creatorId,
      title: item.title,
      description: item.description,
      videoUrl: item.videoUrl,
      thumbnailUrl: item.thumbnailUrl,
      viewsCount: 2400000,
      likesCount: item.likesCount,
      commentsCount: item.commentsCount,
      sharesCount: item.sharesCount,
      savesCount: item.savesCount,
      isLiked: false,
      isSaved: false,
      isFollowing: false,
      creator: {
        id: item.creator.id,
        username: item.creator.username,
        profile: item.creator.profile,
        creatorProfile: {
          handle: item.creator.username,
          displayName: item.creator.profile.fullName,
          subscriberCount: 2800000
        }
      },
      category: { name: 'Comedy', slug: 'comedy' },
      hashtags: [{ hashtag: { tag: 'comedy' } }, { hashtag: { tag: 'funny' } }]
    }));
  };

  const fetchReels = async () => {
    try {
      setLoading(true);
      const res = await api.get('/videos/reels', { params: { limit: 12 } });
      if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setReels(res.data.data);
      } else {
        setReels(getMappedDefaultReels());
      }
    } catch (err) {
      setReels(getMappedDefaultReels());
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
