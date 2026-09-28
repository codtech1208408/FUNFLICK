import { Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middlewares/auth';

export const getSubscriptionPlans = async (req: AuthRequest, res: Response) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      include: {
        creator: {
          select: {
            id: true,
            handle: true,
            displayName: true,
            avatarUrl: true
          }
        }
      },
      orderBy: { priceCents: 'asc' }
    });

    return res.json({ success: true, data: plans });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch subscription plans' });
  }
};

export const subscribeToPlan = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { planId, paymentMethodToken } = req.body;

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
      include: { creator: true }
    });

    if (!plan) return res.status(404).json({ success: false, message: 'Subscription plan not found' });

    // Calculate expiry (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const providerRef = `TXN-FF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create Subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planId: plan.id,
        creatorId: plan.creatorId,
        amountPaid: plan.priceCents,
        status: 'ACTIVE',
        expiresAt
      }
    });

    // Record Payment
    await prisma.payment.create({
      data: {
        userId,
        subscriptionId: subscription.id,
        amountCents: plan.priceCents,
        currency: 'USD',
        type: plan.type,
        provider: 'FUNFLICK_SECURE_PAY',
        providerRef,
        status: 'SUCCESS',
        metadataJson: JSON.stringify({ planName: plan.name, paymentMethod: paymentMethodToken || 'card_demo' })
      }
    });

    // If this is a Fan Subscription to a Creator, calculate and credit the Creator's revenue
    if (plan.creatorId && plan.creator) {
      const platformFeeRate = 0.20; // 20% platform fee
      const platformFeeCents = Math.round(plan.priceCents * platformFeeRate);
      const netCreatorCents = plan.priceCents - platformFeeCents;

      await prisma.creatorEarning.create({
        data: {
          creatorId: plan.creatorId,
          sourceType: 'SUBSCRIPTION',
          referenceId: subscription.id,
          grossAmountCents: plan.priceCents,
          platformFeeCents,
          netAmountCents: netCreatorCents,
          status: 'AVAILABLE'
        }
      });

      // Update creator subscriber count and gross earnings
      await prisma.creatorProfile.update({
        where: { id: plan.creatorId },
        data: {
          subscriberCount: { increment: 1 },
          grossEarningsCents: { increment: netCreatorCents }
        }
      });

      // Notify creator
      await prisma.notification.create({
        data: {
          userId: plan.creator.userId,
          actorId: userId,
          type: 'NEW_SUBSCRIBER',
          title: 'New VIP Subscriber! 💎',
          message: `@${req.user!.username} subscribed to your VIP Fan tier ($${(plan.priceCents / 100).toFixed(2)}/mo)!`,
          entityType: 'USER',
          entityId: userId
        }
      });
    }

    // Notify user
    await prisma.notification.create({
      data: {
        userId,
        type: 'SUBSCRIPTION_ACTIVE',
        title: 'Subscription Activated! 🎉',
        message: `You are now subscribed to ${plan.name}. Enjoy exclusive perks!`,
        entityType: 'SUBSCRIPTION',
        entityId: subscription.id
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Subscription successful! Thank you for supporting creators on FunFlick.',
      data: subscription
    });
  } catch (error: any) {
    console.error('subscribeToPlan error:', error);
    return res.status(500).json({ success: false, message: 'Subscription payment failed' });
  }
};

export const getUserSubscriptions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      include: {
        plan: true,
        creator: {
          select: {
            id: true,
            handle: true,
            displayName: true,
            avatarUrl: true
          }
        },
        payments: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, data: subscriptions });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user subscriptions' });
  }
};
