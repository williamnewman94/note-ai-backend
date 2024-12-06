import { Track } from "../Midi/loadMidi.ts";
import { openai } from "./openAI.ts";

function tracksToString(tracks: Track[]): string {
    return tracks.map(track => track.map(event => JSON.stringify(event)).join(", ")).join("\n");
}

function getPrompt(tracks: Track[]): string {
    return `Continue the following sequence: ${tracksToString(tracks)}`;
}

const NOTE_FORMAT = `
    A JSON object with the following properties:
    - deltaTime: number (time since last note in ticks, 0 means played simultaneously)
    - channel: number (MIDI channel, usually 0-15)
    - type: "noteOn" | "noteOff" (whether note is being pressed or released)
    - noteNumber: number (MIDI note number from 0-127, where 60 is middle C)
    - velocity: number (how hard the note is played, 0-127)
`

const NOTE_SEQUENCE_FORMAT = `
    [
      {
        deltaTime: 0,
        channel: 0,
        type: "noteOn",
        noteNumber: 40,
        velocity: 127
      },
      {
        deltaTime: 0,
        channel: 0,
        type: "noteOn",
        noteNumber: 43,
        velocity: 127
      },
      {
        deltaTime: 0,
        channel: 0,
        type: "noteOn",
        noteNumber: 47,
        velocity: 127
      },
      ...
    ]
`

const RESPONSE_FORMAT = `
    {
        "continuations": [
            noteEvent1,
            noteEvent2,
            noteEvent3,
            ...
        ]
    }
`

const SYSTEM_PROMPT = `You are assisting a music producer.

You will be given a array of note events that look like this: ${NOTE_SEQUENCE_FORMAT} where element is defined as ${NOTE_FORMAT}.

You will then be asked to generate a continuation of the sequence of note events. The continuations should be musically similar and sound good when played after the original sequence.

On and off events should be paired. A pair of note on and off is called a full note event

Always generate between 1 and 5 full note events.

Try to stay in the same key as the original sequence.

Generate 5 different continuations and return them in the following format: ${RESPONSE_FORMAT}.

Do not include any other text in your response. Is should only be the JSON object with ABSOLUTELY NO OTHER CHARACTERS
`;

const MODEL = "gpt-4o";

export default async function promptContinueSequence(
    tracks: Track[]
): Promise<string | null> {
    const prompt = getPrompt(tracks);

    const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt },
        ],
        temperature: 1,
        max_tokens: 1000,
    });

    const response = completion.choices[0].message.content ?? null;
    return response;
}

