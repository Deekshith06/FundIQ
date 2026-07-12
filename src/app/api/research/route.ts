import { NextRequest, NextResponse } from 'next/server';
import { PipelineRecoveryAgent } from '@/lib/agents/PipelineRecoveryAgent';
import { CompanyIdentityAgent, BusinessIntelligenceAgent, CompanyTimelineAgent, ManagementAgent } from '@/lib/agents/FundamentalAgents';
import { LiveMarketAgent, HistoricalPriceAgent, TechnicalAnalysisAgent } from '@/lib/agents/MarketAgents';
import { FinancialStatementAgent, ValuationAgent, GrowthEngineAgent } from '@/lib/agents/FinancialAgents';
import { RiskAgent, CompetitionAgent, ESGAgent } from '@/lib/agents/RiskAndESGAgents';
import { NewsIntelligenceAgent, InstitutionalOwnershipAgent } from '@/lib/agents/NewsAndInstAgents';
import { ForecastAgent, InvestmentCommitteeAgent, EvidenceAgent, ConfidenceAgent } from '@/lib/agents/CommitteeAgents';
import { FullResearchReport, InvestmentResult, ResearchStep, UNAVAILABLE } from '@/types/investment';
import yahooFinance from '@/lib/yahoo-finance';

export const maxDuration = 120; // Allow up to 120s for the full pipeline

export async function POST(req: NextRequest) {
  const { company } = await req.json();

  if (!company) {
    return NextResponse.json({ error: 'Company name or ticker is required' }, { status: 400 });
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`[Research Pipeline] Starting 20-Agent orchestration for: "${company}"`);
  console.log(`[Research Pipeline] Timestamp: ${new Date().toISOString()}`);
  console.log(`${'='.repeat(60)}`);

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const researchSteps: ResearchStep[] = [];
      const startTime = Date.now();

      const sendUpdate = (agent: string, action: string, status: 'pending' | 'completed' | 'error', isSSE = true) => {
        const step = { agent, action, status, timestamp: new Date().toISOString() };
        researchSteps.push(step);
        if (isSSE) {
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'status', data: step })}\n\n`));
          } catch {
            // client disconnected
          }
        }
      };

      try {
        let actualTicker = company;
        
        // Resolve plain text name to Ticker symbol
        try {
          const searchRes = await yahooFinance.search(company);
          if (searchRes.quotes && searchRes.quotes.length > 0) {
            actualTicker = searchRes.quotes[0].symbol;
            sendUpdate('Search', 'Resolved Ticker: ' + actualTicker, 'completed');
          }
        } catch (e) {
          console.warn('Failed to resolve ticker via search, falling back to query');
        }

        // Instantiate all 20 agents
        const agents = {
          identity: new CompanyIdentityAgent(),
          business: new BusinessIntelligenceAgent(),
          timeline: new CompanyTimelineAgent(),
          management: new ManagementAgent(),
          liveMarket: new LiveMarketAgent(),
          historical: new HistoricalPriceAgent(),
          technical: new TechnicalAnalysisAgent(),
          financial: new FinancialStatementAgent(),
          valuation: new ValuationAgent(),
          growth: new GrowthEngineAgent(),
          risk: new RiskAgent(),
          competition: new CompetitionAgent(),
          esg: new ESGAgent(),
          news: new NewsIntelligenceAgent(),
          institutional: new InstitutionalOwnershipAgent(),
          forecast: new ForecastAgent(),
          committee: new InvestmentCommitteeAgent(),
          evidence: new EvidenceAgent(),
          confidence: new ConfidenceAgent()
        };

        // We run everything concurrently via Promise.allSettled and PipelineRecoveryAgent
        const [
          companyIdentity, businessIntelligence, companyTimeline, management,
          liveMarket, historicalPrice, technicalAnalysis,
          financialStatement, valuation, growthEngine,
          riskAnalysis, competition, esg,
          newsIntelligence, institutionalOwnership,
          forecast, investmentCommittee, evidenceLedger, confidenceMetrics
        ] = await Promise.all([
          PipelineRecoveryAgent.executeSafely('CompanyIdentityAgent', () => agents.identity.run(actualTicker), PipelineRecoveryAgent.createUnavailableFallback({} as any), sendUpdate),
          PipelineRecoveryAgent.executeSafely('BusinessIntelligenceAgent', () => agents.business.run(actualTicker), PipelineRecoveryAgent.createUnavailableFallback({} as any), sendUpdate),
          PipelineRecoveryAgent.executeSafely('CompanyTimelineAgent', () => agents.timeline.run(actualTicker), PipelineRecoveryAgent.createUnavailableFallback({} as any), sendUpdate),
          PipelineRecoveryAgent.executeSafely('ManagementAgent', () => agents.management.run(actualTicker), PipelineRecoveryAgent.createUnavailableFallback({} as any), sendUpdate),
          
          PipelineRecoveryAgent.executeSafely('LiveMarketAgent', () => agents.liveMarket.run(actualTicker), PipelineRecoveryAgent.createUnavailableFallback({} as any), sendUpdate),
          PipelineRecoveryAgent.executeSafely('HistoricalPriceAgent', () => agents.historical.run(actualTicker), PipelineRecoveryAgent.createUnavailableFallback({} as any), sendUpdate),
          PipelineRecoveryAgent.executeSafely('TechnicalAnalysisAgent', () => agents.technical.run(actualTicker), PipelineRecoveryAgent.createUnavailableFallback({} as any), sendUpdate),
          
          PipelineRecoveryAgent.executeSafely('FinancialStatementAgent', () => agents.financial.run(actualTicker), PipelineRecoveryAgent.createUnavailableFallback({} as any), sendUpdate),
          PipelineRecoveryAgent.executeSafely('ValuationAgent', () => agents.valuation.run(actualTicker), PipelineRecoveryAgent.createUnavailableFallback({} as any), sendUpdate),
          PipelineRecoveryAgent.executeSafely('GrowthEngineAgent', () => agents.growth.run(actualTicker), PipelineRecoveryAgent.createUnavailableFallback({} as any), sendUpdate),
          
          PipelineRecoveryAgent.executeSafely('RiskAgent', () => agents.risk.run(actualTicker), PipelineRecoveryAgent.createUnavailableFallback({} as any), sendUpdate),
          PipelineRecoveryAgent.executeSafely('CompetitionAgent', () => agents.competition.run(actualTicker), PipelineRecoveryAgent.createUnavailableFallback({} as any), sendUpdate),
          PipelineRecoveryAgent.executeSafely('ESGAgent', () => agents.esg.run(actualTicker), PipelineRecoveryAgent.createUnavailableFallback({} as any), sendUpdate),
          
          PipelineRecoveryAgent.executeSafely('NewsIntelligenceAgent', () => agents.news.run(actualTicker), PipelineRecoveryAgent.createUnavailableFallback({} as any), sendUpdate),
          PipelineRecoveryAgent.executeSafely('InstitutionalOwnershipAgent', () => agents.institutional.run(actualTicker), PipelineRecoveryAgent.createUnavailableFallback({} as any), sendUpdate),
          
          PipelineRecoveryAgent.executeSafely('ForecastAgent', () => agents.forecast.run(actualTicker), PipelineRecoveryAgent.createUnavailableFallback({} as any), sendUpdate),
          PipelineRecoveryAgent.executeSafely('InvestmentCommitteeAgent', () => agents.committee.run(actualTicker), PipelineRecoveryAgent.createUnavailableFallback({} as any), sendUpdate),
          PipelineRecoveryAgent.executeSafely('EvidenceAgent', () => agents.evidence.run(actualTicker), PipelineRecoveryAgent.createUnavailableFallback({} as any), sendUpdate),
          PipelineRecoveryAgent.executeSafely('ConfidenceAgent', () => agents.confidence.run(actualTicker), PipelineRecoveryAgent.createUnavailableFallback({} as any), sendUpdate),
        ]);

        const report: FullResearchReport = {
          companyIdentity: companyIdentity as any,
          liveMarket: liveMarket as any,
          historicalPrice: historicalPrice as any,
          financialStatement: financialStatement as any,
          valuation: valuation as any,
          businessIntelligence: businessIntelligence as any,
          companyTimeline: companyTimeline as any,
          growthEngine: growthEngine as any,
          competition: competition as any,
          management: management as any,
          riskAnalysis: riskAnalysis as any,
          newsIntelligence: newsIntelligence as any,
          institutionalOwnership: institutionalOwnership as any,
          technicalAnalysis: technicalAnalysis as any,
          forecast: forecast as any,
          esg: esg as any,
          investmentCommittee: investmentCommittee as any,
          evidenceLedger: evidenceLedger as any,
          confidenceMetrics: confidenceMetrics as any,
        };

        const finalResult: InvestmentResult = {
          report,
          researchSteps,
          timestamp: new Date().toISOString()
        };

        const latency = Date.now() - startTime;
        console.log(`[Research Pipeline] COMPLETE in ${latency}ms`);

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'complete', data: finalResult })}\n\n`));
        controller.close();

      } catch (error) {
        console.error('[Research Pipeline] FATAL ERROR:', error);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', data: { message: 'Fatal pipeline error.' } })}\n\n`));
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
