# ✈️ Project Blueprint: BagSizer.io (Master Plan)

**Repository:** https://github.com/schoolmatchco/bagsizer.git

## 1. Executive Summary

**Goal:** Build a mobile-first, ultra-fast web tool that visualizes whether a specific piece of luggage fits into a specific airline's sizer bin.
**Core Value:** Relieve traveler anxiety about gate-check fees ($100+).
**Revenue Model:** High-intent affiliate marketing. When a bag *fails* the check, we recommend a partner bag that *passes*, explaining exactly *why* it passes.
**Design Philosophy:** "Radical Simplicity." No clutter. Large touch targets. Instant results. 60FPS animations. It must feel like a native iOS app.

---

## 2. Technical Stack & Architecture

* **Framework:** Next.js (React) - *For speed, SEO, and static generation.*
* **Styling:** Tailwind CSS - *For rapid, clean UI development.*
* **Icons/Logos:** `lucide-react` for UI icons. Airline logos must be high-quality SVGs (Source matches `/SVG Logos` directory).
* **State Management:** Zustand (Simple global state for `selectedBag` and `selectedAirline`).
* **Animation:** Framer Motion - *Critical requirement.*
    * **Physics:** Use `type: "spring", stiffness: 300, damping: 30` for all transitions to achieve a "heavy," premium feel.
* **Deployment:** Vercel (Zero config, fast edge network).

### 📂 Project File Structure

* `src/data/airlines.json` (The "Container" database - *See Section 3A*)
* `src/data/bags.json` (The "Object" database - *See Section 3B*)
* `src/store/useAppStore.ts` (Zustand state)
* `src/lib/complianceEngine.ts` (The pure math logic for comparisons)
* `src/components/visualizer/SizerCanvas.tsx` (The SVG rendering engine)
* `src/components/ui/BagSelector.tsx` (Searchable modal with images)
* `src/components/ui/AirlineSelector.tsx` (Searchable modal with logos)
* `src/components/results/ComplianceCard.tsx` (The Red/Green output logic)
* `src/components/monetization/AlternativeBag.tsx` (The "Fix It" recommendation card)

---

## 3. Data Structure (The "Brain")

### A. `airlines.json` (Verified 2025 Data)

*Note: Dimensions are in Inches. `hard_sided: true` means rigid sizer box (zero tolerance).*

All 23 airlines from the SVG Logos directory are included with verified 2025 dimensions:
- Aeromexico
- Air Canada
- Air France
- Alaska Airlines
- American Airlines
- ANA (All Nippon)
- British Airways
- Delta Air Lines
- Emirates
- Frontier Airlines
- Hawaiian Airlines
- Japan Airlines
- JetBlue
- Korean Air
- Lufthansa
- Qantas
- Ryanair
- Singapore Airlines
- Southwest
- Spirit Airlines
- Turkish Airlines
- WestJet
- Wizz Air

**Notable Strict Airlines:**
- **Lufthansa:** 4" depth limit on personal items (extreme)
- **British Airways:** 6" depth limit on personal items (extreme)
- **Korean Air:** 4" depth limit on personal items
- **Singapore Airlines:** 3.9" depth limit on personal items (strictest)
- **Ryanair:** Extremely strict on both personal and carry-on
- **Spirit/Frontier:** Hard-sided sizers with high gate fees ($99)

### B. `bags.json` (The Object)

*Strategy:* Includes high-traffic bags + high-commission "Hero" bags.

Sample structure:
```json
[
  {
    "id": "away-carry-on",
    "brand": "Away",
    "model": "The Carry-On",
    "type": "hard",
    "dimensions": { "h": 21.7, "w": 13.7, "d": 9.0, "unit": "in" },
    "image_url": "/bags/away-co.png",
    "affiliate_link": "AMAZON_LINK_HERE"
  },
  {
    "id": "tortuga-travel-backpack-40l",
    "brand": "Tortuga",
    "model": "Travel Backpack 40L",
    "type": "soft",
    "dimensions": { "h": 21.7, "w": 13.8, "d": 7.9, "unit": "in" },
    "image_url": "/bags/tortuga-40.png",
    "affiliate_link": "LINK_TORTUGA_KEY",
    "commission_tier": "high",
    "marketing_hook": "Designed specifically for Spirit Personal Item limits."
  }
]
```

---

## 4. The Logic Engine (`src/lib/complianceEngine.ts`)

The code must perform a **3-Step Check** when a user selects a bag and airline.

**Step 1: The Dimension Check**

* Compare `Bag(h,w,d)` vs `Bin(h,w,d)`.
* **Rotation Logic:** Airlines often flip dimensions (Width vs Height). Your code must attempt to rotate the bag.
    * *Algorithm:* Sort both Bag and Bin dimensions from smallest to largest. Compare `Bag[Small] vs Bin[Small]`, `Bag[Med] vs Bin[Med]`, etc.

**Step 2: The Material Check (The "Squish Factor")**

* If `Bag.type === "hard"`: **Zero Tolerance.** If it is 0.1" too big, it FAILS.
* If `Bag.type === "soft"`: Apply a **1.0" tolerance** to Width/Depth (but not Height, which usually has rigid backplates).
    * *Result:* "Yellow Warning" (It fits if you don't overstuff it).

**Step 3: The Result Output**

* **GREEN (Pass):** "You are safe. This bag fits perfectly."
* **YELLOW (Risk):** "Technically too big, but usually passes if not overpacked."
* **RED (Fail):** "STOP. You will likely be fined." -> **TRIGGERS MONETIZATION.**

---

## 5. User Interface (The "Apple" Aesthetic)

**The Layout (Mobile Vertical Stack):**

1. **Header:** "BagSizer" (Simple, Bold text with gradient).
2. **Input Cards:** Two large, clickable cards: "Select Your Airline" & "Select Your Bag."
3. **The Visualizer (Center Stage):**
    * A clean SVG representation of a "Wire Cage" (The Sizer).
    * An animated Rectangle (The Bag) that floats *into* the cage.
    * **Animation Logic:** If it fits, it glows Green. If it fails, it hits the edge, shakes (visual collision feedback), and glows Red.
4. **The Verdict (Bottom Sheet):**
    * Large Text: **"Perfect Fit!"** or **"Too Large."**
    * Subtext: "You save $99 in fees." or "It is 1.5 inches too wide."

---

## 6. Monetization & Transparency Strategy (Crucial)

**The "Why?" Transparency Feature:**
To prevent user suspicion, we do not just spam links. We explain the math.

**Scenario: Bag Fails (RED)**

1. **Show the Breakdown:** "Your bag is **1.5 inches too wide**. The sizer is rigid metal, so it will not fit."
2. **Show the Recommendation (The "AlternativeBag" Component):**
    * *Header:* "Passes Guaranteed."
    * *Product:* Tortuga Travel Backpack 40L.
    * *The "Why" Text:* "We recommend this because it is exactly **13.8 inches wide**, specifically designed to clear this airline's 14-inch limit."
    * *Call to Action:* "View Deal" (Affiliate Link).

**Disclaimer Text:**
Add this to the footer of the results card: *"Results based on official airline dimensions. We may earn a commission if you buy a recommended bag, which helps keep this tool free."*

---

## 7. Execution Checklist for the AI

1. **Initialize:** Set up Next.js + Tailwind + Zustand. ✓
2. **Data Ingestion:** Create the JSON files first. ✓
3. **Logic Core:** Write the `complianceEngine.ts` to handle the rotation and "squish" logic. ✓
4. **Visuals:** Build the `SizerCanvas` with Framer Motion. Ensure the "Shake on Fail" animation works.
5. **Integration:** Wire the "Fail State" to the `AlternativeBag` component using the partner links.

### 💰 Partner Placeholder Keys

*Use these keys in the code so I can swap them later:*

* `LINK_TORTUGA_KEY`
* `LINK_MONOS_KEY`
* `LINK_CABINZERO_KEY`
* `LINK_AER_KEY`

---

## Current Implementation Status

**✓ Completed:**
- Next.js 15 project with TypeScript and Tailwind CSS
- 23 airlines with verified 2025 dimensions
- 10 sample bags with realistic specifications
- Zustand state management
- Compliance engine with material-aware tolerance calculations
- Premium modern UI with spring animations
- Fully functional airline and bag selection
- Real-time compliance checking
- Dimension breakdown visualization
- Deployed to Vercel

**🔨 In Progress:**
- Enhanced compliance engine with rotation logic
- SVG visualizer with shake-on-fail animation
- Alternative bag recommendations (monetization component)
- Expanded bag database with affiliate links

**📋 Planned:**
- Rotation algorithm for dimension matching
- Yellow warning state for soft bags
- Enhanced visualizations
- Affiliate link integration
- SEO optimization
- Analytics integration
