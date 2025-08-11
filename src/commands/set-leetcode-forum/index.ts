import { InteractionResponseFlags, InteractionResponseType, MessageComponentTypes } from 'discord-interactions';
import { CommandHandler } from '..';
import { DiscordClient } from '../../discord-client';

DiscordClient.installGlobalCommand({
  name: 'set-leetcode-forum',
  description: 'Set notified role whenever a daily challenge arrives.',
  options: [
    {
      name: 'channel',
      description: 'The channel to send LeetCode notifications to',
      type: 7, // CHANNEL
      required: true,
    },
  ],
});

export const setLeetcodeForum: CommandHandler = async (data) => {
  return {};
}
