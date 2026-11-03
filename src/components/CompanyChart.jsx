import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { validateTicker } from '../services/transform.js';
import { loadCompany } from '../services/financeService.js';

/** Lets the user pick a ticker and shows a price graph for that company. */
export default function CompanyChart() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | error | done
  const [error, setError] = useState('');
  const [company, setCompany] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    const v = validateTicker(input);
    if (!v.ok) {
      setStatus('error');
      setError(v.error);
      return;
    }
    setStatus('loading');
    try {
      setCompany(await loadCompany(v.symbol));
      setStatus('done');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  return (
    <section className="company">
      <h2>Look up a company</h2>
      <form className="company-form" onSubmit={onSubmit}>
        <input
          aria-label="Ticker symbol"
          placeholder="Ticker, e.g. AAPL"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={status === 'loading'}>Show graph</button>
      </form>
      {status === 'loading' && <p className="muted">Loading data…</p>}
      {status === 'error' && <p className="down" role="alert">{error}</p>}
      {status === 'done' && company && (
        <div className="card" style={{ height: 320 }}>
          <div className="muted">
            {company.symbol} — last quarter, closing price{!company.live && ' (sample data)'}
          </div>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={company.quarter.series}>
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} unit="$" />
              <Tooltip />
              <Line type="monotone" dataKey="close" stroke="#0f62fe" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
