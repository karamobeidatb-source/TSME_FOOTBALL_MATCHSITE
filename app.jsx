// Main app — Lineup Designer (5v5)

const { useState, useEffect, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "formationA": "1-2-1-1",
  "formationB": "1-2-1-1",
  "captainA": "karam_v02",
  "captainB": "qais",
  "showRatings": true,
  "grassTone": "classic",
  "matchTitle": "5-a-Side Showdown",
  "venue": "Academy of Scientific Promotion · 7th Circle, Amman",
  "matchDate": "2026-05-06T18:00",
  "matchDateLabel": "Wed · 06 May 2026 · 6:00 PM",
  "matchTimezone": "Jordan Time (GMT+3)",
  "lockA": { "0": "tarawneh", "4": "karam_v02" },
  "lockB": { "0": "suhaib", "4": "qais" },
  "posOverrides": {},
  "accentHue": 8,
  "neonPitch": true,
  "scanlines": true
}/*EDITMODE-END*/;

const POSITIONS = ["GK", "DEF", "MID", "ST"];

function applyPosOverrides(roster, overrides) {
  return roster.map((p) => {
    const o = overrides[p.id];
    if (!o) return p;
    return { ...p, pos: o };
  });
}

function RosterRow({ player, selected, isCaptain, isStarter, onClick, onDragStart, onDrop, onDragOver, isDragOver }) {
  return (
    <div
      className={`roster-row${selected ? " selected" : ""}${isCaptain ? " captain" : ""}${isStarter ? "" : " bench"}${isDragOver ? " drop-target" : ""}`}
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="roster-rating">{player.rating}</div>
      <div className="roster-info">
        <div className="roster-name" title={player.name}>{player.name}</div>
        <div className="roster-bg">{player.bg}</div>
      </div>
      <div className="roster-pos">{player.pos}</div>
    </div>
  );
}

function TeamPanel({ side, label, crest, roster, formation, starters, bench, selectedId, captainId, onSelect, onSetCaptain, onSwap }) {
  const sortedStarters = starters.filter(Boolean);
  const sortedBench = [...bench].sort((a, b) => b.rating - a.rating);
  const [dragOverBench, setDragOverBench] = React.useState(false);

  const dragStart = (e, player, isStarter, slotIdx) => {
    e.dataTransfer.setData("application/x-player", JSON.stringify({
      kind: isStarter ? "slot" : "bench",
      side, slotIdx, playerId: player.id,
    }));
    e.dataTransfer.effectAllowed = "move";
  };
  const dragOverBenchHandler = (e) => { e.preventDefault(); setDragOverBench(true); };
  const dropOnBench = (e) => {
    e.preventDefault(); setDragOverBench(false);
    const raw = e.dataTransfer.getData("application/x-player");
    if (!raw) return;
    try { onSwap(JSON.parse(raw), { kind: "bench", side }); } catch {}
  };

  return (
    <div className={`team-panel team-panel--${side} liquid-glass-strong`}>
      <div className="team-head">
        <div className={`team-crest team-crest--${side}`}>{crest}</div>
        <div className="team-head-text">
          <div className="team-name">{label}</div>
          <div className="team-meta">{side === "A" ? "Home" : "Away"} · {roster.length} squad</div>
        </div>
      </div>
      <div className="team-formation">
        Formation <strong>{formation}</strong>
      </div>

      <div className="roster-group-label">On Pitch · {sortedStarters.length}/5</div>
      <div className="team-roster">
        {sortedStarters.map((p) => {
          const slotIdx = starters.findIndex((s) => s && s.id === p.id);
          return (
            <RosterRow
              key={p.id}
              player={p}
              selected={selectedId === p.id}
              isCaptain={captainId === p.id}
              isStarter={true}
              onClick={() => onSelect(p.id)}
              onDragStart={(e) => dragStart(e, p, true, slotIdx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const raw = e.dataTransfer.getData("application/x-player");
                if (!raw) return;
                try { onSwap(JSON.parse(raw), { kind: "slot", side, slotIdx }); } catch {}
              }}
            />
          );
        })}
      </div>

      {sortedBench.length > 0 && (
        <React.Fragment>
          <div className="roster-group-label">Bench · {sortedBench.length}</div>
          <div
            className={`team-roster bench-roster${dragOverBench ? " drop-target" : ""}`}
            onDragOver={dragOverBenchHandler}
            onDragLeave={() => setDragOverBench(false)}
            onDrop={dropOnBench}
          >
            {sortedBench.map((p) => (
              <RosterRow
                key={p.id}
                player={p}
                selected={selectedId === p.id}
                isCaptain={false}
                isStarter={false}
                onClick={() => onSelect(p.id)}
                onDragStart={(e) => dragStart(e, p, false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={dropOnBench}
              />
            ))}
          </div>
        </React.Fragment>
      )}

      <button
        type="button"
        className="topbar-pill liquid-glass make-captain-btn"
        onClick={() => selectedId && onSetCaptain(selectedId)}
        disabled={!selectedId}
      >
        Make Captain
      </button>
    </div>
  );
}

function MatchStrip({ tweaks, lineupA, lineupB }) {
  const aStarters = lineupA.starters.filter(Boolean);
  const bStarters = lineupB.starters.filter(Boolean);
  const avgA = aStarters.length ? Math.round(aStarters.reduce((s, p) => s + p.rating, 0) / aStarters.length) : 0;
  const avgB = bStarters.length ? Math.round(bStarters.reduce((s, p) => s + p.rating, 0) / bStarters.length) : 0;

  // Live countdown to kickoff (Jordan time, GMT+3)
  const kickoffMs = React.useMemo(() => {
    // Build the date as Jordan time: 2026-05-06T18:00 GMT+3 → 15:00 UTC
    const m = (tweaks.matchDate || "").match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
    if (!m) return null;
    const [, y, mo, d, h, mi] = m.map(Number);
    return Date.UTC(y, mo - 1, d, h - 3, mi);
  }, [tweaks.matchDate]);

  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const countdown = React.useMemo(() => {
    if (!kickoffMs) return null;
    const diff = kickoffMs - now;
    if (diff <= 0) return { label: "KICKOFF", live: true };
    const days = Math.floor(diff / 86400000);
    const hrs = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return { days, hrs, mins, secs, live: false };
  }, [kickoffMs, now]);

  return (
    <div className="match-banner liquid-glass-strong">
      <div className="match-banner__left">
        <div className="match-banner__badge">
          <span className="match-banner__badge-dot" />
          <span>UPCOMING FIXTURE</span>
        </div>
        <div className="match-banner__title">{tweaks.matchTitle}</div>
        <div className="match-banner__venue">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0}}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{tweaks.venue}</span>
        </div>
      </div>

      <div className="match-banner__center">
        <div className="match-banner__date-row">
          <div className="match-banner__date-block">
            <div className="match-banner__date-day">06</div>
            <div className="match-banner__date-mo">MAY</div>
          </div>
          <div className="match-banner__time-block">
            <div className="match-banner__time">6:00 PM</div>
            <div className="match-banner__tz">{tweaks.matchTimezone}</div>
            <div className="match-banner__date-full">Wed · 06 May 2026</div>
          </div>
        </div>
        {countdown && (
          <div className="match-banner__countdown">
            {countdown.live ? (
              <div className="match-banner__live">● LIVE NOW</div>
            ) : (
              <React.Fragment>
                <div className="cd-cell"><div className="cd-num">{String(countdown.days).padStart(2, "0")}</div><div className="cd-lbl">DAYS</div></div>
                <div className="cd-sep">:</div>
                <div className="cd-cell"><div className="cd-num">{String(countdown.hrs).padStart(2, "0")}</div><div className="cd-lbl">HRS</div></div>
                <div className="cd-sep">:</div>
                <div className="cd-cell"><div className="cd-num">{String(countdown.mins).padStart(2, "0")}</div><div className="cd-lbl">MIN</div></div>
                <div className="cd-sep">:</div>
                <div className="cd-cell"><div className="cd-num">{String(countdown.secs).padStart(2, "0")}</div><div className="cd-lbl">SEC</div></div>
              </React.Fragment>
            )}
          </div>
        )}
      </div>

      <div className="match-banner__right">
        <div className="match-banner__teams">
          <div className="mb-team mb-team--A">
            <div className="mb-team__crest">A</div>
            <div className="mb-team__meta">
              <div className="mb-team__name">TEAM A</div>
              <div className="mb-team__avg">AVG {avgA}</div>
            </div>
          </div>
          <div className="match-banner__vs">VS</div>
          <div className="mb-team mb-team--B">
            <div className="mb-team__meta mb-team__meta--right">
              <div className="mb-team__name">TEAM B</div>
              <div className="mb-team__avg">AVG {avgB}</div>
            </div>
            <div className="mb-team__crest">B</div>
          </div>
        </div>
        <div className="match-banner__format">5-A-SIDE · 2 × 25 MIN</div>
      </div>
    </div>
  );
}

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [selectedId, setSelectedId] = useState(null);

  const overrides = tweaks.posOverrides || {};
  const teamARoster = useMemo(() => applyPosOverrides(window.TEAM_A, overrides), [overrides]);
  const teamBRoster = useMemo(() => applyPosOverrides(window.TEAM_B, overrides), [overrides]);

  const lineupA = useMemo(
    () => buildLineup(teamARoster, tweaks.formationA, tweaks.lockA || {}),
    [teamARoster, tweaks.formationA, tweaks.lockA]
  );
  const lineupB = useMemo(
    () => buildLineup(teamBRoster, tweaks.formationB, tweaks.lockB || {}),
    [teamBRoster, tweaks.formationB, tweaks.lockB]
  );

  const allPlayers = [...teamARoster, ...teamBRoster];
  const selectedPlayer = allPlayers.find((p) => p.id === selectedId) || null;

  const setCaptain = (id) => {
    if (window.TEAM_A.some((p) => p.id === id)) setTweak("captainA", id);
    else if (window.TEAM_B.some((p) => p.id === id)) setTweak("captainB", id);
  };

  const setPlayerPos = (playerId, newPos) => {
    setTweak("posOverrides", { ...(tweaks.posOverrides || {}), [playerId]: newPos });
  };

  // Lock a player to a specific slot (used by "Move to slot" tweak)
  const lockToSlot = (teamSide, slotIdx, playerId) => {
    const key = teamSide === "A" ? "lockA" : "lockB";
    const current = { ...(tweaks[key] || {}) };
    // Remove this player from any other slot
    Object.keys(current).forEach((k) => { if (current[k] === playerId) delete current[k]; });
    current[slotIdx] = playerId;
    setTweak(key, current);
  };

  const clearLocks = (teamSide) => {
    setTweak(teamSide === "A" ? "lockA" : "lockB", {});
  };

  // ── Drag & drop swap ──────────────────────────────────────────
  // source: { kind: "slot"|"bench", side, slotIdx?, playerId }
  // target: { kind: "slot"|"bench", side, slotIdx? }
  const handleSwap = (source, target) => {
    if (!source || !target) return;
    if (source.playerId === target.playerId) return;

    // Find the player currently sitting at the target (if a slot)
    let targetPlayerId = null;
    if (target.kind === "slot") {
      const lineup = target.side === "A" ? lineupA.starters : lineupB.starters;
      targetPlayerId = lineup[target.slotIdx]?.id || null;
    }

    const lockA = { ...(tweaks.lockA || {}) };
    const lockB = { ...(tweaks.lockB || {}) };
    const getLock = (s) => (s === "A" ? lockA : lockB);

    // Helper: remove a player from any slot lock on either side
    const removeFromAnyLock = (pid) => {
      [lockA, lockB].forEach((l) => {
        Object.keys(l).forEach((k) => { if (l[k] === pid) delete l[k]; });
      });
    };

    if (target.kind === "slot") {
      // Pin source to target slot on target.side
      removeFromAnyLock(source.playerId);
      getLock(target.side)[target.slotIdx] = source.playerId;
      // If there was a player at the target slot AND source came from a slot, swap them in
      if (targetPlayerId && source.kind === "slot") {
        // Free the source slot, then pin target player there
        delete getLock(source.side)[source.slotIdx];
        getLock(source.side)[source.slotIdx] = targetPlayerId;
      } else if (targetPlayerId && source.kind === "bench") {
        // Bump the displaced target player to the bench by removing their lock
        removeFromAnyLock(targetPlayerId);
      }
    } else if (target.kind === "bench") {
      // Drop to bench = unlock that player from any slot
      removeFromAnyLock(source.playerId);
    }

    setTweak({ lockA, lockB });
  };
  // ──────────────────────────────────────────────────────────────

  // Selected player's team & current slot info
  const selectedTeamSide = selectedPlayer
    ? (window.TEAM_A.some((p) => p.id === selectedPlayer.id) ? "A" : "B")
    : null;

  return (
    <React.Fragment>
      <div
        className={`app-bg${tweaks.scanlines ? " app-bg--scanlines" : ""}`}
        style={{ "--accent-hue": tweaks.accentHue }}
      />
      <div className="app" style={{ "--accent-hue": tweaks.accentHue }} data-neon={tweaks.neonPitch ? "1" : "0"}>
        {/* Hero header */}
        <div className="hero-header">
          <div className="hero-nav">
            <div className="hero-brand">
              <div className="hero-logo" aria-hidden="true">
                <span className="hero-logo-mark" />
                <span className="hero-logo-mark hero-logo-mark--alt" />
              </div>
              <div className="hero-brand-text">
                <div className="hero-brand-name">PITCH<em>.live</em></div>
                <div className="hero-brand-sub">Five · A · Side</div>
              </div>
            </div>
            <nav className="hero-nav-links">
              <a className="hero-nav-link active" href="#">Lineup</a>
            </nav>
            <button type="button" className="hero-cta-pill">
              <span className="hero-cta-pill-dot" /> Match Live
            </button>
          </div>

          <div className="hero-body">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-tick" />
              MATCHDAY · {new Date().toLocaleDateString("en-GB", { weekday: "long" }).toUpperCase()}
            </div>
            <h1 className="hero-title">
              SWIFT &amp; <em>Sharp</em>
              <br />
              FIVE-A-SIDE <span className="hero-title-accent">FOOTBALL.</span>
            </h1>
            <div className="hero-actions">
              <button type="button" className="clip-btn clip-btn--primary">
                Kick Off
                <span className="clip-btn-arrow">→</span>
              </button>
              <button type="button" className="clip-btn clip-btn--ghost">
                View Tactics
              </button>
            </div>
          </div>
        </div>

        {/* Top bar */}
        <div className="topbar liquid-glass-strong">
          <div className="topbar-brand">
            <div className="topbar-mark">L</div>
            <div className="topbar-brand-text">
              <div className="topbar-title">Lineup <em>Designer</em></div>
              <div className="topbar-sub">5-a-Side Edition</div>
            </div>
          </div>
          <div className="topbar-spacer" />
          <button type="button" className="topbar-pill liquid-glass">
            <span className="dot" /> Live Pitch
          </button>
          <button type="button" className="topbar-pill liquid-glass">Export PNG</button>
          <button type="button" className="topbar-pill liquid-glass topbar-pill--accent">Share Lineup</button>
        </div>

        {/* Match banner — fixture details */}
        <MatchStrip tweaks={tweaks} lineupA={lineupA} lineupB={lineupB} />

        {/* Stage: Team A | Pitch | Detail+Team B */}
        <div className="stage">
          <TeamPanel
            side="A"
            label="Team A"
            crest="A"
            roster={teamARoster}
            formation={tweaks.formationA}
            starters={lineupA.starters}
            bench={lineupA.bench}
            selectedId={selectedId}
            captainId={tweaks.captainA}
            onSelect={setSelectedId}
            onSetCaptain={setCaptain}
            onSwap={handleSwap}
          />

          <Pitch
            lineupA={lineupA.starters}
            lineupB={lineupB.starters}
            formationA={tweaks.formationA}
            formationB={tweaks.formationB}
            selectedId={selectedId}
            captainA={tweaks.captainA}
            captainB={tweaks.captainB}
            showRatings={tweaks.showRatings}
            grassTone={tweaks.grassTone}
            onSelect={setSelectedId}
            onSwap={handleSwap}
          />

          <div className="right-rail">
            <PlayerDetail player={selectedPlayer} />
            <TeamPanel
              side="B"
              label="Team B"
              crest="B"
              roster={teamBRoster}
              formation={tweaks.formationB}
              starters={lineupB.starters}
              bench={lineupB.bench}
              selectedId={selectedId}
              captainId={tweaks.captainB}
              onSelect={setSelectedId}
              onSetCaptain={setCaptain}
              onSwap={handleSwap}
            />
          </div>
        </div>

      </div>

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Match">
          <TweakText label="Match title" value={tweaks.matchTitle} onChange={(v) => setTweak("matchTitle", v)} />
          <TweakText label="Venue" value={tweaks.venue} onChange={(v) => setTweak("venue", v)} />
          <TweakText label="Date label" value={tweaks.matchDateLabel} onChange={(v) => setTweak("matchDateLabel", v)} />
          <TweakText label="Timezone" value={tweaks.matchTimezone} onChange={(v) => setTweak("matchTimezone", v)} />
        </TweakSection>

        <TweakSection label="Team A · Formation">
          <TweakSelect
            label="Shape"
            value={tweaks.formationA}
            options={Object.entries(window.FORMATIONS).map(([k, v]) => ({ value: k, label: v.label }))}
            onChange={(v) => setTweak("formationA", v)}
          />
          <TweakSelect
            label="Captain"
            value={tweaks.captainA}
            options={window.TEAM_A.map((p) => ({ value: p.id, label: `${p.name} · ${p.rating}` }))}
            onChange={(v) => setTweak("captainA", v)}
          />
          <TweakButton label="Auto-arrange Team A" onClick={() => clearLocks("A")} secondary />
        </TweakSection>

        <TweakSection label="Team B · Formation">
          <TweakSelect
            label="Shape"
            value={tweaks.formationB}
            options={Object.entries(window.FORMATIONS).map(([k, v]) => ({ value: k, label: v.label }))}
            onChange={(v) => setTweak("formationB", v)}
          />
          <TweakSelect
            label="Captain"
            value={tweaks.captainB}
            options={window.TEAM_B.map((p) => ({ value: p.id, label: `${p.name} · ${p.rating}` }))}
            onChange={(v) => setTweak("captainB", v)}
          />
          <TweakButton label="Auto-arrange Team B" onClick={() => clearLocks("B")} secondary />
        </TweakSection>

        {selectedPlayer && (
          <TweakSection label={`Selected · ${selectedPlayer.name}`}>
            <TweakSelect
              label="Position"
              value={selectedPlayer.pos}
              options={POSITIONS.map((p) => ({ value: p, label: p }))}
              onChange={(v) => setPlayerPos(selectedPlayer.id, v)}
            />
            <TweakSelect
              label="Pin to slot"
              value={(() => {
                const lock = (selectedTeamSide === "A" ? tweaks.lockA : tweaks.lockB) || {};
                const found = Object.entries(lock).find(([k, v]) => v === selectedPlayer.id);
                return found ? found[0] : "auto";
              })()}
              options={[
                { value: "auto", label: "Auto" },
                ...window.FORMATIONS[selectedTeamSide === "A" ? tweaks.formationA : tweaks.formationB].slots.map((s, i) => ({
                  value: String(i),
                  label: `Slot ${i + 1} · ${s.role}`,
                })),
              ]}
              onChange={(v) => {
                if (v === "auto") {
                  const key = selectedTeamSide === "A" ? "lockA" : "lockB";
                  const current = { ...(tweaks[key] || {}) };
                  Object.keys(current).forEach((k) => { if (current[k] === selectedPlayer.id) delete current[k]; });
                  setTweak(key, current);
                } else {
                  lockToSlot(selectedTeamSide, Number(v), selectedPlayer.id);
                }
              }}
            />
          </TweakSection>
        )}

        <TweakSection label="Vibe">
          <TweakSlider
            label="Accent hue"
            value={tweaks.accentHue}
            min={0} max={360} step={1}
            unit="°"
            onChange={(v) => setTweak("accentHue", v)}
          />
          <TweakToggle
            label="Neon pitch lines"
            value={tweaks.neonPitch}
            onChange={(v) => setTweak("neonPitch", v)}
          />
          <TweakToggle
            label="Scanline overlay"
            value={tweaks.scanlines}
            onChange={(v) => setTweak("scanlines", v)}
          />
        </TweakSection>

        <TweakSection label="Pitch">
          <TweakRadio
            label="Grass tone"
            value={tweaks.grassTone}
            options={[
              { value: "classic", label: "Classic" },
              { value: "night", label: "Night" },
              { value: "dusk", label: "Dusk" },
              { value: "mono", label: "Mono" },
            ]}
            onChange={(v) => setTweak("grassTone", v)}
          />
          <TweakToggle
            label="Show ratings on pins"
            value={tweaks.showRatings}
            onChange={(v) => setTweak("showRatings", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
