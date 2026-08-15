import { useSelector } from 'react-redux';
import { useState, useCallback } from 'react';

/**
 * Feature access matrix.
 * Each feature maps to the minimum plan required.
 * 'free' = all users, 'pro' = pro+enterprise, 'enterprise' = enterprise only.
 */
const FEATURE_PLAN_MAP = {
  'unlimited-resumes': 'pro',
  'unlimited-portfolios': 'pro',
  'ai-copilot-unlimited': 'pro',
  'premium-templates': 'pro',
  'ats-score-ring': 'pro',
  'github-sync': 'pro',
  'priority-pdf-export': 'pro',
  'code-export': 'enterprise',
  'custom-domain': 'enterprise',
  'white-label': 'enterprise',
  'team-collaboration': 'enterprise',
  'bulk-parser-api': 'enterprise',
};

const PLAN_HIERARCHY = { free: 0, pro: 1, enterprise: 2 };

/**
 * Free tier limits
 */
const FREE_LIMITS = {
  maxResumes: 1,
  maxPortfolios: 1,
  aiGenerationsPerDay: 5,
};

/**
 * Hook that provides feature gating based on the user's subscription plan.
 *
 * Usage:
 *   const { canUse, requirePremium, showCheckout, setShowCheckout, subscription } = useFeatureGate();
 *   if (!canUse('premium-templates')) { requirePremium('premium-templates'); }
 */
export const useFeatureGate = () => {
  const subscription = useSelector((state) => state.sync.subscription);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState('pro');

  const currentPlanLevel = PLAN_HIERARCHY[subscription.plan] ?? 0;

  /**
   * Returns true if the user's current plan allows access to the given feature.
   */
  const canUse = useCallback(
    (featureName) => {
      const requiredPlan = FEATURE_PLAN_MAP[featureName];
      if (!requiredPlan) return true; // Unknown features are unrestricted
      const requiredLevel = PLAN_HIERARCHY[requiredPlan] ?? 0;
      return currentPlanLevel >= requiredLevel;
    },
    [currentPlanLevel]
  );

  /**
   * If the user cannot access the feature, opens the checkout modal.
   * Returns true if the user has access, false if they were blocked.
   */
  const requirePremium = useCallback(
    (featureName) => {
      if (canUse(featureName)) return true;
      const requiredPlan = FEATURE_PLAN_MAP[featureName] || 'pro';
      setCheckoutPlan(requiredPlan);
      setShowCheckout(true);
      return false;
    },
    [canUse]
  );

  /**
   * Check if the user has hit the free-tier limit for a countable resource.
   */
  const hasReachedLimit = useCallback(
    (resource, currentCount) => {
      if (subscription.isPremium) return false;
      const limit = FREE_LIMITS[resource];
      if (limit === undefined) return false;
      return currentCount >= limit;
    },
    [subscription.isPremium]
  );

  return {
    subscription,
    canUse,
    requirePremium,
    hasReachedLimit,
    showCheckout,
    setShowCheckout,
    checkoutPlan,
    FREE_LIMITS,
  };
};

export { FEATURE_PLAN_MAP, PLAN_HIERARCHY, FREE_LIMITS };
