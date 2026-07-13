import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { demographicReach } from '../data/mockData'
import './Chart.css'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">Age {label}</p>
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
          <h3 className="chart-title">Demographic Reach</h3>
          <p className="chart-subtitle">Community participation vs target by age group</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={demographicReach} margin={{ top: 5, right: 5, left: 0, bottom: 5 }} barSize={18} barGap={4}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="group" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="reached" name="Reached" fill="#3987e5" radius={[3, 3, 0, 0]} />
          <Bar dataKey="target" name="Target" fill="#1e3a52" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="chart-legend">
        {[
          { key: 'reached', label: 'People Reached', color: '#3987e5' },
          { key: 'target', label: 'Target', color: '#1e3a52' },
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
