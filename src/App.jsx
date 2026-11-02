import React, { useEffect, useState } from 'react';
import { loadDashboard } from './services/financeService.js';
import SummaryCard from './components/SummaryCard.jsx';
import TrendChart from './components/TrendChart.jsx';

const VIEWS = [
  { id: 'day', label: 'Current day' },
  { id: 'week', label: 'Last 7 days' },
  { id: 'quarter', label: 'Last quarter' },
];

export default function App() {
  const [items, setItems] = useState(null);
  const [view, setView] = useState('day');

  useEffect(() => {
    loadDashboard().then(setItems);
  }, []);

  if (!items) return <p className="container">Loading…</p>;
  const sample = items.some((i) => !i.live);

  return (
    <div className="container">
      <h1>IBM vs Competitors</h1>
      {sample && <p className="muted">Live Yahoo Finance data unavailable — showing sample data.</p>}
      <div className="tabs">
        {VIEWS.map((v) => (
          <button key={v.id} className={view === v.id ? 'active' : ''} onClick={() => setView(v.id)}>
            {v.label}
          </button>
        ))}
      </div>
      {view === 'day' ? (
        <div className="grid">
          {items.map((i) => <SummaryCard key={i.symbol} item={i} />)}
        </div>
      ) : (
        <TrendChart items={items} view={view} />
      )}
    </div>
  );
}
