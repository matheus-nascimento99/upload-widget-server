import {
  uploadImage
} from "./chunk-MBLSECLK.js";
import {
  isRight,
  unwrapEither
} from "./chunk-4HTPEPDQ.js";

// src/infra/http/routes/upload-image.ts
import status from "http-status";
import { z } from "zod/v4";
var uploadImageRoute = async (server) => {
  server.post(
    "/uploads",
    {
      schema: {
        summary: "Upload an image",
        consumes: ["multipart/form-data"],
        tags: ["uploads"],
        response: {
          [status.CREATED]: z.null().describe("Image uploaded"),
          [status.BAD_REQUEST]: z.object({ message: z.string() })
        }
      }
    },
    async (request, reply) => {
      const uploadedFile = await request.file({
        limits: {
          fieldSize: 1024 * 1024 * 2
          // 2mb
        }
      });
      if (!uploadedFile) {
        return reply.status(400).send({ message: "File is required." });
      }
      const result = await uploadImage({
        fileName: uploadedFile.filename,
        contentType: uploadedFile.mimetype,
        contentStream: uploadedFile.file
      });
      if (uploadedFile.file.truncated) {
        return reply.status(400).send({ message: "File size limit reached." });
      }
      if (isRight(result)) {
        return reply.status(201).send();
      }
      const error = unwrapEither(result);
      switch (error.constructor.name) {
        case "InvalidFileFormatError":
          return reply.status(400).send({ message: error.message });
      }
    }
  );
};

export {
  uploadImageRoute
};
