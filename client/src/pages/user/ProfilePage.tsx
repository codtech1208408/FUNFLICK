import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Settings,
  MoreVertical,
  Heart,
  Bookmark,
  History,
  Crown,
  HelpCircle,
  ChevronRight,
  Play,
  Instagram,
  Youtube,
  Globe,
  MapPin,
  LogOut,
  Edit3,
  X,
  Check,
  Camera
} from 'lucide-react';
import { SubscribeModal } from '../../components/subscription/SubscribeModal';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'videos' | 'shorts' | 'liked' | 'about'>('videos');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit profile state
  const [editFullName, setEditFullName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  // Determine if this is currently logged in user
  const isSelf = !username || (user && (user.username === username || user.email === username || user.mobile === username));

  // Determine if this is an influencer profile (Screen 5) or user profile (Screen 6)
  const isInfluencer = isSelf
    ? user?.role === 'CREATOR'
    : profileData?.role === 'CREATOR' ||
      username === 'pavani_official' ||
      username === 'laughlab' ||
      username === 'standup_sam' ||
      username === 'pavani';

  useEffect(() => {
    if (user && isSelf) {
      setEditFullName(user.profile?.fullName || user.username || '');
      setEditBio(user.profile?.bio || 'Hey there! I am having fun on FunFlick 🎉');
      setEditAvatarUrl(user.profile?.avatarUrl || '');
    }
  }, [user, isSelf]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username || isSelf) return;
      try {
        const res = await api.get(`/auth/profile/${username}`);
        if (res.data?.success) {
          setProfileData(res.data.user);
        }
      } catch {
        // Fallback gracefully
      }
    };
    fetchProfile();
  }, [username, isSelf]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await api.put('/auth/profile', {
        fullName: editFullName,
        bio: editBio,
        avatarUrl: editAvatarUrl
      });
      if (res.data.success) {
        await refreshUser();
        setShowEditModal(false);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Profile display info resolution
  const activeUser = isSelf ? user : (profileData || null);
  const displayName =
    activeUser?.profile?.fullName ||
    activeUser?.username ||
    (username === 'srilatha_16' ? 'Srilatha' : username || 'User');

  const displayHandle = activeUser?.username || username || 'user';
  const displayBio =
    activeUser?.profile?.bio ||
    (isInfluencer ? 'Making you laugh every day 😄\nComedy | Lifestyle | Entertainment' : 'Hey there! I am having fun on FunFlick 🎉');

  const avatarUrl =
    activeUser?.profile?.avatarUrl ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${displayHandle}`;

  const statsPosts = activeUser?.counts?.videos ?? (username === 'srilatha_16' ? 128 : 0);
  const statsFollowing = activeUser?.counts?.following ?? (username === 'srilatha_16' ? 420 : 12);
  const statsFollowers = activeUser?.counts?.followers ?? (username === 'srilatha_16' ? '2.3K' : '0');

  // Screen 5 Influencer Profile Data
  const influencerVideos = [
    { id: 'v-1', views: '1.2M', thumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
    { id: 'v-2', views: '856K', thumb: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
    { id: 'v-3', views: '1.4M', thumb: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80' },
    { id: 'v-4', views: '980K', thumb: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80' },
    { id: 'v-5', views: '1.6M', thumb: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80' },
    { id: 'v-6', views: '720K', thumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' }
  ];

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full h-full bg-white text-slate-800 flex flex-col overflow-y-auto no-scrollbar select-none relative">
      {isInfluencer ? (
        /* ================= SCREEN 5: INFLUENCER PROFILE ================= */
        <div className="flex flex-col space-y-3 pb-6">
          {/* Top Bar (Screen 5) */}
          <div className="flex items-center justify-between px-4 pt-3">
            <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-slate-700 hover:text-slate-900">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-sm text-slate-900">{displayHandle}</span>
              <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-[8px] flex items-center justify-center font-bold text-white">
                ✓
              </span>
            </div>
            <button className="p-1 -mr-1 text-slate-700 hover:text-slate-900">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Banner & Avatar (Screen 5) */}
          <div className="px-4">
            <div className="relative rounded-2xl h-24 overflow-hidden bg-gradient-to-r from-purple-500 via-rose-400 to-amber-300">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                alt=""
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            <div className="flex items-end justify-between -mt-10 px-2">
              <div className="relative w-28 h-28 rounded-2xl bg-white ring-4 ring-white shadow-md p-0.5 flex items-center justify-center overflow-hidden">
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>

              {/* Stats Bar */}
              <div className="flex items-center gap-4 text-center pb-1">
                <div>
                  <p className="text-sm font-extrabold text-slate-900">324</p>
                  <p className="text-[10px] text-slate-400 font-medium">Videos</p>
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-900">2.1M</p>
                  <p className="text-[10px] text-slate-400 font-medium">Followers</p>
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-900">150</p>
                  <p className="text-[10px] text-slate-400 font-medium">Following</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Block (Screen 5) */}
          <div className="px-4 space-y-1.5 text-xs text-slate-700">
            <p className="font-semibold text-slate-900">
              {displayName} 😄
            </p>
            <p className="text-[11px] text-slate-500 font-medium whitespace-pre-line">
              {displayBio}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-rose-500 font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>Hyderabad</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1 text-slate-600">
              <button className="p-1 rounded-full bg-slate-100 hover:text-rose-500">
                <Instagram className="w-3.5 h-3.5" />
              </button>
              <button className="p-1 rounded-full bg-slate-100 hover:text-rose-600">
                <Youtube className="w-3.5 h-3.5" />
              </button>
              <button className="p-1 rounded-full bg-slate-100 hover:text-sky-500">
                <Globe className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action Buttons: Follow & Subscribe (Screen 5) */}
          <div className="px-4 grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                isFollowing
                  ? 'bg-slate-100 text-slate-700 border border-slate-200'
                  : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>

            <button
              onClick={() => setShowSubscribe(true)}
              className="py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-md shadow-rose-500/20 transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Crown className="w-3.5 h-3.5 fill-white" />
              <span>Subscribe</span>
            </button>
          </div>

          {/* Tabs: Videos, Shorts, Liked, About (Screen 5) */}
          <div className="flex items-center justify-around border-b border-slate-100 px-4 text-xs font-bold pt-2">
            {(['videos', 'shorts', 'liked', 'about'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 capitalize transition relative ${
                  activeTab === tab ? 'text-rose-500' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <span>{tab}</span>
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-rose-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* 3-Column Video Thumbnail Grid with view counts (Screen 5) */}
          <div className="px-4 grid grid-cols-3 gap-1.5 pt-1">
            {influencerVideos.map((item) => (
              <Link
                key={item.id}
                to="/"
                className="relative aspect-[3/4] rounded-lg overflow-hidden bg-slate-100 group shadow-xs"
              >
                <img
                  src={item.thumb}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-1 left-1 flex items-center gap-0.5 bg-black/50 backdrop-blur-xs text-white text-[8px] font-bold px-1 py-0.5 rounded">
                  <Play className="w-2 h-2 fill-white text-white" />
                  <span>{item.views}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        /* ================= SCREEN 6: USER PROFILE ================= */
        <div className="flex flex-col space-y-4 p-4 pb-6">
          {/* Top Bar (Screen 6) */}
          <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-slate-700 hover:text-slate-900">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-sm text-slate-900">@{displayHandle}</span>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="p-1 -mr-1 text-slate-700 hover:text-slate-900"
              title="Edit Profile"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* User Info Dynamic with Full Uncropped Rectangle Profile Image */}
          <div className="flex flex-col items-center text-center space-y-1 pt-1">
            <div
              className="relative w-32 h-32 rounded-2xl bg-slate-100 ring-2 ring-slate-200 shadow-md p-1 flex items-center justify-center overflow-hidden group cursor-pointer"
              onClick={() => setShowEditModal(true)}
              title="Click to change profile picture"
            >
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-contain rounded-xl"
              />
              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition text-white gap-1">
                <Camera className="w-5 h-5" />
                <span className="text-[10px] font-bold">Change Photo</span>
              </div>
            </div>
            <h2 className="text-base font-extrabold text-slate-900 mt-1">{displayName}</h2>
            <p className="text-xs text-slate-400 font-medium -mt-1">@{displayHandle}</p>
            {activeUser?.mobile && (
              <p className="text-[11px] text-slate-500 font-medium">📱 {activeUser.mobile}</p>
            )}
            {activeUser?.email && activeUser.email !== `${displayHandle}@funflick.com` && (
              <p className="text-[10px] text-slate-400 font-medium">{activeUser.email}</p>
            )}
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-center gap-8 text-center py-1">
            <div>
              <p className="text-sm font-extrabold text-slate-900">{statsPosts}</p>
              <p className="text-[10px] text-slate-400 font-medium">Posts</p>
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900">{statsFollowing}</p>
              <p className="text-[10px] text-slate-400 font-medium">Following</p>
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900">{statsFollowers}</p>
              <p className="text-[10px] text-slate-400 font-medium">Followers</p>
            </div>
          </div>

          {/* Edit Profile Button (Screen 6) */}
          <button
            onClick={() => setShowEditModal(true)}
            className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs flex items-center justify-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          {/* Clean Menu Items List with Icons and Chevron (Screen 6) */}
          <div className="space-y-1 divide-y divide-slate-100 pt-1">
            <Link
              to="/liked"
              className="flex items-center justify-between py-3 text-xs font-semibold text-slate-800 hover:text-rose-500 transition group"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-slate-500 group-hover:text-rose-500" />
                <span>Liked Videos</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/saved"
              className="flex items-center justify-between py-3 text-xs font-semibold text-slate-800 hover:text-rose-500 transition group"
            >
              <div className="flex items-center gap-3">
                <Bookmark className="w-4 h-4 text-slate-500 group-hover:text-rose-500" />
                <span>Saved Videos</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/history"
              className="flex items-center justify-between py-3 text-xs font-semibold text-slate-800 hover:text-rose-500 transition group"
            >
              <div className="flex items-center gap-3">
                <History className="w-4 h-4 text-slate-500 group-hover:text-rose-500" />
                <span>Watch History</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/subscriptions"
              className="flex items-center justify-between py-3 text-xs font-semibold text-slate-800 hover:text-rose-500 transition group"
            >
              <div className="flex items-center gap-3">
                <Crown className="w-4 h-4 text-slate-500 group-hover:text-rose-500" />
                <span>My Subscriptions</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <button
              onClick={() => setShowEditModal(true)}
              className="w-full flex items-center justify-between py-3 text-xs font-semibold text-slate-800 hover:text-rose-500 transition group text-left"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-slate-500 group-hover:text-rose-500" />
                <span>Account Settings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <div
              onClick={() => alert('FunFlick Help Center: Contact support@funflick.com for assistance.')}
              className="flex items-center justify-between py-3 text-xs font-semibold text-slate-800 hover:text-rose-500 transition group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-slate-500 group-hover:text-rose-500" />
                <span>Help & Support</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* Log Out Button */}
            <button
              onClick={() => {
                logout();
                navigate('/welcome');
              }}
              className="w-full flex items-center justify-between py-3 text-xs font-bold text-rose-600 hover:text-rose-700 transition group text-left pt-3"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                <span>Log Out</span>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-300" />
            </button>
          </div>
        </div>
      )}

      {/* Screen 7: Subscription Modal */}
      {showSubscribe && (
        <SubscribeModal
          isOpen={showSubscribe}
          onClose={() => setShowSubscribe(false)}
        />
      )}

      {/* Interactive Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 text-slate-900 shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Edit Your Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Profile Image Direct Upload Section with Uncropped Rectangle Shape */}
              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative w-32 h-32 rounded-2xl bg-slate-100 ring-4 ring-rose-500/20 shadow-md p-1 flex items-center justify-center overflow-hidden group cursor-pointer">
                  <img
                    src={editAvatarUrl || avatarUrl}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-xl"
                  />
                  <label className="absolute inset-0 bg-black/40 rounded-2xl flex flex-col items-center justify-center text-white cursor-pointer opacity-80 hover:opacity-100 transition">
                    <Camera className="w-6 h-6 mb-0.5" />
                    <span className="text-[10px] font-bold">Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <label className="mt-2.5 text-xs font-bold text-rose-500 hover:text-rose-600 cursor-pointer">
                  Choose Photo from Device
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400 mt-0.5">Full uncropped image display</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  placeholder="e.g. Santhosh Kumar"
                  className="w-full bg-slate-50 text-xs text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bio</label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell others about yourself..."
                  className="w-full bg-slate-50 text-xs text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 font-medium resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-500/25 active:scale-95 transition flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


