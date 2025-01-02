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
