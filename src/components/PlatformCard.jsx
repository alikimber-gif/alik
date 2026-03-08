import React from 'react'
import './PlatformCard.css'

function formatNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toLocaleString()
}

const platformIcons = {
  twitter:   '𝕏',
  instagram: '◑',
  facebook:  'f',
  linkedin:  'in',
  tiktok:    '♪',
  youtube:   '▶',
}

export default function PlatformCard({ platform }) {
  const { name, color, followers, followersChange, posts, engagement, reach, id } = platform
  const isPositive = followersChange >= 0

  return (
    <div className="platform-card" style={{ '--platform-color': color }}>
      <div className="platform-card-header">
        <div className="platform-icon" style={{ background: color }}>
          {platformIcons[id] || id[0].toUpperCase()}
        </div>
        <div className="platform-card-title">
          <p className="platform-name">{name}</p>
          <p className={`platform-change ${isPositive ? 'pos' : 'neg'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(followersChange).toFixed(1)}% this month
          </p>
        </div>
      </div>

      <div className="platform-stats-grid">
        <div className="pstat">
          <p className="pstat-value">{formatNum(followers)}</p>
          <p className="pstat-label">Followers</p>
        </div>
        <div className="pstat">
          <p className="pstat-value">{formatNum(reach)}</p>
          <p className="pstat-label">Reach</p>
        </div>
        <div className="pstat">
          <p className="pstat-value">{engagement}%</p>
          <p className="pstat-label">Engagement</p>
        </div>
        <div className="pstat">
          <p className="pstat-value">{posts}</p>
          <p className="pstat-label">Posts</p>
        </div>
      </div>

      <div className="platform-engagement-bar">
        <div className="eng-bar-fill" style={{ width: `${Math.min(engagement * 6, 100)}%`, background: color }} />
      </div>
    </div>
  )
}
