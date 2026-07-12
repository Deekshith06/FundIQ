import { SearchResult } from './types';
import { TavilySearchProvider } from './tavily';
import { ExaSearchProvider } from './exa';
import { SerperSearchProvider } from './serper';
import { verifyAndRankResults } from './verification';

export async function performEnterpriseSearch(query: string): Promise<SearchResult[]> {
  const providers = [
    new TavilySearchProvider(),
    new ExaSearchProvider(),
    new SerperSearchProvider()
  ];

  let rawResults: SearchResult[] = [];
  let providerUsed = '';
  let lastError: Error | null = null;

  for (const provider of providers) {
    try {
      rawResults = await provider.search(query);
      if (rawResults && rawResults.length > 0) {
        providerUsed = provider.constructor.name;
        break; // Successfully got results, stop fallback
      }
    } catch (error) {
      console.warn(`Search provider ${provider.constructor.name} failed:`, error);
      lastError = error as Error;
      // Continue to next fallback provider
    }
  }

  if (rawResults.length === 0) {
    if (lastError) {
      throw new Error(`All search providers failed. Last error: ${lastError.message}`);
    } else {
      return []; // No results found, but no explicit error
    }
  }

  // Verification Pipeline
  const verifiedResults = verifyAndRankResults(rawResults);

  // You can optionally log or attach the providerUsed to the results or observability metrics here.
  
  return verifiedResults;
}
