# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

- `pnpm dev` — Start Vite dev server (runs on http://localhost:5173)
- `pnpm build` — Create production build
- `pnpm preview` — Preview production build locally
- `pnpm lint` — Run ESLint

Note: This project does not currently have a test suite configured.

## Architecture Overview

Firma is a client-side PDF editor built with React, TypeScript, Vite, and Tailwind CSS. The application runs entirely in the browser with no server-side processing.

**State Management:** The `useFirma` hook (`src/hooks/useFirma.ts`) centralizes all application state and business logic. This includes PDF file management, text fields, signatures, active selections, zoom, and pagination.

**Path Alias:** `@/` maps to `src/` (configured in `tsconfig.json` and `vite.config.ts`)

**Package Manager:** `pnpm`

## Core Technical Concepts

**PDF Processing:**
- Rendering: `react-pdf` displays the PDF document
- Modification: `pdf-lib` with `@pdf-lib/fontkit` embeds custom fonts and exports the final PDF
- All processing happens client-side for privacy

**Coordinate System:**
- Text and signature fields store positions as relative coordinates (0–1 range)
- Coordinates are scaled to pixels for rendering based on PDF dimensions × zoom scale
- PDF coordinate system has an inverted y-axis compared to screen coordinates

**Multi-Page Support:**
- Each field includes a `page` property indicating which page it belongs to
- Fields are filtered by current page for display

**Field Types:**
- **Text fields** (`TextField` type): Draggable, resizable text with font, size, color, and styling (bold, italic, underline, strikethrough)
- **Signature fields** (`SignatureField` type): Draggable, resizable images from draw/type/upload signatures

**Font Loading:**
- Google Fonts are dynamically loaded in the browser for preview
- On export, font files are fetched from Google Fonts CDN and embedded into the PDF using `pdf-lib`
- Falls back to Helvetica if font embedding fails

**Drag and Resize:**
- Uses `react-rnd` (not `react-draggable`) for drag-and-drop and resize functionality
- Maintains aspect ratio for signatures

## Component Architecture

**`useFirma` Hook** (`src/hooks/useFirma.ts`)
- Manages all state: PDF file, text fields, signature fields, active selection, zoom, current page
- Provides actions: file upload, add/remove/update fields, manage signatures, download PDF
- Handles coordinate transformations and PDF export logic

**`App.tsx`**
- Main application orchestrator
- Renders header, sidebar, canvas, and inspector
- Connects `useFirma` state and actions to UI components

**`PDFCanvas`** (`src/components/PDFCanvas.tsx`)
- Renders PDF using `react-pdf`
- Overlays draggable/resizable text and signature fields on top of PDF
- Filters fields by current page

**`Sidebar`** (`src/components/Sidebar.tsx`)
- Left sidebar with file overview, signature manager, and instructions
- Shows active field properties via `TextProperties` component

**`TextField`** (`src/components/TextField.tsx`)
- Individual draggable/resizable text field with inline editing
- Visual feedback for active/new fields

**`SignatureManager`** (`src/components/SignatureManager.tsx`)
- Create signatures via draw, type, or upload
- Manage saved signatures
- Place signatures on PDF

**`TextProperties`** (`src/components/TextProperties.tsx`)
- Edit active text field properties: font family, size, color, formatting

**Shadcn UI Components** (`src/components/ui/`)
- Pre-built UI primitives (button, dialog, input, slider, tabs, etc.)
- **DO NOT modify these components** — they are managed by Shadcn UI

## Important Notes

- **AGENTS.md Discrepancy:** The existing `AGENTS.md` file states that logic is contained in `src/App.tsx`, but the codebase has evolved and logic is now centralized in the `useFirma` hook. The `AGENTS.md` file also mentions `react-draggable`, but the project actually uses `react-rnd`.
- Never modify Shadcn UI components in `src/components/ui/` directory
