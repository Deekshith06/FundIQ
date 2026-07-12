import { useState, useCallback, useRef } from 'react';
import { InvestmentResult } from '@/types/investment';

export interface ResearchStatusUpdate {
  agent: string;
  action: string;
  status: 'running' | 'completed' | 'error';
}

const REQUEST_TIMEOUT_MS = 120_000; // 2 minutes overall timeout

export function useInvestmentAgent() {
  const [researchResult, setResearchResult] = useState<InvestmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [liveStatus, setLiveStatus] = useState<ResearchStatusUpdate[]>([]);
  const [isResearching, setIsResearching] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const researchCompany = useCallback(async (companyInput: string) => {
    setError(null);
    setResearchResult(null);
    setLiveStatus([]);
    setIsResearching(true);

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Set overall timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: companyInput }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to start research: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response body from server');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      // SSE line buffer — handles chunks that split across frame boundaries
      let lineBuffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        lineBuffer += decoder.decode(value, { stream: true });
        
        // Process complete lines from the buffer
        const lines = lineBuffer.split('\n');
        // Keep the last (potentially incomplete) line in the buffer
        lineBuffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim(); // More robust than replace
            if (!dataStr) continue;
            
            try {
              const payload = JSON.parse(dataStr);
              
              if (payload.type === 'status') {
                setLiveStatus(prev => [...prev, payload.data]);
              } else if (payload.type === 'complete') {
                setResearchResult(payload.data);
                setIsResearching(false);
              } else if (payload.type === 'error') {
                // RC-12 fix: properly propagate errors instead of swallowing them
                setError(payload.data.message || 'An error occurred during research');
                setIsResearching(false);
              }
            } catch (parseError) {
              // Only warn for genuine parse failures, not for error propagation
              console.warn('[SSE] Failed to parse payload:', dataStr.slice(0, 100), parseError);
            }
          }
        }
      }

      // Process any remaining data in the buffer
      if (lineBuffer.startsWith('data: ')) {
        const dataStr = lineBuffer.slice(6).trim();
        if (dataStr) {
          try {
            const payload = JSON.parse(dataStr);
            if (payload.type === 'complete') {
              setResearchResult(payload.data);
              setIsResearching(false);
            } else if (payload.type === 'error') {
              setError(payload.data.message || 'An error occurred during research');
              setIsResearching(false);
            }
          } catch {
            // Incomplete final chunk — acceptable
          }
        }
      }

    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        setError('Research request timed out. Please try again.');
      } else {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
      setIsResearching(false);
    } finally {
      clearTimeout(timeoutId);
    }
  }, []);

  const clearResults = useCallback(() => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setResearchResult(null);
    setError(null);
    setLiveStatus([]);
    setIsResearching(false);
  }, []);

  return {
    researchCompany,
    researchResult,
    error,
    clearResults,
    liveStatus,
    isResearching
  };
}
