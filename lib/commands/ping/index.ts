import { InteractionResponseFlags, MessageComponentTypes } from 'discord-interactions';
import { InteractionCommandHandler } from '..';

export const pingCommand = {
  name: 'ping',
  description: 'Ping the server.',
};

export const pingHandler: InteractionCommandHandler = async () => {
  return {
    flags: InteractionResponseFlags.IS_COMPONENTS_V2,
    components: [
      {
        type: MessageComponentTypes.TEXT_DISPLAY,
        content: 'Pong!',
      },
    ],
  };
}
