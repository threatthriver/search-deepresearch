import { Embeddings } from '@langchain/core/embeddings';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { loadCerebrasChatModels } from './cerebras';
import { loadDeepResearchChatModels, loadDeepResearchEmbeddingModels } from './deepResearch';

export interface ChatModel {
  displayName: string;
  model: BaseChatModel;
  description?: string;
  usageCheck?: () => boolean;
  onUse?: () => void;
}

export interface EmbeddingModel {
  displayName: string;
  model: Embeddings;
}

export const chatModelProviders: Record<
  string,
  () => Promise<Record<string, ChatModel>>
> = {
  cerebras: loadCerebrasChatModels,
  deep_research: loadDeepResearchChatModels,
};

export const embeddingModelProviders: Record<
  string,
  () => Promise<Record<string, EmbeddingModel>>
> = {
  deep_research: loadDeepResearchEmbeddingModels,
};

export const getAvailableChatModelProviders = async () => {
  const models: Record<string, Record<string, ChatModel>> = {};

  for (const provider in chatModelProviders) {
    const providerModels = await chatModelProviders[provider]();
    if (Object.keys(providerModels).length > 0) {
      models[provider] = providerModels;
    }
  }

  return models;
};

export const getAvailableEmbeddingModelProviders = async () => {
  const models: Record<string, Record<string, EmbeddingModel>> = {};

  for (const provider in embeddingModelProviders) {
    const providerModels = await embeddingModelProviders[provider]();
    if (Object.keys(providerModels).length > 0) {
      models[provider] = providerModels;
    }
  }

  return models;
};
