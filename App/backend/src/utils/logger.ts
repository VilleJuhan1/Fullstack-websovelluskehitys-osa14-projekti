import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

// Create a Pino logger instance and adjust the logging level and formatting based on the environment
export const logger = pino({
  level: isDev ? "debug" : "info",
  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      }
    : undefined,
});
