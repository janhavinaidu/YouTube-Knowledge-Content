# YouTube Knowledge + Content

Turn a public YouTube video into a useful working brief: a concise summary, key takeaways, structured notes, and five original content directions.

## How it works

1. Paste a public YouTube watch, short, embed, live, or `/v/` URL.
2. The API retrieves the video's available transcript.
3. Very long transcripts are bounded before they are sent to the model.
4. Groq returns structured JSON with knowledge and original content ideas.
5. The browser renders the result with copy buttons for the summary, takeaways, and each idea.

## Stack

- React + Vite for the interface
- Express for the server-side API
- `youtube-transcript` for public caption retrieval
- Groq's OpenAI-compatible API using the free-tier model `llama-3.1-8b-instant` by default
- Zod-generated request and response validation

There is no database, authentication, paid automation platform, or paid API in this version.

## Environment variables

Add this as a Replit Secret or in a local `.env` file:

```env
GROQ_API_KEY=your_free_groq_key
```

Optional:

```env
GROQ_MODEL=llama-3.1-8b-instant
```

The Groq key is read only by the API server. It is never sent to the browser.

## Run it

From the workspace root:

```bash
pnpm install
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/youtube-knowledge run dev
```

The Replit workflows start these services automatically.

## Known limitations

- The video must be public and have a transcript that YouTube exposes to the transcript library.
- Some creator-generated captions, age-restricted videos, region-locked videos, or videos with captions disabled may not be available.
- Long transcripts are shortened to fit the model request. The result labels when that happens.
- Groq free-tier rate limits apply.
- The model is instructed to stay grounded in the transcript, but generated summaries and ideas should still be reviewed before publishing.