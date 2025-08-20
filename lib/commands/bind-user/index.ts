import { InteractionResponseFlags, MessageComponentTypes } from 'discord-interactions';
import { InteractionCommandHandler } from '..';
import { getConnection } from '../../db';
import { LeetcodeClient } from '../../leetcode-client';

export const bindUserCommand = {
  name: 'bind-user',
  description: 'Bind your Discord account to a Leetcode profile.',
  options: [
    {
      name: 'username',
      description: 'The Leetcode\'s username',
      type: 3, // STRING
      required: true,
    },
  ],
};

export const bindUserHandler: InteractionCommandHandler = async (payload) => {
  const userId = payload?.member?.user?.id;
  const leetcodeUserName = payload?.data?.options?.[0]?.value;
  if (!userId || !leetcodeUserName) return {
    flags: InteractionResponseFlags.IS_COMPONENTS_V2,
    components: [
      {
        type: MessageComponentTypes.TEXT_DISPLAY,
        content: 'Missing user id and leetcode username!',
      },
    ],
  }
  if (!await LeetcodeClient.userExists(leetcodeUserName)) return {
    flags: InteractionResponseFlags.IS_COMPONENTS_V2,
    components: [
      {
        type: MessageComponentTypes.TEXT_DISPLAY,
        content: `The Leetcode account \`${leetcodeUserName}\` does not exist!`,
      },
    ],
  }

  const db = getConnection();
  const upsert = db.prepare(`
    INSERT OR REPLACE INTO users(leetcode_account, id) VALUES(?, ?);
    `);
  upsert.run(leetcodeUserName, userId);

  return {
    flags: InteractionResponseFlags.IS_COMPONENTS_V2,
    components: [
      {
        type: MessageComponentTypes.TEXT_DISPLAY,
        content: `Successfully bind <@${userId}> to the Leetcode account \`${leetcodeUserName}\`.`,
      },
    ],
  };

}
