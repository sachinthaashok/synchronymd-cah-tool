import { useState } from "react";
import CAHFinder from "./CAHFinder";
import ProspectCRM from "./ProspectCRM";

export default function App() {
  const [tab, setTab] = useState("finder");
  const [prospects, setProspects] = useState([]);

  const addProspect = (hospital) => {
    setProspects((prev) => {
      if (prev.find((p) => p.id === hospital.id)) return prev;
      return [...prev, { ...hospital, stage: "Identified", priority: "Medium", notes: "", lastContact: null, addedAt: new Date().toISOString() }];
    });
    setTab("crm");
  };

  const updateProspect = (id, updates) => {
    setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const removeProspect = (id) => {
    setProspects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <header style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "#0F6E56", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <span style={{ fontWeight: 600, fontSize: 15, color: "#111" }}>SynchronyMD</span>
            <span style={{ fontSize: 13, color: "#9CA3AF", marginLeft: 4 }}>CAH Outreach Platform</span>
          </div>
          <nav style={{ display: "flex", gap: 4 }}>
            {[["finder", "Hospital Finder"], ["crm", `Pipeline ${prospects.length > 0 ? `(${prospects.length})` : ""}`]].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} style={{ padding: "6px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, background: tab === key ? "#0F6E56" : "transparent", color: tab === key ? "#fff" : "#6B7280" }}>
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem" }}>
        {tab === "finder" ? <CAHFinder prospects={prospects} onAddProspect={addProspect} /> : <ProspectCRM prospects={prospects} onUpdate={updateProspect} onRemove={removeProspect} />}
      </main>
    </div>
  );
}