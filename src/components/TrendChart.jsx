import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0f62fe', '#24a148', '#da1e28', '#8a3ffc', '#ff832b'];

/** Compares companies as % change from the start of the selected window. */
export default function TrendChart({ items, view }) {
  const base = items.map((i) => i[view].series[0]?.close ?? 1);
  const dates = items[0][view].series.map((p) => p.date);
  const data = dates.map((date, idx) => {
    const row = { date };
    items.forEach((it, k) => {
      const p = it[view].series[idx];
      if (p) row[it.symbol] = +(((p.close - base[k]) / base[k]) * 100).toFixed(2);
    });
    return row;
  });
  return (
    <div className="card" style={{ height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis unit="%" />
          <Tooltip />
          <Legend />
          {items.map((it, k) => (
            <Line key={it.symbol} type="monotone" dataKey={it.symbol} stroke={COLORS[k % COLORS.length]} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
