import { useState, useEffect } from 'react';
import {
  Plus, X, Trash2, Flame, Check, Calendar,
} from 'lucide-react';
import {
  getFlareUps, addFlareUp, updateFlareUp, deleteFlareUp,
  getTodayStr, formatDate,
} from '../utils/storage';
import { COMMON_TRIGGERS, SEVERITY_COLORS, SEVERITY_LABELS, SYMPTOMS } from '../utils/constants';

export default function FlareUpLog({ onRefresh }) {
  const [flareups, setFlareups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [severity, setSeverity] = useState(3);
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [notes, setNotes] = useState('');
  const [customTrigger, setCustomTrigger] = useState('');

  useEffect(() => { reload(); }, []);

  function reload() {
    const all = getFlareUps();
    all.sort((a, b) => b.startDate.localeCompare(a.startDate));
    setFlareups(all);
  }

  function toggleTrigger(t) {
    setSelectedTriggers(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  }

  function toggleSymptom(s) {
    setSelectedSymptoms(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  }

  function handleSave() {
    const triggers = [...selectedTriggers];
    if (customTrigger.trim()) triggers.push(customTrigger.trim());
    addFlareUp({
      startDate: getTodayStr(),
      endDate: null,
      severity,
      triggers,
      symptoms: selectedSymptoms,
      notes: notes.trim(),
    });
    setShowModal(false);
    setSeverity(3);
    setSelectedTriggers([]);
    setSelectedSymptoms([]);
    setNotes('');
    setCustomTrigger('');
    reload();
    onRefresh();
  }

  function handleEnd(id) {
    updateFlareUp(id, { endDate: getTodayStr() });
    reload();
    onRefresh();
  }

  function handleDelete(id) {
    deleteFlareUp(id);
    reload();
    onRefresh();
  }

  const active = flareups.filter(f => !f.endDate);
  const resolved = flareups.filter(f => f.endDate);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Flare-ups</h1>
        <p className="page-subtitle">Track and manage flare-up episodes</p>
      </div>

      {active.length > 0 && (
        <div className="section">
          <div className="section-title">Active</div>
          <div className="entry-list">
            {active.map(f => {
              const days = Math.ceil((new Date() - new Date(f.startDate)) / 86400000);
              return (
                <div key={f.id} className="card" style={{ borderLeft: `3px solid ${SEVERITY_COLORS[f.severity]}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Flame size={16} color={SEVERITY_COLORS[f.severity]} />
                    <span style={{ fontWeight: 700, flex: 1 }}>Day {days}</span>
                    <span className="badge" style={{
                      background: `${SEVERITY_COLORS[f.severity]}22`,
                      color: SEVERITY_COLORS[f.severity],
                    }}>
                      {SEVERITY_LABELS[f.severity]}
                    </span>
                  </div>

                  {f.triggers?.length > 0 && (
                    <div className="chip-group" style={{ marginBottom: 8 }}>
                      {f.triggers.map((t, i) => (
                        <span key={i} className="badge" style={{ background: '#F0C98722', color: '#B8860B' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {f.symptoms?.length > 0 && (
                    <div className="chip-group" style={{ marginBottom: 8 }}>
                      {f.symptoms.map((s, i) => {
                        const sym = SYMPTOMS.find(x => x.id === s);
                        return (
                          <span key={i} className="badge" style={{ background: '#9B8EC422', color: '#7B6EA4' }}>
                            {sym?.label || s}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {f.notes && (
                    <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
                      {f.notes}
                    </div>
                  )}

                  <div style={{ fontSize: 12, color: 'var(--color-text-light)', marginBottom: 10 }}>
                    Started {formatDate(f.startDate)}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => handleEnd(f.id)}>
                      <Check size={14} /> Mark Resolved
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {active.length === 0 && resolved.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Flame size={48} />
          </div>
          <h3>No flare-ups recorded</h3>
          <p>Tap + when you experience a flare-up</p>
        </div>
      )}

      {active.length === 0 && resolved.length === 0 ? null : active.length === 0 && (
        <div className="card" style={{ textAlign: 'center', marginBottom: 16, padding: 20 }}>
          <div style={{ color: 'var(--color-success)', marginBottom: 4 }}>
            <Check size={24} />
          </div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>No Active Flare-ups</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>You're in the clear right now</div>
        </div>
      )}

      {resolved.length > 0 && (
        <div className="section">
          <div className="section-title">History</div>
          <div className="entry-list">
            {resolved.map(f => {
              const duration = Math.ceil(
                (new Date(f.endDate) - new Date(f.startDate)) / 86400000
              );
              return (
                <div key={f.id} className="entry-card" style={{ opacity: 0.8 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: `${SEVERITY_COLORS[f.severity]}15`,
                    color: SEVERITY_COLORS[f.severity],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Flame size={16} />
                  </div>
                  <div className="entry-content">
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
                      {duration} day{duration !== 1 ? 's' : ''} &middot; {SEVERITY_LABELS[f.severity]}
                    </div>
                    {f.triggers?.length > 0 && (
                      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                        Triggers: {f.triggers.join(', ')}
                      </div>
                    )}
                    <div className="entry-meta">
                      {formatDate(f.startDate)} &ndash; {formatDate(f.endDate)}
                    </div>
                  </div>
                  <button className="entry-delete" onClick={() => handleDelete(f.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
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
              <h2 className="modal-title" style={{ margin: 0 }}>Log Flare-up</h2>
              <button onClick={() => setShowModal(false)} style={{ padding: 4 }}>
                <X size={20} color="var(--color-text-secondary)" />
              </button>
            </div>

            <div className="section">
              <label className="input-label">Severity</label>
              <div className="severity-selector">
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    key={v}
                    className={`severity-dot ${severity === v ? 'active' : ''}`}
                    style={{ background: SEVERITY_COLORS[v] }}
                    onClick={() => setSeverity(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 12, color: SEVERITY_COLORS[severity], fontWeight: 600, marginTop: 6 }}>
                {SEVERITY_LABELS[severity]}
              </div>
            </div>

            <div className="section">
              <label className="input-label">Possible Triggers</label>
              <div className="chip-group">
                {COMMON_TRIGGERS.map(t => (
                  <button
                    key={t}
                    className={`chip ${selectedTriggers.includes(t) ? 'active' : ''}`}
                    onClick={() => toggleTrigger(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <input
                className="input-field"
                placeholder="Add custom trigger..."
                value={customTrigger}
                onChange={e => setCustomTrigger(e.target.value)}
                style={{ marginTop: 8 }}
              />
            </div>

            <div className="section">
              <label className="input-label">Symptoms</label>
              <div className="chip-group">
                {SYMPTOMS.slice(0, 12).map(s => (
                  <button
                    key={s.id}
                    className={`chip ${selectedSymptoms.includes(s.id) ? 'active' : ''}`}
                    onClick={() => toggleSymptom(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="section">
              <label className="input-label">Notes</label>
              <textarea
                className="input-field"
                placeholder="What happened? Any patterns..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>
                <Flame size={14} /> Log Flare-up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
