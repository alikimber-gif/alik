import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { sentimentData } from '../data/mockData'
import './Chart.css'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map(entry => (
        <div key={entry.dataKey} className="tooltip-row">
          <span className="tooltip-dot" style={{ background: entry.fill || entry.stroke }} />
          <span className="tooltip-name">{entry.name}:</span>
          <span className="tooltip-value">{entry.value}%</span>
        </div>
      ))}
    </div>
  )
}

export default function SentimentChart() {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Community Sentiment Trend</h3>
          <p className="chart-subtitle">Percentage of submissions by sentiment over time</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={sentimentData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          stackOffset="expand"
        >
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={v => `${(v * 100).toFixed(0)}%`}
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="positive" name="Positive" stackId="1" stroke="#199e70" fill="#199e70" fillOpacity={0.3} strokeWidth={2} />
          <Area type="monotone" dataKey="mixed" name="Mixed" stackId="1" stroke="#c98500" fill="#c98500" fillOpacity={0.2} strokeWidth={2} />
          <Area type="monotone" dataKey="negative" name="Negative" stackId="1" stroke="#e66767" fill="#e66767" fillOpacity={0.2} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>

      <div className="chart-legend">
        {[
          { key: 'positive', label: 'Positive', color: '#199e70' },
          { key: 'mixed', label: 'Mixed', color: '#c98500' },
          { key: 'negative', label: 'Negative', color: '#e66767' },
        ].map(item => (
          <div key={item.key} className="legend-item">
            <span className="legend-dot" style={{ background: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
