# Changelog

All notable changes to the BagSizer.io project will be documented in this file.

## [Unreleased]

### Added - 2025-12-11

#### Initial Setup
- Created Git repository at https://github.com/schoolmatchco/bagsizer.git
- Added repository URL to project overview document
- Created CHANGELOG.md to track all project changes

#### Next.js Project Initialization
- Initialized Next.js 15 project with TypeScript support
- Configured Tailwind CSS for styling
- Set up PostCSS with autoprefixer
- Created project configuration files (tsconfig.json, next.config.ts, tailwind.config.ts)
- Added comprehensive .gitignore file

#### Dependencies Installed
- **Core**: next@15.1.0, react@19.0.0, react-dom@19.0.0
- **State Management**: zustand@5.0.2
- **Animation**: framer-motion@11.15.0
- **Icons**: lucide-react@0.462.0
- **Dev Tools**: TypeScript 5.7.2, ESLint, Tailwind CSS

#### Project Structure Created
- `/src/data/` - Data layer for airlines and bags
- `/src/store/` - Zustand state management
- `/src/lib/` - Core business logic
- `/src/components/visualizer/` - SVG rendering components
- `/src/components/ui/` - User interface components
- `/src/components/results/` - Result display components
- `/src/components/monetization/` - Affiliate recommendation components
- `/src/app/` - Next.js App Router pages

#### Data Files
- **airlines.json**: 3 airlines configured (Spirit, United, Ryanair) with sizer dimensions, strictness levels, and gate-check fees
- **bags.json**: Sample bag data with dimensions and material properties

#### Core Implementation Files
- **useAppStore.ts**: Zustand store for selectedBag and selectedAirline state
- **complianceEngine.ts**: Mathematical logic for bag-fit calculations with tolerance handling based on strictness and material
- **SizerCanvas.tsx**: SVG visualization component (skeleton with spring animation config)
- **BagSelector.tsx**: Searchable bag selection modal (skeleton)
- **AirlineSelector.tsx**: Searchable airline selection modal (skeleton)
- **ComplianceCard.tsx**: Pass/fail result display with visual feedback
- **AlternativeBag.tsx**: Affiliate bag recommendation component
- **layout.tsx**: Root layout with Inter font and metadata
- **page.tsx**: Home page with project introduction
- **globals.css**: Global styles with Tailwind directives

#### Animation Configuration
- All components configured with spring physics: stiffness 300, damping 30
- Framer Motion integrated for smooth, premium-feel transitions

#### Git Configuration
- Initialized local git repository
- Created initial commit with full project structure
- Added remote: https://github.com/schoolmatchco/bagsizer.git
- Renamed default branch to 'main'

### Project Status
- **Current Phase**: Initial Development
- **Codebase Status**: Project structure implemented, component skeletons created
- **Assets Available**: 18+ airline SVG logos in /SVG Logos directory
- **Documentation**: Complete project blueprint in "Bag Sizer Project Overview.md"
- **Next Steps**:
  - Push to GitHub (pending authentication)
  - Implement full component functionality
  - Add more airline and bag data
  - Build out SVG visualization logic
  - Integrate affiliate links

---

## How to Use This Changelog

Each entry should include:
- **Date**: When the change was made
- **Category**: Added, Changed, Fixed, Removed, etc.
- **Description**: What was changed and why (if relevant)
- **Context**: Any important notes for picking up work later
