import {
  r2
} from "./chunk-YOWT7VWM.js";
import {
  env
} from "./chunk-2UR5CODH.js";
import {
  __export
} from "./chunk-MLKGABMK.js";

// src/infra/storage/upload-file-to-storage.ts
var upload_file_to_storage_exports = {};
__export(upload_file_to_storage_exports, {
  uploadFileToStorage: () => uploadFileToStorage
});
import { Upload } from "@aws-sdk/lib-storage";
import { randomUUID } from "crypto";
import { basename, extname } from "path";
import { Readable } from "stream";
import { z } from "zod";
var uploadFileToStorageInput = z.object({
  folder: z.enum(["images", "downloads"]),
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable)
});
var uploadFileToStorage = async (input) => {
  const { folder, fileName, contentType, contentStream } = uploadFileToStorageInput.parse(input);
  const fileNameExtension = extname(fileName);
  const fileNameWithoutExtension = basename(fileName, fileNameExtension);
  const sanitizedFileName = fileNameWithoutExtension.replace(
    /[^a-zA-Z0-9]/g,
    ""
  );
  const sanitizedFileNameWithExtension = sanitizedFileName.concat(fileNameExtension);
  const uniqueFileName = `${folder}/${randomUUID()}-${sanitizedFileNameWithExtension}`;
  const upload = new Upload({
    client: r2,
    params: {
      Key: uniqueFileName,
      Bucket: env.CLOUDFLARE_BUCKET,
      Body: contentStream,
      ContentType: contentType
    }
  });
  await upload.done();
  return {
    key: uniqueFileName,
    url: `${env.CLOUDFLARE_PUBLIC_URL}/${uniqueFileName}`
  };
};

export {
  uploadFileToStorage,
  upload_file_to_storage_exports
};
