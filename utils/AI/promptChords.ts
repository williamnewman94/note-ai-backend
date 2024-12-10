import { openai } from "./providers/openAI.ts";

function getPrompt(
    key: string,
    mode: string,
    startingNote: string,
    style: string
): string {
    return `Generate a 4-bar chord progression with the following parameters: Key: ${key}, Mode: ${mode}, Starting Note: ${startingNote}, Style: ${style}`;
}

const MODEL = "gpt-4o-mini";

const RESPONSE_FORMAT = `
    {
        "chords": [
            chord1,
            chord2,
            chord3,
            chord4
        ]
    }
`;

export const CHORD_FORMAT = `
    ["note1", "note2", "note3", ...]
`;

export const CHORD_EXAMPLE = `
    ["C3", "E3", "G3", "B3"]
`;

const SYSTEM_PROMPT = `You are assisting a music producer. Your job is to take the given prompt and generate a response of the format: ${RESPONSE_FORMAT} where each chord is an array of notes lowest to highest: ${CHORD_FORMAT} i.e. ${CHORD_EXAMPLE}. Please do not include any other text in your response.`;

export default async function promptChords(
    key: string,
    mode: string,
    startingNote: string,
    style: string
): Promise<string | null> {
    const prompt = getPrompt(key, mode, startingNote, style);
    const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt },
        ],
        temperature: 1,
        max_tokens: 100,
    });

    const response = completion.choices[0].message.content ?? null;
    return response;
}
