import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { engagementChannels } from '../data/mockData'
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

export default function ChannelBreakdown() {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Engagement by Channel</h3>
          <p className="chart-subtitle">Total submissions received per channel</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={engagementChannels}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          barSize={16}
        >
          <CartesianGrid stroke="var(--border)" horizontal={false} />
          <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="channel"
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={140}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="submissions" name="Submissions" fill="#3987e5" radius={[0, 3, 3, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
