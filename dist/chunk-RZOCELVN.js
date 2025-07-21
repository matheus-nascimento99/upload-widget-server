import {
  db
} from "./chunk-X6OYC4AU.js";
import {
  schema
} from "./chunk-P6UISU5A.js";
import {
  makeRight
} from "./chunk-4HTPEPDQ.js";

// src/app/functions/get-uploads.ts
import { asc, count, desc, ilike } from "drizzle-orm";
import { z } from "zod";
var getUploadsInput = z.object({
  searchQuery: z.string().optional(),
  sortBy: z.enum(["createdAt"]).optional(),
  sortDirection: z.enum(["asc", "desc"]).optional(),
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20)
});
var getUploads = async (data) => {
  const { searchQuery, sortBy, sortDirection, page, pageSize } = getUploadsInput.parse(data);
  const [uploads, [{ total }]] = await Promise.all([
    db.select({
      id: schema.uploads.id,
      name: schema.uploads.name,
      remoteKey: schema.uploads.remoteKey,
      remoteUrl: schema.uploads.remoteUrl,
      createdAt: schema.uploads.createdAt
    }).from(schema.uploads).where(
      searchQuery ? ilike(schema.uploads.name, `%${searchQuery}%`) : void 0
    ).orderBy((fields) => {
      if (sortBy && sortDirection === "asc") {
        return asc(fields[sortBy]);
      }
      if (sortBy && sortDirection === "desc") {
        return desc(fields[sortBy]);
      }
      return desc(fields.id);
    }).offset((page - 1) * pageSize).limit(pageSize),
    db.select({
      total: count(schema.uploads.id)
    }).from(schema.uploads).where(
      searchQuery ? ilike(schema.uploads.name, `%${searchQuery}%`) : void 0
    )
  ]);
  return makeRight({ uploads, total });
};

export {
  getUploads
};
