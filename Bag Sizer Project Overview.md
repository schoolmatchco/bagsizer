# ✈️ Project Blueprint: BagSizer.io (Master Plan)

## 1. Executive Summary & Core Philosophy
**Goal:** Build a mobile-first, ultra-fast web tool that visualizes whether a specific piece of luggage fits into a specific airline's sizer bin.
**Core Value:** Relieve traveler anxiety about gate-check fees ($100+).
**Revenue Model:** High-intent affiliate marketing. When a bag *fails* the check, we recommend a partner bag that *passes*, explaining exactly *why* it passes.
**Design Philosophy:** "Radical Simplicity." No clutter. Large touch targets. Instant results. 60FPS animations. It must feel like a native iOS app, not a website.

**Repository:** https://github.com/schoolmatchco/bagsizer.git

---

## 2. Technical Stack & Architecture

* **Framework:** Next.js (React) - *For speed, SEO, and static generation.*
* **Styling:** Tailwind CSS - *For rapid, clean UI development.*
* **Icons/Logos:** `lucide-react` for UI icons. Airline logos must be high-quality SVGs (use `sexym0nk3y/airline-logos` on GitHub or similar CDN).
* **State Management:** Zustand (Simple global state for `selectedBag` and `selectedAirline`).
* **Animation:** Framer Motion - *Critical requirement.*
    * **Physics:** Use `type: "spring", stiffness: 300, damping: 30` for all transitions to achieve a "heavy," premium feel.
* **Deployment:** Vercel (Zero config, fast edge network).

### 📂 File Structure (Directive)
Organize the project exactly as follows:
* `src/data/airlines.json` (The "Container" database)
* `src/data/bags.json` (The "Object" database)
* `src/store/useAppStore.ts` (Zustand state)
* `src/lib/complianceEngine.ts` (The pure math logic for comparisons)
* `src/components/visualizer/SizerCanvas.tsx` (The SVG rendering engine)
* `src/components/ui/BagSelector.tsx` (Searchable modal with images)
* `src/components/ui/AirlineSelector.tsx` (Searchable modal with logos)
* `src/components/results/ComplianceCard.tsx` (The Red/Green output logic)
* `src/components/monetization/AlternativeBag.tsx` (The "Fix It" recommendation card)

---

## 3. Data Structure (The "Brain")

Create these two JSON files in `src/data/`.

### A. `airlines.json` (The Container)
*Logic Note:* `hard_sided: true` implies a rigid metal box (Spirit/Frontier). `hard_sided: false` implies a wire frame or policy limit (United/Delta).

```json
[
  {
    "id": "spirit-airlines",
    "name": "Spirit Airlines",
    "logo_code": "NKS", 
    "regions": ["US"],
    "sizers": {
      "personal": { "h": 18, "w": 14, "d": 8, "unit": "in", "strictness": "high", "hard_sided": true },
      "carry_on": { "h": 22, "w": 18, "d": 10, "unit": "in", "strictness": "medium", "hard_sided": true }
    },
    "fees": { "gate_check": 99 }
  },
  {
    "id": "united-airlines",
    "name": "United Airlines",
    "logo_code": "UAL",
    "regions": ["US"],
    "sizers": {
      "personal": { "h": 17, "w": 10, "d": 9, "unit": "in", "strictness": "extreme", "hard_sided": false },
      "carry_on": { "h": 22, "w": 14, "d": 9, "unit": "in", "strictness": "high", "hard_sided": true }
    },
    "fees": { "gate_check": 65 }
  },
  {
    "id": "ryanair",
    "name": "Ryanair",
    "logo_code": "RYR",
    "regions": ["EU"],
    "sizers": {
      "personal": { "h": 15.7, "w": 9.8, "d": 7.8, "unit": "in", "strictness": "extreme", "hard_sided": true },
      "carry_on": { "h": 21.6, "w": 15.7, "d": 7.8, "unit": "in", "strictness": "high", "hard_sided": true }
    },
    "fees": { "gate_check": 75 }
  }
]