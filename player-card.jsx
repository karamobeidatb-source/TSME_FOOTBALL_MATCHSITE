// PlayerCard — original card layout (NOT a clone of any sports-game UI)
// Vertical glass slab with: rating ring, monogram avatar with diagonal sheen,
// name, position chip, background tag, three traits, micro-stats bar.

const { useMemo } = React;

function tierAccent(tier) {
  switch (tier) {
    case "icon":     return { ring: "rgba(180, 230, 240, 0.95)", glow: "rgba(140, 210, 230, 0.45)", label: "ICON" };
    case "rare":     return { ring: "rgba(230, 230, 235, 0.90)", glow: "rgba(200, 210, 220, 0.35)", label: "RARE" };
    case "underdog": return { ring: "rgba(245, 235, 215, 0.95)", glow: "rgba(230, 210, 170, 0.35)", label: "UNDERDOG" };
    default:         return { ring: "rgba(255, 255, 255, 0.65)", glow: "rgba(255, 255, 255, 0.20)", label: "SQUAD" };
  }
}

function PlayerPin({ player, isCaptain, showRating, onClick, scale = 1, teamSide }) {
  if (!player) return null;
  const acc = tierAccent(player.tier);
  const w = 134 * scale;
  const h = 200 * scale;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`player-pin liquid-glass-strong${teamSide ? " player-pin--team-" + teamSide : ""}`}
      style={{
        width: w,
        height: h,
        borderRadius: 18 * scale,
        boxShadow: `0 8px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04), 0 0 28px ${acc.glow}, inset 0 1px 1px rgba(255,255,255,0.18)`,
      }}
    >
      {/* sheen */}
      <span className="pin-sheen" aria-hidden="true" />

      {/* tier label */}
      <span className="pin-tier" style={{ color: acc.ring }}>{acc.label}</span>

      {/* rating */}
      {showRating && (
        <span className="pin-rating" style={{ borderColor: acc.ring }}>
          <span className="pin-rating-num">{player.rating}</span>
          <span className="pin-rating-pos">{player.pos}</span>
        </span>
      )}

      {/* captain */}
      {isCaptain && <span className="pin-captain">C</span>}

      {/* monogram */}
      <span className="pin-mono" aria-hidden="true">
        <span className="pin-mono-bg" />
        <span className="pin-mono-text">{player.initials}</span>
      </span>

      {/* name */}
      <span className="pin-name">{player.short}</span>

      {/* background tag */}
      <span className="pin-bg">{player.bg}</span>

      {/* traits */}
      <span className="pin-traits">
        {player.traits.slice(0, 2).map((t) => (
          <span key={t} className="pin-trait">{t}</span>
        ))}
      </span>
    </button>
  );
}

// Detail card — shown in side panel when a pin is selected
function PlayerDetail({ player }) {
  if (!player) {
    return (
      <div className="detail-empty">
        <div className="detail-empty-mark" />
        <div className="detail-empty-title">Select a player</div>
        <div className="detail-empty-sub">Tap any pin on the pitch to see their full card.</div>
      </div>
    );
  }
  const acc = tierAccent(player.tier);
  const stats = player.stats;

  return (
    <div className="detail-card liquid-glass-strong" style={{
      boxShadow: `0 12px 36px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04), 0 0 48px ${acc.glow}, inset 0 1px 1px rgba(255,255,255,0.18)`,
    }}>
      <span className="detail-sheen" aria-hidden="true" />

      <div className="detail-head">
        <div className="detail-rating" style={{ borderColor: acc.ring }}>
          <span className="detail-rating-num">{player.rating}</span>
          <span className="detail-rating-pos">{player.pos}</span>
          <span className="detail-rating-tier" style={{ color: acc.ring }}>{acc.label}</span>
        </div>
        <div className="detail-mono" aria-hidden="true">
          <span className="detail-mono-bg" />
          <span className="detail-mono-text">{player.initials}</span>
        </div>
      </div>

      <div className="detail-name">{player.name}</div>
      <div className="detail-role">
        <span className="detail-role-pos">{player.role}</span>
        <span className="detail-role-sep" />
        <span className="detail-role-bg">{player.bg}</span>
      </div>

      <div className="detail-quote">
        <span className="detail-quote-mark">“</span>
        <em className="detail-quote-text">{player.quote}</em>
      </div>

      <div className="detail-stats">
        {Object.entries(stats).map(([k, v]) => (
          <div key={k} className="stat-row">
            <span className="stat-key">{k}</span>
            <span className="stat-bar">
              <span className="stat-fill" style={{ width: `${v}%` }} />
            </span>
            <span className="stat-val">{v}</span>
          </div>
        ))}
      </div>

      <div className="detail-traits">
        {player.traits.map((t) => (
          <span key={t} className="detail-trait liquid-glass">{t}</span>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { PlayerPin, PlayerDetail, tierAccent });
