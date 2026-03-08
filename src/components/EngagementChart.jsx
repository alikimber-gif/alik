import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { engagementData } from '../data/mockData'
import './Chart.css'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map(entry => (
        <div key={entry.dataKey} className="tooltip-row">
          <span className="tooltip-dot" style={{ background: entry.fill }} />
          <span className="tooltip-name">{entry.name}:</span>
          <span className="tooltip-value">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export default function EngagementChart() {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Weekly Engagement</h3>
          <p className="chart-subtitle">Interactions breakdown by day</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={engagementData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }} barSize={14} barGap={3}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
            tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="likes" name="Likes" fill="#4f8ef7" radius={[3, 3, 0, 0]} />
          <Bar dataKey="comments" name="Comments" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
          <Bar dataKey="shares" name="Shares" fill="#10b981" radius={[3, 3, 0, 0]} />
          <Bar dataKey="saves" name="Saves" fill="#f59e0b" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="chart-legend">
        {[
          { key: 'likes', label: 'Likes', color: '#4f8ef7' },
          { key: 'comments', label: 'Comments', color: '#8b5cf6' },
          { key: 'shares', label: 'Shares', color: '#10b981' },
          { key: 'saves', label: 'Saves', color: '#f59e0b' },
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
