"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, CheckCircle2, CircleDashed, AlertTriangle } from 'lucide-react';
import { ResearchStatusUpdate } from '@/hooks/useInvestmentAgent';

const TIMEOUT_WARNING_MS = 60_000; // Show warning after 60s

export function AITerminalLoader({ company, liveStatus = [] }: { company: string, liveStatus?: ResearchStatusUpdate[] }) {
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTimeout(true), TIMEOUT_WARNING_MS);
    return () => clearTimeout(timer);
  }, []);

  // Create a display list from the liveStatus, keeping only the latest running action per agent to avoid clutter
  const displaySteps = liveStatus.reduce((acc: ResearchStatusUpdate[], curr) => {
    if (curr.status === 'completed') {
      acc.push(curr);
    } else {
      // If running, replace the previous running step for this agent
      const existingIdx = acc.findIndex(s => s.agent === curr.agent && s.status === 'running');
      if (existingIdx >= 0) {
        acc[existingIdx] = curr;
      } else {
        acc.push(curr);
      }
    }
    return acc;
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card max-w-3xl mx-auto w-full font-mono border-accent-emerald/30 relative overflow-hidden"
    >
      {/* Subtle animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-emerald/5 to-accent-blue/5 animate-pulse" />

      <div className="relative z-10 p-6">
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-200">
          <Terminal className="w-5 h-5 text-accent-emerald" />
          <h2 className="text-lg text-accent-emerald tracking-widest font-semibold uppercase">
            AEGIS AI TERMINAL
          </h2>
        </div>

        <div className="space-y-4 mb-8 text-sm">
          <div className="text-slate-600">
            <span className="text-accent-blue font-semibold">Target:</span> {company}
          </div>
          
          <div className="text-slate-500 text-xs mt-4 mb-2 uppercase tracking-widest">Live Execution Log</div>

          <div className="flex flex-col space-y-3">
            {displaySteps.length === 0 && (
              <div className="flex items-center space-x-3">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                  <CircleDashed className="w-4 h-4 text-accent-blue flex-shrink-0" />
                </motion.div>
                <span className="text-slate-400">Initializing orchestrator...</span>
              </div>
            )}
            
            {displaySteps.map((step, index) => {
              const isCompleted = step.status === 'completed';

              return (
                <motion.div 
                  key={`${step.agent}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start space-x-3"
                >
                  <div className="mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-accent-emerald flex-shrink-0" />
                    ) : (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                        <CircleDashed className="w-4 h-4 text-accent-blue flex-shrink-0" />
                      </motion.div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-accent-blue mb-0.5">{step.agent}</div>
                    <div className={isCompleted ? "text-slate-800" : "text-slate-600 glow-text"}>
                      {step.action}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Timeout Warning */}
        {showTimeout && (
          <div className="mb-4 p-3 bg-accent-amber/10 border border-accent-amber/30 rounded-xl flex items-start space-x-3">
            <AlertTriangle className="w-4 h-4 text-accent-amber mt-0.5 flex-shrink-0" />
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-accent-amber">Taking longer than expected.</span>{' '}
              Free-tier AI models can be slow during peak hours. The analysis is still running — please wait.
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-accent-blue animate-pulse">Running agents & searching web...</span>
          </div>
          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-accent-blue opacity-50"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
