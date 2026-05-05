import React from 'react'
import './Sidebar.css'

const navItems = [
  { id: 'overview', label: 'Overview', icon: '⊞' },
  { id: 'analytics', label: 'Analytics', icon: '◈' },
  { id: 'posts', label: 'Posts', icon: '▤' },
  { id: 'audience', label: 'Audience', icon: '◉' },
  { id: 'schedule', label: 'Schedule', icon: '◷' },
  { id: 'messages', label: 'Messages', icon: '◻' },
  { id: 'alcohol-licence', label: 'Alcohol Licence Guide', icon: '📋' },
]

const platformLinks = [
  { id: 'facebook', label: 'Facebook', color: '#1877f2' },
  { id: 'instagram', label: 'Instagram', color: '#e1306c' },
  { id: 'twitter', label: 'Twitter / X', color: '#1da1f2' },
  { id: 'linkedin', label: 'LinkedIn', color: '#0a66c2' },
  { id: 'youtube', label: 'YouTube', color: '#ff0000' },
  { id: 'nextdoor', label: 'Nextdoor', color: '#00b246' },
]

export default function Sidebar({ activeNav, onNavChange }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-n">N</div>
        <div className="logo-text-block">
          <span className="logo-text">Nelson City</span>
          <span className="logo-tagline">te kaunihera o whakatū</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-section-label">Main Menu</p>
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => onNavChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.id === 'messages' && <span className="nav-badge">3</span>}
          </button>
        ))}

        <p className="nav-section-label" style={{ marginTop: '24px' }}>Platforms</p>
        {platformLinks.map(p => (
          <button
            key={p.id}
            className={`nav-item platform-item ${activeNav === p.id ? 'active' : ''}`}
            onClick={() => onNavChange(p.id)}
          >
            <span className="platform-dot" style={{ background: p.color }} />
            <span className="nav-label">{p.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-avatar">NCC</div>
        <div className="user-info">
          <p className="user-name">NCC Social Team</p>
          <p className="user-role">Administrator</p>
        </div>
        <button className="settings-btn" title="Settings">⚙</button>
      </div>
    </aside>
  )
}
