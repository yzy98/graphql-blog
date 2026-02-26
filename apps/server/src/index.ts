import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { schema } from "./graphql/schema";

const port = Number(process.env.API_PORT) || 4000;

const yoga = createYoga({
  schema,
});

const server = createServer(yoga);

server.listen(port, () => {
  console.log(`Visit http://localhost:${port}/graphql`);
});
