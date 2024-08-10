import winston from "winston";
import { config } from "../config/config.js"
const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6
    },
    colors: {
        error: 'bold red',
        debug: 'yellow',
        info: 'green'
    }
};
winston.addColors(customLevels.colors);



export const logger = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({
            level: "info"
        }),
        new winston.transports.File({
            filename: "../utils/logs/errors.log",
            level: "error"
        })
    ]
});

const loggerDev = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.colorize(customLevels.colors),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({ level: 'debug' })
    ]
})



export const middLogger = (req, res, next) => {
    req.logger = config.NODE_ENV === 'prod' ? logger : loggerDev;
    next()
}


