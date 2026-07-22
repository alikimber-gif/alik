import { useState, useEffect } from 'react';
import {
  Plus, X, ChevronLeft, ChevronRight, Trash2, Zap,
} from 'lucide-react';
import {
  getEnergyEntries, addEnergyEntry, deleteEnergyEntry,
  getTodayStr, getEntriesForDate, formatDate, formatTime,
  getDaysAgo, getEntriesForRange,
} from '../utils/storage';
import { ENERGY_COLORS, ENERGY_LABELS } from '../utils/constants';
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip,
} from 'recharts';

export default function EnergyTracker({ onRefresh }) {
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [level, setLevel] = useState(5);
  const [notes, setNotes] = useState('');
  const [weekData, setWeekData] = useState([]);

  const isToday = selectedDate === getTodayStr();

  useEffect(() => {
    reload();
  }, [selectedDate]);

  function reload() {
    const all = getEnergyEntries();
    setEntries(getEntriesForDate(all, selectedDate));

    const start = getDaysAgo(6);
    const end = getTodayStr();
    const range = getEntriesForRange(all, start, end);
    const byDay = {};
    for (let i = 6; i >= 0; i--) {
      const d = getDaysAgo(i);
      byDay[d] = [];
    }
    range.forEach(e => {
      if (byDay[e.date]) byDay[e.date].push(e.level);
    });
    setWeekData(
      Object.entries(byDay).map(([date, levels]) => ({
        date,
        label: new Date(date).toLocaleDateString('en-NZ', { weekday: 'short' }),
        avg: levels.length > 0 ? Math.round(levels.reduce((a, b) => a + b, 0) / levels.length * 10) / 10 : null,
      }))
    );
  }

  function navigateDate(dir) {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + dir);
    if (d <= new Date()) {
      setSelectedDate(d.toISOString().split('T')[0]);
    }
  }

  function handleSave() {
    addEnergyEntry({
      date: selectedDate,
      level,
      notes: notes.trim(),
    });
    setShowModal(false);
    setLevel(5);
    setNotes('');
    reload();
    onRefresh();
  }

  function handleDelete(id) {
    deleteEnergyEntry(id);
    reload();
    onRefresh();
  }

  const avg = entries.length > 0
    ? Math.round(entries.reduce((a, b) => a + b.level, 0) / entries.length * 10) / 10
    : null;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Energy</h1>
        <p className="page-subtitle">Track your energy throughout the day</p>
      </div>

      <div className="date-nav">
        <button onClick={() => navigateDate(-1)}>
          <ChevronLeft size={20} />
        </button>
        <span className="date-label">{isToday ? 'Today' : formatDate(selectedDate)}</span>
        <button onClick={() => navigateDate(1)} disabled={isToday} style={{ opacity: isToday ? 0.3 : 1 }}>
          <ChevronRight size={20} />
        </button>
      </div>

      {avg !== null && (
        <div className="card" style={{ marginBottom: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Average Today
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, color: ENERGY_COLORS[Math.round(avg)], lineHeight: 1.2 }}>
            {avg}
          </div>
          <div style={{ fontSize: 14, color: ENERGY_COLORS[Math.round(avg)], fontWeight: 600 }}>
            {ENERGY_LABELS[Math.round(avg)]}
          </div>
        </div>
      )}

      {weekData.some(d => d.avg !== null) && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-title" style={{ marginBottom: 12 }}>7-Day Trend</div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={weekData}>
              <defs>
                <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} hide />
              <Tooltip
                contentStyle={{ borderRadius: 8, fontSize: 13, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                formatter={(v) => [`${v}/10`, 'Energy']}
              />
              <Area
                type="monotone"
                dataKey="avg"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#energyGrad)"
                connectNulls
                dot={{ r: 3, fill: 'var(--color-primary)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {entries.length === 0 && avg === null ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Zap size={48} />
          </div>
          <h3>No energy logged</h3>
          <p>Tap + to log your energy level</p>
        </div>
      ) : (
        <div className="section">
          <div className="section-title">Today's Entries</div>
          <div className="entry-list">
            {entries.map(entry => (
              <div key={entry.id} className="entry-card">
                <div
                  style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: `${ENERGY_COLORS[entry.level]}22`,
                    color: ENERGY_COLORS[entry.level],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 16, flexShrink: 0,
                  }}
                >
                  {entry.level}
                </div>
                <div className="entry-content">
                  <div style={{ fontWeight: 600, fontSize: 14, color: ENERGY_COLORS[entry.level] }}>
                    {ENERGY_LABELS[entry.level]}
                  </div>
                  {entry.notes && (
                    <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{entry.notes}</div>
                  )}
                  <div className="entry-meta">{formatTime(entry.createdAt)}</div>
                </div>
                <button className="entry-delete" onClick={() => handleDelete(entry.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="fab" onClick={() => setShowModal(true)}>
        <Plus size={24} />
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 className="modal-title" style={{ margin: 0 }}>Log Energy</h2>
              <button onClick={() => setShowModal(false)} style={{ padding: 4 }}>
                <X size={20} color="var(--color-text-secondary)" />
              </button>
            </div>

            <div className="section" style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 64, fontWeight: 800, color: ENERGY_COLORS[level], lineHeight: 1,
                marginBottom: 4,
              }}>
                {level}
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: ENERGY_COLORS[level], marginBottom: 16 }}>
                {ENERGY_LABELS[level]}
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={level}
                onChange={e => setLevel(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: ENERGY_COLORS[level],
                  height: 6,
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--color-text-light)', marginTop: 4 }}>
                <span>Crashed</span>
                <span>Amazing</span>
              </div>
            </div>

            <div className="section">
              <label className="input-label">Notes (optional)</label>
              <textarea
                className="input-field"
                placeholder="What's affecting your energy..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
