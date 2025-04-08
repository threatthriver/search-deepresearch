import { getSearxngApiEndpoint } from '@/lib/config';
import axios from 'axios';

// Define search status types
type SearchStatus = 'available' | 'fallback' | 'unavailable';

export const GET = async () => {
  try {
    const searxngURL = getSearxngApiEndpoint();
    let status: SearchStatus = 'unavailable';
    let message = '';

    // If no SearxNG URL is configured
    if (!searxngURL) {
      status = 'fallback';
      message = 'SearxNG URL not configured. Using web scraping fallback.';
    } else {
      // Try to connect to SearxNG
      try {
        await axios.get(`${searxngURL}/healthz`, { timeout: 2000 });
        status = 'available';
        message = 'SearxNG is available and working properly.';
      } catch (error) {
        console.warn(`SearxNG health check failed: ${error}`);
        status = 'fallback';
        message = 'Could not connect to SearxNG. Using web scraping fallback.';
      }
    }

    return Response.json({
      status,
      message,
      available: status === 'available',
      fallback: status === 'fallback'
    });
  } catch (error) {
    console.error(`Error checking search status: ${error}`);
    return Response.json({
      status: 'fallback' as SearchStatus,
      message: 'Error checking search status. Using web scraping fallback.',
      available: false,
      fallback: true
    });
  }
};
