// Generates the 4-scene "Mi Tarjetica" storyboard with the Higgsfield API:
// a 9:16 still per scene (Soul 2), then an animated clip from that still (Seedance 2.5 image-to-video).
// Credentials are read at runtime from HF_CREDENTIALS (KEY_ID:KEY_SECRET) in .env.local.
//
// Run:      npm run generate:storyboard
// Preview:  npm run generate:storyboard -- --dry-run      (no API calls, nothing billed)
// One scene: npm run generate:storyboard -- --scene 2
//
// Every finished image/video URL is saved to out/higgsfield/storyboard.json as soon as it exists.
// Re-running skips anything already there, so a partial failure never re-bills finished work.
import { config as loadEnv } from "dotenv";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { config, higgsfield, HiggsfieldError } from "@higgsfield/client/v2";

loadEnv({ path: ".env.local", quiet: true });

const IMAGE_MODEL = "higgsfield-ai/soul/v2/standard";
const VIDEO_MODEL = "bytedance/seedance-2.5/image-to-video";
const OUT_DIR = "out/higgsfield";
const MANIFEST = `${OUT_DIR}/storyboard.json`;

type Scene = { id: number; name: string; image: string; video: string };

const SCENES: Scene[] = [
  {
    id: 1,
    name: "tarjeta-a-la-basura",
    image:
      "Vertical 9:16 photo, cinematic, realistic. Close-up of a young man's hand (late 20s, denim jacket) holding a crumpled, coffee-stained paper loyalty card with hand-stamped circles, about to toss it into a trash bin outside a small Colombian coffee shop. Warm golden hour light, shallow depth of field. No text, no logos.",
    video:
      "Fast crash zoom into the crumpled paper loyalty card as it slips from his hand and falls into the trash bin in slow motion, coffee stains and torn edges in sharp detail. Dramatic, funny, cinematic. No text.",
  },
  {
    id: 2,
    name: "calle-colonial",
    image:
      "Vertical 9:16 photo, cinematic, realistic. A colorful colonial street in Colombia at golden hour: painted facades, small trees, a cozy coffee shop with a mint-green awning and outdoor tables. A young man (late 20s, short curly black hair, light beard, denim jacket) walks on the sidewalk looking at his phone, which glows soft mint green. No text, no logos.",
    video:
      "FPV drone shot flying low and fast down the colorful street, weaving past trees and lampposts, reaching the young man as his phone vibrates and glows mint green. He stops, looks up and smiles at the coffee shop with the mint-green awning. Energetic, cinematic. No text.",
  },
  {
    id: 3,
    name: "sello-digital",
    image:
      "Vertical 9:16 photo, cinematic, realistic. Inside a cozy Colombian coffee shop, wooden counter, espresso machine steaming. The young man (late 20s, short curly black hair, light beard, denim jacket) holds his phone over the counter; the screen shows a clean mint-green digital stamp card with circles. A barista (woman, 30s, dark hair in a bun, mint-green apron) smiles across the counter. No readable text, no logos.",
    video:
      "Bullet time: the moment freezes as a burst of glowing mint-green particles shoots out of the phone screen and forms a shining stamp circle in mid-air, coffee steam frozen around it, camera arcs around the frozen moment, then time resumes and the stamp snaps into the phone. Magical, premium, cinematic. No text.",
  },
  {
    id: 4,
    name: "final-feliz",
    image:
      "Vertical 9:16 photo, cinematic, realistic. The young man (late 20s, short curly black hair, light beard, denim jacket) sits at an outdoor table of the coffee shop with the mint-green awning, holding a steaming cup of coffee with latte art, laughing. The barista (woman, 30s, dark hair in a bun, mint-green apron) gives him a high five. Golden hour light. No text, no logos.",
    video:
      "Smooth 360 orbit around the table as he lifts the steaming coffee and the barista high-fives him, warm golden light flaring through the trees, steam swirling. Happy, warm, satisfying ending. No text.",
  },
];

type SceneResult = {
  name: string;
  imageRequestId?: string;
  imageUrl?: string;
  videoRequestId?: string;
  videoUrl?: string;
};
type Manifest = Record<string, SceneResult>;

function loadManifest(): Manifest {
  return existsSync(MANIFEST) ? (JSON.parse(readFileSync(MANIFEST, "utf8")) as Manifest) : {};
}

function saveManifest(manifest: Manifest): void {
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
}

// subscribe() only returns on completed/failed/nsfw; anything else (e.g. canceled) ends in a TimeoutError.
function assertCompleted(label: string, status: string, requestId: string): void {
  if (status === "completed") return;
  if (status === "nsfw") {
    throw new Error(`${label} was blocked by content moderation (request ${requestId}).`);
  }
  throw new Error(`${label} ended with status "${status}" (request ${requestId}).`);
}

async function runScene(scene: Scene, manifest: Manifest): Promise<void> {
  const key = String(scene.id);
  const entry: SceneResult = (manifest[key] ??= { name: scene.name });
  const tag = `[${scene.id} ${scene.name}]`;

  if (!entry.imageUrl) {
    console.log(`${tag} generating image...`);
    const image = await higgsfield.subscribe(IMAGE_MODEL, {
      input: { prompt: scene.image, aspect_ratio: "9:16", resolution: "1080p", batch_size: 1 },
      withPolling: true,
    });
    entry.imageRequestId = image.request_id;
    assertCompleted(`${tag} image`, image.status, image.request_id);
    const url = image.images?.[0]?.url;
    if (!url) throw new Error(`${tag} image completed without a URL (request ${image.request_id}).`);
    entry.imageUrl = url;
    saveManifest(manifest);
    console.log(`${tag} image: ${url}`);
  } else {
    console.log(`${tag} image already generated, reusing it.`);
  }

  if (!entry.videoUrl) {
    console.log(`${tag} animating image...`);
    const video = await higgsfield.subscribe(VIDEO_MODEL, {
      input: { image_url: entry.imageUrl, prompt: scene.video, duration: 5, resolution: "720p" },
      withPolling: true,
    });
    entry.videoRequestId = video.request_id;
    assertCompleted(`${tag} video`, video.status, video.request_id);
    if (!video.video?.url) {
      throw new Error(`${tag} video completed without a URL (request ${video.request_id}).`);
    }
    entry.videoUrl = video.video.url;
    saveManifest(manifest);
    console.log(`${tag} video: ${entry.videoUrl}`);
  } else {
    console.log(`${tag} video already generated, reusing it.`);
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const sceneArg = args.indexOf("--scene");
  const only = sceneArg >= 0 ? Number(args[sceneArg + 1]) : undefined;
  const scenes = only ? SCENES.filter((s) => s.id === only) : SCENES;
  if (scenes.length === 0) throw new Error(`No scene with id ${args[sceneArg + 1]}.`);

  if (args.includes("--dry-run")) {
    for (const s of scenes) {
      console.log(`Scene ${s.id} (${s.name})\n  image -> ${IMAGE_MODEL}\n  video -> ${VIDEO_MODEL}\n`);
    }
    return;
  }

  if (!process.env.HF_CREDENTIALS) {
    throw new Error("HF_CREDENTIALS is not set. Add it to .env.local as KEY_ID:KEY_SECRET.");
  }
  config({ credentials: process.env.HF_CREDENTIALS, maxPollTime: 15 * 60 * 1000 });

  const manifest = loadManifest();
  const results = await Promise.allSettled(scenes.map((s) => runScene(s, manifest)));
  saveManifest(manifest);

  const failures = results.flatMap((r) => (r.status === "rejected" ? [r.reason as unknown] : []));
  for (const error of failures) {
    const message = error instanceof Error ? error.message : String(error);
    const kind = error instanceof HiggsfieldError ? `Higgsfield error (${error.name}): ` : "";
    console.error(`${kind}${message}`);
  }
  console.log(`\n${scenes.length - failures.length}/${scenes.length} scenes finished. URLs saved in ${MANIFEST}.`);
  if (failures.length > 0) process.exit(1);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
