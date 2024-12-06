import loadMidiTracks, { Track } from "../utils/Midi/loadMidi.ts";
import promptContinueSequence from "../utils/OpenAI/promptContinueSequence.ts";
import parseContinueSequence from "../utils/OpenAI/parseContinueSequence.ts";
        
export default async function continueSequence(): Promise<Track[]> {
    // load current midi into memory
    const midiTracks = await loadMidiTracks("midi.mid");
    // prompt openai for continuation options
    const continuationOptions = await promptContinueSequence(midiTracks);

    if (!continuationOptions) {
        console.error("No continuation options found");
        return [];
    }
    // return continuation options
    return parseContinueSequence(continuationOptions);
}
