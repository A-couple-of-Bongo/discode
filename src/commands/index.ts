import { dailyQuestion } from './daily-question';
import { ping } from './ping';

export type CommandHandler = (data: object) => Promise<object>;

export const commands: Record<string, CommandHandler> = {
  'ping': ping,
  'daily-question': dailyQuestion,
};
