# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with HMR at http://localhost:5173
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

No test runner is configured yet.

## Architecture

This is a React 19 + Vite 8 single-page application with Typescript. Entry point is `src/main.tsx`, which mounts `src/App.tsx` into `#root` in `index.html`.

- `src/App.tsx` — root component; currently the default Vite/React starter template
- `src/App.css` / `src/index.css` — component and global styles
- `public/` — static assets served at root (SVG icons sprite at `/icons.svg`, favicon)
- `assets/icons/` — source icon files (Faros logo, GitHub, Google Calendar, Jira, PagerDuty)

SVG icons in `public/icons.svg` are used as a sprite sheet via `<use href="/icons.svg#icon-id">`.

## ESLint

Config is in `eslint.config.js` (flat config format). Applies to `**/*.{ts,tsx}`. Unused vars are errors except for names matching `/^[A-Z_]/`.
