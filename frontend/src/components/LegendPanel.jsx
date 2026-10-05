import React from "react";
import { ERA_ACCENT } from "@/data/eras";
import { FORMATIONS } from "@/data/formations";

const rockCategoryLabel = {
  sedimentary: "Sedimentary",
  igneous: "Igneous",
  metamorphic: "Metamorphic",
};

export default function LegendPanel({ era, collapsed, onClose, onOpenStatement }) {
  const accent = ERA_ACCENT[era.id];
  const formations = FORMATIONS[era.id]?.features ?? [];

  return (
    <aside
      className={`legend-panel ${collapsed ? "collapsed" : ""}`}
      data-testid="legend-panel"
      aria-hidden={collapsed}
    >
      <div className="legend-header">
        {onClose && (
          <button
            type="button"
            className="legend-close"
            data-testid="legend-close-btn"
            onClick={onClose}
            aria-label="Close legend"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        <div className="legend-label">Current Era</div>
        <div
          className="legend-era-name"
          data-testid="legend-era-name"
          style={{ borderLeft: `3px solid ${accent}`, paddingLeft: 10, marginLeft: -13 }}
        >
          {era.name}
        </div>
        <div className="legend-era-period" data-testid="legend-era-period">{era.period}</div>
        <div className="legend-era-tagline">{era.tagline}</div>
        <div className="legend-era-eon">{era.eon}</div>
      </div>

      {era.spotlight && (
        <div
          className="legend-section"
          data-testid="legend-spotlight"
          style={{
            background: `linear-gradient(180deg, ${accent}14 0%, transparent 100%)`,
            borderLeft: `2px solid ${accent}`,
          }}
        >
          <div className="legend-section-title" style={{ color: accent }}>
            <span style={{ background: accent }} />
            Spotlight · {era.spotlight.title}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-primary)", fontStyle: "italic", marginBottom: 6 }}>
            {era.spotlight.subtitle}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.55, marginBottom: 10 }}>
            {era.spotlight.body}
          </div>
          <ul className="legend-list geology">
            {era.spotlight.highlights.map((h, i) => <li key={i}>{h}</li>)}
          </ul>
        </div>
      )}

      {/* Rock types (grouped by category) */}
      <div className="legend-section" data-testid="legend-rocks">
        <div className="legend-section-title">Rock Types</div>
        {Object.entries(era.rockTypes).map(([cat, rocks]) =>
          rocks && rocks.length > 0 ? (
            <div key={cat} style={{ marginBottom: 10 }}>
              <div style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 9,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: accent,
                marginBottom: 4,
              }}>
                {rockCategoryLabel[cat]}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--text-primary)", lineHeight: 1.55 }}>
                {rocks.join(" · ")}
              </div>
            </div>
          ) : null
        )}
      </div>

      {/* Fossils */}
      <div className="legend-section" data-testid="legend-fossils">
        <div className="legend-section-title">Key Fossils</div>
        <ul className="legend-list geology">
          {era.fossils.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
      </div>

      {/* Flora */}
      <div className="legend-section" data-testid="legend-flora">
        <div className="legend-section-title">Flora</div>
        <ul className="legend-list geology">
          {era.flora.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
      </div>

      {/* Fauna */}
      <div className="legend-section" data-testid="legend-fauna">
        <div className="legend-section-title">Fauna</div>
        <ul className="legend-list">
          {era.fauna.map((f, i) => (
            <li key={i}>
              <span className="life-icon">{f.icon}</span>
              <span>{f.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Minerals */}
      <div className="legend-section" data-testid="legend-minerals">
        <div className="legend-section-title">Minerals & Economics</div>
        <ul className="legend-list geology">
          {era.minerals.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
      </div>

      {/* Formation color key */}
      <div className="legend-section" data-testid="legend-formations">
        <div className="legend-section-title">Formations on Map</div>
        {formations.map((f, i) => (
          <div className="legend-formation-item" key={i}>
            <span className="legend-swatch" style={{ background: f.properties.color }} />
            <span>
              <div className="legend-formation-name">{f.properties.name}</div>
              <div className="legend-formation-rock">{f.properties.rock}</div>
            </span>
          </div>
        ))}
      </div>
      {onOpenStatement && (
        <button
          type="button"
          className="legend-statement-link"
          data-testid="legend-statement-link"
          onClick={onOpenStatement}
        >
          Why this map is empty in places
        </button>
      )}
    </aside>
  );
}
