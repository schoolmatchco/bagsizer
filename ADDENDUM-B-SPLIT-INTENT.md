# 📝 Addendum B: "Shop vs. Check" Layout Strategy

**Refining the UI for Dual User Intent**

## 1. The Core Pivot: Immediate Recommendations

**Strategic Insight:** You just identified a third user intent: **The "I don't have a bag yet" Shopper.**

* **Old Flow:** Assumed everyone owns a bag and is anxious.
* **New Flow:** Captures both the anxious owner *and* the shopper looking for a recommendation immediately.

**Business Impact:** This effectively doubles your potential affiliate revenue because you aren't waiting for a "Fail" state to sell.

---

## 2. The New Layout Strategy: "Check vs. Shop"

On **Desktop**, this is a classic 2-column split.
On **Mobile**, this should be a **Vertical Stack** (Checker on top, Shop below).

### The Flow:

1. **Step 1:** User Selects Airline (e.g., "Spirit").
2. **Step 2:** The screen splits below the airline header.

#### Left Column / Section 1: "The Safe List" (Revenue Stream)

* **Header:** "Verified to Fit Spirit"
* **Content:** A grid of 3-4 bags from your database that technically pass the Spirit dimension check.
* **Logic:** Your code filters `bags.json` for items where `bag.h < airline.h` and `bag.w < airline.w`.
* **The Card:** High-quality image, "Passes Sizer" badge, and a "View Deal" button.
* **Sort Priority:** `commission_tier: "high"` bags shown first.

#### Right Column / Section 2: "The Checker" (Utility Hook)

* **Header:** "Check Your Own Bag"
* **Content:** The Search Bar / Manual Input system from Addendum A.
* **Interaction:** If they search a bag and it **FAILS**, you draw an arrow pointing to the Left Column saying, *"Your Osprey failed. Try one of these instead."*

---

## 3. Updated UI Components

### Component Architecture

```
Dashboard.tsx (New)
├── AirlineSelector.tsx (Existing)
└── SplitIntentView.tsx (New)
    ├── VerifiedBagGrid.tsx (New - Left/Top)
    │   └── BagCard.tsx (New)
    │       ├── Badge: "Perfect Fit ✓"
    │       ├── Image
    │       ├── Name + Dimensions
    │       └── CTA: "View Deal" (Affiliate Link)
    └── BagChecker.tsx (New - Right/Bottom)
        ├── SearchInput (from Addendum A)
        ├── ManualInput (from Addendum A)
        └── ComplianceVisualizer.tsx
```

---

## 4. Mobile Responsiveness Strategy

**Recommended: Vertical Stack Approach**

### Mobile Layout (Single Column):
```
┌─────────────────────┐
│ Airline: Spirit     │ ← Sticky Header
├─────────────────────┤
│ "Check Your Bag"    │ ← Utility Hook (Top Priority)
│ [Search Bar]        │
│ or Manual Input     │
├─────────────────────┤
│ "Bags That Fit"     │ ← Revenue Stream (Immediate)
│ ┌───┬───┬───┐      │
│ │ 1 │ 2 │ 3 │      │ ← Horizontal Scroll Carousel
│ └───┴───┴───┘      │
└─────────────────────┘
```

**Why Stack Over Tabs:**
- Users see products without clicking
- Higher engagement (scroll vs tap)
- Better for impulse purchases
- Validates product quality immediately

### Desktop Layout (Two Column):
```
┌──────────────────────────────────────────┐
│         Airline: Spirit Airlines         │
├─────────────────┬────────────────────────┤
│  Check Your Bag │  Verified to Fit       │
│  [Search Bar]   │  ┌────┬────┬────┐     │
│  or             │  │ 1  │ 2  │ 3  │     │
│  Manual Input   │  └────┴────┴────┘     │
│                 │  ┌────┬────┬────┐     │
│  [Visualizer]   │  │ 4  │ 5  │ 6  │     │
│                 │  └────┴────┴────┘     │
└─────────────────┴────────────────────────┘
```

---

## 5. Technical Implementation

### New Helper Function: `getVerifiedBags()`

```typescript
// src/lib/bagFilters.ts

import { checkCompliance } from './complianceEngine';
import bagsData from '@/data/bags.json';
import airlinesData from '@/data/airlines.json';

export function getVerifiedBags(
  airlineId: string,
  sizerType: 'personal' | 'carry_on' = 'carry_on'
) {
  const airline = airlinesData.find(a => a.id === airlineId);
  if (!airline) return [];

  // Filter bags that strictly pass the airline's limits
  return bagsData
    .filter(bag => {
      const result = checkCompliance(bag, airline.sizers[sizerType]);
      return result.passes;
    })
    .sort((a, b) => {
      // Prioritize high-commission bags
      const tierOrder = { high: 0, medium: 1, low: 2 };
      const aTier = tierOrder[a.commission_tier] ?? 3;
      const bTier = tierOrder[b.commission_tier] ?? 3;
      return aTier - bTier;
    });
}
```

### Updated State Management

```typescript
// src/store/useAppStore.ts

interface AppState {
  selectedAirline: Airline | null;
  selectedSizerType: 'personal' | 'carry_on';

  // User's bag (checked)
  selectedBag: Bag | null;
  customDimensions: { h: number; w: number; d: number } | null;

  // Verified bags (shopping)
  verifiedBags: Bag[];

  setSelectedAirline: (airline: Airline) => void;
  setSelectedSizerType: (type: 'personal' | 'carry_on') => void;
  setSelectedBag: (bag: Bag | null) => void;
  setCustomDimensions: (dims: { h: number; w: number; d: number } | null) => void;
  refreshVerifiedBags: () => void;
}
```

---

## 6. User Flow Examples

### Scenario A: Shopper Flow (Immediate Revenue)

1. User selects "Spirit Airlines"
2. **Immediately sees:** "Bags Verified to Fit Spirit"
3. Scrolls through carousel: Tortuga 40L, CabinZero 36L, etc.
4. Clicks "View Deal" → Affiliate conversion
5. **No failure needed** for monetization

### Scenario B: Owner Flow (Utility → Revenue)

1. User selects "Ryanair"
2. Sees verified bags, but **first action:** "Check My Bag"
3. Searches "Osprey Farpoint 40"
4. **Result:** FAIL (22" tall vs 15.7" limit)
5. **Smart UI:** Animated arrow points left: "Your bag is too tall. These fit:"
6. User clicks recommended Tortuga → Conversion

### Scenario C: Owner Flow (Validation Only)

1. User selects "Southwest"
2. Checks "Away Carry-On"
3. **Result:** PASS
4. User satisfied, **might still browse** verified bags out of curiosity
5. Potential secondary conversion

---

## 7. Design Specifications

### Verified Bag Card (Mobile)

```
┌─────────────────┐
│                 │
│   [Image 3:4]   │ ← Product photo
│                 │
├─────────────────┤
│ ✓ Perfect Fit   │ ← Badge (green)
│ Away Carry-On   │ ← Product name
│ 22"×14"×9"      │ ← Dimensions
│ $295            │ ← Price
│ [View Deal] →   │ ← CTA button
└─────────────────┘
```

### Interaction States

**On Bag Fail:**
```typescript
// Trigger attention-grabbing animation
if (!compliance.passes) {
  // 1. Shake the failed bag visualizer
  // 2. Highlight "Verified Bags" section
  // 3. Show tooltip: "These bags fit ✓"
  // 4. Auto-scroll to verified section on mobile
}
```

---

## 8. A/B Testing Plan

### Test 1: Headline Copy
- **A:** "Verified to Fit [Airline]"
- **B:** "Guaranteed to Pass [Airline] Gate Check"
- **C:** "These Bags Fit [Airline]"

### Test 2: Mobile Layout Order
- **A:** Checker on top, Shop below
- **B:** Shop on top, Checker below
- **Hypothesis:** A wins (utility hook first)

### Test 3: Grid vs Carousel
- **A:** Static 2×3 grid
- **B:** Horizontal scroll carousel
- **Hypothesis:** B wins on mobile (infinite scroll psychology)

---

## 9. Success Metrics

### Engagement Metrics
- **View Rate:** % of users who scroll to "Verified Bags"
- **Click Rate:** % clicking into bag cards
- **Comparison Rate:** % checking own bag THEN viewing verified

### Revenue Metrics
- **Immediate Conversion:** Shoppers who buy without checking
- **Post-Fail Conversion:** Owners who buy after failure
- **Browse Conversion:** Owners who buy after passing (curiosity)

### Expected Lift
- **Current:** 40% fail × 15% CTR × 3% conversion = 0.18% overall
- **New:** 60% view verified × 10% CTR × 3% conversion = 0.18% + **additional 0.18%** = **2x revenue**

---

## 10. Implementation Checklist

### Phase 1: Core Split View (2-3 days)
- [ ] Create `getVerifiedBags()` filter function
- [ ] Build `VerifiedBagGrid.tsx` component
- [ ] Build `BagCard.tsx` with affiliate CTA
- [ ] Implement desktop 2-column layout
- [ ] Implement mobile vertical stack
- [ ] Add carousel for verified bags on mobile

### Phase 2: Smart Interactions (1-2 days)
- [ ] Add "shake on fail" animation
- [ ] Highlight verified section when bag fails
- [ ] Add tooltip: "These fit instead"
- [ ] Auto-scroll to verified section on mobile fail
- [ ] Add "Perfect Fit ✓" badge to cards

### Phase 3: Polish & Optimization (2-3 days)
- [ ] Add product images to bag database
- [ ] Implement lazy loading for images
- [ ] Add skeleton loaders
- [ ] Optimize commission_tier sorting
- [ ] A/B test headline copy
- [ ] Add analytics tracking

---

## 11. Revenue Model Comparison

### Old Model (Fail-Only)
```
User Flow: Select → Check → Fail → See Recommendation
Revenue Trigger: Only on failure (40% of users)
Conversion Path: Single moment
Risk: User leaves after passing
```

### New Model (Immediate + Fail)
```
User Flow: Select → See Recommendations + Check Option
Revenue Trigger: Immediate (100% of users) + Fail (40%)
Conversion Paths: Multiple moments
Benefit: Users who pass still browse "out of curiosity"
```

**Estimated Revenue Increase:** 2-3x

---

## 12. Technical Safeguards

### Quality Control
```typescript
// Never recommend a bag that doesn't pass
function validateVerifiedBag(bag, airline, sizerType) {
  const result = checkCompliance(bag, airline.sizers[sizerType]);

  if (!result.passes) {
    console.error(`ERROR: Bag ${bag.id} marked as verified but fails!`);
    return false;
  }

  return true;
}
```

### Dimension Safety Margin
```typescript
// Add 0.5" safety buffer for "verified" recommendations
// to account for manufacturing variance
const SAFETY_MARGIN = 0.5;

function isVerifiedSafe(bagDim, sizerDim) {
  return bagDim <= (sizerDim - SAFETY_MARGIN);
}
```

---

## Final Recommendation

**Implement Vertical Stack for Mobile:**
1. Utility hook on top (Check Your Bag)
2. Revenue stream immediately below (Verified Bags)
3. Horizontal scroll carousel for products
4. Smart interactions on bag failure

**This approach:**
- Serves both user intents
- Maximizes revenue potential
- Maintains clean, Apple-like aesthetic
- Provides genuine utility first
- Converts browsers into buyers

**Ready to build?**
