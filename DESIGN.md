# DESIGN.md: Apple (Consumer Electronics)

## 1. Visual Theme & Atmosphere
- **Mood**: Premium, minimalist, editorial, cinematic.
- **Density**: Low (high whitespace).
- **Philosophy**: "Radical subtraction." Every element must justify its existence. Focus on massive, elegant typography.

## 2. Color Palette
| Role | Hex | Functional Use |
| :--- | :--- | :--- |
| **Primary Surface** | `#FFFFFF` | Main background for light mode. |
| **Secondary Surface** | `#F5F5F7` | Subtle contrast for cards or section backgrounds. |
| **Primary Text** | `#1D1D1F` | Headings and body text. |
| **Secondary Text** | `#86868B` | Captions, labels, and less important info. |
| **Accent (Blue)** | `#0066CC` | Links and primary call-to-action buttons. |
| **System Green** | `#28CD41` | Success states. |
| **System Red** | `#FF3B30` | Error states. |

## 3. Typography (SF Pro)
| Level | Size | Weight | Tracking | Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | 80px | 600 (Semibold) | -0.015em | Hero headlines. |
| **Headline** | 48px | 600 (Semibold) | -0.009em | Section headers. |
| **Subheadline** | 24px | 400 (Regular) | 0.007em | Intro text. |
| **Body** | 17px | 400 (Regular) | -0.022em | Standard reading text. |
| **Caption** | 12px | 400 (Regular) | 0em | Small labels. |

## 4. Component Stylings
### Buttons
- **Primary**: Rounded corners (12px or fully pill-shaped). Background `#0066CC`, text `#FFFFFF`.
- **Secondary**: Text-only with a right-facing chevron (`>`). Color `#0066CC`.
- **Hover State**: Subtle opacity reduction (0.8) or slight darkening.

### Cards
- **Style**: Borderless with a very subtle background (`#F5F5F7`).
- **Corner Radius**: 18px to 22px (Squircle-like).
- **Shadow**: None, or extremely soft/large blur if used for elevation.

### Inputs
- **Style**: Minimalist. Light gray background (`#F5F5F7`) with rounded corners (12px).
- **Focus**: Subtle blue ring or border.

## 5. Layout Principles
- **Grid**: 12-column responsive grid with large gutters (30px+).
- **Whitespace**: Use "breathable" margins. Content should never feel cramped.
- **Alignment**: Centered for hero sections; left-aligned for editorial content.

## 6. Depth & Elevation
- **Philosophy**: Flat design with "glassmorphism" (background blur) for navigation bars.
- **Blur**: `backdrop-filter: blur(20px); background: rgba(255, 255, 255, 0.7);`
