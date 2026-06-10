import { useState, useMemo } from "react";

const CAH_DATA = [
  { id: 1, name: "Audrain Medical Center", city: "Mexico", state: "Missouri", beds: 25, distanceMiles: 41, coverage: "locum", medicareId: "260006" },
  { id: 2, name: "Carroll County Memorial Hospital", city: "Carrollton", state: "Missouri", beds: 25, distanceMiles: 49, coverage: "locum", medicareId: "260018" },
  { id: 3, name: "Callaway Community Hospital", city: "Fulton", state: "Missouri", beds: 25, distanceMiles: 37, coverage: "partial", medicareId: "260057" },
  { id: 4, name: "Chariton County Community Hospital", city: "Keytesville", state: "Missouri", beds: 12, distanceMiles: 61, coverage: "none", medicareId: "261313" },
  { id: 5, name: "Clark County Memorial Hospital", city: "Kahoka", state: "Missouri", beds: 25, distanceMiles: 55, coverage: "partial", medicareId: "260052" },
  { id: 6, name: "Community Hospital-Fairfax", city: "Fairfax", state: "Missouri", beds: 15, distanceMiles: 72, coverage: "none", medicareId: "261316" },
  { id: 7, name: "Gentry County Memorial Hospital", city: "Albany", state: "Missouri", beds: 25, distanceMiles: 58, coverage: "none", medicareId: "260066" },
  { id: 8, name: "Grundy County Memorial Hospital", city: "Trenton", state: "Missouri", beds: 25, distanceMiles: 64, coverage: "locum", medicareId: "260068" },
  { id: 9, name: "Harrison County Community Hospital", city: "Bethany", state: "Missouri", beds: 25, distanceMiles: 67, coverage: "none", medicareId: "260070" },
  { id: 10, name: "Howard County Medical Center", city: "Fayette", state: "Missouri", beds: 20, distanceMiles: 42, coverage: "partial", medicareId: "260075" },
  { id: 11, name: "Knox County Hospital", city: "Edina", state: "Missouri", beds: 12, distanceMiles: 71, coverage: "none", medicareId: "261306" },
  { id: 12, name: "Linn County Hospital", city: "Brookfield", state: "Missouri", beds: 25, distanceMiles: 53, coverage: "locum", medicareId: "260087" },
  { id: 13, name: "Mercer County Hospital", city: "Princeton", state: "Missouri", beds: 25, distanceMiles: 73, coverage: "none", medicareId: "260096" },
  { id: 14, name: "Putnam County Memorial Hospital", city: "Unionville", state: "Missouri", beds: 15, distanceMiles: 81, coverage: "none", medicareId: "261322" },
  { id: 15, name: "Scotland County Memorial Hospital", city: "Memphis", state: "Missouri", beds: 25, distanceMiles: 76, coverage: "none", medicareId: "260120" },
  { id: 16, name: "Schuyler County Public Hospital", city: "Lancaster", state: "Missouri", beds: 15, distanceMiles: 69, coverage: "none", medicareId: "261325" },
  { id: 17, name: "Ralls County Memorial Hospital", city: "New London", state: "Missouri", beds: 12, distanceMiles: 44, coverage: "none", medicareId: "261323" },
  { id: 18, name: "Adair County Health System", city: "Greenfield", state: "Iowa", beds: 25, distanceMiles: 44, coverage: "none", medicareId: "160001" },
  { id: 19, name: "Audubon County Memorial Hospital", city: "Audubon", state: "Iowa", beds: 25, distanceMiles: 51, coverage: "locum", medicareId: "160003" },
  { id: 20, name: "Clarke County Hospital", city: "Osceola", state: "Iowa", beds: 25, distanceMiles: 42, coverage: "none", medicareId: "160012" },
  { id: 21, name: "Davis County Hospital", city: "Bloomfield", state: "Iowa", beds: 18, distanceMiles: 55, coverage: "none", medicareId: "160014" },
  { id: 22, name: "Decatur County Hospital", city: "Leon", state: "Iowa", beds: 11, distanceMiles: 61, coverage: "none", medicareId: "160015" },
  { id: 23, name: "Guthrie County Hospital", city: "Guthrie Center", state: "Iowa", beds: 25, distanceMiles: 47, coverage: "locum", medicareId: "160023" },
  { id: 24, name: "Hamilton County Public Hospital", city: "Webster City", state: "Iowa", beds: 25, distanceMiles: 53, coverage: "none", medicareId: "160025" },
  { id: 25, name: "Lucas County Health Center", city: "Chariton", state: "Iowa", beds: 25, distanceMiles: 49, coverage: "none", medicareId: "160033" },
  { id: 26, name: "Montgomery County Memorial Hospital", city: "Red Oak", state: "Iowa", beds: 25, distanceMiles: 58, coverage: "none", medicareId: "160039" },
  { id: 27, name: "Ringgold County Hospital", city: "Mount Ayr", state: "Iowa", beds: 14, distanceMiles: 72, coverage: "none", medicareId: "161345" },
  { id: 28, name: "Taylor County Hospital", city: "Bedford", state: "Iowa", beds: 16, distanceMiles: 66, coverage: "none", medicareId: "160053" },
  { id: 29, name: "Wayne County Hospital", city: "Corydon", state: "Iowa", beds: 25, distanceMiles: 62, coverage: "none", medicareId: "160058" },
  { id: 30, name: "Madison County Health Care System", city: "Winterset", state: "Iowa", beds: 25, distanceMiles: 37, coverage: "locum", medicareId: "160035" },
];

const COVERAGE_LABELS = {
  none: { label: "No coverage", color: "#DC2626", bg: "#FEF2F2" },
  partial: { label: "Partial / on-call", color: "#D97706", bg: "#FFFBEB" },
  locum: { label: "Locum tenens", color: "#7C3AED", bg: "#F5F3FF" },
  telemedicine: { label: "Telemedicine", color: "#059669", bg: "#ECFDF5" },
  full: { label: "Full in-house", color: "#6B7280", bg: "#F9FAFB" },
};

function scoreHospital(h) {
  let score = 0;
  if (h.beds <= 25) score += 30;
  if (h.distanceMiles >= 35) score += 25;
  if (h.coverage === "none") score += 30;
  else if (h.coverage === "locum") score += 20;
  else if (h.coverage === "partial") score += 10;
  if (h.state === "Missouri" || h.state === "Iowa") score += 15;
  return Math.min(score, 100);
}

export default function CAHFinder({ prospects, onAddProspect }) {
  const [stateFilter, setStateFilter] = useState("All");
  const [coverageFilter, setCoverageFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("score");

  const prospectIds = useMemo(() => new Set(prospects.map((p) => p.id)), [prospects]);

  const filtered = useMemo(() => {
    let data = CAH_DATA.map((h) => ({ ...h, score: scoreHospital(h) }));
    if (stateFilter !== "All") data = data.filter((h) => h.state === stateFilter);
    if (coverageFilter !== "All") data = data.filter((h) => h.coverage === coverageFilter);
    if (search) data = data.filter((h) => h.name.toLowerCase().includes(search.toLowerCase()) || h.city.toLowerCase().includes(search.toLowerCase()));
    data.sort((a, b) => sortBy === "score" ? b.score - a.score : sortBy === "beds" ? a.beds - b.beds : sortBy === "distance" ? b.distanceMiles - a.distanceMiles : a.name.localeCompare(b.name));
    return data;
  }, [stateFilter, coverageFilter, search, sortBy]);

  const states = ["All", ...Array.from(new Set(CAH_DATA.map((h) => h.state))).sort()];

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "#111", margin: 0 }}>Critical Access Hospital Finder</h1>
        <p style={{ color: "#6B7280", fontSize: 14, marginTop: 4 }}>Identify and prioritize CAH outreach targets across the Midwest</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: "1.5rem" }}>
        {[["Total CAHs", CAH_DATA.length], ["Shown", filtered.length], ["High priority", filtered.filter(h => h.score >= 80).length], ["Not in pipeline", filtered.filter(h => !prospectIds.has(h.id)).length]].map(([label, val]) => (
          <div key={label} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#111" }}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "14px 16px", marginBottom: "1rem", display: "flex", gap: 12, flexWrap: "wrap" }}>
        <input type="text" placeholder="Search hospitals..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, minWidth: 160, padding: "7px 12px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 13 }} />
        <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} style={{ padding: "7px 12px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 13 }}>
          {states.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={coverageFilter} onChange={(e) => setCoverageFilter(e.target.value)} style={{ padding: "7px 12px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 13 }}>
          <option value="All">All coverage types</option>
          {Object.entries(COVERAGE_LABELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: "7px 12px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 13 }}>
          <option value="score">Sort: priority score</option>
          <option value="beds">Sort: bed count</option>
          <option value="distance">Sort: distance</option>
          <option value="name">Sort: name</option>
        </select>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((h) => {
          const inPipeline = prospectIds.has(h.id);
          const cov = COVERAGE_LABELS[h.coverage];
          const cahEligible = h.beds <= 25 && h.distanceMiles >= 35;
          return (
            <div key={h.id} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 16, opacity: inPipeline ? 0.6 : 1 }}>
              <div style={{ minWidth: 52, textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: h.score >= 80 ? "#0F6E56" : h.score >= 60 ? "#D97706" : "#9CA3AF" }}>{h.score}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>score</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>{h.name}</span>
                  {cahEligible && <span style={{ fontSize: 11, background: "#ECFDF5", color: "#065F46", padding: "2px 8px", borderRadius: 4, fontWeight: 500 }}>CAH eligible</span>}
                  {inPipeline && <span style={{ fontSize: 11, background: "#EFF6FF", color: "#1D4ED8", padding: "2px 8px", borderRadius: 4, fontWeight: 500 }}>In pipeline</span>}
                </div>
                <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{h.city}, {h.state} · {h.beds} beds · {h.distanceMiles} mi from nearest hospital</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: cov.bg, color: cov.color, fontWeight: 500, whiteSpace: "nowrap" }}>{cov.label}</span>
                <button onClick={() => !inPipeline && onAddProspect(h)} disabled={inPipeline} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid", borderColor: inPipeline ? "#E5E7EB" : "#0F6E56", background: inPipeline ? "#F9FAFB" : "#0F6E56", color: inPipeline ? "#9CA3AF" : "#fff", fontSize: 12, fontWeight: 500, cursor: inPipeline ? "default" : "pointer", whiteSpace: "nowrap" }}>
                  {inPipeline ? "Added" : "Add to pipeline"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}