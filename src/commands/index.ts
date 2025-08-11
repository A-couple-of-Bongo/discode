import { ping } from './ping';

export type CommandHandler = (data: object) => Promise<object>;

export const commands: Record<string, CommandHandler> = {
  'ping': ping,
};
