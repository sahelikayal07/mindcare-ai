import { useState, useEffect, useRef, useCallback } from "react";

// ─── STYLES ───────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Raleway:wght@200;300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --forest-deep:    #0a0f0a;
    --forest-dark:    #0d1a0d;
    --forest-mid:     #122012;
    --forest-green:   #1a3320;
    --forest-accent:  #2d5a3d;
    --forest-bright:  #3d7a52;
    --olive-muted:    #4a5c3a;
    --olive-light:    #6b7c52;
    --fog-white:      rgba(200,220,200,0.06);
    --text-primary:   rgba(220,235,220,0.92);
    --text-secondary: rgba(180,205,180,0.55);
    --text-dim:       rgba(150,180,150,0.35);
    --glass-bg:       rgba(10,20,10,0.45);
    --glass-border:   rgba(60,120,70,0.18);
    --glow-green:     rgba(45,90,61,0.6);
    --crisis-red:     rgba(180,60,60,0.15);
    --crisis-border:  rgba(200,80,80,0.3);
    --sidebar-w:      72px;
  }

  html, body, #root { height: 100%; width: 100%; }

  body {
    font-family: 'Raleway', sans-serif;
    font-weight: 300;
    background: var(--forest-deep);
    color: var(--text-primary);
    overflow: hidden;
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--forest-accent); border-radius: 2px; }

  /* ── Keyframes ── */
  @keyframes fogDrift1 {
    0%   { transform: translateX(-8%) translateY(0px) scaleX(1.0); opacity: 0.18; }
    33%  { transform: translateX(4%)  translateY(-12px) scaleX(1.04); opacity: 0.28; }
    66%  { transform: translateX(-2%) translateY(8px) scaleX(0.97); opacity: 0.22; }
    100% { transform: translateX(-8%) translateY(0px) scaleX(1.0); opacity: 0.18; }
  }
  @keyframes fogDrift2 {
    0%   { transform: translateX(6%)  translateY(0px); opacity: 0.14; }
    50%  { transform: translateX(-10%) translateY(-18px); opacity: 0.24; }
    100% { transform: translateX(6%)  translateY(0px); opacity: 0.14; }
  }
  @keyframes fogDrift3 {
    0%   { transform: translateX(-12%) translateY(5px) scaleY(1); opacity: 0.1; }
    40%  { transform: translateX(8%)  translateY(-10px) scaleY(1.05); opacity: 0.2; }
    100% { transform: translateX(-12%) translateY(5px) scaleY(1); opacity: 0.1; }
  }
  @keyframes fogDrift4 {
    0%   { transform: translateX(10%) translateY(-5px); opacity: 0.08; }
    60%  { transform: translateX(-6%) translateY(15px); opacity: 0.16; }
    100% { transform: translateX(10%) translateY(-5px); opacity: 0.08; }
  }
  @keyframes leafFall {
    0%   { transform: translateY(-60px) translateX(0px) rotate(0deg); opacity: 0; }
    5%   { opacity: 1; }
    90%  { opacity: 0.7; }
    100% { transform: translateY(110vh) translateX(var(--drift)) rotate(var(--rot)); opacity: 0; }
  }
  @keyframes tailSway {
    0%   { transform: rotate(-18deg) scaleX(1); }
    50%  { transform: rotate(22deg) scaleX(0.97); }
    100% { transform: rotate(-18deg) scaleX(1); }
  }
  @keyframes breathe {
    0%, 100% { transform: scaleY(1) scaleX(1); }
    50%       { transform: scaleY(1.015) scaleX(0.995); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInSlow {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(45,90,61,0); }
    50%       { box-shadow: 0 0 18px 4px rgba(45,90,61,0.35); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes crisisGlow {
    0%, 100% { border-color: rgba(200,80,80,0.25); }
    50%       { border-color: rgba(200,80,80,0.5); }
  }
  @keyframes moodPing {
    0%   { transform: scale(1); box-shadow: 0 0 0 0 rgba(45,90,61,0.5); }
    70%  { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(45,90,61,0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(45,90,61,0); }
  }
  @keyframes grain {
    0%, 100% { transform: translate(0,0); }
    10%  { transform: translate(-2%,-2%); }
    30%  { transform: translate(2%,1%); }
    50%  { transform: translate(-1%,2%); }
    70%  { transform: translate(1%,-1%); }
    90%  { transform: translate(-2%,2%); }
  }
  @keyframes navGlow {
    0%, 100% { text-shadow: 0 0 8px rgba(60,180,90,0.3); }
    50%       { text-shadow: 0 0 16px rgba(60,180,90,0.6); }
  }
  @keyframes sidebarReveal {
    from { opacity: 0; transform: translateX(-20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes pageReveal {
    from { opacity: 0; transform: translateX(18px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes chartBar {
    from { transform: scaleY(0); }
    to   { transform: scaleY(1); }
  }
  @keyframes ringExpand {
    0%   { transform: scale(1); opacity: 0.7; }
    100% { transform: scale(2.5); opacity: 0; }
  }
  @keyframes typewriter {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// ── Inject CSS ─────────────────────────────────────────────────────────────────
const StyleTag = () => {
  useEffect(() => {
    const tag = document.createElement("style");
    tag.textContent = GLOBAL_CSS;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);
  return null;
};

// ─── SVG ASSETS ───────────────────────────────────────────────────────────────

// Realistic golden cat SVG
const CatSVG = ({ style }) => (
  <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" style={style}>
    {/* Body */}
    <ellipse cx="100" cy="108" rx="52" ry="38" fill="#c8922a" />
    <ellipse cx="100" cy="108" rx="52" ry="38" fill="url(#bodyGrad)" />
    {/* Belly */}
    <ellipse cx="100" cy="116" rx="28" ry="22" fill="#e8b84a" opacity="0.6" />
    {/* Head */}
    <ellipse cx="100" cy="70" rx="35" ry="32" fill="#d4982e" />
    <ellipse cx="100" cy="70" rx="35" ry="32" fill="url(#headGrad)" />
    {/* Ears */}
    <polygon points="72,46 62,22 84,38" fill="#c8922a" />
    <polygon points="128,46 138,22 116,38" fill="#c8922a" />
    <polygon points="74,44 66,27 82,38" fill="#e8a8b0" opacity="0.7" />
    <polygon points="126,44 134,27 118,38" fill="#e8a8b0" opacity="0.7" />
    {/* Eyes */}
    <ellipse cx="88" cy="68" rx="7" ry="8" fill="#1a1a0a" />
    <ellipse cx="112" cy="68" rx="7" ry="8" fill="#1a1a0a" />
    <ellipse cx="88" cy="68" rx="3" ry="6" fill="#0a0a04" />
    <ellipse cx="112" cy="68" rx="3" ry="6" fill="#0a0a04" />
    <circle cx="90" cy="66" r="2" fill="white" opacity="0.8" />
    <circle cx="114" cy="66" r="2" fill="white" opacity="0.8" />
    {/* Nose */}
    <ellipse cx="100" cy="80" rx="4" ry="2.5" fill="#e06080" />
    {/* Mouth */}
    <path d="M97 82.5 Q100 86 103 82.5" stroke="#c04060" strokeWidth="1" fill="none" />
    {/* Whiskers */}
    <line x1="60" y1="78" x2="92" y2="82" stroke="#f0e8d0" strokeWidth="0.8" opacity="0.7" />
    <line x1="60" y1="82" x2="92" y2="83" stroke="#f0e8d0" strokeWidth="0.8" opacity="0.7" />
    <line x1="108" y1="82" x2="140" y2="78" stroke="#f0e8d0" strokeWidth="0.8" opacity="0.7" />
    <line x1="108" y1="83" x2="140" y2="82" stroke="#f0e8d0" strokeWidth="0.8" opacity="0.7" />
    {/* Paws over edge */}
    <ellipse cx="78" cy="140" rx="14" ry="9" fill="#c8922a" />
    <ellipse cx="122" cy="140" rx="14" ry="9" fill="#c8922a" />
    <ellipse cx="78" cy="141" rx="10" ry="6" fill="#d4a030" />
    <ellipse cx="122" cy="141" rx="10" ry="6" fill="#d4a030" />
    {/* Toe lines */}
    <line x1="73" y1="143" x2="73" y2="147" stroke="#b07820" strokeWidth="0.8" />
    <line x1="78" y1="144" x2="78" y2="148" stroke="#b07820" strokeWidth="0.8" />
    <line x1="83" y1="143" x2="83" y2="147" stroke="#b07820" strokeWidth="0.8" />
    <line x1="117" y1="143" x2="117" y2="147" stroke="#b07820" strokeWidth="0.8" />
    <line x1="122" y1="144" x2="122" y2="148" stroke="#b07820" strokeWidth="0.8" />
    <line x1="127" y1="143" x2="127" y2="147" stroke="#b07820" strokeWidth="0.8" />
    {/* Tail */}
    <g style={{ transformOrigin: "145px 115px", animation: "tailSway 3.2s ease-in-out infinite" }}>
      <path d="M145 115 Q175 105 185 130 Q190 148 175 152 Q165 155 160 145 Q155 132 165 128 Q172 125 170 135"
        stroke="#c8922a" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M145 115 Q175 105 185 130 Q190 148 175 152 Q165 155 160 145 Q155 132 165 128 Q172 125 170 135"
        stroke="#e0aa40" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.5" />
    </g>
    {/* Fur texture overlay */}
    <ellipse cx="100" cy="80" rx="35" ry="32" fill="url(#furTex)" opacity="0.15" />
    {/* Shadow */}
    <ellipse cx="100" cy="148" rx="50" ry="8" fill="rgba(0,0,0,0.35)" />
    <defs>
      <radialGradient id="bodyGrad" cx="40%" cy="35%">
        <stop offset="0%" stopColor="#e8b840" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#a07020" stopOpacity="0.4" />
      </radialGradient>
      <radialGradient id="headGrad" cx="35%" cy="30%">
        <stop offset="0%" stopColor="#f0c850" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#a07820" stopOpacity="0.3" />
      </radialGradient>
      <pattern id="furTex" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M0 4 Q4 0 8 4 Q4 8 0 4" stroke="#80601a" strokeWidth="0.5" fill="none" opacity="0.4" />
      </pattern>
    </defs>
  </svg>
);

// Leaf SVG variations
const LEAF_PATHS = [
  "M10,0 Q20,5 18,15 Q16,25 10,28 Q4,25 2,15 Q0,5 10,0Z",
  "M8,0 Q20,8 16,18 Q12,28 8,30 Q2,22 0,14 Q-2,6 8,0Z",
  "M12,0 Q22,6 20,16 Q18,26 12,30 Q5,26 3,16 Q1,6 12,0Z",
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

// Forest background layer
const ForestBackground = () => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 0,
    background: `
      radial-gradient(ellipse at 20% 100%, rgba(10,40,10,0.9) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 100%, rgba(5,25,5,0.95) 0%, transparent 55%),
      radial-gradient(ellipse at 50% 60%, rgba(15,30,15,0.5) 0%, transparent 70%),
      linear-gradient(180deg, #040a04 0%, #071207 15%, #0d1f0d 35%, #081508 60%, #050f05 80%, #020802 100%)
    `,
  }}>
    {/* Tree silhouettes */}
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMax slice">
      {/* Background trees */}
      {[
        { x: "8%", h: "75%", w: 55, c: "#030a03" },
        { x: "18%", h: "82%", w: 48, c: "#040c04" },
        { x: "28%", h: "70%", w: 60, c: "#030903" },
        { x: "38%", h: "88%", w: 45, c: "#050e05" },
        { x: "50%", h: "76%", w: 52, c: "#040b04" },
        { x: "60%", h: "84%", w: 58, c: "#030903" },
        { x: "70%", h: "72%", w: 50, c: "#050d05" },
        { x: "80%", h: "80%", w: 46, c: "#040b04" },
        { x: "90%", h: "78%", w: 54, c: "#030a03" },
      ].map((t, i) => (
        <g key={i}>
          <rect x={`calc(${t.x} - ${t.w / 2}px)`} y={`calc(100% - ${t.h})`} width={t.w} height={t.h} fill={t.c} rx="4" />
          {/* Branches */}
          <ellipse cx={t.x} cy={`calc(100% - ${t.h})`} rx={t.w * 1.4} ry={t.w * 0.9} fill={t.c} />
          <ellipse cx={t.x} cy={`calc(100% - ${t.h} + 30px)`} rx={t.w * 1.7} ry={t.w * 0.8} fill={t.c} />
          <ellipse cx={t.x} cy={`calc(100% - ${t.h} + 65px)`} rx={t.w * 2.0} ry={t.w * 0.7} fill={t.c} />
        </g>
      ))}
      {/* Ground */}
      <ellipse cx="50%" cy="100%" rx="55%" ry="12%" fill="#020702" />
      {/* Moon glow */}
      <radialGradient id="moonGlow" cx="50%" cy="20%">
        <stop offset="0%" stopColor="rgba(180,220,160,0.12)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
      </radialGradient>
      <ellipse cx="50%" cy="0" rx="40%" ry="50%" fill="url(#moonGlow)" />
    </svg>
    {/* Overlay gradient */}
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(to bottom, rgba(2,6,2,0.3) 0%, transparent 30%, transparent 60%, rgba(2,6,2,0.7) 100%)",
    }} />
    {/* Vignette */}
    <div style={{
      position: "absolute", inset: 0,
      background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%)",
    }} />
    {/* Grain */}
    <div style={{
      position: "absolute", inset: "-50%",
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
      opacity: 0.03,
      animation: "grain 0.8s steps(1) infinite",
    }} />
  </div>
);

// Fog layers
const FogLayer = () => (
  <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}>
    {[
      { anim: "fogDrift1 22s ease-in-out infinite", top: "55%", h: "35%", blur: "40px", opacity: 0.22 },
      { anim: "fogDrift2 30s ease-in-out infinite", top: "65%", h: "30%", blur: "55px", opacity: 0.18 },
      { anim: "fogDrift3 38s ease-in-out infinite", top: "70%", h: "25%", blur: "35px", opacity: 0.14 },
      { anim: "fogDrift4 26s ease-in-out infinite", top: "45%", h: "40%", blur: "60px", opacity: 0.1 },
      { anim: "fogDrift1 45s ease-in-out infinite reverse", top: "75%", h: "20%", blur: "30px", opacity: 0.16 },
    ].map((f, i) => (
      <div key={i} style={{
        position: "absolute", left: "-15%", right: "-15%",
        top: f.top, height: f.h,
        background: "radial-gradient(ellipse at center, rgba(180,220,180,0.12) 0%, rgba(120,180,120,0.04) 60%, transparent 100%)",
        filter: `blur(${f.blur})`,
        animation: f.anim,
        willChange: "transform, opacity",
      }} />
    ))}
    {/* Ground fog */}
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, height: "20%",
      background: "linear-gradient(to top, rgba(100,160,100,0.08) 0%, transparent 100%)",
      filter: "blur(20px)",
      animation: "fogDrift2 20s ease-in-out infinite",
    }} />
  </div>
);

// Falling leaves
const LeavesLayer = () => {
  const leaves = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: 8 + Math.random() * 14,
    drift: `${(Math.random() - 0.5) * 180}px`,
    rot: `${(Math.random() - 0.5) * 720}deg`,
    dur: `${8 + Math.random() * 14}s`,
    delay: `${-Math.random() * 16}s`,
    opacity: 0.25 + Math.random() * 0.45,
    path: LEAF_PATHS[Math.floor(Math.random() * LEAF_PATHS.length)],
    color: ["#3d5c28", "#4a6a30", "#5c7040", "#8a6a28", "#6b5020", "#2d4a20"][Math.floor(Math.random() * 6)],
  }));

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none", overflow: "hidden" }}>
      {leaves.map(l => (
        <div key={l.id} style={{
          position: "absolute",
          left: l.left, top: "-40px",
          "--drift": l.drift,
          "--rot": l.rot,
          animation: `leafFall ${l.dur} linear ${l.delay} infinite`,
          willChange: "transform, opacity",
        }}>
          <svg width={l.size} height={l.size * 1.3} viewBox="0 0 22 32" style={{ opacity: l.opacity }}>
            <path d={l.path} fill={l.color} />
            <path d="M10,28 Q10,14 10,0" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" fill="none" />
          </svg>
        </div>
      ))}
    </div>
  );
};

// Cat component
const Cat = () => (
  <div style={{
    position: "absolute",
    top: "-72px",
    right: "18px",
    width: "90px",
    zIndex: 10,
    filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.6)) drop-shadow(0 2px 6px rgba(180,140,40,0.15))",
    animation: "breathe 4s ease-in-out infinite",
    cursor: "default",
  }}>
    <CatSVG style={{ width: "100%", height: "auto" }} />
  </div>
);

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    id: "home", label: "Home",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    id: "journal", label: "Journal",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16v16H4zM8 4v16M12 8h4M12 12h4M12 16h4" />
      </svg>
    ),
  },
  {
    id: "mood", label: "Mood",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M8.5 14s1 2 3.5 2 3.5-2 3.5-2" />
        <circle cx="9" cy="10" r="1" fill="currentColor" />
        <circle cx="15" cy="10" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "profile", label: "Profile",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

const Sidebar = ({ page, setPage }) => (
  <div style={{
    position: "fixed", left: 0, top: 0, bottom: 0,
    width: "var(--sidebar-w)",
    zIndex: 100,
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", gap: "8px",
    background: "linear-gradient(to right, rgba(4,10,4,0.85), rgba(8,16,8,0.6))",
    borderRight: "1px solid rgba(40,80,40,0.12)",
    backdropFilter: "blur(12px)",
    animation: "sidebarReveal 0.8s ease-out",
  }}>
    {/* Logo mark */}
    <div style={{
      position: "absolute", top: "28px",
      width: "32px", height: "32px",
    }}>
      <svg viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" stroke="rgba(60,160,80,0.3)" strokeWidth="1" />
        <path d="M16 4 Q24 12 16 20 Q8 28 16 28 Q24 28 16 20" stroke="rgba(80,180,100,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle cx="16" cy="16" r="3" fill="rgba(60,140,70,0.4)" />
      </svg>
    </div>

    {NAV_ITEMS.map((item, i) => {
      const active = page === item.id;
      return (
        <button
          key={item.id}
          onClick={() => setPage(item.id)}
          title={item.label}
          style={{
            width: "44px", height: "44px",
            background: active
              ? "rgba(45,90,61,0.3)"
              : "transparent",
            border: active
              ? "1px solid rgba(60,120,70,0.4)"
              : "1px solid transparent",
            borderRadius: "12px",
            color: active ? "rgba(120,220,140,0.9)" : "rgba(120,160,120,0.45)",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "10px",
            transition: "all 0.3s ease",
            position: "relative",
            animation: `sidebarReveal 0.8s ease-out ${0.1 + i * 0.08}s both`,
          }}
          onMouseEnter={e => {
            if (!active) {
              e.currentTarget.style.color = "rgba(120,220,140,0.7)";
              e.currentTarget.style.background = "rgba(45,90,61,0.15)";
              e.currentTarget.style.border = "1px solid rgba(60,120,70,0.2)";
              e.currentTarget.style.boxShadow = "0 0 16px rgba(45,90,61,0.3)";
            }
          }}
          onMouseLeave={e => {
            if (!active) {
              e.currentTarget.style.color = "rgba(120,160,120,0.45)";
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.border = "1px solid transparent";
              e.currentTarget.style.boxShadow = "none";
            }
          }}
        >
          <div style={{ width: "22px", height: "22px" }}>{item.icon}</div>
          {active && (
            <div style={{
              position: "absolute", right: "-1px",
              width: "2px", height: "28px",
              background: "linear-gradient(to bottom, transparent, rgba(80,200,100,0.8), transparent)",
              borderRadius: "1px",
            }} />
          )}
        </button>
      );
    })}

    {/* Bottom decoration */}
    <div style={{
      position: "absolute", bottom: "24px",
      width: "1px", height: "40px",
      background: "linear-gradient(to bottom, rgba(40,80,40,0.4), transparent)",
    }} />
  </div>
);

// ─── PAGES ────────────────────────────────────────────────────────────────────

// HOME PAGE
const HomePage = () => {
  const [input, setInput] = useState("");
  const [emotion, setEmotion] = useState("");
  const [message, setMessage] = useState("");
  const [resources, setResources] = useState(null);
  const [loading, setLoading] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showBackendResources, setShowBackendResources] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const textRef = useRef(null);

  // ── Emotion detection — ported 1-to-1 from Python backend logic ─────────────
  const detectEmotion = (text) => {
    if (!text || !text.trim()) return "Neutral";
    const tl = text.toLowerCase();

    // ── 1. CRISIS ────────────────────────────────────────────────────────────
    const crisisPhrases = [
      "i want to die", "i wanna die", "want to die",
      "i want to be dead", "wish i was dead", "better off dead",
      "i am going to kill myself", "kill myself", "killing myself",
      "end my life", "end it all", "take my life", "take my own life",
      "suicide", "suicidal",
      "no reason to live", "don't want to live", "dont want to live",
      "not want to live", "can't go on", "cant go on",
      "can't do this anymore", "cant do this anymore",
      "self harm", "self-harm", "hurt myself",
      "cutting myself", "cut myself",
      "no point in living", "no purpose in life", "life is pointless",
      "nothing to live for", "disappear forever",
      "everyone would be better without me",
      "i should not be alive", "i don't deserve to live",
    ];
    if (crisisPhrases.some(p => tl.includes(p))) return "Crisis";

    // ── 2. STRESSED ──────────────────────────────────────────────────────────
    const stressKeywords = [
      "stressed", "stress", "stressful",
      "tensed", "tense", "tension",
      "overwhelmed", "overwhelming",
      "burnout", "burnt out", "burned out",
      "exhausted", "exhausting", "drained",
      "overloaded", "overworked",
      "deadline", "deadlines",
      "too much to do", "so much to do", "a lot to do",
      "too much work", "so much work",
      "too much on my plate", "piled up",
      "no time", "running out of time", "out of time",
      "behind on", "falling behind", "way behind",
      "pressure", "under pressure",
      "can't cope", "cant cope", "can't handle", "cant handle",
      "can't keep up", "cant keep up",
      "tired", "so tired", "very tired",
      "fatigued", "fatigue",
      "drained", "wiped out",
      "breaking down", "break down",
      "falling apart", "losing it",
      "at my limit", "at my wit",
      "drowning in", "buried in work",
      "frustrated", "frustrating", "frustration",
      "irritated", "irritating", "agitated",
      "fed up", "sick of this", "sick and tired",
      "can't take it", "cant take it",
      "everything is too much",
    ];
    if (stressKeywords.some(k => tl.includes(k))) return "Stressed";

    // ── 3. ANXIOUS ───────────────────────────────────────────────────────────
    const anxietyKeywords = [
      "anxious", "anxiety", "anxiousness",
      "nervous", "nervousness",
      "panic", "panicking", "panic attack",
      "scared", "scary", "terrified",
      "fear", "fearful", "afraid",
      "worried", "worrying", "worry", "worries",
      "restless", "restlessness",
      "on edge", "uneasy", "unease",
      "heart racing", "racing heart", "palpitations",
      "can't breathe", "cant breathe", "shortness of breath",
      "overthinking", "over thinking",
      "what if", "what if i", "spiraling",
      "dread", "dreading", "impending",
      "freaking out", "freak out",
      "something bad will happen", "going to happen",
    ];
    if (anxietyKeywords.some(k => tl.includes(k))) return "Anxious";

    // ── 4. POLARITY FALLBACK (TextBlob approximation) ────────────────────────
    // Lightweight JS polarity via positive/negative word lists
    const positiveWords = [
      "good","great","happy","joy","love","wonderful","amazing","fantastic",
      "excellent","awesome","beautiful","glad","excited","grateful","blessed",
      "cheerful","delighted","pleased","thankful","hopeful","positive","smile",
      "laugh","fun","enjoy","nice","better","best","perfect","brilliant",
    ];
    const negativeWords = [
      "bad","sad","awful","terrible","horrible","hate","angry","upset","unhappy",
      "miserable","depressed","lonely","lost","empty","hurt","pain","crying",
      "broken","numb","helpless","hopeless","worthless","useless","dark","gloomy",
      "disappointed","devastated","heartbroken","grief","sorrow","suffer","regret",
    ];
    const words = tl.split(/\W+/).filter(Boolean);
    let posCount = 0, negCount = 0;
    words.forEach(w => {
      if (positiveWords.includes(w)) posCount++;
      if (negativeWords.includes(w)) negCount++;
    });
    const total = words.length || 1;
    const polarity = (posCount - negCount) / total;
    const subjectivity = (posCount + negCount) / total;

    if (polarity > 0.3) return "Happy";
    if (polarity < -0.3) return "Sad";
    if (polarity < -0.1 && subjectivity > 0.5) return "Stressed";
    return "Neutral";
  };

  const checkCrisis = (text) => detectEmotion(text) === "Crisis";

  // Local fallback messages when backend is unavailable
  const getLocalMessage = (emo) => {
    switch (emo) {
      case "Crisis":   return "You're not alone — please reach out to someone you trust or a crisis line. Your life has value.";
      case "Stressed": return "It sounds like you're carrying a lot right now. Take a slow breath — one thing at a time.";
      case "Anxious":  return "Anxiety can feel overwhelming. Try to ground yourself: notice 5 things around you right now.";
      case "Sad":      return "It's okay to feel sad. Let yourself feel it — these moments pass, and you don't have to face them alone.";
      case "Happy":    return "It's wonderful to hear you're feeling good. Hold onto that lightness.";
      default:         return "I hear you. This space is yours — take your time.";
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setEmotion("");
    setMessage("");
    setResources(null);
    setShowBackendResources(false);

    // Run local emotion detection first (same logic as Python backend)
    const detectedEmotion = detectEmotion(input);
    setCrisis(detectedEmotion === "Crisis");

    try {
      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      if (!res.ok) throw new Error("bad_response");
      const data = await res.json();
      // Prefer backend values if returned, otherwise fall back to local detection
      setEmotion(data.emotion || detectedEmotion);
      setMessage(data.message || getLocalMessage(detectedEmotion));
      setResources(data.resources || null);
    } catch {
      // Backend unreachable — use local detection silently, no error shown
      setEmotion(detectedEmotion);
      setMessage(getLocalMessage(detectedEmotion));
      setResources(null);
    }
    setLoading(false);
  };

  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "0 48px",
      animation: "pageReveal 0.6s ease-out",
    }}>
      {/* Heading */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(2rem, 4vw, 3.2rem)",
          fontWeight: 300,
          fontStyle: "italic",
          color: "rgba(210,235,210,0.9)",
          letterSpacing: "0.02em",
          lineHeight: 1.2,
          textShadow: "0 2px 40px rgba(60,160,80,0.15)",
          marginBottom: "14px",
          animation: "fadeIn 1s ease-out 0.2s both",
        }}>
          Hey… how are you feeling today?
        </h1>
        <p style={{
          fontFamily: "'Raleway', sans-serif",
          fontSize: "0.95rem",
          fontWeight: 200,
          color: "var(--text-secondary)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          animation: "fadeIn 1s ease-out 0.45s both",
        }}>
          You can share anything. This space is yours.
        </p>
      </div>

      {/* Input area */}
      <div style={{
        position: "relative",
        width: "100%", maxWidth: "620px",
        animation: "fadeIn 1s ease-out 0.65s both",
      }}>
        {/* Cat sits here */}
        <Cat />

        <div style={{
          position: "relative",
          background: "rgba(8,18,8,0.55)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(50,100,55,0.22)",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: `
            0 8px 48px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(80,160,90,0.08),
            0 0 60px rgba(20,60,25,0.15)
          `,
        }}>
          <textarea
            ref={textRef}
            value={input}
            onChange={e => { setInput(e.target.value); setCharCount(e.target.value.length); }}
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
            placeholder="Tell me what's on your mind…"
            style={{
              width: "100%",
              minHeight: "160px",
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              padding: "28px 28px 16px",
              paddingRight: "100px",
              fontFamily: "'Raleway', sans-serif",
              fontSize: "1rem",
              fontWeight: 300,
              color: "rgba(200,230,200,0.88)",
              lineHeight: 1.8,
              letterSpacing: "0.02em",
            }}
            onFocus={e => {
              e.target.parentElement.parentElement.style.borderColor = "rgba(60,140,70,0.4)";
              e.target.parentElement.parentElement.style.boxShadow = "0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(80,160,90,0.08), 0 0 80px rgba(30,90,40,0.25)";
            }}
            onBlur={e => {
              e.target.parentElement.parentElement.style.borderColor = "rgba(50,100,55,0.22)";
              e.target.parentElement.parentElement.style.boxShadow = "0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(80,160,90,0.08), 0 0 60px rgba(20,60,25,0.15)";
            }}
          />
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 20px 18px",
            borderTop: "1px solid rgba(40,80,40,0.12)",
          }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-dim)", letterSpacing: "0.05em" }}>
              {charCount > 0 ? `${charCount} chars · ⌘↵ to send` : "⌘↵ to send"}
            </span>
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || loading}
              style={{
                background: loading
                  ? "rgba(30,60,35,0.3)"
                  : "linear-gradient(135deg, rgba(40,90,50,0.7), rgba(25,65,35,0.8))",
                border: "1px solid rgba(60,130,70,0.35)",
                borderRadius: "10px",
                color: loading ? "var(--text-dim)" : "rgba(160,230,170,0.9)",
                padding: "9px 22px",
                fontSize: "0.82rem",
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 400,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: loading || !input.trim() ? "default" : "pointer",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => {
                if (!loading && input.trim()) {
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(40,120,55,0.5)";
                  e.currentTarget.style.borderColor = "rgba(80,160,90,0.5)";
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "rgba(60,130,70,0.35)";
              }}
            >
              {loading ? "Listening…" : "Understand Me"}
            </button>
          </div>
        </div>
      </div>

      {/* Crisis alert */}
      {crisis && (
        <div style={{
          marginTop: "24px",
          maxWidth: "620px", width: "100%",
          background: "rgba(120,20,20,0.12)",
          border: "1px solid rgba(200,80,80,0.25)",
          borderRadius: "12px",
          padding: "16px 24px",
          animation: "fadeIn 0.6s ease-out, crisisGlow 3s ease-in-out infinite",
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.1rem",
            fontStyle: "italic",
            color: "rgba(230,160,160,0.85)",
            letterSpacing: "0.03em",
            marginBottom: "10px",
          }}>
            You're not alone. Support is always available.
          </p>
          <button
            onClick={() => setShowResources(!showResources)}
            style={{
              background: "none", border: "none",
              color: "rgba(200,140,140,0.6)",
              fontSize: "0.8rem", letterSpacing: "0.1em",
              textDecoration: "underline", cursor: "pointer",
              fontFamily: "'Raleway', sans-serif",
            }}
          >
            {showResources ? "Hide resources" : "Need support? View resources"}
          </button>
          {showResources && (
            <div style={{
              marginTop: "14px",
              animation: "fadeIn 0.4s ease-out",
              display: "flex", flexDirection: "column", gap: "6px",
            }}>
              {[
                ["988 Suicide & Crisis Lifeline", "Call or text 988"],
                ["Crisis Text Line", "Text HOME to 741741"],
                ["International Association for Suicide Prevention", "https://www.iasp.info/resources/Crisis_Centres/"],
              ].map(([name, info]) => (
                <p key={name} style={{ fontSize: "0.82rem", color: "rgba(200,160,160,0.65)", letterSpacing: "0.03em" }}>
                  <strong style={{ color: "rgba(220,170,170,0.8)" }}>{name}:</strong> {info}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Response */}
      {message && !loading && (
        <div style={{
          marginTop: "32px",
          maxWidth: "580px", width: "100%",
          textAlign: "center",
          animation: "fadeIn 0.8s ease-out",
          padding: "0 12px",
        }}>
          <div style={{
            width: "1px", height: "32px",
            background: "linear-gradient(to bottom, transparent, rgba(60,140,70,0.4), transparent)",
            margin: "0 auto 24px",
          }} />
          {emotion && (
            <p style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: "0.72rem",
              fontWeight: 400,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(100,200,120,0.65)",
              marginBottom: "12px",
              animation: "fadeIn 0.6s ease-out",
            }}>
              You seem {emotion}
            </p>
          )}
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.2rem",
            fontStyle: "italic",
            fontWeight: 300,
            color: "rgba(190,225,195,0.85)",
            lineHeight: 1.9,
            letterSpacing: "0.025em",
            textShadow: "0 2px 20px rgba(30,80,35,0.2)",
          }}>
            {message}
          </p>
          {resources && (
            <div style={{ marginTop: "20px", animation: "fadeIn 0.6s ease-out 0.2s both" }}>
              <button
                onClick={() => setShowBackendResources(r => !r)}
                style={{
                  background: "none", border: "none",
                  color: "rgba(120,200,135,0.6)",
                  fontSize: "0.8rem", letterSpacing: "0.1em",
                  textDecoration: "underline", cursor: "pointer",
                  fontFamily: "'Raleway', sans-serif",
                }}
              >
                {showBackendResources ? "Hide resources" : "🌿 View Resources"}
              </button>
              {showBackendResources && (
                <div style={{
                  marginTop: "16px",
                  display: "flex", flexDirection: "column", gap: "8px",
                  animation: "fadeIn 0.4s ease-out",
                }}>
                  {resources.music && (
                    <a href={resources.music} target="_blank" rel="noreferrer" style={{
                      fontSize: "0.82rem", color: "rgba(160,220,170,0.7)",
                      letterSpacing: "0.04em", textDecoration: "none",
                    }}>
                      🎵 <span style={{ textDecoration: "underline" }}>Music for your mood</span>
                    </a>
                  )}
                  {resources.video && (
                    <a href={resources.video} target="_blank" rel="noreferrer" style={{
                      fontSize: "0.82rem", color: "rgba(160,220,170,0.7)",
                      letterSpacing: "0.04em", textDecoration: "none",
                    }}>
                      🎥 <span style={{ textDecoration: "underline" }}>Guided video</span>
                    </a>
                  )}
                  {resources.apps && (
                    <a href={resources.apps} target="_blank" rel="noreferrer" style={{
                      fontSize: "0.82rem", color: "rgba(160,220,170,0.7)",
                      letterSpacing: "0.04em", textDecoration: "none",
                    }}>
                      📱 <span style={{ textDecoration: "underline" }}>Helpful app</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {loading && (
        <div style={{
          marginTop: "40px",
          display: "flex", gap: "8px", alignItems: "center",
          animation: "fadeIn 0.4s ease-out",
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: "5px", height: "5px",
              borderRadius: "50%",
              background: "rgba(80,180,90,0.5)",
              animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
      )}
    </div>
  );
};

// ── localStorage helpers ─────────────────────────────────────────────────────
const saveToLocalStorage = (key, data) => {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
};
const getFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};

// JOURNAL PAGE
const JournalPage = () => {
  const [entry, setEntry] = useState("");
  const [saved, setSaved] = useState(false);
  const [entries, setEntries] = useState([]);

  // Load persisted entries on mount
  useEffect(() => {
    const saved = getFromLocalStorage("mindcare_journal_entries");
    setEntries(saved);
  }, []);

  const save = () => {
    if (!entry.trim()) return;
    const isoDate = new Date().toISOString();
    const newEntry = {
      id: Date.now(),
      text: entry,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      preview: entry.slice(0, 80) + (entry.length > 80 ? "…" : ""),
      isoDate,
    };
    // Prepend new entry, keep last 50, persist to localStorage
    const updated = [newEntry, ...entries].slice(0, 50);
    setEntries(updated);
    saveToLocalStorage("mindcare_journal_entries", updated);
    setSaved(true);
    setEntry("");
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div style={{
      height: "100%", padding: "48px 56px",
      display: "flex", flexDirection: "column",
      animation: "pageReveal 0.6s ease-out",
      overflow: "hidden",
    }}>
      <div style={{ marginBottom: "36px", animation: "fadeIn 0.8s ease-out 0.1s both" }}>
        <p style={{ fontSize: "0.72rem", letterSpacing: "0.25em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: "10px" }}>
          Your Inner Forest
        </p>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "2.2rem", fontWeight: 300, fontStyle: "italic",
          color: "rgba(200,230,205,0.9)",
          letterSpacing: "0.02em",
        }}>
          Journal
        </h2>
      </div>

      <div style={{
        flex: 1, display: "flex", gap: "32px",
        overflow: "hidden",
        animation: "fadeIn 0.8s ease-out 0.25s both",
      }}>
        {/* Write area */}
        <div style={{ flex: 1.4, display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{
            flex: 1, position: "relative",
            background: "rgba(6,14,6,0.5)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(45,90,50,0.18)",
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow: "0 8px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(60,140,70,0.06)",
          }}>
            {/* Paper lines */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              backgroundImage: "repeating-linear-gradient(transparent, transparent 37px, rgba(40,80,45,0.06) 37px, rgba(40,80,45,0.06) 38px)",
              backgroundPosition: "0 56px",
            }} />
            <textarea
              value={entry}
              onChange={e => setEntry(e.target.value)}
              placeholder="Write your thoughts here…&#10;&#10;Let it pour out. This is your space."
              style={{
                position: "absolute", inset: 0,
                background: "transparent",
                border: "none", outline: "none",
                resize: "none",
                padding: "32px 36px",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.12rem",
                fontWeight: 300,
                color: "rgba(195,225,200,0.85)",
                lineHeight: "38px",
                letterSpacing: "0.02em",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-dim)", letterSpacing: "0.08em" }}>
              {entry.length} characters · {entry.split(/\s+/).filter(Boolean).length} words
            </span>
            <button
              onClick={save}
              style={{
                background: saved
                  ? "rgba(30,80,40,0.5)"
                  : "rgba(25,55,30,0.6)",
                border: `1px solid ${saved ? "rgba(80,180,90,0.5)" : "rgba(50,110,60,0.3)"}`,
                borderRadius: "10px",
                color: saved ? "rgba(120,230,140,0.9)" : "rgba(140,210,150,0.8)",
                padding: "10px 28px",
                fontSize: "0.82rem",
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 400,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 20px rgba(40,120,55,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
            >
              {saved ? "✦ Saved" : "Save Entry"}
            </button>
          </div>
        </div>

        {/* Past entries */}
        <div style={{ flex: 0.7, display: "flex", flexDirection: "column", gap: "12px", overflow: "hidden" }}>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.2em", color: "var(--text-dim)", textTransform: "uppercase" }}>
            Recent Reflections
          </p>
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
            {entries.length === 0 ? (
              <div style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column", gap: "12px",
              }}>
                <div style={{ opacity: 0.2 }}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d="M8 10h24M8 18h24M8 26h16" stroke="rgba(100,160,110,0.8)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-dim)", textAlign: "center", lineHeight: 1.6 }}>
                  Your journal is empty.<br />Begin writing above.
                </p>
              </div>
            ) : entries.map((e, i) => (
              <div key={e.id} style={{
                background: "rgba(8,18,8,0.45)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(40,80,45,0.15)",
                borderRadius: "12px",
                padding: "16px 18px",
                animation: `fadeIn 0.5s ease-out ${i * 0.06}s both`,
                cursor: "default",
                transition: "all 0.25s ease",
              }}
                onMouseEnter={e2 => { e2.currentTarget.style.borderColor = "rgba(60,130,70,0.3)"; e2.currentTarget.style.background = "rgba(12,24,12,0.5)"; }}
                onMouseLeave={e2 => { e2.currentTarget.style.borderColor = "rgba(40,80,45,0.15)"; e2.currentTarget.style.background = "rgba(8,18,8,0.45)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", letterSpacing: "0.06em" }}>{e.date}</span>
                  <span style={{ fontSize: "0.68rem", color: "var(--text-dim)", opacity: 0.6 }}>{e.time}</span>
                </div>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "0.95rem", fontStyle: "italic",
                  color: "rgba(180,215,185,0.7)", lineHeight: 1.6,
                }}>
                  {e.preview}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// MOOD TRACKER PAGE
const MOODS = [
  { label: "Joyful", value: 5, color: "#5a9a4a", emoji: "✦" },
  { label: "Calm", value: 4, color: "#4a8a6a", emoji: "◈" },
  { label: "Neutral", value: 3, color: "#6a7a5a", emoji: "◇" },
  { label: "Anxious", value: 2, color: "#8a7a3a", emoji: "◉" },
  { label: "Low", value: 1, color: "#6a4a4a", emoji: "◌" },
];

const SAMPLE_LOG = [
  { day: "Mon", mood: 4 }, { day: "Tue", mood: 3 }, { day: "Wed", mood: 2 },
  { day: "Thu", mood: 4 }, { day: "Fri", mood: 5 }, { day: "Sat", mood: 4 }, { day: "Sun", mood: 3 },
];

const MoodTrackerPage = () => {
  const [selected, setSelected] = useState(null);
  const [log, setLog] = useState(SAMPLE_LOG);
  const [note, setNote] = useState("");
  const [logged, setLogged] = useState(false);

  // Load persisted mood logs on mount; build chart from last 7 saved entries
  useEffect(() => {
    const saved = getFromLocalStorage("mindcare_mood_logs");
    if (saved.length > 0) {
      // Take last 7 logs and map to chart format
      const recent = saved.slice(-7);
      const chartData = recent.map(item => ({
        day: new Date(item.date).toLocaleDateString("en-US", { weekday: "short" }),
        mood: MOODS.find(m => m.label === item.emotion)?.value || 3,
      }));
      // Pad to 7 entries with neutral if fewer than 7
      while (chartData.length < 7) {
        chartData.unshift({ day: "—", mood: 3 });
      }
      setLog(chartData);
    }
  }, []);

  const logMood = () => {
    if (!selected) return;
    const isoDate = new Date().toISOString();
    const newMoodLog = { emotion: selected.label, date: isoDate, note };

    // Persist to localStorage — append and keep last 50
    const existing = getFromLocalStorage("mindcare_mood_logs");
    const updated = [...existing, newMoodLog].slice(-50);
    saveToLocalStorage("mindcare_mood_logs", updated);

    // Rebuild chart from last 7
    const recent = updated.slice(-7);
    const chartData = recent.map(item => ({
      day: new Date(item.date).toLocaleDateString("en-US", { weekday: "short" }),
      mood: MOODS.find(m => m.label === item.emotion)?.value || 3,
    }));
    while (chartData.length < 7) chartData.unshift({ day: "—", mood: 3 });
    setLog(chartData);

    setLogged(true);
    setTimeout(() => { setLogged(false); setSelected(null); setNote(""); }, 2000);
  };

  const maxH = 120;

  return (
    <div style={{
      height: "100%", padding: "48px 56px",
      display: "flex", flexDirection: "column",
      animation: "pageReveal 0.6s ease-out",
      overflow: "hidden",
    }}>
      <div style={{ marginBottom: "36px", animation: "fadeIn 0.8s ease-out 0.1s both" }}>
        <p style={{ fontSize: "0.72rem", letterSpacing: "0.25em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: "10px" }}>
          Emotional Landscape
        </p>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "2.2rem", fontWeight: 300, fontStyle: "italic",
          color: "rgba(200,230,205,0.9)", letterSpacing: "0.02em",
        }}>
          Mood Tracker
        </h2>
      </div>

      <div style={{ flex: 1, display: "flex", gap: "32px", overflow: "hidden" }}>
        {/* Left: select + note */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px", animation: "fadeIn 0.8s ease-out 0.2s both" }}>
          <div>
            <p style={{ fontSize: "0.8rem", letterSpacing: "0.12em", color: "var(--text-secondary)", marginBottom: "18px", textTransform: "uppercase" }}>
              How are you right now?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {MOODS.map(m => (
                <button
                  key={m.label}
                  onClick={() => setSelected(m)}
                  style={{
                    display: "flex", alignItems: "center", gap: "16px",
                    background: selected?.label === m.label
                      ? `rgba(${parseInt(m.color.slice(1, 3), 16)},${parseInt(m.color.slice(3, 5), 16)},${parseInt(m.color.slice(5, 7), 16)},0.18)`
                      : "rgba(8,16,8,0.35)",
                    backdropFilter: "blur(12px)",
                    border: selected?.label === m.label
                      ? `1px solid ${m.color}60`
                      : "1px solid rgba(40,70,40,0.15)",
                    borderRadius: "12px",
                    padding: "14px 20px",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    textAlign: "left",
                    width: "100%",
                    animation: selected?.label === m.label ? "moodPing 0.4s ease-out" : "none",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${m.color}40`; }}
                  onMouseLeave={e => { if (selected?.label !== m.label) e.currentTarget.style.borderColor = "rgba(40,70,40,0.15)"; }}
                >
                  <span style={{ fontSize: "1rem", color: m.color, minWidth: "20px", textAlign: "center" }}>{m.emoji}</span>
                  <span style={{
                    fontFamily: "'Raleway', sans-serif",
                    fontSize: "0.9rem", fontWeight: 300,
                    letterSpacing: "0.08em",
                    color: selected?.label === m.label ? "rgba(220,240,220,0.9)" : "rgba(160,200,165,0.65)",
                  }}>
                    {m.label}
                  </span>
                  {selected?.label === m.label && (
                    <div style={{
                      marginLeft: "auto",
                      width: "6px", height: "6px",
                      borderRadius: "50%",
                      background: m.color,
                      boxShadow: `0 0 8px ${m.color}`,
                    }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {selected && (
            <div style={{ animation: "fadeIn 0.4s ease-out" }}>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add a note (optional)…"
                style={{
                  width: "100%", height: "80px",
                  background: "rgba(6,14,6,0.4)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(40,80,45,0.2)",
                  borderRadius: "12px",
                  padding: "14px 18px",
                  color: "rgba(180,215,185,0.8)",
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.88rem", fontWeight: 300,
                  resize: "none", outline: "none",
                  lineHeight: 1.7,
                  marginBottom: "12px",
                }}
              />
              <button
                onClick={logMood}
                style={{
                  width: "100%",
                  background: logged ? "rgba(30,80,40,0.5)" : "rgba(25,60,35,0.6)",
                  border: `1px solid ${logged ? "rgba(80,180,90,0.5)" : "rgba(50,110,60,0.35)"}`,
                  borderRadius: "10px",
                  color: logged ? "rgba(130,230,145,0.9)" : "rgba(150,220,160,0.85)",
                  padding: "12px",
                  fontSize: "0.82rem",
                  fontFamily: "'Raleway', sans-serif",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 20px rgba(40,120,55,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
              >
                {logged ? "✦ Logged" : "Log This Mood"}
              </button>
            </div>
          )}
        </div>

        {/* Right: chart */}
        <div style={{ flex: 1.2, display: "flex", flexDirection: "column", gap: "24px", animation: "fadeIn 0.8s ease-out 0.35s both" }}>
          <div>
            <p style={{ fontSize: "0.8rem", letterSpacing: "0.12em", color: "var(--text-secondary)", marginBottom: "20px", textTransform: "uppercase" }}>
              This Week
            </p>
            <div style={{
              background: "rgba(6,14,6,0.45)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(40,80,45,0.15)",
              borderRadius: "18px",
              padding: "28px 24px 20px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
            }}>
              {/* Chart */}
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around", height: `${maxH + 20}px`, gap: "8px" }}>
                {log.map((d, i) => {
                  const moodData = MOODS.find(m => m.value === d.mood) || MOODS[2];
                  const h = (d.mood / 5) * maxH;
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flex: 1 }}>
                      <div style={{
                        width: "100%", height: `${h}px`,
                        background: `linear-gradient(to top, ${moodData.color}90, ${moodData.color}40)`,
                        borderRadius: "6px 6px 2px 2px",
                        border: `1px solid ${moodData.color}30`,
                        boxShadow: `0 0 12px ${moodData.color}20`,
                        transformOrigin: "bottom",
                        animation: `chartBar 0.8s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.08}s both`,
                        transition: "all 0.3s ease",
                        cursor: "default",
                        position: "relative",
                        overflow: "hidden",
                      }}>
                        <div style={{
                          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
                          background: `${moodData.color}80`,
                        }} />
                      </div>
                      <span style={{ fontSize: "0.68rem", color: "var(--text-dim)", letterSpacing: "0.05em" }}>{d.day}</span>
                    </div>
                  );
                })}
              </div>
              {/* Legend */}
              <div style={{
                display: "flex", justifyContent: "center", gap: "16px",
                marginTop: "20px", paddingTop: "16px",
                borderTop: "1px solid rgba(40,80,45,0.1)",
                flexWrap: "wrap",
              }}>
                {MOODS.map(m => (
                  <div key={m.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: m.color, opacity: 0.7 }} />
                    <span style={{ fontSize: "0.68rem", color: "var(--text-dim)", letterSpacing: "0.05em" }}>{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats — computed from real localStorage data */}
          {(() => {
            const allLogs = getFromLocalStorage("mindcare_mood_logs");
            const total = allLogs.length;

            // Streak: count consecutive days ending today that have at least one log
            const uniqueDays = [...new Set(allLogs.map(l => l.date.slice(0, 10)))].sort();
            let streak = 0;
            const today = new Date();
            for (let i = 0; i < 30; i++) {
              const d = new Date(today);
              d.setDate(today.getDate() - i);
              const ds = d.toISOString().slice(0, 10);
              if (uniqueDays.includes(ds)) streak++;
              else if (i > 0) break;
            }

            // Avg mood label this week
            const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
            const weekLogs = allLogs.filter(l => new Date(l.date) >= weekAgo);
            let avgLabel = "—";
            if (weekLogs.length > 0) {
              const avgVal = weekLogs.reduce((sum, l) => sum + (MOODS.find(m => m.label === l.emotion)?.value || 3), 0) / weekLogs.length;
              avgLabel = MOODS.reduce((prev, curr) => Math.abs(curr.value - avgVal) < Math.abs(prev.value - avgVal) ? curr : prev).label;
            }

            // Best day: day of week with highest avg mood
            let bestDay = "—";
            if (allLogs.length > 0) {
              const dayTotals = {};
              allLogs.forEach(l => {
                const day = new Date(l.date).toLocaleDateString("en-US", { weekday: "long" });
                const val = MOODS.find(m => m.label === l.emotion)?.value || 3;
                if (!dayTotals[day]) dayTotals[day] = { sum: 0, count: 0 };
                dayTotals[day].sum += val;
                dayTotals[day].count++;
              });
              bestDay = Object.entries(dayTotals).sort((a, b) => (b[1].sum / b[1].count) - (a[1].sum / a[1].count))[0]?.[0] || "—";
            }

            const stats = [
              { label: "Current Streak", value: streak ? `${streak} day${streak !== 1 ? "s" : ""}` : "0 days", sub: "of logging" },
              { label: "Avg. Mood", value: avgLabel, sub: "this week" },
              { label: "Best Day", value: bestDay, sub: "most joyful" },
              { label: "Entries", value: String(total), sub: "total logged" },
            ];
            return (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {stats.map(s => (
                  <div key={s.label} style={{
                    background: "rgba(6,14,6,0.4)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(40,80,45,0.12)",
                    borderRadius: "14px",
                    padding: "16px 18px",
                    transition: "all 0.25s ease",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(60,130,70,0.25)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(40,80,45,0.12)"; }}
                  >
                    <p style={{ fontSize: "0.68rem", letterSpacing: "0.12em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: "6px" }}>{s.label}</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 300, color: "rgba(190,225,195,0.85)", marginBottom: "2px" }}>{s.value}</p>
                    <p style={{ fontSize: "0.7rem", color: "var(--text-dim)", opacity: 0.7 }}>{s.sub}</p>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

// PROFILE PAGE
const ProfilePage = () => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Forest Wanderer");
  const [bio, setBio] = useState("Finding peace in the quiet spaces between thoughts.");

  return (
    <div style={{
      height: "100%", padding: "48px 56px",
      display: "flex", flexDirection: "column",
      animation: "pageReveal 0.6s ease-out",
      overflow: "hidden",
    }}>
      <div style={{ marginBottom: "36px", animation: "fadeIn 0.8s ease-out 0.1s both" }}>
        <p style={{ fontSize: "0.72rem", letterSpacing: "0.25em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: "10px" }}>
          Your Sanctuary
        </p>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "2.2rem", fontWeight: 300, fontStyle: "italic",
          color: "rgba(200,230,205,0.9)", letterSpacing: "0.02em",
        }}>
          Profile
        </h2>
      </div>

      <div style={{ flex: 1, display: "flex", gap: "36px", overflow: "hidden" }}>
        {/* Profile card */}
        <div style={{ flex: 1, animation: "fadeIn 0.8s ease-out 0.2s both" }}>
          <div style={{
            background: "rgba(6,14,6,0.45)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(45,90,50,0.18)",
            borderRadius: "22px",
            padding: "40px 36px",
            boxShadow: "0 8px 48px rgba(0,0,0,0.35)",
            textAlign: "center",
            marginBottom: "20px",
          }}>
            {/* Avatar */}
            <div style={{ position: "relative", display: "inline-block", marginBottom: "24px" }}>
              <div style={{
                width: "96px", height: "96px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(30,70,35,0.8), rgba(15,40,20,0.9))",
                border: "2px solid rgba(60,140,70,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto",
                boxShadow: "0 0 30px rgba(40,120,55,0.2)",
              }}>
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <circle cx="22" cy="18" r="10" stroke="rgba(100,200,120,0.5)" strokeWidth="1.5" fill="rgba(25,60,30,0.6)" />
                  <path d="M6 40c0-8.8 7.2-16 16-16s16 7.2 16 16" stroke="rgba(100,200,120,0.5)" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
              {/* Ring animation */}
              <div style={{
                position: "absolute", inset: "-8px",
                borderRadius: "50%",
                border: "1px solid rgba(60,140,70,0.2)",
                animation: "ringExpand 3s ease-out infinite",
              }} />
            </div>

            {editing ? (
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  display: "block", width: "100%",
                  background: "rgba(8,20,8,0.5)",
                  border: "1px solid rgba(50,110,60,0.3)",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  textAlign: "center",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.5rem", fontWeight: 300,
                  color: "rgba(200,230,205,0.9)",
                  outline: "none", marginBottom: "12px",
                }}
              />
            ) : (
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.7rem", fontWeight: 300,
                color: "rgba(200,230,205,0.9)",
                letterSpacing: "0.03em", marginBottom: "12px",
              }}>{name}</h3>
            )}

            <div style={{
              display: "inline-block",
              background: "rgba(30,70,35,0.3)",
              border: "1px solid rgba(50,120,60,0.2)",
              borderRadius: "20px",
              padding: "4px 16px",
              fontSize: "0.72rem",
              letterSpacing: "0.15em",
              color: "rgba(100,200,120,0.7)",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}>
              MindCare Member
            </div>

            {editing ? (
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                style={{
                  display: "block", width: "100%",
                  background: "rgba(8,20,8,0.5)",
                  border: "1px solid rgba(50,110,60,0.3)",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.9rem", fontWeight: 300,
                  color: "rgba(170,210,175,0.75)",
                  outline: "none", resize: "none",
                  lineHeight: 1.7, marginBottom: "8px",
                }}
                rows={2}
              />
            ) : (
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1rem", fontStyle: "italic",
                color: "rgba(160,200,165,0.65)",
                lineHeight: 1.8, marginBottom: "8px",
              }}>{bio}</p>
            )}

            <button
              onClick={() => setEditing(!editing)}
              style={{
                marginTop: "16px",
                background: "rgba(20,50,25,0.4)",
                border: "1px solid rgba(50,100,55,0.25)",
                borderRadius: "8px",
                color: "rgba(130,200,145,0.7)",
                padding: "8px 22px",
                fontSize: "0.75rem",
                fontFamily: "'Raleway', sans-serif",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.25s",
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 16px rgba(40,120,55,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
            >
              {editing ? "Save Profile" : "Edit Profile"}
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            {(() => {
              const journalEntries = getFromLocalStorage("mindcare_journal_entries");
              const moodLogs = getFromLocalStorage("mindcare_mood_logs");
              const allDays = new Set([
                ...journalEntries.map(e => (e.isoDate || "").slice(0, 10)),
                ...moodLogs.map(l => l.date.slice(0, 10)),
              ]);
              allDays.delete("");
              return [
                { label: "Journal Entries", val: String(journalEntries.length) },
                { label: "Days Active", val: String(allDays.size) },
                { label: "Moods Logged", val: String(moodLogs.length) },
              ];
            })().map(s => (
              <div key={s.label} style={{
                background: "rgba(6,14,6,0.4)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(40,80,45,0.12)",
                borderRadius: "14px",
                padding: "16px 12px",
                textAlign: "center",
              }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 300, color: "rgba(170,220,180,0.85)" }}>{s.val}</p>
                <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "4px" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Settings + preferences */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", animation: "fadeIn 0.8s ease-out 0.35s both" }}>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.2em", color: "var(--text-dim)", textTransform: "uppercase" }}>
            Preferences
          </p>
          {[
            { label: "Daily Reminder", desc: "Gentle nudge to check in", on: true },
            { label: "Mood Insights", desc: "Weekly emotional summary", on: true },
            { label: "Ambient Sounds", desc: "Forest sounds while journaling", on: false },
            { label: "Privacy Mode", desc: "Blur content when unfocused", on: false },
          ].map((pref, i) => {
            const [active, setActive] = useState(pref.on);
            return (
              <div key={pref.label} style={{
                background: "rgba(6,14,6,0.4)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(40,80,45,0.12)",
                borderRadius: "14px",
                padding: "18px 22px",
                display: "flex", alignItems: "center", gap: "16px",
                animation: `fadeIn 0.6s ease-out ${0.3 + i * 0.08}s both`,
                transition: "all 0.25s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(60,130,70,0.22)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(40,80,45,0.12)"; }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.88rem", color: "rgba(185,220,190,0.85)", letterSpacing: "0.04em", marginBottom: "3px" }}>{pref.label}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>{pref.desc}</p>
                </div>
                {/* Toggle */}
                <div
                  onClick={() => setActive(a => !a)}
                  style={{
                    width: "42px", height: "24px",
                    borderRadius: "12px",
                    background: active ? "rgba(40,120,55,0.6)" : "rgba(30,50,30,0.4)",
                    border: `1px solid ${active ? "rgba(60,160,80,0.4)" : "rgba(40,70,40,0.2)"}`,
                    position: "relative", cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: active ? "0 0 12px rgba(40,140,60,0.3)" : "none",
                  }}
                >
                  <div style={{
                    position: "absolute",
                    top: "3px",
                    left: active ? "20px" : "3px",
                    width: "16px", height: "16px",
                    borderRadius: "50%",
                    background: active ? "rgba(120,230,140,0.9)" : "rgba(80,110,85,0.6)",
                    transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                    boxShadow: active ? "0 0 8px rgba(100,220,120,0.5)" : "none",
                  }} />
                </div>
              </div>
            );
          })}

          <div style={{
            marginTop: "8px",
            background: "rgba(6,14,6,0.35)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(40,80,45,0.12)",
            borderRadius: "14px",
            padding: "20px 22px",
            animation: "fadeIn 0.6s ease-out 0.65s both",
          }}>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.15em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: "14px" }}>
              About MindCare AI
            </p>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "0.95rem", fontStyle: "italic",
              color: "rgba(150,195,158,0.55)", lineHeight: 1.8,
            }}>
              A quiet companion for the tender moments. MindCare AI listens without judgment, holds your thoughts with care, and walks alongside you through the forest of your inner world.
            </p>
            <div style={{
              marginTop: "16px", paddingTop: "14px",
              borderTop: "1px solid rgba(40,80,45,0.1)",
              display: "flex", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: "0.7rem", color: "var(--text-dim)", opacity: 0.6 }}>Version 1.0.0</span>
              <span style={{ fontSize: "0.7rem", color: "rgba(80,180,100,0.4)", cursor: "pointer" }}>Privacy Policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── LAYOUT ───────────────────────────────────────────────────────────────────
const Layout = ({ children }) => (
  <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
    <div style={{
      flex: 1,
      marginLeft: "var(--sidebar-w)",
      overflow: "hidden",
      position: "relative",
      zIndex: 10,
    }}>
      {children}
    </div>
  </div>
);

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function Mindcare() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "home":    return <HomePage />;
      case "journal": return <JournalPage />;
      case "mood":    return <MoodTrackerPage />;
      case "profile": return <ProfilePage />;
      default:        return <HomePage />;
    }
  };

  return (
    <>
      <StyleTag />
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <ForestBackground />
        <FogLayer />
        <LeavesLayer />
      </div>
      <Sidebar page={page} setPage={setPage} />
      <Layout>
        {renderPage()}
      </Layout>
    </>
  );
}