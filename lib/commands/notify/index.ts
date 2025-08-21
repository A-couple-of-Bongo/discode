import { InteractionResponseFlags, MessageComponentTypes } from 'discord-interactions';
import { InteractionCommandHandler } from '..';
import { getConnection } from '../../db';
import { DiscordClient } from '../../discord-client';
import { LeetcodeClient } from '../../leetcode-client';

export const notifyCommand = {
  name: 'notify',
  description: 'Manage LeetCode daily challenge notifications.',
  options: [
    {
      name: 'channel',
      description: 'Set the channel to send LeetCode notifications to',
      type: 1, // SUB_COMMAND
      options: [
        {
          name: 'channel',
          description: 'The channel to send notifications to',
          type: 7, // CHANNEL
          required: true,
        },
      ],
    },
    {
      name: 'role',
      description: 'Set the role to ping for notifications',
      type: 1, // SUB_COMMAND
      options: [
        {
          name: 'role',
          description: 'The role to ping',
          type: 8, // ROLE
          required: true,
        },
      ],
    },
    {
      name: 'message',
      description: 'Set the notification message text',
      type: 1, // SUB_COMMAND
      options: [
        {
          name: 'text',
          description: 'The text used for notification',
          type: 3, // STRING
          required: true,
        },
      ],
    },
  ],
};

export const notifyHandler: InteractionCommandHandler = async (payload) => {
  const subCommand = payload?.data?.options?.[0];
  const subCommandName = subCommand?.name;

  if (!subCommand || !subCommandName) {
    return {
      flags: InteractionResponseFlags.IS_COMPONENTS_V2,
      components: [
        {
          type: MessageComponentTypes.TEXT_DISPLAY,
          content: 'Invalid subcommand!',
        },
      ],
    };
  }

  switch (subCommandName) {
    case 'channel':
      return handleChannelSubcommand(subCommand, payload);
    case 'role':
      return handleRoleSubcommand(subCommand, payload);
    case 'message':
      return handleMessageSubcommand(subCommand, payload);
    default:
      return {
        flags: InteractionResponseFlags.IS_COMPONENTS_V2,
        components: [
          {
            type: MessageComponentTypes.TEXT_DISPLAY,
            content: 'Unknown subcommand!',
          },
        ],
      };
  }
};

const handleChannelSubcommand = async (subCommand: any, payload: any) => {
  const channelId = subCommand?.options?.[0]?.value;
  const serverId = payload?.guild_id;

  if (!channelId || !serverId) {
    return {
      flags: InteractionResponseFlags.IS_COMPONENTS_V2,
      components: [
        {
          type: MessageComponentTypes.TEXT_DISPLAY as const,
          content: 'Missing channel id and server id!',
        },
      ],
    };
  }

  const db = getConnection();
  const upsert = db.prepare(`
    INSERT INTO servers(notified_channel_id, server_id) VALUES(?, ?)
    ON CONFLICT(server_id) DO UPDATE SET notified_channel_id = excluded.notified_channel_id;
  `);
  upsert.run(channelId, serverId);

  await DiscordClient.deleteAllForumTags(channelId);
  await DiscordClient.createForumTags(channelId, LeetcodeClient.getTags());

  return {
    flags: InteractionResponseFlags.IS_COMPONENTS_V2,
    components: [
      {
        type: MessageComponentTypes.TEXT_DISPLAY as const,
        content: `Successfully set the notification channel to <#${channelId}>`,
      },
    ],
  };
};

const handleRoleSubcommand = async (subCommand: any, payload: any) => {
  const roleId = subCommand?.options?.[0]?.value;
  const serverId = payload?.guild_id;

  if (!roleId || !serverId) {
    return {
      flags: InteractionResponseFlags.IS_COMPONENTS_V2,
      components: [
        {
          type: MessageComponentTypes.TEXT_DISPLAY as const,
          content: 'Missing role id and server id!',
        },
      ],
    };
  }

  const db = getConnection();
  const upsert = db.prepare(`
    INSERT INTO servers(notified_role_id, server_id) VALUES(?, ?)
    ON CONFLICT(server_id) DO UPDATE SET notified_role_id = excluded.notified_role_id;
  `);
  upsert.run(roleId, serverId);

  return {
    flags: InteractionResponseFlags.IS_COMPONENTS_V2,
    components: [
      {
        type: MessageComponentTypes.TEXT_DISPLAY as const,
        content: `Successfully set the notification role to <@&${roleId}>`,
      },
    ],
  };
};

const handleMessageSubcommand = async (subCommand: any, payload: any) => {
  const message = subCommand?.options?.[0]?.value;
  const serverId = payload?.guild_id;

  if (!message || !serverId) {
    return {
      flags: InteractionResponseFlags.IS_COMPONENTS_V2,
      components: [
        {
          type: MessageComponentTypes.TEXT_DISPLAY as const,
          content: 'Missing message text and server id!',
        },
      ],
    };
  }

  const db = getConnection();
  const upsert = db.prepare(`
    INSERT INTO servers(notification_text, server_id) VALUES(?, ?)
    ON CONFLICT(server_id) DO UPDATE SET notification_text = excluded.notification_text;
  `);
  upsert.run(message, serverId);

  return {
    flags: InteractionResponseFlags.IS_COMPONENTS_V2,
    components: [
      {
        type: MessageComponentTypes.TEXT_DISPLAY as const,
        content: `Successfully set the notification message to: "${message}"`,
      },
    ],
  };
};
