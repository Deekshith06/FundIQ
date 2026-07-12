import { SearchProvider, SearchResult } from './types';
import { categorizeSource } from './verification';

export class SerperSearchProvider implements SearchProvider {
  async search(query: string, options: any = {}): Promise<SearchResult[]> {
    const apiKey = process.env.SERPER_API_KEY;
    if (!apiKey) throw new Error('SERPER_API_KEY not set');

    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
      body: JSON.stringify({
        q: query,
        num: 10,
      }),
    });

    if (!response.ok) {
      throw new Error(`Serper API error: ${response.statusText}`);
    }

    const data = await response.json();

    return (data.organic || []).map((result: any) => {
      const category = categorizeSource(result.link);
      return {
        title: result.title,
        url: result.link,
        snippet: result.snippet,
        publishedDate: result.date,
        publisher: new URL(result.link).hostname,
        confidence: 75,
        trustScore: 75,
        sourceCategory: category,
      };
    });
  }
}
