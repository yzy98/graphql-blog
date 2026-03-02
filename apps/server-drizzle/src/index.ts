import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { env } from "./env";
import { schema } from "./graphql/schema";

const port = Number(env.PORT);

const yoga = createYoga({
  schema,
});

const server = createServer(yoga);

server.listen(port, () => {
  console.log(`GraphQL Server is running on http://localhost:${port}/graphql`);
});
