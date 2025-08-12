export class DiscordClient {
  static baseUrl = 'https://discord.com/api/v10/';
  static appId: string = process.env.APP_ID!;

  static async fetch(endpoint: string, options: RequestInit): ReturnType<typeof fetch> {
    const url = DiscordClient.baseUrl + endpoint;
    return fetch(url, {
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
    return DiscordClient.fetch(`applications/${DiscordClient.appId}/commands`, { method: 'POST', body: JSON.stringify(command), });
  }
}
