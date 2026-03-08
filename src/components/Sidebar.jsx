import React from 'react'
import './Sidebar.css'

const navItems = [
  { id: 'overview', label: 'Overview', icon: '⊞' },
  { id: 'analytics', label: 'Analytics', icon: '◈' },
  { id: 'posts', label: 'Posts', icon: '▤' },
  { id: 'audience', label: 'Audience', icon: '◉' },
  { id: 'schedule', label: 'Schedule', icon: '◷' },
  { id: 'messages', label: 'Messages', icon: '◻' },
]

const platformLinks = [
  { id: 'twitter', label: 'Twitter / X', color: '#1da1f2' },
  { id: 'instagram', label: 'Instagram', color: '#e1306c' },
  { id: 'facebook', label: 'Facebook', color: '#1877f2' },
  { id: 'linkedin', label: 'LinkedIn', color: '#0a66c2' },
  { id: 'tiktok', label: 'TikTok', color: '#ff0050' },
  { id: 'youtube', label: 'YouTube', color: '#ff0000' },
]

export default function Sidebar({ activeNav, onNavChange }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">◈</span>
        <span className="logo-text">SocialHub</span>
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
        <div className="user-avatar">AK</div>
        <div className="user-info">
          <p className="user-name">Alik Brand</p>
          <p className="user-role">Admin</p>
        </div>
        <button className="settings-btn" title="Settings">⚙</button>
      </div>
    </aside>
  )
}
