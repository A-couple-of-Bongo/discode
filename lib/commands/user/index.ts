import { InteractionResponseFlags, MessageComponentTypes } from 'discord-interactions';
import { InteractionCommandHandler, InteractionCommandResponse } from '..';
import { LeetcodeClient } from '../../leetcode-client';

export const userCommand = {
  name: 'user',
  description: 'Get the user\'s Leetcode profile.',
  options: [
    {
      name: 'username',
      description: 'The Leetcode\'s username',
      type: 3, // STRING
      required: true,
    },
  ],
};

export const userHandler: InteractionCommandHandler = async ({ data }) => {
  const username = data?.options[0]?.value;
  if (!username) return {
    flags: InteractionResponseFlags.IS_COMPONENTS_V2,
    components: [
      {
        type: MessageComponentTypes.TEXT_DISPLAY,
        content: 'Missing username!',
      },
    ],
  }
  return await fetchUser(username);
}

export async function fetchUser(name: string): Promise<InteractionCommandResponse> {
  const user = await LeetcodeClient.getUser(name);
  if (!user) {
    return {
      flags: InteractionResponseFlags.IS_COMPONENTS_V2,
      components: [
        {
          type: MessageComponentTypes.TEXT_DISPLAY,
          content: `User **${name}** does not exist!`,
        },
      ],
    }
  }

  const problemStats = user.submitStatsGlobal?.acSubmissionNum || [];
  const easyStats = problemStats.find((stat) => stat.difficulty === 'Easy') || { count: 0, submissions: 0 };
  const mediumStats = problemStats.find((stat) => stat.difficulty === 'Medium') || { count: 0, submissions: 0 };
  const hardStats = problemStats.find((stat) => stat.difficulty === 'Hard') || { count: 0, submissions: 0 };

  const totalSolved = easyStats.count + mediumStats.count + hardStats.count;

  const beatsStats = user.problemsSolvedBeatsStats || [];
  const easyBeats = beatsStats.find((stat) => stat.difficulty === 'Easy')?.percentage || 0;
  const mediumBeats = beatsStats.find((stat) => stat.difficulty === 'Medium')?.percentage || 0;
  const hardBeats = beatsStats.find((stat) => stat.difficulty === 'Hard')?.percentage || 0;

  return {
    flags: InteractionResponseFlags.IS_COMPONENTS_V2,
    components: [
      {
        type: MessageComponentTypes.CONTAINER,
        accent_color: 703487,
        components: [
          {
            type: MessageComponentTypes.TEXT_DISPLAY,
            content: `# ${user.profile.realName}`,
          },
          {
            type: MessageComponentTypes.TEXT_DISPLAY,
            content: `**User**: ${user.username}`,
          },
          {
            type: MessageComponentTypes.TEXT_DISPLAY,
            content: `**Global Rank**: #${user.profile.ranking?.toLocaleString() || 'N/A'}`,
          },
          {
            type: MessageComponentTypes.MEDIA_GALLERY,
            items: [
              {
                media: { url: user.profile.userAvatar },
              },
            ],
          },
          {
            type: MessageComponentTypes.TEXT_DISPLAY,
            content: `## 📊 Problem Statistics`,
          },
          {
            type: MessageComponentTypes.TEXT_DISPLAY,
            content: `**Total Problems Solved**: ${totalSolved.toLocaleString()}`,
          },
          {
            type: MessageComponentTypes.TEXT_DISPLAY,
            content: `🟢 **Easy**: ${easyStats.count.toLocaleString()} solved (beats ${easyBeats.toFixed(1)}%)`,
          },
          {
            type: MessageComponentTypes.TEXT_DISPLAY,
            content: `🟡 **Medium**: ${mediumStats.count.toLocaleString()} solved (beats ${mediumBeats.toFixed(1)}%)`,
          },
          {
            type: MessageComponentTypes.TEXT_DISPLAY,
            content: `🔴 **Hard**: ${hardStats.count.toLocaleString()} solved (beats ${hardBeats.toFixed(1)}%)`,
          },
        ],
      },
    ],
  };
}
