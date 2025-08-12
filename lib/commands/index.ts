import { dailyQuestionCommand, dailyQuestionHandler } from './daily-question';
import { pingCommand, pingHandler } from './ping';
import { setLeetcodeForumCommand, setLeetcodeForumHandler } from './set-leetcode-forum';
import { setLeetcodeRoleCommand, setLeetcodeRoleHandler } from './set-leetcode-role';

export type CommandHandler = (data: object) => Promise<object>;

export const commandHandlers: Record<string, CommandHandler> = {
  'ping': pingHandler,
  'daily-question': dailyQuestionHandler,
  'set-leetcode-forum': setLeetcodeForumHandler,
  'set-leetcode-role': setLeetcodeRoleHandler,
};

export const commands: Record<string, object> = {
  'ping': pingCommand,
  'daily-question': dailyQuestionCommand,
  'set-leetcode-forum': setLeetcodeForumCommand,
  'set-leetcode-role': setLeetcodeRoleCommand,
}
