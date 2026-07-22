import { useState, useEffect } from 'react';
import {
  Plus, X, ChevronLeft, ChevronRight, Trash2,
} from 'lucide-react';
import {
  getSymptomEntries, addSymptomEntry, deleteSymptomEntry,
  getTodayStr, getEntriesForDate, formatDate, formatTime,
} from '../utils/storage';
import { SYMPTOMS, SEVERITY_COLORS, SEVERITY_LABELS } from '../utils/constants';

export default function SymptomLog({ onRefresh }) {
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState({});
  const [notes, setNotes] = useState('');

  const isToday = selectedDate === getTodayStr();

  useEffect(() => {
    reload();
  }, [selectedDate]);

  function reload() {
    setEntries(getEntriesForDate(getSymptomEntries(), selectedDate));
  }

  function navigateDate(dir) {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + dir);
    if (d <= new Date()) {
      setSelectedDate(d.toISOString().split('T')[0]);
    }
  }

  function toggleSymptom(id) {
    setSelectedSymptoms(prev => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = 3;
      }
      return next;
    });
  }

  function setSeverity(id, severity) {
    setSelectedSymptoms(prev => ({ ...prev, [id]: severity }));
  }

  function handleSave() {
    const symptoms = Object.entries(selectedSymptoms).map(([name, severity]) => ({
      name,
      severity,
    }));
    if (symptoms.length === 0) return;
    addSymptomEntry({
      date: selectedDate,
      symptoms,
      notes: notes.trim(),
    });
    setShowModal(false);
    setSelectedSymptoms({});
    setNotes('');
    reload();
    onRefresh();
  }

  function handleDelete(id) {
    deleteSymptomEntry(id);
    reload();
    onRefresh();
  }

  const dateLabel = isToday
    ? 'Today'
    : formatDate(selectedDate);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Symptoms</h1>
        <p className="page-subtitle">Track what you're feeling</p>
      </div>

      <div className="date-nav">
        <button onClick={() => navigateDate(-1)}>
          <ChevronLeft size={20} />
        </button>
        <span className="date-label">{dateLabel}</span>
        <button onClick={() => navigateDate(1)} disabled={isToday} style={{ opacity: isToday ? 0.3 : 1 }}>
          <ChevronRight size={20} />
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h3>No symptoms logged</h3>
          <p>Tap + to log how you're feeling</p>
        </div>
      ) : (
        <div className="entry-list">
          {entries.map(entry => (
            <div key={entry.id} className="entry-card">
              <div className="entry-content">
                <div className="chip-group" style={{ marginBottom: 6 }}>
                  {(entry.symptoms || []).map((s, i) => {
                    const sym = SYMPTOMS.find(x => x.id === s.name);
                    return (
                      <span
                        key={i}
                        className="badge"
                        style={{
                          background: `${SEVERITY_COLORS[s.severity]}22`,
                          color: SEVERITY_COLORS[s.severity],
                        }}
                      >
                        {sym?.label || s.name} ({s.severity})
                      </span>
                    );
                  })}
                </div>
                {entry.notes && (
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                    {entry.notes}
                  </div>
                )}
                <div className="entry-meta">{formatTime(entry.createdAt)}</div>
              </div>
              <button className="entry-delete" onClick={() => handleDelete(entry.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button className="fab" onClick={() => setShowModal(true)}>
        <Plus size={24} />
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 className="modal-title" style={{ margin: 0 }}>Log Symptoms</h2>
              <button onClick={() => setShowModal(false)} style={{ padding: 4 }}>
                <X size={20} color="var(--color-text-secondary)" />
              </button>
            </div>

            <div className="section">
              <label className="input-label">Select symptoms</label>
              <div className="chip-group">
                {SYMPTOMS.map(s => (
                  <button
                    key={s.id}
                    className={`chip ${selectedSymptoms[s.id] ? 'active' : ''}`}
                    onClick={() => toggleSymptom(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {Object.keys(selectedSymptoms).length > 0 && (
              <div className="section">
                <label className="input-label">Severity</label>
                {Object.entries(selectedSymptoms).map(([id, severity]) => {
                  const sym = SYMPTOMS.find(s => s.id === id);
                  return (
                    <div key={id} style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>
                        {sym?.label}
                        <span style={{ color: SEVERITY_COLORS[severity], marginLeft: 8, fontSize: 12 }}>
                          {SEVERITY_LABELS[severity]}
                        </span>
                      </div>
                      <div className="severity-selector">
                        {[1, 2, 3, 4, 5].map(v => (
                          <button
                            key={v}
                            className={`severity-dot ${severity === v ? 'active' : ''}`}
                            style={{ background: SEVERITY_COLORS[v] }}
                            onClick={() => setSeverity(id, v)}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="section">
              <label className="input-label">Notes (optional)</label>
              <textarea
                className="input-field"
                placeholder="How are you feeling? Any context..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={Object.keys(selectedSymptoms).length === 0}
                style={{ opacity: Object.keys(selectedSymptoms).length === 0 ? 0.5 : 1 }}
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
