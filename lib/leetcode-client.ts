import { z } from 'zod';

export const DailyQuestionSchema = z.object({
  date: z.string(),
  link: z.string(),
  question: z.object({
    content: z.string(),
    title: z.string(),
    difficulty: z.string(),
    topicTags: z.array(
      z.object({
        name: z.string(),
      })
    ),
    titleSlug: z.string(),
  }),
});

export const UserSchema = z.object({
  username: z.string(),
  profile: z.object({
    ranking: z.number(),
    userAvatar: z.string(),
    realName: z.string(),
  }),
  problemsSolvedBeatsStats: z.array(
    z.object({
      difficulty: z.string(),
      percentage: z.number(),
    })
  ),
  submitStatsGlobal: z.object({
    acSubmissionNum: z.array(
      z.object({
        difficulty: z.string(),
        count: z.number(),
        submissions: z.number(),
      })
    ),
  }),
  userContestRanking: z.object({
    attendedContestsCount: z.number(),
    rating: z.number(),
    globalRanking: z.number(),
    totalParticipants: z.number(),
    topPercentage: z.number(),
  }),
});

export const TagSchema = z.object({
  name: z.string(),
  emoji_name: z.string().optional(),
});

export const UserSubmissionSchema = z.object({
  id: z.string(),
  titleSlug: z.string(),
  lang: z.string(),
  timestamp: z.string(),
  memory: z.string(),
  runtime: z.string(),
  url: z.string(),
});

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
              titleSlug
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

    const dailyQuestion = {
      ...data,
      link: `https://leetcode.com${data.link}`,
    };

    return DailyQuestionSchema.parse(dailyQuestion);
  }

  static getTags(): Tag[] {
    const tags = [
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

    return z.array(TagSchema).parse(tags);
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
    const userData = (json as any)?.data?.matchedUser;

    if (!userData) {
      return undefined;
    }

    const userWithContest = {
      ...userData,
      userContestRanking: (json as any)?.data?.userContestRanking || {
        attendedContestsCount: 0,
        rating: 0,
        globalRanking: 0,
        totalParticipants: 0,
        topPercentage: 0,
      },
    };

    return UserSchema.parse(userWithContest);
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

  static async getUserSolutionForDaily(username: string): Promise<UserSubmission | undefined> {
    const dailyQuestion = await LeetcodeClient.getDailyQuestion();
    const titleSlug = dailyQuestion.question.titleSlug;

    return await LeetcodeClient.getUserLatestAcceptedSubmission(username, titleSlug);
  }

  static async getUserLatestAcceptedSubmission(username: string, titleSlug: string): Promise<UserSubmission | undefined> {
    const res = await fetch(LeetcodeClient.leetcodeApiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        query: `
            query recentAcSubmissions($username: String!, $limit: Int!) {
              recentAcSubmissionList(username: $username, limit: $limit) {
                id
                titleSlug
                memory
                runtime
                lang
                timestamp
                url
              }
            }    
          `,
        variables: {
          username,
          limit: 10,
        },
      })
    });

    const json = await res.json();
    const submissions = (json as any)?.data?.recentAcSubmissionList
      ?.filter((submission: any) => submission.titleSlug === titleSlug)
      ?.map((submission: any) => ({
        ...submission,
        url: `https://leetcode.com${submission.url}`,
      }));

    if (!submissions || submissions.length === 0) {
      return undefined;
    }

    return UserSubmissionSchema.parse(submissions[0]);
  }
}

export type DailyQuestion = z.infer<typeof DailyQuestionSchema>;
export type User = z.infer<typeof UserSchema>;
export type Tag = z.infer<typeof TagSchema>;
export type UserSubmission = z.infer<typeof UserSubmissionSchema>;
