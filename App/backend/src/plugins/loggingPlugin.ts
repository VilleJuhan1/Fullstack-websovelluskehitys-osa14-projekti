import { ApolloServerPlugin } from "@apollo/server";
import { logger } from "../utils/logger";

// A plugin to log GraphQL requests and errors using Pino
export const loggingPlugin: ApolloServerPlugin = {
  async requestDidStart(requestContext) {
    const start = Date.now();
    const operationName = requestContext.request.operationName ?? "Unnamed";

    logger.info({ operationName }, "Incoming request");

    return {
      async didEncounterErrors(ctx) {
        logger.error(
          {
            errors: ctx.errors,
            operationName,
          },
          "Request failed with GraphQL errors:",
        );
      },

      async willSendResponse(ctx) {
        const duration = Date.now() - start;

        logger.info(
          {
            operationName: ctx.operationName ?? "Unnamed",
            duration,
          },
          "[x] Request completed:",
        );
      },
    };
  },
};
