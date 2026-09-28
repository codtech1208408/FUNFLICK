import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Twitter, Share2 } from 'lucide-react';
import api from '../../services/api';

interface ShareModalProps {
  videoId: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ videoId, title, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/video/${videoId}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    api.post('/social/share', { videoId, platform: 'CLIPBOARD' }).catch(() => {});
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSocialShare = (platform: string) => {
    api.post('/social/share', { videoId, platform }).catch(() => {});
    let url = '';
    const text = encodeURIComponent(`Watch "${title}" on FunFlick! 😂🔥`);
    const encodedUrl = encodeURIComponent(shareUrl);

    if (platform === 'TWITTER') {
      url = `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`;
    } else if (platform === 'WHATSAPP') {
      url = `https://api.whatsapp.com/send?text=${text}%20${encodedUrl}`;
    }

    if (url) window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-[#151824] rounded-3xl border border-white/10 shadow-2xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-rose-500" /> Share Video
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <div className="flex items-center justify-around">
            <button
              onClick={() => handleSocialShare('WHATSAPP')}
              className="flex flex-col items-center gap-1.5 text-xs text-slate-300 hover:text-emerald-400 transition"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => handleSocialShare('TWITTER')}
              className="flex flex-col items-center gap-1.5 text-xs text-slate-300 hover:text-sky-400 transition"
            >
              <div className="w-12 h-12 rounded-full bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
                <Twitter className="w-5 h-5 text-sky-400" />
              </div>
              <span>Twitter / X</span>
            </button>
          </div>

          <div className="flex items-center gap-2 bg-[#0f111a] p-2 rounded-2xl border border-white/10">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent text-xs text-slate-300 px-2 outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
