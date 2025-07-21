import {
  uploadImage
} from "../../chunk-MBLSECLK.js";
import {
  InvalidFileFormatError
} from "../../chunk-CVC2O6UN.js";
import "../../chunk-KK4PF2HP.js";
import "../../chunk-YOWT7VWM.js";
import {
  db
} from "../../chunk-X6OYC4AU.js";
import {
  schema
} from "../../chunk-P6UISU5A.js";
import "../../chunk-ITVFV47Y.js";
import "../../chunk-2UR5CODH.js";
import {
  isLeft,
  isRight,
  unwrapEither
} from "../../chunk-4HTPEPDQ.js";
import "../../chunk-MLKGABMK.js";

// src/app/functions/upload-image.spec.ts
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { Readable } from "stream";
import { beforeAll, describe, expect, it, vi } from "vitest";
describe("Upload image", () => {
  beforeAll(() => {
    vi.mock("@/infra/storage/upload-file-to-storage", () => {
      return {
        uploadFileToStorage: vi.fn().mockImplementation(() => {
          return {
            key: `${randomUUID()}.jpg`,
            url: "https://storage.com/image.jpg"
          };
        })
      };
    });
  });
  it("should be able to upload an image", async () => {
    const fileName = `${randomUUID()}.jpg`;
    const sut = await uploadImage({
      fileName,
      contentType: "image/jpg",
      contentStream: Readable.from([])
    });
    expect(isRight(sut)).toBe(true);
    const result = await db.select().from(schema.uploads).where(eq(schema.uploads.name, fileName));
    expect(result).toHaveLength(1);
  });
  it("should not be able to upload an image with invalid type", async () => {
    const fileName = `${randomUUID()}.jpg`;
    const sut = await uploadImage({
      fileName,
      contentType: "document/pdf",
      contentStream: Readable.from([])
    });
    expect(isLeft(sut)).toBe(true);
    expect(unwrapEither(sut)).toBeInstanceOf(InvalidFileFormatError);
  });
});
