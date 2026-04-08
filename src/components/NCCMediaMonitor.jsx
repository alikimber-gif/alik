import { useState, useEffect } from "react";
import {
  TEAL, TEAL_DARK, TEAL_LIGHT,
  TODAY,
  RELEVANCE_COLORS, CATEGORY_LABELS, ACTION_LABELS, FLAG_LABELS,
} from "../constants/nccMedia";
import { useNccMonitor } from "../hooks/useNccMonitor";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const fmt = (d) => d.toLocaleTimeString("en-NZ", { hour: "2-digit", minute: "2-digit" });

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Badge({ text, bg, color, size = 12 }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: 4,
      background: bg, color, fontSize: size, fontWeight: 600,
      letterSpacing: "0.03em", whiteSpace: "nowrap",
    }}>{text}</span>
  );
}

function FuelPanel({ fuel }) {
  if (!fuel) return null;
  const phase = fuel.phase || "Phase 1 (Watchful)";
  const elevated = /phase [234]/i.test(phase);
  const accent = elevated ? "#E65100" : TEAL;

  return (
    <div style={{ border: `1.5px solid ${accent}`, borderRadius: 10, overflow: "hidden", marginBottom: 20 }}>
      <div style={{ background: accent, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <span>⛽</span>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Fuel Crisis Status</span>
        <span style={{ marginLeft: "auto", background: "rgba(255,255,255,0.2)", color: "#fff", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{phase}</span>
      </div>
      <div style={{ background: elevated ? "#FFF3E0" : TEAL_LIGHT, padding: "12px 16px" }}>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 8 }}>
          {[["Petrol", fuel.petrol_days], ["Diesel", fuel.diesel_days], ["Jet fuel", fuel.jet_fuel_days], ["91 octane", fuel.price_91]].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 10, color: "#666", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: TEAL_DARK }}>
                {val && val !== "unknown" ? (label === "91 octane" ? val : val + " days") : "—"}
              </div>
            </div>
          ))}
        </div>
        {fuel.key_development && fuel.key_development !== "unknown" && (
          <div style={{ fontSize: 13, color: "#444", marginBottom: 3 }}><strong>Latest: </strong>{fuel.key_development}</div>
        )}
        {fuel.ncc_implication && fuel.ncc_implication !== "unknown" && (
          <div style={{ fontSize: 13, color: TEAL_DARK }}><strong>NCC: </strong>{fuel.ncc_implication}</div>
        )}
      </div>
    </div>
  );
}

function StoryCard({ story, index }) {
  const [open, setOpen] = useState(false);
  const rel = RELEVANCE_COLORS[story.relevance] || RELEVANCE_COLORS.LOW;
  const cat = CATEGORY_LABELS[story.category] || { label: story.category, bg: "#eee", text: "#555" };
  const act = ACTION_LABELS[story.action] || { label: story.action, color: "#888" };

  return (
    <div style={{
      border: `1.5px solid ${open ? rel.border : "#e8e8e8"}`,
      borderRadius: 10, marginBottom: 10, overflow: "hidden", background: "#fff",
      boxShadow: open ? "0 3px 12px rgba(0,0,0,0.06)" : "none",
      transition: "border-color 0.12s, box-shadow 0.12s",
    }}>
      <div onClick={() => setOpen(o => !o)} style={{
        display: "flex", alignItems: "flex-start", gap: 10,
        padding: "11px 14px", cursor: "pointer",
        background: open ? rel.bg : "#fff", transition: "background 0.12s",
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, minWidth: 22, paddingTop: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: rel.dot }} />
          <span style={{ fontSize: 9, color: "#ccc", fontWeight: 700 }}>#{index + 1}</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 5, alignItems: "center" }}>
            <Badge text={story.relevance} bg={rel.bg} color={rel.text} size={11} />
            <Badge text={cat.label} bg={cat.bg} color={cat.text} size={11} />
            <span style={{ fontSize: 11, color: "#aaa" }}>{story.source}</span>
            {story.date && <span style={{ fontSize: 11, color: "#ccc" }}>· {story.date}</span>}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.4 }}>{story.headline}</div>
        </div>
        <span style={{ color: "#ccc", fontSize: 12, paddingTop: 4, flexShrink: 0 }}>{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${rel.border}22` }}>
          <p style={{ fontSize: 13, color: "#444", lineHeight: 1.7, margin: "10px 0" }}>{story.summary}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#bbb", textTransform: "uppercase" }}>Action</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: act.color }}>→ {act.label}</span>
          </div>
          {story.flags && story.flags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8, alignItems: "center" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#bbb", textTransform: "uppercase" }}>Flags</span>
              {story.flags.map(f => (
                <Badge key={f} text={"⚠ " + (FLAG_LABELS[f] || f)} bg="#FFF8E6" color="#92620A" size={10} />
              ))}
            </div>
          )}
          {story.notes && (
            <div style={{ fontSize: 12, color: "#666", fontStyle: "italic", padding: "7px 10px", background: "#f8f8f8", borderRadius: 6, borderLeft: "3px solid " + TEAL }}>
              {story.notes}
            </div>
          )}
          {story.url && story.url.startsWith("http") && (
            <a href={story.url} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 8, fontSize: 12, color: TEAL, textDecoration: "none" }}>
              View source ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function SummaryBar({ summary, runTime }) {
  if (!summary) return null;
  return (
    <div style={{ background: TEAL_LIGHT, border: "1.5px solid " + TEAL, borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
      <div style={{ flex: 1, minWidth: 180 }}>
        <div style={{ fontSize: 10, color: TEAL_DARK, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Top story today</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.35 }}>{summary.top_story}</div>
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        {[["High", summary.high_count, "#CC0000"], ["Medium", summary.medium_count, "#D4920A"], ["Low", summary.low_count, "#2E7D32"]].map(([label, count, color]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1 }}>{count || 0}</div>
            <div style={{ fontSize: 10, color: "#999", fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>
      {summary.immediate_actions_required && <Badge text="⚡ Action required" bg="#FFF0F0" color="#CC0000" size={11} />}
      {runTime && <span style={{ fontSize: 11, color: "#bbb", marginLeft: "auto" }}>Run {runTime}</span>}
    </div>
  );
}

function FilterBar({ filter, setFilter, stories }) {
  const cats = [...new Set(stories.map(s => s.category))];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
      {["ALL", ...cats].map(c => {
        const cat = c === "ALL" ? { label: "All", bg: "#f0f0f0", text: "#555" } : (CATEGORY_LABELS[c] || { label: c, bg: "#eee", text: "#555" });
        const active = filter.category === c;
        return (
          <button key={c} onClick={() => setFilter(f => ({ ...f, category: c }))} style={{ padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: active ? 700 : 500, border: "1.5px solid " + (active ? TEAL : "#ddd"), background: active ? TEAL : "#fff", color: active ? "#fff" : cat.text, cursor: "pointer" }}>
            {cat.label}
          </button>
        );
      })}
      <div style={{ width: 1, background: "#e0e0e0", margin: "2px 2px" }} />
      {["ALL", "HIGH", "MEDIUM", "LOW"].map(r => {
        const active = filter.relevance === r;
        const rel = r !== "ALL" ? RELEVANCE_COLORS[r] : null;
        return (
          <button key={r} onClick={() => setFilter(f => ({ ...f, relevance: r }))} style={{ padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: active ? 700 : 500, border: "1.5px solid " + (active && rel ? rel.border : "#ddd"), background: active && rel ? rel.bg : "#fff", color: active && rel ? rel.text : "#888", cursor: "pointer" }}>
            {r === "HIGH" ? "🔴 HIGH" : r === "MEDIUM" ? "🟡 MEDIUM" : r === "LOW" ? "🟢 LOW" : "All priorities"}
          </button>
        );
      })}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function NCCMediaMonitor() {
  const {
    status, runTime, error, rawFindings, stories, fuelStatus, summary,
    logs, showRaw, setShowRaw, run,
  } = useNccMonitor();

  const [filter, setFilter]     = useState({ category: "ALL", relevance: "ALL" });
  const [autoRun, setAutoRun]   = useState(false);
  const [nextRun, setNextRun]   = useState(null);
  const [showLogs, setShowLogs] = useState(false);

  // Auto-run at 8:00am
  useEffect(() => {
    if (!autoRun) return;
    const tick = () => {
      const now = new Date();
      const next = new Date();
      next.setHours(8, 0, 0, 0);
      if (now >= next) next.setDate(next.getDate() + 1);
      setNextRun(fmt(next) + (next.getDate() !== now.getDate() ? " tomorrow" : " today"));
      if (now.getHours() === 8 && now.getMinutes() === 0 && now.getSeconds() < 30) run();
    };
    tick();
    const iv = setInterval(tick, 30000);
    return () => clearInterval(iv);
  }, [autoRun, run]);

  const filtered = stories.filter(s =>
    (filter.category === "ALL" || s.category === filter.category) &&
    (filter.relevance === "ALL" || s.relevance === filter.relevance)
  );

  const escalations = stories.filter(s =>
    s.action === "escalate_CE" || s.action === "escalate_ELT" || s.action === "prepare_response"
  );

  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", maxWidth: 820, margin: "0 auto", padding: "20px 16px 48px", color: "#1a1a1a" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'); *{box-sizing:border-box} @keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* MASTHEAD */}
      <div style={{ background: "linear-gradient(135deg," + TEAL + " 0%," + TEAL_DARK + " 100%)", borderRadius: 12, padding: "20px 24px 18px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 3 }}>Te Kaunihera o Whakatū</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 3 }}>Daily Media Monitor</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 16 }}>{TODAY}</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={run} disabled={status === "running"} style={{ background: status === "running" ? "rgba(255,255,255,0.15)" : "#fff", color: status === "running" ? "rgba(255,255,255,0.5)" : TEAL_DARK, border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 14, fontWeight: 700, cursor: status === "running" ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            {status === "running" ? "⏳ Running..." : "▶  Run Now"}
          </button>
          <button onClick={() => setAutoRun(a => !a)} style={{ background: autoRun ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)", color: "#fff", border: "1.5px solid rgba(255,255,255," + (autoRun ? "0.5" : "0.25") + ")", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            {autoRun ? "⏰ Auto ON" : "⏰ Auto OFF"}
          </button>
          {autoRun && nextRun && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Next: {nextRun}</span>}
          {status === "done" && runTime && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginLeft: "auto" }}>Last run: {runTime}</span>}
        </div>
      </div>

      {/* RUNNING */}
      {status === "running" && (
        <div style={{ background: TEAL_LIGHT, border: "1.5px solid " + TEAL, borderRadius: 10, padding: "14px 18px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2.5px solid " + TEAL, borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: TEAL_DARK }}>Searching for NCC media coverage (two-pass process)...</span>
          </div>
          {logs.map((l, i) => (
            <div key={i} style={{ fontSize: 11, fontFamily: "monospace", padding: "1px 0", color: l.type === "search" ? TEAL_DARK : l.type === "error" ? "#CC0000" : l.type === "warn" ? "#D4920A" : "#999" }}>
              <span style={{ color: "#ccc" }}>[{l.time}]</span> {l.msg}
            </div>
          ))}
        </div>
      )}

      {/* ERROR */}
      {status === "error" && (
        <div style={{ background: "#FFF0F0", border: "1.5px solid #CC0000", borderRadius: 10, padding: "14px 18px", marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#CC0000", marginBottom: 6 }}>✗ Monitor failed</div>
          <div style={{ fontSize: 13, color: "#555", marginBottom: 10, lineHeight: 1.6 }}>{error}</div>
          {rawFindings && (
            <div>
              <button onClick={() => setShowRaw(s => !s)} style={{ background: "none", border: "none", color: TEAL, fontSize: 12, cursor: "pointer", fontWeight: 600, padding: 0 }}>
                {showRaw ? "Hide" : "Show"} raw research findings (retrieved successfully before error)
              </button>
              {showRaw && (
                <div style={{ fontSize: 12, color: "#555", lineHeight: 1.65, padding: "10px", marginTop: 6, background: "#f9f9f9", borderRadius: 6, maxHeight: 280, overflowY: "auto", whiteSpace: "pre-wrap" }}>
                  {rawFindings}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* RESULTS */}
      {status === "done" && (
        <>
          <SummaryBar summary={summary} runTime={runTime} />
          <FuelPanel fuel={fuelStatus} />

          {escalations.length > 0 && (
            <div style={{ background: "#FFF0F0", border: "1.5px solid #CC0000", borderRadius: 10, padding: "11px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#CC0000", marginBottom: 5 }}>
                ⚡ {escalations.length} {escalations.length === 1 ? "story requires" : "stories require"} action today
              </div>
              {escalations.map(s => (
                <div key={s.id} style={{ fontSize: 12, color: "#555", padding: "2px 0" }}>
                  → <span style={{ fontWeight: 600, color: ACTION_LABELS[s.action] ? ACTION_LABELS[s.action].color : "#888" }}>{ACTION_LABELS[s.action] ? ACTION_LABELS[s.action].label : s.action}:</span> {s.headline}
                </div>
              ))}
            </div>
          )}

          {stories.length > 0 && <FilterBar filter={filter} setFilter={setFilter} stories={stories} />}

          {filtered.length === 0 && stories.length > 0 && (
            <div style={{ textAlign: "center", padding: "28px", color: "#bbb", fontSize: 13 }}>No stories match the current filters.</div>
          )}

          {filtered.map((s, i) => <StoryCard key={s.id !== null && s.id !== undefined ? s.id : i} story={s} index={i} />)}

          {stories.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: "#bbb", border: "1.5px dashed #ddd", borderRadius: 10 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📰</div>
              <div style={{ fontSize: 14 }}>No stories found in the last 24 hours</div>
            </div>
          )}

          <div style={{ marginTop: 16, display: "flex", gap: 16 }}>
            {rawFindings && (
              <button onClick={() => setShowRaw(s => !s)} style={{ background: "none", border: "none", color: "#bbb", fontSize: 11, cursor: "pointer", padding: 0 }}>
                {showRaw ? "▲ Hide" : "▼ Show"} raw research findings
              </button>
            )}
            <button onClick={() => setShowLogs(s => !s)} style={{ background: "none", border: "none", color: "#bbb", fontSize: 11, cursor: "pointer", padding: 0 }}>
              {showLogs ? "▲ Hide" : "▼ Show"} run log
            </button>
          </div>

          {showRaw && rawFindings && (
            <div style={{ fontSize: 12, color: "#555", lineHeight: 1.65, padding: "10px 12px", marginTop: 6, background: "#f9f9f9", borderRadius: 6, maxHeight: 280, overflowY: "auto", whiteSpace: "pre-wrap" }}>
              {rawFindings}
            </div>
          )}

          {showLogs && (
            <div style={{ background: "#111827", borderRadius: 8, padding: "10px 14px", marginTop: 6, fontFamily: "monospace", fontSize: 11, maxHeight: 200, overflowY: "auto" }}>
              {logs.map((l, i) => (
                <div key={i} style={{ color: l.type === "error" ? "#f87171" : l.type === "success" ? "#86efac" : l.type === "search" ? "#7dd3fc" : l.type === "warn" ? "#fcd34d" : "#6b7280", padding: "1px 0" }}>
                  <span style={{ color: "#374151" }}>[{l.time}]</span> {l.msg}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* IDLE */}
      {status === "idle" && (
        <div style={{ textAlign: "center", padding: "44px 20px", border: "1.5px dashed #c8e8ed", borderRadius: 12, background: "#fafefe" }}>
          <div style={{ fontSize: 38, marginBottom: 10 }}>📋</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: TEAL_DARK, marginBottom: 6 }}>Ready to run</div>
          <div style={{ fontSize: 13, color: "#888", maxWidth: 380, margin: "0 auto 18px", lineHeight: 1.65 }}>
            Uses two passes — first searches the web for NCC-relevant news, then structures the results into a triage-ready roundup. Avoids JSON parsing errors by keeping the two steps separate.
          </div>
          <div style={{ display: "inline-flex", flexDirection: "column", gap: 5, textAlign: "left" }}>
            {[
              "Nelson local and regional news",
              "MBIE fuel stocks + Air NZ Nelson",
              "RMA / Planning Bill progress",
              "Ministerial announcements for local government",
              "Māori / Treaty partnership stories",
              "Climate and coastal hazard legislation",
            ].map(item => (
              <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: TEAL, fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: 13, color: "#666" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 32, paddingTop: 14, borderTop: "1px solid #eee", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
        <span style={{ fontSize: 11, color: "#ccc", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>NCC Communications · Internal use only</span>
        <span style={{ fontSize: 11, color: "#ddd" }}>Powered by Claude with web search</span>
      </div>
    </div>
  );
}
