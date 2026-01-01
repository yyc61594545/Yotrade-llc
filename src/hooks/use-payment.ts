import { getActiveSubscriptionAction } from '@/actions/get-active-subscription';
import { getLifetimeStatusAction } from '@/actions/get-lifetime-status';
import { getAllPricePlans } from '@/lib/price-plan';
import type { PricePlan, Subscription } from '@/payment/types';
import { useQuery } from '@tanstack/react-query';

// Query keys
export const paymentKeys = {
  all: ['payment'] as const,
  subscription: (userId: string) =>
    [...paymentKeys.all, 'subscription', userId] as const,
  lifetime: (userId: string) =>
    [...paymentKeys.all, 'lifetime', userId] as const,
  currentPlan: (userId: string) =>
    [...paymentKeys.all, 'currentPlan', userId] as const,
};

// Hook to fetch active subscription
export function useActiveSubscription(userId: string | undefined) {
  return useQuery({
    queryKey: paymentKeys.subscription(userId || ''),
    queryFn: async (): Promise<Subscription | null> => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      const result = await getActiveSubscriptionAction({ userId });
      if (!result?.data?.success) {
        throw new Error(result?.data?.error || 'Failed to fetch subscription');
      }
      return result.data.data || null;
    },
    enabled: !!userId,
  });
}

// Hook to fetch lifetime status
export function useLifetimeStatus(userId: string | undefined) {
  return useQuery({
    queryKey: paymentKeys.lifetime(userId || ''),
    queryFn: async (): Promise<{
      isLifetimeMember: boolean;
      lifetimePlanId?: string;
    }> => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      const result = await getLifetimeStatusAction({ userId });
      if (!result?.data?.success) {
        throw new Error(
          result?.data?.error || 'Failed to fetch lifetime status'
        );
      }
      return {
        isLifetimeMember: result.data.isLifetimeMember || false,
        lifetimePlanId: result.data.lifetimePlanId,
      };
    },
    enabled: !!userId,
  });
}

// Hook to get current plan based on subscription and lifetime status
export function useCurrentPlan(userId: string | undefined) {
  const {
    data: subscription,
    isLoading: isLoadingSubscription,
    error: subscriptionError,
  } = useActiveSubscription(userId);
  const {
    data: lifetimeStatus,
    isLoading: isLoadingLifetime,
    error: lifetimeError,
  } = useLifetimeStatus(userId);

  const isLifetimeMember = lifetimeStatus?.isLifetimeMember || false;
  const lifetimePlanId = lifetimeStatus?.lifetimePlanId;

  return useQuery({
    queryKey: paymentKeys.currentPlan(userId || ''),
    queryFn: async (): Promise<{
      currentPlan: PricePlan | null;
      subscription: Subscription | null;
    }> => {
      const plans: PricePlan[] = getAllPricePlans();
      const freePlan = plans.find((plan) => plan.isFree);

      // If lifetime member, return the specific lifetime plan or any lifetime plan
      if (isLifetimeMember) {
        let plan: PricePlan | undefined;

        // Try to find the specific lifetime plan user has purchased (highest value)
        if (lifetimePlanId) {
          plan = plans.find(p => p.id === lifetimePlanId);
        }

        // Fallback to any lifetime plan if specific one not found or not returned
        if (!plan) {
           plan = plans.find((plan) => plan.isLifetime);
        }

        return {
          currentPlan: plan || null,
          subscription: null,
        };
      }

      // If has active subscription, find the corresponding plan
      if (subscription) {
        const plan =
          plans.find((p) =>
            p.prices.find((price) => price.priceId === subscription.priceId)
          ) || null;
        return {
          currentPlan: plan,
          subscription,
        };
      }

      // Default to free plan
      return {
        currentPlan: freePlan || null,
        subscription: null,
      };
    },
    enabled: !!userId && !isLoadingSubscription && !isLoadingLifetime,
  });
}
