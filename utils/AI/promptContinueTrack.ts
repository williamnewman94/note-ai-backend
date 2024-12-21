import { CompactNoteJSON, NoteJSON } from "../../types/Midi.ts";
import parallelNRequests from "../parallelNRequests.ts";
import downsample from "./downsample.ts";
import { promptModel } from "./providers/openAI.ts";

function notesToString(notes: CompactNoteJSON[]): string {
  return notes.map((note) => JSON.stringify(note)).join(", ");
}

//       [
//       ["C4", 0.75, 0, 240],
//       ["E4", 0.75, 240, 240],
//       ...
//       ] -> string
function notesToStringArray(notes: (string | number)[][]): string {
  return `[${notes.map((note) => `[${note.join(", ")}]`).join(", ")}]`;
}

function getPromptText(notes: NoteJSON[], key: Key): string {
  const compactNotes = downsample(notes);
  return `Continue the following sequence of notes: ${notesToString(
    compactNotes
  )} in the key of ${key}`;
}

function getPromptTextArray(notes: NoteJSON[], key: Key): string {
  const compactNotes = downsample(notes);
  const arrayNotes = compactNotes.map((note) => [
    note.name,
    note.velocity,
    note.ticks,
    note.durationTicks,
  ]);
  return `Continue the following sequence of notes: ${notesToStringArray(
    arrayNotes
  )} in the key of ${key}`;
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
}
`;

const NOTE_FORMAT_ARRAY = `
[
    // Note name (e.g. "C4", "F#3")
    string,
    // Normalized velocity (0-1)
    number,
    // Start time in MIDI ticks
    number,
    // Duration in MIDI ticks
    number
]
`;

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
`;

const NOTE_SEQUENCE_FORMAT_ARRAY = `
    [
      ["C4", 0.75, 0, 240],
      ["E4", 0.75, 240, 240],
      ...
    ]
`;

const RESPONSE_FORMAT = `
    {
        "continuation": [
                note1,
                note2,
                note3,
                ...
        ]
    }
`;

const NUM_DIFFERENT_CONTINUATIONS = 5;

const SYSTEM_PROMPT = `You are assisting a music producer in composing a song.
Here are some guidelines:

1. You will be given a array of note events that look like this: ${NOTE_SEQUENCE_FORMAT_ARRAY} where element is defined as ${NOTE_FORMAT_ARRAY}.

2. You will then be asked to generate a continuation of the sequence of note events. The continuations should be musically similar and sound good when played after the original sequence.

3. You will be given a complete musical phrase. This means that it sounds coherent as a standalone piece. 

4. Always generate between 5 and 10 full note events.

5. If the input contains chords (notes that have the same ticks value), then feel free to include chords in the continuation.

6. Make sure the outputted notes belong to the same key as the key specified in the user prompt.

7. Return the continuation in the following format: ${RESPONSE_FORMAT} where each note is defined as ${NOTE_FORMAT_ARRAY}.

8. Do not include any other text in your response aside from the JSON.
`;

const MODEL = "gpt-4o";

function mapArrayToJSON(array: (string | number)[][]): CompactNoteJSON[] {
  return array.map((note) => ({
    name: note[0] as string,
    velocity: note[1] as number,
    ticks: note[2] as number,
    durationTicks: note[3] as number,
  }));
}

// Convert back to NoteJSON in string format as the caller expects so I can test this before committing.
function fudgeArray(response: string): string {
  try {
    const cleaned = response.replace(/```json/g, "").replace(/```/g, "");
    const json = JSON.parse(cleaned);
    const array = json.continuation;
    const noteJSON = mapArrayToJSON(array);
    return `\`\`\`json{"continuation": [${notesToString(noteJSON)}]}\`\`\``;
  } catch (e) {
    console.log(e, response);
    throw e;
  }
}

export default async function promptContinueTrack(
  tracks: NoteJSON[],
  key: Key
): Promise<string[]> {
  const promptText = getPromptTextArray(tracks, key);

  const continuations = await parallelNRequests(
    () => promptModel(promptText, SYSTEM_PROMPT, MODEL),
    NUM_DIFFERENT_CONTINUATIONS
  );

  return continuations
    .filter((continuation) => continuation !== null)
    .map(fudgeArray);
}
