import puppeteer from 'puppeteer';
import { InteractionResponseFlags, InteractionResponseType, MessageComponentTypes } from 'discord-interactions';
import { CommandHandler } from '..';

export const dailyQuestionCommand = {
  name: 'daily-question',
  description: 'Get Leetcode\'s daily question.',
}

export const dailyQuestionHandler: CommandHandler = async () => {
  const { link, question: { content } } = await getDailyChallengeLink();
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

async function getDailyChallengeLink() {
  return fetch('https://leetcode.com/graphql/', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      query: `
        query questionOfTodayV2 {
          activeDailyCodingChallengeQuestion {
            link
            question {
              content
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
        ...data,
        link: `https://leetcode.com${data.link}`
      };
    });
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
