import { InteractionResponseFlags, InteractionResponseType, MessageComponentTypes } from 'discord-interactions';
import { CommandHandler } from '..';
import { DiscordClient } from '../../discord-client';

DiscordClient.installGlobalCommand({
  name: 'daily-question',
  description: 'Get Leetcode\'s daily question.',
});

export const dailyQuestion: CommandHandler = async () => {
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.IS_COMPONENTS_V2,
      components: [
      ],
    },
  }
}
