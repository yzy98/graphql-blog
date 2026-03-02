/** biome-ignore-all lint/performance/noNamespaceImport: <explanation> */
import { drizzle } from "drizzle-orm/neon-http";
import * as dbSchema from "./db/schema";

export const createDbClient = (databaseUrl: string) => {
  return drizzle(databaseUrl, {
    schema: dbSchema,
  });
};
