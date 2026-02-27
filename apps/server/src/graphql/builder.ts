import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import { DateResolver } from "graphql-scalars";
import { prisma } from "../prisma/client";
import type PrismaTypes from "../prisma/generated/pothos-prisma-types";
import { getDatamodel } from "../prisma/generated/pothos-prisma-types";
import type { GraphQLContext } from "./context";

export const builder = new SchemaBuilder<{
  Scalars: {
    Date: { Input: Date; Output: Date };
  };
  PrismaTypes: PrismaTypes;
  Context: GraphQLContext;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
    dmmf: getDatamodel(),
  },
});

builder.addScalarType("Date", DateResolver, {});

builder.queryType({});
builder.mutationType({});
builder.subscriptionType({});
