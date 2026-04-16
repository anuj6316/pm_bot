# UI Specification: PM Bot Dashboard

## Visual Mood
- **Aesthetic:** Premium minimalism, high-key white space, precision-engineered.
- **Material:** Glassmorphism for navigation and floating panels (Background blur 20px, 70% opacity).
- **Radius:** 12px "squircle" for cards and containers.

## Design Tokens

### Spacing (8-point scale)
- Base: 8px
- Scale: 4, 8, 16, 24, 32, 48, 64
- Touch Targets: Min 44px height for interactive elements.

### Typography (SF Pro / System Sans-Serif)
- **Title 1:** 28px / Weight 600 / Line-height 1.2
- **Title 3:** 20px / Weight 600 / Line-height 1.2
- **Body:** 16px / Weight 400 / Line-height 1.5
- **Caption:** 14px / Weight 400 / Line-height 1.4

### Color Palette
- **Dominant (60%):** `#FFFFFF` (Main surface)
- **Secondary (30%):** `#F5F5F7` (Section backgrounds, card fills)
- **Accent (10%):** `#0066CC` (Primary CTAs, active status indicators)
- **Success:** `#28CD41` (Plane connected)
- **Warning/Error:** `#FF3B30` (Integration failure)

## Component Inventory

### 1. Navigation (Glassmorphic)
- **Position:** Fixed top or sidebar.
- **Style:** Background blur, thin white border (0.5px), 70% opacity.
- **Logo:** PM Bot (SF Pro Semibold).

### 2. Status Board
- **Agent Card:** 
    - Title: "Agent Status"
    - Subtext: "Polling: Active" or "Reasoning: Thinking..."
    - Animation: Pulse effect on accent color when processing.
- **Integration Card:**
    - Title: "Plane Cloud"
    - Status: "Connected" (Green dot) or "Error" (Red dot).

### 3. Task List (The Queue)
- **Table:** Borderless, subtle row hover (#F5F5F7).
- **Columns:** Issue ID (Plane link), Summary, Status (Labels: Unprocessed, Processing, Resolved), Cost/Latency (Observability).

## Copywriting Contract
- **Primary CTA:** "Sync Issues"
- **Empty State:** "No issues detected. Polling Plane every 5 minutes."
- **Error State:** "Failed to connect to Plane Cloud. Check API settings."

## Registry Safety
- **Tool:** shadcn (recommended for future React implementation)
- **Registry:** Official shadcn/ui components only.
