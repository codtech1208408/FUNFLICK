# FunFlick — Social Entertainment & Short Video Platform

FunFlick is a modern, high-performance social entertainment platform focused on comedy, short-form video reels, creator monetization, and community moderation.

---

## 🚀 Quick Start

### 1. Installation
In the project root, install all dependencies:
```bash
npm run install-all
```

### 2. Database Setup & Seed
Initialize the database and populate it with sample comedy reels, creators, and admin queues:
```bash
cd server
npx prisma db push
npm run seed
```

### 3. Start Development Servers
Run both backend and frontend concurrently:
```bash
npm run dev
```
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5001](http://localhost:5001)

---

## 🔑 Demo Accounts (1-Click Switchers in UI Header)

| Role | Email | Password | Access & Features |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@funflick.com` | `admin123` | Content Moderation, Creator Applications, Users Directory, Payouts, Audit Log |
| **Creator** | `laughlab@funflick.com` | `password123` | Creator Studio, Upload Wizard, Drafts, Real-time Analytics, Earnings & Payout Requests |
| **User** | `alex@funflick.com` | `password123` | Reels Feed, Likes, Comments & Nested Replies, Following, Saved, VIP Subscriptions |

---

## 🌟 Key Architecture & Modules

### 1. User Experience & Social Graph
- **Personalized Home Feed**: Categorized feeds (Recommended, Trending, Following) and comedy channel filters.
- **Vertical Reels Experience**: Full-screen short-video player with swipe-to-scroll, intersection-observer autoplay/pause, double-tap heart like animation, sound toggle, and comment drawer.
- **Social Interactions**: Real-time likes, nested comment replies, bookmarks, shares, and content flagging reports.
- **Search & Discovery**: Debounced live search across users, creators, video descriptions, and `#hashtags`.

### 2. Creator Studio (YouTube Studio Inspired)
- **Studio Dashboard**: Real-time metrics for total views, engagement, follower growth, and VIP subscribers.
- **Content Manager**: Lifecycle state management (`DRAFT` → `PENDING_APPROVAL` → `APPROVED`/`REJECTED` → `PUBLISHED`).
- **Upload Wizard**: HD video & thumbnail upload, metadata tags, and submission for admin review.
- **Monetization & Payouts**: 80/20 revenue split calculation, live available balance, and withdrawal requests.

### 3. Admin Command Center
- **Moderation Queue**: Video inspection preview with one-click approve, reject with reason, or block.
- **Creator Onboarding Review**: Inspect applicant KYC/pitch and upgrade users to verified creators.
- **User Directory & Safety**: Account suspension/reactivation and administrative audit trail.
- **Payout Settlement**: Ledger tracking and batch disbursement approval.

### 4. Dual Subscription Architecture
- **Creator Partner Access**: Platform-level publishing capability.
- **VIP Fan Passes**: Monthly creator subscriptions with automated revenue split ledger and exclusive supporter perks.
