import { Storage } from '@google-cloud/storage';

const storage = new Storage();

export async function downloadIntoMemory({fileName}: {fileName: string | null}) {
    const bucketName = process.env["GOOGLE_CLOUD_BUCKET"]
    if(!bucketName) throw new Error("Bucket Name is Required")
    if(!fileName) throw new Error("Filename is Required")
    // Downloads the file into a buffer in memory.
    return (await storage.bucket(bucketName).file(fileName).download())[0];
}
