import MidiWriter from "midi-writer-js";

import getRandomKey, { SongKey } from "../utils/parameters/getRandomKey.ts";
import getRandomMode, { SongMode } from "../utils/parameters/getRandomMode.ts";
import getRandomStartingNote, {
    SongNote,
} from "../utils/parameters/getRandomStartingNote.ts";
import getRandomStyle, { Style } from "../utils/parameters/getRandomStyle.ts";
import promptChords from "../utils/OpenAI/promptChords.ts";
import { uploadS3 } from "../utils/AWS/uploadS3.ts";
import createMidiTrack from "../utils/Midi/loadMidi.ts";
import { signS3 } from "../utils/AWS/signS3.ts";
import { getRandomNoteValue } from "../utils/parameters/getRandomNoteValue.ts";
import promptRhythm from "../utils/OpenAI/promptRhythm.ts";
import parseRhythm from "../utils/OpenAI/parseRhythm.ts";
import parseChords from "../utils/OpenAI/parseChords.ts";
import MIDI_FILE_NAME from "../utils/midiFile.ts";

const BARS = 4;

export type Section = {
    key: SongKey;
    mode: SongMode;
    startingNote: SongNote;
    style: Style;
    chords: string[][];
    signedUrl: string;
};

async function _generateBlocks() {
    const key = getRandomKey();
    const mode = getRandomMode();
    const startingNote = getRandomStartingNote();
    const style = getRandomStyle();

    const chordsResponse = await promptChords(key, mode, startingNote, style);
    if (!chordsResponse) {
        return null;
    }

    const chords = parseChords(chordsResponse);

    const noteValue = getRandomNoteValue();
    const rhythmResponse = await promptRhythm("4", style, chords, BARS);

    console.log(rhythmResponse);
    if (!rhythmResponse) {
        return null;
    }
    const chordEvents = parseRhythm(rhythmResponse);


    const midi = createMidiTrack(chordEvents);
    const writer = new MidiWriter.Writer(midi);
    await uploadS3(writer.buildFile(), MIDI_FILE_NAME);
    const signedUrl = await signS3(MIDI_FILE_NAME);

    return { key, mode, startingNote, style, chords, signedUrl };
}

export default async function generateBlocks() {
    const progression = await _generateBlocks();
    return progression;
}