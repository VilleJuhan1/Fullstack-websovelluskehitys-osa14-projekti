import pino from 'pino';

const isDev = process.env.NODE_ENV === 'development';

/**
 * A Pino logger instance configured for the application.
 * In development, it uses 'debug' level and 'pino-pretty' for formatted output.
 * In production, it uses 'info' level and standard JSON output.
 */
export const logger = pino({
  level: isDev ? 'debug' : 'info',
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      }
    : undefined,
});
