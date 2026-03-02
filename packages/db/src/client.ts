import { drizzle } from "drizzle-orm/neon-http";

export const createDbClient = (databaseUrl: string) => {
  return drizzle(databaseUrl);
};
