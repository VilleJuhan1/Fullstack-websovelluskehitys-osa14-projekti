import { logger } from './utils/logger';
import { startServer } from './server';

// Graceful shutdown handling
process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down');
  process.exit(0);
});

// Start the server
startServer();
