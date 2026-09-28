import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, MessageCircle, Share2, Bookmark, Music, Play, UserPlus, UserCheck, Sparkles, Volume2, VolumeX } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { CommentDrawer } from '../../components/video/CommentDrawer';
import { VideoActionsDrawer } from '../../components/video/VideoActionsDrawer';
import { SubscribeModal } from '../../components/subscription/SubscribeModal';

export const HomeFeed: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'for_you' | 'trending' | 'latest'>('for_you');
  const [videos, setVideos] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Interactions
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(25400);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  // Drawers
  const [showComments, setShowComments] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetchFeed();
  }, [activeTab]);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const res = await api.get('/videos/feed', {
        params: {
          section: activeTab === 'for_you' ? 'recommended' : activeTab === 'trending' ? 'trending' : 'recent',
          limit: 10
        }
      });
      if (res.data.success && res.data.data.length > 0) {
        setVideos(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load feed', err);
    } finally {
      setLoading(false);
    }
  };

  const currentVideo = videos[currentIndex] || {
    id: 'demo-pavani-1',
    title: "When your friend says 'Diet from Monday' 🤣🤣",
    description: "When your friend says 'Diet from Monday' 🤣🤣 #comedy #funny",
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-video-call-with-her-phone-41527-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    viewsCount: 1200000,
    likesCount: 25400,
    commentsCount: 1200,
    sharesCount: 5600,
    creator: {
      id: 'creator-pavani',
      username: 'pavani_official',
      profile: {
        fullName: 'Pavani Official',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        isVerified: true
      }
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleDoubleTap = () => {
    if (!isLiked) handleLike();
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 700);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-black text-white select-none overflow-hidden">
      {/* Top Floating Navigation Tabs: For You, Trending, Latest & Search Icon */}
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

      {/* Main Video Viewport */}
      <div
        className="relative w-full h-full flex-1 flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={togglePlay}
        onDoubleClick={handleDoubleTap}
      >
        <video
          ref={videoRef}
          src={currentVideo.videoUrl}
          poster={currentVideo.thumbnailUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Double-tap animated heart */}
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-scale-up">
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-2xl" />
          </div>
        )}

        {/* Play/Pause icon overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <Play className="w-7 h-7 fill-white ml-1" />
            </div>
          </div>
        )}

        {/* Mute button on top-right below search */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          className="absolute top-12 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white/90 flex items-center justify-center border border-white/10"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Bottom Creator Info & Caption (Screen 3) */}
        <div className="absolute bottom-3 left-3 right-16 z-20 space-y-2 pointer-events-none text-left drop-shadow-md">
          {/* Creator handle + Follow pill */}
          <div className="flex items-center gap-2 pointer-events-auto max-w-full">
            <Link
              to={`/profile/${currentVideo.creator?.username || 'pavani_official'}`}
              className="flex items-center gap-1 font-bold text-xs text-white hover:underline min-w-0 max-w-[65%]"
            >
              <span className="truncate">@{currentVideo.creator?.username || 'pavani_official'}</span>
              <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-[8px] flex items-center justify-center font-bold text-white flex-shrink-0">
                ✓
              </span>
            </Link>

            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-3 py-0.5 rounded-full text-[11px] font-bold transition shadow-sm flex-shrink-0 ${
                isFollowing
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-rose-500 hover:bg-rose-600 text-white'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>

          {/* Caption */}
          <p className="text-[12px] text-white/95 leading-snug line-clamp-2">
            When your friend says 'Diet from Monday' 🤣🤣{' '}
            <span className="text-white/75 font-semibold">#comedy #funny</span>{' '}
            <span className="text-white/50">... more</span>
          </p>

          {/* Sound audio ticker */}
          <div className="flex items-center gap-1.5 text-[11px] text-white/90 font-medium">
            <Music className="w-3.5 h-3.5 animate-pulse" />
            <span className="truncate">Original Audio - Pavani Comedy Specials</span>
          </div>
        </div>

        {/* Right Side Action Rail (Screen 3) */}
        <div className="absolute bottom-4 right-2.5 z-20 flex flex-col items-center gap-3.5 pointer-events-auto">
          {/* Creator Avatar with follow border */}
          <Link
            to={`/profile/${currentVideo.creator?.username || 'pavani_official'}`}
            className="relative mb-1"
          >
            <img
              src={
                currentVideo.creator?.profile?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
              }
              alt=""
              className="w-10 h-10 rounded-full object-cover border-2 border-rose-500 shadow-lg"
            />
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow">
              +
            </div>
          </Link>

          {/* Like */}
          <button onClick={handleLike} className="flex flex-col items-center gap-0.5 group">
            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-active:scale-125 transition">
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
            </div>
            <span className="text-[10px] font-bold text-white drop-shadow">25.4K</span>
          </button>

          {/* Comments */}
          <button onClick={() => setShowComments(true)} className="flex flex-col items-center gap-0.5 group">
            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-active:scale-125 transition">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] font-bold text-white drop-shadow">1.2K</span>
          </button>

          {/* Share / Actions Drawer */}
          <button onClick={() => setShowActions(true)} className="flex flex-col items-center gap-0.5 group">
            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-active:scale-125 transition">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-bold text-white drop-shadow">5.6K</span>
          </button>

          {/* Rotating Audio Vinyl Disc */}
          <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center animate-spin-slow shadow-lg mt-1">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
          </div>
        </div>
      </div>

      {/* Drawers */}
      <CommentDrawer
        videoId={currentVideo.id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />

      <VideoActionsDrawer
        isOpen={showActions}
        onClose={() => setShowActions(false)}
        videoId={currentVideo.id}
        title={currentVideo.title}
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

