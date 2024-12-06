import { openai } from "./openAI.ts";
import { Style } from "../parameters/getRandomStyle.ts";
import { NoteValue } from "../parameters/getRandomNoteValue.ts";
import { CHORD_EXAMPLE } from "./promptChords.ts";
import { CHORD_FORMAT } from "./promptChords.ts";

// Velocity Option
// 1-127 -> note with corresponding velocity
// - -> sustain note
// 0 -> rest

// Note Value (1/16 note, 1/32/ note etc.)

export type ChordEvent = {
    chord: string[] | null;
    velocity: number | null;
    duration: NoteValue[];
}

function getPrompt(noteValue: NoteValue, style: Style, chords: string[][], bars: number): string {
    return `Generate a ${bars}-bar rhythm with the following parameters: Note Value: ${noteValue}, Style: ${style}, Chords: ${chords}`;
}

const MODEL = "gpt-4o-mini";

const RHYTHM_FORMAT = `
    [
        {
            "chord": [chordNotes],     // Array of notes, or null for a rest. You may use the whole chord, a single note, or a combination of notes. Or you may invert the chord.
            "velocity": 1-127,         // Note velocity (N/A if rest)
            "duration": [noteValues]   // Array of note values for timing
        },
        // ... more midi events
    ]
`;

const RESPONSE_FORMAT = `
    {
        "rhythm": ${RHYTHM_FORMAT}
    }
`;


const SYSTEM_PROMPT = `You are assisting a music producer.

You will be given a list of chords where each chord looks like this: ${CHORD_FORMAT} i.e. ${CHORD_EXAMPLE}.

You will also be given a note value which is a string representing the duration of a note.
"1" = whole note
"2" = half note
"d2" = dotted half note
"dd2" = double dotted half note
"4" = quarter note
"4t" = quarter triplet
"d4" = dotted quarter note
"dd4" = double dotted quarter note
"8" = eighth note
"8t" = eighth triplet note
"d8" = dotted eighth note
"dd8" = double dotted eighth note
"16" = sixteenth note
"16t" = sixteenth triplet note
"32" = thirty-second note
"64" = sixty-fourth note

The total of all of the duration properties of the events should add up to the number of bars you are generating for.

You will also be given a style which is a string representing the style of music for which the generated rhythm should sound like.

Your job is to generate a musically interesting rhythmic pattern using the given chords and should add up the specified number of bars (i.e.16 quarter notes for 4 bars)

Add some rests to the rhythm to make it more interesting.

Also feel free to add some additional notes to the rhythm that are not in the chords if you think it will sound good.

Output should be in this format: ${RESPONSE_FORMAT}  with no additional characters.
`

const SYSTEM_PROMPT_2 = `You are assisting a music producer.

You will be given a list of chords where each chord looks like this: ${CHORD_FORMAT} i.e. ${CHORD_EXAMPLE}.

The chords themselves should be pretty straight-forward but please add a melodic topline on top of the them.

Your job is to generate a rhythmic pattern using the given format: ${RHYTHM_FORMAT}. Output should be in this format: ${RESPONSE_FORMAT} with no additional characters.
`

export default async function promptRhythm(
    noteValue: NoteValue,
    style: Style,
    chords: string[][],
    bars: number
): Promise<string | null> {
    const prompt = getPrompt(noteValue, style, chords, bars);
    const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: [
            { role: "system", content: SYSTEM_PROMPT_2 },
            { role: "user", content: prompt },
        ],
        temperature: 1,
        max_tokens: 1000,
    });

    const response = completion.choices[0].message.content ?? null;

    return response;
}
