import { CommandHandler } from '..';

export const setLeetcodeForumCommand = {
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
};

export const setLeetcodeForumHandler: CommandHandler = async (data) => {
  return {};
}
