import { useState } from "react";

const STAGES = ["Identified", "Researching", "Outreach sent", "Call scheduled", "Proposal sent", "Negotiating", "Closed won", "Closed lost"];
const PRIORITIES = ["High", "Medium", "Low"];
const STAGE_COLORS = {
  "Identified": { bg: "#F3F4F6", color: "#374151" }, "Researching": { bg: "#EFF6FF", color: "#1D4ED8" },
  "Outreach sent": { bg: "#FFF7ED", color: "#C2410C" }, "Call scheduled": { bg: "#FFFBEB", color: "#B45309" },
  "Proposal sent": { bg: "#F5F3FF", color: "#6D28D9" }, "Negotiating": { bg: "#ECFDF5", color: "#065F46" },
  "Closed won": { bg: "#DCFCE7", color: "#166534" }, "Closed lost": { bg: "#FEF2F2", color: "#991B1B" },
};
const PRIORITY_COLORS = {
  High: { bg: "#FEF2F2", color: "#DC2626" }, Medium: { bg: "#FFFBEB", color: "#D97706" }, Low: { bg: "#F3F4F6", color: "#6B7280" },
};

function ProspectCard({ prospect, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(prospect.notes || "");
  const stageMeta = STAGE_COLORS[prospect.stage] || STAGE_COLORS["Identified"];
  const priorityMeta = PRIORITY_COLORS[prospect.priority] || PRIORITY_COLORS["Medium"];
  const saveNotes = () => onUpdate(prospect.id, { notes });

  return (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }} onClick={() => setExpanded(!expanded)}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>{prospect.name}</span>
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, fontWeight: 500, background: stageMeta.bg, color: stageMeta.color }}>{prospect.stage}</span>
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, fontWeight: 500, background: priorityMeta.bg, color: priorityMeta.color }}>{prospect.priority} priority</span>
          </div>
          <div style={{ fontSize: 13, color: "#6B7280", marginTop: 3 }}>{prospect.city}, {prospect.state} · {prospect.beds} beds · {prospect.distanceMiles} mi isolation</div>
        </div>
        <span style={{ fontSize: 13, color: "#9CA3AF" }}>{expanded ? "▲" : "▼"}</span>
      </div>
      {expanded && (
        <div style={{ borderTop: "1px solid #F3F4F6", padding: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 4 }}>Pipeline stage</label>
              <select value={prospect.stage} onChange={(e) => onUpdate(prospect.id, { stage: e.target.value })} style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 13 }}>
                {STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 4 }}>Priority</label>
              <select value={prospect.priority} onChange={(e) => onUpdate(prospect.id, { priority: e.target.value })} style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 13 }}>
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 4 }}>Last contact date</label>
              <input type="date" value={prospect.lastContact || ""} onChange={(e) => onUpdate(prospect.id, { lastContact: e.target.value })} style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 13, boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <div style={{ fontSize: 12, color: "#9CA3AF" }}>Medicare ID: {prospect.medicareId || "N/A"}</div>
              <div style={{ fontSize: 12, color: "#9CA3AF" }}>CAH score: {prospect.score || "—"}/100</div>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 4 }}>Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={saveNotes} placeholder="Contact name, call notes, objections raised, follow-up actions..." rows={3} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 13, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={saveNotes} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #0F6E56", background: "#0F6E56", color: "#fff", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Save notes</button>
            <button onClick={() => onRemove(prospect.id)} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #FCA5A5", background: "transparent", color: "#DC2626", fontSize: 12, cursor: "pointer" }}>Remove from pipeline</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProspectCRM({ prospects, onUpdate, onRemove }) {
  const [stageFilter, setStageFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const filtered = prospects.filter((p) => {
    if (stageFilter !== "All" && p.stage !== stageFilter) return false;
    if (priorityFilter !== "All" && p.priority !== priorityFilter) return false;
    return true;
  });

  if (prospects.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: "#111", marginBottom: 8 }}>Pipeline is empty</div>
        <div style={{ fontSize: 14, color: "#6B7280" }}>Go to Hospital Finder and add prospects to start tracking outreach.</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "#111", margin: 0 }}>Outreach Pipeline</h1>
        <p style={{ color: "#6B7280", fontSize: 14, marginTop: 4 }}>Track hospital prospects through the business development cycle</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: "1.5rem" }}>
        {[["Total prospects", prospects.length], ["High priority", prospects.filter(p => p.priority === "High").length], ["Calls scheduled", prospects.filter(p => p.stage === "Call scheduled").length], ["Closed won", prospects.filter(p => p.stage === "Closed won").length]].map(([label, val]) => (
          <div key={label} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#111" }}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "12px 16px", marginBottom: "1rem", display: "flex", gap: 12, flexWrap: "wrap" }}>
        <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} style={{ padding: "7px 12px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 13 }}>
          <option value="All">All stages</option>
          {STAGES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={{ padding: "7px 12px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 13 }}>
          <option value="All">All priorities</option>
          {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
        </select>
        <span style={{ fontSize: 13, color: "#9CA3AF", alignSelf: "center" }}>{filtered.length} shown</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((p) => <ProspectCard key={p.id} prospect={p} onUpdate={onUpdate} onRemove={onRemove} />)}
      </div>
    </div>
  );
}