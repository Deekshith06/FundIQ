"use client";

import { InvestmentResult as IInvestmentResult, UNAVAILABLE } from '@/types/investment';
import { useState } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { Download, Share2, Target, Users, ShieldAlert, LineChart, TrendingUp, ShieldCheck, Activity, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Section Header Component ---
function SectionHeader({ num, title, icon: Icon }: { num: number; title: string, icon?: any }) {
  return (
    <div className="flex items-center space-x-3 mb-6">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-blue/10 text-accent-blue font-bold text-sm">
        {num.toString().padStart(2, '0')}
      </div>
      <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center space-x-2">
        {Icon && <Icon className="w-5 h-5 text-accent-blue" />}
        <span>{title}</span>
      </h2>
    </div>
  );
}

// --- Data Row Component ---
function DataRow({ label, value, isUnavailable }: { label: string, value: string | number, isUnavailable?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
      <span className="text-slate-500 font-medium text-sm">{label}</span>
      <span className={cn("font-semibold text-sm", isUnavailable || value === UNAVAILABLE ? "text-slate-400 italic font-mono text-xs" : "text-slate-800")}>
        {value}
      </span>
    </div>
  );
}

export function InvestmentResult({ result }: { result: IInvestmentResult }) {
  const [activeScenario, setActiveScenario] = useState<'bull' | 'base' | 'bear'>('base');

  if (!result.report) {
    return (
      <div className="p-12 text-center text-slate-500 font-mono glass-card">
        FATAL: Quantitative Forecasting data is missing. Please re-run the research pipeline.
      </div>
    );
  }

  const {
    companyIdentity, liveMarket, historicalPrice, financialStatement, valuation,
    businessIntelligence, companyTimeline, growthEngine, competition, management,
    riskAnalysis, newsIntelligence, institutionalOwnership, technicalAnalysis,
    forecast, esg, investmentCommittee, evidenceLedger, confidenceMetrics
  } = result.report;

  const currentScenario = activeScenario === 'bull' ? forecast.bullCase : activeScenario === 'bear' ? forecast.bearCase : forecast.baseCase;

  return (
    <div className="max-w-6xl mx-auto pb-24 font-sans space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* HEADER */}
      <header className="glass-card p-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-sm mb-4 font-mono">
            <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
            <span>20-Agent Pipeline Active</span>
          </div>
          <h1 className="text-5xl font-bold mb-3 tracking-tight text-slate-900">
            {companyIdentity.name}
          </h1>
          <div className="text-lg text-slate-600 flex items-center space-x-3">
            <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-sm font-semibold text-slate-800">
              {companyIdentity.exchange !== UNAVAILABLE ? `${companyIdentity.exchange}:${companyIdentity.ticker}` : companyIdentity.ticker}
            </span>
            <span>•</span>
            <span>{companyIdentity.sector}</span>
            <span>•</span>
            <span>{companyIdentity.country}</span>
          </div>
        </div>
        <div className="text-right relative z-10 w-full md:w-auto flex flex-row md:flex-col justify-between md:justify-end items-center md:items-end gap-4">
          <div className="text-sm text-slate-500 font-mono">{new Date(result.timestamp).toLocaleString()}</div>
          <div className="flex space-x-3">
            <button onClick={() => window.print()} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-accent-blue transition-colors shadow-sm text-slate-600">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-accent-blue transition-colors shadow-sm text-slate-600">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 01. EXECUTIVE SUMMARY & 02. LIVE MARKET OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="glass-card p-8 lg:col-span-2">
          <SectionHeader num={1} title="Executive Summary & Verdict" icon={Zap} />
          <div className="glass-panel p-6 mb-6">
             <div className="text-xs uppercase font-bold text-slate-500 mb-2">Company Overview</div>
             <p className="text-slate-800 leading-relaxed font-medium">{companyIdentity.description}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel p-4 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Overall Confidence</div>
              <div className="text-2xl font-bold text-accent-blue">{confidenceMetrics.overallConfidence}</div>
            </div>
            <div className="glass-panel p-4 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Expected Return</div>
              <div className="text-2xl font-bold text-accent-emerald">{forecast.baseCase.expectedCagr}</div>
            </div>
            <div className="glass-panel p-4 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Market Cap</div>
              <div className="text-2xl font-bold text-slate-800">{liveMarket.marketCap}</div>
            </div>
            <div className="glass-panel p-4 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Risk Impact</div>
              <div className="text-2xl font-bold text-accent-danger">{riskAnalysis.macroeconomics.impact}</div>
            </div>
          </div>
        </section>
        
        <section className="glass-card p-8">
          <SectionHeader num={2} title="Live Market" icon={Activity} />
          <div className="space-y-1">
            <DataRow label="Current Price" value={liveMarket.price} />
            <DataRow label="Enterprise Value" value={liveMarket.enterpriseValue} />
            <DataRow label="Volume" value={liveMarket.volume} />
            <DataRow label="Avg Volume" value={liveMarket.averageVolume} />
            <DataRow label="Dividend Yield" value={liveMarket.dividendYield} />
            <DataRow label="P/E Ratio" value={liveMarket.peRatio} />
            <DataRow label="PEG Ratio" value={liveMarket.pegRatio} />
            <DataRow label="Beta" value={liveMarket.beta} />
            <DataRow label="52W High" value={liveMarket.fiftyTwoWeekHigh} />
            <DataRow label="52W Low" value={liveMarket.fiftyTwoWeekLow} />
          </div>
        </section>
      </div>

      {/* 03. LIVE CHART */}
      {historicalPrice.chartData1Y && historicalPrice.chartData1Y.length > 0 && (
        <section className="glass-card p-8 mb-8">
          <SectionHeader num={3} title="1-Year Price Chart" icon={LineChart} />
          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalPrice.chartData1Y}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return `${d.getMonth() + 1}/${d.getFullYear().toString().slice(2)}`;
                  }}
                  stroke="#94a3b8" 
                  fontSize={12} 
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tickFormatter={(val) => `$${val}`}
                  stroke="#94a3b8" 
                  fontSize={12} 
                  orientation="right"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#10b981' }}
                  labelFormatter={(val) => new Date(val).toLocaleDateString()}
                  formatter={(val: number) => [`$${val.toFixed(2)}`, 'Price']}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* 04. FINANCIAL STATEMENT & 05. VALUATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="glass-card p-8">
          <SectionHeader num={4} title="Financial Statements" />
          <div className="space-y-1 glass-panel p-4">
            <DataRow label="Revenue" value={financialStatement.revenue} />
            <DataRow label="Net Income" value={financialStatement.netIncome} />
            <DataRow label="EPS" value={financialStatement.eps} />
            <DataRow label="Gross Margin" value={financialStatement.grossMargin} />
            <DataRow label="Operating Margin" value={financialStatement.operatingMargin} />
            <DataRow label="Free Cash Flow" value={financialStatement.freeCashFlow} />
            <DataRow label="ROE" value={financialStatement.roe} />
            <DataRow label="ROIC" value={financialStatement.roic} />
            <DataRow label="Total Debt" value={financialStatement.debt} />
            <DataRow label="Cash" value={financialStatement.cash} />
          </div>
        </section>
        
        <section className="glass-card p-8">
          <SectionHeader num={5} title="Valuation Analysis" icon={TrendingUp} />
          <div className="space-y-1 glass-panel p-4 h-full">
            <DataRow label="Intrinsic Value" value={valuation.intrinsicValue} />
            <DataRow label="Fair Value Approx" value={valuation.fairValue} />
            <DataRow label="DCF Model" value={valuation.dcf} />
            <DataRow label="Margin of Safety" value={valuation.marginOfSafety} />
            <div className="mt-6 mb-2 border-b border-slate-200 pb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Relative Metrics</span>
            </div>
            <DataRow label="EV/EBITDA" value={valuation.evToEbitda} />
            <DataRow label="Price to Book (P/B)" value={valuation.priceToBook} />
            <DataRow label="Price to Sales (P/S)" value={valuation.priceToSales} />
            <DataRow label="Peer Comparison" value={valuation.peerComparison} />
          </div>
        </section>
      </div>

      {/* 06. BUSINESS INTEL & 08. GROWTH ENGINE & 09. COMPETITION */}
      <section className="glass-card p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <SectionHeader num={6} title="Business Model" />
            <p className="text-sm text-slate-700 leading-relaxed mb-4">{businessIntelligence.businessModel}</p>
            <div className="space-y-1 bg-white/50 p-4 rounded-xl">
              <DataRow label="Revenue Geo" value={businessIntelligence.geographicRevenue} />
              <DataRow label="Customer Mix" value={businessIntelligence.customerTypes} />
              <DataRow label="Moat" value={businessIntelligence.competitiveMoat} />
            </div>
          </div>
          <div>
            <SectionHeader num={8} title="Growth Engine" />
            <div className="space-y-1 bg-white/50 p-4 rounded-xl">
              <DataRow label="Revenue Forecast" value={growthEngine.forecastRevenue} />
              <DataRow label="EPS Forecast" value={growthEngine.forecastEps} />
              <DataRow label="Margin Exp" value={growthEngine.forecastMargins} />
              <DataRow label="Future Products" value={growthEngine.futureProducts} />
              <DataRow label="AI Strategy" value={growthEngine.aiStrategy} />
              <DataRow label="Expansion" value={growthEngine.expansion} />
            </div>
          </div>
          <div>
            <SectionHeader num={9} title="Competition" />
            <div className="space-y-1 bg-white/50 p-4 rounded-xl">
              <DataRow label="Market Share" value={competition.marketShare} />
              <DataRow label="Pricing Power" value={competition.pricingPower} />
              <DataRow label="Innovation" value={competition.innovation} />
              <DataRow label="Brand Strength" value={competition.brand} />
              <DataRow label="SWOT Summary" value={competition.swot} />
            </div>
          </div>
        </div>
      </section>

      {/* 11. RISK ANALYSIS */}
      <section className="glass-card p-8">
        <SectionHeader num={11} title="Risk Matrix Engine" icon={ShieldAlert} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(riskAnalysis).map(([key, risk]: [string, any]) => (
            <div key={key} className="glass-panel p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-slate-800 text-lg capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                <div className="flex flex-col gap-1 items-end">
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Prob: {risk.probability}</span>
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Impact: {risk.impact}</span>
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-4 flex-1">{risk.description}</p>
              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">Mitigation</span>
                <p className="text-xs text-slate-700">{risk.mitigation}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 15, 16. FORECAST SCENARIO SIMULATION */}
      <section className="glass-card p-8">
        <SectionHeader num={15} title="Forecast & Scenario Simulation" icon={LineChart} />
        <div className="glass-panel overflow-hidden">
          <div className="flex p-2 bg-slate-100/50">
            {(['bear', 'base', 'bull'] as const).map(scenario => (
              <button
                key={scenario}
                onClick={() => setActiveScenario(scenario)}
                className={cn(
                  "flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-all rounded-xl",
                  activeScenario === scenario 
                    ? (scenario === 'bull' ? 'bg-accent-emerald text-white shadow-md' : scenario === 'bear' ? 'bg-accent-danger text-white shadow-md' : 'bg-accent-blue text-white shadow-md')
                    : "text-slate-500 hover:bg-slate-200"
                )}
              >
                {scenario} Case
              </button>
            ))}
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Probability', val: currentScenario.probability },
                { label: 'Expected Price', val: currentScenario.expectedPriceRange },
                { label: 'Target CAGR', val: currentScenario.expectedCagr },
                { label: 'Expected EPS', val: currentScenario.expectedEps },
                { label: 'Expected Revenue', val: currentScenario.expectedRevenue }
              ].map((stat, i) => (
                <div key={i} className="bg-white/50 border border-slate-100 rounded-xl p-4 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-wider">{stat.label}</div>
                  <div className={cn("text-xl font-bold", stat.val === UNAVAILABLE ? "text-slate-400 font-mono text-sm" : "text-slate-800")}>
                    {stat.val}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white/60 p-6 rounded-2xl border border-slate-100">
              <h4 className="text-sm font-bold uppercase mb-3 text-slate-800">Assumptions & Reasoning</h4>
              <p className={cn("text-sm leading-relaxed", currentScenario.assumptions === UNAVAILABLE ? "text-slate-400 italic" : "text-slate-700")}>
                {currentScenario.assumptions}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 12, 13, 14, 17: NEWS, INST, TECH, ESG */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <section className="glass-card p-6">
          <SectionHeader num={12} title="News" />
          <div className="space-y-2 text-sm text-slate-700">
            <DataRow label="Earnings" value={newsIntelligence.earnings} />
            <DataRow label="Upgrades" value={newsIntelligence.analystUpgrades} />
            <DataRow label="Downgrades" value={newsIntelligence.downgrades} />
            <DataRow label="Inst Buying" value={newsIntelligence.institutionalBuying} />
          </div>
        </section>
        <section className="glass-card p-6">
          <SectionHeader num={13} title="Institutions" />
          <div className="space-y-2 text-sm text-slate-700">
            <DataRow label="Mutual Funds" value={institutionalOwnership.mutualFunds} />
            <DataRow label="ETFs" value={institutionalOwnership.etfs} />
            <DataRow label="Hedge Funds" value={institutionalOwnership.hedgeFunds} />
            <DataRow label="Recent Buy" value={institutionalOwnership.recentBuying} />
          </div>
        </section>
        <section className="glass-card p-6">
          <SectionHeader num={14} title="Technical" />
          <div className="space-y-2 text-sm text-slate-700">
            <DataRow label="RSI" value={technicalAnalysis.rsi} />
            <DataRow label="MACD" value={technicalAnalysis.macd} />
            <DataRow label="Trend" value={technicalAnalysis.trend} />
            <DataRow label="Breakout" value={technicalAnalysis.breakoutProbability} />
          </div>
        </section>
        <section className="glass-card p-6">
          <SectionHeader num={17} title="ESG" />
          <div className="space-y-2 text-sm text-slate-700">
            <DataRow label="Environmental" value={esg.environmental} />
            <DataRow label="Social" value={esg.social} />
            <DataRow label="Governance" value={esg.governance} />
            <DataRow label="Carbon Goals" value={esg.carbonGoals} />
          </div>
        </section>
      </div>

      {/* 18. COMMITTEE & 19. EVIDENCE LEDGER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="glass-card p-8">
          <SectionHeader num={18} title="Investment Committee" icon={Users} />
          <div className="space-y-3">
            {[
              { expert: 'Growth Investor', vote: investmentCommittee.growthInvestor.vote },
              { expert: 'Value Investor', vote: investmentCommittee.valueInvestor.vote },
              { expert: 'Risk Manager', vote: investmentCommittee.riskManager.vote },
              { expert: 'Macro Strategist', vote: investmentCommittee.macroStrategist.vote },
              { expert: 'Quant Analyst', vote: investmentCommittee.quantAnalyst.vote },
            ].map((member, i) => (
              <div key={i} className="flex justify-between items-center p-4 glass-panel">
                <span className="font-semibold text-slate-700 text-sm">{member.expert}</span>
                <span className={cn(
                  "text-xs font-bold px-3 py-1 uppercase rounded-full border border-slate-200 text-slate-500",
                  member.vote !== UNAVAILABLE && member.vote === 'BUY' ? "bg-accent-emerald/20 text-accent-emerald border-accent-emerald/30" : ""
                )}>
                  {member.vote}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card p-8">
          <SectionHeader num={19} title="Confidence Metrics" icon={ShieldCheck} />
          <div className="glass-panel p-6 space-y-4">
            <DataRow label="Data Completeness" value={confidenceMetrics.dataCompleteness} />
            <DataRow label="Source Diversity" value={confidenceMetrics.sourceDiversity} />
            <DataRow label="Agent Agreement" value={confidenceMetrics.agreement} />
            <DataRow label="Provider Reliability" value={confidenceMetrics.providerReliability} />
            <DataRow label="Freshness" value={confidenceMetrics.freshness} />
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="font-bold text-slate-800">Overall Confidence Rating</span>
              <span className="font-mono font-bold text-accent-blue">{confidenceMetrics.overallConfidence}</span>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}