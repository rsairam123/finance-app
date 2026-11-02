import { COMPANIES, normalizeChart, buildViews } from './transform.js';
import { mockChart } from './mockData.js';

async function fetchSymbol(symbol) {
  try {
    const res = await fetch(`/yahoo/v8/finance/chart/${symbol}?range=3mo&interval=1d`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { ...buildViews(normalizeChart(symbol, await res.json())), live: true };
  } catch {
    return { ...buildViews(normalizeChart(symbol, mockChart(symbol))), live: false };
  }
}

export async function loadDashboard(companies = COMPANIES) {
  const rows = await Promise.all(companies.map((c) => fetchSymbol(c.symbol)));
  return rows.map((r, i) => ({ ...r, name: companies[i].name }));
}
