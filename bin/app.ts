import 'dotenv/config';
import express from 'express';
import { InteractionResponseType, InteractionType, verifyKeyMiddleware } from 'discord-interactions';
import { commandHandlers } from '../lib/commands';
import morgan from 'morgan';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(morgan('tiny'));

app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY!), async function(req, res) {
  const { id, type, data } = req.body;

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;
    if (!commandHandlers[name]) {
      console.error(`Unknown command: ${name}`);
      return res.status(400).json({ error: 'Unknown command' });
    }
    return res.send(await commandHandlers[name]!(data));
  }

  console.error(`Unknown interaction type: ${type}`);
  return res.status(400).json({ error: 'Unknown interaction' });
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT)
})
