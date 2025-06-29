import { jsonSchemaTransform } from 'fastify-type-provider-zod'

type SwaggerTransformSchemaData = Parameters<typeof jsonSchemaTransform>[0]

export const swaggerTransformSchema = (data: SwaggerTransformSchemaData) => {
  const { schema, url } = jsonSchemaTransform(data)

  if (schema.consumes?.includes('multipart/form-data')) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let body = schema.body as any

    if (schema.body === undefined) {
      body = {
        type: 'object',
        required: [],
        properties: {},
      }
    }

    body.properties.file = {
      type: 'string',
      format: 'binary',
    }

    body.required.push('file')

    schema.body = body
  }

  return { schema, url }
}
