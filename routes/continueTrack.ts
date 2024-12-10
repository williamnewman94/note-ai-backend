import loadMidiTracks from "../utils/Midi/loadMidi.ts";
import promptContinueTrack from "../utils/AI/promptContinueTrack.ts";
import parseContinueTrack from "../utils/AI/parseContinueTrack.ts";
import { NoteJSON } from "../types/Midi.ts";
import MIDI_FILE_NAME from "../utils/midiFile.ts";
        
export default async function continueTrack(): Promise<NoteJSON[][]> {
    // load current midi into memory
    const midiTracks = await loadMidiTracks(MIDI_FILE_NAME);

    // prompt openai for continuation options
    const start2 = performance.now();
    const continuationOptions = await promptContinueTrack(midiTracks, "C major");
    const end2 = performance.now();
    console.log(`Prompt continue track took ${end2 - start2}ms`);

    if (!continuationOptions) {
        console.error("No continuation options found");
        return [];
    }
    // return continuation options
    const start3 = performance.now();
    const continuation = parseContinueTrack(continuationOptions);
    const end3 = performance.now();
    console.log(`Parse continuation took ${end3 - start3}ms`);
    return continuation;
}

