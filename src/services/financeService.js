import { COMPANIES, normalizeChart, buildViews } from './transform.js';
import { mockChart, hasMock } from './mockData.js';

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

/** Load one user-selected company. Throws if the symbol has no live or sample data. */
export async function loadCompany(symbol) {
  try {
    const res = await fetch(`/yahoo/v8/finance/chart/${symbol}?range=3mo&interval=1d`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { ...buildViews(normalizeChart(symbol, await res.json())), name: symbol, live: true };
  } catch {
    if (!hasMock(symbol)) throw new Error(`No data available for ${symbol}.`);
    return { ...buildViews(normalizeChart(symbol, mockChart(symbol))), name: symbol, live: false };
  }
}
