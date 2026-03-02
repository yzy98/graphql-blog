import { createServer } from "node:http";
import { buildSchema } from "drizzle-graphql";
import { createYoga } from "graphql-yoga";
import { db } from "@/clients/db";

const { schema } = buildSchema(db);

const yoga = createYoga({ schema });
const server = createServer(yoga);

server.listen(4000, () => {
  console.info("Server is running on http://localhost:4000/graphql");
});
