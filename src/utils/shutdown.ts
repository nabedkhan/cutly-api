import type { Server, ServerResponse, IncomingMessage } from "http";
import { logger } from "@/lib/winston";

export function shutdown(
  disconnectDB: () => Promise<void>,
  server: Server<typeof IncomingMessage, typeof ServerResponse>
) {
  // Graceful shutdown
  const processTermination = (event: string) => {
    logger.info(`${event} signal received: shutting down gracefully`);
    server.close(() => {
      disconnectDB();
      logger.info("Server closed successfully");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => processTermination("SIGTERM"));
  process.on("SIGINT", () => processTermination("SIGINT"));
}
