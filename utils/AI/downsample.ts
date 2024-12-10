import { CompactNoteJSON, NoteJSON } from "../../types/Midi.ts";


// A phrase is a group of notes that start around the same time
type CompactPhrase = CompactNoteJSON[];

const PHRASE_WINDOW = 5;
// If the difference in ticks between the start of two notes is less than this threshold, they are considered to be part of the same phrase 
// Whether or not they sound distinct will depend on the bpm but I think this is a good starting point
const TICKS_THRESHOLD = 25

export default function downsample(notes: NoteJSON[]): CompactNoteJSON[] {
    const compactNotes = notes.map(note => createCompactNote(note))
    return compactNotes;
    const phrases = createPhrases(compactNotes)
    const lastNPhrases = phrases.slice(-PHRASE_WINDOW);

    // Potential future optimization:
    // 1. If two phrases are the same, or similar enough, merge them


    // Just flatten it for now, we can change the prompt to accept phrases later if it's helpful
    return lastNPhrases.flat()
}

function createCompactNote(note: NoteJSON): CompactNoteJSON {
    return {
        ticks: note.ticks,
        durationTicks: note.durationTicks,
        name: note.name,
        velocity: note.velocity,
    };
}

// If notes start around the same time, group them into a phrase
function createPhrases(notes: CompactNoteJSON[]): CompactPhrase[] {
    const phrases: CompactNoteJSON[][] = [];
    let currentPhrase: CompactNoteJSON[] = [];
    let currentPhraseStartTicks = notes[0].ticks
    for (const note of notes) {
        if (note.ticks - currentPhraseStartTicks < TICKS_THRESHOLD) {
            currentPhrase.push(note);
        } else {
            phrases.push(currentPhrase);
            currentPhrase = [note];
            currentPhraseStartTicks = note.ticks;
        }
    }

    return phrases
}