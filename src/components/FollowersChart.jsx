import React, { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { submissionsOverTime } from '../data/mockData'
import './Chart.css'

const channels = [
  { id: 'online', name: 'Online Portal', color: '#3987e5' },
  { id: 'inPerson', name: 'In-person', color: '#199e70' },
  { id: 'workshop', name: 'Workshops & Hui', color: '#c98500' },
  { id: 'written', name: 'Written', color: '#008300' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map(entry => (
        <div key={entry.dataKey} className="tooltip-row">
          <span className="tooltip-dot" style={{ background: entry.color }} />
          <span className="tooltip-name">{entry.name}:</span>
          <span className="tooltip-value">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export default function FollowersChart() {
  const [visibleChannels, setVisibleChannels] = useState(
    Object.fromEntries(channels.map(c => [c.id, true]))
  )

  const toggle = (id) => setVisibleChannels(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Submissions Over Time</h3>
          <p className="chart-subtitle">Submissions received by engagement channel</p>
        </div>
      </div>

      <div className="platform-toggles">
        {channels.map(c => (
          <button
            key={c.id}
            className={`platform-toggle ${visibleChannels[c.id] ? 'active' : 'inactive'}`}
            style={visibleChannels[c.id] ? { borderColor: c.color, color: c.color, background: `${c.color}14` } : {}}
            onClick={() => toggle(c.id)}
          >
            <span className="toggle-dot" style={{ background: visibleChannels[c.id] ? c.color : 'var(--text-muted)' }} />
            {c.name}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={submissionsOverTime} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          {channels.map(c => (
            visibleChannels[c.id] && (
              <Area
                key={c.id}
                type="monotone"
                dataKey={c.id}
                name={c.name}
                stroke={c.color}
                fill={c.color}
                fillOpacity={0.08}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            )
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
