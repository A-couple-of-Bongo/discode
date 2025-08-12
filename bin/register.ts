import { commands } from '../lib/commands';
import { DiscordClient } from '../lib/discord-client';

async function main() {
  await DiscordClient.deleteAllGlobalCommands();
  await DiscordClient.installGlobalCommands(Object.values(commands));
}

main();
