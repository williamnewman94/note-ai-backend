import { NoteJSON } from "../../types/Midi.ts";
import Key from "../../types/Key.ts";

function guessKey(midiTrack: NoteJSON[]): Key {
  // Count occurrences of each note
  const noteCount: { [key: string]: number } = {};
  midiTrack.forEach((note) => {
    // Strip octave number to get base note
    const baseNote = note.name.replace(/\d/g, "");
    noteCount[baseNote] = (noteCount[baseNote] || 0) + 1;
  });

  console.log(noteCount);

  // Define notes for each key
  const keyNotes: Record<Key, string[]> = {
    "C major": ["C", "D", "E", "F", "G", "A", "B"],
    "C minor": ["C", "D", "Eb", "F", "G", "Ab", "Bb"],
    "G major": ["G", "A", "B", "C", "D", "E", "F#"],
    "G minor": ["G", "A", "Bb", "C", "D", "Eb", "F"],
    "D major": ["D", "E", "F#", "G", "A", "B", "C#"],
    "D minor": ["D", "E", "F", "G", "A", "Bb", "C"],
    "A major": ["A", "B", "C#", "D", "E", "F#", "G#"],
    "A minor": ["A", "B", "C", "D", "E", "F", "G"],
    "E major": ["E", "F#", "G#", "A", "B", "C#", "D#"],
    "E minor": ["E", "F#", "G", "A", "B", "C", "D"],
    "B major": ["B", "C#", "D#", "E", "F#", "G#", "A#"],
    "B minor": ["B", "C#", "D", "E", "F#", "G", "A"],
    "F# major": ["F#", "G#", "A#", "B", "C#", "D#", "E#"],
    "F# minor": ["F#", "G#", "A", "B", "C#", "D", "E"],
    "C# major": ["C#", "D#", "E#", "F#", "G#", "A#", "B#"],
    "C# minor": ["C#", "D#", "E", "F#", "G#", "A", "B"],
  };

  // Define weights for each note in a key
  const noteWeights: Record<string, number> = {
    tonic: 3,
    dominant: 2,
    mediant: 1,
    subdominant: 1,
    leadingTone: 1,
  };

  // Calculate score for each key
  let bestScore = -1;
  let bestKey: Key = "C major";

  Object.entries(keyNotes).forEach(([key, notes]) => {
    let score = 0;
    const rootNote = notes[0]; // Tonic
    const dominantNote = notes[4]; // Dominant

    Object.entries(noteCount).forEach(([note, count]) => {
      if (notes.includes(note)) {
        if (note === rootNote) {
          score += count * noteWeights.tonic;
        } else if (note === dominantNote) {
          score += count * noteWeights.dominant;
        } else {
          score += count * noteWeights.mediant;
        }
      } else {
        score -= count;
      }
    });

    if (score > bestScore) {
      bestScore = score;
      bestKey = key as Key;
    }
  });

  return bestKey;
}

export default guessKey;
