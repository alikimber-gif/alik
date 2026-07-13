import React from 'react'
import { recentFeedback } from '../data/mockData'
import './RecentPosts.css'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3_600_000)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const sentimentColors = {
  positive: { bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981' },
  mixed: { bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' },
  negative: { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' },
}

export default function RecentPosts() {
  return (
    <div className="recent-posts-card">
      <div className="rp-header">
        <h3 className="chart-title">Recent Feedback</h3>
        <button className="rp-view-all">View all →</button>
      </div>

      <div className="rp-table-wrap">
        <table className="rp-table">
          <thead>
            <tr>
              <th>Consultation</th>
              <th>Summary</th>
              <th>Channel</th>
              <th>Ward</th>
              <th>Sentiment</th>
              <th>Received</th>
            </tr>
          </thead>
          <tbody>
            {recentFeedback.map(item => {
              const sentiment = sentimentColors[item.sentiment]
              return (
                <tr key={item.id} className="rp-row">
                  <td>
                    <span className="rp-platform-badge" style={{ background: 'rgba(57, 135, 229, 0.12)', color: '#3987e5' }}>
                      {item.consultation}
                    </span>
                  </td>
                  <td className="rp-content">{item.summary}</td>
                  <td className="rp-channel">{item.channel}</td>
                  <td className="rp-channel">{item.ward}</td>
                  <td>
                    <span className="rp-engagement" style={{ background: sentiment.bg, color: sentiment.color }}>
                      {item.sentiment}
                    </span>
                  </td>
                  <td className="rp-time">{timeAgo(item.submittedAt)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
