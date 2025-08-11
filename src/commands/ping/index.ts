import { InteractionResponseFlags, InteractionResponseType, MessageComponentTypes } from 'discord-interactions';
import { CommandHandler } from '..';
import { DiscordClient } from '../../discord-client';

DiscordClient.installGlobalCommand({
  name: 'ping',
  description: 'Ping the server.',
});

export const ping: CommandHandler = async () => {
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.IS_COMPONENTS_V2,
      components: [
        {
          type: MessageComponentTypes.TEXT_DISPLAY,
          content: 'Pong!',
        },
      ],
    },
  }
}
