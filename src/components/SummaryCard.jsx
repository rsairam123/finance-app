import React from 'react';

export default function SummaryCard({ item }) {
  const { name, symbol, current } = item;
  const up = current.change >= 0;
  return (
    <div className="card">
      <div className="muted">{name} ({symbol})</div>
      <div className="price">${current.price.toFixed(2)}</div>
      <div className={up ? 'up' : 'down'}>
        {up ? '+' : ''}{current.change.toFixed(2)} ({current.changePct.toFixed(2)}%)
      </div>
    </div>
  );
}
