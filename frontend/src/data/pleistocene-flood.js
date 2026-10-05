// Pleistocene Flood overlay data — Glacial Lake Missoula, Cordilleran
// Ice Sheet southern edge, flood trajectory, and four archaeological sites.
// All coordinates in [lng, lat] per GeoJSON spec.

export const LAKE_MISSOULA = {
  type: "Feature",
  properties: {
    name: "Glacial Lake Missoula",
    note: "Ice-dammed pluvial lake, ~13,000–15,000 BP. Repeatedly breached, unleashing the Missoula Floods.",
  },
  geometry: {
    type: "Polygon",
    coordinates: [[
      [-116.5, 47.4],
      [-115.9, 47.8],
      [-115.2, 48.1],
      [-114.6, 48.3],
      [-114.1, 48.4],
      [-113.6, 48.2],
      [-113.2, 47.9],
      [-113.0, 47.5],
      [-113.3, 47.1],
      [-113.9, 46.7],
      [-114.5, 46.4],
      [-115.1, 46.2],
      [-115.7, 46.0],
      [-116.2, 46.3],
      [-116.5, 46.8],
      [-116.5, 47.4],
    ]],
  },
};

export const CORDILLERAN_ICE_EDGE = {
  type: "Feature",
  properties: {
    name: "Cordilleran Ice Sheet — Southern Edge",
    note: "Approximate maximum southern extent of the Cordilleran Ice Sheet at the Last Glacial Maximum (~20,000 BP).",
  },
  geometry: {
    type: "LineString",
    coordinates: [
      [-120.0, 47.6],
      [-119.2, 48.1],
      [-118.3, 48.5],
      [-117.2, 48.8],
      [-116.0, 48.9],
      [-114.8, 48.8],
      [-113.8, 48.6],
      [-113.0, 48.3],
    ],
  },
};

export const FLOOD_TRAJECTORY = {
  type: "Feature",
  properties: {
    name: "Missoula Flood Trajectory",
    note: "Cataclysmic flood path from the Clark Fork outlet, across the Channeled Scablands, through Wallula Gap and the Columbia Gorge, backflooding the Willamette Valley.",
  },
  geometry: {
    type: "LineString",
    coordinates: [
      [-116.0, 48.0],   // Clark Fork outlet
      [-116.6, 47.9],
      [-117.2, 47.75],
      [-117.5, 47.5],   // Channeled Scablands
      [-118.0, 47.0],
      [-118.4, 46.55],
      [-118.9, 46.10],  // Wallula Gap
      [-119.8, 45.80],
      [-120.7, 45.70],
      [-121.5, 45.70],  // Columbia Gorge
      [-122.2, 45.60],
      [-122.7, 45.50],  // Portland
      [-123.0, 44.90],
      [-123.0, 44.00],  // Willamette Valley backflood
    ],
  },
};

export const ARCHAEOLOGICAL_SITES = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Chiquihuite Cave",
        age: "~27,000 BP",
        note: "Pre-Clovis. Earliest known evidence of human presence in the Americas.",
      },
      geometry: { type: "Point", coordinates: [-102.37, 22.86] },
    },
    {
      type: "Feature",
      properties: {
        name: "White Sands",
        age: "~23,000 BP",
        note: "Human footprints preserved at the Last Glacial Maximum.",
      },
      geometry: { type: "Point", coordinates: [-106.17, 32.78] },
    },
    {
      type: "Feature",
      properties: {
        name: "Paisley Caves",
        age: "~14,300 BP",
        note: "Pre-Clovis Oregon. Coprolite DNA evidence of early Pacific coastal migrants.",
      },
      geometry: { type: "Point", coordinates: [-120.7, 42.9] },
    },
    {
      type: "Feature",
      properties: {
        name: "Marmes Rockshelter",
        age: "~10,000 BP",
        note: "Post-flood. Among the oldest human skeletal remains in the Americas. Located in the Channeled Scablands.",
      },
      geometry: { type: "Point", coordinates: [-118.6, 46.5] },
    },
  ],
};

// Geological event markers — visually distinct from archaeological sites.
// Rendered with a light-blue / white pin to signal a physical Earth event
// rather than a human occupation.
export const GEOLOGICAL_EVENT_SITES = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Glacial Ice Dam Break",
        age: "~15,000–12,000 BP",
        note: "The Cordilleran ice dam holding Glacial Lake Missoula repeatedly breached here, releasing catastrophic floods across the Pacific Northwest. Each breach sent walls of water west through Idaho and across the Channeled Scablands of Washington.",
      },
      geometry: { type: "Point", coordinates: [-115.9, 47.9] },
    },
  ],
};

// Direction arrows placed along the trajectory (as separate marker points
// with a bearing so we can render a rotated ▶ glyph in the DOM).
export const FLOOD_ARROWS = [
  { at: [-117.35, 47.62], bearing: 220 },  // SW from Clark Fork
  { at: [-118.15, 46.80], bearing: 205 },  // toward Wallula Gap
  { at: [-119.90, 45.75], bearing: 260 },  // west into Columbia Gorge
  { at: [-121.90, 45.55], bearing: 250 },  // through the Gorge
  { at: [-122.85, 44.90], bearing: 195 },  // south into Willamette
];
