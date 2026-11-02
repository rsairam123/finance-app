export const COMPANIES = [
  { symbol: 'IBM', name: 'IBM' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'ORCL', name: 'Oracle' },
  { symbol: 'SAP', name: 'SAP' },
  { symbol: 'CRM', name: 'Salesforce' },
];

const pct = (from, to) => (from ? ((to - from) / from) * 100 : 0);

/** Convert a Yahoo Finance v8 chart response into a normalized series. */
export function normalizeChart(symbol, json) {
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error(`No data for ${symbol}`);
  const closes = result.indicators?.quote?.[0]?.close ?? [];
  const history = (result.timestamp ?? [])
    .map((t, i) => ({ date: new Date(t * 1000).toISOString().slice(0, 10), close: closes[i] }))
    .filter((p) => typeof p.close === 'number');
  return { symbol, price: result.meta?.regularMarketPrice, prevClose: result.meta?.chartPreviousClose, history };
}

/** Build the three dashboard views from a normalized series. */
export function buildViews({ symbol, price, prevClose, history }) {
  const last = history.length ? history[history.length - 1].close : price;
  const current = price ?? last;
  const week = history.slice(-7);
  const prev = prevClose ?? (history.length > 1 ? history[history.length - 2].close : current);
  return {
    symbol,
    current: { price: current, change: current - prev, changePct: pct(prev, current) },
    week: { series: week, changePct: week.length ? pct(week[0].close, current) : 0 },
    quarter: { series: history, changePct: history.length ? pct(history[0].close, current) : 0 },
  };
}
