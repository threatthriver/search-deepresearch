import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { getCerebrasApiKey } from '../config';
import { ChatModel } from '.';
import { ChatOpenAI } from '@langchain/openai';

// Define Cerebras chat models
const cerebrasChatModels: Record<string, string>[] = [
  {
    displayName: 'Llama 3.3 70B',
    key: 'llama-3.3-70b',
  },
];

export const loadCerebrasChatModels = async () => {
  const cerebrasApiKey = getCerebrasApiKey();

  if (!cerebrasApiKey) return {};

  try {
    const chatModels: Record<string, ChatModel> = {};

    cerebrasChatModels.forEach((model) => {
      chatModels[model.key] = {
        displayName: model.displayName,
        model: new ChatOpenAI({
          openAIApiKey: cerebrasApiKey,
          modelName: model.key,
          temperature: 0.2,
          configuration: {
            baseURL: 'https://api.cerebras.ai/v1',
          },
        }) as unknown as BaseChatModel,
      };
    });

    return chatModels;
  } catch (err) {
    console.error(`Error loading Cerebras models: ${err}`);
    return {};
  }
};
