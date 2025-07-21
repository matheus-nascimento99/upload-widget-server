// src/infra/http/swagger-transform-schema.ts
import { jsonSchemaTransform } from "fastify-type-provider-zod";
var swaggerTransformSchema = (data) => {
  const { schema, url } = jsonSchemaTransform(data);
  if (schema.consumes?.includes("multipart/form-data")) {
    let body = schema.body;
    if (schema.body === void 0) {
      body = {
        type: "object",
        required: [],
        properties: {}
      };
    }
    body.properties.file = {
      type: "string",
      format: "binary"
    };
    body.required.push("file");
    schema.body = body;
  }
  return { schema, url };
};

export {
  swaggerTransformSchema
};
