import {
  makeUpload
} from "../../chunk-PEN2CBHW.js";
import {
  getUploads
} from "../../chunk-RZOCELVN.js";
import "../../chunk-X6OYC4AU.js";
import "../../chunk-P6UISU5A.js";
import "../../chunk-ITVFV47Y.js";
import "../../chunk-2UR5CODH.js";
import {
  isRight,
  unwrapEither
} from "../../chunk-4HTPEPDQ.js";
import "../../chunk-MLKGABMK.js";

// src/app/functions/get-uploads.spec.ts
import { subDays } from "date-fns";
import { randomUUID } from "crypto";
import { describe, expect, it } from "vitest";
describe("Get uploads", () => {
  it("should be able get uploads", async () => {
    const namePattern = randomUUID();
    const upload1 = await makeUpload({ name: `${namePattern}.webp` });
    const upload2 = await makeUpload({ name: `${namePattern}.webp` });
    const upload3 = await makeUpload({ name: `${namePattern}.webp` });
    const upload4 = await makeUpload({ name: `${namePattern}.webp` });
    const upload5 = await makeUpload({ name: `${namePattern}.webp` });
    const sut = await getUploads({ searchQuery: namePattern });
    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).total).toEqual(5);
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id })
    ]);
  });
  it("should be able get paginated uploads", async () => {
    const namePattern = randomUUID();
    const upload1 = await makeUpload({ name: `${namePattern}.webp` });
    const upload2 = await makeUpload({ name: `${namePattern}.webp` });
    const upload3 = await makeUpload({ name: `${namePattern}.webp` });
    const upload4 = await makeUpload({ name: `${namePattern}.webp` });
    const upload5 = await makeUpload({ name: `${namePattern}.webp` });
    let sut = await getUploads({
      searchQuery: namePattern,
      page: 1,
      pageSize: 3
    });
    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).total).toEqual(5);
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id })
    ]);
    sut = await getUploads({ searchQuery: namePattern, page: 2, pageSize: 3 });
    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).total).toEqual(5);
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id })
    ]);
  });
  it("should be able get sorted uploads", async () => {
    const namePattern = randomUUID();
    const upload1 = await makeUpload({
      name: `${namePattern}.webp`,
      createdAt: /* @__PURE__ */ new Date()
    });
    const upload2 = await makeUpload({
      name: `${namePattern}.webp`,
      createdAt: subDays(/* @__PURE__ */ new Date(), 1)
    });
    const upload3 = await makeUpload({
      name: `${namePattern}.webp`,
      createdAt: subDays(/* @__PURE__ */ new Date(), 2)
    });
    const upload4 = await makeUpload({
      name: `${namePattern}.webp`,
      createdAt: subDays(/* @__PURE__ */ new Date(), 3)
    });
    const upload5 = await makeUpload({
      name: `${namePattern}.webp`,
      createdAt: subDays(/* @__PURE__ */ new Date(), 4)
    });
    let sut = await getUploads({
      searchQuery: namePattern,
      sortBy: "createdAt",
      sortDirection: "desc"
    });
    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).total).toEqual(5);
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload1.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload5.id })
    ]);
    sut = await getUploads({
      searchQuery: namePattern,
      sortBy: "createdAt",
      sortDirection: "asc"
    });
    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).total).toEqual(5);
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id })
    ]);
  });
});
