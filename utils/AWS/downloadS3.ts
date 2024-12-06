import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, bucketName } from "./client.ts";

export async function downloadS3(fileName: string): Promise<Blob> {
    const downloadParams = {
        Bucket: bucketName,
        Key: fileName,
    };

    const command = new GetObjectCommand(downloadParams);
    const response = await s3Client.send(command);

    if (!response.Body) {
        throw new Error("No data received from S3");
    }

    // Convert the readable stream to a Blob
    const chunks: Uint8Array[] = [];
    for await (const chunk of response.Body.transformToWebStream()) {
        chunks.push(chunk);
    }

    // Concatenate chunks into a single Uint8Array
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const concatenated = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
        concatenated.set(chunk, offset);
        offset += chunk.length;
    }

    // Create and return a Blob from the Uint8Array
    return new Blob([concatenated]);
}

