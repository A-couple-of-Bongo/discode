import { commands } from '../lib/commands';
import { DiscordClient } from '../lib/discord-client';

for (const commandName in commands) {
  DiscordClient.installGlobalCommand(commands[commandName]!);
}
