import stream from 'stream';
import { Storage } from '@google-cloud/storage';
import  { type UploadHandler } from '@remix-run/node';

// Upload a file to Cloud Storage

type UploadStorageType = {
  filename: string, 
  fileStream: AsyncIterable<Uint8Array>,
  makePublic?: boolean
}

export const uploadStreamToCloudStorage = async ({filename, fileStream, makePublic=false}: UploadStorageType) => {
  const bucketName = process.env["GOOGLE_CLOUD_BUCKET"]

  if(!bucketName) throw new Error("Bucket Name is Required")

  // Create Cloud Storage client
  const cloudStorage = new Storage();

  // Create a reference to the file.
  const file = cloudStorage.bucket(bucketName).file(filename);

  // Create a pass through stream from a string
  const passthroughStream = new stream.PassThrough();
  for await (const chunk of fileStream) {
    passthroughStream.write(chunk);
  }
  passthroughStream.end();

  async function streamFileUpload() {
    passthroughStream.pipe(file.createWriteStream()).on('finish', async () => {
      if(makePublic){
        await file.makePublic()
      }
    });

    console.log(`${filename} uploaded to ${bucketName}`);
  }

  await streamFileUpload().catch(console.error);

  return makePublic ? file.publicUrl() : filename
};

export const cloudStorageUploaderHandler: UploadHandler = async ({
    name,
    filename,
    data,
}) => {
    if (filename) {
        return await uploadStreamToCloudStorage({filename, fileStream: data});
    }

    return null
};