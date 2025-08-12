import { CronJob } from '.';
import { getConnection } from '../db';
import { DiscordClient } from '../discord-client';
import { LeetcodeClient } from '../leetcode-client';

export const dailyCronJob: CronJob = {
  name: 'daily-challenge',
  schedule: '0 5 7 * * *',
  callback: async () => {
    const db = getConnection();
    const contacts = db.prepare('SELECT notified_channel_id, notified_role_id, notification_text FROM servers;').all();
    const dailyQuestionData = await LeetcodeClient.getDailyQuestion() as any;

    for (const contact of contacts) {
      const channelId = contact['notified_channel_id'] as string;
      const roleId = contact['notified_role_id'] as string;
      const message = contact['notification_text'] as string || 'Go go go!';
      if (channelId && roleId) {
        DiscordClient.createForumThread(channelId, {
          name: `${dailyQuestionData.date}. ${dailyQuestionData.question.title}`,
          message: {
            content: `<@&${roleId}> ${message}: ${dailyQuestionData.link}`,
          },
          applied_tags: [
            dailyQuestionData.question.difficulty,
            ...dailyQuestionData.question.topicTags
              .map(({ name }: { name: string }) => name).slice(0, 3),
          ],
        });
      }
    }
  },
};
