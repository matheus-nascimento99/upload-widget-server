import {
  db
} from "./chunk-X6OYC4AU.js";
import {
  schema
} from "./chunk-P6UISU5A.js";

// src/test/factories/make-upload.ts
import { fakerPT_BR as faker } from "@faker-js/faker";
var makeUpload = async (overrides) => {
  const fileName = faker.system.fileName();
  const result = await db.insert(schema.uploads).values({
    name: fileName,
    remoteKey: `images/${fileName}`,
    remoteUrl: `https://storage.com/images/${fileName}`,
    ...overrides
  }).returning();
  return result[0];
};

export {
  makeUpload
};
