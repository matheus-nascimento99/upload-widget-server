import fastifyCors from '@fastify/cors'
import fastifyMultipart from '@fastify/multipart'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from '../env'
import { getUploadsRoute } from './routes/get-uploads'
import { uploadImageRoute } from './routes/upload-image'
import { swaggerTransformSchema } from './swagger-transform-schema'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.validation,
    })
  }

  if (isResponseSerializationError(error)) {
    return reply.status(500).send({
      message: 'Validation error.',
      issues: error.validation,
    })
  }

  // Enviar para ferramenta de observabilidade
  console.error(error)

  return reply.status(500).send({
    message: 'Internal server error.',
  })
})

server.register(fastifyCors, { origin: '*' })

server.register(fastifyMultipart)

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Upload server API',
      version: '1.0.0',
    },
  },
  transform: swaggerTransformSchema,
})

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

server.register(uploadImageRoute)
server.register(getUploadsRoute)

server.listen({ host: '0.0.0.0', port: env.PORT }).then(() => {
  console.log('HTTP Server running!')
})
