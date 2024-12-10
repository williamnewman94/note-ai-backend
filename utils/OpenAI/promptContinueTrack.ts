import { NoteJSON } from "../../types/Midi.ts";
import { openai } from "./openAI.ts";

function notesToString(notes: NoteJSON[]): string {
    return notes.map(note => JSON.stringify(note)).join(", ");
}

function getPrompt(notes: NoteJSON[]): string {
    return `Continue the following sequence: ${notesToString(notes)}`;
}

const NOTE_FORMAT = `
export interface NoteJSON {
    // Time in seconds when the note starts
    time: number;
    // MIDI note number (0-127)
    midi: number; 
    // Note name (e.g. "C4", "F#3")
    name: string;
    // Normalized velocity (0-1)
    velocity: number;
    // Duration of note in seconds
    duration: number;
    // Start time in MIDI ticks
    ticks: number;
    // Duration in MIDI ticks
    durationTicks: number;
}
`

const NOTE_SEQUENCE_FORMAT = `
    [
      {
        "time": 0,
        "midi": 60,
        "name": "C4",
        "velocity": 0.75,
        "duration": 0.5,
        "ticks": 0,
        "durationTicks": 240
      },
      {
        "time": 0.5,
        "midi": 64,
        "name": "E4", 
        "velocity": 0.75,
        "duration": 0.5,
        "ticks": 240,
        "durationTicks": 240
      },
      {
        "time": 1.0,
        "midi": 67,
        "name": "G4",
        "velocity": 0.75,
        "duration": 1.0,
        "ticks": 480,
        "durationTicks": 480
      }
      ...
    ]
`

const RESPONSE_FORMAT = `
    {
        "continuations": [
            [
                note1,
                note2,
                note3,
                ...
            ],
        ]
    }
`

const SYSTEM_PROMPT = `You are assisting a music producer.

You will be given a array of note events that look like this: ${NOTE_SEQUENCE_FORMAT} where element is defined as ${NOTE_FORMAT}.

You will then be asked to generate a continuation of the sequence of note events. The continuations should be musically similar and sound good when played after the original sequence.

On and off events should be paired. A pair of note on and off is called a full note event

Always generate between 10 to 15 full note events.

Try to stay in the same key as the original sequence.

Generate 1 different continuation and return them in the following format: ${RESPONSE_FORMAT}.

Do not include any other text in your response. Is should only be the JSON object with ABSOLUTELY NO OTHER CHARACTERS
`;

const MODEL = "gpt-4o-mini";

export default async function promptContinueTrack(
    tracks: NoteJSON[]
): Promise<string | null> {
    const prompt = getPrompt(tracks);

    const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt },
        ],
        temperature: 1,
        max_tokens: 5000,
    });

    const response = completion.choices[0].message.content ?? null;
    return response;
}

