# VELAIR project instructions

## Read first

Read `docs/PLAN.md`, `docs/STATUS.md`, and the relevant task in `docs/BACKLOG.md`. The current repository contains a working 3D demo. Production art polish, adaptive LOD and real-device performance validation remain separate tasks. Distinguish implemented behavior from planned work.

## Product direction

Build a private-jet portfolio concept: top-down hero, clouds, continuous cabin cutaway, closure into side view, flight behind a content panel, and a quiet ending. English visitor copy, Turkish planning and handoff notes. Keep readable semantic HTML outside WebGL. Follow the visual and motion contracts in `docs/PLAN.md` and `docs/MOTION.md`.

## Agent workflow

The primary agent is the integrator. Project specialist definitions are under `.codex/agents/`. Use bounded specialists when a development phase explicitly calls for parallel work; do not launch them merely to read the repository. Keep at most three specialists active alongside the primary agent. Each assignment must name task ID, owned paths, input contract, acceptance criteria, and dependencies. No recursive delegation by specialists.

Only the integrator edits shared contracts (`src/types/`, `src/lib/motion/chapters.ts`), dependency manifests/lockfile, global tokens, CI, and Vercel configuration, unless it explicitly transfers ownership. Specialists should propose changes to these files instead of racing to edit them. Ownership is a coordination convention, not a filesystem security boundary.

Do not modify files owned by another running task or revert unrelated work. Use separate worktrees if branches are needed; never switch a shared checkout underneath another worker. The integrator handles integration commits, GitHub pushes, and deployment within the user's authorization. Specialists return scoped changes and evidence, not independent production releases.

## Engineering rules

- Node 22 and npm; keep the exact-version `package-lock.json`. Do not bypass peer dependency conflicts.
- Preserve server components for content. WebGL is a lazy client boundary with a static fallback.
- One canvas and one scroll playhead. No per-frame React state or DOM layout reads.
- Use absolute progress sampling so jumps and reverse scroll work. GSAP cleanup must survive Strict Mode and resize.
- Asset paths must exist before loading. Record licenses and sizes in `docs/ASSETS.md`.
- Reduced motion, unavailable WebGL, context loss, keyboard navigation, and mobile are part of acceptance.
- Avoid adding unrelated frameworks, backend services, analytics, forms, or animations.
- Never store credentials, `.vercel` metadata, generated build files, or raw commercial assets in Git.

## Validation and handoff

Run `npm run check` for integration. For visual changes, verify the relevant scene on desktop and mobile and record actual evidence in `docs/STATUS.md`. Add meaningful tests for new timeline/interaction risks; do not mirror styling in unit tests. Quality review must identify viewport, steps, observed failure, affected file, and severity. Never describe a proposed metric or unrun check as a result.

Return: changed files; visible behavior; commands/results; asset or performance impact; outstanding limitations; suggested next task. Keep `docs/STATUS.md` accurate and update backlog states after accepted integration.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
