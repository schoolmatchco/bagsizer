/**
 * Compliance Engine - Pure mathematical logic for luggage-to-sizer comparisons
 */

interface Dimensions {
  h: number;
  w: number;
  d: number;
  unit: string;
}

interface Sizer extends Dimensions {
  strictness: 'extreme' | 'high' | 'medium';
  hard_sided: boolean;
}

interface Bag {
  dimensions: Dimensions;
  material: 'soft' | 'hard';
}

export interface ComplianceResult {
  passes: boolean;
  reason: string;
  marginOfError?: {
    h: number;
    w: number;
    d: number;
  };
}

/**
 * Check if a bag fits within a sizer's dimensions
 */
export function checkCompliance(bag: Bag, sizer: Sizer): ComplianceResult {
  const bagDims = bag.dimensions;
  const sizerDims = sizer;

  // Calculate tolerance based on strictness and material
  let tolerance = 0;

  if (!sizer.hard_sided && bag.material === 'soft') {
    // Soft sizer with soft bag - more forgiving
    switch (sizer.strictness) {
      case 'extreme':
        tolerance = 0;
        break;
      case 'high':
        tolerance = 0.5;
        break;
      case 'medium':
        tolerance = 1;
        break;
    }
  } else if (sizer.hard_sided) {
    // Hard-sided sizer - strict measurements
    tolerance = 0;
  } else {
    // Mixed scenario - moderate tolerance
    tolerance = sizer.strictness === 'extreme' ? 0 : 0.25;
  }

  // Check each dimension
  const hDiff = bagDims.h - (sizerDims.h + tolerance);
  const wDiff = bagDims.w - (sizerDims.w + tolerance);
  const dDiff = bagDims.d - (sizerDims.d + tolerance);

  const passes = hDiff <= 0 && wDiff <= 0 && dDiff <= 0;

  // Determine reason
  let reason = '';
  if (passes) {
    reason = 'Your bag fits within the sizer dimensions!';
  } else {
    const violations: string[] = [];
    if (hDiff > 0) violations.push(`height exceeds by ${hDiff.toFixed(1)}"`);
    if (wDiff > 0) violations.push(`width exceeds by ${wDiff.toFixed(1)}"`);
    if (dDiff > 0) violations.push(`depth exceeds by ${dDiff.toFixed(1)}"`);

    reason = `Bag doesn't fit: ${violations.join(', ')}`;
  }

  return {
    passes,
    reason,
    marginOfError: {
      h: hDiff,
      w: wDiff,
      d: dDiff,
    },
  };
}
