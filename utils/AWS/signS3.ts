import { bucketName } from "./client.ts";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./client.ts";

export async function signS3Get(fileName: string): Promise<string> {
    // Define S3 upload parameters
    const params = {
        Bucket: bucketName,
        Key: `${fileName}`, // Specify folder and file name
        ContentType: "audio/midi", // Adjust the MIME type as needed
    };

    // Generate presigned URL with CORS settings
    const command = new GetObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 300, // 300 seconds = 5 minutes
    });
    return signedUrl;
}

export async function signS3Put(fileName: string): Promise<string> {
    const params = {
        Bucket: bucketName,
        Key: `${fileName}`,
        ContentType: "audio/midi",
    };
    const command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    return signedUrl;
}
