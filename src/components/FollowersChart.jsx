import React, { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { followersGrowthData, platforms } from '../data/mockData'
import './Chart.css'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map(entry => (
        <div key={entry.dataKey} className="tooltip-row">
          <span className="tooltip-dot" style={{ background: entry.color }} />
          <span className="tooltip-name">{entry.name}:</span>
          <span className="tooltip-value">{(entry.value / 1000).toFixed(1)}K</span>
        </div>
      ))}
    </div>
  )
}

export default function FollowersChart() {
  const [visiblePlatforms, setVisiblePlatforms] = useState(
    Object.fromEntries(platforms.map(p => [p.id, true]))
  )

  const toggle = (id) => setVisiblePlatforms(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Followers Growth</h3>
          <p className="chart-subtitle">Total followers across all platforms</p>
        </div>
      </div>

      <div className="platform-toggles">
        {platforms.map(p => (
          <button
            key={p.id}
            className={`platform-toggle ${visiblePlatforms[p.id] ? 'active' : 'inactive'}`}
            style={visiblePlatforms[p.id] ? { borderColor: p.color, color: p.color, background: `${p.color}14` } : {}}
            onClick={() => toggle(p.id)}
          >
            <span className="toggle-dot" style={{ background: visiblePlatforms[p.id] ? p.color : 'var(--text-muted)' }} />
            {p.name}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={followersGrowthData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={v => `${(v / 1000).toFixed(0)}K`}
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          {platforms.map(p => (
            visiblePlatforms[p.id] && (
              <Line
                key={p.id}
                type="monotone"
                dataKey={p.id}
                name={p.name}
                stroke={p.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            )
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
