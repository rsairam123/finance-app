import { describe, it, expect } from 'vitest';
import { normalizeChart, buildViews } from './transform.js';
import { mockChart } from './mockData.js';

describe('transform', () => {
  it('normalizes a chart response and builds views', () => {
    const views = buildViews(normalizeChart('IBM', mockChart('IBM')));
    expect(views.week.series).toHaveLength(7);
    expect(views.quarter.series.length).toBeGreaterThan(7);
    expect(typeof views.current.price).toBe('number');
  });

  it('throws when no data is returned', () => {
    expect(() => normalizeChart('X', {})).toThrow();
  });
});
