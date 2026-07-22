import { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, TrendingDown, Minus, Calendar,
} from 'lucide-react';
import {
  getSymptomEntries, getEnergyEntries, getFlareUps,
  getDaysAgo, getEntriesForRange, getTodayStr,
} from '../utils/storage';
import { SYMPTOMS, SEVERITY_COLORS, ENERGY_COLORS } from '../utils/constants';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  ResponsiveContainer, Tooltip, Cell, CartesianGrid,
} from 'recharts';

export default function Insights({ refresh }) {
  const [range, setRange] = useState(7);
  const [data, setData] = useState(null);

  useEffect(() => {
    const start = getDaysAgo(range - 1);
    const end = getTodayStr();

    const symptoms = getEntriesForRange(getSymptomEntries(), start, end);
    const energy = getEntriesForRange(getEnergyEntries(), start, end);
    const flareups = getFlareUps();

    const dayMap = {};
    for (let i = range - 1; i >= 0; i--) {
      const d = getDaysAgo(i);
      dayMap[d] = { date: d, symptoms: 0, avgSeverity: 0, energy: null, severities: [], energies: [] };
    }

    symptoms.forEach(e => {
      if (dayMap[e.date]) {
        const syms = e.symptoms || [];
        dayMap[e.date].symptoms += syms.length;
        syms.forEach(s => dayMap[e.date].severities.push(s.severity));
      }
    });

    energy.forEach(e => {
      if (dayMap[e.date]) {
        dayMap[e.date].energies.push(e.level);
      }
    });

    const dailyData = Object.values(dayMap).map(d => {
      const avgSev = d.severities.length > 0
        ? Math.round(d.severities.reduce((a, b) => a + b, 0) / d.severities.length * 10) / 10
        : null;
      const avgE = d.energies.length > 0
        ? Math.round(d.energies.reduce((a, b) => a + b, 0) / d.energies.length * 10) / 10
        : null;
      return {
        date: d.date,
        label: new Date(d.date).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' }),
        shortLabel: new Date(d.date).toLocaleDateString('en-NZ', { weekday: 'short' }),
        symptoms: d.symptoms,
        avgSeverity: avgSev,
        energy: avgE,
      };
    });

    const symptomFreq = {};
    symptoms.forEach(e => {
      (e.symptoms || []).forEach(s => {
        if (!symptomFreq[s.name]) symptomFreq[s.name] = { count: 0, totalSev: 0 };
        symptomFreq[s.name].count++;
        symptomFreq[s.name].totalSev += s.severity;
      });
    });

    const topSymptoms = Object.entries(symptomFreq)
      .map(([id, { count, totalSev }]) => ({
        id,
        label: SYMPTOMS.find(s => s.id === id)?.label || id,
        count,
        avgSeverity: Math.round(totalSev / count * 10) / 10,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const energyValues = dailyData.filter(d => d.energy !== null).map(d => d.energy);
    const avgEnergy = energyValues.length > 0
      ? Math.round(energyValues.reduce((a, b) => a + b, 0) / energyValues.length * 10) / 10
      : null;

    const halfPoint = Math.floor(dailyData.length / 2);
    const firstHalf = dailyData.slice(0, halfPoint).filter(d => d.energy !== null);
    const secondHalf = dailyData.slice(halfPoint).filter(d => d.energy !== null);
    const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((a, b) => a + b.energy, 0) / firstHalf.length : null;
    const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((a, b) => a + b.energy, 0) / secondHalf.length : null;
    let energyTrend = 'stable';
    if (firstAvg !== null && secondAvg !== null) {
      if (secondAvg - firstAvg > 0.5) energyTrend = 'up';
      else if (firstAvg - secondAvg > 0.5) energyTrend = 'down';
    }

    const totalFlareups = flareups.filter(
      f => f.startDate >= start && f.startDate <= end
    ).length;

    setData({ dailyData, topSymptoms, avgEnergy, energyTrend, totalFlareups });
  }, [range, refresh]);

  if (!data) return null;

  const labelKey = range <= 7 ? 'shortLabel' : 'label';

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Insights</h1>
        <p className="page-subtitle">Patterns and trends over time</p>
      </div>

      <div className="chip-group" style={{ marginBottom: 20 }}>
        {[7, 14, 30].map(r => (
          <button
            key={r}
            className={`chip ${range === r ? 'active' : ''}`}
            onClick={() => setRange(r)}
          >
            {r} days
          </button>
        ))}
      </div>

      <div className="dashboard-grid" style={{ marginBottom: 20 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Avg Energy
          </div>
          <div style={{
            fontSize: 28, fontWeight: 800, lineHeight: 1.2,
            color: data.avgEnergy ? ENERGY_COLORS[Math.round(data.avgEnergy)] : 'var(--color-text-light)',
          }}>
            {data.avgEnergy ?? '--'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 12, marginTop: 2 }}>
            {data.energyTrend === 'up' && <><TrendingUp size={14} color="var(--color-success)" /><span style={{ color: 'var(--color-success)' }}>Improving</span></>}
            {data.energyTrend === 'down' && <><TrendingDown size={14} color="var(--color-danger)" /><span style={{ color: 'var(--color-danger)' }}>Declining</span></>}
            {data.energyTrend === 'stable' && <><Minus size={14} color="var(--color-text-secondary)" /><span style={{ color: 'var(--color-text-secondary)' }}>Stable</span></>}
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Flare-ups
          </div>
          <div style={{
            fontSize: 28, fontWeight: 800, lineHeight: 1.2,
            color: data.totalFlareups > 0 ? 'var(--color-accent)' : 'var(--color-success)',
          }}>
            {data.totalFlareups}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
            This period
          </div>
        </div>
      </div>

      {data.dailyData.some(d => d.energy !== null) && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-title">Energy Trend</div>
          <div style={{ marginTop: 12 }}>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={data.dailyData}>
                <defs>
                  <linearGradient id="insightEnergyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey={labelKey} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={24} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, fontSize: 12, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  formatter={(v) => [`${v}/10`, 'Energy']}
                />
                <Area
                  type="monotone"
                  dataKey="energy"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#insightEnergyGrad)"
                  connectNulls
                  dot={{ r: 2.5, fill: 'var(--color-primary)' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {data.dailyData.some(d => d.symptoms > 0) && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-title">Daily Symptom Count</div>
          <div style={{ marginTop: 12 }}>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={data.dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey={labelKey} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={24} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, fontSize: 12, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="symptoms" radius={[4, 4, 0, 0]} name="Symptoms">
                  {data.dailyData.map((entry, i) => (
                    <Cell key={i} fill={entry.avgSeverity ? SEVERITY_COLORS[Math.round(entry.avgSeverity)] : 'var(--color-border)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {data.topSymptoms.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-title">Most Frequent Symptoms</div>
          <div style={{ marginTop: 12 }}>
            {data.topSymptoms.map((s, i) => {
              const maxCount = data.topSymptoms[0].count;
              const color = SEVERITY_COLORS[Math.round(s.avgSeverity)] || 'var(--color-primary)';
              return (
                <div key={s.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</span>
                    <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                      {s.count}x &middot; avg {s.avgSeverity}/5
                    </span>
                  </div>
                  <div style={{
                    height: 6, borderRadius: 3, background: 'var(--color-bg)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${(s.count / maxCount) * 100}%`,
                      background: color,
                      borderRadius: 3,
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!data.dailyData.some(d => d.energy !== null) && data.topSymptoms.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <BarChart3 size={48} />
          </div>
          <h3>Not enough data yet</h3>
          <p>Log symptoms and energy levels to see patterns emerge</p>
        </div>
      )}
    </div>
  );
}
