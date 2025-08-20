import _ from 'lodash';
import { InteractionResponseFlags, MessageComponentTypes } from 'discord-interactions';
import { InteractionCommandHandler, InteractionCommandResponse } from '..';
import { LeetcodeClient, UserSubmission } from '../../leetcode-client';
import { getConnection } from '../../db';

export const dailyQuestionCommand = {
  name: 'daily-question',
  description: 'Leetcode\'s daily question commands.',
  options: [
    {
      type: 1, // SUB_COMMAND
      name: 'get',
      description: 'Get today\'s daily question.',
    },
    {
      type: 1, // SUB_COMMAND
      name: 'my-solution',
      description: 'Showcase your solution.',
    },
    {
      type: 1, // SUB_COMMAND
      name: 'your-solution',
      description: 'Fetch the solution of a member.',
      options: [
        {
          type: 9, // USER
          name: 'user',
          description: 'The target user',
          required: true,
        }
      ],
    },
  ]
}

export const dailyQuestionHandler: InteractionCommandHandler = async (payload) => {
  const subcommand = payload.data?.options?.[0]?.name;

  if (subcommand === 'get') {
    return await handleGetSubcommand();
  } else if (subcommand === 'my-solution') {
    return await handleMySolutionSubcommand(payload);
  } else if (subcommand === 'your-solution') {
    return await handleYourSolutionSubcommand(payload);
  }

  return await handleGetSubcommand();
}

const handleGetSubcommand = async () => {
  const { link } = await LeetcodeClient.getDailyQuestion();

  return {
    flags: InteractionResponseFlags.IS_COMPONENTS_V2,
    components: [
      {
        type: MessageComponentTypes.TEXT_DISPLAY as const,
        content: `Daily challenge's link: ${link}`,
      },
    ],
  };
}

const handleMySolutionSubcommand = async (payload: any) => {
  const userId = payload.member?.user?.id;

  const db = getConnection();
  const leetcodeName = db.prepare(`SELECT leetcode_account FROM users WHERE id = ?`).all(userId)?.[0]?.['leetcode_account'];
  if (!leetcodeName) return {
    flags: InteractionResponseFlags.IS_COMPONENTS_V2,
    components: [
      {
        type: MessageComponentTypes.TEXT_DISPLAY as const,
        content: `Please bind your account first!`,
      },
    ],
  };
  const solution = await LeetcodeClient.getUserSolutionForDaily(leetcodeName as string);
  if (!solution) return {
    flags: InteractionResponseFlags.IS_COMPONENTS_V2,
    components: [
      {
        type: MessageComponentTypes.TEXT_DISPLAY as const,
        content: `You haven't solved today problem!`,
      },
    ],
  };

  return formatSolution(leetcodeName as string, solution);
}

const handleYourSolutionSubcommand = async (payload: any) => {
  const targetUserId = payload.data?.options?.[0]?.options?.[0]?.value;

  const db = getConnection();
  const leetcodeName = db.prepare(`SELECT leetcode_account FROM users WHERE id = ?`).all(targetUserId)?.[0]?.['leetcode_account'];
  if (!leetcodeName) return {
    flags: InteractionResponseFlags.IS_COMPONENTS_V2,
    components: [
      {
        type: MessageComponentTypes.TEXT_DISPLAY as const,
        content: `This user hasn't bind their account!`,
      },
    ],
  };
  const solution = await LeetcodeClient.getUserSolutionForDaily(leetcodeName as string);
  if (!solution) return {
    flags: InteractionResponseFlags.IS_COMPONENTS_V2,
    components: [
      {
        type: MessageComponentTypes.TEXT_DISPLAY as const,
        content: `This user hasn't solved today problem!`,
      },
    ],
  };

  return formatSolution(leetcodeName as string, solution);
}

function formatSolution(username: string, solution: UserSubmission): InteractionCommandResponse {
  const submissionDate = new Date(parseInt(solution.timestamp) * 1000);
  const formattedTime = submissionDate.toLocaleTimeString();

  const getLanguageEmoji = (lang: string) => {
    const emojiMap: { [key: string]: string } = {
      'python': '🐍',
      'python3': '🐍',
      'javascript': '🟨',
      'typescript': '🔷',
      'java': '☕',
      'cpp': '⚡',
      'c': '⚡',
      'rust': '🦀',
      'go': '🔵',
      'swift': '🍎',
      'kotlin': '🟣',
      'scala': '🔴',
      'ruby': '💎',
      'php': '💜',
      'csharp': '💙',
      'c#': '💙'
    };
    return emojiMap[lang.toLowerCase()] || '💻';
  };

  return {
    flags: InteractionResponseFlags.IS_COMPONENTS_V2,
    components: [
      {
        type: MessageComponentTypes.CONTAINER,
        accent_color: 703487,
        components: [
          {
            type: MessageComponentTypes.TEXT_DISPLAY,
            content: `# ${username}'s solution
**Submission ID:** \`${solution.id}\`
**Submitted:** ${formattedTime}
**Status:** Accepted ✅
**Link:** ${solution.url}`,
          },
          {
            type: MessageComponentTypes.SEPARATOR,
            divider: true,
            spacing: 1,
          },
          {
            type: MessageComponentTypes.TEXT_DISPLAY,
            content: `## Details
**Language:** ${_.capitalize(solution.lang)} ${getLanguageEmoji(solution.lang)}
**Runtime:** ${solution.runtime}
**Memory:** ${solution.memory}`
          },
        ],
      }
    ]
  };
}
