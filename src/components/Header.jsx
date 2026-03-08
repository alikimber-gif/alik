import React, { useState } from 'react'
import './Header.css'

const ranges = ['7D', '30D', '90D', '1Y']

export default function Header({ title, dateRange, onDateRangeChange }) {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        <p className="header-subtitle">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      <div className="header-right">
        <div className="date-range-tabs">
          {ranges.map(r => (
            <button
              key={r}
              className={`range-tab ${dateRange === r ? 'active' : ''}`}
              onClick={() => onDateRangeChange(r)}
            >
              {r}
            </button>
          ))}
        </div>
        <button className="btn-primary">
          + New Post
        </button>
      </div>
    </header>
  )
}
