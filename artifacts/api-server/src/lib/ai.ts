import { AnalyzeYoutubeVideoResponse } from "@workspace/api-zod";
import { z } from "zod";
import type { YouTubeVideo } from "./youtube";

const MAX_TRANSCRIPT_CHARS = 48_000;
const START_CHARS = 36_000;
const END_CHARS = MAX_TRANSCRIPT_CHARS - START_CHARS;

type AnalysisResult = z.infer<typeof AnalyzeYoutubeVideoResponse>;

export class AiConfigurationError extends Error {}

export class AiProviderError extends Error {}

export class AiOutputError extends Error {}

function prepareTranscript(text: string): {
  text: string;
  truncated: boolean;
} {
  if (text.length <= MAX_TRANSCRIPT_CHARS) {
    return { text, truncated: false };
  }

  return {
    text: `${text.slice(0, START_CHARS)}\n\n[Middle of transcript omitted for length.]\n\n${text.slice(-END_CHARS)}`,
    truncated: true,
  };
}

function parseJsonContent(content: string): unknown {
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");
  return JSON.parse(cleaned);
}

export async function generateAnalysis(
  transcript: string,
  wordCount: number,
  video: YouTubeVideo,
): Promise<AnalysisResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new AiConfigurationError(
      "Add GROQ_API_KEY to the project secrets to generate an analysis.",
    );
  }

  const prepared = prepareTranscript(transcript);
  const model = process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";

  const systemPrompt = `You are an expert research assistant and content strategist.

Analyze the provided YouTube transcript and return only valid JSON.
Understand the actual concepts discussed, produce accurate structured notes, identify useful insights, and convert those insights into original content ideas.
Do not invent information that is not supported by the transcript.
Do not copy the creator's wording. Clearly distinguish between information stated in the video and your own content suggestions.

Return exactly this shape:
{
  "summary": "A concise 5-8 sentence summary.",
  "key_takeaways": ["5-8 useful insights"],
  "structured_notes": [{"heading": "Topic", "points": ["short factual point"]}],
  "content_ideas": [
    {"title": "Original angle", "hook": "A strong opening line", "format": "Instagram Reel", "explanation": "How to turn the angle into content"}
  ]
}

Generate exactly 5 content ideas. They must be inspired by the transcript's concepts but use original framing and wording. Keep the response compact and practical.`;

  let response: Response;
  try {
    response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.35,
          max_tokens: 4_500,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Video title: ${video.title ?? "Unknown"}\n\nTranscript:\n${prepared.text}`,
            },
          ],
        }),
        signal: AbortSignal.timeout(90_000),
      },
    );
  } catch {
    throw new AiProviderError(
      "Groq could not be reached right now. Please try again in a moment.",
    );
  }

  if (!response.ok) {
    throw new AiProviderError(
      response.status === 429
        ? "Groq's free-tier rate limit was reached. Please wait a moment and try again."
        : "Groq could not complete the analysis. Please try again.",
    );
  }

  try {
    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("Missing model content");

    const parsed = parseJsonContent(content) as Omit<
      AnalysisResult,
      "video" | "transcript_word_count" | "transcript_truncated"
    >;
    return AnalyzeYoutubeVideoResponse.parse({
      ...parsed,
      video,
      transcript_word_count: wordCount,
      transcript_truncated: prepared.truncated,
    });
  } catch {
    throw new AiOutputError(
      "The AI returned an incomplete result. Please try the video again.",
    );
  }
}