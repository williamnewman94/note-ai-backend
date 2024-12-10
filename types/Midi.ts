import {type MidiJSON } from "@tonejs/midi";

export type TrackJSON = MidiJSON["tracks"][number]
export type NoteJSON = TrackJSON["notes"][number]

// Remove everything except ticks, duratationTicks, Name,  and velocity
export type CompactNoteJSON = Omit<NoteJSON, "time" | "midi" | "duration">