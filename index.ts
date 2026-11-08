// Generates a video with Seedance 2.5 (text-to-video) via the Higgsfield API.
// Credentials are read at runtime from HF_CREDENTIALS (KEY_ID:KEY_SECRET) in .env.local.
// Run: npm run generate:seedance
import { config as loadEnv } from "dotenv";
import { config, higgsfield, HiggsfieldError } from "@higgsfield/client/v2";

loadEnv({ path: ".env.local", quiet: true });

const MODEL = "bytedance/seedance-2.5/text-to-video";

async function main(): Promise<void> {
  if (!process.env.HF_CREDENTIALS) {
    throw new Error("HF_CREDENTIALS is not set. Add it to .env.local as KEY_ID:KEY_SECRET.");
  }

  config({
    credentials: process.env.HF_CREDENTIALS,
    // Video generation can take several minutes; the SDK default is 5.
    maxPollTime: 15 * 60 * 1000,
  });

  const result = await higgsfield.subscribe(MODEL, {
    input: {
      prompt: "A cinematic scene at sunset",
      duration: 5,
      resolution: "720p",
      aspect_ratio: "16:9",
    },
    withPolling: true,
  });

  const status: string = result.status;
  console.log(`Request ${result.request_id}: ${status}`);

  if (status === "completed" && result.video?.url) {
    console.log(`Video URL: ${result.video.url}`);
    return;
  }

  if (status === "nsfw") {
    throw new Error("Generation was blocked by content moderation (nsfw). No video was produced.");
  }
  if (status === "failed" || status === "canceled" || status === "cancelled") {
    throw new Error(`Generation ${status}. No video was produced.`);
  }
  throw new Error(`Generation ended without a video URL (status: ${status}).`);
}

main().catch((error: unknown) => {
  if (error instanceof HiggsfieldError) {
    console.error(`Higgsfield error (${error.name}): ${error.message}`);
  } else {
    console.error(error instanceof Error ? error.message : error);
  }
  process.exit(1);
});
