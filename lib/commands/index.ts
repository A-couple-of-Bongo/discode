import { dailyQuestionCommand, dailyQuestionHandler } from './daily-question';
import { helpCommand, helpHandler } from './help';
import { notifyCommand, notifyHandler } from './notify';
import { pingCommand, pingHandler } from './ping';
import { userCommand, userHandler } from './user';

export type CommandHandler = (data: object) => Promise<object | undefined>;

export const commandHandlers: Record<string, CommandHandler> = {
  'ping': pingHandler,
  'daily-question': dailyQuestionHandler,
  'notify': notifyHandler,
  'help': helpHandler,
  'user': userHandler,
};

export const commands: Record<string, object> = {
  'ping': pingCommand,
  'daily-question': dailyQuestionCommand,
  'notify': notifyCommand,
  'help': helpCommand,
  'user': userCommand,
}
