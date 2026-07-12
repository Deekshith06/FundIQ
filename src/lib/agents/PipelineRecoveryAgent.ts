import { UNAVAILABLE } from '@/types/investment';

export class PipelineRecoveryAgent {
  /**
   * Executes an agent task safely.
   * If it fails, attempts a retry. If the retry fails, it catches the error
   * and returns the provided fallback data object (which uses UNAVAILABLE defaults).
   */
  static async executeSafely<T>(
    agentName: string, 
    task: () => Promise<T>, 
    fallback: T, 
    onStatus?: (agent: string, msg: string, status: 'pending' | 'completed' | 'error') => void
  ): Promise<T> {
    onStatus?.(agentName, 'Starting analysis...', 'pending');
    
    try {
      const result = await task();
      onStatus?.(agentName, 'Analysis completed successfully', 'completed');
      return result;
    } catch (error) {
      console.warn(`[PipelineRecoveryAgent] ${agentName} primary attempt failed. Retrying...`);
      onStatus?.(agentName, 'Primary source failed, attempting fallback recovery...', 'pending');
      
      try {
        // Simple immediate retry (in production, we'd add backoff or alternate provider here)
        const retryResult = await task();
        onStatus?.(agentName, 'Recovered via retry mechanism', 'completed');
        return retryResult;
      } catch (retryError) {
        console.error(`[PipelineRecoveryAgent] ${agentName} FATAL. Injecting strict fallbacks.`, retryError);
        onStatus?.(agentName, 'Data unavailable, using strict fallbacks', 'error');
        return fallback;
      }
    }
  }

  /**
   * Helper to generate a default object where every string property is UNAVAILABLE
   */
  static createUnavailableFallback<T extends Record<string, any>>(shape: T): T {
    const fallback = { ...shape };
    for (const key in fallback) {
      if (typeof fallback[key] === 'string') {
        (fallback as any)[key] = UNAVAILABLE;
      } else if (Array.isArray(fallback[key])) {
        (fallback as any)[key] = [];
      } else if (typeof fallback[key] === 'object' && fallback[key] !== null) {
        (fallback as any)[key] = this.createUnavailableFallback(fallback[key]);
      }
    }
    return fallback;
  }
}
