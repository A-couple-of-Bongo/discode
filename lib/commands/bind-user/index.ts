import { InteractionResponseFlags, InteractionResponseType, MessageComponentTypes } from 'discord-interactions';
import { CommandHandler } from '..';
import { getConnection } from '../../db';

export const bindUserCommand = {
  name: 'bind-user',
  description: 'Bind your Discord account to a Leetcode profile.',
  options: [
    {
      name: 'username',
      description: 'The Leetcode\'s username.',
      type: 3, // STRING
      required: true,
    },
  ],
};

export const bindUserHandler: CommandHandler = async (payload) => {
  const userId = payload?.member?.user?.id;
  const leetcodeUserName = payload?.data?.options?.[0]?.value;
  if (!userId || !leetcodeUserName) return;

  const db = getConnection();
  try {
    const insert = db.prepare(`
    INSERT INTO users(leetcode_account, id) VALUES(?, ?);
    `);
    insert.run(leetcodeUserName, userId);
  } catch {
    const update = db.prepare(`
      UPDATE users
      SET leetcode_account = ?
      WHERE id = ?;
    `)
    update.run(leetcodeUserName, userId);
  }
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.IS_COMPONENTS_V2,
      components: [
        {
          type: MessageComponentTypes.TEXT_DISPLAY,
          content: `Successfully bind <@${userId}> to the Leetcode account \`${leetcodeUserName}\`.`,
        },
      ],
    },
  };

}
