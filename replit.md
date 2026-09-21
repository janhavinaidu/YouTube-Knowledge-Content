# YouTube Knowledge + Content

Turn public YouTube transcripts into structured notes and original content ideas with Groq.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/youtube-knowledge run dev` — run the web app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required secret: `GROQ_API_KEY`
- Optional env: `GROQ_MODEL` (defaults to `llama-3.1-8b-instant`)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Web: React + Vite
- API: Express 5
- Transcript retrieval: `youtube-transcript`
- AI: Groq OpenAI-compatible API
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: Vite + esbuild

## Where things live

- `artifacts/youtube-knowledge/src/App.tsx` — main single-route experience
- `artifacts/youtube-knowledge/src/index.css` — theme, typography, texture, and motion
- `artifacts/api-server/src/routes/analyze.ts` — analysis endpoint
- `artifacts/api-server/src/lib/youtube.ts` — URL parsing, metadata, and transcript retrieval
- `artifacts/api-server/src/lib/ai.ts` — bounded transcript prompt and Groq response validation
- `lib/api-spec/openapi.yaml` — source-of-truth API contract

## Architecture decisions

- The app intentionally has no database or user accounts; it is a single focused workflow.
- Groq is called only from the server so the browser never receives the API key.
- Transcript length is bounded before model submission so large videos do not create unbounded requests.
- The model response is parsed and validated against the generated OpenAPI schema before it reaches the UI.

## Product

Users paste a public YouTube URL and receive a summary, takeaways, structured notes, and exactly five original content ideas with hooks, formats, and explanations. Results can be copied section-by-section.

## User preferences

- Keep the application free to run by using the Groq free tier and avoiding paid automation platforms.

## Gotchas

- Add `GROQ_API_KEY` as a secret before using the Generate action.
- Some YouTube videos do not expose transcripts; the API returns a friendly 400 response instead of a stack trace.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
