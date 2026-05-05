// Player roster — original concept inspired by sports manager card layouts
// but using our own liquid-glass / monogram visual language.

const TEAM_A = [
  {
    id: "karam_v02",
    name: "Karam V02",
    short: "K. V02",
    initials: "KV",
    bg: "AI Engineer",
    pos: "ST",
    role: "Striker",
    tier: "icon", // icon tier — cyan accent
    rating: 94,
    traits: ["Fast", "Finisher", "Icon"],
    stats: { PAC: 96, SHO: 94, PAS: 82, DRI: 90, DEF: 42, PHY: 78 },
    quote: "The one and only.",
  },
  {
    id: "akhrass",
    name: "Akhrass",
    short: "Akhrass",
    initials: "AK",
    bg: "Midfielder",
    pos: "CM",
    role: "Box-to-Box",
    tier: "rare",
    rating: 84,
    traits: ["Aggressive", "One-Shot Sprint", "Low Stamina"],
    stats: { PAC: 88, SHO: 78, PAS: 82, DRI: 80, DEF: 76, PHY: 84 },
    quote: "First gear or fifth — nothing in between.",
  },
  {
    id: "abdalhameed",
    name: "Abdalhameed",
    short: "Abdalhameed",
    initials: "AB",
    bg: "Cyber Security",
    pos: "RW",
    role: "Winger",
    tier: "rare",
    rating: 89,
    traits: ["Fastest Alive", "Fire Boot", "Pen-Test Press"],
    stats: { PAC: 97, SHO: 88, PAS: 78, DRI: 86, DEF: 50, PHY: 70 },
    quote: "Patches the defense in real time.",
  },
  {
    id: "anas",
    name: "Anas",
    short: "Anas",
    initials: "AN",
    bg: "Front-End",
    pos: "LW",
    role: "Winger",
    tier: "common",
    rating: 80,
    traits: ["Smooth Dribble", "Pixel Perfect", "Responsive"],
    stats: { PAC: 84, SHO: 76, PAS: 82, DRI: 86, DEF: 48, PHY: 68 },
    quote: "Renders defenders unmounted.",
  },
  {
    id: "abdullah",
    name: "Abdullah",
    short: "Abdullah",
    initials: "AD",
    bg: "QA Engineer",
    pos: "CB",
    role: "Center Back",
    tier: "common",
    rating: 81,
    traits: ["No Bug Passes", "Edge-Case Tackle", "Regression Block"],
    stats: { PAC: 70, SHO: 50, PAS: 72, DRI: 64, DEF: 86, PHY: 82 },
    quote: "Found a flaw in their formation.",
  },
  {
    id: "tarawneh",
    name: "Tarawneh",
    short: "Tarawneh",
    initials: "TR",
    bg: "Designer",
    pos: "GK",
    role: "Keeper",
    tier: "rare",
    rating: 84,
    traits: ["Vision", "Pixel-Perfect Save", "Composition"],
    stats: { PAC: 70, SHO: 50, PAS: 80, DRI: 70, DEF: 86, PHY: 78 },
    quote: "Every save is on the grid.",
  },
  {
    id: "husam",
    name: "Husam",
    short: "Husam",
    initials: "HU",
    bg: "Designer",
    pos: "LB",
    role: "Full-Back",
    tier: "common",
    rating: 83,
    traits: ["Color Theory", "Overlapping Run", "Symmetry"],
    stats: { PAC: 80, SHO: 60, PAS: 76, DRI: 74, DEF: 78, PHY: 72 },
    quote: "Defends with negative space.",
  },
  {
    id: "abdallah_jalok",
    name: "Jalok",
    short: "Jalok",
    initials: "JA",
    bg: "Technology and Consulting Services",
    pos: "CM",
    role: "Associate Business Consultant",
    tier: "rare",
    rating: 87,
    traits: ["Synergy Tackle", "PowerPoint Pass", "Out of Office"],
    stats: { PAC: 76, SHO: 84, PAS: 94, DRI: 88, DEF: 82, PHY: 86 },
    quote: "Let me circle back on that goal.",
  },
];

const TEAM_B = [
  {
    id: "suhaib",
    name: "Suhaib",
    short: "Suhaib",
    initials: "SU",
    bg: "Back-End",
    pos: "GK",
    role: "Keeper",
    tier: "rare",
    rating: 87,
    traits: ["Server-Side Block", "Throughput", "Latency-Free"],
    stats: { PAC: 72, SHO: 50, PAS: 82, DRI: 64, DEF: 90, PHY: 84 },
    quote: "Every shot returns 403.",
  },
  {
    id: "ahmed_saleh",
    name: "Ahmed Saleh",
    short: "A. Saleh",
    initials: "AS",
    bg: "Front-End",
    pos: "LW",
    role: "Winger",
    tier: "common",
    rating: 81,
    traits: ["Hot Reload", "Smooth State", "Animated Run"],
    stats: { PAC: 86, SHO: 76, PAS: 80, DRI: 84, DEF: 50, PHY: 68 },
    quote: "Re-renders the wing on every tick.",
  },
  {
    id: "essam",
    name: "Essam",
    short: "Essam",
    initials: "ES",
    bg: "RPA",
    pos: "CM",
    role: "الفحل الأعظم",
    tier: "common",
    rating: 80,
    traits: ["الفحل الأعظم", "Bot-Press", "Loop Run"],
    stats: { PAC: 76, SHO: 68, PAS: 84, DRI: 76, DEF: 64, PHY: 72 },
    quote: "Schedules the assist.",
  },
  {
    id: "qais",
    name: "Qais",
    short: "Qais",
    initials: "QA",
    bg: "Full-Stack",
    pos: "CM",
    role: "Box-to-Box",
    tier: "rare",
    rating: 87,
    traits: ["End-to-End", "Both Boxes", "Stack Overflow"],
    stats: { PAC: 82, SHO: 80, PAS: 84, DRI: 82, DEF: 78, PHY: 80 },
    quote: "Owns the whole pitch.",
  },
  {
    id: "anas_deep",
    name: "Anas DEEP",
    short: "A. DEEP",
    initials: "AD",
    bg: "RPA",
    pos: "RW",
    role: "Winger",
    tier: "common",
    rating: 79,
    traits: ["Scripted Run", "Headless Sprint", "Macro Touch"],
    stats: { PAC: 84, SHO: 72, PAS: 76, DRI: 78, DEF: 50, PHY: 70 },
    quote: "Runs the same play, perfectly, every time.",
  },
  {
    id: "tarik",
    name: "Tarik",
    short: "Tarik",
    initials: "TA",
    bg: "Intern · Underdog",
    pos: "ST",
    role: "Striker",
    tier: "underdog", // special tier — soft warm-white accent
    rating: 85,
    traits: ["Underdog", "Fearless", "First Touch Goals"],
    stats: { PAC: 82, SHO: 80, PAS: 70, DRI: 78, DEF: 40, PHY: 66 },
    quote: "They forgot to scout him.",
  },
  {
    id: "karam_v01",
    name: "Karam V01",
    short: "K. V01",
    initials: "KV",
    bg: "Front-End",
    pos: "LB",
    role: "Full-Back",
    tier: "common",
    rating: 80,
    traits: ["Legacy Build", "CSS Tackle", "Origin Story"],
    stats: { PAC: 80, SHO: 64, PAS: 76, DRI: 76, DEF: 78, PHY: 72 },
    quote: "Where it all started.",
  },
];

// Formation slots — 5-a-side (4 outfield + 1 GK).
// Team A occupies the LEFT half, Team B the RIGHT half (mirrored at render).
const FORMATIONS = {
  "1-2-1-1": {
    label: "1-2-1-1",
    slots: [
      { role: "GK", x: 0.05, y: 0.50 },
      { role: "DEF", x: 0.18, y: 0.50 },
      { role: "MID", x: 0.30, y: 0.28 },
      { role: "MID", x: 0.30, y: 0.72 },
      { role: "ST",  x: 0.44, y: 0.50 },
    ],
  },
  "1-1-2-1": {
    label: "1-1-2-1",
    slots: [
      { role: "GK", x: 0.05, y: 0.50 },
      { role: "DEF", x: 0.18, y: 0.50 },
      { role: "MID", x: 0.30, y: 0.50 },
      { role: "ST",  x: 0.44, y: 0.30 },
      { role: "ST",  x: 0.44, y: 0.70 },
    ],
  },
  "1-2-2": {
    label: "1-2-2 (Box)",
    slots: [
      { role: "GK", x: 0.05, y: 0.50 },
      { role: "DEF", x: 0.20, y: 0.30 },
      { role: "DEF", x: 0.20, y: 0.70 },
      { role: "ST",  x: 0.42, y: 0.30 },
      { role: "ST",  x: 0.42, y: 0.70 },
    ],
  },
  "1-1-1-2": {
    label: "1-1-1-2 (Y)",
    slots: [
      { role: "GK", x: 0.05, y: 0.50 },
      { role: "DEF", x: 0.18, y: 0.50 },
      { role: "MID", x: 0.30, y: 0.50 },
      { role: "ST",  x: 0.44, y: 0.32 },
      { role: "ST",  x: 0.44, y: 0.68 },
    ],
  },
};

const STARTERS_PER_SIDE = 5;

// Auto-fit roster onto a formation (5 starters). Players already pinned to
// specific slots via the `lockSlots` map (slotIndex -> playerId) are placed
// first; everyone else is greedy-assigned by position affinity + rating.
// Returns { starters: Player[5], bench: Player[] }.
function buildLineup(roster, formation, lockSlots = {}) {
  const slots = FORMATIONS[formation].slots;
  const starters = new Array(slots.length).fill(null);
  const used = new Set();

  // Generalize player position to {GK, DEF, MID, ST}
  const generalize = (pos) => {
    if (pos === "GK") return "GK";
    if (["CB", "LB", "RB"].includes(pos)) return "DEF";
    if (["CM"].includes(pos)) return "MID";
    if (["LW", "RW", "ST"].includes(pos)) return "ST";
    return "MID";
  };

  // Honor locked slots first
  Object.entries(lockSlots).forEach(([slotIdxStr, playerId]) => {
    const slotIdx = Number(slotIdxStr);
    if (slotIdx < 0 || slotIdx >= slots.length) return;
    const player = roster.find((p) => p.id === playerId);
    if (!player || used.has(player.id)) return;
    starters[slotIdx] = player;
    used.add(player.id);
  });

  const remaining = roster.filter((p) => !used.has(p.id))
    .sort((a, b) => b.rating - a.rating);

  const affinity = (player, slotRole) => {
    const gen = generalize(player.pos);
    if (gen === slotRole) return 3;
    if (slotRole === "GK") return 0.3; // nobody is a real GK; least-bad
    if (gen === "MID" && (slotRole === "DEF" || slotRole === "ST")) return 1.5;
    if ((gen === "DEF" || gen === "ST") && slotRole === "MID") return 1.2;
    return 0.8;
  };

  for (let i = 0; i < slots.length; i++) {
    if (starters[i]) continue;
    const slot = slots[i];
    let bestIdx = -1, bestScore = -Infinity;
    for (let j = 0; j < remaining.length; j++) {
      if (!remaining[j]) continue;
      const score = affinity(remaining[j], slot.role) * 100 + remaining[j].rating;
      if (score > bestScore) { bestScore = score; bestIdx = j; }
    }
    if (bestIdx >= 0) {
      starters[i] = remaining[bestIdx];
      remaining[bestIdx] = null;
    }
  }

  const startedIds = new Set(starters.filter(Boolean).map((p) => p.id));
  const bench = roster.filter((p) => !startedIds.has(p.id))
    .sort((a, b) => b.rating - a.rating);

  return { starters, bench };
}

window.TEAM_A = TEAM_A;
window.TEAM_B = TEAM_B;
window.FORMATIONS = FORMATIONS;
window.STARTERS_PER_SIDE = STARTERS_PER_SIDE;
window.buildLineup = buildLineup;
