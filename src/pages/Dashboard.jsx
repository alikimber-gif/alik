import { useState, useEffect } from 'react';
import {
  Activity, Zap, Flame, Pill, TrendingUp, TrendingDown,
  Minus, ChevronRight, Sun, Moon, CloudSun,
} from 'lucide-react';
import {
  getSymptomEntries, getEnergyEntries, getFlareUps,
  getSupplements, getSupplementLog, getTodayStr,
  getEntriesForDate, formatTime,
} from '../utils/storage';
import { SYMPTOMS, SEVERITY_COLORS, ENERGY_COLORS, ENERGY_LABELS } from '../utils/constants';
import './Dashboard.css';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good morning', Icon: Sun };
  if (h < 17) return { text: 'Good afternoon', Icon: CloudSun };
  return { text: 'Good evening', Icon: Moon };
}

export default function Dashboard({ onNavigate, refresh }) {
  const [data, setData] = useState(null);
  const today = getTodayStr();

  useEffect(() => {
    const symptoms = getEntriesForDate(getSymptomEntries(), today);
    const energy = getEntriesForDate(getEnergyEntries(), today);
    const flareups = getFlareUps().filter(f => !f.endDate || f.endDate >= today);
    const supplements = getSupplements().filter(s => s.active);
    const supplementLog = getEntriesForDate(getSupplementLog(), today);

    const takenIds = new Set(supplementLog.filter(l => l.taken).map(l => l.supplementId));
    const suppsTaken = supplements.filter(s => takenIds.has(s.id)).length;

    const latestEnergy = energy.length > 0
      ? energy.reduce((a, b) => a.createdAt > b.createdAt ? a : b)
      : null;

    const allSymptoms = symptoms.flatMap(e => e.symptoms || []);
    const symptomCounts = {};
    allSymptoms.forEach(s => {
      if (!symptomCounts[s.name] || s.severity > symptomCounts[s.name].severity) {
        symptomCounts[s.name] = s;
      }
    });

    setData({
      symptomCount: Object.keys(symptomCounts).length,
      topSymptoms: Object.values(symptomCounts).sort((a, b) => b.severity - a.severity).slice(0, 5),
      latestEnergy,
      activeFlareups: flareups.filter(f => !f.endDate),
      totalSupps: supplements.length,
      suppsTaken,
      energyEntries: energy,
    });
  }, [today, refresh]);

  if (!data) return null;

  const { text: greeting, Icon: GreetingIcon } = getGreeting();
  const energyLevel = data.latestEnergy?.level || 0;
  const energyColor = ENERGY_COLORS[energyLevel] || '#ccc';

  return (
    <div className="page">
      <div className="page-header">
        <div className="greeting">
          <GreetingIcon size={20} color="var(--color-warning)" />
          <span>{greeting}</span>
        </div>
        <h1 className="page-title">Your Day</h1>
        <p className="page-subtitle">
          {new Date().toLocaleDateString('en-NZ', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      <div className="dashboard-grid">
        <button className="dash-card energy-card" onClick={() => onNavigate('energy')}>
          <div className="dash-card-header">
            <div className="dash-card-icon" style={{ background: `${energyColor}22`, color: energyColor }}>
              <Zap size={18} />
            </div>
            <ChevronRight size={16} color="var(--color-text-light)" />
          </div>
          <div className="dash-card-value" style={{ color: energyColor }}>
            {energyLevel > 0 ? `${energyLevel}/10` : '--'}
          </div>
          <div className="dash-card-label">
            {energyLevel > 0 ? ENERGY_LABELS[energyLevel] : 'No entry yet'}
          </div>
          <div className="dash-card-sub">Energy Level</div>
        </button>

        <button className="dash-card" onClick={() => onNavigate('symptoms')}>
          <div className="dash-card-header">
            <div className="dash-card-icon" style={{ background: '#9B8EC422', color: 'var(--color-secondary)' }}>
              <Activity size={18} />
            </div>
            <ChevronRight size={16} color="var(--color-text-light)" />
          </div>
          <div className="dash-card-value">{data.symptomCount}</div>
          <div className="dash-card-label">
            {data.symptomCount === 1 ? 'Symptom' : 'Symptoms'}
          </div>
          <div className="dash-card-sub">Logged today</div>
        </button>

        <button className="dash-card" onClick={() => onNavigate('flareups')}>
          <div className="dash-card-header">
            <div className="dash-card-icon" style={{
              background: data.activeFlareups.length > 0 ? '#E8927C22' : '#8BC49E22',
              color: data.activeFlareups.length > 0 ? 'var(--color-accent)' : 'var(--color-success)',
            }}>
              <Flame size={18} />
            </div>
            <ChevronRight size={16} color="var(--color-text-light)" />
          </div>
          <div className="dash-card-value" style={{
            color: data.activeFlareups.length > 0 ? 'var(--color-accent)' : 'var(--color-success)',
          }}>
            {data.activeFlareups.length > 0 ? data.activeFlareups.length : 'Clear'}
          </div>
          <div className="dash-card-label">
            {data.activeFlareups.length > 0 ? 'Active Flare-up' : 'No Flare-ups'}
          </div>
          <div className="dash-card-sub">Status</div>
        </button>

        <button className="dash-card" onClick={() => onNavigate('supplements')}>
          <div className="dash-card-header">
            <div className="dash-card-icon" style={{ background: '#5B8A7222', color: 'var(--color-primary)' }}>
              <Pill size={18} />
            </div>
            <ChevronRight size={16} color="var(--color-text-light)" />
          </div>
          <div className="dash-card-value">
            {data.totalSupps > 0 ? `${data.suppsTaken}/${data.totalSupps}` : '--'}
          </div>
          <div className="dash-card-label">Supplements</div>
          <div className="dash-card-sub">
            {data.totalSupps > 0
              ? data.suppsTaken === data.totalSupps ? 'All taken' : 'Taken today'
              : 'None added'}
          </div>
        </button>
      </div>

      {data.topSymptoms.length > 0 && (
        <div className="section">
          <div className="section-title">Today's Symptoms</div>
          <div className="symptom-pills">
            {data.topSymptoms.map((s, i) => {
              const sym = SYMPTOMS.find(x => x.id === s.name);
              return (
                <div
                  key={i}
                  className="symptom-pill"
                  style={{
                    background: `${SEVERITY_COLORS[s.severity]}18`,
                    borderColor: `${SEVERITY_COLORS[s.severity]}40`,
                    color: SEVERITY_COLORS[s.severity],
                  }}
                >
                  <span className="symptom-pill-dot" style={{ background: SEVERITY_COLORS[s.severity] }} />
                  {sym?.label || s.name}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {data.activeFlareups.length > 0 && (
        <div className="section">
          <div className="section-title">Active Flare-up</div>
          {data.activeFlareups.map(f => {
            const days = Math.ceil((new Date() - new Date(f.startDate)) / 86400000);
            return (
              <div key={f.id} className="card flareup-banner">
                <div className="flareup-banner-top">
                  <Flame size={16} color="var(--color-accent)" />
                  <span className="flareup-banner-days">Day {days}</span>
                  <span className="badge" style={{
                    background: `${SEVERITY_COLORS[f.severity]}22`,
                    color: SEVERITY_COLORS[f.severity],
                  }}>
                    Severity {f.severity}/5
                  </span>
                </div>
                {f.triggers && f.triggers.length > 0 && (
                  <div className="flareup-banner-triggers">
                    Triggers: {f.triggers.join(', ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button className="quick-log-btn" onClick={() => onNavigate('symptoms')}>
        <Activity size={18} />
        <span>Quick Log Symptoms</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
