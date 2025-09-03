import { Storage } from '@google-cloud/storage';

const storage = new Storage();

/**
 * Downloads a file from Google Cloud Storage into memory.
 *
 * @param {object} params - The parameters for the function.
 * @param {string | null} params.fileName - The name of the file to download.
 * @returns {Promise<Buffer>} A promise that resolves with the file's contents as a Buffer.
 * @throws {Error} If the bucket name or file name is not provided.
 */
export async function downloadIntoMemory({fileName}: {fileName: string | null}) {
    const bucketName = process.env["GOOGLE_CLOUD_BUCKET"]
    if(!bucketName) throw new Error("Bucket Name is Required")
    if(!fileName) throw new Error("Filename is Required")
    // Downloads the file into a buffer in memory.
    return (await storage.bucket(bucketName).file(fileName).download())[0];
}
