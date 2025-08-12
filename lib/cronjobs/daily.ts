import { CronJob } from '.';
import { getConnection } from '../db';
import { DiscordClient } from '../discord-client';

export const dailyCronJob: CronJob = {
  name: 'daily-challenge',
  schedule: '0 5 7 * * *',
  callback: async () => {
    const db = getConnection();
    const contacts = db.prepare('SELECT notified_channel_id, notified_role_id, notification_text FROM servers;').all();
    const dailyQuestion = await getDailyChallengeInfo();

    for (const contact of contacts) {
      const channelId = contact['notified_channel_id'] as string;
      const roleId = contact['notified_role_id'] as string;
      const message = contact['notification_text'] as string || 'Go go go!';
      if (channelId && roleId) {
        DiscordClient.createForumThread(channelId, {
          name: dailyQuestion.title,
          message: {
            content: `<@&${roleId}> ${message}: ${dailyQuestion.link}`,
          }
        });
      }
    }
  },
};

async function getDailyChallengeInfo(): Promise<{ date: string, title: string, link: string, content: string }> {
  return fetch('https://leetcode.com/graphql/', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      query: `
        query questionOfTodayV2 {
          activeDailyCodingChallengeQuestion {
            date
            link
            question {
              content
              title
            }
          }
        }
      `,
    })
  })
    .then((res) => res.json())
    .then((res) => {
      const data = (res as any).data.activeDailyCodingChallengeQuestion;
      return {
        date: data.date,
        title: data.question.title,
        link: `https://leetcode.com${data.link}`,
        content: data.question.content,
      };
    });
}
