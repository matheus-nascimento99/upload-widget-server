import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { uploadImageToStorage } from '@/infra/storage/upload-image-to-storage'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { Readable } from 'node:stream'
import { z } from 'zod'
import { InvalidFileFormatError } from '../errors/invalid-file-format'

const uploadImageInput = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
})

type UploadImageInput = z.input<typeof uploadImageInput>

const allowedMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']

export const uploadImage = async (
  data: UploadImageInput
): Promise<Either<InvalidFileFormatError, { url: string }>> => {
  const { fileName, contentType, contentStream } = uploadImageInput.parse(data)

  if (!allowedMimeTypes.includes(contentType)) {
    return makeLeft(new InvalidFileFormatError())
  }

  const { key, url } = await uploadImageToStorage({
    folder: 'images',
    fileName,
    contentType,
    contentStream,
  })

  await db.insert(schema.uploads).values({
    name: fileName,
    remoteKey: key,
    remoteUrl: url,
  })

  return makeRight({ url })
}
