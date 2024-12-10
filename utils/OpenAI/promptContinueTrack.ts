import { CompactNoteJSON, NoteJSON } from "../../types/Midi.ts";
import downsample from "./downsample.ts";
import { openai } from "./openAI.ts";

function notesToString(notes: CompactNoteJSON[]): string {
    return notes.map(note => JSON.stringify(note)).join(", ");
}

type Key = "C major" | "C minor" | "G major" | "G minor" | "D major" | "D minor" | "A major" | "A minor" | "E major" | "E minor" | "B major" | "B minor" | "F# major" | "F# minor" | "C# major" | "C# minor"

function getPrompt(notes: NoteJSON[], key: Key): string {
    // const compactNotes = downsample(notes)
    const compactNotes = notes
    return `Continue the following sequence of notes: ${notesToString(compactNotes)} in the key of ${key}`;
}

const NOTE_FORMAT = `
export interface NoteJSON {
    // Note name (e.g. "C4", "F#3")
    name: string;
    // Normalized velocity (0-1)
    velocity: number;
    // Start time in MIDI ticks
    ticks: number;
    // Duration in MIDI ticks
    durationTicks: number;
    // Duration in seconds
    durationSeconds: number;
}
`

const NOTE_SEQUENCE_FORMAT = `
    [
      {
        "name": "C4",
        "velocity": 0.75,
        "ticks": 0,
        "durationTicks": 240
      },
      {
        "name": "E4", 
        "velocity": 0.75,
        "ticks": 240,
        "durationTicks": 240
      },
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

const N_DIFFERENT_CONTINUATIONS = 5;

const SYSTEM_PROMPT = `You are assisting a music producer in composing a song.
Here are some guidelines:

1. You will be given a array of note events that look like this: ${NOTE_SEQUENCE_FORMAT} where element is defined as ${NOTE_FORMAT}.

2. You will then be asked to generate a continuation of the sequence of note events. The continuations should be musically similar and sound good when played after the original sequence.

3. You will be given a complete musical phrase. This means that it sounds coherent as a standalone piece. 

4. Always generate between 5 and 10 full note events.

5. If the input contains chords (notes that have the same ticks value), then feel free to include chords in the continuation.

6. Make sure the outputted notes belong to the same key as the key specified in the user prompt.

7. Generate ${N_DIFFERENT_CONTINUATIONS} different continuations and return them in the following format: ${RESPONSE_FORMAT}.
`;

const MODEL = "gpt-4o-mini";


export default async function promptContinueTrack(
    tracks: NoteJSON[],
    key: Key
): Promise<string | null> {
    const prompt = getPrompt(tracks, key);


    const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 1,
        max_tokens: 1500,
    });

    const response = completion.choices[0].message.content ?? null;
    return response;
}

