import { InteractionResponseFlags, InteractionResponseType, MessageComponentTypes } from 'discord-interactions';
import { CommandHandler } from '..';

export const helpCommand = {
  name: 'help',
  description: 'Get usage guidance.',
};

export const helpHandler: CommandHandler = async () => {
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.IS_COMPONENTS_V2,
      components: [
        {
          type: MessageComponentTypes.CONTAINER,
          accent_color: 703487,
          components: [
            {
              type: MessageComponentTypes.TEXT_DISPLAY,
              content: `# Discode bot
If this is the first time you add the bot to the server you may want to run \`/notify\` to setup the notification.
For first time users, use \`bind-user\` to bind your account to a Leetcode account.
------------------------
**Command**
- \`about-me\`: Get your Leetcode profile.
- \`bind-user\`: Bind your account to a Leetcode user.
- \`daily-question\`: Fetch the daily question from Leetcode.
- \`help\`: Get bot usage guidelines.
- \`notify\`: Setup the notification forum, role and message.
- \`ping\`: Ping the server.
- \`user\`: Get the user's Leetcode profile.
------------------------
`,
            },
          ],
        },
      ],
    }
  };
}
