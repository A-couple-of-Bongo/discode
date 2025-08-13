interface DailyQuestion {
  date: string;
  link: string;
  question: {
    content: string;
    title: string;
    difficulty: string;
    topicTags: { name: string }[];
  };
}

export interface User {
  username: string;
  profile: {
    ranking: number;
    userAvatar: string;
    realName: string;
  };
  problemsSolvedBeatsStats: {
    difficulty: string;
    percentage: number;
  }[];
  submitStatsGlobal: {
    acSubmissionNum: Array<{
      difficulty: string;
      count: number;
      submissions: number;
    }>;
  };
  userContestRanking: {
    attendedContestsCount: number;
    rating: number;
    globalRanking: number;
    totalParticipants: number;
    topPercentage: number;
  };
}

interface Tag {
  name: string;
  emoji_name?: string;
}

export class LeetcodeClient {
  static leetcodeApiUrl = 'https://leetcode.com/graphql/';

  static async getDailyQuestion(): Promise<DailyQuestion> {
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

  static getTags(): Tag[] {
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

  static async getUser(name: string): Promise<User | undefined> {
    const res = await fetch(LeetcodeClient.leetcodeApiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        query: `
          query userPublicProfile($username: String!) {
            matchedUser(username: $username) {
              username
              profile {
                ranking
                userAvatar
                realName
              }
              problemsSolvedBeatsStats {
                difficulty
                percentage
              }
              submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                  submissions
                }
              }
            }
            userContestRanking(username: $username) {
              attendedContestsCount
              rating
              globalRanking
              totalParticipants
              topPercentage
            }
          }    
        `,
        variables: {
          username: name,
        },
      })
    });

    const json = await res.json();
    return (json as any)?.data?.matchedUser;
  }

  static async userExists(username: string): Promise<boolean> {
    const res = await fetch(LeetcodeClient.leetcodeApiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        query: `
            query checkUser($username: String!) {
              matchedUser(username: $username) {
                username
              }
            }
          `,
        variables: {
          username: username,
        },
      })
    });

    const json = await res.json();
    return !!(json as any).data?.matchedUser;
  }
}
