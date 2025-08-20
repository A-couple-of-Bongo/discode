import 'dotenv/config';
import fs from 'fs';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import nodeCron from 'node-cron';
import { InteractionResponseType, InteractionType, verifyKeyMiddleware } from 'discord-interactions';
import { commandHandlers } from '../lib/commands';
import morgan from 'morgan';
import { jobs } from '../lib/cronjobs';
import { logger } from '../lib/logger';
import { DiscordClient } from '../lib/discord-client';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static('public'))

app.post('/interactions',
  morgan(
    function(tokens, req, res) {
      if (!req.body) return;

      const { id, type, data } = req.body;
      const timestamp = new Date().toISOString();
      const userAgent = req.get('User-Agent') || 'Unknown';

      const logType = type === InteractionType.APPLICATION_COMMAND
        ? `Command (name: ${data.name})`
        : `Non-command (type: ${type})`;

      return `[${timestamp}] Id: ${id} - ${logType} - ${tokens.method?.(req, res)} ${tokens.url?.(req, res)} ${tokens.status?.(req, res)} ${tokens['response-time']?.(req, res)}ms - UA: "${userAgent}"`;
    },
    { stream: fs.createWriteStream(process.env.ACCESS_LOG_PATH || 'access.log', { flags: 'a' }) },
  ),
  verifyKeyMiddleware(process.env.PUBLIC_KEY!),
  async function(req, res) {
    const { id, type, data, token } = req.body;

    if (type === InteractionType.PING) {
      return res.send({ type: InteractionResponseType.PONG });
    }

    if (type === InteractionType.APPLICATION_COMMAND) {
      const { name } = data;
      if (!commandHandlers[name]) {
        logger.error(`Unknown command: ${name}`);
        return res.status(400).json({ error: 'Unknown command' });
      }
      await DiscordClient.deferInteractionReply(id, token);
      res.status(200).send();
      try {
        const response = await commandHandlers[name]!(req.body);
        if (response) {
          await DiscordClient.answerDeferredInteraction(token, response);
        } else {
          await DiscordClient.cancelDeferredInteraction(token);
        }
      } catch (e) {
        await DiscordClient.cancelDeferredInteraction(token);
        throw e;
      }
      return;
    }

    logger.error(`Unknown interaction type: ${type}`);
    return res.status(400).json({ error: 'Unknown interaction' });
  }
);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);
})

app.listen(PORT, () => {
  console.log('Express app starts')
  console.log('* Listening on port', PORT)

  console.log('* Cron jobs starting up')
  for (const job of jobs) {
    console.log('** Starting cron job', job.name);
    nodeCron.schedule(job.schedule, () => {
      try {
        job.callback();
      } catch (e) {
        logger.error(e);
      }
    });
  }
})
