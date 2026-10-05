// Hardcoded representative GeoJSON polygons for North America geological formations.
// Coordinates approximate ([lng, lat] per GeoJSON spec).
// Colors are formation-specific, each era anchored to its eon family:
//   Cenozoic → yellows/ambers/tans
//   Mesozoic → greens/teals (+ russet for Chinle red-beds)
//   Paleozoic → blues/purples/indigos

const poly = (coords) => ({ type: "Polygon", coordinates: [coords] });

// -------------------- QUATERNARY (2.6 Ma – present) --------------------
export const QUATERNARY = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Laurentide Glacial Till Sheet", rock: "Glacial till & moraine", color: "#f0e0a8" },
      geometry: poly([[-100,49],[-92,49],[-83,45],[-75,44],[-70,46],[-68,48],[-72,50],[-88,52],[-98,52],[-100,49]]),
    },
    {
      type: "Feature",
      properties: { name: "Great Lakes Glacial Deposits", rock: "Lacustrine clay & till", color: "#d9c76a" },
      geometry: poly([[-92,47],[-83,46],[-79,44],[-82,41.5],[-88,41.5],[-91,43],[-92,47]]),
    },
    {
      type: "Feature",
      properties: { name: "Mississippi Alluvial Plain", rock: "Recent floodplain silt", color: "#e8c874" },
      geometry: poly([[-91.5,37],[-89,37],[-88,34],[-90,32],[-91,30],[-93,30],[-93,33],[-92,36],[-91.5,37]]),
    },
    {
      type: "Feature",
      properties: { name: "High Plains Loess", rock: "Windblown loess", color: "#e0b968" },
      geometry: poly([[-104,43],[-97,43],[-96,40],[-100,37],[-104,37],[-104,43]]),
    },
    {
      type: "Feature",
      properties: { name: "Atlantic Coastal Terrace", rock: "Recent marine sands", color: "#c9a95a" },
      geometry: poly([[-77,39],[-75,39],[-73,36],[-77,33],[-81,31],[-81.5,33],[-79,36],[-77,39]]),
    },
    {
      type: "Feature",
      properties: { name: "Gulf Coast Deltaic", rock: "Deltaic muds & sands", color: "#d4a94e" },
      geometry: poly([[-96,30],[-92,30],[-89,30],[-88,30.5],[-90,29],[-93,28.5],[-96,28.5],[-96,30]]),
    },
    {
      type: "Feature",
      properties: { name: "Puget–Willamette Fill", rock: "Glaciofluvial gravels", color: "#e4c17a" },
      geometry: poly([[-124,49],[-121,49],[-121,44],[-123,44],[-124,46],[-124,49]]),
    },
    {
      type: "Feature",
      properties: { name: "Central Valley Alluvium", rock: "Alluvial gravel & sand", color: "#f0d38a" },
      geometry: poly([[-122,40],[-119,40],[-119,35.5],[-121.5,35.5],[-122,37],[-122,40]]),
    },
    {
      type: "Feature",
      properties: { name: "Yukon–Alaska Loess & Permafrost", rock: "Loess over permafrost", color: "#d9b968" },
      geometry: poly([[-160,66],[-146,66],[-141,64],[-145,60],[-155,60],[-160,63],[-160,66]]),
    },
  ],
};

// -------------------- NEOGENE (23 – 2.6 Ma) --------------------
export const NEOGENE = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Basin & Range Volcanics", rock: "Rhyolite & basalt flows", color: "#c76d2c" },
      geometry: poly([[-120,42],[-113,42],[-113,35],[-117,34],[-120,37],[-120,42]]),
    },
    {
      type: "Feature",
      properties: { name: "Columbia River Basalts", rock: "Flood basalt", color: "#8a4a1e" },
      geometry: poly([[-121,47.5],[-116,47.5],[-115,45],[-118,44],[-121,45.5],[-121,47.5]]),
    },
    {
      type: "Feature",
      properties: { name: "Ogallala Formation", rock: "Fluvial sand & gravel", color: "#e8a952" },
      geometry: poly([[-104,43],[-96,43],[-95,32],[-101,32],[-104,36],[-104,43]]),
    },
    {
      type: "Feature",
      properties: { name: "Snake River Plain Basalts", rock: "Miocene–recent basalt", color: "#a95a24" },
      geometry: poly([[-117,44],[-112,44],[-111,42.5],[-115,42.5],[-117,43],[-117,44]]),
    },
    {
      type: "Feature",
      properties: { name: "Gulf Coast Miocene Wedge", rock: "Deltaic sand & shale", color: "#d99848" },
      geometry: poly([[-97,31],[-88,31],[-87,29.5],[-91,28.5],[-95,29],[-97,30],[-97,31]]),
    },
    {
      type: "Feature",
      properties: { name: "San Joaquin Basin", rock: "Marine sandstone & shale", color: "#c98c40" },
      geometry: poly([[-121,37],[-118.5,37],[-118.5,34.8],[-120.5,34.8],[-121,36],[-121,37]]),
    },
    {
      type: "Feature",
      properties: { name: "Yellowstone Rhyolites", rock: "Silicic ignimbrite", color: "#b04d20" },
      geometry: poly([[-111.5,45],[-109.5,45],[-109.5,43.5],[-111.5,43.5],[-111.5,45]]),
    },
    {
      type: "Feature",
      properties: { name: "Sierra Madre Occidental", rock: "Andesite & rhyolite", color: "#a55428" },
      geometry: poly([[-109,29],[-104,29],[-104,23],[-107,22],[-109,25],[-109,29]]),
    },
    {
      type: "Feature",
      properties: { name: "Atlantic Coastal Plain (Neogene)", rock: "Marine sands", color: "#d8a462" },
      geometry: poly([[-78,39],[-75,39],[-74,36],[-79,33],[-82,32],[-81,35],[-78,39]]),
    },
  ],
};

// -------------------- PALEOGENE (66 – 23 Ma) --------------------
export const PALEOGENE = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Laramide Uplifts (Front Range)", rock: "Uplifted Precambrian core", color: "#c48540" },
      geometry: poly([[-107,42],[-104,42],[-104,37],[-107,36],[-108,39],[-107,42]]),
    },
    {
      type: "Feature",
      properties: { name: "Green River Formation", rock: "Lacustrine oil shale", color: "#e5b96a" },
      geometry: poly([[-111,42],[-107.5,42],[-107.5,39.5],[-110.5,39.5],[-111,41],[-111,42]]),
    },
    {
      type: "Feature",
      properties: { name: "Wasatch & Uinta Basins", rock: "Fluvial red-beds", color: "#b87333" },
      geometry: poly([[-112,41],[-108,41],[-108,38.5],[-112,38.5],[-112,41]]),
    },
    {
      type: "Feature",
      properties: { name: "Bighorn & Powder River Basins", rock: "Fluvial sand & coal", color: "#d0925a" },
      geometry: poly([[-108,46],[-104,46],[-104,42.5],[-108,42.5],[-108,46]]),
    },
    {
      type: "Feature",
      properties: { name: "White River Badlands", rock: "Volcaniclastic mudstone", color: "#c98c50" },
      geometry: poly([[-104,44],[-101,44],[-101,42.5],[-104,42.5],[-104,44]]),
    },
    {
      type: "Feature",
      properties: { name: "Gulf Coastal Plain (Paleogene)", rock: "Marine sand & clay", color: "#e0a860" },
      geometry: poly([[-98,32],[-88,32],[-87,30],[-92,29],[-96,29],[-98,30],[-98,32]]),
    },
    {
      type: "Feature",
      properties: { name: "Mississippi Embayment", rock: "Shallow marine sands", color: "#d9a04a" },
      geometry: poly([[-91,37],[-88.5,37],[-88.5,33.5],[-91,33.5],[-91,37]]),
    },
    {
      type: "Feature",
      properties: { name: "Coast Range Forearc (OR/WA)", rock: "Marine turbidites", color: "#a5622a" },
      geometry: poly([[-124.5,48],[-122,48],[-122,42],[-124.5,42],[-124.5,48]]),
    },
    {
      type: "Feature",
      properties: { name: "Rio Grande Volcanic Field", rock: "Andesite & tuff", color: "#b06a2a" },
      geometry: poly([[-108,37],[-105,37],[-105,32],[-108,32],[-108,37]]),
    },
  ],
};

// -------------------- CRETACEOUS (145 – 66 Ma) --------------------
export const CRETACEOUS = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Western Interior Seaway", rock: "Marine shale & chalk", color: "#4a9b78" },
      geometry: poly([[-108,49],[-96,49],[-95,42],[-97,36],[-100,32],[-104,32],[-106,36],[-108,42],[-108,49]]),
    },
    {
      type: "Feature",
      properties: { name: "Niobrara Chalk (Kansas Sea)", rock: "Foraminiferal chalk", color: "#6cba8a" },
      geometry: poly([[-102,41],[-96,41],[-95,37],[-101,37],[-102,41]]),
    },
    {
      type: "Feature",
      properties: { name: "Hell Creek Formation", rock: "Fluvial sand & mudstone", color: "#3f8060" },
      geometry: poly([[-108,48],[-102,48],[-102,44.5],[-108,44.5],[-108,48]]),
    },
    {
      type: "Feature",
      properties: { name: "Sevier Fold-Thrust Belt", rock: "Thrusted marine sediments", color: "#2e6f52" },
      geometry: poly([[-114,45],[-110,45],[-110,36],[-114,36],[-114,45]]),
    },
    {
      type: "Feature",
      properties: { name: "Atlantic Coastal Plain (Cretaceous)", rock: "Greensand & marl", color: "#5cae8a" },
      geometry: poly([[-77,40],[-74,40],[-73,36],[-79,33],[-82,32],[-80,36],[-77,40]]),
    },
    {
      type: "Feature",
      properties: { name: "Gulf Coast Cretaceous Reef", rock: "Rudist limestone", color: "#4fb377" },
      geometry: poly([[-100,32],[-91,32],[-89,30],[-93,29],[-98,29.5],[-100,31],[-100,32]]),
    },
    {
      type: "Feature",
      properties: { name: "Dakota Sandstone Beach", rock: "Nearshore sandstone", color: "#7ac4a0" },
      geometry: poly([[-108,44],[-100,44],[-98,40],[-104,38],[-108,40],[-108,44]]),
    },
    {
      type: "Feature",
      properties: { name: "Sierra Nevada Batholith (final pulse)", rock: "Granodiorite", color: "#276648" },
      geometry: poly([[-121,40],[-118,40],[-117,36],[-119.5,35.5],[-121,37.5],[-121,40]]),
    },
    {
      type: "Feature",
      properties: { name: "Mexican Platform Carbonates", rock: "Shelf limestone", color: "#5eaf82" },
      geometry: poly([[-102,26],[-97,26],[-96,20],[-101,20],[-102,23],[-102,26]]),
    },
  ],
};

// -------------------- JURASSIC (201 – 145 Ma) --------------------
export const JURASSIC = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Morrison Formation", rock: "Fluvial mudstone & sandstone", color: "#3a8b6d" },
      geometry: poly([[-112,44],[-104,44],[-103,37],[-108,35],[-112,37],[-112,44]]),
    },
    {
      type: "Feature",
      properties: { name: "Sundance Sea", rock: "Marine shale & sandstone", color: "#5aa88a" },
      geometry: poly([[-112,49],[-104,49],[-104,44],[-112,44],[-112,49]]),
    },
    {
      type: "Feature",
      properties: { name: "Navajo Sandstone Erg", rock: "Eolian cross-bedded sandstone", color: "#7dc0a2" },
      geometry: poly([[-114,40],[-108,40],[-108,35],[-114,35],[-114,40]]),
    },
    {
      type: "Feature",
      properties: { name: "Nevadan Volcanic Arc", rock: "Andesite & tuff", color: "#22664c" },
      geometry: poly([[-122,42],[-118,42],[-117,36],[-120,35.5],[-122,38],[-122,42]]),
    },
    {
      type: "Feature",
      properties: { name: "Entrada Sandstone Coastal Dunes", rock: "Windblown sandstone", color: "#8ecdad" },
      geometry: poly([[-111,41],[-107,41],[-107,37],[-111,37],[-111,41]]),
    },
    {
      type: "Feature",
      properties: { name: "Twin Creek Marine Shelf", rock: "Marine limestone", color: "#4f9c7d" },
      geometry: poly([[-114,44],[-110,44],[-110,41],[-114,41],[-114,44]]),
    },
    {
      type: "Feature",
      properties: { name: "Louann Salt Basin", rock: "Evaporite (rock salt)", color: "#a5d4bd" },
      geometry: poly([[-96,32],[-88,32],[-87,29.5],[-92,28],[-96,28.5],[-96,32]]),
    },
    {
      type: "Feature",
      properties: { name: "Newark Rift Basalts (waning)", rock: "Diabase & basalt", color: "#1f5c44" },
      geometry: poly([[-77,42],[-74,42],[-74,39],[-76,38],[-77,40],[-77,42]]),
    },
    {
      type: "Feature",
      properties: { name: "Franciscan Subduction Complex", rock: "Melange & blueschist", color: "#357a5c" },
      geometry: poly([[-124,42],[-121,42],[-120,35],[-122,34],[-124,37],[-124,42]]),
    },
  ],
};

// -------------------- TRIASSIC (252 – 201 Ma) --------------------
export const TRIASSIC = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Chinle Formation", rock: "Fluvial red mudstone", color: "#b8442a" },
      geometry: poly([[-113,38],[-107,38],[-106,33],[-112,32],[-113,35],[-113,38]]),
    },
    {
      type: "Feature",
      properties: { name: "Moenkopi Formation", rock: "Tidal-flat siltstone", color: "#c65e40" },
      geometry: poly([[-114,39],[-108,39],[-108,35],[-114,35],[-114,39]]),
    },
    {
      type: "Feature",
      properties: { name: "Newark Supergroup Rift", rock: "Rift-basin red beds", color: "#8b5e3c" },
      geometry: poly([[-77,42],[-73.5,42],[-73.5,39.5],[-76,38],[-77,40],[-77,42]]),
    },
    {
      type: "Feature",
      properties: { name: "Hartford Rift Basin", rock: "Arkose & basalt", color: "#a3492c" },
      geometry: poly([[-73,42.5],[-72,42.5],[-72,41],[-73,41],[-73,42.5]]),
    },
    {
      type: "Feature",
      properties: { name: "Culpeper–Deep River Basins", rock: "Continental red beds", color: "#9a5236" },
      geometry: poly([[-80,38],[-77,38],[-77,34.5],[-79.5,34.5],[-80,36],[-80,38]]),
    },
    {
      type: "Feature",
      properties: { name: "Sonoma Orogeny Belt", rock: "Accreted terranes", color: "#6b3826" },
      geometry: poly([[-120,42],[-115,42],[-115,37],[-120,37],[-120,42]]),
    },
    {
      type: "Feature",
      properties: { name: "Dockum Group (Texas)", rock: "Fluvial-lacustrine reds", color: "#c2603a" },
      geometry: poly([[-104,36],[-99,36],[-99,32],[-104,32],[-104,36]]),
    },
    {
      type: "Feature",
      properties: { name: "CAMP Basalt Province", rock: "Continental flood basalt", color: "#5c2f1f" },
      geometry: poly([[-79,40],[-74,40],[-72,36],[-78,33],[-81,36],[-79,40]]),
    },
    {
      type: "Feature",
      properties: { name: "Sabkha Evaporites (Gulf)", rock: "Evaporite & carbonate", color: "#d68a5a" },
      geometry: poly([[-99,29],[-92,29],[-90,26],[-96,25],[-99,27],[-99,29]]),
    },
  ],
};

// -------------------- PERMIAN (299 – 252 Ma) --------------------
export const PERMIAN = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Permian Basin", rock: "Shelf carbonate & evaporite", color: "#7a5cc2" },
      geometry: poly([[-105,34],[-100,34],[-99,30.5],[-104,30],[-105,32],[-105,34]]),
    },
    {
      type: "Feature",
      properties: { name: "Capitan Reef Complex", rock: "Fossil reef limestone", color: "#9a7cd8" },
      geometry: poly([[-105,32.5],[-103,32.5],[-103,31],[-105,31],[-105,32.5]]),
    },
    {
      type: "Feature",
      properties: { name: "Phosphoria Sea", rock: "Phosphorite & chert", color: "#6547aa" },
      geometry: poly([[-115,45],[-108,45],[-108,41],[-115,41],[-115,45]]),
    },
    {
      type: "Feature",
      properties: { name: "Ancestral Rockies Arkose", rock: "Coarse arkosic redbed", color: "#8967c9" },
      geometry: poly([[-108,42],[-104,42],[-104,36],[-108,36],[-108,42]]),
    },
    {
      type: "Feature",
      properties: { name: "Appalachian Foreland (final)", rock: "Coal & fluvial redbeds", color: "#5c3f9c" },
      geometry: poly([[-84,42],[-77,42],[-76,36],[-83,35],[-85,38],[-84,42]]),
    },
    {
      type: "Feature",
      properties: { name: "Grand Canyon (Kaibab Ls.)", rock: "Cherty marine limestone", color: "#a992e0" },
      geometry: poly([[-114,37],[-110,37],[-110,34],[-114,34],[-114,37]]),
    },
    {
      type: "Feature",
      properties: { name: "Midcontinent Sabkha", rock: "Evaporite & red shale", color: "#886dc5" },
      geometry: poly([[-102,38],[-95,38],[-95,33],[-101,33],[-102,36],[-102,38]]),
    },
    {
      type: "Feature",
      properties: { name: "Cordilleran Shelf", rock: "Chert & limestone", color: "#6a4fb2" },
      geometry: poly([[-120,45],[-115,45],[-115,38],[-120,38],[-120,45]]),
    },
    {
      type: "Feature",
      properties: { name: "Ochoan Salt Basin", rock: "Halite & anhydrite", color: "#b8a4e8" },
      geometry: poly([[-104,33],[-100,33],[-100,31],[-104,31],[-104,33]]),
    },
  ],
};

// -------------------- CARBONIFEROUS (359 – 299 Ma) --------------------
export const CARBONIFEROUS = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Appalachian Coal Swamps", rock: "Coal, sand & shale cyclothems", color: "#3a5aa8" },
      geometry: poly([[-84,42],[-77,42],[-76,36],[-83,35],[-85,38],[-84,42]]),
    },
    {
      type: "Feature",
      properties: { name: "Illinois Basin Coal", rock: "Coal & shale", color: "#5a7fc9" },
      geometry: poly([[-91,41],[-86,41],[-86,37],[-91,37],[-91,41]]),
    },
    {
      type: "Feature",
      properties: { name: "Mississippian Limestone Shelf", rock: "Fossiliferous limestone", color: "#7a9bd8" },
      geometry: poly([[-102,45],[-84,45],[-83,36],[-100,32],[-104,36],[-102,45]]),
    },
    {
      type: "Feature",
      properties: { name: "Ancestral Rockies (Uncompahgre)", rock: "Arkosic conglomerate", color: "#2c4794" },
      geometry: poly([[-110,41],[-105,41],[-105,36],[-110,36],[-110,41]]),
    },
    {
      type: "Feature",
      properties: { name: "Ouachita Orogen", rock: "Turbidite & thrust sheets", color: "#25408a" },
      geometry: poly([[-96,36],[-91,36],[-91,33.5],[-96,33.5],[-96,36]]),
    },
    {
      type: "Feature",
      properties: { name: "Michigan Basin", rock: "Limestone & evaporite", color: "#6a90d0" },
      geometry: poly([[-87,46],[-82,46],[-82,42],[-87,42],[-87,46]]),
    },
    {
      type: "Feature",
      properties: { name: "Antler Foreland Basin", rock: "Flysch & carbonate", color: "#4a6fb8" },
      geometry: poly([[-119,42],[-113,42],[-113,37],[-119,37],[-119,42]]),
    },
    {
      type: "Feature",
      properties: { name: "Marathon Uplift (TX)", rock: "Thrusted sediments", color: "#1e3778" },
      geometry: poly([[-104,31.5],[-101,31.5],[-101,29.5],[-104,29.5],[-104,31.5]]),
    },
    {
      type: "Feature",
      properties: { name: "Anadarko Basin", rock: "Shale, sandstone, coal", color: "#8aa8dc" },
      geometry: poly([[-102,37],[-97,37],[-97,34],[-102,34],[-102,37]]),
    },
  ],
};

export const FORMATIONS = {
  quaternary: QUATERNARY,
  neogene: NEOGENE,
  paleogene: PALEOGENE,
  cretaceous: CRETACEOUS,
  jurassic: JURASSIC,
  triassic: TRIASSIC,
  permian: PERMIAN,
  carboniferous: CARBONIFEROUS,
};
