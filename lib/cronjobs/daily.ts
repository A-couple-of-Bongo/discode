import { CronJob } from '.';
import { getConnection } from '../db';
import { DiscordClient } from '../discord-client';

export const dailyCronJob: CronJob = {
  name: 'daily-challenge',
  schedule: '0 5 7 * * *',
  callback: async () => {
    const db = getConnection();
    const contacts = db.prepare('SELECT notified_channel_id, notified_role_id, notification_text FROM servers;').all();
    const dailyQuestionData = await getDailyChallengeInfo();

    for (const contact of contacts) {
      const channelId = contact['notified_channel_id'] as string;
      const roleId = contact['notified_role_id'] as string;
      const message = contact['notification_text'] as string || 'Go go go!';
      if (channelId && roleId) {
        DiscordClient.createForumThread(channelId, {
          name: `${dailyQuestionData.date}. ${dailyQuestionData.question.title}`,
          message: {
            content: `<@&${roleId}> ${message}: ${dailyQuestionData.link}`,
          }
        });
      }
    }
  },
};

async function getDailyChallengeInfo() {
  const res = await fetch('https://leetcode.com/graphql/', {
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
  });
  const json = await res.json();
  const data = (json as any).data.activeDailyCodingChallengeQuestion;
  return {
    ...data,
    link: `https://leetcode.com${data.link}`,
  };
}
