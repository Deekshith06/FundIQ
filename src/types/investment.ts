export const UNAVAILABLE = 'Unavailable (Provider could not verify)';

// --- Agent 1: Company Identity ---
export interface CompanyIdentity {
  logo: string;
  name: string;
  ticker: string;
  exchange: string;
  country: string;
  currency: string;
  sector: string;
  industry: string;
  ceo: string;
  headquarters: string;
  founded: string;
  employees: string;
  website: string;
  description: string;
  marketStatus: string;
}

// --- Agent 2: Live Market ---
export interface LiveMarket {
  price: string;
  marketCap: string;
  enterpriseValue: string;
  volume: string;
  averageVolume: string;
  dividendYield: string;
  peRatio: string;
  pegRatio: string;
  beta: string;
  fiftyTwoWeekHigh: string;
  fiftyTwoWeekLow: string;
  float: string;
  sharesOutstanding: string;
  currency: string;
}

// --- Agent 3: Historical Price ---
export interface PriceDataPoint {
  date: string;
  price: number;
}
export interface HistoricalPrice {
  chartData1M: PriceDataPoint[];
  chartData1Y: PriceDataPoint[];
  chartData5Y: PriceDataPoint[];
}

// --- Agent 4: Financial Statement ---
export interface FinancialStatement {
  revenue: string;
  netIncome: string;
  eps: string;
  grossMargin: string;
  operatingMargin: string;
  debt: string;
  cash: string;
  roe: string;
  roa: string;
  roic: string;
  freeCashFlow: string;
  dividendHistory: string;
  buybacks: string;
  dilution: string;
}

// --- Agent 5: Valuation ---
export interface Valuation {
  intrinsicValue: string;
  fairValue: string;
  dcf: string;
  evToEbitda: string;
  peg: string;
  priceToBook: string;
  priceToSales: string;
  marginOfSafety: string;
  peerComparison: string;
}

// --- Agent 6: Business Intelligence ---
export interface BusinessIntelligence {
  businessModel: string;
  revenueSegments: string[];
  products: string[];
  services: string[];
  customerTypes: string;
  geographicRevenue: string;
  competitiveMoat: string;
}

// --- Agent 7: Company Timeline ---
export interface TimelineEvent {
  year: string;
  event: string;
}
export interface CompanyTimeline {
  foundedYear: string;
  ipoYear: string;
  acquisitions: string[];
  majorProducts: string[];
  events: TimelineEvent[];
}

// --- Agent 8: Growth Engine ---
export interface GrowthEngine {
  forecastRevenue: string;
  forecastEps: string;
  forecastCashFlow: string;
  forecastMargins: string;
  futureProducts: string;
  expansion: string;
  aiStrategy: string;
  patentGrowth: string;
}

// --- Agent 9: Competition ---
export interface Competition {
  marketShare: string;
  swot: string;
  competitors: string[];
  moatStrength: string;
  pricingPower: string;
  innovation: string;
  brand: string;
}

// --- Agent 10: Management ---
export interface Management {
  ceoHistory: string;
  leadership: string;
  boardQuality: string;
  insiderOwnership: string;
  capitalAllocation: string;
  governance: string;
}

// --- Agent 11: Risk ---
export interface StructuredRisk {
  category: string;
  probability: string;
  impact: string;
  mitigation: string;
  description: string;
}
export interface RiskAnalysis {
  macroeconomics: StructuredRisk;
  interestRates: StructuredRisk;
  inflation: StructuredRisk;
  currency: StructuredRisk;
  competition: StructuredRisk;
  execution: StructuredRisk;
  cybersecurity: StructuredRisk;
  supplyChain: StructuredRisk;
  regulatory: StructuredRisk;
  geopolitical: StructuredRisk;
}

// --- Agent 12: News Intelligence ---
export interface NewsIntelligence {
  latestNews: string[];
  earnings: string;
  analystUpgrades: string;
  downgrades: string;
  institutionalBuying: string;
  insiderBuying: string;
  majorEvents: string;
}

// --- Agent 13: Institutional Ownership ---
export interface InstitutionalOwnership {
  topHolders: string[];
  mutualFunds: string;
  etfs: string;
  hedgeFunds: string;
  recentBuying: string;
  recentSelling: string;
}

// --- Agent 14: Technical Analysis ---
export interface TechnicalAnalysis {
  rsi: string;
  macd: string;
  ema: string;
  sma: string;
  support: string;
  resistance: string;
  trend: string;
  momentum: string;
  breakoutProbability: string;
}

// --- Agent 15: Forecast ---
export interface ForecastScenario {
  expectedPriceRange: string;
  expectedCagr: string;
  expectedRevenue: string;
  expectedEps: string;
  probability: string;
  assumptions: string;
}
export interface Forecast {
  bullCase: ForecastScenario;
  baseCase: ForecastScenario;
  bearCase: ForecastScenario;
  confidence: string;
}

// --- Agent 16: ESG ---
export interface ESG {
  environmental: string;
  social: string;
  governance: string;
  carbonGoals: string;
  compliance: string;
}

// --- Agent 17: Investment Committee ---
export interface CommitteeVote {
  member: string;
  vote: string;
  confidence: string;
  reasoning: string;
}
export interface InvestmentCommittee {
  growthInvestor: CommitteeVote;
  valueInvestor: CommitteeVote;
  riskManager: CommitteeVote;
  macroStrategist: CommitteeVote;
  quantAnalyst: CommitteeVote;
}

// --- Agent 18: Evidence ---
export interface EvidenceClaim {
  claim: string;
  source: string;
  timestamp: string;
  confidence: string;
  verification: string;
}
export interface EvidenceLedger {
  claims: EvidenceClaim[];
}

// --- Agent 19: Confidence ---
export interface ConfidenceMetrics {
  dataCompleteness: string;
  sourceDiversity: string;
  agreement: string;
  freshness: string;
  providerReliability: string;
  overallConfidence: string;
}

// --- Central Master Payload ---
export interface FullResearchReport {
  companyIdentity: CompanyIdentity;
  liveMarket: LiveMarket;
  historicalPrice: HistoricalPrice;
  financialStatement: FinancialStatement;
  valuation: Valuation;
  businessIntelligence: BusinessIntelligence;
  companyTimeline: CompanyTimeline;
  growthEngine: GrowthEngine;
  competition: Competition;
  management: Management;
  riskAnalysis: RiskAnalysis;
  newsIntelligence: NewsIntelligence;
  institutionalOwnership: InstitutionalOwnership;
  technicalAnalysis: TechnicalAnalysis;
  forecast: Forecast;
  esg: ESG;
  investmentCommittee: InvestmentCommittee;
  evidenceLedger: EvidenceLedger;
  confidenceMetrics: ConfidenceMetrics;
}

// --- Research Step Tracking ---
export interface ResearchStep {
  agent: string;
  action: string;
  timestamp: string;
  status: 'completed' | 'error' | 'pending';
}

// --- Main Result Interface used by UI ---
export interface InvestmentResult {
  report: FullResearchReport | null;
  researchSteps: ResearchStep[];
  timestamp: string;
}
