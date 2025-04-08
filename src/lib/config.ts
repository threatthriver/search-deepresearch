import fs from 'fs';
import path from 'path';
import toml from '@iarna/toml';

const configFileName = 'config.toml';

interface Config {
  GENERAL: {
    SIMILARITY_MEASURE: string;
    KEEP_ALIVE: string;
  };
  MODELS: {
    CEREBRAS: {
      API_KEY: string;
    };
    DEEP_RESEARCH: {
      API_KEY: string;
      DAILY_LIMIT: number;
    };
  };
  API_ENDPOINTS: {
    SEARXNG: string;
  };
  APP: {
    CREATOR: string;
    VERSION: string;
  };
}

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

const loadConfig = (): Config => {
  try {
    const configPath = path.join(process.cwd(), `${configFileName}`);

    // Check if config file exists
    if (!fs.existsSync(configPath)) {
      console.warn(`Config file not found at ${configPath}`);
      return {} as Config;
    }

    // Read and parse config file
    const configContent = fs.readFileSync(configPath, 'utf-8');
    return toml.parse(configContent) as any as Config;
  } catch (error) {
    console.error(`Error loading config: ${error}`);
    return {} as Config;
  }
};

export const getSimilarityMeasure = () => {
  const config = loadConfig();
  return config?.GENERAL?.SIMILARITY_MEASURE || 'cosine';
};

export const getKeepAlive = () => {
  const config = loadConfig();
  return config?.GENERAL?.KEEP_ALIVE || '5m';
};

export const getCreator = () => {
  const config = loadConfig();
  return config?.APP?.CREATOR || 'Aniket Kumar';
};

export const getVersion = () => {
  const config = loadConfig();
  return config?.APP?.VERSION || '1.0.0';
};

// Deep Research API (limited to 1 search per day)
export const getDeepResearchApiKey = () => {
  const config = loadConfig();
  return config?.MODELS?.DEEP_RESEARCH?.API_KEY || '';
};

export const getDeepResearchDailyLimit = () => {
  const config = loadConfig();
  return config?.MODELS?.DEEP_RESEARCH?.DAILY_LIMIT || 1;
};

// These functions are kept for backward compatibility but return empty strings
export const getOpenaiApiKey = () => '';
export const getGroqApiKey = () => '';
export const getAnthropicApiKey = () => '';
export const getGeminiApiKey = () => '';
export const getOllamaApiEndpoint = () => '';
export const getDeepseekApiKey = () => '';
export const getCustomOpenaiApiKey = () => '';
export const getCustomOpenaiApiUrl = () => '';
export const getCustomOpenaiModelName = () => '';

export const getSearxngApiEndpoint = () => {
  try {
    // First try environment variable
    if (process.env.SEARXNG_API_URL) {
      return process.env.SEARXNG_API_URL;
    }

    // Then try config file
    const config = loadConfig();
    if (config && config.API_ENDPOINTS && config.API_ENDPOINTS.SEARXNG) {
      return config.API_ENDPOINTS.SEARXNG;
    }

    // Return null if not configured
    console.warn('SearxNG API endpoint not configured in environment or config file');
    return null;
  } catch (error) {
    console.error(`Error getting SearxNG API endpoint: ${error}`);
    return null;
  }
};

export const getCerebrasApiKey = () => {
  const config = loadConfig();
  return config?.MODELS?.CEREBRAS?.API_KEY || 'csk-5f9ftpvvtker983wvkkcym8eem65tey64khtptwhxfmenp9w';
};

const mergeConfigs = (current: any, update: any): any => {
  if (update === null || update === undefined) {
    return current;
  }

  if (typeof current !== 'object' || current === null) {
    return update;
  }

  const result = { ...current };

  for (const key in update) {
    if (Object.prototype.hasOwnProperty.call(update, key)) {
      const updateValue = update[key];

      if (
        typeof updateValue === 'object' &&
        updateValue !== null &&
        typeof result[key] === 'object' &&
        result[key] !== null
      ) {
        result[key] = mergeConfigs(result[key], updateValue);
      } else if (updateValue !== undefined) {
        result[key] = updateValue;
      }
    }
  }

  return result;
};

export const updateConfig = (config: RecursivePartial<Config>) => {
  const currentConfig = loadConfig();
  const mergedConfig = mergeConfigs(currentConfig, config);
  fs.writeFileSync(
    path.join(path.join(process.cwd(), `${configFileName}`)),
    toml.stringify(mergedConfig),
  );
};
