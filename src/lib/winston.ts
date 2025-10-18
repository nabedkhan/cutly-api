import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize, json } = format;

const loggerFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

export const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    loggerFormat,
    colorize({
      all: true,
      colors: {
        info: "blue",
        error: "red",
        warn: "yellow"
      }
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "error.log",
      level: "error",
      format: json()
    })
  ]
});
