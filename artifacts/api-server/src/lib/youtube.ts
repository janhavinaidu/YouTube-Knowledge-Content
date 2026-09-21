import { fetchTranscript as fetchYoutubeTranscript } from "youtube-transcript";

export type YouTubeVideo = {
  video_id: string;
  title: string | null;
  channel: string | null;
  duration: string | null;
  thumbnail_url: string | null;
};

export type TranscriptResult = {
  text: string;
  wordCount: number;
  video: YouTubeVideo;
};

export class InvalidYouTubeUrlError extends Error {}

export class TranscriptUnavailableError extends Error {}

export function extractVideoId(value: string): string | null {
  try {
    const url = new URL(value.trim());
    const hostname = url.hostname.replace(/^www\./, "").toLowerCase();

    if (hostname === "youtu.be") {
      return url.pathname.slice(1).split("/")[0] || null;
    }

    if (hostname !== "youtube.com" && hostname !== "m.youtube.com") {
      return null;
    }

    if (url.pathname === "/watch") {
      return url.searchParams.get("v");
    }

    const pathParts = url.pathname.split("/").filter(Boolean);
    if (["shorts", "embed", "live", "v"].includes(pathParts[0] ?? "")) {
      return pathParts[1] ?? null;
    }

    return null;
  } catch {
    return null;
  }
}

function getCanonicalUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

async function getVideoMetadata(
  videoId: string,
  originalUrl: string,
): Promise<YouTubeVideo> {
  const fallback: YouTubeVideo = {
    video_id: videoId,
    title: null,
    channel: null,
    duration: null,
    thumbnail_url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  };

  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(originalUrl)}&format=json`,
      { signal: AbortSignal.timeout(8_000) },
    );
    if (!response.ok) return fallback;

    const data = (await response.json()) as {
      title?: string;
      author_name?: string;
      thumbnail_url?: string;
    };
    return {
      ...fallback,
      title: data.title ?? null,
      channel: data.author_name ?? null,
      thumbnail_url: data.thumbnail_url ?? fallback.thumbnail_url,
    };
  } catch {
    return fallback;
  }
}

export async function retrieveTranscript(url: string): Promise<TranscriptResult> {
  const videoId = extractVideoId(url);
  if (!videoId || !/^[\w-]{6,20}$/.test(videoId)) {
    throw new InvalidYouTubeUrlError("Please enter a valid public YouTube URL.");
  }

  let transcript: Array<{ text?: string }> = [];
  try {
    transcript = await fetchYoutubeTranscript(videoId);
  } catch {
    throw new TranscriptUnavailableError(
      "No transcript is available for this video. Try a video with captions enabled.",
    );
  }

  const text = transcript
    .map((line) => line.text?.replace(/\s+/g, " ").trim())
    .filter((line): line is string => Boolean(line))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) {
    throw new TranscriptUnavailableError(
      "The transcript was empty. Try another video with captions enabled.",
    );
  }

  return {
    text,
    wordCount: text.split(/\s+/).filter(Boolean).length,
    video: await getVideoMetadata(videoId, getCanonicalUrl(videoId)),
  };
}