
import { useEffect, useState } from "react";
import Globe from "./Globe";
import "./App.css";

export default function App() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/reports")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }
      return response.json();
    })
    .then(setReports)
    .catch((err) => setError(err.message));
  }, []);

  return (
    <main className="dashboard">
    <header className="dashboard-header">
    <div>
    <h1>AquaWatch</h1>
    <p>Water Pollution Observatory</p>
    </div>

    <span className="status">
    {error ? "API disconnected" : "Observation explorer"}
    </span>
    </header>

    <section className="globe-layout">
    <div className="globe-container">
    <Globe
    reports={reports}
    onSelectReport={setSelectedReport}
    />
    </div>

    <aside className="report-panel">
    <h2>Observations</h2>
    <p>{reports.length} reports loaded</p>

    {error && <p className="error">{error}</p>}



    {selectedReport ? (
      <div className="report-details">
      <h3>
      {selectedReport.reportCount > 1
        ? "Pollution hotspot"
        : (selectedReport.category ?? "Unknown").replaceAll("_", " ")}
        </h3>

        <p>Evidence score: {selectedReport.score?.toFixed(2) ?? "N/A"}</p>
        <p>Evidence level: {selectedReport.scoreLevel ?? "Unknown"}</p>
        <p>Reports: {selectedReport.reportCount ?? 1}</p>
        <p>
        Location: {[selectedReport.latitude, selectedReport.longitude]
          .map(v => Number.isFinite(Number(v)) && v != null
          ? Number(v).toFixed(4) : "N/A")
          .join(", ")}
          </p>

          <h4>Contributing observations</h4>
          {(selectedReport.reports ?? [selectedReport]).map((r, i) => (
            <div key={r.id ?? i} className="report-item">
            <strong>{(r.category ?? "Unknown").replaceAll("_", " ")}</strong>
            <small>{r.observed_at ?? "Time unavailable"}</small>
            <small>Source: {r.source ?? "Unknown"}</small>
            </div>
          ))}

          <button onClick={() => setSelectedReport(null)}>
          Clear selection
          </button>
          </div>
    ) : (
      <p>Select a hotspot on the globe to inspect its reports.</p>
    )}



    <hr />

    {reports.map((report) => (
      <button
      className="report-item"
      key={report.id}
      onClick={() => setSelectedReport(report)}
      >
      {report.category.replaceAll("_", " ")}
      <small>{report.observed_at}</small>
      </button>
    ))}
    </aside>
    </section>
    </main>
  );
}
