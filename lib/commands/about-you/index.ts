import { InteractionResponseFlags, InteractionResponseType, MessageComponentTypes } from 'discord-interactions';
import { CommandHandler } from '..';
import { getConnection } from '../../db';
import { fetchUser } from '../user';

export const aboutYouCommand = {
  name: 'about-you',
  description: 'Get the Leetcode profile of a member.',
  options: [
    {
      type: 9, // USER
      name: 'user',
      description: 'The target user.',
      required: true,
    }
  ],
};

export const aboutYouHandler: CommandHandler = async (payload) => {
  const targetUserId = payload?.data?.options?.[0]?.value;
  if (!targetUserId) return
  const db = getConnection();

  const leetcodeName = db.prepare(`SELECT leetcode_account FROM users WHERE id = ?`).all(targetUserId)?.[0]?.['leetcode_account'];
  if (!leetcodeName) return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.IS_COMPONENTS_V2,
      components: [
        {
          type: MessageComponentTypes.TEXT_DISPLAY,
          content: `Please bind your account first!`,
        },
      ],
    }
  };

  return fetchUser(leetcodeName as string);
}
