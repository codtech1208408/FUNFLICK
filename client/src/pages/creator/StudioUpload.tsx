import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Video, Image, Sparkles, Check, ArrowRight, Save } from 'lucide-react';
import api from '../../services/api';

export const StudioUpload: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('https://assets.mixkit.co/videos/preview/mixkit-young-man-sitting-on-a-chair-and-laughing-40342-large.mp4');
  const [thumbnailUrl, setThumbnailUrl] = useState('https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80');
  const [categorySlug, setCategorySlug] = useState('sketches');
  const [tagsInput, setTagsInput] = useState('#comedy, #skit, #funflick, #laugh');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadingFile(true);
      const res = await api.post('/creator/upload-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        if (res.data.mimetype.startsWith('video/')) {
          setVideoUrl(res.data.fileUrl);
        } else {
          setThumbnailUrl(res.data.fileUrl);
        }
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('Local file upload failed. Using cloud demo link.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handlePublishOrDraft = async (submitForApproval: boolean) => {
    if (!title.trim() || !videoUrl) {
      alert('Please provide a title and video source');
      return;
    }

    const hashtags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      setLoading(true);
      const res = await api.post('/creator/upload', {
        title: title.trim(),
        description: description.trim(),
        videoUrl,
        thumbnailUrl,
        categorySlug,
        hashtags,
        type: 'REEL',
        durationSeconds: 25,
        aspectRatio: '9:16',
        visibility,
        submitForApproval
      });

      if (res.data.success) {
        alert(res.data.message);
        navigate('/creator/content');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Upload New Reel & Comedy Video</h1>
        <p className="text-xs text-slate-400">Share your humor with the FunFlick audience and earn fan subscriptions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Metadata Form */}
        <div className="lg:col-span-2 bg-[#151824] p-6 rounded-3xl border border-white/10 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Video Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. When the meeting could have been a 5-second text 💀"
              className="w-full bg-[#0f111a] text-xs text-white px-4 py-3 rounded-2xl border border-white/10 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description & Punchline</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Give your audience context, credit other comics, or ask a funny question..."
              className="w-full bg-[#0f111a] text-xs text-white px-4 py-3 rounded-2xl border border-white/10 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category Channel</label>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full bg-[#0f111a] text-xs text-white px-4 py-2.5 rounded-2xl border border-white/10 focus:outline-none focus:border-purple-500"
              >
                <option value="sketches">Sketches & Skits</option>
                <option value="stand-up">Stand-up Comedy</option>
                <option value="memes">Memes & Viral Edits</option>
                <option value="pranks">Pranks & Street</option>
                <option value="funny-animals">Funny Animals</option>
                <option value="parodies">Parodies & Voiceovers</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Audience Access</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="w-full bg-[#0f111a] text-xs text-white px-4 py-2.5 rounded-2xl border border-white/10 focus:outline-none focus:border-purple-500"
              >
                <option value="PUBLIC">Public (All Users)</option>
                <option value="SUBSCRIBERS_ONLY">VIP Fan Subscribers Only 👑</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Hashtags (comma-separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="#comedy, #funflick, #viral"
              className="w-full bg-[#0f111a] text-xs text-white px-4 py-2.5 rounded-2xl border border-white/10 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={() => handlePublishOrDraft(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-white/10 hover:bg-white/5 text-xs font-semibold text-slate-300 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save as Draft</span>
            </button>

            <button
              type="button"
              disabled={loading || uploadingFile}
              onClick={() => handlePublishOrDraft(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold rounded-2xl shadow-xl shadow-purple-500/25 transition active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit for Moderation Approval'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Media Preview & Selector */}
        <div className="space-y-4">
          <div className="bg-[#151824] p-4 rounded-3xl border border-white/10 space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-400" /> Video & Cover Preview
              </span>
              {uploadingFile && <span className="text-[10px] text-amber-400 animate-pulse">Uploading file...</span>}
            </h3>

            <div className="aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center relative shadow-inner">
              <video
                src={videoUrl}
                poster={thumbnailUrl}
                controls
                className="w-full h-full object-cover"
              />
            </div>

            {/* Direct Video File Upload Button */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Select Video File from Device</label>
              <label className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-bold cursor-pointer transition">
                <Video className="w-4 h-4" />
                <span>Choose Video (MP4/WebM)</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setVideoUrl(url);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* Direct Thumbnail Image Upload Button */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Select Thumbnail Cover Image</label>
              <label className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold cursor-pointer transition">
                <Image className="w-4 h-4" />
                <span>Choose Thumbnail Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setThumbnailUrl(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
