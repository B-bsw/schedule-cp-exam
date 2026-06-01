---
name: CP Exam Schedule
description: Fast exam schedule lookup for CP students.
colors:
  charcoal-ink: "#111827"
  near-black: "#171717"
  soft-white: "#FAFAFA"
  pure-white: "#FFFFFF"
  mist-gray: "#E5E7EB"
  cloud-gray: "#F3F4F6"
  slate-gray: "#6B7280"
  graphite: "#4B5563"
  steel: "#9CA3AF"
  blue-accent: "#2563EB"
  blue-tint: "#EFF6FF"
  orange-accent: "#EA580C"
  orange-tint: "#FFF7ED"
  zinc-soft: "#F4F4F5"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.875rem, 3vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  sm: "8px"
  md: "16px"
  lg: "24px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
components:
  input-default:
    backgroundColor: "{colors.pure-white}"
    textColor: "{colors.charcoal-ink}"
    rounded: "{rounded.md}"
    padding: "16px 24px"
  input-compact:
    backgroundColor: "{colors.pure-white}"
    textColor: "{colors.charcoal-ink}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  card-default:
    backgroundColor: "{colors.pure-white}"
    textColor: "{colors.charcoal-ink}"
    rounded: "{rounded.md}"
    padding: "20px"
  chip-neutral:
    backgroundColor: "{colors.cloud-gray}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.sm}"
    padding: "4px 12px"
---

# Design System: CP Exam Schedule

## 1. Overview

**Creative North Star: "The Clear Desk"**

This system is built to make a single task feel effortless: find an exam schedule quickly and move on. The interface stays clean and quiet, with generous spacing and calm neutrals so the results are easy to scan. It rejects clutter, visual noise, and any layout that slows down the lookup flow.

Key characteristics:

- Clear, easy, efficient.
- Flat by default, with structure from borders and subtle tonal shifts.
- High readability over decoration.

## 2. Colors

A neutral-first palette that keeps attention on the inputs and results, with minimal accent color reserved for status context.

### Primary

- **Charcoal Ink** (#111827): Primary text, headings, and primary content.

### Secondary

- **Blue Accent** (#2563EB): Status tag for morning/neutral states and focus highlights.

### Tertiary

- **Orange Accent** (#EA580C): Status tag for afternoon states.

### Neutral

- **Soft White** (#FAFAFA): Main page background.
- **Pure White** (#FFFFFF): Cards, inputs, table surfaces.
- **Mist Gray** (#E5E7EB): Borders and dividers.
- **Cloud Gray** (#F3F4F6): Subtle chips and muted fills.
- **Slate Gray** (#6B7280): Secondary text.
- **Graphite** (#4B5563): Supporting text and counters.
- **Zinc Soft** (#F4F4F5): Table header and zebra fill.

**The Rare Accent Rule.** Blue and orange are used only for status tags; everything else remains neutral.

## 3. Typography

**Display Font:** Geist (ui-sans-serif fallback)
**Body Font:** Geist (ui-sans-serif fallback)
**Label/Mono Font:** Geist Mono for IDs and codes

**Character:** Modern, restrained, and highly legible.

### Hierarchy

- **Display** (600, clamp(1.875rem, 3vw, 2.25rem), 1.2): Page titles.
- **Title** (600, 1.125rem, 1.4): Section headers and result titles.
- **Body** (400, 1rem, 1.6): Primary copy and table rows.
- **Label** (600, 0.75rem, 0.08em, uppercase): Table headers and small field labels.

**The Plain-Text Rule.** Body copy stays sentence-case and readable; labels can be uppercase but only when short.

## 4. Elevation

Flat by default. Depth is communicated with borders, soft fills, and spacing. When a hint of lift is needed (cards or hover), use the lightest possible shadow.

### Shadow Vocabulary

- **Whisper** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)`): Optional for cards and inputs.

**The Flat-By-Default Rule.** Elevation appears only when it clarifies affordance.

## 5. Components

### Inputs

- **Character:** Clean, inviting, and focused.
- **Shape:** Rounded medium (16px).
- **Default:** White surface with Mist Gray border, Charcoal Ink text, and clear placeholder contrast.
- **Focus:** Subtle ring or border change; keep it minimal.

### Cards (Mobile Results)

- **Character:** Quiet containers that prioritize scanability.
- **Shape:** Rounded medium (16px) with optional Whisper shadow.
- **Content:** Mono ID chip, status tag, and a clear subject line.

### Table (Desktop Results)

- **Character:** Structured and compact for quick scanning.
- **Surface:** White with Zinc Soft header and alternating row tint.
- **Dividers:** Mist Gray borders to separate columns without heavy lines.

### Status Tags

- **Blue:** Morning/standard status.
- **Orange:** Afternoon status.

## 6. Do's and Don'ts

**Do**

- Keep the layout uncluttered with plenty of breathing room.
- Use neutral surfaces and reserve color for status.
- Prioritize contrast and text clarity over decoration.

**Don't**

- Add busy backgrounds or visual noise.
- Use strong shadows or heavy gradients.
- Let accent colors spread beyond status indicators.
