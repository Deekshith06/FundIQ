import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from '@/lib/yahoo-finance';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tickerQuery = searchParams.get('ticker');
  const period = searchParams.get('period') || '1Y'; // 1D, 1W, 1M, 1Y

  if (!tickerQuery) {
    return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
  }

  try {

    const end = new Date();
    const start = new Date();

    let interval: '1d' | '1wk' | '1mo' | '1m' | '5m' = '1d';

    if (period === '1D') {
      start.setDate(start.getDate() - 2); // get a couple days to be safe for intraday
      interval = '5m';
    } else if (period === '1W') {
      start.setDate(start.getDate() - 7);
      interval = '15m' as any; // yahoo-finance2 supports 15m but types might not
    } else if (period === '1M') {
      start.setMonth(start.getMonth() - 1);
      interval = '1d';
    } else if (period === '1Y') {
      start.setFullYear(start.getFullYear() - 1);
      interval = '1wk';
    } else {
      start.setFullYear(start.getFullYear() - 1);
      interval = '1wk';
    }

    const queryOptions = {
      period1: start.toISOString(),
      period2: end.toISOString(),
      interval: interval as any,
    };

    let tickerToUse = tickerQuery;
    let result;

    try {
      result = await yahooFinance.chart(tickerToUse, queryOptions) as any;
    } catch (err) {
      // If direct ticker fetch fails, try to search for the symbol (e.g. "NVIDIA" -> "NVDA")
      const searchResult = await yahooFinance.search(tickerQuery);
      if (searchResult && searchResult.quotes && searchResult.quotes.length > 0) {
        tickerToUse = searchResult.quotes[0].symbol as string;
        result = await yahooFinance.chart(tickerToUse, queryOptions) as any;
      } else {
        throw err;
      }
    }

    if (!result || !result.quotes || result.quotes.length === 0) {
      return NextResponse.json({ data: [] });
    }

    const formattedData = result.quotes
      .filter((q: any) => q.close !== null && q.close !== undefined)
      .map((q: any) => ({
        date: new Date(q.date).toISOString(),
        price: q.close,
      }));

    return NextResponse.json({ data: formattedData });
  } catch (error) {
    console.error('Error fetching stock chart data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
