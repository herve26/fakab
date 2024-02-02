import stream from 'stream';
import { Storage } from '@google-cloud/storage';
import  { type UploadHandler } from '@remix-run/node';

// Upload a file to Cloud Storage

// type UploadStorageType = {
//   filename: string, 
//   fileStream: AsyncIterable<Uint8Array>,
//   makePublic?: boolean
// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const uploadStreamToCloudStorage: UploadHandler = async ({name,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  contentType,
  filename,
  data}) => {
  const bucketName = process.env["GOOGLE_CLOUD_BUCKET"]

  if(!bucketName) throw new Error("Bucket Name is Required")
  if(!filename) throw new Error("Filename is mandatory")

  // Create Cloud Storage client
  const cloudStorage = new Storage();

  // Create a reference to the file.
  const file = cloudStorage.bucket(bucketName).file(filename);

  // Create a pass through stream from a string
  const passthroughStream = new stream.PassThrough();
  for await (const chunk of data) {
    passthroughStream.write(chunk);
  }
  passthroughStream.end();

  async function streamFileUpload() {
    passthroughStream.pipe(file.createWriteStream()).on('finish', async () => {
      await file.makePublic()
    });

    console.log(`${filename} uploaded to ${bucketName}`);
  }

  await streamFileUpload().catch(console.error);

  return file.publicUrl()
};

// export const cloudStorageUploaderHandler: UploadHandler = async ({
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     name,
//     filename,
//     data,
// }) => {

//   if(!regex.test(name) || !filename) return undefined;

//   // return await uploadStreamToCloudStorage({name, filename, data});
// };

// export const uploadToStorage = async ({filename, fileStream, makePublic=false}: UploadStorageType) => {
//   const env = process.env["NODE_ENV"]

//   if(env === "production"){
//     return await uploadStreamToCloudStorage({filename, fileStream, makePublic})
//   } else {
//     const directory = path.join(__dirname, "..", "..", "public", "resources");
//     return unstable_createFileUploadHandler({
//       directory
//     })
//   }
// }