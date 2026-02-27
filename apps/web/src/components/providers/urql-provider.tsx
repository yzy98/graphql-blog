"use client";

import { createClient as createWSClient } from "graphql-ws";
import {
  cacheExchange,
  createClient,
  fetchExchange,
  Provider,
  subscriptionExchange,
} from "urql";

const wsClient = createWSClient({
  url: "ws://localhost:4000/graphql",
});

const client = createClient({
  url: `${process.env.NEXT_PUBLIC_SERVER_URL}/graphql`,
  exchanges: [
    cacheExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription(request) {
        const input = { ...request, query: request.query || "" };
        return {
          subscribe(sink) {
            const unsubscribe = wsClient.subscribe(input, sink);
            return { unsubscribe };
          },
        };
      },
    }),
  ],
});

export function UrqlProvider({ children }: { children: React.ReactNode }) {
  return <Provider value={client}>{children}</Provider>;
}
