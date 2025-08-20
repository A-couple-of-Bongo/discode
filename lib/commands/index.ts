import { InteractionResponseFlags, MessageComponent } from 'discord-interactions';
import { aboutMeCommand, aboutMeHandler } from './about-me';
import { aboutYouCommand, aboutYouHandler } from './about-you';
import { bindUserCommand, bindUserHandler } from './bind-user';
import { dailyQuestionCommand, dailyQuestionHandler } from './daily-question';
import { helpCommand, helpHandler } from './help';
import { notifyCommand, notifyHandler } from './notify';
import { pingCommand, pingHandler } from './ping';
import { userCommand, userHandler } from './user';

export interface InteractionCommandResponse {
  flags: InteractionResponseFlags,
  components: MessageComponent[],
}

export type InteractionCommandHandler = (payload: any) => Promise<InteractionCommandResponse>;

export const commandHandlers: Record<string, InteractionCommandHandler> = {
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
