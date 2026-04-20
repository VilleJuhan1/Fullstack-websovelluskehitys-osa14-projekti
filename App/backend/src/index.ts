import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./schema/resolvers";
import { typeDefs } from "./schema/typeDefs";
import { loggingPlugin } from "./plugins/loggingPlugin";
import { logger } from "./utils/logger";
import { GraphQLError } from "graphql";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const isDev = process.env.NODE_ENV !== "production";

async function startServer() {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [loggingPlugin],

      formatError: (formattedError, error) => {
        const graphQLError = error as GraphQLError;

        logger.error(
          {
            message: graphQLError.message,
            path: graphQLError.path,
            code: formattedError.extensions?.code,
          },
          "GraphQL Error while starting the server:",
        );

        return {
          message: formattedError.message,
          code: formattedError.extensions?.code || "INTERNAL_SERVER_ERROR",
        };
      },

      introspection: isDev,
    });

    const { url } = await startStandaloneServer(server, {
      listen: { port: PORT },
    });

    logger.info({ url, port: PORT }, "🚀 Server ready");
  } catch (error) {
    logger.fatal(error, "Failed to start server");
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down");
  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down");
  process.exit(0);
});

startServer();
