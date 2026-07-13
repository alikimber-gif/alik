import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { topicDistribution } from '../data/mockData'
import './Chart.css'
import './AudienceChart.css'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="chart-tooltip">
      <div className="tooltip-row">
        <span className="tooltip-dot" style={{ background: d.payload.color }} />
        <span className="tooltip-name">{d.name}:</span>
        <span className="tooltip-value">{d.value}%</span>
      </div>
    </div>
  )
}

export default function AudienceChart() {
  return (
    <div className="chart-card audience-chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Topic Distribution</h3>
          <p className="chart-subtitle">What the community is talking about</p>
        </div>
      </div>

      <div className="audience-layout">
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie
              data={topicDistribution}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              dataKey="value"
              paddingAngle={3}
              strokeWidth={0}
            >
              {topicDistribution.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="audience-legend">
          {topicDistribution.map(d => (
            <div key={d.name} className="audience-legend-row">
              <div className="aud-left">
                <span className="legend-dot" style={{ background: d.color }} />
                <span className="aud-name">{d.name}</span>
              </div>
              <div className="aud-bar-wrap">
                <div className="aud-bar" style={{ width: `${d.value * 2.5}%`, background: d.color }} />
              </div>
              <span className="aud-pct">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
