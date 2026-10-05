// Geological era metadata — scientifically accurate rock/fossil/flora/fauna/mineral data
// Order: PRESENT → PAST (index 0 = youngest, index 7 = oldest)
//
// rockTypes are categorized into sedimentary / igneous / metamorphic
// so the legend panel can render them as distinct groups.

export const ERAS = [
  {
    id: "quaternary",
    name: "Quaternary",
    period: "2.58 Ma – Present",
    ageMa: 2.58,
    eon: "Cenozoic",
    tagline: "Ice ages, mammoths, humans",
    rockTypes: {
      sedimentary: ["Glacial till", "Alluvial gravel", "Loess", "Peat", "Alluvial sand"],
      igneous: ["Recent basalt flows (Cascades, Hawaii)"],
      metamorphic: [],
    },
    fossils: [
      "Mammoth tusks",
      "Saber-tooth skulls",
      "Giant ground sloth bones",
      "Dire wolf & short-faced bear remains",
      "Early human stone tools",
    ],
    flora: [
      "Prairie & C4 grasses",
      "Boreal spruce–fir forests",
      "Tundra sedges, mosses, dwarf willow",
      "Temperate hardwoods (oak, maple)",
    ],
    fauna: [
      { icon: "🦣", text: "Woolly mammoths & mastodons" },
      { icon: "🐺", text: "Dire wolves & saber-tooth cats" },
      { icon: "🦥", text: "Giant ground sloths (Megatherium)" },
      { icon: "🧍", text: "Homo sapiens dispersal" },
      { icon: "🦌", text: "Modern megafauna (bison, elk, caribou)" },
    ],
    minerals: [
      "Placer gold (glacial & alluvial)",
      "Diamond pipes (kimberlite)",
      "Iron-rich glacial soils",
      "Peat & recent coal",
    ],
  },
  {
    id: "neogene",
    name: "Neogene",
    period: "23 – 2.58 Ma",
    ageMa: 23,
    eon: "Cenozoic",
    tagline: "Grasslands spread, hominins appear",
    rockTypes: {
      sedimentary: ["Sandstone", "Siltstone", "Conglomerate", "Lignite", "Diatomite"],
      igneous: ["Basin & Range rhyolite", "Columbia River flood basalt", "Andesite"],
      metamorphic: [],
    },
    fossils: [
      "Megalodon teeth",
      "Merychippus (early horse)",
      "Mastodon jaws",
      "Australopithecine remains (Africa)",
      "Late-Miocene camelids",
    ],
    flora: [
      "C4 grasslands spread globally",
      "Modern tree families established",
      "Oak–hickory forests",
      "Sagebrush steppe emerges",
    ],
    fauna: [
      { icon: "🐎", text: "Horses, camels & rhinos radiate" },
      { icon: "🦣", text: "Early elephants & mastodons" },
      { icon: "🦈", text: "Megalodon patrols warm shelf seas" },
      { icon: "🐋", text: "Baleen whales diversify" },
      { icon: "🦍", text: "Great apes & first hominins (Africa)" },
    ],
    minerals: [
      "Diatomite (California)",
      "Phosphate rock",
      "Maturing petroleum reservoirs",
      "Rock salt & borate deposits",
    ],
  },
  {
    id: "paleogene",
    name: "Paleogene",
    period: "66 – 23 Ma",
    ageMa: 66,
    eon: "Cenozoic",
    tagline: "Mammals inherit the Earth",
    rockTypes: {
      sedimentary: ["Limestone", "Chalk", "Shale", "Lignite", "Clay", "Oil shale"],
      igneous: ["Laramide granite intrusions", "Absaroka volcanics", "Rio Grande andesite"],
      metamorphic: [],
    },
    fossils: [
      "Eohippus (dawn horse)",
      "Basilosaurus (early whale)",
      "Gastornis (giant flightless bird)",
      "Early primates (Notharctus)",
      "Uintatherium & brontotheres",
    ],
    flora: [
      "Tropical & subtropical forests reach Wyoming",
      "Palms, figs, laurels",
      "Cycads still common",
      "First grasses appear",
    ],
    fauna: [
      { icon: "🐋", text: "First whales (Basilosaurus, Pakicetus)" },
      { icon: "🦇", text: "Bats & primates appear" },
      { icon: "🐘", text: "Archaic proboscideans" },
      { icon: "🐴", text: "Eohippus — dog-sized ancestor of horses" },
      { icon: "🦉", text: "Modern bird orders diversify" },
    ],
    minerals: [
      "Lignite coal (Powder River, Wilcox)",
      "Bauxite (aluminum ore)",
      "Phosphate",
      "Manganese",
      "Green River oil shale",
    ],
  },
  {
    id: "cretaceous",
    name: "Cretaceous",
    period: "145 – 66 Ma",
    ageMa: 145,
    eon: "Mesozoic",
    tagline: "Age of dinosaurs peaks — then ends",
    rockTypes: {
      sedimentary: ["Chalk", "Limestone", "Shale", "Sandstone", "Bentonite clay"],
      igneous: ["Sierra Nevada batholith (final pulse)", "Coastal arc volcanics"],
      metamorphic: ["Franciscan blueschist"],
    },
    fossils: [
      "Tyrannosaurus rex",
      "Triceratops",
      "Mosasaurus skeletons (up to 50 ft, apex WIS predator)",
      "Pteranodon wings",
      "Ammonites, bivalves, shark teeth",
      "Opalized crustaceans (lobsters, crabs) — TX & KS",
      "Marine turtle shells",
    ],
    flora: [
      "First flowering plants (angiosperms)",
      "Magnolias, figs, willows",
      "Ferns and conifers still abundant",
      "Cycads decline",
    ],
    fauna: [
      { icon: "🦖", text: "T. rex, Triceratops, hadrosaurs" },
      { icon: "🦕", text: "Largest dinosaurs ever (titanosaurs)" },
      { icon: "🐢", text: "Mosasaurs & marine turtles rule the seas" },
      { icon: "🐝", text: "First social insects (bees, ants)" },
      { icon: "☄️", text: "Chicxulub impact ends the Mesozoic" },
    ],
    minerals: [
      "Chalk (calcium carbonate)",
      "Phosphate rock",
      "Bauxite",
      "Oil shale forming",
      "Bentonite (volcanic ash clay)",
      "Opal (silica-replaced fossils, TX & KS)",
    ],
    spotlight: {
      title: "Western Interior Seaway",
      subtitle: "A shallow tropical sea splits North America",
      body: "From the Gulf of Mexico through Texas, Kansas, Nebraska, the Dakotas and into Canada, a warm epicontinental sea drowned the mid-continent for ~35 million years.",
      highlights: [
        "Apex predator: Mosasaurus, up to 50 ft long",
        "Plesiosaurs, giant crustaceans, ammonites, bivalves",
        "Opalized fossils — silica-rich groundwater replaced original material (TX, KS)",
        "Key formations: Niobrara Chalk (KS/NE), Austin Chalk (TX), Pierre Shale (Dakotas)",
      ],
    },
  },
  {
    id: "jurassic",
    name: "Jurassic",
    period: "201 – 145 Ma",
    ageMa: 201,
    eon: "Mesozoic",
    tagline: "Sauropod giants and shallow seas",
    rockTypes: {
      sedimentary: ["Limestone", "Sandstone", "Mudstone", "Oolitic iron ore", "Eolian sandstone"],
      igneous: ["Nevadan arc andesite", "Sierra Nevada granodiorite"],
      metamorphic: ["Franciscan mélange (accreted)"],
    },
    fossils: [
      "Stegosaurus plates",
      "Brachiosaurus & Apatosaurus vertebrae",
      "Allosaurus skulls",
      "Archaeopteryx (feathered)",
      "Ammonites & belemnites",
    ],
    flora: [
      "Cycads dominant",
      "Araucaria conifers form tall forests",
      "Ginkgo widespread",
      "Ferns & tree ferns",
      "NO flowering plants yet",
    ],
    fauna: [
      { icon: "🦕", text: "Giant sauropods (Diplodocus, Brachiosaurus)" },
      { icon: "🦖", text: "Allosaurus & Stegosaurus" },
      { icon: "🪶", text: "Archaeopteryx — first birds" },
      { icon: "🐊", text: "Plesiosaurs & ichthyosaurs in the seas" },
      { icon: "🐚", text: "Ammonites & belemnites abundant" },
    ],
    minerals: [
      "Oolitic iron ore",
      "Phosphate",
      "Portland limestone (building stone)",
      "Uranium (Morrison Formation)",
      "Louann salt",
    ],
  },
  {
    id: "triassic",
    name: "Triassic",
    period: "252 – 201 Ma",
    ageMa: 252,
    eon: "Mesozoic",
    tagline: "Pangaea rifts, first dinosaurs walk",
    rockTypes: {
      sedimentary: ["Red sandstone", "Limestone", "Evaporites (salt, gypsum)", "Mudstone"],
      igneous: ["CAMP flood basalts", "Newark diabase sills", "Sonoma arc volcanics"],
      metamorphic: [],
    },
    fossils: [
      "First dinosaur tracks (Coelophysis)",
      "Early turtle shells (Proganochelys)",
      "Ichthyosaur bones",
      "Conodont microfossils",
      "Petrified wood (Araucarioxylon)",
    ],
    flora: [
      "Conifers (Araucaria) recover post-extinction",
      "Cycads emerge & spread",
      "Seed ferns rebuilding",
      "Horsetails & ferns in wet lowlands",
    ],
    fauna: [
      { icon: "🦎", text: "First true dinosaurs — small, bipedal" },
      { icon: "🦅", text: "Pterosaurs take to the air" },
      { icon: "🐊", text: "Phytosaurs, aetosaurs, crocodylomorphs" },
      { icon: "🐁", text: "First mammals — tiny, nocturnal" },
      { icon: "🐢", text: "Earliest true turtles" },
    ],
    minerals: [
      "Rock salt & gypsum",
      "Copper (red-bed hosted)",
      "Uranium (Chinle Fm)",
      "Petrified wood",
    ],
  },
  {
    id: "permian",
    name: "Permian",
    period: "299 – 252 Ma",
    ageMa: 299,
    eon: "Paleozoic",
    tagline: "Pangaea assembled, greatest extinction",
    rockTypes: {
      sedimentary: ["Red beds (sandstone/mudstone)", "Limestone", "Evaporites (salt, gypsum)", "Chert"],
      igneous: ["Cordilleran arc volcanics (rare)"],
      metamorphic: ["Appalachian schist & gneiss (final Alleghanian pulse)"],
    },
    fossils: [
      "Dimetrodon skeletons",
      "Edaphosaurus sail-backs",
      "Marine brachiopods (Productid)",
      "Ammonoids",
      "Eryops amphibians",
    ],
    flora: [
      "Conifers dominate uplands",
      "Seed ferns (Glossopteris) across Pangaea",
      "Cycads emerging",
      "Lycopsid forests declining",
    ],
    fauna: [
      { icon: "🦎", text: "Dimetrodon & sail-backed synapsids" },
      { icon: "🐊", text: "Early archosaurs appear" },
      { icon: "🐸", text: "Large amphibians (Eryops)" },
      { icon: "🐚", text: "Fusulinid forams & brachiopods in warm seas" },
      { icon: "💀", text: "End-Permian: ~95% of marine species die" },
    ],
    minerals: [
      "Rock salt & gypsum (Ochoan basin)",
      "Phosphate (Phosphoria Fm)",
      "Copper (red-bed hosted)",
      "Halite & potash",
    ],
  },
  {
    id: "carboniferous",
    name: "Carboniferous",
    period: "359 – 299 Ma",
    ageMa: 359,
    eon: "Paleozoic",
    tagline: "Coal swamps and giant insects",
    rockTypes: {
      sedimentary: ["Coal measures", "Limestone (Mississippian)", "Sandstone", "Shale"],
      igneous: ["Basaltic intrusions (rare)", "Continental arc plutons"],
      metamorphic: ["Appalachian schist & gneiss (Alleghanian)", "Slate belt"],
    },
    fossils: [
      "Crinoid columnals (limestone)",
      "Brachiopod shells",
      "Shark teeth (Xenacanthus)",
      "Early amphibian trackways",
      "Fossilized Lepidodendron bark",
    ],
    flora: [
      "Giant lycopsid forests (Lepidodendron, Sigillaria)",
      "Tree ferns (Psaronius)",
      "Seed ferns (Medullosa)",
      "Horsetails (Calamites) up to 20 m tall",
      "These forests formed today's coal deposits",
    ],
    fauna: [
      { icon: "🦗", text: "Meganeura — dragonflies with 70 cm wings" },
      { icon: "🕷️", text: "Giant arthropods (Arthropleura, 2 m)" },
      { icon: "🦎", text: "First amniotes (reptile-like tetrapods)" },
      { icon: "🐟", text: "Xenacanth sharks in freshwater swamps" },
      { icon: "🐸", text: "Large temnospondyl amphibians (Eryops)" },
    ],
    minerals: [
      "Bituminous & anthracite coal",
      "Mississippian limestone (building stone)",
      "Iron ore (sedimentary)",
      "Fireclay",
    ],
  },
];

// Era accent color (used in the top-of-legend header, ticks, and pin marker halo)
export const ERA_ACCENT = {
  quaternary: "#e8c874",     // pale gold — Cenozoic
  neogene: "#d99848",        // amber — Cenozoic
  paleogene: "#b87333",      // burnt tan — Cenozoic
  cretaceous: "#4fb377",     // spring green — Mesozoic
  jurassic: "#3a8b6d",       // teal green — Mesozoic
  triassic: "#b8442a",       // russet — Mesozoic (red-bed color)
  permian: "#7a5cc2",        // amethyst purple — Paleozoic
  carboniferous: "#4a6fb8",  // deep indigo blue — Paleozoic
};

export const ERA_BY_ID = Object.fromEntries(ERAS.map(e => [e.id, e]));
