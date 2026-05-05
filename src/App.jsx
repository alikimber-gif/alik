import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import StatsCard from './components/StatsCard'
import FollowersChart from './components/FollowersChart'
import EngagementChart from './components/EngagementChart'
import AudienceChart from './components/AudienceChart'
import PlatformCard from './components/PlatformCard'
import RecentPosts from './components/RecentPosts'
import AlcoholLicenceGuide from './components/AlcoholLicenceGuide'
import { overviewStats, platforms } from './data/mockData'
import './App.css'

const overviewCards = [
  {
    label: 'Total Followers',
    key: 'totalFollowers',
    changeKey: 'followersChange',
    format: 'number',
    color: '#0081C6',
    icon: '◉',
  },
  {
    label: 'Total Reach',
    key: 'totalReach',
    changeKey: 'reachChange',
    format: 'number',
    color: '#33a3d9',
    icon: '◈',
  },
  {
    label: 'Avg. Engagement',
    key: 'avgEngagement',
    changeKey: 'engagementChange',
    format: 'percent',
    color: '#10b981',
    icon: '◆',
  },
  {
    label: 'Total Posts',
    key: 'totalPosts',
    changeKey: 'postsChange',
    format: 'number',
    color: '#f59e0b',
    icon: '▤',
  },
]

export default function App() {
  const [activeNav, setActiveNav] = useState('overview')
  const [dateRange, setDateRange] = useState('30D')

  return (
    <div className="app-layout">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <div className="main-content">
        {activeNav === 'alcohol-licence' ? (
          <AlcoholLicenceGuide />
        ) : (
        <>
        <Header
          title="Overview"
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        <div className="dashboard-body">
          {/* Overview Stats */}
          <section className="stats-grid">
            {overviewCards.map(card => (
              <StatsCard
                key={card.key}
                label={card.label}
                value={overviewStats[card.key]}
                change={overviewStats[card.changeKey]}
                format={card.format}
                accentColor={card.color}
                icon={card.icon}
              />
            ))}
          </section>

          {/* Charts row */}
          <section className="charts-row">
            <div className="chart-col-wide">
              <FollowersChart />
            </div>
            <div className="chart-col-narrow">
              <AudienceChart />
            </div>
          </section>

          {/* Engagement chart */}
          <section>
            <EngagementChart />
          </section>

          {/* Platform breakdown */}
          <section>
            <div className="section-header">
              <h2 className="section-title">Platform Breakdown</h2>
              <p className="section-subtitle">Performance metrics per platform</p>
            </div>
            <div className="platforms-grid">
              {platforms.map(p => (
                <PlatformCard key={p.id} platform={p} />
              ))}
            </div>
          </section>

          {/* Recent Posts */}
          <section>
            <RecentPosts />
          </section>
        </div>
        </>
        )}
      </div>
    </div>
  )
}
