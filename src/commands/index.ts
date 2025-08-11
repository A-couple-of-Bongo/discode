import { dailyQuestion } from './daily-question';
import { ping } from './ping';
import { setLeetcodeForum } from './set-leetcode-forum';
import { setLeetcodeRole } from './set-leetcode-role';

export type CommandHandler = (data: object) => Promise<object>;

export const commands: Record<string, CommandHandler> = {
  'ping': ping,
  'daily-question': dailyQuestion,
  'set-leetcode-forum': setLeetcodeForum,
  'set-leetcode-role': setLeetcodeRole,
};
