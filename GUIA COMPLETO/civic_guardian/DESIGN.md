---
name: Civic Guardian
colors:
  surface: '#f9f9ff'
  surface-dim: '#d8dae2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3fc'
  surface-container: '#ecedf6'
  surface-container-high: '#e6e8f0'
  surface-container-highest: '#e0e2eb'
  on-surface: '#181c22'
  on-surface-variant: '#414752'
  inverse-surface: '#2d3037'
  inverse-on-surface: '#eff0f9'
  outline: '#717784'
  outline-variant: '#c1c6d4'
  surface-tint: '#005eb2'
  primary: '#005aab'
  on-primary: '#ffffff'
  primary-container: '#1173d4'
  on-primary-container: '#faf9ff'
  inverse-primary: '#a7c8ff'
  secondary: '#5a5f62'
  on-secondary: '#ffffff'
  secondary-container: '#dce0e4'
  on-secondary-container: '#5e6367'
  tertiary: '#934400'
  on-tertiary: '#ffffff'
  tertiary-container: '#b95700'
  on-tertiary-container: '#fff9f7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a7c8ff'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#004788'
  secondary-fixed: '#dfe3e7'
  secondary-fixed-dim: '#c3c7cb'
  on-secondary-fixed: '#171c1f'
  on-secondary-fixed-variant: '#43474b'
  tertiary-fixed: '#ffdbc8'
  tertiary-fixed-dim: '#ffb68b'
  on-tertiary-fixed: '#321300'
  on-tertiary-fixed-variant: '#753400'
  background: '#f9f9ff'
  on-background: '#181c22'
  surface-variant: '#e0e2eb'
typography:
  display-header:
    fontFamily: Zilla Slab
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: 0.02em
  card-title:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 20px
  alert-text:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '700'
    lineHeight: '1.25'
  body-main:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  p-sm: 8px
  p-md: 16px
  p-lg: 24px
  gap-grid: 16px
  header-height: 64px
---

## Brand & Style
The brand personality is **Institutional, Reliable, and Urgent**. It serves as a digital town square that balances everyday utility with critical public safety information. The target audience includes citizens across all demographics, requiring a UI that is highly legible, accessible, and authoritative.

The design style is **Modern Corporate with a High-Contrast edge**. It utilizes a solid primary anchor to establish trust, while employing "Alert" patterns (High-Contrast Bold) for time-sensitive information. The interface prioritizes clarity and tap-targets over decorative elements, using a structured grid to organize diverse municipal services.

## Colors
The palette is built on a foundation of **Civic Blue** (`#1173D4`), representing stability and government authority. 

- **Primary:** Used for headers and structural accents (like card bottom-borders) to guide the eye.
- **Surface:** A cool, desaturated blue-grey (`#F0F4F8`) provides a distinct container for interactive elements without the harshness of pure white.
- **Semantic Alert:** `accent-danger` (`#E11D48`) is reserved strictly for urgent notifications and critical focus states.
- **Typography:** Deep slate (`#0F172A`) ensures high contrast against both white and light-grey backgrounds, exceeding AAA accessibility standards for body text.

## Typography
The system uses a sophisticated pairing of an authoritative serif and a functional sans-serif:

- **Heading (Zilla Slab):** Used exclusively for the primary brand identity and top-level page titles. It evokes a sense of traditional journalism and official documentation.
- **UI & Body (Public Sans):** A neutral, highly readable typeface designed for government interfaces. It is used for all functional labels, card titles, and body content to ensure clarity across low-resolution screens.
- **Intentional Leading:** Card titles use tight line-heights to accommodate multi-line labels, while body text maintains generous leading for readability.

## Layout & Spacing
The layout follows a **Fixed-Width Mobile-First** approach, optimized for a maximum width of 448px (max-w-md). 

- **Grid:** A symmetric 2-column grid is used for the primary dashboard, with a 16px (1rem) gutter.
- **Rhythm:** An 8px spatial system governs all margins and padding. 
- **Containers:** The main content area uses 16px lateral padding to ensure touch targets do not bleed into the screen edges. 
- **Alignment:** Buttons and cards use centered vertical stacks to emphasize iconography and labels equally.

## Elevation & Depth
Depth is communicated through **Tactile Boundaries and Tonal Contrast** rather than heavy shadows:

- **Structural Elevation:** The header uses a `shadow-md` to remain pinned above scrolling content.
- **Tactile Borders:** Cards utilize a 2px bottom border (`border-b-2`) in the primary color. This creates a "tab" feel, grounding the element on the surface.
- **Active States:** Depth is simulated during interaction by increasing the bottom border thickness to 4px and darkening the background color (`surface-active`), creating a "press" effect.
- **Semantic Focus:** Use a high-contrast ring (`accent-danger`) for keyboard navigation and focus states to ensure maximum visibility.

## Shapes
The shape language is **Soft-Square**. 

- **Service Cards:** Use `0.5rem` (rounded-lg) to provide a friendly, modern feel that contrasts with the sharp 0px radius of the header and alert banners.
- **Alert Banners:** These are intentionally rectangular with no rounding to signify they are system-level "interrupts" that span the full width of the container.
- **Interactive Elements:** Buttons within the cards inherit the card's 0.5rem radius to maintain a cohesive internal language.

## Components
- **Service Cards:** The core building block. Features a 2-column grid placement, `surface` background, and a `primary` colored icon (32px). Must include a 2px bottom border that thickens on hover.
- **Alert Banner:** A full-width, high-visibility component using `accent-danger` background and white text. Icons should be filled (`FILL: 1`) to maximize visual weight.
- **Header:** A static 64px bar in `primary` color. Title must be centered and use the `heading` font family.
- **Icons:** Use Material Symbols Outlined. Standardize on 24px for general UI and 32px for dashboard service icons.
- **Interactive States:** All buttons must have a clear transition (200ms) for background-color and scale-up effects on icons (110%) to provide tactile feedback.