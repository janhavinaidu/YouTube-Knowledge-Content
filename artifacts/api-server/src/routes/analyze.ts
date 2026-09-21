import { Router, type IRouter } from "express";
import {
  AnalyzeYoutubeVideoBody,
  AnalyzeYoutubeVideoResponse,
} from "@workspace/api-zod";
import {
  generateAnalysis,
  AiConfigurationError,
  AiOutputError,
  AiProviderError,
} from "../lib/ai";
import {
  InvalidYouTubeUrlError,
  retrieveTranscript,
  TranscriptUnavailableError,
} from "../lib/youtube";

const router: IRouter = Router();

router.post("/analyze", async (req, res): Promise<void> => {
  const parsedBody = AnalyzeYoutubeVideoBody.safeParse(req.body);
  if (!parsedBody.success) {
    req.log.warn({ errors: parsedBody.error.flatten() }, "Invalid analysis input");
    res.status(400).json({
      error: "Paste a YouTube URL to get started.",
      code: "invalid_input",
    });
    return;
  }

  try {
    const transcript = await retrieveTranscript(parsedBody.data.url);
    const result = await generateAnalysis(
      transcript.text,
      transcript.wordCount,
      transcript.video,
    );
    res.json(AnalyzeYoutubeVideoResponse.parse(result));
  } catch (error) {
    if (error instanceof InvalidYouTubeUrlError) {
      res.status(400).json({ error: error.message, code: "invalid_url" });
      return;
    }

    if (error instanceof TranscriptUnavailableError) {
      res.status(400).json({
        error: error.message,
        code: "transcript_unavailable",
      });
      return;
    }

    if (error instanceof AiConfigurationError) {
      res.status(503).json({ error: error.message, code: "ai_not_configured" });
      return;
    }

    if (error instanceof AiProviderError || error instanceof AiOutputError) {
      req.log.warn({ error: error.message }, "Video analysis failed");
      res.status(503).json({ error: error.message, code: "ai_unavailable" });
      return;
    }

    req.log.error({ error }, "Unexpected video analysis error");
    res.status(503).json({
      error: "Something went wrong while analyzing the video. Please try again.",
      code: "analysis_failed",
    });
  }
});

export default router;