// WINSTON logger 
import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info", // Log only if info level or higher
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: "logs/error.log", level: "error" }), // Store errors
    new transports.File({ filename: "logs/combined.log" }), // Store all logs
  ],
});

export default logger;
