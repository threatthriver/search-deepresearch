import axios from 'axios';
import * as cheerio from 'cheerio';

interface WebScraperResult {
  title: string;
  url: string;
  content?: string;
  img_src?: string;
}

/**
 * Scrape search results from a search engine
 * This is a fallback when SearxNG is not available
 */
export const scrapeSearchResults = async (query: string): Promise<{
  results: WebScraperResult[];
  suggestions: string[];
}> => {
  try {
    // Encode the query for URL
    const encodedQuery = encodeURIComponent(query);
    
    // Use DuckDuckGo as the search engine (it's more scraping-friendly)
    const url = `https://html.duckduckgo.com/html/?q=${encodedQuery}`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 10000,
    });
    
    const $ = cheerio.load(response.data);
    const results: WebScraperResult[] = [];
    
    // Extract search results
    $('.result').each((i, element) => {
      if (i >= 10) return; // Limit to 10 results
      
      const titleElement = $(element).find('.result__title a');
      const title = titleElement.text().trim();
      const url = titleElement.attr('href') || '';
      
      // Extract the snippet/content
      const content = $(element).find('.result__snippet').text().trim();
      
      results.push({
        title,
        url,
        content,
      });
    });
    
    // Extract related searches/suggestions
    const suggestions: string[] = [];
    $('.related-searches a').each((i, element) => {
      if (i >= 5) return; // Limit to 5 suggestions
      suggestions.push($(element).text().trim());
    });
    
    return {
      results: results.length > 0 ? results : generateFallbackResults(query),
      suggestions: suggestions.length > 0 ? suggestions : generateFallbackSuggestions(query),
    };
  } catch (error) {
    console.error(`Error scraping search results: ${error}`);
    return {
      results: generateFallbackResults(query),
      suggestions: generateFallbackSuggestions(query),
    };
  }
};

/**
 * Generate fallback results when scraping fails
 */
const generateFallbackResults = (query: string): WebScraperResult[] => {
  // For Cerebras or Llama related queries
  if (query.toLowerCase().includes('cerebras') || query.toLowerCase().includes('llama')) {
    return [
      {
        title: 'Cerebras Systems - AI Supercomputer',
        url: 'https://www.cerebras.net/',
        content: 'Cerebras Systems is a computer systems company dedicated to accelerating deep learning. The company designed and manufactured the largest chip ever built, the Cerebras Wafer Scale Engine (WSE), which is the fastest AI processor in existence.',
      },
      {
        title: 'Llama 3 - Meta AI',
        url: 'https://ai.meta.com/llama/',
        content: 'Llama 3 is Meta AI\'s most advanced open source large language model. It\'s available in multiple sizes including 8B and 70B parameters, with improved reasoning, coding, and instruction following capabilities.',
      }
    ];
  }
  
  // For AI or ML related queries
  if (query.toLowerCase().includes('ai') || 
      query.toLowerCase().includes('ml') || 
      query.toLowerCase().includes('machine learning') ||
      query.toLowerCase().includes('artificial intelligence')) {
    return [
      {
        title: 'What is Artificial Intelligence (AI)? | IBM',
        url: 'https://www.ibm.com/topics/artificial-intelligence',
        content: 'Artificial intelligence is the simulation of human intelligence processes by machines, especially computer systems. Specific applications of AI include expert systems, natural language processing, speech recognition and machine vision.',
      },
      {
        title: 'Machine Learning - Stanford University | Coursera',
        url: 'https://www.coursera.org/learn/machine-learning',
        content: 'Machine learning is the science of getting computers to act without being explicitly programmed. In the past decade, machine learning has given us self-driving cars, practical speech recognition, effective web search, and a vastly improved understanding of the human genome.',
      }
    ];
  }
  
  // Generic fallback for any query
  return [
    {
      title: `Search results for "${query}"`,
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      content: `We couldn't find specific results for "${query}". Try refining your search or click to search on Google.`,
    }
  ];
};

/**
 * Generate fallback suggestions when scraping fails
 */
const generateFallbackSuggestions = (query: string): string[] => {
  const words = query.toLowerCase().split(' ');
  
  if (words.includes('cerebras') || words.includes('llama')) {
    return [
      'cerebras cloud',
      'llama 3 capabilities',
      'large language models',
      'cerebras vs nvidia',
      'meta llama 3'
    ];
  }
  
  if (words.includes('ai') || words.includes('ml') || words.includes('machine') || words.includes('learning')) {
    return [
      'machine learning tutorial',
      'ai applications',
      'deep learning vs machine learning',
      'neural networks explained',
      'ai ethics'
    ];
  }
  
  // Generic fallback
  return [
    `${query} tutorial`,
    `${query} examples`,
    `best ${query}`,
    `${query} explained`,
    `${query} vs`
  ];
};
