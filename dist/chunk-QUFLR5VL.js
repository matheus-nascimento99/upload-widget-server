import {
  uploadFileToStorage
} from "./chunk-KK4PF2HP.js";
import {
  db,
  pg
} from "./chunk-X6OYC4AU.js";
import {
  schema
} from "./chunk-P6UISU5A.js";
import {
  makeRight
} from "./chunk-4HTPEPDQ.js";

// src/app/functions/export-uploads.ts
import { stringify } from "csv-stringify";
import { ilike } from "drizzle-orm";
import { PassThrough, Transform } from "stream";
import { pipeline } from "stream/promises";
import { z } from "zod";
var exportUploadsInput = z.object({
  searchQuery: z.string().optional()
});
var exportUploads = async (data) => {
  const { searchQuery } = exportUploadsInput.parse(data);
  const { sql, params } = db.select({
    id: schema.uploads.id,
    name: schema.uploads.name,
    remoteUrl: schema.uploads.remoteUrl,
    createdAt: schema.uploads.createdAt
  }).from(schema.uploads).where(
    searchQuery ? ilike(schema.uploads.name, `%${searchQuery}%`) : void 0
  ).toSQL();
  const cursor = pg.unsafe(sql, params).cursor(2);
  const csv = stringify({
    delimiter: ",",
    header: true,
    columns: [
      { key: "id", header: "ID" },
      { key: "name", header: "Name" },
      { key: "remote_url", header: "URL" },
      { key: "created_at", header: "Uploaded at" }
    ]
  });
  const uploadToStorageStream = new PassThrough();
  const uploadToStoragePipeline = pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(chunks, encoding, callback) {
        for (const chunk of chunks) {
          this.push(chunk);
        }
        callback();
      }
    }),
    csv,
    uploadToStorageStream
  );
  const uploadToStorage = uploadFileToStorage({
    folder: "downloads",
    contentType: "text/csv",
    fileName: `${(/* @__PURE__ */ new Date()).toISOString()}-upload.csv`,
    contentStream: uploadToStorageStream
  });
  const [{ url }] = await Promise.all([
    uploadToStorage,
    uploadToStoragePipeline
  ]);
  return makeRight({ reportUrl: url });
};

export {
  exportUploads
};
