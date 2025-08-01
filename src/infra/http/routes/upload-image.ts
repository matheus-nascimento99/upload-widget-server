import { uploadImage } from '@/app/functions/upload-image'
import { isRight, unwrapEither } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import status from 'http-status'
import { z } from 'zod/v4'

export const uploadImageRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/uploads',
    {
      schema: {
        summary: 'Upload an image',
        consumes: ['multipart/form-data'],
        tags: ['uploads'],
        response: {
          [status.CREATED]: z
            .object({
              url: z.url(),
            })
            .describe('Image uploaded'),
          [status.BAD_REQUEST]: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const uploadedFile = await request.file({
        limits: {
          fieldSize: 1024 * 1024 * 2, // 2mb
        },
      })

      if (!uploadedFile) {
        return reply.status(400).send({ message: 'File is required.' })
      }

      const result = await uploadImage({
        fileName: uploadedFile.filename,
        contentType: uploadedFile.mimetype,
        contentStream: uploadedFile.file,
      })

      if (uploadedFile.file.truncated) {
        return reply.status(400).send({ message: 'File size limit reached.' })
      }

      if (isRight(result)) {
        const file = unwrapEither(result)
        return reply.status(201).send({ url: file.url })
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'InvalidFileFormatError':
          return reply.status(400).send({ message: error.message })
      }
    }
  )
}
