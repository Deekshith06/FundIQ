import yahooFinance from 'yahoo-finance2';
async function run() {
  try {
    const result = await yahooFinance.search('NVIDIA');
    console.log("Symbol:", result.quotes[0].symbol);
  } catch(e) { console.error(e.message); }
}
run();
