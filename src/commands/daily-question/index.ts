import { InteractionResponseFlags, InteractionResponseType, MessageComponentTypes } from 'discord-interactions';
import { CommandHandler } from '..';
import { DiscordClient } from '../../discord-client';

DiscordClient.installGlobalCommand({
  name: 'daily-question',
  description: 'Get Leetcode\'s daily question.',
});

export const dailyQuestion: CommandHandler = async () => {
  const link = await fetch('https://leetcode.com/graphql/', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      query: `
        query questionOfTodayV2 {
          activeDailyCodingChallengeQuestion { link }
        }
      `,
    })
  }).then((res) => res.json())
    .then((res) => `https://leetcode.com${(res as any).data.activeDailyCodingChallengeQuestion.link}`);

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.IS_COMPONENTS_V2,
      components: [
        {
          type: MessageComponentTypes.TEXT_DISPLAY,
          content: `Daily challenge's link: ${link}`,
        }
      ],
    },
  }
}
