import { SearchProvider, SearchResult } from './types';
import { categorizeSource } from './verification';

export class TavilySearchProvider implements SearchProvider {
  async search(query: string, options: any = {}): Promise<SearchResult[]> {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) throw new Error('TAVILY_API_KEY not set');

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: 'advanced',
        include_domains: options.includeDomains || [],
        exclude_domains: options.excludeDomains || [],
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily error: ${response.statusText}`);
    }

    const data = await response.json();

    return (data.results || []).map((result: any) => {
      const category = categorizeSource(result.url);
      return {
        title: result.title,
        url: result.url,
        snippet: result.content,
        publishedDate: result.published_date, // If tavily provides it
        publisher: new URL(result.url).hostname,
        confidence: result.score || 80,
        trustScore: 85,
        sourceCategory: category,
      };
    });
  }
}
