import { SearchProvider, SearchResult } from './types';
import { categorizeSource } from './verification';

export class ExaSearchProvider implements SearchProvider {
  async search(query: string, options: any = {}): Promise<SearchResult[]> {
    const apiKey = process.env.EXA_API_KEY;
    if (!apiKey) throw new Error('EXA_API_KEY not set');

    const response = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        query,
        useAutoprompt: true,
        type: 'neural',
        contents: {
          text: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Exa API error: ${response.statusText}`);
    }

    const data = await response.json();

    return (data.results || []).map((result: any) => {
      const category = categorizeSource(result.url);
      return {
        title: result.title,
        url: result.url,
        snippet: result.text || result.snippet, // Exa returns text if requested
        publishedDate: result.publishedDate,
        publisher: new URL(result.url).hostname,
        confidence: result.score || 80,
        trustScore: 80,
        sourceCategory: category,
      };
    });
  }
}
