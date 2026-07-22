import {
  LayoutDashboard,
  Activity,
  Zap,
  Flame,
  Pill,
  BarChart3,
} from 'lucide-react';
import './Navigation.css';

const icons = { LayoutDashboard, Activity, Zap, Flame, Pill, BarChart3 };

const tabs = [
  { id: 'dashboard', label: 'Home', icon: 'LayoutDashboard' },
  { id: 'symptoms', label: 'Symptoms', icon: 'Activity' },
  { id: 'energy', label: 'Energy', icon: 'Zap' },
  { id: 'flareups', label: 'Flare-ups', icon: 'Flame' },
  { id: 'supplements', label: 'Supps', icon: 'Pill' },
  { id: 'insights', label: 'Insights', icon: 'BarChart3' },
];

export default function Navigation({ activeTab, onTabChange }) {
  return (
    <nav className="bottom-nav">
      {tabs.map(tab => {
        const Icon = icons[tab.icon];
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon size={20} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
