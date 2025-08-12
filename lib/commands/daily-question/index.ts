import puppeteer from 'puppeteer';
import { InteractionResponseFlags, InteractionResponseType, MessageComponentTypes } from 'discord-interactions';
import { CommandHandler } from '..';
import { LeetcodeClient } from '../../leetcode-client';

export const dailyQuestionCommand = {
  name: 'daily-question',
  description: 'Get Leetcode\'s daily question.',
}

export const dailyQuestionHandler: CommandHandler = async () => {
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
