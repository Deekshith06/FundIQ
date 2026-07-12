"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, Command, ArrowRight } from 'lucide-react';
import { useInvestmentAgent } from '@/hooks/useInvestmentAgent';
import { AITerminalLoader } from './AITerminalLoader';
import { InvestmentResult } from './InvestmentResult';
import { cn } from '@/lib/utils';

const trending = ["Apple", "NVIDIA", "Microsoft", "TSMC", "OpenAI", "Palantir"];
const recent = ["Apple", "Tesla"];

export default function ResearchInterface() {
  const [companyInput, setCompanyInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { researchCompany, researchResult, error, clearResults, liveStatus } = useInvestmentAgent();

  // Handle Command+K to focus search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSubmit = async (e?: React.FormEvent, directInput?: string) => {
    e?.preventDefault();
    const query = directInput || companyInput;
    if (!query.trim()) return;

    setCompanyInput(query);
    setIsProcessing(true);
    clearResults();

    try {
      await researchCompany(query);
    } catch (err) {
      console.error('Research failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setCompanyInput('');
    clearResults();
  };

  if (isProcessing) {
    return (
      <div className="w-full mt-12">
        <AITerminalLoader company={companyInput} liveStatus={liveStatus} />
      </div>
    );
  }

  if (researchResult) {
    return (
      <div className="w-full mt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="mb-6 flex justify-between items-center">
          <button 
            onClick={handleClear}
            className="text-slate-500 hover:text-slate-900 flex items-center space-x-2 text-sm transition-colors"
          >
            ← Back to Search
          </button>
        </div>
        <InvestmentResult result={researchResult} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 relative z-20">
      {/* Main Search Bar */}
      <motion.form 
        onSubmit={handleSubmit}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          "relative group transition-all duration-500",
          isFocused ? "scale-[1.02]" : "scale-100"
        )}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-accent-blue/30 via-accent-emerald/30 to-accent-purple/30 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-white/40 backdrop-blur-2xl border border-white/80 rounded-full p-2 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)]">
          <Search className="w-6 h-6 text-slate-400 ml-6" />
          <input
            ref={inputRef}
            type="text"
            value={companyInput}
            onChange={(e) => setCompanyInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Research any public company..."
            className="w-full bg-transparent border-none text-xl text-slate-900 px-6 py-4 focus:outline-none placeholder:text-slate-400"
          />
          <div className="flex items-center space-x-4 mr-4">
            <Mic className="w-5 h-5 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" />
            <div className="hidden sm:flex items-center space-x-1 px-3 py-1.5 bg-white/50 rounded-full border border-white/60 text-slate-500 text-xs font-mono shadow-sm">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
            <button
              type="submit"
              disabled={!companyInput.trim()}
              className="p-4 bg-accent-blue hover:bg-blue-600 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(37,99,235,0.3)]"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.form>

      {/* Suggestions */}
      <AnimatePresence>
        {isFocused && !companyInput && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 top-full mt-4 p-6 glass-card border-t-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Recent</h3>
                <div className="space-y-2">
                  {recent.map(company => (
                    <div 
                      key={company} 
                      onMouseDown={(e) => { e.preventDefault(); handleSubmit(undefined, company); }}
                      className="flex items-center space-x-3 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-accent-blue/50" />
                      <span className="text-sm text-slate-700 hover:text-slate-900">{company}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center space-x-2">
                  <span>Trending</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trending.map(company => (
                    <div 
                      key={company}
                      onMouseDown={(e) => { e.preventDefault(); handleSubmit(undefined, company); }}
                      className="px-4 py-1.5 text-sm bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full cursor-pointer transition-colors text-slate-600 hover:text-slate-900"
                    >
                      {company}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="mt-8 p-4 bg-accent-danger/20 border border-accent-danger/50 rounded-xl text-red-400">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}