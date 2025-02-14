import { NoteJSON } from "../../types/Midi.ts";

function cleanJSONResponse(response: string): string {
    const pattern = /^```json\s*(.*?)\s*```$/s;
    const cleaned = response.replace(pattern, '$1');
    return cleaned.trim();
}
export default function parseContinueTrack(continuationOptions: string[]): NoteJSON[][] {
    const continuations = continuationOptions.map(continuationOption => {
        try {
            const cleanContinuationOptions = cleanJSONResponse(continuationOption);
            return JSON.parse(cleanContinuationOptions).continuation;
        } catch (e) {
            console.error("Error parsing continuation options", e);
            console.error(continuationOptions);
            return [];
        }
    });

    return continuations
}


