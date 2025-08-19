import 'dotenv/config';
import pino from 'pino';

export const logger = pino({}, pino.destination(process.env.ERROR_LOG_PATH || './error.log'));
