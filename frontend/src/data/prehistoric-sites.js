// Prehistoric sites — curated public/interpretive gateway pins.
// Coordinates are approximate; where a site is private/underwater/sensitive
// the pin represents a general area or a public interpretive gateway, never
// an invitation to enter or excavate. Categories:
//   documented   → solid archaeological evidence
//   disputed     → debated or unverified in the source research
//   story-marker → the 1909 Kincaid Arizona Gazette newspaper claim
//
// Excluded here (already rendered on the Pleistocene Flood layer):
//   White Sands NM, Paisley Caves OR, Marmes Rockshelter WA, Chiquihuite Cave.

const F = (lng, lat, name, age, note, category, access) => ({
  type: "Feature",
  geometry: { type: "Point", coordinates: [lng, lat] },
  properties: { name, age, note, category, access },
});

export const PREHISTORIC_SITES = {
  type: "FeatureCollection",
  features: [
    // -------- Michigan & Great Lakes --------
    F(-88.43, 47.20, "Keweenaw Peninsula copper country, MI", "~8,000 years ago",
      "Indigenous miners worked native copper long before industrial mining. How far did the finished metal travel?",
      "documented", "public"),
    F(-88.73, 48.08, "Minong copper mines, Isle Royale, MI", "~4,500–6,500 years ago",
      "Ancient pits share a landscape with 19th-century workings. What can careful comparison of the two tell us about mining methods?",
      "documented", "public"),
    F(-87.82, 45.47, "Anaem Omot / Sixty Islands garden beds, MI–WI", "~AD 1000–1600",
      "Lidar reveals extensive raised Indigenous agricultural beds in the Upper Peninsula borderlands. What else might a forest canopy hide?",
      "documented", "sensitive"),
    F(-83.0179, 43.6564, "Sanilac Petroglyphs / Ezhibiigaadek Asin, MI", "~300–1,500 years old",
      "The state's largest known petroglyph collection carries Anishinaabe teachings. What can living tradition tell a visitor that a carved line alone cannot?",
      "documented", "public"),
    F(-83.10, 44.90, "Alpena–Amberley Ridge submerged hunting structures, Lake Huron, MI", "~9,000 years ago",
      "A submerged stone drive lane shows today's lake was once traversable ground. Which other shorelines did rising water erase?",
      "documented", "underwater"),

    // -------- Ohio Valley / Midwest / Lower Mississippi --------
    F(-83.4311, 39.0264, "Great Serpent Mound, OH", "~300 BCE or ~AD 1070 (debated)",
      "A giant serpent-shaped earthwork follows a ridge. Which phase of its long history do the dates actually measure?",
      "documented", "public"),
    F(-82.4278, 40.0403, "Newark Great Circle Earthworks, OH", "~100 BCE–AD 400",
      "A surviving part of a much larger Hopewell geometric complex asks what ceremony and geometry meant together.",
      "documented", "public"),
    F(-82.4464, 40.0520, "Newark Octagon Earthworks, OH", "~100 BCE–AD 400",
      "The octagon's geometry is often studied in relation to lunar cycles. How do we distinguish deliberate alignment from modern pattern-finding?",
      "documented", "public"),
    F(-83.0073, 39.3741, "Mound City Group / Hopewell NHP, OH", "~100 BCE–AD 400",
      "A concentrated group of ceremonial mounds preserves traces of wide-ranging exchange. What did communities bring here besides objects?",
      "documented", "public"),
    F(-84.0893, 39.4068, "Fort Ancient Earthworks, OH", "~100 BCE–AD 400 (Hopewell)",
      "Enclosing vast hilltop acreage, the walls invite the question: gathering place, boundary, or both?",
      "documented", "public"),
    F(-90.0620, 38.6607, "Cahokia Mounds / Monks Mound, IL", "~AD 1050–1350",
      "The largest precontact urban center north of Mexico grew beside the Mississippi. What network sustained a place on this scale?",
      "documented", "public"),
    F(-91.4114, 32.6367, "Poverty Point, LA", "~1700–1100 BCE",
      "Archaic-period people raised enormous concentric ridges and mounds before widespread local farming. How did they organize labor at that scale?",
      "documented", "public"),
    F(-92.13, 32.37, "Watson Brake, LA", "~5,400–5,000 years ago",
      "Among the oldest known North American mound complexes; challenges the tidy story that monuments required farming first.",
      "documented", "private"),
    F(-91.1969, 43.0810, "Effigy Mounds National Monument, IA", "~AD 650–1200",
      "Bears and birds appear as earthworks above the Mississippi. What is lost when a map shows only their outlines?",
      "documented", "public"),
    F(-87.4496, 37.9477, "Angel Mounds, IN", "~AD 1000–1450 (Mississippian)",
      "A planned town and mounds stood on the Ohio River. How do its excavated neighborhoods change the view from the ceremonial center?",
      "documented", "public"),
    F(-88.6825, 35.4978, "Pinson Mounds, TN", "~AD 1–500",
      "Large Middle Woodland mounds stood in a landscape used for gatherings. Why build such height where the surrounding land is already broad and open?",
      "documented", "public"),
    F(-87.636, 33.005, "Moundville Archaeological Park, AL", "~AD 1000–1450",
      "A ring of platform mounds surrounds a plaza on the Black Warrior River. What did movement through that space communicate?",
      "documented", "public"),
    F(-83.6022, 32.8382, "Ocmulgee Mounds, GA", "human presence >12,000 years; principal mounds ~AD 900–1100",
      "One landscape preserves many distinct chapters of Indigenous life. Which chapter does a single mound pin conceal?",
      "documented", "public"),

    // -------- Clovis and earlier --------
    F(-103.325, 34.278, "Blackwater Draw / Clovis type site, NM", "~13,000 years ago",
      "Stone points beside extinct animals helped define the Clovis tradition. What changed when even older sites were found?",
      "documented", "public"),
    F(-104.07, 36.88, "Folsom site / Wild Horse Arroyo, NM", "~12,000 years ago (post-Clovis)",
      "A distinctive point embedded among extinct bison bones changed the argument over humans and Ice Age animals.",
      "documented", "private"),
    F(-110.1808, 31.5711, "Murray Springs Clovis site, AZ", "~13,000 years ago",
      "Clovis artifacts and mammoth remains sit beside evidence of changing Ice Age environments. What can one waterhole say about a whole landscape?",
      "documented", "public"),
    F(-80.4906, 40.2862, "Meadowcroft Rockshelter, PA", "~19,000 calendar years ago",
      "Deep deposits place human activity before Clovis; how does calibration change the apparent timeline?",
      "documented", "public"),
    F(-97.54, 30.95, "Debra L. Friedkin / Buttermilk Creek, TX", "~15,500 years ago",
      "Tools beneath a Clovis horizon ask whether familiar technology emerged from a deeper local sequence.",
      "documented", "private"),
    F(-97.67, 30.90, "Gault archaeological site, TX", "~16,000 years ago",
      "A large artifact assemblage below Clovis levels opens a different window on the earlier people of central Texas.",
      "documented", "guided"),
    F(-83.96, 30.17, "Page–Ladson, FL", "~14,550 years ago",
      "Worked stone and mastodon evidence in a drowned river sinkhole. How much of the earliest record now lies underwater?",
      "documented", "underwater"),
    F(-81.31, 33.01, "Topper site, SC", "Clovis plus contested claims ~20,000+ years",
      "Excavations raise a consequential question, but which fractured stones are human-made and which are not? Earlier occupation is disputed, not established.",
      "disputed", "private"),
    F(-77.32, 36.99, "Cactus Hill, VA", "proposed ~18,000–20,000 years ago (debated)",
      "A possible older layer beneath Clovis material makes stratigraphy the story. How secure is the boundary between the two?",
      "disputed", "private"),
    F(-116.40, 45.91, "Cooper's Ferry / Nipéhe, ID", "~16,000–15,000 years ago",
      "Stemmed points in a carefully dated river terrace invite comparison with coastal and interior migration routes.",
      "documented", "sensitive"),
    F(-123.12, 48.05, "Manis mastodon site, WA", "~13,900 years ago",
      "A bone projectile fragment lodged in a mastodon supports human activity before Clovis. What makes an impact mark persuasive?",
      "documented", "private"),

    // -------- Prehistoric caves & rockshelters --------
    F(-118.78, 39.47, "Spirit Cave, NV", "~10,600 calendar years ago",
      "Ancient remains linked through DNA to living Indigenous peoples were repatriated. How should discovery change when descendants are part of the conversation?",
      "documented", "sensitive"),
    F(-114.0167, 40.7516, "Danger Cave, UT", "~11,000 years ago",
      "Stratified cave deposits record long-term changes around ancient Lake Bonneville. What shifts in food and water appear layer by layer?",
      "documented", "guided"),
    F(-85.8098, 34.9786, "Russell Cave National Monument, AL", "~12,000 years",
      "Repeated use of one shelter spans dramatically different climates and communities. What makes a place worth returning to for millennia?",
      "documented", "public"),
    F(-86.1014, 37.1870, "Mammoth Cave historic entrance, KY", "~5,000–2,000 years ago",
      "Ancient miners left evidence deep underground. What materials drew them into the dark?",
      "documented", "public"),
    F(-118.5586, 39.9625, "Lovelock Cave Historic Site, NV", "duck decoys ~2,000 years old",
      "Preserved tule decoys reveal precise wetland knowledge. What does an everyday hunting tool tell us that a monument cannot?",
      "documented", "public"),
    F(-121.0696, 43.3721, "Fort Rock Cave, OR", "sandals ~9,000–10,000 years old",
      "Woven footwear survived in a dry cave. What other technologies vanish when preservation conditions are less kind?",
      "documented", "guided"),

    // -------- Grand Canyon documented ruins + 1 story-marker --------
    F(-111.8666, 36.0132, "Tusayan Ruin, South Rim, AZ", "~800 years ago",
      "An Ancestral Pueblo village survives near Desert View. How did households live with rim-top seasons and canyon resources?",
      "documented", "public"),
    F(-111.9417, 36.1324, "Walhalla Glades Pueblo, North Rim, AZ", "~AD 1050–1150",
      "Ruins near an overlook are part of a wider plateau farming landscape. What is invisible when attention stays on the stone rooms alone?",
      "documented", "public"),
    F(-112.0953, 36.1050, "Bright Angel Pueblo, inner canyon, AZ", "~900–1,000 years ago",
      "An Ancestral Pueblo home near Bright Angel Creek makes the inner canyon part of the human story, not an empty geological backdrop.",
      "documented", "sensitive"),
    F(-111.88, 36.08, "Unkar Delta, inner canyon, AZ", "main occupation ~AD 1050–1150",
      "Ancestral Puebloan settlement on a river delta asks how people moved between canyon floor and rim.",
      "documented", "sensitive"),
    F(-112.1092, 36.0589, "1909 Arizona Gazette / \"Kincaid cave\" story, AZ", "unverified 1909 newspaper claim",
      "A newspaper described Egyptian-style finds in an unnamed cave, but no location, artifacts, or expedition record substantiate it. Why has the story persisted while documented Indigenous sites are so often overlooked?",
      "story-marker", "story-marker"),

    // -------- Southwest rock art & settlements --------
    F(-107.96, 36.04, "Chaco Culture National Historical Park, NM", "major construction ~AD 850–1150",
      "Great houses and long roads suggest coordination across a vast landscape. What ties an architectural center to distant communities?",
      "documented", "public"),
    F(-108.4731, 37.1678, "Cliff Palace, Mesa Verde, CO", "late 1100s–late 1200s CE",
      "Ancestral Puebloans built a large dwelling beneath an alcove. Why was the mesa-top world shifting into cliff settlements?",
      "documented", "guided"),
    F(-105.828, 33.325, "Three Rivers Petroglyph Site, NM", "~AD 400–1450",
      "Thousands of images cut across the basalt slope. How do repeated visits alter the meaning of a single panel?",
      "documented", "public"),
    F(-109.554, 37.296, "Newspaper Rock State Historic Monument, UT", "accumulated over ~2,000 years",
      "Marks by different hands and eras crowd one panel. Can we read it without treating every symbol as one message?",
      "documented", "public"),
    F(-106.732, 35.152, "Petroglyph National Monument / Boca Negra Canyon, NM", "~AD 1300–1700, some later",
      "A volcanic escarpment holds thousands of images and continuing cultural meaning. How does a living site resist being reduced to an outdoor gallery?",
      "documented", "public"),

    // -------- Pacific NW / Great Basin --------
    F(-124.67, 48.16, "Ozette Makah village, WA", "~2,000 years of occupation; buried village in recent centuries",
      "A mudslide preserved objects that rarely survive. What changes when descendants lead the interpretation?",
      "documented", "sensitive"),

    // -------- Southeast & Appalachian rock art --------
    F(-83.1100, 35.3016, "Judaculla Rock, NC", "~AD 500–1700 (sequence uncertain)",
      "Cherokee tradition connects this carved boulder with Judaculla. What does the oral history see in the marks that a detached map cannot?",
      "documented", "public"),
    F(-83.88, 34.88, "Track Rock Gap petroglyphs, GA", "precontact (age uncertain)",
      "Carved boulders carry Indigenous history and have also suffered vandalism. Can curiosity become care rather than damage?",
      "documented", "sensitive"),

    // -------- New England & Atlantic --------
    F(-71.111, 41.813, "Dighton Rock, MA", "carving date uncertain",
      "Many origin theories circulated, while Indigenous authorship remains central to responsible interpretation. What can be read without projecting a preferred visitor onto the stone?",
      "documented", "public"),
    F(-69.513, 44.042, "Whaleback Shell Midden, ME", "~2,200–1,000 years ago",
      "A once-vast Wabanaki oyster-shell midden was later mined down for lime. What evidence disappears when archaeology is treated as raw material?",
      "documented", "public"),
    F(-71.207, 42.843, "Mystery Hill / \"America's Stonehenge,\" NH", "construction date unproven; includes historic alteration",
      "If older charcoal lies beneath altered stonework, what would prove when the stonework itself was built? Do not label it an ancient European monument.",
      "disputed", "private"),
  ],
};

export const PREHISTORIC_CATEGORY_STYLE = {
  documented:    { fill: "#e8a020", ring: "#f4c95a" },  // amber/gold
  disputed:      { fill: "#f0d878", ring: "#fff4c2" },  // pale yellow (rendered with a "?")
  "story-marker":{ fill: "#f0f4fa", ring: "#a8d4ff" },  // white outline
};
