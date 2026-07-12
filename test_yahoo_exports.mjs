import YahooFinance from 'yahoo-finance2';
async function run() {
  try {
    const yahooFinance = new YahooFinance();
    const result = await yahooFinance.search('NVIDIA');
    console.log("Symbol:", result.quotes[0].symbol);
    
    const result2 = await yahooFinance.chart('NVDA', { period1: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() });
    console.log("Chart length:", result2.quotes.length);
  } catch (e) {
    console.error(e.message);
  }
}
run();
