import { ChordEvent } from "./promptRhythm.ts";

export default function parseRhythm(response: string): ChordEvent[]{
    try {
        return JSON.parse(response).rhythm;
    } catch (error) {
        console.error(error);
        console.log(response);
        throw error;
    }
}
