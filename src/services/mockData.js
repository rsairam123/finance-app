// Deterministic sample data used when Yahoo Finance is unreachable.
const BASE = { IBM: 230, MSFT: 420, ORCL: 170, SAP: 240, CRM: 280 };

export function mockChart(symbol) {
  const base = BASE[symbol] ?? 100;
  const days = 65;
  const end = Date.UTC(2026, 10, 2) / 1000;
  const timestamp = [];
  const close = [];
  let seed = [...symbol].reduce((a, c) => a + c.charCodeAt(0), 0);
  for (let i = 0; i < days; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    const noise = (seed / 233280 - 0.5) * 0.03;
    timestamp.push(end - (days - 1 - i) * 86400);
    close.push(+(base * (1 + (i - days / 2) * 0.002 + noise)).toFixed(2));
  }
  return {
    chart: {
      result: [{
        meta: { regularMarketPrice: close[days - 1], chartPreviousClose: close[days - 2] },
        timestamp,
        indicators: { quote: [{ close }] },
      }],
    },
  };
}
