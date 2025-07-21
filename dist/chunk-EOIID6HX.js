import {
  exportUploads
} from "./chunk-QUFLR5VL.js";
import {
  unwrapEither
} from "./chunk-4HTPEPDQ.js";

// src/infra/http/routes/export-uploads.ts
import status from "http-status";
import { z } from "zod/v4";
var exportUploadsRoute = async (server) => {
  server.post(
    "/uploads/exports",
    {
      schema: {
        summary: "Export uploads",
        tags: ["uploads"],
        querystring: z.object({
          searchQuery: z.string().optional()
        }),
        response: {
          [status.OK]: z.object({
            reportUrl: z.url()
          })
        }
      }
    },
    async (request, reply) => {
      const { searchQuery } = request.query;
      const result = await exportUploads({
        searchQuery
      });
      const { reportUrl } = unwrapEither(result);
      return reply.status(200).send({ reportUrl });
    }
  );
};

export {
  exportUploadsRoute
};
