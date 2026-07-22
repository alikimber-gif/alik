import { useState, useCallback } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import SymptomLog from './pages/SymptomLog';
import EnergyTracker from './pages/EnergyTracker';
import FlareUpLog from './pages/FlareUpLog';
import SupplementsPage from './pages/Supplements';
import Insights from './pages/Insights';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  function renderPage() {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} refresh={refreshKey} />;
      case 'symptoms':
        return <SymptomLog onRefresh={triggerRefresh} />;
      case 'energy':
        return <EnergyTracker onRefresh={triggerRefresh} />;
      case 'flareups':
        return <FlareUpLog onRefresh={triggerRefresh} />;
      case 'supplements':
        return <SupplementsPage onRefresh={triggerRefresh} />;
      case 'insights':
        return <Insights refresh={refreshKey} />;
      default:
        return <Dashboard onNavigate={setActiveTab} refresh={refreshKey} />;
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="var(--color-primary)" opacity="0.15"/>
            <path d="M12 6a3.5 3.5 0 0 0-3.5 3.5c0 1.38.8 2.57 1.96 3.15A5.002 5.002 0 0 0 7 17.5h2a3 3 0 0 1 6 0h2a5.002 5.002 0 0 0-3.46-4.85A3.49 3.49 0 0 0 15.5 9.5 3.5 3.5 0 0 0 12 6z" fill="var(--color-primary)" opacity="0.4"/>
            <path d="M9 11c0-.28.22-.5.5-.5h5c.28 0 .5.22.5.5v1.5a2.5 2.5 0 0 1-5 0V11z" fill="var(--color-primary)"/>
          </svg>
          <span>Hashi Tracker</span>
        </div>
      </header>
      <main className="app-main">
        {renderPage()}
      </main>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
