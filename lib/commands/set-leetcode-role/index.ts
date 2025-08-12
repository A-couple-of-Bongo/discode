import { CommandHandler } from '..';

export const setLeetcodeRoleCommand = {
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
};

export const setLeetcodeRoleHandler: CommandHandler = async (data) => {
  return {};
}
