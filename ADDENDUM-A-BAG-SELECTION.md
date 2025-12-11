# 📝 Addendum A: Bag Selection Interface & Data Strategy

**Refining `BagSelector.tsx` and Data Population**

## 1. The Core Pivot: "Search" over "Presets"

**Critical Directive:** The current mockup uses generic placeholders like "Standard Backpack." **Delete this approach immediately.** Generic sizes are inaccurate and create liability (users getting fined).

We must replace the generic list with a **Dual-Mode Input System**:

1. **Search Mode (Primary):** User searches our database for a specific model (e.g., "Away Bigger Carry-On").
2. **Manual Mode (Fallback):** User enters raw dimensions if their bag is not found.

### Component Logic: `src/components/ui/BagSelector.tsx`

Refactor this component to function as follows:

* **State A: Empty/Prompt**
    * Display a large Search Bar: *"Search your bag brand (e.g., Osprey, Away)..."*
    * Display a secondary link/button below: *"Can't find your bag? Enter dimensions manually."*
* **State B: Search Active**
    * As user types, query `bags.json`.
    * Show results with Thumbnail + Name + Dimensions.
    * *Action:* Selection updates `useAppStore` with the specific `bagId`.
* **State C: Manual Input (The "Catch-All")**
    * If user clicks "Enter dimensions manually," reveal 3 Inputs:
        * Height (in/cm toggle)
        * Width
        * Depth
    * *Action:* Updates `useAppStore` with a temporary `customBag` object.

---

## 2. Updated State Management (`useAppStore.ts`)

The store must handle both database bags and custom user inputs.

```typescript
interface AppState {
  selectedAirline: string | null; // ID from airlines.json
  selectedBag: Bag | null; // Database object
  customDimensions: { h: number; w: number; d: number } | null; // Manual input

  // Logic:
  // If selectedBag is set, use those dims.
  // If customDimensions is set, use those dims.
}
```

---

## 3. Data Strategy: The "Hero" Database & Scraping Agents

**Goal:** Populate `bags.json` with the top 50 most common travel bags to cover 80% of searches.

### Task for Agents / Scraping:

* **Source:** Amazon Product Pages or Manufacturer Direct Sites.
* **Data Points Required:**
  1. Product Name (Exact Model)
  2. Dimensions (Exterior/Overall - including wheels/handles)
  3. Image URL (Clean white background preferred)
  4. Affiliate Link (Placeholder for now)

### The "Must-Have" Brand List (Target these first):

* **Hard Shell:** Away, Monos, Samsonite, Travelpro, Beis, July.
* **Backpacks:** Osprey (Farpoint/Daylite), Cotopaxi (Allpa), Aer, Tortuga, Patagonia (Black Hole), CabinZero.
* **Budget:** Amazon Basics, Rockland.

---

## 4. Revised User Flows & Business Logic

### Scenario A: The "Fail" (Monetization Flow)

* **User Input:** Selects "Spirit Airlines" + Searches "Osprey Farpoint 40".
* **Logic:** Osprey (22" tall) vs Spirit Personal Item (18" limit).
* **Visual Result:**
    * **Status:** **FAIL (Red Animation)**.
    * **Collision Feedback:** Show the bag overlapping the bin wireframe by 4 inches.
    * **The Pivot (Critical):** Display the `AlternativeBag` component immediately.
    * **Copy:** "Your Osprey is too tall for a Personal Item. **Pass Guaranteed:** The Tortuga 40L fits perfectly."

### Scenario B: The "Pass" (Utility Flow)

* **User Input:** Selects "United" + Searches "Away Carry-On".
* **Logic:** Away (21.7") vs United (22").
* **Visual Result:**
    * **Status:** **PASS (Green Glow)**.
    * **Visual:** Bag sits comfortably inside the wireframe.
    * **The Trust Builder:** "You are safe. Fits with 0.3 inches to spare."
    * **Micro-Conversion:** "Save this result" or "Check another bag."

---

## 5. Immediate Execution Steps

1. **Delete** any hardcoded "Generic" bag arrays in the code.
2. **Implement** the search logic using `fuse.js` (lightweight fuzzy search) against `bags.json`.
3. **Create** the "Manual Input" form as a toggle inside the Bag Selector.
4. **Update** the `ComplianceEngine` to check: `Is there a Selected Bag? If not, are there Custom Dimensions?` before running the math.

---

## 6. Implementation Checklist

### Phase 1: Core Functionality (Week 1)
- [ ] Install and configure fuse.js for fuzzy search
- [ ] Refactor BagSelector.tsx with dual-mode (search/manual)
- [ ] Add manual dimension input form with in/cm toggle
- [ ] Update useAppStore to handle customDimensions
- [ ] Update ComplianceEngine to accept custom dimensions
- [ ] Add visual feedback for search results
- [ ] Implement "No results found" state with manual entry prompt

### Phase 2: Data Population (Week 2)
- [ ] Research and compile top 50 bag models by brand
- [ ] Scrape/collect accurate dimensions from manufacturer sites
- [ ] Gather product images (white background preferred)
- [ ] Verify dimensions against airline sizer limits
- [ ] Add affiliate link placeholders
- [ ] Create bag database with proper categorization
- [ ] Implement image optimization for bag photos

### Phase 3: Enhanced UX (Week 3)
- [ ] Add bag thumbnails to search results
- [ ] Implement "Recently searched" bags
- [ ] Add "Popular bags for [Airline]" recommendations
- [ ] Create "Save result" functionality
- [ ] Build sharing feature (URL with bag + airline)
- [ ] Add analytics tracking for bag searches
- [ ] Implement A/B testing for monetization copy

### Phase 4: Monetization Integration (Week 4)
- [ ] Partner with affiliate programs (Amazon Associates, Impact, etc.)
- [ ] Replace placeholder links with real affiliate URLs
- [ ] Build AlternativeBag recommendation engine
- [ ] Create logic: "If bag fails, show 3 alternatives that pass"
- [ ] Add transparency disclaimer to footer
- [ ] Implement click tracking for affiliate conversions
- [ ] Build reporting dashboard for affiliate performance

---

## 7. Technical Dependencies

### New Packages Required:
```json
{
  "dependencies": {
    "fuse.js": "^7.0.0",  // Fuzzy search
    "react-hook-form": "^7.49.0",  // Form management
    "zod": "^3.22.0"  // Schema validation
  }
}
```

### API Considerations:
- **Image Hosting:** Use Next.js Image Optimization or Cloudinary
- **Search Performance:** Consider Algolia for >1000 bags (future)
- **Affiliate Links:** Implement link cloaking for clean URLs

---

## 8. Success Metrics

### User Engagement:
- **Search Success Rate:** % of users finding their bag
- **Manual Input Rate:** % falling back to manual entry
- **Completion Rate:** % completing airline + bag selection

### Monetization:
- **Fail Rate:** % of bags that don't fit
- **Alternative Click Rate:** % clicking recommended bags
- **Conversion Rate:** % completing affiliate purchases

### Data Quality:
- **Coverage:** % of top 100 bags in database
- **Accuracy:** User-reported dimension errors
- **Freshness:** Last updated dates for bag models
