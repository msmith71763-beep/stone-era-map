import React, { useEffect, useState } from "react";
import { ERA_BY_ID, ERA_ACCENT } from "@/data/eras";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function PinNotepad({
  pin,
  pins,
  manageMode,
  onClose,
  onSelectPin,
  onUpdateNote,
  onDelete,
  onClearAll,
  onExport,
}) {
  const [note, setNote] = useState(pin?.note ?? "");
  const [resolvedLocation, setResolvedLocation] = useState(null);

  useEffect(() => {
    setNote(pin?.note ?? "");
    setResolvedLocation(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin?.id]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const saveNote = () => {
    if (pin) onUpdateNote(pin.id, note);
    onClose();
  };

  const exportSingle = () => {
    if (!pin) return;
    const em = ERA_BY_ID[pin.eraId];
    const text = `STRATA — Field Pin
==================================
Era:        ${pin.eraName} (${em?.eon})
Period:     ${pin.eraPeriod}
Coordinate: ${pin.lat.toFixed(5)}°, ${pin.lng.toFixed(5)}°
Dropped:    ${new Date(pin.createdAt).toLocaleString()}

--- NOTES ---
${note || "(no notes)"}

--- ERA CONTEXT ---
Rock types (sedimentary): ${em?.rockTypes.sedimentary.join(", ")}
Rock types (igneous):     ${em?.rockTypes.igneous.join(", ") || "—"}
Rock types (metamorphic): ${em?.rockTypes.metamorphic.join(", ") || "—"}
Key fossils:  ${em?.fossils.join(", ")}
Minerals:     ${em?.minerals.join(", ")}
`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `strata-pin-${pin.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 500);
  };

  // MANAGE MODE — list of pins
  if (manageMode) {
    return (
      <div className="notepad-overlay" data-testid="notepad-overlay" onClick={onClose}>
        <div className="notepad-modal" data-testid="notepad-modal" onClick={(e) => e.stopPropagation()}>
          <div className="notepad-header">
            <div className="notepad-title">
              <span className="dot" />
              <span>Field Pins · {pins.length}</span>
            </div>
            <button className="notepad-close" data-testid="notepad-close-btn" onClick={onClose}>Close</button>
          </div>
          <div className="notepad-body">
            {pins.length === 0 ? (
              <div style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>
                No pins dropped yet.
              </div>
            ) : (
              <div className="pin-list" data-testid="pin-list">
                {pins.map((p) => {
                  const c = ERA_ACCENT[p.eraId] || "#6fd0e4";
                  return (
                    <div className="pin-list-item" key={p.id} data-testid={`pin-list-item-${p.id}`}>
                      <span className="legend-swatch" style={{ background: c }} />
                      <span className="pin-era">{p.eraName}</span>
                      <span className="pin-coords">{p.lat.toFixed(3)}°, {p.lng.toFixed(3)}°</span>
                      <button
                        className="pin-remove"
                        data-testid={`open-pin-${p.id}`}
                        onClick={() => onSelectPin(p.id)}
                        style={{ color: "var(--accent-cyan)" }}
                      >
                        Open
                      </button>
                      <button
                        className="pin-remove"
                        data-testid={`delete-pin-${p.id}`}
                        onClick={() => onDelete(p.id)}
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="notepad-footer">
            <div className="notepad-meta">localStorage · {pins.length} record{pins.length === 1 ? "" : "s"}</div>
            <div className="notepad-actions">
              <button
                className="notepad-btn danger"
                data-testid="clear-all-pins-btn"
                onClick={onClearAll}
                disabled={pins.length === 0}
              >
                Clear all
              </button>
              <button
                className="notepad-btn primary"
                data-testid="export-all-pins-btn"
                onClick={onExport}
                disabled={pins.length === 0}
              >
                Export JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pin) return null;
  const em = ERA_BY_ID[pin.eraId];
  const accent = ERA_ACCENT[pin.eraId];

  return (
    <div className="notepad-overlay" data-testid="notepad-overlay" onClick={onClose}>
      <div className="notepad-modal" data-testid="notepad-modal" onClick={(e) => e.stopPropagation()}>
        <div className="notepad-header">
          <div className="notepad-title">
            <span className="dot" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
            <span>Field Pin</span>
          </div>
          <button className="notepad-close" data-testid="notepad-close-btn" onClick={onClose}>Close · Esc</button>
        </div>

        {/* Locked metadata */}
        <div className="notepad-locked" data-testid="notepad-locked">
          <div className="notepad-locked-field">
            <span className="notepad-locked-label">Coordinates</span>
            <span className="notepad-locked-value" data-testid="notepad-coords">
              {pin.lat.toFixed(5)}°, {pin.lng.toFixed(5)}°<span className="lock">◉ locked</span>
            </span>
          </div>
          <div className="notepad-locked-field">
            <span className="notepad-locked-label">Era</span>
            <span className="notepad-locked-value" data-testid="notepad-era" style={{ color: accent }}>
              {pin.eraName}<span className="lock" style={{ color: accent }}>◉ locked</span>
            </span>
          </div>
          <div className="notepad-locked-field">
            <span className="notepad-locked-label">Period</span>
            <span className="notepad-locked-value">{pin.eraPeriod}</span>
          </div>
          <div className="notepad-locked-field">
            <span className="notepad-locked-label">Eon</span>
            <span className="notepad-locked-value">{em?.eon}</span>
          </div>
        </div>

        {/* Live location-specific geoscience data — Rocks / Life / Minerals */}
        <PinLiveContext
          lat={pin.lat}
          lng={pin.lng}
          accent={accent}
          onLocationResolved={setResolvedLocation}
        />

        {/* Field Notes → PBDB + Mindat submission */}
        <FieldNotesSubmit
          pin={pin}
          note={note}
          accent={accent}
          resolvedLocation={resolvedLocation}
        />

        {/* Free-text notepad */}
        <div className="notepad-body">
          <textarea
            className="notepad-textarea"
            data-testid="notepad-textarea"
            placeholder="Field notes — observations, sample IDs, hypotheses…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            autoFocus
          />
        </div>

        <div className="notepad-footer">
          <div className="notepad-meta">
            Dropped {new Date(pin.createdAt).toLocaleString()}
          </div>
          <div className="notepad-actions">
            <button
              className="notepad-btn danger"
              data-testid="delete-pin-btn"
              onClick={() => onDelete(pin.id)}
            >
              Delete
            </button>
            <button
              className="notepad-btn"
              data-testid="export-pin-btn"
              onClick={exportSingle}
            >
              Export .txt
            </button>
            <button
              className="notepad-btn primary"
              data-testid="save-pin-btn"
              onClick={saveNote}
            >
              Save note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// PinLiveContext — location-specific geoscience data from three
// public APIs, proxied by /api/pin_context. Renders Rocks / Life /
// Minerals for the exact lat/lng of the dropped pin.
// ------------------------------------------------------------------
function PinLiveContext({ lat, lng, accent, onLocationResolved }) {
  const [state, setState] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, data: null, error: null });
    (async () => {
      try {
        const res = await fetch(`${API}/pin_context?lat=${lat}&lng=${lng}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setState({ loading: false, data, error: null });
          if (onLocationResolved && data?.location) onLocationResolved(data.location);
        }
      } catch (e) {
        if (!cancelled) setState({ loading: false, data: null, error: e.message || "fetch failed" });
      }
    })();
    return () => { cancelled = true; };
  }, [lat, lng, onLocationResolved]);

  const wrap = {
    borderBottom: "1px solid var(--hairline)",
    padding: "14px 22px 16px",
  };
  const sectionTitle = (label, count, source) => (
    <div style={{
      display: "flex", alignItems: "baseline", justifyContent: "space-between",
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
      color: accent, marginBottom: 6,
    }}>
      <span>{label}{typeof count === "number" ? ` · ${count}` : ""}</span>
      <span style={{ color: "var(--text-dim)", letterSpacing: "0.1em" }}>{source}</span>
    </div>
  );

  if (state.loading) {
    return (
      <div style={wrap} data-testid="pin-live-loading">
        <div style={{
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
          color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{
            display: "inline-block", width: 12, height: 12, borderRadius: "50%",
            border: `2px solid ${accent}30`, borderTopColor: accent,
            animation: "spin 0.9s linear infinite",
          }} />
          Fetching live geoscience for {lat.toFixed(3)}°, {lng.toFixed(3)}°…
        </div>
      </div>
    );
  }

  if (state.error || !state.data) {
    return (
      <div style={wrap} data-testid="pin-live-error">
        <div style={{
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: 10, letterSpacing: "0.16em",
          color: "var(--text-muted)",
        }}>
          Live data unavailable — {state.error || "no response"}. Field notes still saved locally.
        </div>
      </div>
    );
  }

  const { rocks, life, minerals, location } = state.data;
  const rockItems = rocks?.items || [];
  const lifeItems = life?.items || [];
  const mineralItems = minerals?.items || [];
  const allEmpty = rockItems.length === 0 && lifeItems.length === 0 && mineralItems.length === 0;

  const openLogInvitation = (
    <div
      data-testid="pin-live-empty-notice"
      style={{
        fontSize: 12.5,
        color: "rgba(255,255,255,0.6)",
        fontStyle: "italic",
        lineHeight: 1.55,
        display: "flex",
        gap: 8,
        alignItems: "flex-start",
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 14, filter: "grayscale(0.3)", flexShrink: 0 }}>🌍</span>
      <span>Coverage is limited worldwide — we need more research. That's what this program does.</span>
    </div>
  );

  const empty = (_msg) => openLogInvitation;

  return (
    <div data-testid="pin-live-context">
      {/* Location banner */}
      {(location?.state || location?.county) && (
        <div style={{
          padding: "10px 22px",
          borderBottom: "1px solid var(--hairline)",
          background: `${accent}0a`,
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
          color: "var(--text-primary)",
        }} data-testid="pin-live-location">
          <span style={{ color: accent }}>◉</span>{" "}
          {[location.county && `${location.county} County`, location.state, location.country]
            .filter(Boolean).join(" · ")}
        </div>
      )}

      {/* Prominent unified invitation when ALL sources returned empty */}
      {allEmpty && (
        <div
          data-testid="pin-live-all-empty"
          style={{
            padding: "18px 22px 20px",
            borderBottom: "1px solid var(--hairline)",
            borderLeft: "3px solid var(--accent-amber)",
            background: "linear-gradient(180deg, rgba(232, 200, 116, 0.08) 0%, rgba(232, 200, 116, 0.02) 100%)",
          }}
        >
          <div style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 10,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "var(--accent-amber)",
            marginBottom: 8,
          }}>
            ⚑ Uncharted · Open Log
          </div>
          <div style={{
            fontSize: 13.5,
            color: "var(--text-primary)",
            lineHeight: 1.55,
            fontStyle: "italic",
            marginBottom: 6,
          }}>
            The Admiral's Log has no entry for this location yet. Be the first in the world to log what you find here.
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 10,
            color: "var(--text-muted)",
            letterSpacing: "0.12em",
          }}>
            {lat.toFixed(5)}°, {lng.toFixed(5)}° — draft your entry below ↓
          </div>
        </div>
      )}

      {/* ROCKS — Macrostrat */}
      <div style={wrap} data-testid="pin-live-rocks">
        {sectionTitle("Rocks", rockItems.length, "Macrostrat")}
        {rockItems.length === 0 ? empty("No mapped geological units found at this point.") : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {rockItems.slice(0, 4).map((r, i) => (
              <div key={i} style={{ borderLeft: `2px solid ${r.color || accent}`, paddingLeft: 10 }}>
                <div style={{ fontSize: 12.5, color: "var(--text-primary)", fontWeight: 500 }}>
                  {r.name}
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.04em",
                  marginTop: 2,
                }}>
                  {[r.age, r.lithology].filter(Boolean).join(" · ")}
                </div>
                {r.description && (
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.45 }}>
                    {r.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LIFE — PBDB */}
      <div style={wrap} data-testid="pin-live-life">
        {sectionTitle("Life & Fossils", lifeItems.length, "PBDB")}
        {lifeItems.length === 0 ? empty("No fossil occurrences reported within ~55 km.") : (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {lifeItems.slice(0, 6).map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12.5, color: "var(--text-primary)", fontStyle: "italic" }}>
                  {f.identified_as || f.taxon}
                </span>
                <span style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.04em",
                }}>
                  {[f.class || f.phylum, f.early_interval].filter(Boolean).join(" · ")}
                </span>
              </div>
            ))}
            {lifeItems.length > 6 && (
              <div style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>
                + {lifeItems.length - 6} more occurrences
              </div>
            )}
          </div>
        )}
      </div>

      {/* MINERALS — USGS MRDS */}
      <div style={wrap} data-testid="pin-live-minerals">
        {sectionTitle("Minerals", mineralItems.length, "USGS MRDS")}
        {mineralItems.length === 0 ? empty("No mineral resource sites within ~55 km.") : (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {mineralItems.slice(0, 5).map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12.5, color: "var(--text-primary)" }}>
                  {m.site}
                </span>
                {m.commodities && (
                  <span style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 10, color: accent, letterSpacing: "0.08em",
                  }}>
                    {m.commodities.trim()}
                  </span>
                )}
                {m.development && (
                  <span style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'JetBrains Mono',monospace" }}>
                    {m.development}
                  </span>
                )}
              </div>
            ))}
            {mineralItems.length > 5 && (
              <div style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>
                + {mineralItems.length - 5} more sites
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// FieldNotesSubmit — one-button "Submit Find" that records the find
// server-side and deep-links to PBDB Navigator + Mindat map, both
// pre-centered on the pin coordinates.
// ------------------------------------------------------------------
function FieldNotesSubmit({ pin, note, accent, resolvedLocation }) {
  const defaultLocationName = () => {
    if (resolvedLocation) {
      return [
        resolvedLocation.county && `${resolvedLocation.county} County`,
        resolvedLocation.state,
        resolvedLocation.country,
      ].filter(Boolean).join(", ");
    }
    return `${pin.lat.toFixed(3)}°, ${pin.lng.toFixed(3)}°`;
  };

  const [locationName, setLocationName] = useState(defaultLocationName());
  const [findType, setFindType] = useState("rock");
  const [contributor, setContributor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null); // {message, pbdb_url, mindat_url}

  // Keep locationName in sync when resolvedLocation lands and user hasn't edited
  useEffect(() => {
    if (resolvedLocation) {
      setLocationName((prev) => {
        const coordDefault = `${pin.lat.toFixed(3)}°, ${pin.lng.toFixed(3)}°`;
        // Only auto-fill if user hasn't typed a custom value
        return prev === coordDefault || prev === "" ? defaultLocationName() : prev;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedLocation]);

  const submitFind = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        lat: pin.lat,
        lng: pin.lng,
        location_name: locationName,
        find_type: findType,
        notes: note || "",
        contributor,
        era_id: pin.eraId,
        era_name: pin.eraName,
      };
      const res = await fetch(`${API}/submit_find`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Copy formatted find text to clipboard so the user can paste into PBDB/Mindat forms
      const clipboardText =
`STRATA FIELD FIND
Location: ${locationName}
Coordinates: ${pin.lat.toFixed(5)}°, ${pin.lng.toFixed(5)}°
Find type: ${findType}
Era context: ${pin.eraName}
Contributor: ${contributor || "(anonymous)"}

Notes:
${note || "(none)"}`;
      try { await navigator.clipboard.writeText(clipboardText); } catch (_) { /* noop */ }

      // Open only the scientific-record targets returned by the backend
      // (routed by find_type: fossil→PBDB, mineral→Mindat, rock→both)
      if (data.pbdb_url) window.open(data.pbdb_url, "_blank", "noopener");
      if (data.mindat_url) window.open(data.mindat_url, "_blank", "noopener");

      setConfirmation({
        message: data.message || "Find submitted to the scientific record.",
        pbdb_url: data.pbdb_url,
        mindat_url: data.mindat_url,
      });
    } catch (e) {
      setConfirmation({ message: `Submission failed: ${e.message}`, error: true });
    } finally {
      setSubmitting(false);
    }
  };

  const labelStyle = {
    fontFamily: "'JetBrains Mono',monospace",
    fontSize: 9,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "var(--text-dim)",
    marginBottom: 4,
    display: "block",
  };
  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.02)",
    border: "1px solid var(--hairline)",
    borderRadius: 3,
    color: "var(--text-primary)",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 12.5,
    padding: "7px 10px",
    outline: "none",
    transition: "border-color 0.15s ease",
  };

  return (
    <div
      data-testid="field-notes-submit"
      style={{
        padding: "14px 22px 16px",
        borderBottom: "1px solid var(--hairline)",
        background: `${accent}06`,
      }}
    >
      <div style={{
        display: "flex", alignItems: "baseline", justifyContent: "space-between",
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
        color: accent, marginBottom: 10,
      }}>
        <span>Field Notes → Submit Find</span>
        <span style={{ color: "var(--text-dim)", letterSpacing: "0.1em" }}>PBDB · Mindat</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div style={{ gridColumn: "1 / span 2" }}>
          <label style={labelStyle}>Location name</label>
          <input
            data-testid="find-location-input"
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="Auto-populated from coordinates"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>What was found</label>
          <select
            data-testid="find-type-select"
            value={findType}
            onChange={(e) => setFindType(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            <option value="rock">Rock</option>
            <option value="mineral">Mineral</option>
            <option value="fossil">Fossil</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Contributor (optional)</label>
          <input
            data-testid="find-contributor-input"
            type="text"
            value={contributor}
            onChange={(e) => setContributor(e.target.value)}
            placeholder="Your name"
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <button
          type="button"
          data-testid="submit-find-btn"
          onClick={submitFind}
          disabled={submitting}
          className="notepad-btn primary"
          style={{
            opacity: submitting ? 0.6 : 1,
            cursor: submitting ? "wait" : "pointer",
          }}
        >
          {submitting ? "Submitting…" : "Submit Find"}
        </button>
        <span style={{
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: 9.5,
          letterSpacing: "0.14em",
          color: "var(--text-dim)",
        }}>
          Sends to PBDB + Mindat simultaneously. Notes copied to clipboard.
        </span>
      </div>

      {confirmation && (
        <div
          data-testid="submit-find-confirmation"
          style={{
            marginTop: 12,
            padding: "10px 12px",
            borderLeft: `2px solid ${confirmation.error ? "#e8746f" : accent}`,
            background: confirmation.error ? "rgba(232,116,111,0.05)" : `${accent}0d`,
            borderRadius: 2,
          }}
        >
          <div style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 10,
            letterSpacing: "0.14em",
            color: confirmation.error ? "#e8746f" : accent,
            textTransform: "uppercase",
            marginBottom: confirmation.pbdb_url ? 6 : 0,
          }}>
            {confirmation.message}
          </div>
          {(confirmation.pbdb_url || confirmation.mindat_url) && (
            <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
              {confirmation.pbdb_url && (
                <a
                  data-testid="confirmation-pbdb-link"
                  href={confirmation.pbdb_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--accent-cyan)", textDecoration: "none", borderBottom: "1px dotted var(--accent-cyan)" }}
                >
                  PBDB Navigator ↗
                </a>
              )}
              {confirmation.mindat_url && (
                <a
                  data-testid="confirmation-mindat-link"
                  href={confirmation.mindat_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--accent-cyan)", textDecoration: "none", borderBottom: "1px dotted var(--accent-cyan)" }}
                >
                  Mindat Map ↗
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

