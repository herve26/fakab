import stream from 'stream';
import { Storage } from '@google-cloud/storage';
import  { type UploadHandler } from '@remix-run/node';

// Upload a file to Cloud Storage

const uploadStreamToCloudStorage = async (name: string, fileName: string, fileStream: AsyncIterable<Uint8Array>) => {
  const bucketName = 'fakab-storage-bucket';

  // Create Cloud Storage client
  const cloudStorage = new Storage();

  // Create a reference to the file.
  const file = cloudStorage.bucket(bucketName).file(name);

  // Create a pass through stream from a string
  const passthroughStream = new stream.PassThrough();
  for await (const chunk of fileStream) {
    passthroughStream.write(chunk);
  }
  passthroughStream.end();

  async function streamFileUpload() {
    passthroughStream.pipe(file.createWriteStream()).on('finish', () => {
      // The file upload is complete
    });

    console.log(`${fileName} uploaded to ${bucketName}`);
  }

  streamFileUpload().catch(console.error);

  await file.makePublic()

  return file.publicUrl();
};

export const cloudStorageUploaderHandler: UploadHandler = async ({
    name,
    filename,
    data,
}) => {
    if (filename) {
        return await uploadStreamToCloudStorage(name, filename, data);
    }

    return null
};