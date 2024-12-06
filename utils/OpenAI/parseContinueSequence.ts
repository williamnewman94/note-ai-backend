import { Track } from "../Midi/loadMidi.ts";


function cleanJSONResponse(response: string): string {
    const pattern = /^```json\s*(.*?)\s*```$/s;
    const cleaned = response.replace(pattern, '$1');
    return cleaned.trim();
}
export default function parseContinueSequence(continuationOptions: string): Track[] {
    try {
        const cleanContinuationOptions = cleanJSONResponse(continuationOptions);
        return JSON.parse(cleanContinuationOptions).continuations;
    } catch (e) {
        console.error("Error parsing continuation options", e);
        return [];
    }
}