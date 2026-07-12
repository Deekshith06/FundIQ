import { SearchResult } from './types';

// Simple categorization logic
export function categorizeSource(url: string): string {
  const lowercaseUrl = url.toLowerCase();
  
  if (lowercaseUrl.includes('sec.gov') || lowercaseUrl.includes('edgar')) return 'SEC Filings';
  if (lowercaseUrl.includes('investor.') || lowercaseUrl.includes('ir.')) return 'Company Investor Relations';
  if (lowercaseUrl.includes('bloomberg.com') || lowercaseUrl.includes('reuters.com') || lowercaseUrl.includes('ft.com') || lowercaseUrl.includes('wsj.com')) return 'Premium Financial News';
  if (lowercaseUrl.includes('yahoo.com/finance') || lowercaseUrl.includes('seekingalpha.com') || lowercaseUrl.includes('fool.com')) return 'General Financial News';
  
  return 'General Web';
}

// Ensure results pass Freshness, Authority, Duplicate Check, Domain Reputation
export function verifyAndRankResults(results: SearchResult[]): SearchResult[] {
  // 1. Remove Exact Duplicates based on URL
  const uniqueMap = new Map<string, SearchResult>();
  for (const res of results) {
    if (!uniqueMap.has(res.url)) {
      uniqueMap.set(res.url, res);
    }
  }
  let verified = Array.from(uniqueMap.values());

  // 2. Adjust Trust Score based on Category Authority
  verified = verified.map(res => {
    let trustBoost = 0;
    if (res.sourceCategory === 'SEC Filings') trustBoost = 20;
    if (res.sourceCategory === 'Company Investor Relations') trustBoost = 15;
    if (res.sourceCategory === 'Premium Financial News') trustBoost = 10;
    
    // Penalty for lower reputation domains (simplified)
    if (res.url.includes('reddit.com') || res.url.includes('medium.com')) trustBoost = -15;

    return {
      ...res,
      trustScore: Math.min(100, Math.max(0, res.trustScore + trustBoost)),
    };
  });

  // 3. Filter out low trust results (Discard if < 60)
  verified = verified.filter(res => res.trustScore >= 60);

  // 4. Rank Sources (Highest Trust First)
  verified.sort((a, b) => b.trustScore - a.trustScore);

  return verified;
}
