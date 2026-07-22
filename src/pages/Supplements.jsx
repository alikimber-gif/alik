import { useState, useEffect } from 'react';
import {
  Plus, X, Trash2, Check, Pill, ChevronDown, ChevronUp,
} from 'lucide-react';
import {
  getSupplements, addSupplement, deleteSupplement,
  getSupplementLog, logSupplement, getTodayStr,
} from '../utils/storage';
import { DEFAULT_SUPPLEMENTS } from '../utils/constants';

export default function SupplementsPage({ onRefresh }) {
  const [supplements, setSupplements] = useState([]);
  const [todayLog, setTodayLog] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [suppNotes, setSuppNotes] = useState('');

  const today = getTodayStr();

  useEffect(() => { reload(); }, []);

  function reload() {
    const supps = getSupplements().filter(s => s.active);
    setSupplements(supps);
    const log = getSupplementLog().filter(l => l.date === today);
    const logMap = {};
    log.forEach(l => { logMap[l.supplementId] = l.taken; });
    setTodayLog(logMap);
  }

  function handleToggleTaken(suppId) {
    const current = todayLog[suppId] || false;
    logSupplement(suppId, today, !current);
    reload();
    onRefresh();
  }

  function handleSave() {
    if (!name.trim()) return;
    addSupplement({
      name: name.trim(),
      dosage: dosage.trim(),
      timeOfDay,
      notes: suppNotes.trim(),
    });
    setShowModal(false);
    setName('');
    setDosage('');
    setTimeOfDay('morning');
    setSuppNotes('');
    reload();
    onRefresh();
  }

  function handleAddSuggested(s) {
    addSupplement({
      name: s.name,
      dosage: s.dosage,
      timeOfDay: 'morning',
      notes: '',
    });
    reload();
    onRefresh();
  }

  function handleDelete(id) {
    deleteSupplement(id);
    reload();
    onRefresh();
  }

  const takenCount = supplements.filter(s => todayLog[s.id]).length;
  const totalCount = supplements.length;

  const existingNames = new Set(supplements.map(s => s.name.toLowerCase()));
  const suggestions = DEFAULT_SUPPLEMENTS.filter(
    s => !existingNames.has(s.name.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Supplements</h1>
        <p className="page-subtitle">Track your daily supplement routine</p>
      </div>

      {totalCount > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Today's Progress</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: takenCount === totalCount ? 'var(--color-success)' : 'var(--color-text-secondary)' }}>
              {takenCount}/{totalCount}
            </span>
          </div>
          <div style={{
            height: 8, borderRadius: 4, background: 'var(--color-bg)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: totalCount > 0 ? `${(takenCount / totalCount) * 100}%` : '0%',
              background: takenCount === totalCount ? 'var(--color-success)' : 'var(--color-primary)',
              borderRadius: 4,
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      )}

      {supplements.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Pill size={48} />
          </div>
          <h3>No supplements added</h3>
          <p>Add the supplements you take daily</p>
        </div>
      ) : (
        <div className="section">
          <div className="section-title">Your Supplements</div>
          <div className="entry-list">
            {supplements.map(s => {
              const taken = todayLog[s.id] || false;
              return (
                <div key={s.id} className="entry-card" style={{
                  background: taken ? '#8BC49E0A' : 'var(--color-surface)',
                  border: taken ? '1px solid #8BC49E30' : '1px solid transparent',
                }}>
                  <button
                    onClick={() => handleToggleTaken(s.id)}
                    style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      background: taken ? 'var(--color-success)' : 'var(--color-bg)',
                      color: taken ? 'white' : 'var(--color-text-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                      border: taken ? 'none' : '2px solid var(--color-border)',
                    }}
                  >
                    {taken ? <Check size={18} /> : null}
                  </button>
                  <div className="entry-content">
                    <div style={{
                      fontWeight: 600, fontSize: 14,
                      textDecoration: taken ? 'line-through' : 'none',
                      color: taken ? 'var(--color-text-secondary)' : 'var(--color-text)',
                    }}>
                      {s.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                      {s.dosage}{s.timeOfDay ? ` · ${s.timeOfDay}` : ''}
                    </div>
                  </div>
                  <button className="entry-delete" onClick={() => handleDelete(s.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="section">
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, width: '100%',
              padding: '8px 0', color: 'var(--color-primary)', fontWeight: 600, fontSize: 14,
            }}
          >
            {showSuggestions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            Suggested for Hashimoto's
          </button>
          {showSuggestions && (
            <div className="entry-list" style={{ marginTop: 8 }}>
              {suggestions.map((s, i) => (
                <div key={i} className="entry-card">
                  <div className="entry-content">
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                      {s.dosage} &middot; {s.category}
                    </div>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAddSuggested(s)}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button className="fab" onClick={() => setShowModal(true)}>
        <Plus size={24} />
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 className="modal-title" style={{ margin: 0 }}>Add Supplement</h2>
              <button onClick={() => setShowModal(false)} style={{ padding: 4 }}>
                <X size={20} color="var(--color-text-secondary)" />
              </button>
            </div>

            <div className="section">
              <label className="input-label">Name</label>
              <input
                className="input-field"
                placeholder="e.g. Selenium"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="section">
              <label className="input-label">Dosage</label>
              <input
                className="input-field"
                placeholder="e.g. 200mcg"
                value={dosage}
                onChange={e => setDosage(e.target.value)}
              />
            </div>

            <div className="section">
              <label className="input-label">Time of Day</label>
              <div className="chip-group">
                {['morning', 'afternoon', 'evening', 'with food'].map(t => (
                  <button
                    key={t}
                    className={`chip ${timeOfDay === t ? 'active' : ''}`}
                    onClick={() => setTimeOfDay(t)}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="section">
              <label className="input-label">Notes (optional)</label>
              <textarea
                className="input-field"
                placeholder="Any notes about this supplement..."
                value={suppNotes}
                onChange={e => setSuppNotes(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={!name.trim()}
                style={{ opacity: name.trim() ? 1 : 0.5 }}
              >
                Add Supplement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
