const { createLogger, format, transports } = require('winston')

const { combine, padLevels, timestamp, printf } = format
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`
})

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    padLevels(),
    myFormat
  ),
  transports: [
    new transports.File({ filename: process.env.LOG_FOLDER + '/' + process.env.LOG_FILE })
  ]
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: myFormat
  }))
}

logger.stream = {
  write: (message) => {
    logger.info(message.trim())
  }
}

module.exports = logger
