import OpenAI from "openai";
import "jsr:@std/dotenv/load";

export const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });
