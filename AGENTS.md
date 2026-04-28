# AGENTS.md

<!-- DO NOT assume standard Next.js behavior—APIs may be deprecated or changed -->

## Commands

```bash
npm run dev    # Dev server at localhost:3000
npm run build  # Production build
npm run start  # Start production server
npm run lint   # ESLint (flat config)
```

## Critical Details

- **Next.js 16.2.4** (beta/canary): This is NOT the Next.js in your training data. Read `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.
- **Tailwind CSS v4**: Uses `@tailwindcss/postcss`plugin, not the v3 setup. No `tailwind.config.js`—config is in CSS via `@theme` directive.
- **ESLint flat config**: Uses `eslint.config.mjs` with the new `defineConfig()` format, not `.eslintrc.json`.
- **No typecheck script**: Run `npx tsc --noEmit` manually if needed.
- **No tests**: No test framework is configured.

## Project Structure

- `app/` — App Router pages (`page.tsx`, `layout.tsx`)
- Entry point: `app/page.tsx`