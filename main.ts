import { Application, Router } from "@oak/oak";
import generateBlocks from "./routes/blocks.ts";
import continueTrack from "./routes/continueTrack.ts";
import { signS3 } from "./utils/AWS/signS3.ts";
import MIDI_FILE_NAME from "./utils/midiFile.ts";


const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = "Hello world";
});

router.post("/api/blocks", async (ctx) => {
  const blocks = await generateBlocks();
  ctx.response.body = blocks;
});

router.post("/api/continue_track", async (ctx) => {
  const start = performance.now();
  const sequenceOptions = await continueTrack();
  const end = performance.now();
  console.log(`Continue track endpoint took ${end - start}ms`);
  ctx.response.body = {
    sequenceOptions,
    executionTime: end - start
  };
});

router.get("/api/sign_s3", async (ctx) => {
  const signedUrl = await signS3(MIDI_FILE_NAME);
  ctx.response.body = { signedUrl };

});

const app = new Application();
app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "http://localhost:3000");
  ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 204;
    return;
  }
  await next();
});

app.use(router.routes());
app.use(router.allowedMethods());


app.listen({ port: 8001 });