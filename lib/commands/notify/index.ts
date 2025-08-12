import { InteractionResponseFlags, InteractionResponseType, MessageComponentTypes } from 'discord-interactions';
import { CommandHandler } from '..';
import { getConnection } from '../../db';

export const notifyCommand = {
  name: 'notify',
  description: 'Set notified forum and role whenever a daily challenge arrives.',
  options: [
    {
      name: 'channel',
      description: 'The channel to send LeetCode notifications to',
      type: 7, // CHANNEL
      required: true,
    },
    {
      name: 'role',
      description: 'The role to ping',
      type: 8, // ROLE
      required: true,
    },
  ],
};

export const notifyHandler: CommandHandler = async (data) => {
  const channelId = (data as any)?.options[0]?.value;
  const roleId = (data as any)?.options[1]?.value;
  const serverId = (data as any)?.resolved?.channels?.[channelId]?.guild_id;
  if (!channelId || !serverId) {
    return;
  }
  const db = getConnection();
  try {
    const insert = db.prepare(`
    INSERT INTO servers(notified_channel_id, notified_role_id, server_id) VALUES(?, ?, ?);
    `);
    insert.run(channelId, roleId, serverId);
  } catch {
    const update = db.prepare(`
      UPDATE servers
      SET notified_channel_id = ?, notified_role_id = ?
      WHERE server_id = ?;
    `)
    update.run(channelId, roleId, serverId);
  }

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.IS_COMPONENTS_V2,
      components: [
        {
          type: MessageComponentTypes.TEXT_DISPLAY,
          content: `Successfully set notified channel to <#${channelId}> and notified role to <@${roleId}>.`,
        },
      ],
    },
  };
}
