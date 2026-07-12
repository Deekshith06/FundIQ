import ResearchInterface from '@/components/ResearchInterface';
import { Shield, Brain, Activity, LineChart, Globe, Briefcase, Zap, CheckCircle } from 'lucide-react';

const marketStats = [
  { label: 'NASDAQ', value: '16,248.52', change: '+0.81%', isPositive: true },
  { label: 'S&P 500', value: '5,147.21', change: '+0.34%', isPositive: true },
  { label: 'Gold', value: '$2,168.30', change: '+0.12%', isPositive: true },
  { label: 'Crude Oil', value: '$81.04', change: '-0.24%', isPositive: false },
];

const agents = [
  { name: 'Financial Analysis', icon: LineChart },
  { name: 'Risk Assessment', icon: Shield },
  { name: 'News Sentinel', icon: Globe },
  { name: 'Macro Trends', icon: Activity },
  { name: 'Patent Database', icon: Briefcase },
  { name: 'Live Verification', icon: CheckCircle },
  { name: 'AI Committee', icon: Brain },
  { name: 'Execution', icon: Zap },
];

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col">


      <div className="flex-1 container mx-auto px-4 pt-16 pb-24 relative z-10 flex flex-col items-center">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-sm mb-6 font-mono">
            <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
            <span>v2.4 Enterprise Core Online</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Enterprise Investment <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-accent-emerald to-accent-purple">
              Intelligence
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Research public companies using 40 autonomous AI agents. 
            Live market data, multi-source verification, and institutional analysis.
          </p>
        </div>

        {/* Search Interface */}
        <div className="w-full relative z-20">
          <ResearchInterface />
        </div>

        {/* Dashboards - Below Search */}
        <div className="w-full max-w-5xl mx-auto mt-24 grid grid-cols-1 lg:grid-cols-3 gap-6 opacity-0 animate-[fade-in_1s_ease-out_1s_forwards]">
          
          {/* Market Overview */}
          <div className="glass-card col-span-1 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Live Market Overview</h3>
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-emerald"></span>
                </span>
                <span className="text-xs text-accent-emerald font-mono">MARKET OPEN</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {marketStats.map(stat => (
                <div key={stat.label} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-500 text-xs mb-1">{stat.label}</div>
                  <div className="text-xl font-semibold mb-1">{stat.value}</div>
                  <div className={`text-sm ${stat.isPositive ? 'text-accent-emerald' : 'text-accent-danger'}`}>
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Identity Grid */}
          <div className="glass-card">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6">40 Agents Ready</h3>
            <div className="grid grid-cols-2 gap-3">
              {agents.map(agent => (
                <div key={agent.name} className="flex items-center space-x-2 text-sm text-slate-600">
                  <agent.icon className="w-4 h-4 text-accent-blue" />
                  <span className="truncate">{agent.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}