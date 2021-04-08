import { ApolloServer } from 'apollo-server-micro';
import { stitchSchemas } from '@graphql-tools/stitch';
import { delegateToSchema } from '@graphql-tools/delegate';
import { RenameTypes, RenameRootFields } from '@graphql-tools/wrap';

import createRemoteSchema from '../../utils/createRemoteExecutor';

// Configuration for Next.js API Routes
export const config = {
  api: {
    bodyParser: false,
  },
};

// Export as a Next.js API Route
export default async (req, res) => {
  // Setup subschema configurations
  const productsSubschema = await createRemoteSchema({
    url: process.env.NEXT_PUBLIC_SALEOR_GRAPHQL_ENDPOINT
  });

  const cmsSubschema = await createRemoteSchema({
    url: process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT,
    transforms: [
      new RenameRootFields(
        (operationName, fieldName, fieldConfig) => `strapi_${fieldName}`,
      ),
      new RenameTypes((name) => `Strapi_${name}`),
    ],
  });

  // Build the combined schema and set up the extended schema and resolver
  const schema = stitchSchemas({
    subschemas: [productsSubschema, cmsSubschema],
    typeDefs: `
    extend type Product {
      cmsMetaData: [Strapi_Products]!
    }
  `,
    resolvers: {
      Product: {
        cmsMetaData: {
          selectionSet: `{ id }`,
          resolve(product, args, context, info) {
            // Get the data for the extended type from the subschema for Strapi
            return delegateToSchema({
              schema: cmsSubschema,
              operation: 'query',
              fieldName: 'strapi_products',
              args: { where: { saleorId: product.id } },
              context,
              info,
            });
          },
        },
      },
    },
  });

  // Set up the GraphQL server
  const apolloServer = new ApolloServer({ schema });
  const apolloServerHandler = apolloServer.createHandler({
    path: '/api/graphql',
  });

  // Return the GraphQL endpoint
  return apolloServerHandler(req, res);
};
