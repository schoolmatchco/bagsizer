import { checkCompliance } from './complianceEngine';
import type { Airline, Bag } from '@/store/useAppStore';

const SAFETY_MARGIN = 0.5; // 0.5" safety buffer for manufacturing variance

/**
 * Get bags that are verified to fit a specific airline's sizer
 * Sorted by commission tier (high priority first)
 */
export function getVerifiedBags(
  bags: Bag[],
  airline: Airline,
  sizerType: 'personal' | 'carry_on' = 'carry_on',
  limit?: number
): Bag[] {
  const sizer = airline.sizers[sizerType];

  // Filter bags that pass with safety margin
  const verifiedBags = bags
    .filter(bag => {
      const result = checkCompliance(bag, sizer);

      // Must pass compliance check
      if (!result.passes) return false;

      // Additional safety margin check for "verified" badge
      const bagDims = bag.dimensions;
      const passesWithMargin =
        bagDims.h <= (sizer.h - SAFETY_MARGIN) &&
        bagDims.w <= (sizer.w - SAFETY_MARGIN) &&
        bagDims.d <= (sizer.d - SAFETY_MARGIN);

      return passesWithMargin;
    })
    .sort((a, b) => {
      // Sort by commission tier first
      const tierOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
      const aTier = tierOrder[a.commission_tier || 'low'] ?? 3;
      const bTier = tierOrder[b.commission_tier || 'low'] ?? 3;

      if (aTier !== bTier) {
        return aTier - bTier;
      }

      // Then by versatility score (higher is better)
      const aScore = a.versatility_score ?? 0;
      const bScore = b.versatility_score ?? 0;
      return bScore - aScore;
    });

  return limit ? verifiedBags.slice(0, limit) : verifiedBags;
}

/**
 * Get alternative bags when user's bag fails
 * Returns bags that pass, filtered by similar use case
 */
export function getAlternativeBags(
  bags: Bag[],
  failedBag: Bag,
  airline: Airline,
  sizerType: 'personal' | 'carry_on',
  limit: number = 3
): Bag[] {
  const verifiedBags = getVerifiedBags(bags, airline, sizerType);

  // Try to match the failed bag's category
  const sameCategory = verifiedBags.filter(bag =>
    bag.categories.some(cat => failedBag.categories.includes(cat))
  );

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  // Fall back to all verified bags
  return verifiedBags.slice(0, limit);
}

/**
 * Search bags by name or brand using fuzzy matching
 */
export function searchBags(
  bags: Bag[],
  query: string
): Bag[] {
  if (!query.trim()) return bags;

  const lowerQuery = query.toLowerCase();

  return bags.filter(bag => {
    const name = bag.name.toLowerCase();
    const brand = bag.brand?.toLowerCase() || '';

    return name.includes(lowerQuery) || brand.includes(lowerQuery);
  });
}
