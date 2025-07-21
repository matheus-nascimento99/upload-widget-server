import {
  InvalidFileFormatError
} from "./chunk-CVC2O6UN.js";
import {
  uploadFileToStorage
} from "./chunk-KK4PF2HP.js";
import {
  db
} from "./chunk-X6OYC4AU.js";
import {
  schema
} from "./chunk-P6UISU5A.js";
import {
  makeLeft,
  makeRight
} from "./chunk-4HTPEPDQ.js";

// src/app/functions/upload-image.ts
import { Readable } from "stream";
import { z } from "zod";
var uploadImageInput = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable)
});
var allowedMimeTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
var uploadImage = async (data) => {
  const { fileName, contentType, contentStream } = uploadImageInput.parse(data);
  if (!allowedMimeTypes.includes(contentType)) {
    return makeLeft(new InvalidFileFormatError());
  }
  const { key, url } = await uploadFileToStorage({
    folder: "images",
    fileName,
    contentType,
    contentStream
  });
  await db.insert(schema.uploads).values({
    name: fileName,
    remoteKey: key,
    remoteUrl: url
  });
  return makeRight({ url });
};

export {
  uploadImage
};
