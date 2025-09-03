import stream from 'stream';
import { Storage } from '@google-cloud/storage';
import  { type UploadHandler } from '@remix-run/node';

// Upload a file to Cloud Storage

// type UploadStorageType = {
//   filename: string, 
//   fileStream: AsyncIterable<Uint8Array>,
//   makePublic?: boolean
// }

/**
 * An upload handler that streams a file to Google Cloud Storage.
 *
 * @param {object} params - The parameters for the upload handler.
 * @param {string} params.name - The name of the form field.
 * @param {string} params.contentType - The content type of the file.
 * @param {string} params.filename - The name of the file.
 * @param {AsyncIterable<Uint8Array>} params.data - The file data as an async iterable.
 * @returns {Promise<string>} A promise that resolves with the public URL of the uploaded file.
 * @throws {Error} If the bucket name or filename is not provided.
 */
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

  // const exist = await file.exists()

  // TODO: Implement collision resistance
  // if(exist){
  //   file = cloudStorage.bucket(bucketName).file()
  // }

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