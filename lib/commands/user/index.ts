import { InteractionResponseFlags, InteractionResponseType, MessageComponentTypes } from 'discord-interactions';
import { CommandHandler } from '..';

export const userCommand = {
  name: 'user',
  description: 'Get the user\'s Leetcode profile.',
  options: [
    {
      name: 'text',
      description: 'The Leetcode\'s username.',
      type: 3, // STRING
      required: false,
    },
  ],
};

export const userHandler: CommandHandler = async () => {
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.IS_COMPONENTS_V2,
      components: [
        {
          type: MessageComponentTypes.TEXT_DISPLAY,
          content: '',
        },
      ],
    },
  }
}
