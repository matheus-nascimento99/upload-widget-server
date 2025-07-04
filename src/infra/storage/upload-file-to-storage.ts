import { Upload } from '@aws-sdk/lib-storage'
import { randomUUID } from 'node:crypto'
import { basename, extname } from 'node:path'
import { Readable } from 'node:stream'
import { z } from 'zod'
import { env } from '../env'
import { r2 } from './client'

const uploadFileToStorageInput = z.object({
  folder: z.enum(['images', 'downloads']),
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
})

type UploadFileToStorageInput = z.input<typeof uploadFileToStorageInput>

export const uploadFileToStorage = async (input: UploadFileToStorageInput) => {
  const { folder, fileName, contentType, contentStream } =
    uploadFileToStorageInput.parse(input)

  const fileNameExtension = extname(fileName)
  const fileNameWithoutExtension = basename(fileName, fileNameExtension)

  const sanitizedFileName = fileNameWithoutExtension.replace(
    /[^a-zA-Z0-9]/g,
    ''
  )
  const sanitizedFileNameWithExtension =
    sanitizedFileName.concat(fileNameExtension)

  const uniqueFileName = `${folder}/${randomUUID()}-${sanitizedFileNameWithExtension}`

  const upload = new Upload({
    client: r2,
    params: {
      Key: uniqueFileName,
      Bucket: env.CLOUDFLARE_BUCKET,
      Body: contentStream,
      ContentType: contentType,
    },
  })

  await upload.done()

  return {
    key: uniqueFileName,
    url: `${env.CLOUDFLARE_PUBLIC_URL}/${uniqueFileName}`,
  }
}
