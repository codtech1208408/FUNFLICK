import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, MessageCircle, Share2, Bookmark, Music, Play, UserPlus, UserCheck, Sparkles, Volume2, VolumeX } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { CommentDrawer } from '../../components/video/CommentDrawer';
import { VideoActionsDrawer } from '../../components/video/VideoActionsDrawer';
import { SubscribeModal } from '../../components/subscription/SubscribeModal';

export const DEFAULT_REELS = [
  {
    id: 'demo-pavani-1',
    creatorId: 'creator-pavani',
    title: "When your friend says 'Diet from Monday' 🤣🤣",
    description: "When your friend says 'Diet from Monday' 🤣🤣 #comedy #funny #diet #relatable",
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-video-call-with-her-phone-41527-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    viewsCount: '2.4M',
    likesCount: 25400,
    commentsCount: 1200,
    sharesCount: 5600,
    savesCount: 3100,
    creator: {
      id: 'creator-pavani',
      username: 'pavani_official',
      profile: {
        fullName: 'Pavani Reddy',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        isVerified: true
      }
    },
    audioTitle: 'Original Audio - Pavani Comedy Specials'
  },
  {
    id: 'demo-funbros-2',
    creatorId: 'creator-funbros',
    title: 'Expectation vs Reality in Office Meetings 🏢😭',
    description: 'When the meeting could have been a 10 second email 💀 #officecomedy #worklife #funbros',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-smartphone-in-his-hand-41530-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    viewsCount: '1.6M',
    likesCount: 18200,
    commentsCount: 890,
    sharesCount: 3400,
    savesCount: 2100,
    creator: {
      id: 'creator-funbros',
      username: 'fun_bros',
      profile: {
        fullName: 'Fun Bros Comedy',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
        isVerified: true
      }
    },
    audioTitle: 'Fun Bros Trending Comedy Beat'
  },
  {
    id: 'demo-raju-3',
    creatorId: 'creator-raju',
    title: "When mom says 'Just 5 minutes' and 2 hours pass ⏰",
    description: "Every mom ever! Who else relates? 😂 #comedy #relatable #skit #funny",
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-recording-a-video-with-her-smartphone-41526-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    viewsCount: '1.1M',
    likesCount: 14800,
    commentsCount: 640,
    sharesCount: 2100,
    savesCount: 1800,
    creator: {
      id: 'creator-raju',
      username: 'comedy_raju',
      profile: {
        fullName: 'Comedy Raju',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        isVerified: false
      }
    },
    audioTitle: 'Comedy Raju Skit Audio'
  },
  {
    id: 'demo-mammu-4',
    creatorId: 'creator-mammu',
    title: 'Me trying to save money vs Me on weekends 💸💸',
    description: 'My bank account watching me buy unnecessary stuff at 3 AM 🤡 #memes #chillmammu #relatable',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-filming-herself-with-a-smartphone-41528-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    viewsCount: '950K',
    likesCount: 12100,
    commentsCount: 510,
    sharesCount: 1900,
    savesCount: 1400,
    creator: {
      id: 'creator-mammu',
      username: 'chill_mammu',
      profile: {
        fullName: 'Chill Mammu',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        isVerified: false
      }
    },
    audioTitle: 'Chill Mammu Viral Remix'
  },
  {
    id: 'demo-sam-5',
    creatorId: 'creator-sam',
    title: 'Late night thoughts when you try to sleep at 2 AM 🧠⚡',
    description: 'Brain: Hey, remember that embarrassing thing you did in 5th grade? 😭 #standup #comedy #sam',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-with-glasses-looking-at-his-phone-41529-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    viewsCount: '820K',
    likesCount: 9600,
    commentsCount: 430,
    sharesCount: 1500,
    savesCount: 980,
    creator: {
      id: 'creator-sam',
      username: 'standup_sam',
      profile: {
        fullName: 'Sam Miller',
        avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=200&q=80',
        isVerified: true
      }
    },
    audioTitle: 'Standup Sam Live Laughs'
  }
];

export const HomeFeed: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'for_you' | 'trending' | 'latest'>('for_you');
  const [videos, setVideos] = useState<any[]>(DEFAULT_REELS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [playingState, setPlayingState] = useState<Record<number, boolean>>({ 0: true });

  // Social states map for reels
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likeCountMap, setLikeCountMap] = useState<Record<string, number>>({});
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  // Drawers & Modals
  const [showComments, setShowComments] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string>('demo-pavani-1');

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    fetchFeed();
  }, [activeTab]);

  const fetchFeed = async () => {
    try {
      const res = await api.get('/videos/feed', {
        params: {
          section: activeTab === 'for_you' ? 'recommended' : activeTab === 'trending' ? 'trending' : 'recent',
          limit: 10
        }
      });
      if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setVideos(res.data.data);
      } else {
        setVideos(DEFAULT_REELS);
      }
    } catch (err) {
      setVideos(DEFAULT_REELS);
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight;
    const index = Math.round(scrollTop / height);
    if (index !== activeIndex && index >= 0 && index < videos.length) {
      setActiveIndex(index);
      // Auto play active reel, pause others
      videoRefs.current.forEach((videoEl, idx) => {
        if (videoEl) {
          if (idx === index) {
            videoEl.currentTime = 0;
            videoEl.play().catch(() => {});
            setPlayingState((prev) => ({ ...prev, [idx]: true }));
          } else {
            videoEl.pause();
            setPlayingState((prev) => ({ ...prev, [idx]: false }));
          }
        }
      });
    }
  };

  const togglePlay = (index: number) => {
    const videoEl = videoRefs.current[index];
    if (videoEl) {
      if (playingState[index]) {
        videoEl.pause();
        setPlayingState((prev) => ({ ...prev, [index]: false }));
      } else {
        videoEl.play().catch(() => {});
        setPlayingState((prev) => ({ ...prev, [index]: true }));
      }
    }
  };

  const handleLike = (videoId: string, initialLikes: number) => {
    const currentLiked = !!likedMap[videoId];
    const currentLikes = likeCountMap[videoId] ?? initialLikes;
    setLikedMap((prev) => ({ ...prev, [videoId]: !currentLiked }));
    setLikeCountMap((prev) => ({
      ...prev,
      [videoId]: currentLiked ? currentLikes - 1 : currentLikes + 1
    }));
  };

  const handleDoubleTap = (videoId: string, initialLikes: number) => {
    if (!likedMap[videoId]) handleLike(videoId, initialLikes);
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 700);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-black text-white select-none overflow-hidden">
      {/* Top Floating Navigation Tabs */}
      <div className="absolute top-2 left-0 right-0 z-30 flex items-center justify-between px-5 pointer-events-auto">
        <div className="flex items-center gap-4 text-xs font-bold tracking-tight">
          <button
            onClick={() => setActiveTab('for_you')}
            className={`relative py-1 transition ${
              activeTab === 'for_you' ? 'text-white font-extrabold' : 'text-white/60 hover:text-white'
            }`}
          >
            <span>For You</span>
            {activeTab === 'for_you' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2.5px] bg-white rounded-full shadow-sm" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('trending')}
            className={`relative py-1 transition ${
              activeTab === 'trending' ? 'text-white font-extrabold' : 'text-white/60 hover:text-white'
            }`}
          >
            <span>Trending</span>
            {activeTab === 'trending' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2.5px] bg-white rounded-full shadow-sm" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('latest')}
            className={`relative py-1 transition ${
              activeTab === 'latest' ? 'text-white font-extrabold' : 'text-white/60 hover:text-white'
            }`}
          >
            <span>Latest</span>
            {activeTab === 'latest' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2.5px] bg-white rounded-full shadow-sm" />
            )}
          </button>
        </div>

        <Link
          to="/explore"
          className="p-1.5 rounded-full bg-black/30 backdrop-blur-md text-white/90 hover:text-white transition"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </Link>
      </div>

      {/* Snap Scrollable Vertical Reels Feed Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="reels-container w-full h-full flex-1 overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      >
        {videos.map((vid, index) => {
          const videoId = vid.id || `video-${index}`;
          const creator = vid.creator || {};
          const profile = creator.profile || {};
          const isLiked = !!likedMap[videoId];
          const likesCount = likeCountMap[videoId] ?? (vid.likesCount || 25400);
          const isFollowing = !!followingMap[creator.id || videoId];
          const isCurrentPlaying = playingState[index] !== false;

          return (
            <div
              key={videoId}
              className="relative w-full h-full snap-start snap-always flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => togglePlay(index)}
              onDoubleClick={() => handleDoubleTap(videoId, vid.likesCount || 25400)}
            >
              {/* Main Reel Video / Poster */}
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={vid.videoUrl}
                poster={vid.thumbnailUrl}
                autoPlay={index === 0}
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Double-tap animated heart */}
              {showHeartAnim && activeIndex === index && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-scale-up">
                  <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-2xl" />
                </div>
              )}

              {/* Play/Pause state overlay */}
              {!isCurrentPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none z-20">
                  <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                    <Play className="w-7 h-7 fill-white ml-1" />
                  </div>
                </div>
              )}

              {/* Mute button on top-right */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="absolute top-12 right-4 z-30 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white/90 flex items-center justify-center border border-white/10"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Bottom Creator Info & Caption */}
              <div className="absolute bottom-16 left-3 right-16 z-20 space-y-2 pointer-events-none text-left drop-shadow-md">
                {/* Creator handle + Follow pill */}
                <div className="flex items-center gap-2 pointer-events-auto max-w-full">
                  <Link
                    to={`/profile/${creator.username || 'pavani_official'}`}
                    className="flex items-center gap-1 font-bold text-xs text-white hover:underline min-w-0 max-w-[65%]"
                  >
                    <span className="truncate">@{creator.username || 'pavani_official'}</span>
                    {(profile.isVerified ?? true) && (
                      <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-[8px] flex items-center justify-center font-bold text-white flex-shrink-0">
                        ✓
                      </span>
                    )}
                  </Link>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFollowingMap((prev) => ({
                        ...prev,
                        [creator.id || videoId]: !isFollowing
                      }));
                    }}
                    className={`px-3 py-0.5 rounded-full text-[11px] font-bold transition shadow-sm flex-shrink-0 ${
                      isFollowing
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-rose-500 hover:bg-rose-600 text-white'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>

                {/* Title & Caption */}
                <p className="text-[12px] text-white/95 leading-snug line-clamp-2">
                  {vid.title || vid.description || "When your friend says 'Diet from Monday' 🤣🤣"}
                </p>

                {/* Sound audio ticker */}
                <div className="flex items-center gap-1.5 text-[11px] text-white/90 font-medium">
                  <Music className="w-3.5 h-3.5 animate-pulse" />
                  <span className="truncate">{vid.audioTitle || 'Original Audio - FunFlick Comedy Specials'}</span>
                </div>
              </div>

              {/* Right Side Action Rail */}
              <div className="absolute bottom-16 right-2.5 z-20 flex flex-col items-center gap-3.5 pointer-events-auto">
                {/* Creator Avatar with follow border */}
                <Link
                  to={`/profile/${creator.username || 'pavani_official'}`}
                  className="relative mb-1"
                >
                  <img
                    src={
                      profile.avatarUrl ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                    }
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border-2 border-rose-500 shadow-lg"
                  />
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow">
                    +
                  </div>
                </Link>

                {/* Like Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(videoId, vid.likesCount || 25400);
                  }}
                  className="flex flex-col items-center gap-0.5 group"
                >
                  <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-active:scale-125 transition">
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                  </div>
                  <span className="text-[10px] font-bold text-white drop-shadow">
                    {typeof likesCount === 'number' ? (likesCount >= 1000 ? `${(likesCount / 1000).toFixed(1)}K` : likesCount) : likesCount}
                  </span>
                </button>

                {/* Comments Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveVideoId(videoId);
                    setShowComments(true);
                  }}
                  className="flex flex-col items-center gap-0.5 group"
                >
                  <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-active:scale-125 transition">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-white drop-shadow">
                    {vid.commentsCount ? `${(vid.commentsCount / 1000).toFixed(1)}K` : '1.2K'}
                  </span>
                </button>

                {/* Share / Actions Drawer */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveVideoId(videoId);
                    setShowActions(true);
                  }}
                  className="flex flex-col items-center gap-0.5 group"
                >
                  <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-active:scale-125 transition">
                    <Share2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-white drop-shadow">
                    {vid.sharesCount ? `${(vid.sharesCount / 1000).toFixed(1)}K` : '5.6K'}
                  </span>
                </button>

                {/* Rotating Audio Disc */}
                <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center animate-spin-slow shadow-lg mt-1">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drawers & Modals */}
      <CommentDrawer
        videoId={activeVideoId}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />

      <VideoActionsDrawer
        isOpen={showActions}
        onClose={() => setShowActions(false)}
        videoId={activeVideoId}
        title="FunFlick Reel"
      />

      {showSubscribe && (
        <SubscribeModal
          plan={{
            id: 'pavani-vip',
            name: 'Pavani VIP Fan Club',
            priceCents: 9900,
            creator: {
              displayName: 'Pavani Official',
              handle: 'pavani_official',
              avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
            }
          }}
          isOpen={showSubscribe}
          onClose={() => setShowSubscribe(false)}
        />
      )}
    </div>
  );
};
