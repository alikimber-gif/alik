import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import StatsCard from './components/StatsCard'
import FollowersChart from './components/FollowersChart'
import EngagementChart from './components/EngagementChart'
import AudienceChart from './components/AudienceChart'
import PlatformCard from './components/PlatformCard'
import RecentPosts from './components/RecentPosts'
import SentimentChart from './components/SentimentChart'
import ChannelBreakdown from './components/ChannelBreakdown'
import { overviewStats, consultationPhases } from './data/mockData'
import './App.css'

const overviewCards = [
  {
    label: 'Total Submissions',
    key: 'totalSubmissions',
    changeKey: 'submissionsChange',
    format: 'number',
    color: '#3987e5',
    icon: '▤',
  },
  {
    label: 'Community Events',
    key: 'communityEvents',
    changeKey: 'eventsChange',
    format: 'number',
    color: '#199e70',
    icon: '◉',
  },
  {
    label: 'Participation Rate',
    key: 'participationRate',
    changeKey: 'participationChange',
    format: 'percent',
    color: '#c98500',
    icon: '◈',
  },
  {
    label: 'Feedback Responses',
    key: 'feedbackResponses',
    changeKey: 'feedbackChange',
    format: 'number',
    color: '#9085e9',
    icon: '◻',
  },
]

export default function App() {
  const [activeNav, setActiveNav] = useState('overview')
  const [dateRange, setDateRange] = useState('90D')

  return (
    <div className="app-layout">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <div className="main-content">
        <Header
          title="Public Engagement Overview"
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        <div className="dashboard-body">
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

          <section className="charts-row">
            <div className="chart-col-wide">
              <FollowersChart />
            </div>
            <div className="chart-col-narrow">
              <AudienceChart />
            </div>
          </section>

          <section className="charts-row">
            <div className="chart-col-wide">
              <EngagementChart />
            </div>
            <div className="chart-col-narrow">
              <ChannelBreakdown />
            </div>
          </section>

          <section>
            <SentimentChart />
          </section>

          <section>
            <div className="section-header">
              <h2 className="section-title">Active Consultations</h2>
              <p className="section-subtitle">Current and upcoming regional spatial planning consultations</p>
            </div>
            <div className="platforms-grid">
              {consultationPhases.map(c => (
                <PlatformCard key={c.id} consultation={c} />
              ))}
            </div>
          </section>

          <section>
            <RecentPosts />
          </section>
        </div>
      </div>
    </div>
  )
}
