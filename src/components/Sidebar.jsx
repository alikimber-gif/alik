import React from 'react'
import './Sidebar.css'

const navItems = [
  { id: 'overview', label: 'Overview', icon: '⊞' },
  { id: 'consultations', label: 'Consultations', icon: '◈' },
  { id: 'submissions', label: 'Submissions', icon: '▤' },
  { id: 'events', label: 'Community Events', icon: '◉' },
  { id: 'feedback', label: 'Feedback', icon: '◻' },
  { id: 'reports', label: 'Reports', icon: '◷' },
]

const consultationLinks = [
  { id: 'future-dev', label: 'Future Development', color: '#3987e5' },
  { id: 'transport', label: 'Transport Corridors', color: '#199e70' },
  { id: 'natural-hazards', label: 'Natural Hazards', color: '#c98500' },
  { id: 'housing', label: 'Housing Intensification', color: '#008300' },
  { id: 'coastal', label: 'Coastal Environment', color: '#9085e9' },
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
        <p className="nav-section-label">Public Engagement</p>
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => onNavChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}

        <p className="nav-section-label" style={{ marginTop: '24px' }}>Active Consultations</p>
        {consultationLinks.map(p => (
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
        <div className="user-avatar">RSP</div>
        <div className="user-info">
          <p className="user-name">Planning Team</p>
          <p className="user-role">Regional Spatial Planning</p>
        </div>
        <button className="settings-btn" title="Settings">⚙</button>
      </div>
    </aside>
  )
}
