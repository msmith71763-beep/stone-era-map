import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "@/App.css";
import { ERAS, ERA_ACCENT, ERA_BY_ID } from "@/data/eras";
import { LAKE_MISSOULA, CORDILLERAN_ICE_EDGE, FLOOD_TRAJECTORY, ARCHAEOLOGICAL_SITES, GEOLOGICAL_EVENT_SITES, FLOOD_ARROWS } from "@/data/pleistocene-flood";
import { PREHISTORIC_SITES, PREHISTORIC_CATEGORY_STYLE } from "@/data/prehistoric-sites";
import PHYSICAL_EVIDENCE from "@/data/physical-evidence.json";
import { EFFIGY_MOUNDS_WI, EFFIGY_MOUNDS_WI_SHARED_NOTE } from "@/data/effigy-mounds-wi";
import { ASIA_DEEP_SITES } from "@/data/asia-deep-sites";
import LegendPanel from "@/components/LegendPanel";
import TimeSlider from "@/components/TimeSlider";
import PinNotepad from "@/components/PinNotepad";

const STORAGE_KEY = "strata.pins.v1";

const readPins = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
};
const writePins = (pins) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(pins)); } catch {}
};

// SVG pin icon — colored by era accent
const buildPinIcon = (L, color) => {
  const html = `
    <div class="strata-pin-icon">
      <svg viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0 C5.4 0 0 5.4 0 12 c0 9 12 20 12 20 s12-11 12-20 C24 5.4 18.6 0 12 0 z"
              fill="${color}" stroke="#0b0e14" stroke-width="1.5"/>
        <circle cx="12" cy="12" r="4" fill="#0b0e14" stroke="#ffffff" stroke-width="1"/>
      </svg>
    </div>
  `;
  return L.divIcon({
    className: "strata-pin-divicon",
    html,
    iconSize: [22, 30],
    iconAnchor: [11, 30],
    popupAnchor: [0, -28],
  });
};

export default function App() {
  const [eraIndex, setEraIndex] = useState(0); // 0 = Quaternary (present-most)
  const [pins, setPins] = useState(readPins);
  const [dropMode, setDropMode] = useState(false);
  const [openNotepadForPinId, setOpenNotepadForPinId] = useState(null);
  const [managePins, setManagePins] = useState(false);
  const [legendCollapsed, setLegendCollapsed] = useState(() => {
    if (typeof window !== "undefined") return window.innerWidth < 900;
    return false;
  });
  const [mapReady, setMapReady] = useState(false);
  // Entry statement overlay — shows on every fresh page load (session-only, no localStorage)
  const [entryOpen, setEntryOpen] = useState(true);

  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const pinLayerRef = useRef(null);
  const pinMarkersRef = useRef(new Map()); // pinId -> marker

  const era = ERAS[eraIndex];

  // Initialize Leaflet map (once)
  useEffect(() => {
    if (mapRef.current) return;
    const L = window.L;
    if (!L) {
      // Leaflet script may still be loading; retry shortly
      const t = setInterval(() => {
        if (window.L) { clearInterval(t); initMap(); }
      }, 60);
      return () => clearInterval(t);
    }
    initMap();

    function initMap() {
      const L = window.L;
      const map = L.map(mapDivRef.current, {
        center: [42, -98],
        zoom: 4,
        minZoom: 3,
        maxZoom: 16,
        zoomControl: true,
        preferCanvas: true,
        worldCopyJump: false,
        attributionControl: true,
      });
      mapRef.current = map;

      // Esri National Geographic World Map — light atlas / classroom-wall-map style
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles © Esri · National Geographic, DeLorme, HERE, UNEP-WCMC, USGS, NASA · Strata — Geological Explorer",
          maxZoom: 16,
          className: "strata-base-tiles",
        }
      ).addTo(map);

      // USGS State Geologic Map Compilation v2 (SGMC) — live bedrock geology overlay
      // Public-domain WMS from mrdata.usgs.gov. Always-on; slider controls legend info panel.
      L.tileLayer.wms("https://mrdata.usgs.gov/services/sgmc2", {
        layers: "sgmc",
        format: "image/png",
        transparent: true,
        version: "1.1.1",
        opacity: 0.62,
        maxNativeZoom: 14,
        maxZoom: 16,
        attribution: "Geology: USGS SGMC v2 (public domain)",
        className: "strata-formation-wms",
      }).addTo(map);

      pinLayerRef.current = L.layerGroup().addTo(map);

      // -----------------------------------------------------------------
      // LAYER: Worldwide Seismic Events (USGS earthquakes, past 7 days)
      // -----------------------------------------------------------------
      const seismicLayer = L.layerGroup();
      const magColor = (m) => (m == null ? "#7c8698" : m < 3 ? "#ffd76a" : m < 5 ? "#ff8a3d" : "#ff4033");
      const magRadius = (m) => (m == null ? 3 : Math.max(3, Math.min(18, 2 + m * 1.6)));
      fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
        .then((r) => r.json())
        .then((data) => {
          (data.features || []).forEach((f) => {
            const c = f.geometry && f.geometry.coordinates;
            if (!c) return;
            const [lng, lat, depth] = c;
            const p = f.properties || {};
            const m = p.mag;
            const marker = L.circleMarker([lat, lng], {
              radius: magRadius(m),
              color: "#0b0e14",
              weight: 1,
              fillColor: magColor(m),
              fillOpacity: 0.85,
              opacity: 0.95,
            });
            const when = p.time ? new Date(p.time).toISOString().replace("T", " ").slice(0, 19) + " UTC" : "unknown";
            marker.bindPopup(
              `<div class="formation-popup">
                 <div class="fp-name">Seismic · M ${m ?? "?"}</div>
                 <div class="fp-rock"><span class="fp-swatch" style="background:${magColor(m)}"></span>${p.place || "Unknown location"}</div>
                 <div style="font-size:10px;color:#7c8698;letter-spacing:0.06em;font-family:'JetBrains Mono',monospace;line-height:1.5;">
                   Depth ${depth != null ? depth.toFixed(1) + " km" : "?"}<br/>${when}<br/>
                   <a href="${p.url || "#"}" target="_blank" rel="noopener" style="color:#6fd0e4;">USGS event ↗</a>
                 </div>
               </div>`
            );
            marker.addTo(seismicLayer);
          });
        })
        .catch(() => { /* soft-fail */ });

      // -----------------------------------------------------------------
      // LAYER: Worldwide Thermal Anomalies (Smithsonian GVP — currently
      // continuing volcanic eruptions worldwide). Falls back automatically
      // because NASA FIRMS requires a registered MAP_KEY (DEMO_KEY denied).
      // -----------------------------------------------------------------
      const thermalLayer = L.layerGroup();
      const gvpUrl =
        "https://webservices.volcano.si.edu/geoserver/GVP-VOTW/ows?service=WFS&version=2.0.0&request=GetFeature" +
        "&typeName=GVP-VOTW:E3WebApp_Eruptions1960&outputFormat=application/json&CQL_FILTER=" +
        encodeURIComponent("ContinuingEruption='True'");
      fetch(gvpUrl)
        .then((r) => r.json())
        .then((data) => {
          const seen = new Set();
          (data.features || []).forEach((f) => {
            const c = f.geometry && f.geometry.coordinates;
            if (!c) return;
            const [lng, lat] = c;
            const p = f.properties || {};
            const key = `${p.VolcanoNumber}`;
            if (seen.has(key)) return;   // one marker per volcano
            seen.add(key);
            const vei = p.ExplosivityIndexMax;
            const size = vei == null ? 7 : Math.max(6, Math.min(14, 5 + vei * 1.8));
            const heatColor = vei != null && vei >= 4 ? "#ff2fa8" : vei != null && vei >= 2 ? "#ff5a1f" : "#ff8f4d";
            const marker = L.circleMarker([lat, lng], {
              radius: size,
              color: "#0b0e14",
              weight: 1,
              fillColor: heatColor,
              fillOpacity: 0.9,
              opacity: 0.95,
              className: "strata-thermal-marker",
            });
            const sd = p.StartDate;
            const start = sd && sd.length === 8 ? `${sd.slice(0,4)}-${sd.slice(4,6)}-${sd.slice(6,8)}` : (sd || "unknown");
            marker.bindPopup(
              `<div class="formation-popup">
                 <div class="fp-name">Thermal · Volcano</div>
                 <div class="fp-rock"><span class="fp-swatch" style="background:${heatColor}"></span>${p.VolcanoName || "Unknown volcano"}</div>
                 <div style="font-size:10px;color:#7c8698;letter-spacing:0.06em;font-family:'JetBrains Mono',monospace;line-height:1.5;">
                   ${lat.toFixed(3)}°, ${lng.toFixed(3)}°<br/>
                   Started ${start}<br/>
                   VEI ${vei ?? "?"} · continuing eruption<br/>
                   Source: Smithsonian GVP
                 </div>
               </div>`
            );
            marker.addTo(thermalLayer);
          });
        })
        .catch(() => { /* soft-fail */ });

      // Layer switcher — dark-chrome-styled Leaflet overlay control.
      // Position: topright, outside the LegendPanel's left column and
      // above the pin-controls' y=72 anchor so it stays fully tappable.
      const overlayControl = L.control.layers(
        null,
        { "Seismic Events": seismicLayer, "Thermal Anomalies": thermalLayer },
        { collapsed: false, position: "topright" }
      ).addTo(map);

      // -----------------------------------------------------------------
      // LAYER: Pleistocene Flood — Glacial Lake Missoula, Cordilleran ice
      // sheet edge, Missoula flood trajectory, and 4 archaeological sites.
      // Auto-pans the map to (47, -115) zoom 5 on toggle-on.
      // -----------------------------------------------------------------
      const floodLayer = L.layerGroup();

      // Lake Missoula polygon
      L.geoJSON(LAKE_MISSOULA, {
        style: {
          color: "#4A90D9",
          weight: 2,
          opacity: 0.9,
          fillColor: "#4A90D9",
          fillOpacity: 0.4,
        },
        onEachFeature: (feat, lyr) => {
          lyr.bindPopup(
            `<div class="formation-popup">
               <div class="fp-name">Pleistocene · Ice-dammed lake</div>
               <div class="fp-rock"><span class="fp-swatch" style="background:#4A90D9"></span>${feat.properties.name}</div>
               <div style="font-size:11px;color:#7c8698;line-height:1.5;">${feat.properties.note}</div>
             </div>`
          );
        },
      }).addTo(floodLayer);

      // Cordilleran Ice Sheet southern edge — dashed light blue polyline
      L.geoJSON(CORDILLERAN_ICE_EDGE, {
        style: {
          color: "#a8d4ff",
          weight: 3,
          opacity: 0.9,
          dashArray: "8, 6",
        },
        onEachFeature: (feat, lyr) => {
          lyr.bindPopup(
            `<div class="formation-popup">
               <div class="fp-name">Pleistocene · Ice sheet edge</div>
               <div class="fp-rock"><span class="fp-swatch" style="background:#a8d4ff"></span>${feat.properties.name}</div>
               <div style="font-size:11px;color:#7c8698;line-height:1.5;">${feat.properties.note}</div>
             </div>`
          );
        },
      }).addTo(floodLayer);

      // Flood trajectory linestring — amber
      L.geoJSON(FLOOD_TRAJECTORY, {
        style: {
          color: "#E8A020",
          weight: 4,
          opacity: 0.9,
          lineCap: "round",
          lineJoin: "round",
        },
        onEachFeature: (feat, lyr) => {
          lyr.bindPopup(
            `<div class="formation-popup">
               <div class="fp-name">Cataclysmic flood path</div>
               <div class="fp-rock"><span class="fp-swatch" style="background:#E8A020"></span>${feat.properties.name}</div>
               <div style="font-size:11px;color:#7c8698;line-height:1.5;">${feat.properties.note}</div>
             </div>`
          );
        },
      }).addTo(floodLayer);

      // Direction arrows along the trajectory (rotated ▶ glyphs)
      FLOOD_ARROWS.forEach((a) => {
        const [lng, lat] = a.at;
        const icon = L.divIcon({
          className: "flood-arrow-icon",
          html: `<div class="flood-arrow" style="transform: rotate(${a.bearing}deg);">▶</div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });
        L.marker([lat, lng], { icon, interactive: false, keyboard: false }).addTo(floodLayer);
      });

      // Archaeological sites — distinct red/amber pins
      L.geoJSON(ARCHAEOLOGICAL_SITES, {
        pointToLayer: (feat, latlng) => {
          const html = `
            <div class="archsite-pin">
              <svg viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0 C5.4 0 0 5.4 0 12 c0 9 12 20 12 20 s12-11 12-20 C24 5.4 18.6 0 12 0 z"
                      fill="#d94b3a" stroke="#0b0e14" stroke-width="1.5"/>
                <circle cx="12" cy="12" r="4.5" fill="#f4c95a" stroke="#0b0e14" stroke-width="1"/>
              </svg>
            </div>`;
          return L.marker(latlng, {
            icon: L.divIcon({ className: "archsite-divicon", html, iconSize: [24, 32], iconAnchor: [12, 32], popupAnchor: [0, -30] }),
          });
        },
        onEachFeature: (feat, lyr) => {
          const p = feat.properties;
          lyr.bindPopup(
            `<div class="formation-popup">
               <div class="fp-name" style="color:#f4c95a;">Archaeological Site</div>
               <div class="fp-rock" style="font-weight:600;">${p.name}</div>
               <div style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.14em;color:#d94b3a;margin-bottom:4px;">${p.age}</div>
               <div style="font-size:11px;color:#7c8698;line-height:1.55;">${p.note}</div>
             </div>`
          );
        },
      }).addTo(floodLayer);

      // Geological event markers — light-blue/white pins, distinct from
      // archaeological red/amber pins.
      L.geoJSON(GEOLOGICAL_EVENT_SITES, {
        pointToLayer: (feat, latlng) => {
          const html = `
            <div class="geoevent-pin">
              <svg viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0 C5.4 0 0 5.4 0 12 c0 9 12 20 12 20 s12-11 12-20 C24 5.4 18.6 0 12 0 z"
                      fill="#e8f2ff" stroke="#0b0e14" stroke-width="1.5"/>
                <circle cx="12" cy="12" r="4.5" fill="#4A90D9" stroke="#0b0e14" stroke-width="1"/>
              </svg>
            </div>`;
          return L.marker(latlng, {
            icon: L.divIcon({ className: "geoevent-divicon", html, iconSize: [24, 32], iconAnchor: [12, 32], popupAnchor: [0, -30] }),
          });
        },
        onEachFeature: (feat, lyr) => {
          const p = feat.properties;
          lyr.bindPopup(
            `<div class="formation-popup">
               <div class="fp-name" style="color:#a8d4ff;">Geological Event</div>
               <div class="fp-rock" style="font-weight:600;">${p.name}</div>
               <div style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.14em;color:#4A90D9;margin-bottom:4px;">${p.age}</div>
               <div style="font-size:11px;color:#7c8698;line-height:1.55;">${p.note}</div>
             </div>`
          );
        },
      }).addTo(floodLayer);

      // Add Pleistocene Flood as a toggleable overlay (initially OFF)
      overlayControl.addOverlay(floodLayer, "Pleistocene Flood");

      // -----------------------------------------------------------------
      // LAYER: Prehistoric Sites — curated pins by category (documented /
      // disputed / story-marker). Standard grouped layer (no clustering
      // library installed). Toggle does NOT auto-pan.
      // -----------------------------------------------------------------
      const prehistoricLayer = L.layerGroup();
      PREHISTORIC_SITES.features.forEach((feat) => {
        const [lng, lat] = feat.geometry.coordinates;
        const p = feat.properties;
        const style = PREHISTORIC_CATEGORY_STYLE[p.category] || PREHISTORIC_CATEGORY_STYLE.documented;
        const label = p.category === "disputed" ? "?" : p.category === "story-marker" ? "!" : "";
        const html = `
          <div class="prehistoric-marker prehistoric-${p.category}">
            <span class="prehistoric-dot" style="background:${style.fill};box-shadow:0 0 0 2px ${style.ring}, 0 2px 4px rgba(0,0,0,0.7);"></span>
            ${label ? `<span class="prehistoric-label">${label}</span>` : ""}
          </div>`;
        const icon = L.divIcon({
          className: "prehistoric-divicon",
          html,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
          popupAnchor: [0, -10],
        });
        const marker = L.marker([lat, lng], { icon });
        const catLabel = p.category === "documented" ? "Documented"
                       : p.category === "disputed"   ? "Disputed"
                       : "Story Marker";
        marker.bindPopup(
          `<div class="formation-popup">
             <div class="fp-name" style="color:${style.ring};">${catLabel} · ${p.access}</div>
             <div class="fp-rock" style="font-weight:600;">${p.name}</div>
             <div style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.12em;color:${style.fill};margin-bottom:4px;">${p.age}</div>
             <div style="font-size:11px;color:#7c8698;line-height:1.55;margin-bottom:6px;">${p.note}</div>
             <div style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#4a5262;">Access · ${p.access}</div>
           </div>`,
          { maxWidth: 260 }
        );
        marker.addTo(prehistoricLayer);
      });

      overlayControl.addOverlay(prehistoricLayer, "Prehistoric Sites");

      // -----------------------------------------------------------------
      // LAYER: Physical Evidence — global archaeology, hominin remains,
      // and Paleolithic occupation. ONE pin per place (features already
      // grouped by site); popup lists all members. Clustered via
      // Leaflet.markercluster when available; graceful fallback to a
      // plain layerGroup otherwise. Off by default. No auto-pan.
      // -----------------------------------------------------------------
      const peUseCluster = typeof L.markerClusterGroup === "function";
      const physicalEvidenceLayer = peUseCluster
        ? L.markerClusterGroup({
            showCoverageOnHover: false,
            spiderfyOnMaxZoom: true,
            maxClusterRadius: 45,
            disableClusteringAtZoom: 9,
          })
        : L.layerGroup();

      // Category → dot styling (three distinctions, reusing amber/pale vocabulary)
      const PE_STYLE = {
        archaeology: { fill: "#d4a94a", ring: "#f2c766", opacity: 1.0,  size: 14, label: "Archaeology"   },
        hominin:     { fill: "#e8d089", ring: "#f6e2a0", opacity: 1.0,  size: 12, label: "Hominin remains" },
        occupation:  { fill: "#8a7a4a", ring: "#c2a664", opacity: 0.75, size: 10, label: "Occupation"     },
      };

      const escapeHtml = (s) => String(s == null ? "" : s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

      (PHYSICAL_EVIDENCE.features || []).forEach((feat) => {
        const [lng, lat] = feat.geometry.coordinates;
        const p = feat.properties;
        const st = PE_STYLE[p.category] || PE_STYLE.archaeology;
        const isHom = p.category === "hominin";
        // hominin gets a hollow-ring treatment for a distinct silhouette
        const dotStyle = isHom
          ? `background:transparent;border:2px solid ${st.fill};box-shadow:0 0 0 1px ${st.ring}55, 0 2px 4px rgba(0,0,0,0.7);width:${st.size}px;height:${st.size}px;`
          : `background:${st.fill};opacity:${st.opacity};box-shadow:0 0 0 2px ${st.ring}77, 0 2px 4px rgba(0,0,0,0.7);width:${st.size}px;height:${st.size}px;`;
        const html = `
          <div class="prehistoric-marker pe-marker pe-${p.category}">
            <span class="prehistoric-dot" style="${dotStyle}"></span>
          </div>`;
        const icon = L.divIcon({
          className: "prehistoric-divicon",
          html,
          iconSize: [st.size + 4, st.size + 4],
          iconAnchor: [(st.size + 4) / 2, (st.size + 4) / 2],
          popupAnchor: [0, -8],
        });
        const marker = L.marker([lat, lng], { icon });

        // Location line: Jerusalem rule → country may be empty; never substitute a modern country
        const locLine = p.country && p.country.trim() !== ""
          ? `${escapeHtml(p.region)} · ${escapeHtml(p.country)}`
          : `${escapeHtml(p.region)}`;

        const disputedFlag = p.disputed
          ? `<span style="color:#e07a5f;font-weight:600;margin-left:8px;">· DISPUTED</span>` : "";

        const coordNote = (p.coord_confidence === "regional" || p.coord_confidence === "approximate") && p.coord_note
          ? `<div style="font-size:10px;color:#7c8698;font-style:italic;margin-top:6px;line-height:1.45;">Pin marks a ${escapeHtml(p.coord_confidence)} landscape, not a single dig site. ${escapeHtml(p.coord_note)}</div>`
          : "";

        let body = "";
        if (p.count === 1 && p.members && p.members.length === 1) {
          const m = p.members[0];
          body = `
            <div style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.12em;color:${st.fill};margin:6px 0 4px;">${escapeHtml(m.date_text || "")}</div>
            <div style="font-size:11px;color:#c3ccd8;line-height:1.55;">${escapeHtml(m.evidence || "")}</div>`;
        } else {
          const dates = (p.members || []).map(m => m.date_text).filter(Boolean);
          const rangeLine = dates.length
            ? `<div style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.12em;color:${st.fill};margin:6px 0 6px;">${escapeHtml(dates[0])}${dates.length > 1 ? ` — ${escapeHtml(dates[dates.length - 1])}` : ""}</div>`
            : "";
          const list = (p.members || []).map((m) => {
            const mCatColor = (PE_STYLE[m.category] || PE_STYLE.archaeology).fill;
            const mDisp = m.disputed ? ` <span style="color:#e07a5f;">· disputed</span>` : "";
            return `
              <div style="border-left:2px solid ${mCatColor}55;padding:4px 0 4px 8px;margin-bottom:6px;">
                <div style="font-size:11px;font-weight:600;color:#e2e6ed;">${escapeHtml(m.name)}${mDisp}</div>
                <div style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.1em;color:${mCatColor};text-transform:uppercase;margin:2px 0;">${escapeHtml(m.category)} · ${escapeHtml(m.date_text || "")}</div>
                <div style="font-size:10.5px;color:#a8b0ba;line-height:1.5;">${escapeHtml(m.evidence || "")}</div>
              </div>`;
          }).join("");
          body = rangeLine + `<div style="max-height:220px;overflow-y:auto;padding-right:4px;">${list}</div>`;
        }

        const honesty = p.disputed
          ? `<div style="margin-top:8px;padding-top:6px;border-top:1px solid #3a4048;font-size:10px;color:#e07a5f;line-height:1.5;">This entry remains disputed. The map holds the dispute open — it does not resolve it.</div>`
          : "";

        marker.bindPopup(
          `<div class="formation-popup">
             <div class="fp-name" style="color:${st.ring};">${escapeHtml(st.label)}${disputedFlag}</div>
             <div class="fp-rock" style="font-weight:600;">${escapeHtml(p.site)}</div>
             <div style="font-size:11px;color:#8a94a6;margin-bottom:2px;">${locLine}</div>
             ${body}
             ${coordNote}
             ${honesty}
           </div>`,
          { maxWidth: 320 }
        );

        if (peUseCluster) physicalEvidenceLayer.addLayer(marker);
        else marker.addTo(physicalEvidenceLayer);
      });

      overlayControl.addOverlay(physicalEvidenceLayer, "Physical Evidence");

      // -----------------------------------------------------------------
      // LAYER: Effigy Mounds (WI) — 16 Late Woodland earthwork sites.
      // Deep copper/ochre accent, distinct from amber documented /
      // pale-yellow disputed / white story-marker. Clustered the same
      // way Physical Evidence clusters so the map stays clean at low
      // zoom. Pins mark public approaches, NOT the earthworks.
      // -----------------------------------------------------------------
      const emUseCluster = typeof L.markerClusterGroup === "function";
      const effigyMoundsLayer = emUseCluster
        ? L.markerClusterGroup({
            showCoverageOnHover: false,
            spiderfyOnMaxZoom: true,
            maxClusterRadius: 45,
            disableClusteringAtZoom: 9,
          })
        : L.layerGroup();

      const EM_FILL = "#B06A1F";   // deep copper/ochre
      const EM_RING = "#D97E26";   // brighter copper halo
      const emEscape = (s) => String(s == null ? "" : s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

      EFFIGY_MOUNDS_WI.forEach((site) => {
        const dotStyle = `background:${EM_FILL};box-shadow:0 0 0 2px ${EM_RING}88, 0 2px 4px rgba(0,0,0,0.7);width:13px;height:13px;`;
        const html = `
          <div class="prehistoric-marker effigy-mound-marker">
            <span class="prehistoric-dot" style="${dotStyle}"></span>
          </div>`;
        const icon = L.divIcon({
          className: "prehistoric-divicon",
          html,
          iconSize: [17, 17],
          iconAnchor: [8.5, 8.5],
          popupAnchor: [0, -8],
        });
        const marker = L.marker([site.lat, site.lng], { icon });

        const privateLine = site.privateLandNote
          ? `<div style="font-size:11px;color:#e07a5f;line-height:1.55;margin-top:6px;">${emEscape(site.privateLandNote)}</div>`
          : "";

        marker.bindPopup(
          `<div class="formation-popup">
             <div class="fp-name" style="color:${EM_RING};">${emEscape(site.name)}</div>
             <div style="font-size:11px;color:#8a94a6;margin-bottom:4px;">${emEscape(site.county)}</div>
             <div style="font-size:11px;color:#c3ccd8;line-height:1.55;margin-bottom:3px;"><span style="color:#8a94a6;">Forms:</span> ${emEscape(site.forms)}</div>
             <div style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.12em;color:${EM_FILL};margin-bottom:3px;">Date: Late Woodland, roughly AD 700-1100</div>
             <div style="font-size:11px;color:#c3ccd8;line-height:1.55;margin-bottom:6px;"><span style="color:#8a94a6;">Access:</span> ${emEscape(site.access)}</div>
             <div style="font-size:10.5px;color:#a8b0ba;font-style:italic;line-height:1.5;margin-bottom:6px;">Pin marks a public approach or entrance, not the earthworks themselves.</div>
             ${privateLine}
             <div style="margin-top:8px;padding-top:6px;border-top:1px solid #3a4048;font-size:10.5px;color:#a8b0ba;line-height:1.55;">${emEscape(EFFIGY_MOUNDS_WI_SHARED_NOTE)}</div>
           </div>`,
          { maxWidth: 300 }
        );

        if (emUseCluster) effigyMoundsLayer.addLayer(marker);
        else marker.addTo(effigyMoundsLayer);
      });

      overlayControl.addOverlay(effigyMoundsLayer, "Effigy Mounds (WI)");

      // -----------------------------------------------------------------
      // LAYER: Asia Deep Sites — 6 Pleistocene/early-modern-human +
      // Denisovan sites across E/SE Asia. Deep teal/jade accent to
      // distinguish from amber / pale-yellow / white / copper. Clustered
      // via Leaflet.markercluster (same config as Effigy Mounds /
      // Physical Evidence). Pins mark publicly accessible areas or
      // approaches, NOT the excavation sites themselves.
      // -----------------------------------------------------------------
      const adUseCluster = typeof L.markerClusterGroup === "function";
      const asiaDeepLayer = adUseCluster
        ? L.markerClusterGroup({
            showCoverageOnHover: false,
            spiderfyOnMaxZoom: true,
            maxClusterRadius: 45,
            disableClusteringAtZoom: 9,
          })
        : L.layerGroup();

      const AD_FILL = "#2E8B57";   // deep teal/jade (sea green)
      const AD_RING = "#4FBF84";   // brighter jade halo
      const adEscape = (s) => String(s == null ? "" : s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

      ASIA_DEEP_SITES.forEach((site) => {
        // Hominin gets a hollow-ring; early-modern-human gets a solid dot
        const isHominin = /hominin|denisovan/i.test(site.kind);
        const dotStyle = isHominin
          ? `background:transparent;border:2px solid ${AD_FILL};box-shadow:0 0 0 1px ${AD_RING}66, 0 2px 4px rgba(0,0,0,0.7);width:13px;height:13px;`
          : `background:${AD_FILL};box-shadow:0 0 0 2px ${AD_RING}88, 0 2px 4px rgba(0,0,0,0.7);width:13px;height:13px;`;
        const html = `
          <div class="prehistoric-marker asia-deep-marker">
            <span class="prehistoric-dot" style="${dotStyle}"></span>
          </div>`;
        const icon = L.divIcon({
          className: "prehistoric-divicon",
          html,
          iconSize: [17, 17],
          iconAnchor: [8.5, 8.5],
          popupAnchor: [0, -8],
        });
        const marker = L.marker([site.lat, site.lng], { icon });

        marker.bindPopup(
          `<div class="formation-popup">
             <div class="fp-name" style="color:${AD_RING};">${adEscape(site.name)}</div>
             <div style="font-size:11px;color:#8a94a6;margin-bottom:4px;">${adEscape(site.country)} · ${adEscape(site.region)}</div>
             <div style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:${AD_FILL};margin-bottom:4px;">${adEscape(site.kind)}</div>
             <div style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.1em;color:${AD_FILL};margin-bottom:4px;">${adEscape(site.age)}</div>
             <div style="font-size:11px;color:#c3ccd8;line-height:1.55;margin-bottom:6px;">${adEscape(site.subContext)}</div>
             <div style="font-size:11px;color:#c3ccd8;line-height:1.55;margin-bottom:6px;"><span style="color:#8a94a6;">Access:</span> ${adEscape(site.access)}</div>
             <div style="font-size:10.5px;color:#a8b0ba;font-style:italic;line-height:1.5;">Pin marks a publicly accessible area or approach, not the excavation site itself.</div>
           </div>`,
          { maxWidth: 300 }
        );

        if (adUseCluster) asiaDeepLayer.addLayer(marker);
        else marker.addTo(asiaDeepLayer);
      });

      overlayControl.addOverlay(asiaDeepLayer, "Asia Deep Sites");

      // -----------------------------------------------------------------
      // URL INLET — "Umbilical Cord" (invisible unless parameters present).
      // Reads ?lat&lon&z&era on first map init. Silently ignores anything
      // malformed. Does not rewrite the URL. Handoff marker is session-
      // only (not persisted in pin storage).
      // -----------------------------------------------------------------
      try {
        const params = new URLSearchParams(window.location.search);
        const latRaw = params.get("lat");
        const lonRaw = params.get("lon");
        const zRaw   = params.get("z");
        const eraRaw = params.get("era");

        if (latRaw != null && lonRaw != null) {
          const latN = Number(latRaw);
          const lonN = Number(lonRaw);
          const latOk = Number.isFinite(latN) && latN >= -90 && latN <= 90;
          const lonOk = Number.isFinite(lonN) && lonN >= -180 && lonN <= 180;
          if (latOk && lonOk) {
            let zoomN = 10;
            if (zRaw != null) {
              const zN = Number(zRaw);
              if (Number.isInteger(zN) && zN >= 3 && zN <= 16) zoomN = zN;
            }
            map.setView([latN, lonN], zoomN);

            const handoffColor = "#6fd0e4"; // existing cyan accent (strata palette)
            const handoffMarker = L.marker([latN, lonN], {
              icon: buildPinIcon(L, handoffColor),
              keyboard: false,
              zIndexOffset: 1000,
            });
            handoffMarker.bindPopup(
              `<div class="formation-popup">
                 <div class="fp-name" style="color:${handoffColor};">Handed off from Earth Timeline 11</div>
               </div>`,
              { maxWidth: 260 }
            );
            handoffMarker.addTo(map);
            handoffMarker.openPopup();
          }
        }

        if (eraRaw != null) {
          const key = String(eraRaw).trim().toLowerCase();
          const idx = ERAS.findIndex(
            (e) => e.id === key || e.name.toLowerCase() === key
          );
          if (idx >= 0) setEraIndex(idx);
        }
      } catch (_) { /* silent — no error UI */ }

      // On toggle ON → auto-fly to the flood corridor
      map.on("overlayadd", (e) => {
        if (e.layer === floodLayer) {
          map.flyTo([47, -115], 5, { duration: 1.2 });
        }
      });

      setMapReady(true);
    }
  }, []);

  // Formations on the map are now delivered live by the USGS SGMC WMS overlay
  // (added once in initMap). The era slider drives the legend panel content only.
  // The prior hardcoded GeoJSON rendering has been removed to avoid double-rendering.
  // FORMATIONS data is still imported and consumed by LegendPanel for the color-key
  // reference (per anchor-hull rule — legend content unchanged).

  // Rebuild pin markers whenever pins or era changes (for era-colored pin dot)
  useEffect(() => {
    const L = window.L;
    const map = mapRef.current;
    const layerGroup = pinLayerRef.current;
    if (!L || !map || !layerGroup) return;

    layerGroup.clearLayers();
    pinMarkersRef.current.clear();

    pins.forEach((pin) => {
      const color = ERA_ACCENT[pin.eraId] || "#6fd0e4";
      const marker = L.marker([pin.lat, pin.lng], {
        icon: buildPinIcon(L, color),
        keyboard: false,
      });
      const eraMeta = ERA_BY_ID[pin.eraId];
      marker.bindTooltip(
        `<div style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.14em;">
           <div style="color:${color};text-transform:uppercase;">${eraMeta?.name ?? pin.eraName}</div>
           <div style="color:#e6eaf2;margin-top:2px;">${pin.lat.toFixed(3)}°, ${pin.lng.toFixed(3)}°</div>
         </div>`,
        { direction: "top", offset: [0, -24], opacity: 1 }
      );
      marker.on("click", () => {
        setOpenNotepadForPinId(pin.id);
        setManagePins(false);
      });
      marker.addTo(layerGroup);
      pinMarkersRef.current.set(pin.id, marker);
    });
  }, [pins]);

  // Persist pins
  useEffect(() => { writePins(pins); }, [pins]);

  // Handle click-to-drop-pin
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const container = map.getContainer();
    if (dropMode) container.classList.add("pin-drop-mode");
    else container.classList.remove("pin-drop-mode");

    const onClick = (e) => {
      if (!dropMode) return;
      const { lat, lng } = e.latlng;
      const now = new Date();
      const newPin = {
        id: `pin-${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
        lat,
        lng,
        eraId: era.id,
        eraName: era.name,
        eraPeriod: era.period,
        createdAt: now.toISOString(),
        note: "",
      };
      setPins((prev) => [...prev, newPin]);
      setDropMode(false);
      setOpenNotepadForPinId(newPin.id);
    };

    map.on("click", onClick);
    return () => {
      map.off("click", onClick);
      container.classList.remove("pin-drop-mode");
    };
  }, [dropMode, era]);

  const activePin = useMemo(
    () => (openNotepadForPinId ? pins.find((p) => p.id === openNotepadForPinId) : null),
    [openNotepadForPinId, pins]
  );

  const updatePinNote = useCallback((pinId, note) => {
    setPins((prev) => prev.map((p) => (p.id === pinId ? { ...p, note } : p)));
  }, []);

  const deletePin = useCallback((pinId) => {
    setPins((prev) => prev.filter((p) => p.id !== pinId));
    if (openNotepadForPinId === pinId) setOpenNotepadForPinId(null);
  }, [openNotepadForPinId]);

  const clearAllPins = useCallback(() => {
    if (pins.length === 0) return;
    // eslint-disable-next-line no-alert
    const ok = window.confirm(`Remove all ${pins.length} pin${pins.length === 1 ? "" : "s"}? This cannot be undone.`);
    if (!ok) return;
    setPins([]);
    setOpenNotepadForPinId(null);
    setManagePins(false);
  }, [pins.length]);

  const exportPins = useCallback(() => {
    const payload = {
      exportedAt: new Date().toISOString(),
      source: "Strata — Geological Explorer",
      pinCount: pins.length,
      pins: pins.map((p) => {
        const em = ERA_BY_ID[p.eraId];
        return {
          id: p.id,
          coordinates: { lat: p.lat, lng: p.lng },
          era: { id: p.eraId, name: p.eraName, period: p.eraPeriod, eon: em?.eon },
          note: p.note || "",
          createdAt: p.createdAt,
        };
      }),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `strata-pins-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 500);
  }, [pins]);

  return (
    <div className="App" data-testid="strata-app">
      <div className="strata-map" ref={mapDivRef} data-testid="strata-map" />

      {!mapReady && (
        <div className="strata-loading" data-testid="strata-loading">
          <div className="spinner" />
          <div>Loading strata…</div>
        </div>
      )}

      {/* Entry statement — full-screen overlay on every fresh load, session-only */}
      {entryOpen && (
        <div
          className="entry-statement-overlay"
          data-testid="entry-statement-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Statement about this map"
        >
          <div className="entry-statement-panel">
            <p className="entry-statement-line" data-testid="entry-statement-line-1">
              Empty ground on this map is empty of excavation, not empty of people.
            </p>
            <p className="entry-statement-line" data-testid="entry-statement-line-2">
              Preservation, access, geology and research funding decide where evidence has been recovered — and therefore where it appears here.
            </p>
            <button
              type="button"
              className="entry-statement-enter"
              data-testid="entry-statement-enter-btn"
              onClick={() => setEntryOpen(false)}
              autoFocus
            >
              ENTER
            </button>
            <div className="entry-statement-mark" data-testid="entry-statement-mark">
              THE ADMIRAL'S LOG OF REAL GEOLOGY
            </div>
          </div>
        </div>
      )}

      {/* Top brand strip */}
      <div className="strata-header" data-testid="strata-header">
        <div className="brand-mark" />
        <div className="brand-name brand-name-full">The Admiral's Log of Real Geology</div>
        <div className="brand-name brand-name-short">Admiral's Log</div>
      </div>

      {/* Mobile legend toggle + dropdown panel (wrapper anchors the dropdown to the button) */}
      <div className="legend-nav-wrap" data-testid="legend-nav-wrap">
        <button
          className="legend-toggle"
          data-testid="legend-toggle-btn"
          aria-label="Toggle legend menu"
          onClick={() => setLegendCollapsed((c) => !c)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <span className="legend-toggle-label">Menu</span>
        </button>

        {/* Backdrop — click anywhere outside the open dropdown to close it (mobile/tablet only) */}
        {!legendCollapsed && (
          <div
            className="legend-backdrop"
            data-testid="legend-backdrop"
            onClick={() => setLegendCollapsed(true)}
            aria-hidden="true"
          />
        )}

        <LegendPanel era={era} collapsed={legendCollapsed} onClose={() => setLegendCollapsed(true)} onOpenStatement={() => { setEntryOpen(true); setLegendCollapsed(true); }} />
      </div>

      <InstallAppButton />

      {/* Pin controls (top right) */}
      <div className="pin-controls" data-testid="pin-controls">
        <button
          className="pin-btn danger"
          data-testid="clear-pins-btn"
          onClick={() => { setManagePins(true); setOpenNotepadForPinId(null); }}
          disabled={pins.length === 0}
          style={{ opacity: pins.length === 0 ? 0.45 : 1, cursor: pins.length === 0 ? "not-allowed" : "pointer" }}
        >
          <span className="btn-dot" />
          <span className="pin-text-full">Manage</span>
          <span className="pin-count">{pins.length}</span>
        </button>
        <button
          className={`pin-btn ${dropMode ? "active" : ""}`}
          data-testid="drop-pin-btn"
          onClick={() => setDropMode((d) => !d)}
        >
          <span className="btn-dot" />
          <span className="pin-text-full">{dropMode ? "Click map…" : "Drop pin"}</span>
        </button>
      </div>

      <TimeSlider
        eras={ERAS}
        eraIndex={eraIndex}
        onChange={setEraIndex}
      />

      {(activePin || managePins) && (
        <PinNotepad
          pin={activePin}
          pins={pins}
          manageMode={managePins && !activePin}
          onClose={() => { setOpenNotepadForPinId(null); setManagePins(false); }}
          onSelectPin={(id) => { setOpenNotepadForPinId(id); setManagePins(false); }}
          onUpdateNote={updatePinNote}
          onDelete={deletePin}
          onClearAll={clearAllPins}
          onExport={exportPins}
        />
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// InstallAppButton — captures beforeinstallprompt and offers a subtle
// install affordance. Auto-hides after 8s on mobile, dismissible via
// localStorage so it never reappears once actioned.
// ------------------------------------------------------------------
const INSTALL_DISMISS_KEY = "admirals-log.install.dismissed";

function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [iosMode, setIosMode] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(INSTALL_DISMISS_KEY) === "1") return;
    } catch (_) { /* noop */ }

    // Platform detection
    const ua = (typeof navigator !== "undefined" && navigator.userAgent) || "";
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isStandalone =
      (window.navigator && window.navigator.standalone === true) ||
      (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches);

    // Already installed → hide UI entirely
    if (isStandalone) return;

    // iOS Safari never fires beforeinstallprompt — show A2HS instruction banner instead
    if (isIOS) {
      setIosMode(true);
      setVisible(true);
      // Auto-hide after 12s on iOS (a bit longer since it's instructional)
      const t = setTimeout(() => setVisible(false), 12000);
      return () => clearTimeout(t);
    }

    // Android/Chrome path — wait for the browser to offer the install prompt
    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
      if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 900px)").matches) {
        setTimeout(() => setVisible(false), 8000);
      }
    };
    const onInstalled = () => {
      try { localStorage.setItem(INSTALL_DISMISS_KEY, "1"); } catch (_) {}
      setVisible(false);
      setDeferredPrompt(null);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = () => {
    try { localStorage.setItem(INSTALL_DISMISS_KEY, "1"); } catch (_) {}
    setVisible(false);
  };

  const doInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    try {
      await deferredPrompt.userChoice;
    } catch (_) {}
    dismiss();
    setDeferredPrompt(null);
  };

  if (!visible) return null;

  // iOS "Add to Home Screen" instruction banner
  if (iosMode) {
    return (
      <div className="install-app-banner install-app-banner-ios" data-testid="install-app-badge" role="dialog" aria-label="Install app instructions">
        <span className="install-ios-text">
          Tap <span className="install-ios-icon" aria-hidden="true">⬆</span> Share, then <b>Add to Home Screen</b> to install
        </span>
        <button
          type="button"
          className="install-app-dismiss"
          data-testid="install-app-dismiss"
          onClick={dismiss}
          aria-label="Dismiss install instructions"
        >×</button>
      </div>
    );
  }

  // Android/Chrome install pill
  if (!deferredPrompt) return null;

  return (
    <div className="install-app-badge" data-testid="install-app-badge" role="dialog" aria-label="Install app">
      <button
        type="button"
        className="install-app-btn"
        data-testid="install-app-btn"
        onClick={doInstall}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span>Install</span>
      </button>
      <button
        type="button"
        className="install-app-dismiss"
        data-testid="install-app-dismiss"
        onClick={dismiss}
        aria-label="Dismiss install prompt"
      >×</button>
    </div>
  );
}

