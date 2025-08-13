import puppeteer from 'puppeteer';
import _ from 'lodash';
import { ButtonStyleTypes, InteractionResponseFlags, InteractionResponseType, MessageComponentTypes } from 'discord-interactions';
import { CommandHandler } from '..';
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
          description: 'The target user.',
          required: true,
        }
      ],
    },
  ]
}

export const dailyQuestionHandler: CommandHandler = async (payload) => {
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
  const { link, question: { content } } = await LeetcodeClient.getDailyQuestion() as any;
  await takeScreenshotHtml(content);

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.IS_COMPONENTS_V2,
      components: [
        {
          type: MessageComponentTypes.TEXT_DISPLAY,
          content: `Daily challenge's link: ${link}`,
        },
        {
          type: MessageComponentTypes.MEDIA_GALLERY,
          items: [
            { media: { url: `${process.env.HOST_URL!}/daily-question.png` } },
          ],
        },
      ],
    },
  };
}

const handleMySolutionSubcommand = async (payload: any) => {
  const userId = payload.member?.user?.id;

  const db = getConnection();
  const leetcodeName = db.prepare(`SELECT leetcode_account FROM users WHERE id = ?`).all(userId)?.[0]?.['leetcode_account'];
  if (!leetcodeName) return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.IS_COMPONENTS_V2,
      components: [
        {
          type: MessageComponentTypes.TEXT_DISPLAY,
          content: `Please bind your account first!`,
        },
      ],
    }
  };
  const solution = await LeetcodeClient.getUserSolutionForDaily(leetcodeName as string);
  if (!solution) return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.IS_COMPONENTS_V2,
      components: [
        {
          type: MessageComponentTypes.TEXT_DISPLAY,
          content: `You haven't solved today problem!`,
        },
      ],
    }
  };

  return formatSolution(leetcodeName as string, solution);
}

const handleYourSolutionSubcommand = async (payload: any) => {
  const targetUserId = payload.data?.options?.[0]?.options?.[0]?.value;

  const db = getConnection();
  const leetcodeName = db.prepare(`SELECT leetcode_account FROM users WHERE id = ?`).all(targetUserId)?.[0]?.['leetcode_account'];
  if (!leetcodeName) return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.IS_COMPONENTS_V2,
      components: [
        {
          type: MessageComponentTypes.TEXT_DISPLAY,
          content: `This user hasn't bind their account!`,
        },
      ],
    }
  };
  const solution = await LeetcodeClient.getUserSolutionForDaily(leetcodeName as string);
  if (!solution) return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.IS_COMPONENTS_V2,
      components: [
        {
          type: MessageComponentTypes.TEXT_DISPLAY,
          content: `This user hasn't solved today problem!`,
        },
      ],
    }
  };

  return formatSolution(leetcodeName as string, solution);
}

const takeScreenshotHtml = async (htmlContent: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const styledHtml = `
    <style>
      * { text-wrap: wrap; }
    </style>
    <div style="width: 1080px; padding: 8px;">
      ${htmlContent}
    </div>
  `;
  await page.setViewport({ width: 1080, height: 800 });
  await page.setContent(styledHtml, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: './public/daily-question.png', fullPage: true })
  await browser.close();
};

function formatSolution(username: string, solution: UserSubmission) {
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
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
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
    },
  };
}
