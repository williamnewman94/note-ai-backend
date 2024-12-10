import OpenAI from "openai";
import "jsr:@std/dotenv/load";

export const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });


export async function promptModel(prompt: string, systemPrompt: string, model: string): Promise<string | null> {
    const response = await openai.chat.completions.create({
        model: model,
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 1,
        max_tokens: 1500,
    });

    return response.choices[0].message.content ?? null;
}