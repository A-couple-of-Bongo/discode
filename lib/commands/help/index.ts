import { InteractionResponseFlags, MessageComponentTypes } from 'discord-interactions';
import { CommandHandler } from '..';

export const helpCommand = {
  name: 'help',
  description: 'Get usage guidance.',
};

export const helpHandler: CommandHandler = async () => {
  return {
    flags: InteractionResponseFlags.IS_COMPONENTS_V2,
    components: [
      {
        type: MessageComponentTypes.CONTAINER,
        accent_color: 703487,
        components: [
          {
            type: MessageComponentTypes.TEXT_DISPLAY,
            content: `# Discode bot
If this is the first time you add the bot to the server you may want to run \`notify\` to setup the notification.
For first time users, use \`bind-user\` to bind your account to a Leetcode account.`
          },
          {
            type: MessageComponentTypes.SEPARATOR,
            divider: true,
            spacing: 1,
          },
          {
            type: MessageComponentTypes.TEXT_DISPLAY,
            content: `
## Command
- \`about-me\`: Get your Leetcode profile.
- \`about-you\`: Get the Leetcode profile of a member.
- \`bind-user\`: Bind your Discord account to a Leetcode profile.
- \`daily-question get\`: Fetch the daily question from Leetcode.
- \`daily-question my-solution\`: Showcase your solution to the daily question.
- \`daily-question your-solution\`: View the solution to the daily question of a member.
- \`help\`: Get bot usage guidelines.
- \`notify\`: Setup the notification forum, role and message.
- \`ping\`: Ping the server.
- \`user\`: Get the user's Leetcode profile.
`,
          },
        ],
      },
    ],
  };
}
