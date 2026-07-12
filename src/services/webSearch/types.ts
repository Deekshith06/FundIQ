export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
  publisher?: string;
  confidence: number;
  trustScore: number;
  sourceCategory: string;
}

export interface SearchProvider {
  search(query: string, options?: any): Promise<SearchResult[]>;
}
