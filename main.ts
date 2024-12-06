import { Application, Router } from "@oak/oak";
import generateBlocks from "./routes/blocks.ts";
import continueSequence from "./routes/continueSequence.ts";


const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = "Hello world";
});

router.post("/api/blocks", async (ctx) => {
  const blocks = await generateBlocks();
  ctx.response.body = blocks;
});

router.post("/api/continue_sequence", async (ctx) => {
  const sequenceOptions = await continueSequence();
  console.log(sequenceOptions);
  ctx.response.body = sequenceOptions;
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