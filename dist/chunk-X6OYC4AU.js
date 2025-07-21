import {
  schema
} from "./chunk-P6UISU5A.js";
import {
  env
} from "./chunk-2UR5CODH.js";

// src/infra/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
var pg = postgres(env.DATABASE_URL);
var db = drizzle(pg, { schema });

export {
  pg,
  db
};
