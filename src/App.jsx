import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0A0B0F;
  --bg2: #111318;
  --bg3: #181B22;
  --card: #1C2030;
  --card2: #232840;
  --border: #2A2F45;
  --border2: #353C58;
  --accent: #4F6EF7;
  --accent2: #7C3AED;
  --accent3: #06B6D4;
  --gold: #F59E0B;
  --red: #EF4444;
  --green: #10B981;
  --text: #F0F2FF;
  --text2: #8B93B8;
  --text3: #565E80;
  --font-head: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --r: 12px;
  --r2: 8px;
  --shadow: 0 4px 24px rgba(0,0,0,0.4);
  --shadow2: 0 2px 12px rgba(0,0,0,0.3);
}

body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }

/* SCROLLBAR */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg2); }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

/* LAYOUT */
.app { min-height: 100vh; display: flex; flex-direction: column; }

/* NAV */
.nav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(10,11,15,0.85); backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  padding: 0 2rem; height: 60px;
  display: flex; align-items: center; justify-content: space-between;
}
.nav-logo { font-family: var(--font-head); font-size: 1.35rem; font-weight: 800; display:flex; align-items:center; gap:8px; }
.nav-logo span { background: linear-gradient(135deg, var(--accent), var(--accent3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.nav-badge { font-size:0.6rem; background:var(--accent); color:#fff; padding:2px 6px; border-radius:20px; font-weight:700; letter-spacing:0.05em; }
.nav-links { display: flex; gap: 0.5rem; align-items: center; }
.btn { 
  font-family: var(--font-body); font-size: 0.875rem; font-weight: 500; cursor: pointer;
  border: none; border-radius: var(--r2); padding: 0.5rem 1.1rem;
  transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px;
}
.btn-ghost { background: transparent; color: var(--text2); }
.btn-ghost:hover { background: var(--bg3); color: var(--text); }
.btn-primary { background: var(--accent); color: #fff; }
.btn-primary:hover { background: #3D5AE0; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(79,110,247,0.4); }
.btn-outline { background: transparent; color: var(--accent); border: 1px solid var(--accent); }
.btn-outline:hover { background: var(--accent); color: #fff; }
.btn-danger { background: var(--red); color: #fff; }
.btn-danger:hover { background: #DC2626; }
.btn-success { background: var(--green); color: #fff; }
.btn-success:hover { background: #059669; }
.btn-gold { background: var(--gold); color: #000; font-weight:600; }
.btn-sm { padding: 0.35rem 0.75rem; font-size: 0.8rem; }
.btn-lg { padding: 0.75rem 1.75rem; font-size: 1rem; font-weight:600; }
.btn:disabled { opacity:0.5; cursor:not-allowed; transform:none !important; }

/* HERO */
.hero {
  padding: 5rem 2rem 4rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(79,110,247,0.15) 0%, transparent 70%);
  pointer-events: none;
}
.hero-eyebrow { 
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--accent3); border: 1px solid rgba(6,182,212,0.3); border-radius: 20px;
  padding: 4px 14px; margin-bottom: 1.5rem;
}
.hero h1 { 
  font-family: var(--font-head); font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 800;
  line-height: 1.1; margin-bottom: 1.25rem;
}
.hero h1 .hi { color: var(--text); }
.hero h1 .lo { 
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent3) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.hero p { font-size: 1.1rem; color: var(--text2); max-width: 560px; margin: 0 auto 2.5rem; line-height: 1.7; }
.hero-cta { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.hero-stats { 
  display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap;
  margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--border);
}
.stat-item { text-align: center; }
.stat-num { font-family: var(--font-head); font-size: 2rem; font-weight: 800; color: var(--accent); }
.stat-label { font-size: 0.8rem; color: var(--text3); margin-top: 2px; }

/* FILTER BAR */
.filter-section { padding: 1.5rem 2rem 0; max-width: 1400px; margin: 0 auto; width: 100%; }
.filter-label { font-size: 0.75rem; font-weight: 600; color: var(--text3); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 0.75rem; }
.filter-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.chip {
  font-size: 0.8rem; font-weight: 500; cursor: pointer;
  border: 1px solid var(--border); border-radius: 20px;
  padding: 5px 14px; background: var(--bg3); color: var(--text2);
  transition: all 0.2s;
}
.chip:hover { border-color: var(--accent); color: var(--accent); }
.chip.active { background: var(--accent); border-color: var(--accent); color: #fff; }
.chip-all { border-color: var(--border2); }

/* MAIN GRID */
.main-wrap { max-width: 1400px; margin: 0 auto; padding: 2rem; width: 100%; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.section-title { font-family: var(--font-head); font-size: 1.3rem; font-weight: 700; }

/* TEST CARDS */
.tests-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.25rem; }
.test-card {
  background: var(--card); border: 1px solid var(--border);
  border-radius: var(--r); overflow: hidden;
  transition: all 0.25s; cursor: pointer; position: relative;
}
.test-card:hover { border-color: var(--accent); transform: translateY(-3px); box-shadow: 0 8px 32px rgba(79,110,247,0.2); }
.card-banner {
  height: 6px;
  background: linear-gradient(90deg, var(--accent), var(--accent3));
}
.card-banner.full { background: linear-gradient(90deg, var(--accent2), var(--red)); }
.card-banner.sectional { background: linear-gradient(90deg, var(--accent), var(--accent3)); }
.card-body { padding: 1.25rem; }
.card-type-badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  padding: 3px 10px; border-radius: 20px; margin-bottom: 0.75rem;
}
.badge-full { background: rgba(124,58,237,0.15); color: var(--accent2); border: 1px solid rgba(124,58,237,0.3); }
.badge-sectional { background: rgba(79,110,247,0.15); color: var(--accent); border: 1px solid rgba(79,110,247,0.3); }
.badge-free { background: rgba(16,185,129,0.15); color: var(--green); border: 1px solid rgba(16,185,129,0.3); }
.card-title { font-family: var(--font-head); font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; line-height: 1.3; }
.card-exam { font-size: 0.78rem; color: var(--text3); margin-bottom: 1rem; }
.card-meta { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
.meta-item { display: flex; align-items: center; gap: 4px; font-size: 0.78rem; color: var(--text2); }
.meta-icon { font-size: 0.9rem; }
.card-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 1rem; border-top: 1px solid var(--border); }
.card-attempts { font-size: 0.75rem; color: var(--text3); }
.card-difficulty { 
  font-size: 0.7rem; font-weight: 600; padding: 2px 8px; border-radius: 4px;
}
.diff-easy { background: rgba(16,185,129,0.15); color: var(--green); }
.diff-medium { background: rgba(245,158,11,0.15); color: var(--gold); }
.diff-hard { background: rgba(239,68,68,0.15); color: var(--red); }

/* AUTH FORMS */
.auth-wrap { 
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  padding: 2rem; background: var(--bg);
  position: relative; overflow: hidden;
}
.auth-wrap::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(79,110,247,0.08) 0%, transparent 70%);
}
.auth-card {
  background: var(--card); border: 1px solid var(--border);
  border-radius: 16px; padding: 2.5rem; width: 100%; max-width: 480px;
  position: relative; box-shadow: var(--shadow);
}
.auth-logo { text-align: center; margin-bottom: 2rem; }
.auth-logo h2 { font-family: var(--font-head); font-size: 1.8rem; font-weight: 800; }
.auth-logo p { color: var(--text3); font-size: 0.875rem; margin-top: 4px; }
.form-group { margin-bottom: 1.1rem; }
.form-label { display: block; font-size: 0.8rem; font-weight: 600; color: var(--text2); margin-bottom: 6px; }
.form-input {
  width: 100%; background: var(--bg2); border: 1px solid var(--border);
  border-radius: var(--r2); padding: 0.65rem 0.9rem;
  color: var(--text); font-family: var(--font-body); font-size: 0.9rem;
  transition: border-color 0.2s; outline: none;
}
.form-input:focus { border-color: var(--accent); }
.form-select { 
  width: 100%; background: var(--bg2); border: 1px solid var(--border);
  border-radius: var(--r2); padding: 0.65rem 0.9rem;
  color: var(--text); font-family: var(--font-body); font-size: 0.9rem;
  outline: none; cursor: pointer;
}
.form-select:focus { border-color: var(--accent); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.auth-footer { text-align: center; margin-top: 1.5rem; font-size: 0.85rem; color: var(--text3); }
.auth-link { color: var(--accent); cursor: pointer; text-decoration: underline; }
.pending-banner {
  background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3);
  border-radius: var(--r); padding: 1.5rem; text-align: center; margin: 2rem auto;
  max-width: 480px;
}
.pending-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
.pending-title { font-family: var(--font-head); font-weight: 700; margin-bottom: 0.5rem; color: var(--gold); }

/* SIDEBAR LAYOUT */
.dashboard-layout { display: flex; min-height: calc(100vh - 60px); }
.sidebar {
  width: 240px; flex-shrink: 0;
  background: var(--bg2); border-right: 1px solid var(--border);
  padding: 1.5rem 0; display: flex; flex-direction: column; gap: 0.25rem;
  position: sticky; top: 60px; height: calc(100vh - 60px); overflow-y: auto;
}
.sidebar-section { padding: 0 1rem; margin-bottom: 0.25rem; }
.sidebar-label { 
  font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text3); padding: 0 0.75rem; margin-bottom: 0.25rem;
}
.sidebar-item {
  display: flex; align-items: center; gap: 10px;
  padding: 0.6rem 0.75rem; border-radius: var(--r2);
  cursor: pointer; font-size: 0.875rem; color: var(--text2);
  transition: all 0.15s; margin: 0 0.25rem;
}
.sidebar-item:hover { background: var(--bg3); color: var(--text); }
.sidebar-item.active { background: rgba(79,110,247,0.15); color: var(--accent); font-weight: 600; }
.sidebar-icon { font-size: 1.1rem; width: 22px; text-align: center; }
.dashboard-content { flex: 1; padding: 2rem; overflow-y: auto; }

/* ADMIN TABLES */
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th { 
  text-align: left; padding: 0.75rem 1rem;
  font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text3);
  background: var(--bg3); border-bottom: 1px solid var(--border);
}
td { padding: 0.85rem 1rem; border-bottom: 1px solid var(--border); font-size: 0.875rem; color: var(--text2); }
tr:last-child td { border-bottom: none; }
tr:hover td { background: rgba(255,255,255,0.02); }
.table-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--r); overflow: hidden; }

/* STATUS BADGES */
.status-badge { 
  display: inline-block; font-size: 0.7rem; font-weight: 700;
  padding: 3px 10px; border-radius: 20px; letter-spacing: 0.04em;
}
.status-pending { background: rgba(245,158,11,0.15); color: var(--gold); border: 1px solid rgba(245,158,11,0.3); }
.status-approved { background: rgba(16,185,129,0.15); color: var(--green); border: 1px solid rgba(16,185,129,0.3); }
.status-rejected { background: rgba(239,68,68,0.15); color: var(--red); border: 1px solid rgba(239,68,68,0.3); }
.status-published { background: rgba(79,110,247,0.15); color: var(--accent); border: 1px solid rgba(79,110,247,0.3); }
.status-draft { background: rgba(86,94,128,0.2); color: var(--text3); border: 1px solid var(--border); }
.status-store { background: rgba(6,182,212,0.15); color: var(--accent3); border: 1px solid rgba(6,182,212,0.3); }
.status-inactive { background: rgba(239,68,68,0.1); color: var(--red); border: 1px solid rgba(239,68,68,0.25); }

/* CARDS / PANELS */
.panel { background: var(--card); border: 1px solid var(--border); border-radius: var(--r); }
.panel-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.panel-body { padding: 1.5rem; }
.panel-title { font-family: var(--font-head); font-size: 1rem; font-weight: 700; }

/* STATS ROW */
.stats-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
.stat-card { 
  background: var(--card); border: 1px solid var(--border); border-radius: var(--r);
  padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem;
}
.stat-card-num { font-family: var(--font-head); font-size: 2rem; font-weight: 800; }
.stat-card-label { font-size: 0.8rem; color: var(--text3); font-weight: 500; }
.stat-card-icon { font-size: 1.5rem; }
.stat-blue .stat-card-num { color: var(--accent); }
.stat-green .stat-card-num { color: var(--green); }
.stat-gold .stat-card-num { color: var(--gold); }
.stat-red .stat-card-num { color: var(--red); }

/* MOCK TEST ENGINE */
.test-engine {
  min-height: 100vh; background: var(--bg); display: flex; flex-direction: column;
}
.test-topbar {
  background: var(--bg2); border-bottom: 1px solid var(--border);
  padding: 0 1.5rem; height: 56px; display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 50;
}
.test-topbar-title { font-family: var(--font-head); font-weight: 700; font-size: 1rem; }
.timer-display {
  display: flex; align-items: center; gap: 8px;
  background: var(--bg3); border: 1px solid var(--border); border-radius: var(--r2);
  padding: 6px 14px; font-family: 'Courier New', monospace; font-size: 1.1rem; font-weight: 700;
}
.timer-display.warning { border-color: var(--gold); color: var(--gold); }
.timer-display.danger { border-color: var(--red); color: var(--red); animation: pulse 1s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }

.test-body { display: flex; flex: 1; overflow: hidden; }
.question-panel { flex: 1; padding: 2rem; overflow-y: auto; }
.question-nav-sidebar {
  width: 260px; background: var(--bg2); border-left: 1px solid var(--border);
  padding: 1rem; overflow-y: auto; flex-shrink: 0;
}
.q-number-header { font-size: 0.75rem; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.75rem; }
.q-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 5px; }
.q-btn {
  aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
  border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer;
  border: 1px solid var(--border); background: var(--bg3); color: var(--text2);
  transition: all 0.15s;
}
.q-btn:hover { border-color: var(--accent); }
.q-btn.current { border-color: var(--accent); background: var(--accent); color: #fff; }
.q-btn.answered { background: var(--green); border-color: var(--green); color: #fff; }
.q-btn.marked { background: var(--accent2); border-color: var(--accent2); color: #fff; }
.q-btn.visited { border-color: var(--border2); background: rgba(255,255,255,0.05); }

.question-content { max-width: 720px; }
.q-meta { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
.q-index { font-family: var(--font-head); font-size: 0.875rem; color: var(--text3); }
.q-text { font-size: 1.05rem; line-height: 1.7; margin-bottom: 2rem; color: var(--text); }
.options-list { display: flex; flex-direction: column; gap: 0.75rem; }
.option-item {
  display: flex; align-items: flex-start; gap: 1rem; padding: 0.9rem 1.1rem;
  background: var(--bg2); border: 1.5px solid var(--border); border-radius: var(--r);
  cursor: pointer; transition: all 0.2s;
}
.option-item:hover { border-color: var(--accent); background: rgba(79,110,247,0.05); }
.option-item.selected { border-color: var(--accent); background: rgba(79,110,247,0.12); }
.option-item.correct { border-color: var(--green); background: rgba(16,185,129,0.12); }
.option-item.wrong { border-color: var(--red); background: rgba(239,68,68,0.12); }
.option-letter {
  width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem; font-weight: 700; flex-shrink: 0;
  background: var(--bg3); border: 1px solid var(--border); color: var(--text2);
}
.option-item.selected .option-letter { background: var(--accent); border-color: var(--accent); color: #fff; }
.option-item.correct .option-letter { background: var(--green); border-color: var(--green); color: #fff; }
.option-item.wrong .option-letter { background: var(--red); border-color: var(--red); color: #fff; }
.option-text { font-size: 0.95rem; line-height: 1.5; padding-top: 4px; color: var(--text); }

.q-actions { display: flex; gap: 0.75rem; margin-top: 2rem; align-items: center; }

/* SECTION TABS */
.section-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--border); margin-bottom: 0; overflow-x: auto; }
.section-tab {
  padding: 0.75rem 1.25rem; font-size: 0.875rem; font-weight: 600; cursor: pointer;
  color: var(--text3); border-bottom: 2px solid transparent; white-space: nowrap;
  transition: all 0.2s; background: transparent; border-top: none; border-left: none; border-right: none;
}
.section-tab:hover { color: var(--text2); }
.section-tab.active { color: var(--accent); border-bottom-color: var(--accent); }
.section-timer {
  font-size: 0.75rem; padding: 2px 8px; border-radius: 4px;
  background: rgba(239,68,68,0.1); color: var(--red); margin-left: 6px; font-weight: 700;
}

/* RESULTS */
.result-hero {
  text-align: center; padding: 3rem 1rem;
  background: linear-gradient(135deg, rgba(79,110,247,0.1), rgba(6,182,212,0.05));
  border-radius: var(--r); border: 1px solid var(--border); margin-bottom: 2rem;
}
.result-score { font-family: var(--font-head); font-size: 5rem; font-weight: 800; color: var(--accent); line-height: 1; }
.result-total { font-size: 1.5rem; color: var(--text3); }
.result-rank { font-size: 1rem; color: var(--text2); margin-top: 0.5rem; }

.analysis-bar-wrap { margin-bottom: 1rem; }
.analysis-bar-label { display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 5px; color: var(--text2); }
.analysis-bar-bg { background: var(--bg3); border-radius: 20px; height: 8px; overflow: hidden; }
.analysis-bar-fill { height: 100%; border-radius: 20px; transition: width 1s ease; }
.bar-green { background: var(--green); }
.bar-red { background: var(--red); }
.bar-gold { background: var(--gold); }

/* LEADERBOARD */
.lb-row { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1rem; border-bottom: 1px solid var(--border); }
.lb-rank { 
  width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-family: var(--font-head); font-weight: 800; font-size: 0.9rem; flex-shrink: 0;
}
.rank-1 { background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; }
.rank-2 { background: linear-gradient(135deg, #C0C0C0, #A0A0A0); color: #000; }
.rank-3 { background: linear-gradient(135deg, #CD7F32, #A0522D); color: #fff; }
.rank-other { background: var(--bg3); border: 1px solid var(--border); color: var(--text3); font-size: 0.8rem; }
.lb-name { flex: 1; font-weight: 500; font-size: 0.9rem; }
.lb-score { font-family: var(--font-head); font-weight: 700; color: var(--accent); }
.lb-you { background: rgba(79,110,247,0.08); }

/* QUESTION EDITOR */
.q-editor { display: flex; flex-direction: column; gap: 1rem; }
.options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.option-input-row { display: flex; align-items: center; gap: 0.5rem; }
.option-prefix { 
  width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  background: var(--bg3); border: 1px solid var(--border); font-weight: 700; font-size: 0.85rem; flex-shrink: 0;
}
.correct-radio { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.correct-radio-item { 
  display: flex; align-items: center; gap: 6px; cursor: pointer;
  background: var(--bg3); border: 1px solid var(--border); border-radius: 6px;
  padding: 6px 12px; transition: all 0.15s;
}
.correct-radio-item.selected { border-color: var(--green); background: rgba(16,185,129,0.1); color: var(--green); }

/* MODAL */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 200; padding: 1rem;
}
.modal {
  background: var(--card); border: 1px solid var(--border); border-radius: 16px;
  padding: 2rem; max-width: 560px; width: 100%; max-height: 90vh; overflow-y: auto;
  box-shadow: 0 24px 64px rgba(0,0,0,0.6);
}
.modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.modal-title { font-family: var(--font-head); font-size: 1.2rem; font-weight: 700; }
.modal-close { background: transparent; border: none; color: var(--text3); cursor: pointer; font-size: 1.2rem; padding: 4px; }
.modal-close:hover { color: var(--text); }

/* MISC */
.divider { height: 1px; background: var(--border); margin: 1.5rem 0; }
.empty-state { text-align: center; padding: 3rem; color: var(--text3); }
.empty-icon { font-size: 3rem; margin-bottom: 1rem; }
.alert { border-radius: var(--r2); padding: 0.85rem 1rem; font-size: 0.875rem; margin-bottom: 1rem; }
.alert-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: var(--red); }
.alert-success { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: var(--green); }
.alert-info { background: rgba(79,110,247,0.1); border: 1px solid rgba(79,110,247,0.3); color: var(--accent); }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
.text-muted { color: var(--text3); }
.text-accent { color: var(--accent); }
.font-bold { font-weight: 700; }
.font-head { font-family: var(--font-head); }
.w-full { width: 100%; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }
.spinner { 
  width: 20px; height: 20px; border: 2px solid var(--border);
  border-top-color: var(--accent); border-radius: 50%; animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.tag { 
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 0.72rem; font-weight: 600; padding: 2px 8px; border-radius: 4px;
  background: var(--bg3); border: 1px solid var(--border); color: var(--text3);
}

/* CARD CUSTOM STYLE (admin-designed) */
.card-custom-accent { border-top: 3px solid; }
.card-highlight { box-shadow: 0 0 0 1px var(--accent), 0 8px 32px rgba(79,110,247,0.15); }

/* PROGRESS BAR */
.progress-wrap { background: var(--bg3); border-radius: 20px; height: 6px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 20px; background: linear-gradient(90deg, var(--accent), var(--accent3)); transition: width 0.5s ease; }

/* TABS */
.tabs { display: flex; gap: 0; border-bottom: 1px solid var(--border); margin-bottom: 1.5rem; }
.tab {
  padding: 0.65rem 1.25rem; font-size: 0.875rem; font-weight: 600; cursor: pointer;
  color: var(--text3); border-bottom: 2px solid transparent;
  transition: all 0.2s; background: transparent; border-top: none; border-left: none; border-right: none;
}
.tab:hover { color: var(--text2); }
.tab.active { color: var(--accent); border-bottom-color: var(--accent); }

/* TOGGLE */
.toggle-wrap { display: flex; gap: 4px; background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; padding: 3px; }
.toggle-item { 
  padding: 5px 14px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;
  cursor: pointer; color: var(--text3); transition: all 0.2s;
}
.toggle-item.active { background: var(--accent); color: #fff; }
`;

// ─── DATA / STATE ─────────────────────────────────────────────────────────────
const EXAMS = ["UPSC CSE","SSC CGL","SSC CHSL","RRB NTPC","IBPS PO","IBPS Clerk","SBI PO","NEET","JEE Main","JEE Advanced","CAT","GATE","CTET","NDA","CDS","AFCAT"];
const SUBJECTS = ["General Knowledge","Reasoning","Quantitative Aptitude","English","History","Geography","Polity","Economics","Current Affairs","Physics","Chemistry","Biology","Mathematics","Computer Science"];
const TOPICS_MAP = {
  "General Knowledge": ["Indian History","World Geography","Science & Technology","Sports","Awards","Books & Authors"],
  "Reasoning": ["Analogy","Coding-Decoding","Blood Relations","Direction Sense","Syllogism","Puzzles"],
  "Quantitative Aptitude": ["Number System","Algebra","Geometry","Trigonometry","Statistics","Data Interpretation"],
  "English": ["Grammar","Vocabulary","Reading Comprehension","Fill in the Blanks","Error Detection"],
  "History": ["Ancient India","Medieval India","Modern India","World History","Cultural History"],
};

const INITIAL_QUESTIONS = [
  { id:"q1", topicId:"t1", subject:"Reasoning", topic:"Analogy", difficulty:"medium", text:"Find the odd one out: Apple, Mango, Carrot, Banana", optA:"Apple", optB:"Mango", optC:"Carrot", optD:"Banana", correct:"c", explanation:"Carrot is a vegetable, others are fruits.", createdBy:"admin", createdAt:"2025-01-10", exam:"SSC CGL" },
  { id:"q2", topicId:"t1", subject:"General Knowledge", topic:"Indian History", difficulty:"hard", text:"The Battle of Plassey was fought in which year?", optA:"1757", optB:"1761", optC:"1764", optD:"1776", correct:"a", explanation:"The Battle of Plassey was fought on 23 June 1757.", createdBy:"admin", createdAt:"2025-01-10", exam:"UPSC CSE" },
  { id:"q3", topicId:"t2", subject:"Quantitative Aptitude", topic:"Number System", difficulty:"easy", text:"What is 15% of 200?", optA:"25", optB:"30", optC:"35", optD:"40", correct:"b", explanation:"15% of 200 = (15/100) × 200 = 30", createdBy:"admin", createdAt:"2025-01-11", exam:"SSC CGL" },
  { id:"q4", topicId:"t2", subject:"English", topic:"Grammar", difficulty:"medium", text:"Choose the correct sentence:", optA:"She don't like coffee", optB:"She doesn't likes coffee", optC:"She doesn't like coffee", optD:"She not like coffee", correct:"c", explanation:"'She doesn't like coffee' is grammatically correct.", createdBy:"admin", createdAt:"2025-01-12", exam:"SSC CGL" },
  { id:"q5", topicId:"t3", subject:"General Knowledge", topic:"World Geography", difficulty:"easy", text:"Which is the largest continent by area?", optA:"Africa", optB:"Asia", optC:"North America", optD:"Antarctica", correct:"b", explanation:"Asia is the largest continent covering about 44.6 million km².", createdBy:"admin", createdAt:"2025-01-13", exam:"UPSC CSE" },
  { id:"q6", topicId:"t3", subject:"Reasoning", topic:"Coding-Decoding", difficulty:"medium", text:"If MANGO is coded as NBOHP, then APPLE is coded as?", optA:"BQQMF", optB:"BQPMF", optC:"BQQNF", optD:"CQQMF", correct:"a", explanation:"Each letter is shifted by +1 in the alphabet.", createdBy:"admin", createdAt:"2025-01-14", exam:"SSC CGL" },
];

const INITIAL_TESTS = [
  { 
    id:"t1", name:"SSC CGL Full Mock Test 1", examId:"SSC CGL", type:"full",
    sections:[
      { id:"s1", name:"General Intelligence", questions:["q1","q6"], duration:15, marks:2, negative:0.5 },
      { id:"s2", name:"General Awareness", questions:["q2","q5"], duration:10, marks:2, negative:0.5 },
      { id:"s3", name:"Quantitative Aptitude", questions:["q3"], duration:20, marks:2, negative:0.5 },
      { id:"s4", name:"English Comprehension", questions:["q4"], duration:15, marks:2, negative:0.5 },
    ],
    totalDuration:60, status:"published", attempts:1243,
    difficulty:"medium", createdAt:"2025-01-15",
    cardColor:"#4F6EF7", cardStyle:"gradient", description:"Complete full-length mock for SSC CGL with all 4 sections.",
    markingScheme:{ positive:2, negative:0.5 }
  },
  { 
    id:"t2", name:"UPSC History Sectional Test", examId:"UPSC CSE", type:"sectional",
    sections:[
      { id:"s1", name:"Indian History", questions:["q2","q5"], duration:30, marks:2, negative:0.67 },
    ],
    totalDuration:30, status:"published", attempts:567,
    difficulty:"hard", createdAt:"2025-01-16",
    cardColor:"#7C3AED", cardStyle:"solid", description:"Focus test on Indian History for UPSC aspirants.",
    markingScheme:{ positive:2, negative:0.67 }
  },
  { 
    id:"t3", name:"SSC Reasoning Speed Test", examId:"SSC CGL", type:"sectional",
    sections:[
      { id:"s1", name:"Reasoning Ability", questions:["q1","q6"], duration:20, marks:1, negative:0.25 },
    ],
    totalDuration:20, status:"store", attempts:0,
    difficulty:"easy", createdAt:"2025-01-17",
    cardColor:"#06B6D4", cardStyle:"gradient", description:"Quick speed test for reasoning section practice.",
    markingScheme:{ positive:1, negative:0.25 }
  },
];

const INITIAL_USERS = [
  { id:"u1", name:"Arjun Sharma", email:"arjun@example.com", phone:"9876543210", exam:"SSC CGL", status:"approved", role:"student", city:"Delhi", createdAt:"2025-01-05" },
  { id:"u2", name:"Priya Patel", email:"priya@example.com", phone:"9123456789", exam:"UPSC CSE", status:"approved", role:"student", city:"Mumbai", createdAt:"2025-01-06" },
  { id:"u3", name:"Rahul Singh", email:"rahul@example.com", phone:"9988776655", exam:"IBPS PO", status:"pending", role:"student", city:"Lucknow", createdAt:"2025-01-07" },
  { id:"u4", name:"Anjali Gupta", email:"anjali@example.com", phone:"9765432100", exam:"NEET", status:"pending", role:"student", city:"Jaipur", createdAt:"2025-01-08" },
  { id:"u5", name:"Vikram Reddy", email:"vikram@example.com", phone:"9654321098", exam:"SSC CGL", status:"approved", role:"student", city:"Hyderabad", createdAt:"2025-01-09" },
];

const SAMPLE_ATTEMPTS = [
  { userId:"u1", testId:"t1", score:54, total:72, rank:12, totalAttempts:1243, correct:27, wrong:3, unattempted:6, timeTaken:58, date:"2025-01-20" },
  { userId:"u1", testId:"t2", score:18, total:24, rank:45, totalAttempts:567, correct:9, wrong:2, unattempted:1, timeTaken:28, date:"2025-01-21" },
  { userId:"u2", testId:"t1", score:66, total:72, rank:3, totalAttempts:1243, correct:33, wrong:0, unattempted:3, timeTaken:55, date:"2025-01-20" },
  { userId:"u5", testId:"t1", score:48, total:72, rank:28, totalAttempts:1243, correct:24, wrong:2, unattempted:10, timeTaken:59, date:"2025-01-20" },
];

const LEADERBOARD = [
  { name:"Priya Patel", score:66, rank:1, city:"Mumbai" },
  { name:"Kavita Nair", score:64, rank:2, city:"Bangalore" },
  { name:"Rohit Verma", score:62, rank:3, city:"Pune" },
  { name:"Arjun Sharma", score:54, rank:12, city:"Delhi" },
  { name:"Meera Das", score:58, rank:7, city:"Chennai" },
  { name:"Suresh Kumar", score:60, rank:5, city:"Hyderabad" },
  { name:"Ananya Singh", score:61, rank:4, city:"Kolkata" },
  { name:"Deepak Joshi", score:56, rank:9, city:"Ahmedabad" },
];

// ─── UTILITY HOOKS ────────────────────────────────────────────────────────────
function useTimer(initialSeconds, onEnd) {
  const [secs, setSecs] = useState(initialSeconds);
  const ref = useRef(null);
  useEffect(() => {
    ref.current = setInterval(() => {
      setSecs(s => {
        if (s <= 1) { clearInterval(ref.current); onEnd && onEnd(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, []);
  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  return { secs, display: fmt(secs) };
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Logo({ onClick }) {
  return (
    <div className="nav-logo" style={{cursor:'pointer'}} onClick={onClick}>
      <span>📋</span>
      <span>Exam<span style={{color:'#fff'}}>Paper</span></span>
      <span className="nav-badge">BETA</span>
    </div>
  );
}

function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"", phone:"", city:"", exam:"", dob:"", gender:"male", qualification:"graduate" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({...f, [k]: e.target.value}));

  const submit = () => {
    setError(""); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === "login") {
        if (form.email === "admin@exampaper.in" && form.password === "admin123") {
          onAuth({ id:"admin", name:"Admin", role:"admin", email:"admin@exampaper.in" });
        } else {
          const u = INITIAL_USERS.find(u => u.email === form.email);
          if (u && form.password === "pass123") {
            if (u.status === "pending") { onAuth({ ...u, role:"student", status:"pending" }); }
            else if (u.status === "approved") { onAuth({ ...u, role:"student" }); }
            else setError("Your account has been deactivated. Contact admin.");
          } else setError("Invalid credentials. Try admin@exampaper.in / admin123 or arjun@example.com / pass123");
        }
      } else {
        if (!form.name || !form.email || !form.password || !form.phone || !form.exam) {
          setError("Please fill all required fields."); return;
        }
        onAuth({ ...form, id:"new_"+Date.now(), role:"student", status:"pending" });
      }
    }, 800);
  };

  return (
    <div className="auth-wrap">
      <style>{CSS}</style>
      <div className="auth-card">
        <div className="auth-logo">
          <h2 style={{fontFamily:'Syne,sans-serif'}}>📋 ExamPaper</h2>
          <p>{mode==="login" ? "Sign in to your account" : "Create your account"}</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {mode === "login" ? (
          <>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={set("email")} />
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} />
            </div>
            <div className="alert alert-info" style={{fontSize:'0.78rem'}}>
              Demo: <b>admin@exampaper.in / admin123</b> for admin<br/>
              Student: <b>arjun@example.com / pass123</b>
            </div>
          </>
        ) : (
          <>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" placeholder="Your full name" value={form.name} onChange={set("name")} />
              </div>
              <div className="form-group">
                <label className="form-label">Gender *</label>
                <select className="form-select" value={form.gender} onChange={set("gender")}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={set("email")} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <input className="form-input" type="tel" placeholder="10-digit mobile" value={form.phone} onChange={set("phone")} maxLength={10} />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input className="form-input" type="date" value={form.dob} onChange={set("dob")} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City / State *</label>
                <input className="form-input" placeholder="e.g. Delhi" value={form.city} onChange={set("city")} />
              </div>
              <div className="form-group">
                <label className="form-label">Qualification</label>
                <select className="form-select" value={form.qualification} onChange={set("qualification")}>
                  <option value="10th">10th</option>
                  <option value="12th">12th</option>
                  <option value="graduate">Graduate</option>
                  <option value="postgraduate">Post Graduate</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Exam Preparing For *</label>
              <select className="form-select" value={form.exam} onChange={set("exam")}>
                <option value="">-- Select Exam --</option>
                {EXAMS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input className="form-input" type="password" placeholder="Minimum 8 characters" value={form.password} onChange={set("password")} />
            </div>
          </>
        )}

        <button className="btn btn-primary w-full btn-lg" onClick={submit} disabled={loading} style={{marginTop:'0.5rem'}}>
          {loading ? <><div className="spinner"></div> Please wait...</> : (mode==="login" ? "Sign In" : "Create Account")}
        </button>

        <div className="auth-footer">
          {mode==="login" ? <>Don't have an account? <span className="auth-link" onClick={()=>setMode("signup")}>Sign Up</span></>
          : <>Already have an account? <span className="auth-link" onClick={()=>setMode("login")}>Sign In</span></>}
        </div>
      </div>
    </div>
  );
}

function PendingPage({ user, onLogout }) {
  return (
    <div style={{minHeight:'100vh', background:'var(--bg)', padding:'2rem'}}>
      <style>{CSS}</style>
      <nav className="nav" style={{position:'fixed',top:0,left:0,right:0}}>
        <Logo />
        <button className="btn btn-ghost" onClick={onLogout}>Logout</button>
      </nav>
      <div style={{paddingTop:'80px', display:'flex', justifyContent:'center'}}>
        <div style={{maxWidth:480, width:'100%'}}>
          <div className="pending-banner">
            <div className="pending-icon">⏳</div>
            <div className="pending-title">Registration Under Review</div>
            <p style={{color:'var(--text2)', fontSize:'0.9rem', lineHeight:1.6}}>
              Thank you for registering, <b>{user.name}</b>! Your account is currently being reviewed by our admin team.
              You will receive access once approved. This usually takes 24-48 hours.
            </p>
            <div style={{marginTop:'1.5rem', padding:'1rem', background:'var(--bg3)', borderRadius:'8px', textAlign:'left'}}>
              <div style={{fontSize:'0.8rem', color:'var(--text3)', marginBottom:'0.5rem'}}>Your Details</div>
              <div style={{fontSize:'0.875rem', color:'var(--text2)'}}>📧 {user.email}</div>
              <div style={{fontSize:'0.875rem', color:'var(--text2)'}}>📱 {user.phone}</div>
              <div style={{fontSize:'0.875rem', color:'var(--text2)'}}>📚 Preparing for: <b style={{color:'var(--accent)'}}>{user.exam}</b></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STUDENT LANDING PAGE ────────────────────────────────────────────────────
function StudentLanding({ user, onStartTest, onLogout, onViewResult }) {
  const [activeExam, setActiveExam] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [tests] = useState(INITIAL_TESTS);
  const [page, setPage] = useState("home");
  const [selectedTest, setSelectedTest] = useState(null);
  const [myAttempts] = useState(SAMPLE_ATTEMPTS.filter(a=>a.userId===user.id));

  const published = tests.filter(t => t.status === "published");
  const examFilters = ["All", ...new Set(published.map(t => t.examId))];
  const typeFilters = ["All", "full", "sectional"];

  let filtered = published;
  if (activeExam !== "All") filtered = filtered.filter(t => t.examId === activeExam);
  if (activeType !== "All") filtered = filtered.filter(t => t.type === activeType);

  const visible = showAll ? filtered : filtered.slice(0,6);

  const attempted = id => myAttempts.find(a => a.testId === id);

  if (page === "result" && selectedTest) {
    const att = attempted(selectedTest.id) || SAMPLE_ATTEMPTS[0];
    return <ResultPage test={selectedTest} attempt={att} onBack={()=>setPage("home")} user={user} />;
  }

  return (
    <div className="app">
      <style>{CSS}</style>
      <nav className="nav">
        <Logo onClick={()=>setPage("home")} />
        <div className="nav-links">
          <button className={`btn btn-ghost ${page==="home"?"text-accent":""}`} onClick={()=>setPage("home")}>Tests</button>
          <button className={`btn btn-ghost ${page==="my"?"text-accent":""}`} onClick={()=>setPage("my")}>My Tests</button>
          <div style={{width:1, height:20, background:'var(--border)'}}/>
          <div style={{fontSize:'0.85rem', color:'var(--text2)'}}>👤 {user.name}</div>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      {page === "home" && (
        <>
          <div className="hero">
            <div className="hero-eyebrow">🎯 India's Premier Mock Test Platform</div>
            <h1>
              <span className="hi">Crack Your Dream </span>
              <span className="lo">Government Exam</span>
            </h1>
            <p>Practice with real exam-pattern tests curated by experts. Track your progress, analyse your performance and beat the competition.</p>
            <div className="hero-stats">
              <div className="stat-item"><div className="stat-num">50+</div><div className="stat-label">Mock Tests</div></div>
              <div className="stat-item"><div className="stat-num">5000+</div><div className="stat-label">Questions</div></div>
              <div className="stat-item"><div className="stat-num">20+</div><div className="stat-label">Exams Covered</div></div>
              <div className="stat-item"><div className="stat-num">10k+</div><div className="stat-label">Students</div></div>
            </div>
          </div>

          <div className="filter-section">
            <div style={{display:'flex', gap:'2rem', flexWrap:'wrap', alignItems:'flex-start'}}>
              <div>
                <div className="filter-label">Exam</div>
                <div className="filter-chips">
                  {examFilters.map(e => (
                    <div key={e} className={`chip ${activeExam===e?"active":""}`} onClick={()=>{setActiveExam(e);setShowAll(false);}}>
                      {e}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="filter-label">Test Type</div>
                <div className="filter-chips">
                  {typeFilters.map(t => (
                    <div key={t} className={`chip ${activeType===t?"active":""}`} onClick={()=>{setActiveType(t);setShowAll(false);}}>
                      {t==="full"?"Full Mock":t==="sectional"?"Sectional":"All"}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="main-wrap">
            <div className="section-header">
              <div className="section-title">
                {activeExam==="All" ? "Available Tests" : activeExam} 
                <span style={{fontSize:'0.85rem', color:'var(--text3)', fontWeight:400, marginLeft:'8px'}}>({filtered.length} tests)</span>
              </div>
              {!showAll && filtered.length > 6 && (
                <button className="btn btn-outline btn-sm" onClick={()=>setShowAll(true)}>View All →</button>
              )}
            </div>

            {visible.length === 0 && (
              <div className="empty-state"><div className="empty-icon">🔍</div><p>No tests found for selected filters</p></div>
            )}

            <div className="tests-grid">
              {visible.map(test => {
                const att = attempted(test.id);
                return (
                  <div key={test.id} className="test-card" onClick={()=>{
                    if(att) { setSelectedTest(test); setPage("result"); }
                    else onStartTest(test);
                  }}>
                    <div className={`card-banner ${test.type}`} style={{background: test.cardStyle==="gradient" ? `linear-gradient(90deg, ${test.cardColor}, #06B6D4)` : test.cardColor}} />
                    <div className="card-body">
                      <div style={{display:'flex', gap:'6px', marginBottom:'0.75rem', flexWrap:'wrap'}}>
                        <span className={`card-type-badge ${test.type==="full"?"badge-full":"badge-sectional"}`}>
                          {test.type==="full"?"📄 Full Mock":"📌 Sectional"}
                        </span>
                        {att && <span className="card-type-badge badge-free">✓ Attempted</span>}
                      </div>
                      <div className="card-title">{test.name}</div>
                      <div className="card-exam">{test.examId}</div>
                      <p style={{fontSize:'0.8rem', color:'var(--text3)', marginBottom:'1rem', lineHeight:1.5}}>{test.description}</p>
                      <div className="card-meta">
                        <div className="meta-item"><span className="meta-icon">⏱</span>{test.totalDuration} min</div>
                        <div className="meta-item"><span className="meta-icon">❓</span>{test.sections?.reduce((a,s)=>a+s.questions.length,0)} Qs</div>
                        <div className="meta-item"><span className="meta-icon">📂</span>{test.sections?.length} Section{test.sections?.length>1?"s":""}</div>
                        <div className="meta-item"><span className="meta-icon">➕</span>{test.markingScheme?.positive}/{test.markingScheme?.negative}</div>
                      </div>
                      <div className="card-footer">
                        <span className="card-attempts">👥 {test.attempts?.toLocaleString()} attempts</span>
                        <span className={`card-difficulty diff-${test.difficulty}`}>{test.difficulty}</span>
                      </div>
                      {att && (
                        <div style={{marginTop:'0.75rem', padding:'0.6rem', background:'rgba(79,110,247,0.08)', borderRadius:'6px', fontSize:'0.8rem', color:'var(--text2)'}}>
                          Your score: <b style={{color:'var(--accent)'}}>{att.score}/{att.total}</b> · Rank #{att.rank}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {!showAll && filtered.length > 6 && (
              <div style={{textAlign:'center', marginTop:'2rem'}}>
                <button className="btn btn-outline" onClick={()=>setShowAll(true)}>Load More Tests ({filtered.length-6} remaining)</button>
              </div>
            )}
          </div>
        </>
      )}

      {page === "my" && (
        <div className="main-wrap">
          <div className="section-title mb-4">My Test History</div>
          {myAttempts.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📋</div><p>You haven't attempted any tests yet.</p><button className="btn btn-primary" style={{marginTop:'1rem'}} onClick={()=>setPage("home")}>Browse Tests</button></div>
          ) : (
            <div className="tests-grid">
              {myAttempts.map((att, i) => {
                const test = tests.find(t=>t.id===att.testId);
                if (!test) return null;
                const pct = Math.round((att.score/att.total)*100);
                return (
                  <div key={i} className="panel" style={{cursor:'pointer'}} onClick={()=>{setSelectedTest(test);setPage("result");}}>
                    <div className="panel-body">
                      <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,marginBottom:'0.5rem'}}>{test.name}</div>
                      <div style={{fontSize:'0.8rem',color:'var(--text3)',marginBottom:'1rem'}}>{att.date}</div>
                      <div style={{display:'flex',gap:'1rem',marginBottom:'1rem'}}>
                        <div><div style={{fontSize:'1.5rem',fontWeight:800,color:'var(--accent)',fontFamily:'Syne,sans-serif'}}>{att.score}</div><div style={{fontSize:'0.75rem',color:'var(--text3)'}}>Score</div></div>
                        <div><div style={{fontSize:'1.5rem',fontWeight:800,color:'var(--gold)',fontFamily:'Syne,sans-serif'}}>#{att.rank}</div><div style={{fontSize:'0.75rem',color:'var(--text3)'}}>Rank</div></div>
                        <div><div style={{fontSize:'1.5rem',fontWeight:800,color:'var(--green)',fontFamily:'Syne,sans-serif'}}>{pct}%</div><div style={{fontSize:'0.75rem',color:'var(--text3)'}}>Accuracy</div></div>
                      </div>
                      <div className="progress-wrap"><div className="progress-fill" style={{width:`${pct}%`}}></div></div>
                      <div style={{textAlign:'right',fontSize:'0.75rem',color:'var(--text3)',marginTop:'4px'}}>{att.correct} correct · {att.wrong} wrong · {att.unattempted} skipped</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MOCK TEST ENGINE ─────────────────────────────────────────────────────────
function MockTestEngine({ test, user, onFinish }) {
  const questions = INITIAL_QUESTIONS;
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({});
  const [visited, setVisited] = useState(new Set(["0_0"]));
  const [submitted, setSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [sectionTimes, setSectionTimes] = useState(() => 
    Object.fromEntries(test.sections.map(s => [s.id, s.duration * 60]))
  );
  const totalQ = test.sections.reduce((a,s)=>a+s.questions.length, 0);

  // Per-section timer
  const section = test.sections[currentSection];
  const { secs: secTimer, display: timerDisplay } = useTimer(
    sectionTimes[section?.id] || 600,
    () => {
      if (currentSection < test.sections.length - 1) setCurrentSection(c => c+1);
      else handleSubmit();
    }
  );

  const qKey = (si, qi) => `${si}_${qi}`;
  const currKey = qKey(currentSection, currentQ);
  const sectionQs = section ? section.questions.map(qid => questions.find(q=>q.id===qid)).filter(Boolean) : [];
  const q = sectionQs[currentQ];

  const selectOption = opt => {
    if (submitted) return;
    setAnswers(a => ({...a, [currKey]: opt}));
  };

  const toggleMark = () => {
    setMarked(m => ({...m, [currKey]: !m[currKey]}));
  };

  const navigate = (si, qi) => {
    setCurrentSection(si); setCurrentQ(qi);
    setVisited(v => new Set([...v, qKey(si,qi)]));
  };

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    setShowSubmitModal(false);
    // Calculate score
    let score = 0, correct = 0, wrong = 0, unattempted = 0;
    test.sections.forEach((sec, si) => {
      sec.questions.forEach((qid, qi) => {
        const k = qKey(si, qi);
        const qdata = questions.find(q=>q.id===qid);
        if (!qdata) return;
        if (answers[k]) {
          if (answers[k] === qdata.correct) { score += (sec.marks||2); correct++; }
          else { score -= (sec.negative||0.5); wrong++; }
        } else unattempted++;
      });
    });
    onFinish({ score: Math.max(0, score).toFixed(1), correct, wrong, unattempted, total: totalQ*2, rank: Math.floor(Math.random()*200)+1, totalAttempts: test.attempts+1, timeTaken: test.totalDuration });
  }, [answers]);

  if (!section || !q) return null;

  const answered = Object.keys(answers).length;

  return (
    <div className="test-engine">
      <style>{CSS}</style>
      <div className="test-topbar">
        <div className="test-topbar-title">📋 {test.name}</div>
        <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
          <div className="flex gap-2 items-center" style={{fontSize:'0.8rem', color:'var(--text3)'}}>
            <span style={{color:'var(--green)'}}>✓ {answered}</span>
            <span>/ {totalQ}</span>
          </div>
          <div className={`timer-display ${secTimer < 120 ? 'danger' : secTimer < 300 ? 'warning' : ''}`}>
            ⏱ {timerDisplay}
          </div>
          <button className="btn btn-danger btn-sm" onClick={()=>setShowSubmitModal(true)}>Submit Test</button>
        </div>
      </div>

      {/* Section tabs */}
      <div style={{background:'var(--bg2)', borderBottom:'1px solid var(--border)', padding:'0 1.5rem'}}>
        <div className="section-tabs">
          {test.sections.map((sec, si) => (
            <div key={sec.id} className={`section-tab ${si===currentSection?"active":""}`}
              onClick={()=>navigate(si, 0)}>
              {sec.name}
              <span className={`section-timer`}>{Math.floor((sectionTimes[sec.id]||sec.duration*60)/60)}m</span>
            </div>
          ))}
        </div>
      </div>

      <div className="test-body">
        <div className="question-panel">
          <div className="question-content">
            <div className="q-meta">
              <span className="q-index">Q.{currentQ+1} of {sectionQs.length} · {section.name}</span>
              <span className={`card-type-badge badge-${q.difficulty==="easy"?"free":q.difficulty==="hard"?"full":"sectional"}`}>{q.difficulty}</span>
              <span style={{fontSize:'0.78rem',color:'var(--text3)'}}>+{section.marks || 2} / -{section.negative || 0.5}</span>
            </div>
            <div className="q-text">{q.text}</div>
            <div className="options-list">
              {["a","b","c","d"].map(opt => {
                const optText = q[`opt${opt.toUpperCase()}`];
                const isSelected = answers[currKey] === opt;
                return (
                  <div key={opt} className={`option-item ${isSelected?"selected":""}`} onClick={()=>selectOption(opt)}>
                    <div className="option-letter">{opt.toUpperCase()}</div>
                    <div className="option-text">{optText}</div>
                  </div>
                );
              })}
            </div>

            <div className="q-actions">
              <button className="btn btn-ghost btn-sm" onClick={()=>{setAnswers(a=>{const n={...a};delete n[currKey];return n;})}}>Clear Response</button>
              <button className={`btn btn-sm ${marked[currKey]?"btn-gold":"btn-outline"}`} onClick={toggleMark}>
                {marked[currKey]?"🔖 Marked":"🔖 Mark for Review"}
              </button>
              <div style={{flex:1}}/>
              <button className="btn btn-ghost btn-sm" onClick={()=>currentQ>0?navigate(currentSection,currentQ-1):currentSection>0&&navigate(currentSection-1,test.sections[currentSection-1].questions.length-1)} disabled={currentSection===0&&currentQ===0}>← Prev</button>
              <button className="btn btn-primary btn-sm" onClick={()=>{
                if(currentQ<sectionQs.length-1) navigate(currentSection,currentQ+1);
                else if(currentSection<test.sections.length-1) navigate(currentSection+1,0);
              }} disabled={currentSection===test.sections.length-1&&currentQ===sectionQs.length-1}>Next →</button>
            </div>
          </div>
        </div>

        {/* Right sidebar: question navigator */}
        <div className="question-nav-sidebar">
          <div className="q-number-header">Question Navigator</div>
          <div style={{marginBottom:'0.75rem'}}>
            {test.sections.map((sec, si) => (
              <div key={sec.id} style={{marginBottom:'1rem'}}>
                <div style={{fontSize:'0.72rem',fontWeight:700,color:'var(--text3)',marginBottom:'6px'}}>{sec.name}</div>
                <div className="q-grid">
                  {sec.questions.map((qid, qi) => {
                    const k = qKey(si, qi);
                    const isCurr = si===currentSection && qi===currentQ;
                    const isAns = !!answers[k];
                    const isMrk = !!marked[k];
                    const isVis = visited.has(k);
                    return (
                      <div key={k} className={`q-btn ${isCurr?"current":isAns?"answered":isMrk?"marked":isVis?"visited":""}`} onClick={()=>navigate(si,qi)}>
                        {si===0?qi+1:test.sections.slice(0,si).reduce((a,s)=>a+s.questions.length,0)+qi+1}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div style={{fontSize:'0.72rem', color:'var(--text3)'}}>
            <div style={{display:'flex',gap:'6px',alignItems:'center',marginBottom:'4px'}}><div style={{width:12,height:12,background:'var(--green)',borderRadius:3}}></div> Answered ({answered})</div>
            <div style={{display:'flex',gap:'6px',alignItems:'center',marginBottom:'4px'}}><div style={{width:12,height:12,background:'var(--accent2)',borderRadius:3}}></div> Marked ({Object.values(marked).filter(Boolean).length})</div>
            <div style={{display:'flex',gap:'6px',alignItems:'center',marginBottom:'4px'}}><div style={{width:12,height:12,background:'var(--accent)',borderRadius:3}}></div> Current</div>
            <div style={{display:'flex',gap:'6px',alignItems:'center'}}><div style={{width:12,height:12,background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:3}}></div> Not visited</div>
          </div>
        </div>
      </div>

      {showSubmitModal && (
        <div className="modal-overlay">
          <div className="modal" style={{maxWidth:400}}>
            <div className="modal-header">
              <div className="modal-title">Submit Test?</div>
              <button className="modal-close" onClick={()=>setShowSubmitModal(false)}>✕</button>
            </div>
            <div style={{marginBottom:'1.5rem'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem',textAlign:'center',marginBottom:'1rem'}}>
                <div><div style={{fontSize:'1.5rem',fontWeight:800,color:'var(--green)',fontFamily:'Syne,sans-serif'}}>{answered}</div><div style={{fontSize:'0.75rem',color:'var(--text3)'}}>Answered</div></div>
                <div><div style={{fontSize:'1.5rem',fontWeight:800,color:'var(--gold)',fontFamily:'Syne,sans-serif'}}>{Object.values(marked).filter(Boolean).length}</div><div style={{fontSize:'0.75rem',color:'var(--text3)'}}>Marked</div></div>
                <div><div style={{fontSize:'1.5rem',fontWeight:800,color:'var(--text3)',fontFamily:'Syne,sans-serif'}}>{totalQ-answered}</div><div style={{fontSize:'0.75rem',color:'var(--text3)'}}>Unanswered</div></div>
              </div>
              <p style={{fontSize:'0.875rem',color:'var(--text2)'}}>Are you sure you want to submit? You cannot change your answers after submission.</p>
            </div>
            <div style={{display:'flex',gap:'0.75rem'}}>
              <button className="btn btn-ghost" style={{flex:1}} onClick={()=>setShowSubmitModal(false)}>Continue Test</button>
              <button className="btn btn-danger" style={{flex:1}} onClick={handleSubmit}>Submit Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── RESULT PAGE ─────────────────────────────────────────────────────────────
function ResultPage({ test, attempt, onBack, user }) {
  const [tab, setTab] = useState("overview");
  const pct = Math.round((attempt.score / attempt.total)*100);
  const sortedLB = [...LEADERBOARD].sort((a,b)=>b.score-a.score).map((u,i)=>({...u, rank:i+1}));

  return (
    <div className="app">
      <style>{CSS}</style>
      <nav className="nav">
        <Logo />
        <button className="btn btn-ghost" onClick={onBack}>← Back to Tests</button>
      </nav>
      <div className="main-wrap" style={{maxWidth:900}}>
        <div className="result-hero">
          <div style={{fontSize:'0.85rem',color:'var(--text3)',marginBottom:'0.5rem'}}>{test.name}</div>
          <div className="result-score">{attempt.score}</div>
          <div className="result-total">/ {attempt.total} marks</div>
          <div className="result-rank">🏆 All India Rank: <b style={{color:'var(--gold)'}}>#{attempt.rank}</b> out of {attempt.totalAttempts?.toLocaleString()} students</div>
          <div style={{marginTop:'1rem',fontSize:'0.85rem',color:'var(--text3)'}}>
            ✅ {attempt.correct} Correct · ❌ {attempt.wrong} Wrong · ⭕ {attempt.unattempted} Skipped · ⏱ {attempt.timeTaken} min
          </div>
        </div>

        <div className="tabs">
          {["overview","analysis","leaderboard","solutions"].map(t=>(
            <div key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</div>
          ))}
        </div>

        {tab === "overview" && (
          <div className="grid-2" style={{gap:'1.5rem'}}>
            <div className="panel">
              <div className="panel-header"><div className="panel-title">Score Breakdown</div></div>
              <div className="panel-body">
                <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
                  <div style={{fontSize:'3rem',fontWeight:800,color:pct>=60?'var(--green)':pct>=40?'var(--gold)':'var(--red)',fontFamily:'Syne,sans-serif'}}>{pct}%</div>
                  <div style={{color:'var(--text3)',fontSize:'0.85rem'}}>Overall Percentile</div>
                </div>
                <div className="analysis-bar-wrap">
                  <div className="analysis-bar-label"><span>Correct</span><span style={{color:'var(--green)'}}>{attempt.correct} qs</span></div>
                  <div className="analysis-bar-bg"><div className="analysis-bar-fill bar-green" style={{width:`${(attempt.correct/(attempt.correct+attempt.wrong+attempt.unattempted))*100}%`}}></div></div>
                </div>
                <div className="analysis-bar-wrap">
                  <div className="analysis-bar-label"><span>Wrong</span><span style={{color:'var(--red)'}}>{attempt.wrong} qs</span></div>
                  <div className="analysis-bar-bg"><div className="analysis-bar-fill bar-red" style={{width:`${(attempt.wrong/(attempt.correct+attempt.wrong+attempt.unattempted))*100}%`}}></div></div>
                </div>
                <div className="analysis-bar-wrap">
                  <div className="analysis-bar-label"><span>Skipped</span><span style={{color:'var(--gold)'}}>{attempt.unattempted} qs</span></div>
                  <div className="analysis-bar-bg"><div className="analysis-bar-fill bar-gold" style={{width:`${(attempt.unattempted/(attempt.correct+attempt.wrong+attempt.unattempted))*100}%`}}></div></div>
                </div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-header"><div className="panel-title">Performance vs Toppers</div></div>
              <div className="panel-body">
                {[
                  {label:"Your Score", val:attempt.score, max:attempt.total, color:'var(--accent)'},
                  {label:"Topper Score", val:66, max:attempt.total, color:'var(--green)'},
                  {label:"Average Score", val:Math.round(attempt.total*0.45), max:attempt.total, color:'var(--gold)'},
                ].map(item=>(
                  <div key={item.label} className="analysis-bar-wrap">
                    <div className="analysis-bar-label"><span>{item.label}</span><span style={{color:item.color}}>{item.val}</span></div>
                    <div className="analysis-bar-bg"><div className="analysis-bar-fill" style={{width:`${(item.val/item.max)*100}%`,background:item.color}}></div></div>
                  </div>
                ))}
                <div className="divider" />
                <div style={{fontSize:'0.85rem',color:'var(--text2)'}}>
                  ⏱ Time Taken: <b>{attempt.timeTaken} min</b> / {test.totalDuration} min<br/>
                  📊 Speed: <b>{Math.round((attempt.correct+attempt.wrong)/(attempt.timeTaken||1)*10)/10} Qs/min</b>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "analysis" && (
          <div className="panel">
            <div className="panel-header"><div className="panel-title">Section-wise Analysis</div></div>
            <div className="panel-body">
              {test.sections.map((sec, i) => {
                const secCorrect = Math.floor(sec.questions.length * 0.6);
                const secWrong = Math.floor(sec.questions.length * 0.15);
                const secSkip = sec.questions.length - secCorrect - secWrong;
                const secScore = secCorrect*(sec.marks||2) - secWrong*(sec.negative||0.5);
                return (
                  <div key={sec.id} style={{marginBottom:'1.5rem',paddingBottom:'1.5rem',borderBottom: i<test.sections.length-1?'1px solid var(--border)':'none'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.75rem'}}>
                      <div style={{fontWeight:600}}>{sec.name}</div>
                      <div style={{fontSize:'0.875rem',color:'var(--accent)',fontWeight:700}}>{secScore.toFixed(1)}/{sec.questions.length*(sec.marks||2)}</div>
                    </div>
                    <div style={{display:'flex',gap:'1rem',fontSize:'0.8rem',marginBottom:'0.75rem'}}>
                      <span style={{color:'var(--green)'}}>✅ {secCorrect} correct</span>
                      <span style={{color:'var(--red)'}}>❌ {secWrong} wrong</span>
                      <span style={{color:'var(--text3)'}}>⭕ {secSkip} skipped</span>
                    </div>
                    <div className="analysis-bar-bg">
                      <div style={{display:'flex',height:'8px',borderRadius:'20px',overflow:'hidden'}}>
                        <div style={{width:`${(secCorrect/sec.questions.length)*100}%`,background:'var(--green)'}}></div>
                        <div style={{width:`${(secWrong/sec.questions.length)*100}%`,background:'var(--red)'}}></div>
                        <div style={{flex:1,background:'var(--gold)',opacity:0.5}}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "leaderboard" && (
          <div className="panel">
            <div className="panel-header"><div className="panel-title">All India Leaderboard</div><span style={{fontSize:'0.8rem',color:'var(--text3)'}}>Top {sortedLB.length} students</span></div>
            <div>
              {sortedLB.map((u, i) => (
                <div key={i} className={`lb-row ${u.name===user?.name?"lb-you":""}`}>
                  <div className={`lb-rank ${i===0?"rank-1":i===1?"rank-2":i===2?"rank-3":"rank-other"}`}>{i+1}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:'0.9rem'}}>{u.name} {u.name===user?.name&&<span style={{color:'var(--accent)',fontSize:'0.75rem'}}>(You)</span>}</div>
                    <div style={{fontSize:'0.75rem',color:'var(--text3)'}}>{u.city}</div>
                  </div>
                  <div className="lb-score">{u.score}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "solutions" && (
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            {test.sections.flatMap(sec => 
              sec.questions.map(qid => {
                const q = INITIAL_QUESTIONS.find(x=>x.id===qid);
                if (!q) return null;
                return (
                  <div key={qid} className="panel">
                    <div className="panel-body">
                      <div style={{fontWeight:600,marginBottom:'1rem',lineHeight:1.6}}>{q.text}</div>
                      <div className="options-list">
                        {["a","b","c","d"].map(opt=>(
                          <div key={opt} className={`option-item ${opt===q.correct?"correct":""}`}>
                            <div className="option-letter">{opt.toUpperCase()}</div>
                            <div className="option-text">{q[`opt${opt.toUpperCase()}`]}</div>
                          </div>
                        ))}
                      </div>
                      {q.explanation && (
                        <div style={{marginTop:'1rem',padding:'0.85rem',background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:'8px',fontSize:'0.875rem',color:'var(--text2)'}}>
                          💡 <b style={{color:'var(--green)'}}>Explanation:</b> {q.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel({ user, onLogout }) {
  const [page, setPage] = useState("dashboard");
  const [users, setUsers] = useState(INITIAL_USERS);
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [tests, setTests] = useState(INITIAL_TESTS);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type="success") => {
    setToast({msg,type}); setTimeout(()=>setToast(null), 3000);
  };

  const updateUser = (id, patch) => { setUsers(us=>us.map(u=>u.id===id?{...u,...patch}:u)); };
  const updateTest = (id, patch) => { setTests(ts=>ts.map(t=>t.id===id?{...t,...patch}:t)); };

  const stats = {
    pending: users.filter(u=>u.status==="pending").length,
    approved: users.filter(u=>u.status==="approved").length,
    total: users.length,
    questions: questions.length,
    published: tests.filter(t=>t.status==="published").length,
    inStore: tests.filter(t=>t.status==="store").length,
  };

  const sidebarItems = [
    { icon:"📊", label:"Dashboard", key:"dashboard" },
    { icon:"👥", label:"Users", key:"users" },
    { icon:"✍️", label:"Question Bank", key:"questions" },
    { icon:"📝", label:"Create Question", key:"create-question" },
    { icon:"🗂️", label:"Test Builder", key:"create-test" },
    { icon:"📦", label:"Store", key:"store" },
    { icon:"📤", label:"Published", key:"published" },
    { icon:"⚙️", label:"Settings", key:"settings" },
  ];

  return (
    <div className="app">
      <style>{CSS}</style>
      <nav className="nav">
        <Logo />
        <div className="nav-links">
          <span style={{fontSize:'0.8rem',color:'var(--text3)'}}>Admin Console</span>
          <div style={{width:1,height:20,background:'var(--border)'}}/>
          <span style={{fontSize:'0.85rem',color:'var(--text2)'}}>🛡 {user.name}</span>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      {toast && (
        <div style={{position:'fixed',top:'70px',right:'20px',zIndex:500,minWidth:280}}>
          <div className={`alert alert-${toast.type}`}>{toast.msg}</div>
        </div>
      )}

      <div className="dashboard-layout">
        <div className="sidebar">
          <div className="sidebar-label">Navigation</div>
          {sidebarItems.map(item=>(
            <div key={item.key} className={`sidebar-item ${page===item.key?"active":""}`} onClick={()=>setPage(item.key)}>
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.key==="users" && stats.pending > 0 && (
                <span style={{marginLeft:'auto',background:'var(--red)',color:'#fff',fontSize:'0.65rem',fontWeight:700,padding:'1px 6px',borderRadius:10}}>{stats.pending}</span>
              )}
              {item.key==="store" && stats.inStore > 0 && (
                <span style={{marginLeft:'auto',background:'var(--accent)',color:'#fff',fontSize:'0.65rem',fontWeight:700,padding:'1px 6px',borderRadius:10}}>{stats.inStore}</span>
              )}
            </div>
          ))}
        </div>

        <div className="dashboard-content">
          {page === "dashboard" && <AdminDashboard stats={stats} tests={tests} users={users} />}
          {page === "users" && <AdminUsers users={users} onUpdate={updateUser} onToast={showToast} />}
          {page === "questions" && <AdminQuestions questions={questions} onDelete={id=>setQuestions(q=>q.filter(x=>x.id!==id))} onToast={showToast} />}
          {page === "create-question" && <CreateQuestion questions={questions} setQuestions={setQuestions} onToast={showToast} onDone={()=>setPage("questions")} />}
          {page === "create-test" && <CreateTest questions={questions} tests={tests} setTests={setTests} onToast={showToast} onDone={()=>setPage("store")} />}
          {page === "store" && <AdminStore tests={tests} onPublish={id=>{updateTest(id,{status:"published"});showToast("Test published successfully!");}} onEdit={id=>setPage("create-test")} onDelete={id=>setTests(t=>t.filter(x=>x.id!==id))} />}
          {page === "published" && <AdminPublished tests={tests} onUnpublish={id=>{updateTest(id,{status:"store"});showToast("Test moved back to store.");}} />}
          {page === "settings" && <AdminSettings />}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ stats, tests, users }) {
  return (
    <div>
      <div style={{marginBottom:'1.5rem'}}>
        <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.5rem',fontWeight:800}}>Dashboard</div>
        <div style={{color:'var(--text3)',fontSize:'0.875rem'}}>Welcome back, Admin</div>
      </div>
      <div className="stats-row">
        <div className="stat-card stat-gold"><div className="stat-card-icon">⏳</div><div className="stat-card-num">{stats.pending}</div><div className="stat-card-label">Pending Approvals</div></div>
        <div className="stat-card stat-green"><div className="stat-card-icon">✅</div><div className="stat-card-num">{stats.approved}</div><div className="stat-card-label">Approved Students</div></div>
        <div className="stat-card stat-blue"><div className="stat-card-icon">📝</div><div className="stat-card-num">{stats.questions}</div><div className="stat-card-label">Questions in Bank</div></div>
        <div className="stat-card stat-blue"><div className="stat-card-icon">📤</div><div className="stat-card-num">{stats.published}</div><div className="stat-card-label">Published Tests</div></div>
        <div className="stat-card"><div className="stat-card-icon">📦</div><div className="stat-card-num">{stats.inStore}</div><div className="stat-card-label">Tests in Store</div></div>
        <div className="stat-card"><div className="stat-card-icon">👥</div><div className="stat-card-num">{stats.total}</div><div className="stat-card-label">Total Users</div></div>
      </div>

      <div className="grid-2" style={{gap:'1.5rem'}}>
        <div className="panel">
          <div className="panel-header"><div className="panel-title">Recent Registrations</div></div>
          <div>
            {users.slice(0,4).map(u=>(
              <div key={u.id} style={{display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.75rem 1rem',borderBottom:'1px solid var(--border)'}}>
                <div style={{width:36,height:36,borderRadius:'50%',background:'var(--bg3)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontFamily:'Syne,sans-serif',color:'var(--accent)',fontSize:'0.9rem'}}>{u.name[0]}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:'0.875rem'}}>{u.name}</div>
                  <div style={{fontSize:'0.75rem',color:'var(--text3)'}}>{u.exam}</div>
                </div>
                <span className={`status-badge status-${u.status}`}>{u.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-header"><div className="panel-title">Test Pipeline</div></div>
          <div>
            {tests.map(t=>(
              <div key={t.id} style={{display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.75rem 1rem',borderBottom:'1px solid var(--border)'}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:'0.875rem',marginBottom:'2px'}}>{t.name}</div>
                  <div style={{fontSize:'0.75rem',color:'var(--text3)'}}>{t.examId} · {t.type}</div>
                </div>
                <span className={`status-badge status-${t.status}`}>{t.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminUsers({ users, onUpdate, onToast }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const filtered = users.filter(u => {
    if (filter !== "all" && u.status !== filter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.5rem',flexWrap:'wrap',gap:'1rem'}}>
        <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.5rem',fontWeight:800}}>User Management</div>
        <input className="form-input" style={{maxWidth:260}} placeholder="🔍 Search users..." value={search} onChange={e=>setSearch(e.target.value)} />
      </div>
      <div className="toggle-wrap" style={{marginBottom:'1.25rem',display:'inline-flex'}}>
        {["all","pending","approved","rejected"].map(f=>(
          <div key={f} className={`toggle-item ${filter===f?"active":""}`} onClick={()=>setFilter(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}</div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Name</th><th>Email</th><th>Phone</th><th>Exam</th><th>City</th><th>Status</th><th>Joined</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(u=>(
                <tr key={u.id}>
                  <td><b>{u.name}</b></td>
                  <td style={{fontSize:'0.8rem'}}>{u.email}</td>
                  <td>{u.phone}</td>
                  <td><span className="tag">{u.exam}</span></td>
                  <td>{u.city}</td>
                  <td><span className={`status-badge status-${u.status}`}>{u.status}</span></td>
                  <td style={{fontSize:'0.8rem'}}>{u.createdAt}</td>
                  <td>
                    <div style={{display:'flex',gap:'4px',flexWrap:'wrap'}}>
                      {u.status==="pending" && <>
                        <button className="btn btn-success btn-sm" onClick={()=>{onUpdate(u.id,{status:"approved"});onToast(`${u.name} approved!`);}}>Approve</button>
                        <button className="btn btn-danger btn-sm" onClick={()=>{onUpdate(u.id,{status:"rejected"});onToast(`${u.name} rejected.`,'error');}}>Reject</button>
                      </>}
                      {u.status==="approved" && <button className="btn btn-sm" style={{background:'var(--bg3)',color:'var(--text2)',border:'1px solid var(--border)'}} onClick={()=>{onUpdate(u.id,{status:"inactive"});onToast(`${u.name} deactivated.`,'error');}}>Deactivate</button>}
                      {(u.status==="rejected"||u.status==="inactive") && <button className="btn btn-outline btn-sm" onClick={()=>{onUpdate(u.id,{status:"approved"});onToast(`${u.name} re-activated!`);}}>Reactivate</button>}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length===0 && <tr><td colSpan={8} style={{textAlign:'center',padding:'2rem',color:'var(--text3)'}}>No users found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminQuestions({ questions, onDelete, onToast }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const exams = ["All",...new Set(questions.map(q=>q.exam))];
  const filtered = questions.filter(q => {
    if (filter !== "All" && q.exam !== filter) return false;
    if (search && !q.text.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.5rem',flexWrap:'wrap',gap:'1rem'}}>
        <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.5rem',fontWeight:800}}>Question Bank <span style={{fontSize:'1rem',color:'var(--text3)',fontWeight:400}}>({questions.length} questions)</span></div>
        <input className="form-input" style={{maxWidth:280}} placeholder="🔍 Search questions..." value={search} onChange={e=>setSearch(e.target.value)} />
      </div>
      <div className="filter-chips" style={{marginBottom:'1.25rem'}}>
        {exams.map(e=><div key={e} className={`chip ${filter===e?"active":""}`} onClick={()=>setFilter(e)}>{e}</div>)}
      </div>
      <div className="table-card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Question</th><th>Subject</th><th>Topic</th><th>Difficulty</th><th>Exam</th><th>Correct</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(q=>(
                <tr key={q.id}>
                  <td style={{maxWidth:300,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{q.text}</td>
                  <td>{q.subject}</td>
                  <td style={{fontSize:'0.8rem'}}>{q.topic}</td>
                  <td><span className={`card-difficulty diff-${q.difficulty}`}>{q.difficulty}</span></td>
                  <td><span className="tag">{q.exam}</span></td>
                  <td style={{color:'var(--green)',fontWeight:700}}>{q.correct?.toUpperCase()}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={()=>{onDelete(q.id);onToast("Question deleted.",'error');}}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CreateQuestion({ questions, setQuestions, onToast, onDone }) {
  const [form, setForm] = useState({ subject:"", topic:"", exam:"", difficulty:"medium", text:"", optA:"", optB:"", optC:"", optD:"", correct:"a", explanation:"" });
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const topics = TOPICS_MAP[form.subject] || [];

  const submit = () => {
    if (!form.text || !form.optA || !form.optB || !form.optC || !form.optD || !form.subject || !form.exam) {
      return alert("Please fill all required fields.");
    }
    const newQ = { id:"q"+Date.now(), ...form, createdBy:"admin", createdAt:new Date().toISOString().split("T")[0] };
    setQuestions(q=>[...q, newQ]);
    onToast("Question added to bank!");
    onDone();
  };

  return (
    <div style={{maxWidth:760}}>
      <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.5rem',fontWeight:800,marginBottom:'1.5rem'}}>Create New Question</div>
      <div className="panel">
        <div className="panel-body">
          <div className="grid-3" style={{marginBottom:'1rem'}}>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Subject *</label>
              <select className="form-select" value={form.subject} onChange={set("subject")}>
                <option value="">-- Select --</option>
                {SUBJECTS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Topic *</label>
              <select className="form-select" value={form.topic} onChange={set("topic")}>
                <option value="">-- Select --</option>
                {topics.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Exam *</label>
              <select className="form-select" value={form.exam} onChange={set("exam")}>
                <option value="">-- Select --</option>
                {EXAMS.map(e=><option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Difficulty</label>
            <div style={{display:'flex',gap:'0.5rem'}}>
              {["easy","medium","hard"].map(d=>(
                <div key={d} className={`correct-radio-item ${form.difficulty===d?"selected":""}`} onClick={()=>setForm(f=>({...f,difficulty:d}))}>
                  {d==="easy"?"🟢":d==="medium"?"🟡":"🔴"} {d}
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Question Text *</label>
            <textarea className="form-input" rows={3} style={{resize:'vertical'}} placeholder="Enter the question..." value={form.text} onChange={set("text")} />
          </div>
          <div className="options-grid">
            {["A","B","C","D"].map(opt=>(
              <div key={opt} className="form-group" style={{marginBottom:0}}>
                <label className="form-label">Option {opt} *</label>
                <div className="option-input-row">
                  <div className="option-prefix">{opt}</div>
                  <input className="form-input" placeholder={`Option ${opt}`} value={form[`opt${opt}`]} onChange={set(`opt${opt}`)} />
                </div>
              </div>
            ))}
          </div>
          <div className="form-group" style={{marginTop:'1rem'}}>
            <label className="form-label">Correct Answer *</label>
            <div className="correct-radio">
              {["a","b","c","d"].map(o=>(
                <div key={o} className={`correct-radio-item ${form.correct===o?"selected":""}`} onClick={()=>setForm(f=>({...f,correct:o}))}>
                  ✓ Option {o.toUpperCase()}
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Explanation (Optional)</label>
            <textarea className="form-input" rows={2} style={{resize:'vertical'}} placeholder="Explain why the answer is correct..." value={form.explanation} onChange={set("explanation")} />
          </div>
          <div style={{display:'flex',gap:'0.75rem',marginTop:'0.5rem'}}>
            <button className="btn btn-primary" onClick={submit}>Add to Question Bank</button>
            <button className="btn btn-ghost" onClick={onDone}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateTest({ questions, tests, setTests, onToast, onDone }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name:"", examId:"", type:"full", description:"", difficulty:"medium",
    cardColor:"#4F6EF7", cardStyle:"gradient",
    markingScheme:{ positive:2, negative:0.5 },
    sections:[{ id:"s"+Date.now(), name:"Section 1", duration:30, questions:[], marks:2, negative:0.5 }]
  });
  const [currentSection, setCurrentSection] = useState(0);
  const [qSearch, setQSearch] = useState("");
  const [qFilter, setQFilter] = useState("All");

  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const setScheme = k => e => setForm(f=>({...f,markingScheme:{...f.markingScheme,[k]:parseFloat(e.target.value)||0}}));

  const addSection = () => {
    setForm(f=>({...f, sections:[...f.sections,{id:"s"+Date.now(),name:`Section ${f.sections.length+1}`,duration:20,questions:[],marks:f.markingScheme.positive,negative:f.markingScheme.negative}]}));
    setCurrentSection(form.sections.length);
  };
  const removeSection = (idx) => {
    if (form.sections.length <= 1) return;
    const ss = form.sections.filter((_,i)=>i!==idx);
    setForm(f=>({...f,sections:ss}));
    setCurrentSection(Math.min(currentSection, ss.length-1));
  };
  const updateSection = (idx, patch) => {
    setForm(f=>({...f, sections:f.sections.map((s,i)=>i===idx?{...s,...patch}:s)}));
  };
  const toggleQ = (qid) => {
    const sec = form.sections[currentSection];
    const has = sec.questions.includes(qid);
    updateSection(currentSection, {questions: has ? sec.questions.filter(x=>x!==qid) : [...sec.questions, qid]});
  };

  const exams = ["All",...new Set(questions.map(q=>q.exam))];
  const filteredQs = questions.filter(q => {
    if (qFilter !== "All" && q.exam !== qFilter) return false;
    if (qSearch && !q.text.toLowerCase().includes(qSearch.toLowerCase())) return false;
    return true;
  });
  const selectedInSection = form.sections[currentSection]?.questions || [];
  const totalQ = form.sections.reduce((a,s)=>a+s.questions.length,0);

  const submitToStore = () => {
    if (!form.name || !form.examId || totalQ === 0) { alert("Please fill all details and add questions."); return; }
    const newTest = {
      ...form, id:"t"+Date.now(), status:"store", attempts:0, createdAt:new Date().toISOString().split("T")[0],
      totalDuration: form.sections.reduce((a,s)=>a+s.duration,0)
    };
    setTests(t=>[...t, newTest]);
    onToast("Test sent to store for review!"); onDone();
  };

  return (
    <div style={{maxWidth:900}}>
      <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.5rem',flexWrap:'wrap'}}>
        <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.5rem',fontWeight:800}}>Test Builder</div>
        <div style={{display:'flex',gap:'0.5rem'}}>
          {[1,2,3].map(s=>(
            <div key={s} style={{
              padding:'4px 14px', borderRadius:20, fontSize:'0.78rem', fontWeight:700,
              background: step===s?'var(--accent)':'var(--bg3)',
              color: step===s?'#fff':'var(--text3)',
              border: '1px solid '+(step===s?'var(--accent)':'var(--border)')
            }}>Step {s}</div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="panel">
          <div className="panel-header"><div className="panel-title">Basic Details</div></div>
          <div className="panel-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Test Name *</label>
                <input className="form-input" placeholder="e.g. SSC CGL Full Mock Test 5" value={form.name} onChange={set("name")} />
              </div>
              <div className="form-group">
                <label className="form-label">Exam *</label>
                <select className="form-select" value={form.examId} onChange={set("examId")}>
                  <option value="">-- Select Exam --</option>
                  {EXAMS.map(e=><option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Test Type</label>
              <div style={{display:'flex',gap:'1rem'}}>
                {["full","sectional"].map(t=>(
                  <div key={t} className={`correct-radio-item ${form.type===t?"selected":""}`} onClick={()=>setForm(f=>({...f,type:t}))}>
                    {t==="full"?"📄 Full Mock Test":"📌 Sectional Test"}
                  </div>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={2} style={{resize:'vertical'}} value={form.description} onChange={set("description")} placeholder="Brief description shown on card..." />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Difficulty</label>
                <select className="form-select" value={form.difficulty} onChange={set("difficulty")}>
                  <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Card Color</label>
                <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
                  <input type="color" value={form.cardColor} onChange={set("cardColor")} style={{width:40,height:36,border:'1px solid var(--border)',borderRadius:6,background:'none',cursor:'pointer'}} />
                  <select className="form-select" value={form.cardStyle} onChange={set("cardStyle")}>
                    <option value="gradient">Gradient</option><option value="solid">Solid</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,marginBottom:'0.75rem',marginTop:'0.5rem'}}>Marking Scheme</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Marks per Correct Answer</label>
                <input className="form-input" type="number" step="0.5" value={form.markingScheme.positive} onChange={setScheme("positive")} />
              </div>
              <div className="form-group">
                <label className="form-label">Negative Marking</label>
                <input className="form-input" type="number" step="0.25" value={form.markingScheme.negative} onChange={setScheme("negative")} />
              </div>
            </div>
            <button className="btn btn-primary" onClick={()=>setStep(2)}>Next: Add Sections →</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={{display:'flex',gap:'0.75rem',marginBottom:'1rem',flexWrap:'wrap'}}>
            <div style={{flex:1}}>
              <div style={{display:'flex',gap:'0.5rem',borderBottom:'1px solid var(--border)',marginBottom:'1rem',overflowX:'auto'}}>
                {form.sections.map((sec,i)=>(
                  <div key={sec.id} onClick={()=>setCurrentSection(i)}
                    style={{padding:'8px 16px',cursor:'pointer',whiteSpace:'nowrap',fontWeight:600,fontSize:'0.875rem',
                      borderBottom:`2px solid ${i===currentSection?'var(--accent)':'transparent'}`,
                      color:i===currentSection?'var(--accent)':'var(--text3)'}}>
                    {sec.name} <span style={{fontSize:'0.75rem',color:'var(--text3)'}}>{sec.questions.length}q</span>
                    {form.sections.length>1 && <span onClick={e=>{e.stopPropagation();removeSection(i);}} style={{marginLeft:6,opacity:0.5,cursor:'pointer'}}>✕</span>}
                  </div>
                ))}
                <button className="btn btn-ghost btn-sm" style={{alignSelf:'center'}} onClick={addSection}>+ Add Section</button>
              </div>

              <div className="panel">
                <div className="panel-header"><div className="panel-title">Section: {form.sections[currentSection]?.name}</div></div>
                <div className="panel-body">
                  <div className="form-row" style={{marginBottom:'0.75rem'}}>
                    <div className="form-group" style={{marginBottom:0}}>
                      <label className="form-label">Section Name</label>
                      <input className="form-input" value={form.sections[currentSection]?.name} onChange={e=>updateSection(currentSection,{name:e.target.value})} />
                    </div>
                    <div className="form-group" style={{marginBottom:0}}>
                      <label className="form-label">Duration (minutes)</label>
                      <input className="form-input" type="number" value={form.sections[currentSection]?.duration} onChange={e=>updateSection(currentSection,{duration:parseInt(e.target.value)||0})} />
                    </div>
                  </div>
                  <div style={{fontWeight:600,fontSize:'0.875rem',marginBottom:'0.75rem'}}>
                    Questions in this section: <b style={{color:'var(--accent)'}}>{selectedInSection.length}</b>
                  </div>
                  <div style={{display:'flex',gap:'0.5rem',marginBottom:'0.75rem',flexWrap:'wrap'}}>
                    <input className="form-input" style={{maxWidth:240}} placeholder="🔍 Filter questions..." value={qSearch} onChange={e=>setQSearch(e.target.value)} />
                    <select className="form-select" style={{maxWidth:160}} value={qFilter} onChange={e=>setQFilter(e.target.value)}>
                      {exams.map(e=><option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                  <div style={{maxHeight:300,overflowY:'auto',border:'1px solid var(--border)',borderRadius:8}}>
                    {filteredQs.map(q=>{
                      const sel = selectedInSection.includes(q.id);
                      return (
                        <div key={q.id} onClick={()=>toggleQ(q.id)} style={{
                          display:'flex',alignItems:'flex-start',gap:'0.75rem',padding:'0.75rem 1rem',
                          cursor:'pointer',borderBottom:'1px solid var(--border)',
                          background:sel?'rgba(79,110,247,0.08)':'transparent',
                          transition:'background 0.15s'
                        }}>
                          <input type="checkbox" checked={sel} readOnly style={{marginTop:3}} />
                          <div style={{flex:1}}>
                            <div style={{fontSize:'0.875rem',marginBottom:'3px',lineHeight:1.4}}>{q.text}</div>
                            <div style={{fontSize:'0.75rem',color:'var(--text3)'}}>{q.subject} · {q.topic} · {q.exam}</div>
                          </div>
                          <span className={`card-difficulty diff-${q.difficulty}`}>{q.difficulty}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{display:'flex',gap:'0.75rem'}}>
            <button className="btn btn-ghost" onClick={()=>setStep(1)}>← Back</button>
            <button className="btn btn-primary" onClick={()=>setStep(3)}>Next: Review →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="panel" style={{marginBottom:'1rem'}}>
            <div className="panel-header"><div className="panel-title">Test Summary</div></div>
            <div className="panel-body">
              <div className="grid-2" style={{marginBottom:'1rem'}}>
                <div>
                  <div style={{fontSize:'0.8rem',color:'var(--text3)'}}>Test Name</div>
                  <div style={{fontWeight:600}}>{form.name || "—"}</div>
                </div>
                <div>
                  <div style={{fontSize:'0.8rem',color:'var(--text3)'}}>Exam</div>
                  <div style={{fontWeight:600}}>{form.examId || "—"}</div>
                </div>
                <div>
                  <div style={{fontSize:'0.8rem',color:'var(--text3)'}}>Type</div>
                  <div style={{fontWeight:600}}>{form.type}</div>
                </div>
                <div>
                  <div style={{fontSize:'0.8rem',color:'var(--text3)'}}>Total Duration</div>
                  <div style={{fontWeight:600}}>{form.sections.reduce((a,s)=>a+s.duration,0)} min</div>
                </div>
                <div>
                  <div style={{fontSize:'0.8rem',color:'var(--text3)'}}>Total Questions</div>
                  <div style={{fontWeight:600}}>{totalQ}</div>
                </div>
                <div>
                  <div style={{fontSize:'0.8rem',color:'var(--text3)'}}>Marking</div>
                  <div style={{fontWeight:600}}>+{form.markingScheme.positive} / -{form.markingScheme.negative}</div>
                </div>
              </div>
              <div style={{fontWeight:600,marginBottom:'0.75rem'}}>Sections ({form.sections.length})</div>
              {form.sections.map((sec,i)=>(
                <div key={sec.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.6rem 0.75rem',background:'var(--bg3)',borderRadius:8,marginBottom:'0.5rem'}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:'0.875rem'}}>{sec.name}</div>
                    <div style={{fontSize:'0.75rem',color:'var(--text3)'}}>{sec.duration} min · {sec.questions.length} questions</div>
                  </div>
                  <div style={{fontSize:'0.8rem',color:sec.questions.length>0?'var(--green)':'var(--red)'}}>
                    {sec.questions.length > 0 ? `✓ ${sec.questions.length} qs` : "⚠ No questions"}
                  </div>
                </div>
              ))}
              {totalQ === 0 && <div className="alert alert-error">⚠ Please add at least one question to the test.</div>}
            </div>
          </div>
          <div style={{display:'flex',gap:'0.75rem'}}>
            <button className="btn btn-ghost" onClick={()=>setStep(2)}>← Back</button>
            <button className="btn btn-primary" onClick={submitToStore} disabled={totalQ===0}>📦 Submit to Store</button>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminStore({ tests, onPublish, onEdit, onDelete }) {
  const store = tests.filter(t => t.status === "store");
  return (
    <div>
      <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.5rem',fontWeight:800,marginBottom:'1.5rem'}}>Store <span style={{fontSize:'1rem',color:'var(--text3)',fontWeight:400}}>({store.length} tests pending review)</span></div>
      {store.length===0 ? (
        <div className="empty-state"><div className="empty-icon">📦</div><p>No tests in store. Create a test to get started.</p></div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          {store.map(t=>(
            <div key={t.id} className="panel">
              <div className="panel-body">
                <div style={{display:'flex',alignItems:'flex-start',gap:'1rem',flexWrap:'wrap'}}>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,marginBottom:'4px'}}>{t.name}</div>
                    <div style={{fontSize:'0.8rem',color:'var(--text3)',marginBottom:'0.75rem'}}>{t.examId} · {t.type} · {t.totalDuration} min · {t.sections?.reduce((a,s)=>a+s.questions.length,0)} questions</div>
                    <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
                      {t.sections?.map(sec=>(
                        <span key={sec.id} className="tag">{sec.name}: {sec.questions.length}q / {sec.duration}m</span>
                      ))}
                    </div>
                  </div>
                  <div style={{display:'flex',gap:'0.5rem',flexShrink:0}}>
                    <button className="btn btn-ghost btn-sm" onClick={()=>onEdit(t.id)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>onDelete(t.id)}>Delete</button>
                    <button className="btn btn-success btn-sm" onClick={()=>onPublish(t.id)}>📤 Publish</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminPublished({ tests, onUnpublish }) {
  const published = tests.filter(t=>t.status==="published");
  return (
    <div>
      <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.5rem',fontWeight:800,marginBottom:'1.5rem'}}>Published Tests <span style={{fontSize:'1rem',color:'var(--text3)',fontWeight:400}}>({published.length})</span></div>
      {published.length===0 ? (
        <div className="empty-state"><div className="empty-icon">📤</div><p>No published tests yet.</p></div>
      ) : (
        <div className="table-card">
          <div className="table-wrap">
            <table>
              <thead><tr><th>Test Name</th><th>Exam</th><th>Type</th><th>Questions</th><th>Duration</th><th>Attempts</th><th>Actions</th></tr></thead>
              <tbody>
                {published.map(t=>(
                  <tr key={t.id}>
                    <td><b>{t.name}</b></td>
                    <td><span className="tag">{t.examId}</span></td>
                    <td><span className={`card-type-badge ${t.type==="full"?"badge-full":"badge-sectional"}`}>{t.type}</span></td>
                    <td>{t.sections?.reduce((a,s)=>a+s.questions.length,0)}</td>
                    <td>{t.totalDuration} min</td>
                    <td>{(t.attempts||0).toLocaleString()}</td>
                    <td>
                      <button className="btn btn-sm" style={{background:'var(--bg3)',border:'1px solid var(--border)',color:'var(--text2)'}} onClick={()=>onUnpublish(t.id)}>↩ Unpublish</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminSettings() {
  return (
    <div style={{maxWidth:600}}>
      <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.5rem',fontWeight:800,marginBottom:'1.5rem'}}>Platform Settings</div>
      <div className="panel" style={{marginBottom:'1rem'}}>
        <div className="panel-header"><div className="panel-title">Platform Info</div></div>
        <div className="panel-body">
          <div className="form-group"><label className="form-label">Platform Name</label><input className="form-input" defaultValue="ExamPaper" /></div>
          <div className="form-group"><label className="form-label">Support Email</label><input className="form-input" defaultValue="support@exampaper.in" /></div>
          <div className="form-group"><label className="form-label">Max Attempts per Test</label><input className="form-input" type="number" defaultValue="3" /></div>
          <button className="btn btn-primary">Save Changes</button>
        </div>
      </div>
      <div className="panel">
        <div className="panel-header"><div className="panel-title">Database Schema Reference</div></div>
        <div className="panel-body">
          <div style={{fontSize:'0.8rem',color:'var(--text3)',marginBottom:'0.5rem'}}>Supabase Tables</div>
          {["users","questions","tests","test_questions","attempts","answers","subjects","topics","exams"].map(t=>(
            <span key={t} className="tag" style={{marginRight:6,marginBottom:6}}>{t}</span>
          ))}
          <div className="alert alert-info" style={{marginTop:'1rem',fontSize:'0.8rem'}}>
            All tables are connected via Supabase with Row Level Security (RLS). Admin role bypasses RLS policies. Student access requires approved status.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function ExamPaper() {
  const [user, setUser] = useState(null);
  const [testInProgress, setTestInProgress] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [resultTest, setResultTest] = useState(null);

  const handleAuth = u => setUser(u);
  const handleLogout = () => { setUser(null); setTestInProgress(null); setTestResult(null); };

  const handleStartTest = test => {
    setTestInProgress(test);
    setTestResult(null);
    setResultTest(null);
  };

  const handleFinish = result => {
    setTestResult(result);
    setResultTest(testInProgress);
    setTestInProgress(null);
  };

  if (!user) return <AuthPage onAuth={handleAuth} />;

  if (user.status === "pending") return <PendingPage user={user} onLogout={handleLogout} />;

  if (testInProgress) {
    return <MockTestEngine test={testInProgress} user={user} onFinish={handleFinish} />;
  }

  if (testResult && resultTest) {
    return (
      <div className="app">
        <style>{CSS}</style>
        <ResultPage
          test={resultTest}
          attempt={{...testResult, totalAttempts: resultTest.attempts+1, timeTaken: resultTest.totalDuration}}
          user={user}
          onBack={()=>{setTestResult(null);setResultTest(null);}}
        />
      </div>
    );
  }

  if (user.role === "admin") return <AdminPanel user={user} onLogout={handleLogout} />;

  return <StudentLanding user={user} onStartTest={handleStartTest} onLogout={handleLogout} onViewResult={()=>{}} />;
}
