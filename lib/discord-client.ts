import { InteractionResponseType } from "discord-interactions";
import { Tag } from "./leetcode-client";

export class DiscordClient {
  static baseUrl = 'https://discord.com/api/v10/';
  static appId: string = process.env.APP_ID!;

  static async fetch(endpoint: string, options: RequestInit): ReturnType<typeof fetch> {
    const url = DiscordClient.baseUrl + endpoint;
    return await fetch(url, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent': 'DiscordBot',
        ...(options.headers || {}),
      },
      ...options,
    })
  }

  static async installGlobalCommand(command: object) {
    await DiscordClient.fetch(`applications/${DiscordClient.appId}/commands`, { method: 'POST', body: JSON.stringify(command), });
  }

  static async installGlobalCommands(commands: object[]) {
    await DiscordClient.fetch(`applications/${DiscordClient.appId}/commands`, {
      method: 'PUT',
      body: JSON.stringify(commands),
    });
  }

  static async deleteAllGlobalCommands() {
    await DiscordClient.fetch(`applications/${DiscordClient.appId}/commands`, { method: 'PUT', body: JSON.stringify({}) });
  }

  static async createForumThread(forumChannelId: string, post: object) {
    await DiscordClient.fetch(`channels/${forumChannelId}/threads`, {
      method: 'POST',
      body: JSON.stringify(post),
    });
  }

  static async getForumTags(forumChannelId: string): Promise<(Tag & { id: string })[]> {
    const response = await DiscordClient.fetch(`channels/${forumChannelId}`, {
      method: 'GET',
    });
    const channel = await response.json() as any;
    return channel.available_tags || [];
  }

  static async createForumTags(forumChannelId: string, tags: Tag[]) {
    const response = await DiscordClient.fetch(`channels/${forumChannelId}`, {
      method: 'GET',
    });
    const channel = await response.json() as any;

    const existingTags = channel.available_tags || [];
    const updatedTags = [...existingTags, ...tags];

    await DiscordClient.fetch(`channels/${forumChannelId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        available_tags: updatedTags
      }),
    });
  }

  static async deleteAllForumTags(forumChannelId: string) {
    await DiscordClient.fetch(`channels/${forumChannelId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        available_tags: []
      }),
    });
  }

  static async deferInteractionReply(interactionId: string, interactionToken: string) {
    await DiscordClient.fetch(`interactions/${interactionId}/${interactionToken}/callback`, {
      method: 'POST',
      body: JSON.stringify({
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
      }),
    });
  }

  static async answerDeferredInteraction(interactionToken: string, message: object) {
    await DiscordClient.fetch(`webhooks/${DiscordClient.appId}/${interactionToken}/messages/@original`, {
      method: 'PATCH',
      body: JSON.stringify(message),
    });
  }

  static async cancelDeferredInteraction(interactionToken: string) {
    await DiscordClient.fetch(`webhooks/${DiscordClient.appId}/${interactionToken}/messages/@original`, {
      method: 'PATCH',
      body: JSON.stringify({
        content: 'The bot cancelled this response!',
      }),
    });
  }
}
