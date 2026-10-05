import React from "react";
import { ERA_ACCENT } from "../data/eras";

// Slider-tuned tints: hue preserved from ERA_ACCENT (pins & legend depend on
// those raw values). Brightness lifted only as far as needed for small
// uppercase mono labels to stay readable on the dark slider bar.
const SLIDER_TINT = {
  quaternary: "#e8c874",     // already bright — unchanged
  neogene: "#e6a860",        // lifted from #d99848
  paleogene: "#d69158",      // lifted from #b87333
  cretaceous: "#6bd196",     // lifted from #4fb377
  jurassic: "#5eb590",       // lifted from #3a8b6d
  triassic: "#e06a4d",       // lifted from #b8442a
  permian: "#a487e0",        // lifted from #7a5cc2
  carboniferous: "#7893d4",  // lifted from #4a6fb8
};

const tintFor = (id) => SLIDER_TINT[id] || ERA_ACCENT[id] || "#8fa0b4";

export default function TimeSlider({ eras, eraIndex, onChange }) {
  const max = eras.length - 1;
  // Slider: LEFT = present (index 0), RIGHT = oldest (index 7)
  // Fill grows from left as user drags right (further into past).
  const fillPct = (eraIndex / max) * 100;
  const current = eras[eraIndex];
  const currentTint = tintFor(current.id);

  return (
    <div className="time-slider-container" data-testid="time-slider-container">
      <div className="time-slider-header">
        <div className="time-slider-current">
          <div className="cur-label">Now Showing</div>
          <div
            className="cur-era"
            data-testid="current-era-name"
            style={{ color: currentTint }}
          >
            {current.name}
          </div>
          <div className="cur-age" data-testid="current-era-period">{current.period}</div>
        </div>
        <div className="time-slider-hint">Drag ← Present · Deep Time →</div>
      </div>

      <div className="time-slider-track-wrap">
        <div className="time-slider-track">
          <div className="time-slider-fill" style={{ width: `${fillPct}%` }} />
        </div>
        <input
          type="range"
          className="time-slider-input"
          data-testid="time-slider-input"
          min={0}
          max={max}
          step={1}
          value={eraIndex}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          aria-label="Geological era slider"
        />

        <div className="time-slider-ticks">
          {eras.map((era, i) => {
            const tint = tintFor(era.id);
            const active = i === eraIndex;
            return (
              <button
                key={era.id}
                type="button"
                className={`time-tick ${active ? "active" : ""}`}
                data-testid={`tick-${era.id}`}
                onClick={() => onChange(i)}
                aria-label={`Jump to ${era.name}`}
              >
                <div
                  className="time-tick-line"
                  style={{
                    background: tint,
                    boxShadow: active ? `0 0 6px ${tint}` : "none",
                  }}
                />
                <div
                  className="time-tick-name"
                  style={{
                    color: tint,
                    fontWeight: active ? 600 : 400,
                    textShadow: active ? `0 0 8px ${tint}66` : "none",
                  }}
                >
                  {era.name}
                </div>
                <div className="time-tick-age">{era.ageMa} Ma</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
