import yf from 'yahoo-finance2';

const YahooFinance = (yf as any).default || yf;
let instance;

try {
  instance = new YahooFinance();
} catch (e) {
  instance = yf;
}

export default instance;
