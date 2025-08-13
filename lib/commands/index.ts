import { aboutMeCommand, aboutMeHandler } from './about-me';
import { aboutYouCommand, aboutYouHandler } from './about-you';
import { bindUserCommand, bindUserHandler } from './bind-user';
import { dailyQuestionCommand, dailyQuestionHandler } from './daily-question';
import { helpCommand, helpHandler } from './help';
import { notifyCommand, notifyHandler } from './notify';
import { pingCommand, pingHandler } from './ping';
import { userCommand, userHandler } from './user';

export type CommandHandler = (payload: any) => Promise<object | undefined>;

export const commandHandlers: Record<string, CommandHandler> = {
  'ping': pingHandler,
  'daily-question': dailyQuestionHandler,
  'notify': notifyHandler,
  'help': helpHandler,
  'user': userHandler,
  'bind-user': bindUserHandler,
  'about-me': aboutMeHandler,
  'about-you': aboutYouHandler,
};

export const commands: Record<string, object> = {
  'ping': pingCommand,
  'daily-question': dailyQuestionCommand,
  'notify': notifyCommand,
  'help': helpCommand,
  'user': userCommand,
  'bind-user': bindUserCommand,
  'about-me': aboutMeCommand,
  'about-you': aboutYouCommand,
}
