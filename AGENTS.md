<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Component and hook organization

- Keep reusable UI under `src/components/`, grouped by atomic-design role (`atoms`,
  `molecules`, `organisms`, or `templates`). Put each component in its own
  `<ComponentName>/index.tsx` directory, for example
  `src/components/atoms/CheckoutButton/index.tsx`.
- Keep shared React hooks in `src/components/hooks/` using descriptive kebab-case filenames.
- Do not add new UI components or hooks under `src/features/`; update imports to the
  corresponding shared component or hook path when moving code.
