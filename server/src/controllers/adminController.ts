import { Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middlewares/auth';

export const getAdminMetrics = async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalUsers,
      totalCreators,
      pendingCreatorApps,
      totalVideos,
      pendingVideoApprovals,
      publishedVideos,
      blockedVideos,
      totalSubscriptions,
      activeSubscriptions,
      totalPayments,
      pendingPayouts,
      pendingReports
    ] = await Promise.all([
      prisma.user.count(),
      prisma.creatorProfile.count(),
      prisma.creatorApplication.count({ where: { status: 'PENDING' } }),
      prisma.video.count(),
      prisma.video.count({ where: { status: 'PENDING_APPROVAL' } }),
      prisma.video.count({ where: { status: 'PUBLISHED' } }),
      prisma.video.count({ where: { status: 'BLOCKED' } }),
      prisma.subscription.count(),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.payment.findMany({ where: { status: 'SUCCESS' } }),
      prisma.creatorPayout.count({ where: { status: 'PENDING' } }),
      prisma.report.count({ where: { status: 'PENDING' } })
    ]);

    const platformGrossRevenueCents = totalPayments.reduce((acc, p) => acc + p.amountCents, 0);

    const recentLogs = await prisma.adminActionLog.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        admin: {
          select: { username: true }
        }
      }
    });

    return res.json({
      success: true,
      data: {
        totalUsers,
        totalCreators,
        pendingCreatorApps,
        totalVideos,
        pendingVideoApprovals,
        publishedVideos,
        blockedVideos,
        totalSubscriptions,
        activeSubscriptions,
        platformGrossRevenueCents,
        pendingPayouts,
        pendingReports,
        recentLogs
      }
    });
  } catch (error: any) {
    console.error('getAdminMetrics error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch admin metrics' });
  }
};

export const getPendingVideos = async (req: AuthRequest, res: Response) => {
  try {
    const videos = await prisma.video.findMany({
      where: {
        status: { in: ['PENDING_APPROVAL', 'BLOCKED'] }
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            profile: true,
            creatorProfile: true
          }
        },
        category: true,
        hashtags: { include: { hashtag: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, data: videos });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch moderation queue' });
  }
};

export const moderateVideo = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user!.id;
    const { videoId } = req.params;
    const { action, reason } = req.body; // APPROVE, REJECT, BLOCK, UNBLOCK

    const video = await prisma.video.findUnique({ where: { id: videoId }, include: { creator: true } });
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });

    let newStatus = video.status;
    let notifTitle = '';
    let notifMsg = '';

    if (action === 'APPROVE') {
      newStatus = 'PUBLISHED';
      notifTitle = 'Video Approved! 🎉';
      notifMsg = `Your video "${video.title}" has been approved and is now live on the feed.`;
    } else if (action === 'REJECT') {
      newStatus = 'REJECTED';
      notifTitle = 'Video Needs Revision ⚠️';
      notifMsg = `Your video "${video.title}" was not approved. Reason: ${reason || 'Does not adhere to community guidelines.'}`;
    } else if (action === 'BLOCK') {
      newStatus = 'BLOCKED';
      notifTitle = 'Video Blocked by Moderation 🚫';
      notifMsg = `Your video "${video.title}" was blocked due to violation of platform policies.`;
    } else if (action === 'UNBLOCK') {
      newStatus = 'PUBLISHED';
      notifTitle = 'Video Unblocked ✅';
      notifMsg = `Your video "${video.title}" has been reinstated.`;
    }

    await prisma.video.update({
      where: { id: videoId },
      data: {
        status: newStatus,
        rejectionReason: reason || null
      }
    });

    // Notify creator
    await prisma.notification.create({
      data: {
        userId: video.creatorId,
        actorId: adminId,
        type: `VIDEO_${action}`,
        title: notifTitle,
        message: notifMsg,
        entityType: 'VIDEO',
        entityId: videoId
      }
    });

    // Log action
    await prisma.adminActionLog.create({
      data: {
        adminId,
        action: `MODERATE_VIDEO_${action}`,
        targetEntity: 'VIDEO',
        targetId: videoId,
        details: reason || `Status set to ${newStatus}`
      }
    });

    return res.json({ success: true, message: `Video successfully set to ${newStatus}` });
  } catch (error: any) {
    console.error('moderateVideo error:', error);
    return res.status(500).json({ success: false, message: 'Failed to moderate video' });
  }
};

export const getCreatorApplications = async (req: AuthRequest, res: Response) => {
  try {
    const apps = await prisma.creatorApplication.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            profile: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, data: apps });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch creator applications' });
  }
};

export const reviewCreatorApplication = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user!.id;
    const { applicationId } = req.params;
    const { action, reason } = req.body; // APPROVE or REJECT

    const app = await prisma.creatorApplication.findUnique({
      where: { id: applicationId },
      include: { user: { include: { profile: true } } }
    });

    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });

    if (action === 'APPROVE') {
      // 1. Update application status
      await prisma.creatorApplication.update({
        where: { id: applicationId },
        data: { status: 'APPROVED', reviewedAt: new Date() }
      });

      // 2. Upgrade user role to CREATOR
      await prisma.user.update({
        where: { id: app.userId },
        data: { role: 'CREATOR' }
      });

      // 3. Create or upsert CreatorProfile
      await prisma.creatorProfile.upsert({
        where: { userId: app.userId },
        update: {
          category: app.category,
          bio: app.bio,
          displayName: app.creatorName
        },
        create: {
          userId: app.userId,
          handle: app.user.username,
          displayName: app.creatorName,
          category: app.category,
          bio: app.bio,
          avatarUrl: app.user.profile?.avatarUrl || ''
        }
      });

      // 4. Send notification
      await prisma.notification.create({
        data: {
          userId: app.userId,
          actorId: adminId,
          type: 'CREATOR_APPROVED',
          title: 'Welcome to the FunFlick Creator Program! 🌟',
          message: 'Your creator application was approved! You now have full access to YouTube-Studio-style Creator Panel and Monetization tools.'
        }
      });
    } else {
      await prisma.creatorApplication.update({
        where: { id: applicationId },
        data: {
          status: 'REJECTED',
          rejectionReason: reason || 'Application requirements not met at this time.',
          reviewedAt: new Date()
        }
      });

      await prisma.notification.create({
        data: {
          userId: app.userId,
          actorId: adminId,
          type: 'CREATOR_REJECTED',
          title: 'Creator Application Update',
          message: `Your application was not approved at this time. Reason: ${reason || 'Requirements not met'}`
        }
      });
    }

    await prisma.adminActionLog.create({
      data: {
        adminId,
        action: `${action}_CREATOR_APPLICATION`,
        targetEntity: 'CREATOR_APPLICATION',
        targetId: applicationId,
        details: reason || `Application ${action.toLowerCase()}d`
      }
    });

    return res.json({ success: true, message: `Creator application ${action.toLowerCase()}d` });
  } catch (error: any) {
    console.error('reviewCreatorApplication error:', error);
    return res.status(500).json({ success: false, message: 'Failed to review creator application' });
  }
};

export const getUsersList = async (req: AuthRequest, res: Response) => {
  try {
    const { search, role, status } = req.query;

    let whereClause: any = {};
    if (role && role !== 'ALL') whereClause.role = role;
    if (status && status !== 'ALL') whereClause.status = status;
    if (search) {
      whereClause.OR = [
        { username: { contains: String(search) } },
        { email: { contains: String(search) } }
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        profile: true,
        creatorProfile: true,
        _count: {
          select: {
            videos: true,
            followers: true,
            following: true,
            subscriptions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return res.json({ success: true, data: users });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

export const toggleUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user!.id;
    const { userId } = req.params;
    const { status, role } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const updateData: any = {};
    if (status) updateData.status = status;
    if (role) updateData.role = role;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    await prisma.adminActionLog.create({
      data: {
        adminId,
        action: 'UPDATE_USER_ACCOUNT',
        targetEntity: 'USER',
        targetId: userId,
        details: JSON.stringify(updateData)
      }
    });

    return res.json({ success: true, message: 'User updated successfully', data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

export const getPayoutsList = async (req: AuthRequest, res: Response) => {
  try {
    const payouts = await prisma.creatorPayout.findMany({
      include: {
        creator: {
          include: {
            user: { select: { username: true, email: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, data: payouts });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch payouts' });
  }
};

export const processPayout = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user!.id;
    const { payoutId } = req.params;
    const { status, transactionRef } = req.body; // PAID, REJECTED

    const payout = await prisma.creatorPayout.findUnique({
      where: { id: payoutId },
      include: { creator: true }
    });

    if (!payout) return res.status(404).json({ success: false, message: 'Payout not found' });

    const updated = await prisma.creatorPayout.update({
      where: { id: payoutId },
      data: {
        status: status || 'PAID',
        transactionRef: transactionRef || `TXN-FF-${Date.now()}`,
        processedAt: new Date()
      }
    });

    await prisma.notification.create({
      data: {
        userId: payout.creator.userId,
        actorId: adminId,
        type: 'PAYOUT_PROCESSED',
        title: status === 'PAID' ? 'Payout Sent! 💰' : 'Payout Rejected',
        message: status === 'PAID'
          ? `Your withdrawal of $${(payout.amountCents / 100).toFixed(2)} has been successfully transferred.`
          : 'Your payout request could not be processed.'
      }
    });

    return res.json({ success: true, message: `Payout status updated to ${status}`, data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to process payout' });
  }
};

export const getReportsList = async (req: AuthRequest, res: Response) => {
  try {
    const reports = await prisma.report.findMany({
      include: {
        reporter: {
          select: { id: true, username: true, email: true }
        },
        video: {
          select: { id: true, title: true, videoUrl: true, thumbnailUrl: true, creatorId: true }
        },
        comment: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, data: reports });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch reports' });
  }
};

export const resolveReport = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user!.id;
    const { reportId } = req.params;
    const { status, actionTaken } = req.body; // RESOLVED, DISMISSED

    const report = await prisma.report.update({
      where: { id: reportId },
      data: {
        status: status || 'RESOLVED',
        actionTaken: actionTaken || 'Reviewed and addressed by administration.'
      }
    });

    return res.json({ success: true, message: 'Report resolved', data: report });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to resolve report' });
  }
};
