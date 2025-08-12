import { commands } from '../lib/commands';
import { DiscordClient } from '../lib/discord-client';

async function main() {
  await DiscordClient.deleteAllGlobalCommands();
  for (const commandName in commands) {
    await DiscordClient.installGlobalCommand(commands[commandName]!);
  }
}

main();
