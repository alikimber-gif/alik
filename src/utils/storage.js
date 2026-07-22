const KEYS = {
  SYMPTOMS: 'hashi_symptoms',
  ENERGY: 'hashi_energy',
  FLAREUPS: 'hashi_flareups',
  SUPPLEMENTS: 'hashi_supplements',
  SUPPLEMENT_LOG: 'hashi_supplement_log',
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function load(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getSymptomEntries() {
  return load(KEYS.SYMPTOMS);
}

export function addSymptomEntry(entry) {
  const entries = load(KEYS.SYMPTOMS);
  const newEntry = { ...entry, id: generateId(), createdAt: new Date().toISOString() };
  entries.push(newEntry);
  save(KEYS.SYMPTOMS, entries);
  return newEntry;
}

export function deleteSymptomEntry(id) {
  const entries = load(KEYS.SYMPTOMS).filter(e => e.id !== id);
  save(KEYS.SYMPTOMS, entries);
}

export function getEnergyEntries() {
  return load(KEYS.ENERGY);
}

export function addEnergyEntry(entry) {
  const entries = load(KEYS.ENERGY);
  const newEntry = { ...entry, id: generateId(), createdAt: new Date().toISOString() };
  entries.push(newEntry);
  save(KEYS.ENERGY, entries);
  return newEntry;
}

export function deleteEnergyEntry(id) {
  const entries = load(KEYS.ENERGY).filter(e => e.id !== id);
  save(KEYS.ENERGY, entries);
}

export function getFlareUps() {
  return load(KEYS.FLAREUPS);
}

export function addFlareUp(entry) {
  const entries = load(KEYS.FLAREUPS);
  const newEntry = { ...entry, id: generateId(), createdAt: new Date().toISOString() };
  entries.push(newEntry);
  save(KEYS.FLAREUPS, entries);
  return newEntry;
}

export function updateFlareUp(id, updates) {
  const entries = load(KEYS.FLAREUPS).map(e =>
    e.id === id ? { ...e, ...updates } : e
  );
  save(KEYS.FLAREUPS, entries);
}

export function deleteFlareUp(id) {
  const entries = load(KEYS.FLAREUPS).filter(e => e.id !== id);
  save(KEYS.FLAREUPS, entries);
}

export function getSupplements() {
  return load(KEYS.SUPPLEMENTS);
}

export function addSupplement(entry) {
  const entries = load(KEYS.SUPPLEMENTS);
  const newEntry = { ...entry, id: generateId(), active: true, createdAt: new Date().toISOString() };
  entries.push(newEntry);
  save(KEYS.SUPPLEMENTS, entries);
  return newEntry;
}

export function updateSupplement(id, updates) {
  const entries = load(KEYS.SUPPLEMENTS).map(e =>
    e.id === id ? { ...e, ...updates } : e
  );
  save(KEYS.SUPPLEMENTS, entries);
}

export function deleteSupplement(id) {
  const entries = load(KEYS.SUPPLEMENTS).filter(e => e.id !== id);
  save(KEYS.SUPPLEMENTS, entries);
}

export function getSupplementLog() {
  return load(KEYS.SUPPLEMENT_LOG);
}

export function logSupplement(supplementId, date, taken) {
  const entries = load(KEYS.SUPPLEMENT_LOG);
  const existing = entries.findIndex(
    e => e.supplementId === supplementId && e.date === date
  );
  if (existing >= 0) {
    entries[existing].taken = taken;
    entries[existing].time = new Date().toISOString();
  } else {
    entries.push({
      id: generateId(),
      supplementId,
      date,
      taken,
      time: new Date().toISOString(),
    });
  }
  save(KEYS.SUPPLEMENT_LOG, entries);
}

export function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(isoStr) {
  return new Date(isoStr).toLocaleTimeString('en-NZ', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getEntriesForDate(entries, date) {
  return entries.filter(e => e.date === date);
}

export function getEntriesForRange(entries, startDate, endDate) {
  return entries.filter(e => e.date >= startDate && e.date <= endDate);
}

export function getDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}
