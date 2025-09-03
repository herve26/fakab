import { writeAsync } from "fs-jetpack";
import fs from "fs";

/**
 * Saves a file to the local file system.
 * @param file The file to save.
 * @param destination The destination path.
 */
export const saveFile = async (file: File, destination: string) => {
	const buffer = Buffer.from(await file.arrayBuffer());
	await writeAsync(destination, buffer);
};

/**
 * Reads a file from the local file system.
 * @param filePath The path to the file.
 * @returns A Buffer containing the file data.
 */
export const readFile = async (filePath: string): Promise<Buffer> => {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};
