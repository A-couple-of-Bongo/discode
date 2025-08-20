import { InteractionResponseFlags, MessageComponentTypes } from 'discord-interactions';
import { CommandHandler } from '..';
import { getConnection } from '../../db';
import { fetchUser } from '../user';

export const aboutMeCommand = {
  name: 'about-me',
  description: 'Get my Leetcode profile.',
};

export const aboutMeHandler: CommandHandler = async (payload) => {
  const userId = payload?.member?.user?.id;
  if (!userId) return;
  const db = getConnection();

  const leetcodeName = db.prepare(`SELECT leetcode_account FROM users WHERE id = ?`).all(userId)?.[0]?.['leetcode_account'];
  if (!leetcodeName) return {
    flags: InteractionResponseFlags.IS_COMPONENTS_V2,
    components: [
      {
        type: MessageComponentTypes.TEXT_DISPLAY,
        content: `Please bind your account first!`,
      },
    ],
  };

  return fetchUser(leetcodeName as string);
}
