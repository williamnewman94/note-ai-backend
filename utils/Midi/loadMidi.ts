import Midi, { type MidiJSON } from "@tonejs/midi";
import { signS3 } from "../AWS/signS3.ts";
import { NoteJSON } from "../../types/Midi.ts";


export default async function loadMidiTracks(fileName: string): Promise<NoteJSON[]> {
    const midi = await loadMidi(fileName);
    // TODO: Handle multiple tracks
    return midi.tracks[0].notes;
}

async function loadMidi(fileName: string): Promise<MidiJSON> {
    // Is there a simpler way to leverage the .fromUrl() method?
    const signedMidiUrl = await signS3(fileName);
    const midi = await Midi.Midi.fromUrl(signedMidiUrl);
    return midi.toJSON();
}
