import { Storage } from '@google-cloud/storage';

const storage = new Storage();

export async function downloadIntoMemory({fileName}: {fileName: string}) {
    const bucketName = 'fakab-storage-bucket'
    // Downloads the file into a buffer in memory.
    return (await storage.bucket(bucketName).file(fileName).download())[0];
}
