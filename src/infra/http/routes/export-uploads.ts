import { exportUploads } from '@/app/functions/export-uploads'
import { unwrapEither } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import status from 'http-status'
import { z } from 'zod/v4'

export const exportUploadsRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/uploads/exports',
    {
      schema: {
        summary: 'Export uploads',
        tags: ['uploads'],
        querystring: z.object({
          searchQuery: z.string().optional(),
        }),
        response: {
          [status.OK]: z.object({
            reportUrl: z.url(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { searchQuery } = request.query

      const result = await exportUploads({
        searchQuery,
      })

      const { reportUrl } = unwrapEither(result)

      return reply.status(200).send({ reportUrl })
    }
  )
}
