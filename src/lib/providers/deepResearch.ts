import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from '@langchain/google-genai';
import { getDeepResearchApiKey, getDeepResearchDailyLimit } from '../config';
import { ChatModel, EmbeddingModel } from '.';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { Embeddings } from '@langchain/core/embeddings';

// Deep Research models (limited to 1 search per day for detailed research)
const deepResearchChatModels: Record<string, string>[] = [
  {
    displayName: 'Deep Research Pro (1 search/day)',
    key: 'gemini-1.5-pro',
    description: 'Specialized for detailed research paper analysis',
  },
];

const deepResearchEmbeddingModels: Record<string, string>[] = [
  {
    displayName: 'Research Embedding',
    key: 'models/text-embedding-004',
  },
];

// Track usage to enforce daily limit
const usageTracker = {
  getUsageKey: () => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return `deep_research_usage_${today}`;
  },
  
  getCurrentUsage: (): number => {
    if (typeof window === 'undefined') return 0;
    const key = usageTracker.getUsageKey();
    const usage = localStorage.getItem(key);
    return usage ? parseInt(usage, 10) : 0;
  },
  
  incrementUsage: (): void => {
    if (typeof window === 'undefined') return;
    const key = usageTracker.getUsageKey();
    const currentUsage = usageTracker.getCurrentUsage();
    localStorage.setItem(key, (currentUsage + 1).toString());
  },
  
  canUseToday: (): boolean => {
    const currentUsage = usageTracker.getCurrentUsage();
    const dailyLimit = getDeepResearchDailyLimit();
    return currentUsage < dailyLimit;
  }
};

export const loadDeepResearchChatModels = async () => {
  const apiKey = getDeepResearchApiKey();

  if (!apiKey) return {};

  try {
    const chatModels: Record<string, ChatModel> = {};

    deepResearchChatModels.forEach((model) => {
      chatModels[model.key] = {
        displayName: model.displayName,
        model: new ChatGoogleGenerativeAI({
          apiKey: apiKey,
          modelName: model.key,
          temperature: 0.2, // Lower temperature for more precise research results
        }) as unknown as BaseChatModel,
        description: model.description,
        usageCheck: usageTracker.canUseToday,
        onUse: usageTracker.incrementUsage,
      };
    });

    return chatModels;
  } catch (err) {
    console.error(`Error loading Deep Research models: ${err}`);
    return {};
  }
};

export const loadDeepResearchEmbeddingModels = async () => {
  const apiKey = getDeepResearchApiKey();

  if (!apiKey) return {};

  try {
    const embeddingModels: Record<string, EmbeddingModel> = {};

    deepResearchEmbeddingModels.forEach((model) => {
      embeddingModels[model.key] = {
        displayName: model.displayName,
        model: new GoogleGenerativeAIEmbeddings({
          apiKey: apiKey,
          modelName: model.key,
        }) as unknown as Embeddings,
      };
    });

    return embeddingModels;
  } catch (err) {
    console.error(`Error loading Deep Research embedding models: ${err}`);
    return {};
  }
};
