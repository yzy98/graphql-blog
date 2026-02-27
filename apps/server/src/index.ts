/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import { createServer } from "node:http";
import { useServer } from "graphql-ws/use/ws";
import { createYoga } from "graphql-yoga";
import { WebSocketServer } from "ws";
import { pubsub } from "./graphql/context";
import { schema } from "./graphql/schema";

const port = Number(process.env.API_PORT) || 4000;

const yogaApp = createYoga({
  schema,
  context: () => ({ pubsub }),
  graphiql: {
    subscriptionsProtocol: "WS",
  },
});

const httpServer = createServer(yogaApp);
const wsServer = new WebSocketServer({
  server: httpServer,
  path: yogaApp.graphqlEndpoint,
});

useServer(
  {
    execute: (args: any) => args.rootValue.execute(args),
    subscribe: (args: any) => args.rootValue.subscribe(args),
    onSubscribe: async (ctx, _id, params) => {
      const { schema, execute, subscribe, contextFactory, parse, validate } =
        yogaApp.getEnveloped({
          ...ctx,
          req: ctx.extra.request,
          socket: ctx.extra.socket,
          params,
        });

      const args = {
        schema,
        operationName: params.operationName,
        document: parse(params.query),
        variableValues: params.variables,
        contextValue: await contextFactory(),
        rootValue: {
          execute,
          subscribe,
        },
      };

      const errors = validate(args.schema, args.document);
      if (errors.length) {
        return errors;
      }
      return args;
    },
  },
  wsServer
);

httpServer.listen(port, () => {
  console.log(`Visit http://localhost:${port}/graphql`);
});
