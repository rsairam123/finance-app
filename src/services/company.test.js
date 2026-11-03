import { describe, it, expect, vi, afterEach } from 'vitest';
import { validateTicker } from './transform.js';
import { loadCompany } from './financeService.js';

afterEach(() => vi.unstubAllGlobals());

describe('validateTicker', () => {
  it('accepts and normalizes a valid symbol', () => {
    expect(validateTicker(' aapl ')).toEqual({ ok: true, symbol: 'AAPL' });
  });

  it('rejects empty input', () => {
    expect(validateTicker('   ').ok).toBe(false);
  });

  it('rejects malformed symbols', () => {
    for (const bad of ['ZZZZZZ', 'A1', 'AA-PL', '123']) {
      const r = validateTicker(bad);
      expect(r.ok).toBe(false);
      expect(r.error).toMatch(/not a valid ticker/);
    }
  });
});

describe('loadCompany', () => {
  it('falls back to sample data for a known symbol when live data fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const c = await loadCompany('AAPL');
    expect(c.symbol).toBe('AAPL');
    expect(c.live).toBe(false);
    expect(c.quarter.series.length).toBeGreaterThan(7);
  });

  it('throws for an unavailable symbol', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));
    await expect(loadCompany('ZZZZ')).rejects.toThrow(/No data available/);
  });
});
