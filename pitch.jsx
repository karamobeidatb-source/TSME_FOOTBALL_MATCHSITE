// Pitch — original stadium-grass rendering with formation slots.
// Renders both teams on a single pitch (Team A left, Team B mirrored right).

const { useMemo: useMemoP } = React;

function Pitch({
  lineupA, lineupB,
  formationA, formationB,
  selectedId, captainA, captainB,
  showRatings,
  grassTone,
  onSelect,
  onSwap,
}) {
  const slotsA = window.FORMATIONS[formationA].slots;
  const slotsB = window.FORMATIONS[formationB].slots;
  const [dragOver, setDragOver] = React.useState(null); // "a-3" | "b-1" | "bench-A" | "bench-B"

  const tones = {
    classic: { a: "#1f5a2e", b: "#1a4a26", c: "#0e2c17" },
    night:   { a: "#1a3a48", b: "#143140", c: "#0a1a22" },
    dusk:    { a: "#3a2a4a", b: "#2c2240", c: "#160f24" },
    mono:    { a: "#2a2a2a", b: "#1f1f1f", c: "#0d0d0d" },
  };
  const t = tones[grassTone] || tones.classic;

  const handleDragStart = (e, payload) => {
    e.dataTransfer.setData("application/x-player", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e, key) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDragOver(key); };
  const handleDrop = (e, target) => {
    e.preventDefault(); setDragOver(null);
    const raw = e.dataTransfer.getData("application/x-player");
    if (!raw) return;
    try { onSwap(JSON.parse(raw), target); } catch {}
  };

  return (
    <div className="pitch-wrap">
      <div
        className="pitch"
        style={{
          backgroundImage: `
            radial-gradient(120% 80% at 50% 50%, ${t.a} 0%, ${t.b} 55%, ${t.c} 100%),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 8.33%, rgba(0,0,0,0.04) 8.33% 16.66%)
          `,
        }}
      >
        <div className="pitch-stripes" aria-hidden="true" />
        <div className="pitch-glow pitch-glow--a" aria-hidden="true" />
        <div className="pitch-glow pitch-glow--b" aria-hidden="true" />

        <svg className="pitch-lines" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.35)" />
            </linearGradient>
          </defs>
          <g fill="none" stroke="url(#lineGrad)" strokeWidth="2">
            <rect x="20" y="20" width="960" height="560" rx="2" />
            <line x1="500" y1="20" x2="500" y2="580" />
            <circle cx="500" cy="300" r="70" />
            <circle cx="500" cy="300" r="2.5" fill="rgba(255,255,255,0.6)" />
            <rect x="20" y="150" width="140" height="300" />
            <rect x="20" y="220" width="55" height="160" />
            <circle cx="115" cy="300" r="2.5" fill="rgba(255,255,255,0.6)" />
            <path d="M 160 240 A 70 70 0 0 1 160 360" />
            <rect x="840" y="150" width="140" height="300" />
            <rect x="925" y="220" width="55" height="160" />
            <circle cx="885" cy="300" r="2.5" fill="rgba(255,255,255,0.6)" />
            <path d="M 840 240 A 70 70 0 0 0 840 360" />
            <path d="M 20 32 A 12 12 0 0 1 32 20" />
            <path d="M 968 20 A 12 12 0 0 1 980 32" />
            <path d="M 20 568 A 12 12 0 0 0 32 580" />
            <path d="M 968 580 A 12 12 0 0 0 980 568" />
          </g>
        </svg>

        <div className="pitch-vignette" aria-hidden="true" />

        {slotsA.map((slot, i) => {
          const player = lineupA[i];
          const key = `a-${i}`;
          const left = `${slot.x * 100}%`;
          const top = `${slot.y * 100}%`;
          return (
            <div
              key={key}
              className={`pin-pos${dragOver === key ? " drop-target" : ""}`}
              style={{ left, top }}
              onDragOver={(e) => handleDragOver(e, key)}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleDrop(e, { kind: "slot", side: "A", slotIdx: i })}
            >
              {!player && <span className="pin-empty">{slot.role}</span>}
              {player && (
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, { kind: "slot", side: "A", slotIdx: i, playerId: player.id })}
                >
                  <PlayerPin
                    player={player}
                    isCaptain={player.id === captainA}
                    showRating={showRatings}
                    onClick={() => onSelect(player.id)}
                    scale={0.82}
                    teamSide="A"
                  />
                </div>
              )}
              {selectedId === player?.id && <span className="pin-select-ring" />}
            </div>
          );
        })}

        {slotsB.map((slot, i) => {
          const player = lineupB[i];
          const key = `b-${i}`;
          const left = `${(1 - slot.x) * 100}%`;
          const top = `${slot.y * 100}%`;
          return (
            <div
              key={key}
              className={`pin-pos${dragOver === key ? " drop-target" : ""}`}
              style={{ left, top }}
              onDragOver={(e) => handleDragOver(e, key)}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleDrop(e, { kind: "slot", side: "B", slotIdx: i })}
            >
              {!player && <span className="pin-empty">{slot.role}</span>}
              {player && (
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, { kind: "slot", side: "B", slotIdx: i, playerId: player.id })}
                >
                  <PlayerPin
                    player={player}
                    isCaptain={player.id === captainB}
                    showRating={showRatings}
                    onClick={() => onSelect(player.id)}
                    scale={0.82}
                    teamSide="B"
                  />
                </div>
              )}
              {selectedId === player?.id && <span className="pin-select-ring" />}
            </div>
          );
        })}

        <div className="pitch-center-badge liquid-glass">
          <span className="pcb-side pcb-a">A</span>
          <span className="pcb-vs">VS</span>
          <span className="pcb-side pcb-b">B</span>
        </div>

        <div className="pitch-hint">↔ Drag any player to swap positions</div>
      </div>
    </div>
  );
}

window.Pitch = Pitch;
