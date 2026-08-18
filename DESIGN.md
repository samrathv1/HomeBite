# HomeBite Design System

This document outlines the core design language for HomeBite, generated from our Stitch design specifications. The goal is to provide a unified aesthetic that blends "modern technology" with "Indian home warmth".

## 1. Typography
- **Heading Font**: `Playfair Display` (Serif)
  - Used for large Hero headers, section titles, and modal headers.
  - Imparts a classic, premium, and culinary feel.
- **Body Font**: `Inter` (Sans-Serif)
  - Used for paragraphs, buttons, labels, and small text.
  - Ensures maximum readability on mobile devices.

## 2. Colors
Our palette is appetizing, warm, and highly legible.

| Role | Color | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | Deep Teal | `#12666A` | Main headers, active states, key branding elements. |
| **Secondary** | Warm Orange | `#F47A2A` | CTA buttons, promo highlights, energetic accents. |
| **Tertiary** | Fresh Green | `#557A55` | Trust badges (Hygiene, Veg), success states. |
| **Background** | Cream/Warm White | `#FBF6EC` | Main page background, providing warmth compared to stark white. |
| **Surface** | White | `#FFFFFF` | Cards, modals, and raised surfaces. |
| **Text (Main)** | Charcoal | `#252525` | Primary body text and headings. |
| **Text (Muted)** | Warm Gray | `#6F6F6F` | Subtitles, helper text, disabled states. |

## 3. Spacing
We use a standard 4pt/8pt grid system.
- **Micro**: 4px (`gap-1`, `p-1`)
- **Small**: 8px / 12px (`gap-2`, `gap-3`, `p-2`)
- **Medium**: 16px / 24px (`gap-4`, `gap-6`, `p-4`)
- **Large**: 32px / 48px (`gap-8`, `gap-12`, `p-8`)
- **Section Padding**: 64px to 96px (`py-16`, `py-24`)

## 4. Border Radius
- **Cards & Modals**: `ROUND_TWELVE` (24px to 32px) (`rounded-[1.5rem]` or `rounded-3xl`) for a soft, friendly feel.
- **Buttons & Pills**: `ROUND_FULL` (`rounded-full`) for high-tappability on mobile.
- **Images**: `rounded-2xl` with overflow hidden.

## 5. UI Components

### Card Styles
- Background: White (`#FFFFFF`)
- Border: 1px solid `#F0EBE3`
- Shadow: Subtle drop shadow (`shadow-sm` or `shadow-md` on hover)
- Padding: Generous internal padding (24px to 32px)

### Button Styles
- **Primary CTA**: Orange background (`#E65C00` or `#F47A2A`), white text, bold font, fully rounded, with a subtle hover scaling effect (`hover:scale-105`).
- **Secondary CTA**: Dark outline or solid Dark Teal (`#12666A`), white text.
- **Pills/Badges**: Light background of the parent color (e.g., `#FFF0E6` with `#E65C00` text) with a matching border.

### Navigation Patterns
- Sticky top header with a blur effect.
- Bottom navigation (for mobile web views) with clear icon + text labels.
- "Back" links styled as subtle, bold text with left arrows (`← Back to Home`).

## 6. Responsive Behavior
- **Mobile First**: All elements stack vertically on `< 768px` (md) screens.
- **Touch Targets**: Minimum 48x48px clickable areas for buttons and links.
- **Grids**: 1 column on mobile, transitioning to 2 or 3 columns on tablet and desktop.
- **Horizontal Scrolling**: Used for categories, cravings, and menus to save vertical space on mobile (with `scrollbar-hide` and `snap-x`).
