require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Constants = require('../../config/constants');
let retentionDays = parseInt(process.env.LOG_RETENTION_DAYS) || 7;
let cleanupInterval = Constants.CLEANUP_LOGS_INTERVAL * 24 * 60 * 60 * 1000;

const reset = '\x1b[0m';
const colors = {
  error: '\x1b[31m',
  warn: '\x1b[33m',
  info: '\x1b[32m',
  http: '\x1b[34m',
  verbose: '\x1b[36m',
  debug: '\x1b[37m',
  silly: '\x1b[35m',
};

const brightColors = {
  ERROR: '\x1b[31;1m',
  WARN: '\x1b[33;1m',
  INFO: '\x1b[32;1m',
  http: '\x1b[34;1m',
  VERBOSE: '\x1b[36;1m',
  DEBUG: '\x1b[37;1m',
  SILLY: '\x1b[35;1m',
};

const levels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  HTTP: 3,
  verbose: 4,
  DEBUG: 5,
  SILLY: 6,
};

const LOG_LEVEL = levels[process.env.LOG_LEVEL || 'DEBUG'];

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function logToFile(msg, level, objectData = null) {
  if (process.env.LOG_DRIVER === 'file') {
    const logDate = getCurrentDate();
    const logFileName = `log-${logDate}.log`;
    const logFilePath = path.join(__dirname, '../../../logs', logFileName);
    const outputLog = fs.createWriteStream(logFilePath, { flags: 'a' });
    const consoler = new console.Console(outputLog);
    const d = new Date();
    const logMessage = `[${d.toLocaleString()} ${d.getMilliseconds()}] : ${level} : `;
    consoler.log(logMessage, msg, objectData || '');
  }
}

function log(msg, level = 'DEBUG', objectData = null) {
  if (levels[level] <= LOG_LEVEL) {
    const d = new Date();
    let logMessage = `[${d.toLocaleString()} ${d.getMilliseconds()}] : ${level} : `;
    if (process.env.LOG_DRIVER === 'console') {
      if (typeof msg === 'object') console.log(brightColors[level] + logMessage + reset, msg, reset, objectData || '');
      else console.log(brightColors[level] + logMessage + msg + reset, objectData || '');
    }
    logToFile(msg, level, objectData);
  }
}

function access_log(msg) {
  const logFilePath = path.join(__dirname, '../access_log.txt');
  const outputLog = fs.createWriteStream(logFilePath, { flags: 'a' });
  const consoler = new console.Console(outputLog);
  const d = new Date();
  const logMessage = `[${d.toLocaleString()} ${d.getMilliseconds()}] : `;
  consoler.log(logMessage, msg);
}

function cleanupLogs() {
  try {
    log('Cleaning up old log files started...', 'DEBUG');

    const now = Date.now();
    const retentionMillis = retentionDays * 24 * 60 * 60 * 1000;
    // let logDir = path.join(__dirname, '../../../logs');
    let logDir = path.join('./logs');
    console.log('logDir:', logDir);
    const todayDate = new Date().toISOString().split('T')[0];

    fs.readdir(logDir, (err, files) => {
      if (err) {
        log('Error reading log directory:', 'ERROR', err);
        return false;
      }

      files.forEach(file => {
        const filePath = path.join(logDir, file);

        // Skip today's file
        if (file.includes(todayDate)) {
          log(`Retaining today's log file: ${file}`, 'SILLY');
          return true;
        }

        // Check if the file matches the log pattern (e.g., log-YYYY-MM-DD.log)
        if (file.startsWith('log-') && file.endsWith('.log')) {
          fs.stat(filePath, (err, stats) => {
            if (err) {
              log('Error getting file stats:', 'ERROR', err);
              return false;
            }

            // Delete file if it's older than the retention period
            const fileAge = now - stats.mtimeMs;
            if (fileAge > retentionMillis) {
              fs.unlink(filePath, err => {
                if (err) {
                  log('Error deleting file:', 'ERROR', err);
                } else {
                  log(`Deleted old log file: ${file}`, 'debug');
                }
              });
            }
          });
        }
      });
    });
  } catch (error) {
    log("cleanupLogs Error:", 'ERROR', error);
    setTimeout(cleanupLogs, cleanupInterval);
  } finally {
    setTimeout(cleanupLogs, cleanupInterval);
  }
}

module.exports = {
  log,
  error_log: (msg, objectData) => {
    const stack = new Error().stack.split('\n');
    log(msg, 'ERROR', objectData)
  },
  warn_log: (msg, objectData) => {
    const stack = new Error().stack.split('\n');
    log(msg, 'WARN', objectData)
  },
  info_log: (msg, objectData) => {
    const stack = new Error().stack.split('\n');
    log(msg, 'INFO', objectData)
  },
  http_log: (msg, objectData) => {
    const stack = new Error().stack.split('\n');
    log(msg, 'HTTP', objectData)
  },
  verbose_log: (msg, objectData) => {
    const stack = new Error().stack.split('\n');
    log(msg, 'VERBOSE', objectData)
  },
  debug_log: (msg, objectData) => {
    const stack = new Error().stack.split('\n');
    log(msg, 'DEBUG', objectData)
  },
  silly_log: (msg, objectData) => {
    const stack = new Error().stack.split('\n');
    log(msg, 'SILLY', objectData)
  },
  access_log,
  cleanupLogs,
};
