import * as upload from '@/infra/storage/upload-file-to-storage'
import { isRight, unwrapEither } from '@/shared/either'
import { makeUpload } from '@/test/factories/make-upload'
import { randomUUID } from 'node:crypto'
import { describe, expect, it, vi } from 'vitest'
import { exportUploads } from './export-uploads'

describe('Export uploads', () => {
  it('Should be able to export uploads', async () => {
    const uploadStub = vi
      .spyOn(upload, 'uploadFileToStorage')
      .mockImplementationOnce(async () => {
        return {
          key: `${randomUUID()}.csv`,
          url: 'https://storage.com/file.csv',
        }
      })

    const fileName = `${randomUUID()}-upload.csv`

    const upload1 = await makeUpload({ name: fileName })
    const upload2 = await makeUpload({ name: fileName })
    const upload3 = await makeUpload({ name: fileName })
    const upload4 = await makeUpload({ name: fileName })
    const upload5 = await makeUpload({ name: fileName })

    const sut = await exportUploads({ searchQuery: fileName })

    const uploadToStorageStream = uploadStub.mock.calls[0][0].contentStream
    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []

      uploadToStorageStream.on('data', chunk => chunks.push(chunk))

      uploadToStorageStream.on('end', () =>
        resolve(Buffer.concat(chunks).toString('utf-8'))
      )

      uploadToStorageStream.on('error', err => reject(err))
    })

    const csvAsArray = csvAsString
      .trim()
      .split('\n')
      .map(line => line.split(','))

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).reportUrl).toEqual('https://storage.com/file.csv')
    expect(csvAsArray).toEqual([
      ['ID', 'Name', 'URL', 'Uploaded at'],
      [upload1.id, upload1.name, upload1.remoteUrl, expect.any(String)],
      [upload2.id, upload2.name, upload2.remoteUrl, expect.any(String)],
      [upload3.id, upload3.name, upload3.remoteUrl, expect.any(String)],
      [upload4.id, upload4.name, upload4.remoteUrl, expect.any(String)],
      [upload5.id, upload5.name, upload5.remoteUrl, expect.any(String)],
    ])
  })
})
