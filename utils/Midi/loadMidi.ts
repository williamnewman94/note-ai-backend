import { parseMidi, type MidiData, type MidiEvent } from "midi-file";
import { downloadS3 } from "../AWS/downloadS3.ts";

export type Track = MidiEvent[]


// load midi into memory

export default async function loadMidiTracks(fileName: string): Promise<Track[]> {
    const midi = await loadMidi(fileName);
    return midi.tracks;
}

async function loadMidi(fileName: string): Promise<MidiData> {
    const midiFile = await downloadS3(fileName);
    const midiFileBuffer = await midiFile.arrayBuffer();
    const midi: MidiData = parseMidi(new Uint8Array(midiFileBuffer));
    return midi
}
