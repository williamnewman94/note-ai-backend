import guessKey from "./guessKey.ts";
import { NoteJSON } from "../../types/Midi.ts";

Deno.test("should return C major for a simple C major scale", () => {
  const midiSequence: NoteJSON[] = [
    {
      time: 0,
      midi: 60,
      name: "C4",
      velocity: 0.8,
      duration: 1,
      ticks: 0,
      durationTicks: 480,
    },
    {
      time: 1,
      midi: 62,
      name: "D4",
      velocity: 0.8,
      duration: 1,
      ticks: 480,
      durationTicks: 480,
    },
    {
      time: 2,
      midi: 64,
      name: "E4",
      velocity: 0.8,
      duration: 1,
      ticks: 960,
      durationTicks: 480,
    },
    {
      time: 3,
      midi: 65,
      name: "F4",
      velocity: 0.8,
      duration: 1,
      ticks: 1440,
      durationTicks: 480,
    },
    {
      time: 4,
      midi: 67,
      name: "G4",
      velocity: 0.8,
      duration: 1,
      ticks: 1920,
      durationTicks: 480,
    },
    {
      time: 5,
      midi: 69,
      name: "A4",
      velocity: 0.8,
      duration: 1,
      ticks: 2400,
      durationTicks: 480,
    },
    {
      time: 6,
      midi: 71,
      name: "B4",
      velocity: 0.8,
      duration: 1,
      ticks: 2880,
      durationTicks: 480,
    },
    {
      time: 7,
      midi: 72,
      name: "C5",
      velocity: 0.8,
      duration: 1,
      ticks: 3360,
      durationTicks: 480,
    },
  ];
  const result = guessKey(midiSequence);
  if (result !== "C major") {
    throw new Error(`Expected "C major", but got "${result}"`);
  }
});

Deno.test("should return G major for a simple G major scale", () => {
  const midiSequence: NoteJSON[] = [
    {
      time: 0,
      midi: 67,
      name: "G4",
      velocity: 0.8,
      duration: 1,
      ticks: 0,
      durationTicks: 480,
    },
    {
      time: 1,
      midi: 69,
      name: "A4",
      velocity: 0.8,
      duration: 1,
      ticks: 480,
      durationTicks: 480,
    },
    {
      time: 2,
      midi: 71,
      name: "B4",
      velocity: 0.8,
      duration: 1,
      ticks: 960,
      durationTicks: 480,
    },
    {
      time: 3,
      midi: 72,
      name: "C5",
      velocity: 0.8,
      duration: 1,
      ticks: 1440,
      durationTicks: 480,
    },
    {
      time: 4,
      midi: 74,
      name: "D5",
      velocity: 0.8,
      duration: 1,
      ticks: 1920,
      durationTicks: 480,
    },
    {
      time: 5,
      midi: 76,
      name: "E5",
      velocity: 0.8,
      duration: 1,
      ticks: 2400,
      durationTicks: 480,
    },
    {
      time: 6,
      midi: 78,
      name: "F#5",
      velocity: 0.8,
      duration: 1,
      ticks: 2880,
      durationTicks: 480,
    },
    {
      time: 7,
      midi: 79,
      name: "G5",
      velocity: 0.8,
      duration: 1,
      ticks: 3360,
      durationTicks: 480,
    },
  ];
  const result = guessKey(midiSequence);
  if (result !== "G major") {
    throw new Error(`Expected "G major", but got "${result}"`);
  }
});

Deno.test("should handle an empty sequence gracefully", () => {
  const midiSequence: NoteJSON[] = [];
  const result = guessKey(midiSequence);
  if (result !== "C major") {
    throw new Error(`Expected "C major", but got "${result}"`);
  }
});

Deno.test("should return null for a sequence with no clear key", () => {
  const midiSequence: NoteJSON[] = [
    {
      time: 0,
      midi: 60,
      name: "C4",
      velocity: 0.8,
      duration: 1,
      ticks: 0,
      durationTicks: 480,
    },
    {
      time: 1,
      midi: 61,
      name: "C#4",
      velocity: 0.8,
      duration: 1,
      ticks: 480,
      durationTicks: 480,
    },
    {
      time: 2,
      midi: 62,
      name: "D4",
      velocity: 0.8,
      duration: 1,
      ticks: 960,
      durationTicks: 480,
    },
    {
      time: 3,
      midi: 63,
      name: "D#4",
      velocity: 0.8,
      duration: 1,
      ticks: 1440,
      durationTicks: 480,
    },
    {
      time: 4,
      midi: 64,
      name: "E4",
      velocity: 0.8,
      duration: 1,
      ticks: 1920,
      durationTicks: 480,
    },
    {
      time: 5,
      midi: 65,
      name: "F4",
      velocity: 0.8,
      duration: 1,
      ticks: 2400,
      durationTicks: 480,
    },
    {
      time: 6,
      midi: 66,
      name: "F#4",
      velocity: 0.8,
      duration: 1,
      ticks: 2880,
      durationTicks: 480,
    },
    {
      time: 7,
      midi: 67,
      name: "G4",
      velocity: 0.8,
      duration: 1,
      ticks: 3360,
      durationTicks: 480,
    },
  ];
  const result = guessKey(midiSequence);
  if (result !== "C major") {
    throw new Error(`Expected "C major", but got "${result}"`);
  }
});

// TODO: How do I distinguish between A minor and C major?
// Right now I just check scale degree occurrences like thte tonic, the dominant, and the subdominant
Deno.test("should return A minor for a simple A minor scale", () => {
  const midiSequence: NoteJSON[] = [
    {
      time: 0,
      midi: 69,
      name: "A4",
      velocity: 0.8,
      duration: 1,
      ticks: 0,
      durationTicks: 480,
    },
    {
      time: 1,
      midi: 71,
      name: "B4",
      velocity: 0.8,
      duration: 1,
      ticks: 480,
      durationTicks: 480,
    },
    {
      time: 2,
      midi: 72,
      name: "C5",
      velocity: 0.8,
      duration: 1,
      ticks: 960,
      durationTicks: 480,
    },
    {
      time: 3,
      midi: 74,
      name: "D5",
      velocity: 0.8,
      duration: 1,
      ticks: 1440,
      durationTicks: 480,
    },
    {
      time: 4,
      midi: 76,
      name: "E5",
      velocity: 0.8,
      duration: 1,
      ticks: 1920,
      durationTicks: 480,
    },
    {
      time: 5,
      midi: 77,
      name: "F5",
      velocity: 0.8,
      duration: 1,
      ticks: 2400,
      durationTicks: 480,
    },
    {
      time: 6,
      midi: 79,
      name: "G5",
      velocity: 0.8,
      duration: 1,
      ticks: 2880,
      durationTicks: 480,
    },
    {
      time: 7,
      midi: 81,
      name: "A5",
      velocity: 0.8,
      duration: 1,
      ticks: 3360,
      durationTicks: 480,
    },
  ];
  const result = guessKey(midiSequence);
  if (result !== "A minor") {
    throw new Error(`Expected "A minor", but got "${result}"`);
  }
});

// Add more tests as needed to cover edge cases and other scenarios
