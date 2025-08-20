import { InteractionResponseFlags, MessageComponentTypes } from 'discord-interactions';
import { CommandHandler } from '..';
import { getConnection } from '../../db';
import { DiscordClient } from '../../discord-client';
import { LeetcodeClient } from '../../leetcode-client';

export const notifyCommand = {
  name: 'notify',
  description: 'Set notified forum and role whenever a daily challenge arrives.',
  options: [
    {
      name: 'channel',
      description: 'The channel to send LeetCode notifications to.',
      type: 7, // CHANNEL
      required: true,
    },
    {
      name: 'role',
      description: 'The role to ping.',
      type: 8, // ROLE
      required: true,
    },
    {
      name: 'text',
      description: 'The text used for notification.',
      type: 3, // STRING
      required: false,
    },
  ],
};

export const notifyHandler: CommandHandler = async ({ data }) => {
  const channelId = data?.options[0]?.value;
  const roleId = data?.options[1]?.value;
  const message = data?.options[2]?.value || 'Go go go!';
  const serverId = data?.resolved?.channels?.[channelId]?.guild_id;
  if (!channelId || !serverId) {
    return;
  }
  const db = getConnection();
  const upsert = db.prepare(`
    INSERT OR REPLACE INTO servers(notified_channel_id, notified_role_id, notification_text, server_id) VALUES(?, ?, ?, ?);
  `);
  upsert.run(channelId, roleId, message, serverId);

  await DiscordClient.deleteAllForumTags(channelId);
  await DiscordClient.createForumTags(channelId, LeetcodeClient.getTags());

  return {
    flags: InteractionResponseFlags.IS_COMPONENTS_V2,
    components: [
      {
        type: MessageComponentTypes.TEXT_DISPLAY,
        content: `Successfully set:
- The notified channel: <#${channelId}>
- The notified role: <@&${roleId}>
- The notification message is currently: "${message}"`,
      },
    ],
  };
}
