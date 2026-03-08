import React from 'react'
import './StatsCard.css'

function formatNumber(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toLocaleString()
}

export default function StatsCard({ label, value, change, format = 'number', accentColor, icon }) {
  const isPositive = change >= 0
  const formatted = format === 'percent'
    ? `${value.toFixed(2)}%`
    : format === 'number'
    ? formatNumber(value)
    : value

  return (
    <div className="stats-card">
      <div className="stats-card-top">
        <div className="stats-icon" style={{ background: `${accentColor}18`, color: accentColor }}>
          {icon}
        </div>
        <span className={`stats-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
        </span>
      </div>
      <div className="stats-value">{formatted}</div>
      <div className="stats-label">{label}</div>
    </div>
  )
}
