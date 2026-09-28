import { Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middlewares/auth';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      include: {
        actor: {
          select: {
            id: true,
            username: true,
            profile: {
              select: { fullName: true, avatarUrl: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 40
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false }
    });

    return res.json({ success: true, data: notifications, unreadCount });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    if (id === 'all') {
      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
      });
      return res.json({ success: true, message: 'All notifications marked as read' });
    }

    await prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true }
    });

    return res.json({ success: true, message: 'Marked as read' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update notification' });
  }
};
