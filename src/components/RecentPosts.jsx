import React from 'react'
import { recentPosts, platforms } from '../data/mockData'
import './RecentPosts.css'

function formatNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toLocaleString()
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3_600_000)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const platformColors = Object.fromEntries(platforms.map(p => [p.id, p.color]))
const platformNames = Object.fromEntries(platforms.map(p => [p.id, p.name]))

export default function RecentPosts() {
  return (
    <div className="recent-posts-card">
      <div className="rp-header">
        <h3 className="chart-title">Recent Posts</h3>
        <button className="rp-view-all">View all →</button>
      </div>

      <div className="rp-table-wrap">
        <table className="rp-table">
          <thead>
            <tr>
              <th>Platform</th>
              <th>Content</th>
              <th>Reach</th>
              <th>Likes</th>
              <th>Comments</th>
              <th>Shares</th>
              <th>Engagement</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            {recentPosts.map(post => {
              const color = platformColors[post.platform] || '#8b8fa8'
              const pname = platformNames[post.platform] || post.platform
              return (
                <tr key={post.id} className="rp-row">
                  <td>
                    <span className="rp-platform-badge" style={{ background: `${color}20`, color }}>
                      {pname}
                    </span>
                  </td>
                  <td className="rp-content">{post.content}</td>
                  <td className="rp-num">{formatNum(post.reach)}</td>
                  <td className="rp-num">{formatNum(post.likes)}</td>
                  <td className="rp-num">{formatNum(post.comments)}</td>
                  <td className="rp-num">{formatNum(post.shares)}</td>
                  <td>
                    <span className="rp-engagement">
                      {post.engagement}%
                    </span>
                  </td>
                  <td className="rp-time">{timeAgo(post.publishedAt)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
