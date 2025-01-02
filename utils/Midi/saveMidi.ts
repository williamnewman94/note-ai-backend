import { NoteJSON } from "../../types/Midi.ts";
import { signS3Put } from "../AWS/signS3.ts";
import Midi from "@tonejs/midi";
import MIDI_FILE_NAME from "../midiFile.ts";

function createMidiFile(notes: NoteJSON[]): Blob {
  // Create a new Midi file
  const midi = new Midi.Midi();

  // Add a track
  const track = midi.addTrack();

  // Add notes to the track
  notes.forEach((note) => {
    // Validate note data before adding
    if (
      !note.name ||
      typeof note.velocity !== "number" ||
      typeof note.durationTicks !== "number" ||
      typeof note.ticks !== "number"
    ) {
      console.warn("Invalid note data:", note);
      return; // Skip invalid notes
    }
    console.log("ADDING NOTE", note);

    track.addNote({
      name: note.name,
      velocity: note.velocity,
      durationTicks: note.durationTicks,
      ticks: note.ticks,
    });
  });

  // Convert to blob
  return new Blob([midi.toArray()], { type: "audio/midi" });
}

export default async function saveMidi(notes: NoteJSON[]): Promise<boolean> {
  const signedUrl = await signS3Put(MIDI_FILE_NAME);
  const midiFileBlob = createMidiFile(notes);
  const response = await fetch(signedUrl, {
    method: "PUT",
    body: midiFileBlob,
  });
  return response.ok;
}
