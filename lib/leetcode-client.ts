export class LeetcodeClient {
  static leetcodeApiUrl = 'https://leetcode.com/graphql/';

  static async getDailyQuestion(): Promise<object> {
    const res = await fetch(LeetcodeClient.leetcodeApiUrl, {
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
              difficulty
              topicTags {
                name
              }
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

  static getTags() {
    return [
      { name: 'easy', emoji_name: '🟢' },
      { name: 'medium', emoji_name: '🟡' },
      { name: 'hard', emoji_name: '🔴' },
      { name: 'dynamic programming' },
      { name: 'math' },
      { name: 'greedy' },
      { name: 'graph' },
      { name: 'backtracking' },
      { name: 'prefix-sum' },
    ];
  }
}
