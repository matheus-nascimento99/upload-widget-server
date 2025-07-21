import {
  exportUploadsRoute
} from "../../chunk-EOIID6HX.js";
import {
  getUploadsRoute
} from "../../chunk-UHWLLMUA.js";
import {
  uploadImageRoute
} from "../../chunk-TQS2P4PU.js";
import {
  swaggerTransformSchema
} from "../../chunk-ZZW4RVI2.js";
import "../../chunk-QUFLR5VL.js";
import "../../chunk-RZOCELVN.js";
import "../../chunk-MBLSECLK.js";
import "../../chunk-CVC2O6UN.js";
import "../../chunk-KK4PF2HP.js";
import "../../chunk-YOWT7VWM.js";
import "../../chunk-X6OYC4AU.js";
import "../../chunk-P6UISU5A.js";
import "../../chunk-ITVFV47Y.js";
import {
  env
} from "../../chunk-2UR5CODH.js";
import "../../chunk-4HTPEPDQ.js";
import "../../chunk-MLKGABMK.js";

// src/infra/http/server.ts
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { fastify } from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";
var server = fastify();
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);
server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: "Validation error.",
      issues: error.validation
    });
  }
  if (isResponseSerializationError(error)) {
    return reply.status(500).send({
      message: "Validation error.",
      issues: error.validation
    });
  }
  console.error(error);
  return reply.status(500).send({
    message: "Internal server error."
  });
});
server.register(fastifyCors, { origin: "*" });
server.register(fastifyMultipart);
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Upload server API",
      version: "1.0.0"
    }
  },
  transform: swaggerTransformSchema
});
server.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
server.register(uploadImageRoute);
server.register(getUploadsRoute);
server.register(exportUploadsRoute);
server.listen({ host: "0.0.0.0", port: env.PORT }).then(() => {
  console.log("HTTP Server running!");
});
