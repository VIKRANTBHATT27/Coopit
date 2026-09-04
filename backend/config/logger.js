import pino from "pino";

const logger = pino({
    level: process.env.LOG_LEVEL || "info",
    transport: {
        targets: [
            {
                target: "pino/file",
                level: "error",
                options: { destination: "error.log", mkdir: true }
            },
            {
                target: "pino/file",
                options: { destination: "combined.log", mkdir: true }
            }
        ]
    }
});

export default logger;