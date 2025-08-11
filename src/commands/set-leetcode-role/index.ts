import { InteractionResponseFlags, InteractionResponseType, MessageComponentTypes } from 'discord-interactions';
import { CommandHandler } from '..';
import { DiscordClient } from '../../discord-client';

DiscordClient.installGlobalCommand({
  name: 'set-leetcode-role',
  description: 'Set notified role whenever a daily challenge arrives.',
  options: [
    {
      name: 'role',
      description: 'The notified role.',
      type: 8, // ROLE
      required: true,
    },
  ],
});

export const setLeetcodeRole: CommandHandler = async (data) => {
  return {};
}
