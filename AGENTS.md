<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

### Stack

- **Framework**: Next.js 16 (App Router) with TypeScript and Tailwind CSS v4
- **Testing**: Jest + ts-jest + @testing-library (jsdom environment)
- **Linting**: ESLint with `eslint-config-next` (core-web-vitals + TypeScript rules)
- **Package manager**: npm

### Common commands

All commands are defined in `package.json` scripts:

| Task | Command |
|------|---------|
| Dev server | `npm run dev` (port 3000 by default) |
| Lint | `npm run lint` |
| Test | `npm test` |
| Build | `npm run build` |

### Key caveats

- The ESLint config (`eslint.config.mjs`) uses the flat config format (ESLint 9+). Do not use legacy `.eslintrc` files.
- `eslint-config-next` includes a `react-hooks/set-state-in-effect` rule that disallows calling `setState` inside `useEffect`. Prefer server-side data fetching (server components) or `useMemo`/derived state instead.
- Tailwind CSS v4 uses `@theme inline` for custom CSS variables; do not use the legacy `tailwind.config.js` approach.
- The `@/*` path alias maps to `./src/*` (configured in both `tsconfig.json` and `jest.config.ts`).
