import React from 'react'
import './PlatformCard.css'

const statusLabels = {
  active: 'Active',
  upcoming: 'Upcoming',
  completed: 'Completed',
}

const statusColors = {
  active: '#10b981',
  upcoming: '#f59e0b',
  completed: '#4a7a96',
}

export default function PlatformCard({ consultation }) {
  const { name, color, submissions, target, startDate, endDate, status, channel } = consultation
  const progress = target > 0 ? Math.min((submissions / target) * 100, 100) : 0
  const start = new Date(startDate).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' })
  const end = new Date(endDate).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="platform-card" style={{ '--platform-color': color }}>
      <div className="platform-card-header">
        <div className="platform-icon" style={{ background: color }}>
          {name[0]}
        </div>
        <div className="platform-card-title">
          <p className="platform-name">{name}</p>
          <p className="platform-change" style={{ color: statusColors[status] }}>
            {statusLabels[status]} · {start} – {end}
          </p>
        </div>
      </div>

      <div className="platform-stats-grid">
        <div className="pstat">
          <p className="pstat-value">{submissions.toLocaleString()}</p>
          <p className="pstat-label">Submissions</p>
        </div>
        <div className="pstat">
          <p className="pstat-value">{target.toLocaleString()}</p>
          <p className="pstat-label">Target</p>
        </div>
        <div className="pstat">
          <p className="pstat-value">{progress.toFixed(0)}%</p>
          <p className="pstat-label">Progress</p>
        </div>
        <div className="pstat">
          <p className="pstat-value" style={{ fontSize: '13px' }}>{channel}</p>
          <p className="pstat-label">Channel</p>
        </div>
      </div>

      <div className="platform-engagement-bar">
        <div className="eng-bar-fill" style={{ width: `${progress}%`, background: color }} />
      </div>
    </div>
  )
}
