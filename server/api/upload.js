import { readMultipartFormData } from "#imports";
import { writeFile } from "fs/promises";
import { existsSync } from "fs";
import { join, extname } from "path";
import { randomUUID } from 'crypto';
import { fileTypeFromBuffer } from "file-type";

const allowedExtensions = ["jpg", "jpeg", "png", "pdf", "mp3", "mp4"]; 
// 10MB file limit
const maxFileSize = 10 * 1024 * 1024;

export default defineEventHandler(async (e) => {
  const folderPath = join(process.cwd(), "public", "artifacts");

  //checks that it is able to locate the folder it should upload the file to
  const folderExists = existsSync(folderPath);

  //returns error if unable to locate folder that file should be uploaded to
  if (!folderExists) return { success: false, code: 404, message: "Unable to find directory" }

  //reading the uploaded content
  const body = await readMultipartFormData(e);
  const fileData = body.find((item) => item.filename);

  if (!fileData) return { success: false, code: 400, message: "No uploaded file found" };

  //check if file is right
  if (fileData.data.length > maxFileSize) {
    return { success: false, code: 400, message: "File is too large" };
  }

  //saving original file-name in variable, so it can be returned to client as an identifier
  const initialName = fileData.filename;

  //gettingThe correct extension for the file
  const extension = extname(initialName).toLowerCase().replace(".", "");


  if (!allowedExtensions.includes(extension)) {
    return { success: false, code: 400, message: "Invalid file type" };
  }

    //Verify actual file type using MIME detection
    const detectedType = await fileTypeFromBuffer(fileData.data);
    if (!detectedType || !allowedExtensions.includes(detectedType.ext)) {
      return { success: false, code: 400, message: "File content does not match its extension" };
    }

  //creating new completely unique file-name so no files have the same name by accident
  const newName = `${randomUUID()}${extension}`

  //creating path for the uploaded file with correct, new, unique, file-name.
  const newPath = join(folderPath, newName)

  //uploading file to correct folder
  try {
    await writeFile(newPath, fileData.data);

    //returning success status, id (initial file-name as default) and the source to client
    return { 
      success: true, 
      id: initialName, 
      source: `/artifacts/${newName}` 
    }
  } catch (err) {
    return { success: false, code: 500, message: 'Unable to upload file', error: err.message }
  }
});
