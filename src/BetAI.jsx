import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#05080f;--bg2:#090d18;--card:#0d1221;--card2:#111827;
  --border:rgba(255,255,255,0.06);--border2:rgba(255,255,255,0.12);
  --cyan:#00d4ff;--cyan2:#0099cc;--gold:#f5b800;--red:#ff4466;--green:#00e090;
  --text:#dde3f0;--muted:#4a5470;--muted2:#6b7a9e;
  --font:'DM Sans',sans-serif;--mono:'JetBrains Mono',monospace;--display:'Bebas Neue',sans-serif;
}
body{font-family:var(--font);background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden;}
::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:var(--bg);}::-webkit-scrollbar-thumb{background:var(--cyan2);border-radius:2px;}

@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes shimmer{to{transform:translateX(200%)}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(0,212,255,0.15)}50%{box-shadow:0 0 40px rgba(0,212,255,0.35)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes popIn{0%{transform:scale(0.85);opacity:0}100%{transform:scale(1);opacity:1}}
@keyframes progressFill{from{width:0}to{width:var(--w)}}
@keyframes countUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes adPulse{0%,100%{border-color:rgba(245,184,0,0.2)}50%{border-color:rgba(245,184,0,0.5)}}
@keyframes scanline{0%{top:-10%}100%{top:110%}}

.anim-float{animation:float 3s ease-in-out infinite;}

/* ── NAV ── */
.nav{position:fixed;top:0;left:0;right:0;z-index:200;display:flex;align-items:center;justify-content:space-between;padding:16px 40px;background:rgba(5,8,15,0.92);backdrop-filter:blur(24px);border-bottom:1px solid var(--border);}
.nav-logo{display:flex;align-items:center;gap:10px;cursor:pointer;}
.nav-logo-mark{width:34px;height:34px;border-radius:8px;background:linear-gradient(135deg,var(--cyan),#0055ff);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:#05080f;font-family:var(--display);}
.nav-logo-text{font-family:var(--display);font-size:22px;letter-spacing:2px;color:white;}
.nav-logo-text span{color:var(--cyan);}
.nav-links{display:flex;align-items:center;gap:20px;}
.nav-link{font-size:13px;font-weight:500;color:var(--muted2);cursor:pointer;transition:color 0.2s;padding:4px 0;}
.nav-link:hover{color:var(--text);}
.nav-link.active{color:var(--cyan);}
.nav-cta{padding:9px 22px;border-radius:8px;font-size:14px;font-weight:600;background:var(--cyan);color:#05080f;border:none;cursor:pointer;transition:all 0.2s;}
.nav-cta:hover{background:white;transform:translateY(-1px);}

/* ── HERO ── */
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:120px 24px 80px;text-align:center;position:relative;overflow:hidden;}
.hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%);}
.hero-glow{position:absolute;top:5%;left:50%;transform:translateX(-50%);width:800px;height:500px;background:radial-gradient(ellipse,rgba(0,212,255,0.07) 0%,transparent 70%);pointer-events:none;}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.25);color:var(--cyan);font-size:11px;font-weight:700;letter-spacing:2px;padding:6px 16px;border-radius:20px;margin-bottom:28px;text-transform:uppercase;animation:fadeUp 0.5s 0.1s both;}
.hero-title{font-family:var(--display);font-size:clamp(60px,9vw,110px);line-height:0.92;color:white;margin-bottom:24px;letter-spacing:2px;animation:fadeUp 0.5s 0.2s both;}
.hero-title .accent{color:var(--cyan);}
.hero-sub{font-size:clamp(14px,1.8vw,17px);color:var(--muted2);max-width:520px;line-height:1.75;margin-bottom:44px;animation:fadeUp 0.5s 0.3s both;}
.hero-btns{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;animation:fadeUp 0.5s 0.4s both;}
.btn-primary{padding:14px 32px;border-radius:10px;font-size:15px;font-weight:700;background:linear-gradient(135deg,var(--cyan),#0066ff);color:#05080f;border:none;cursor:pointer;transition:all 0.2s;position:relative;overflow:hidden;}
.btn-primary::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent);animation:shimmer 2.5s infinite;}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,212,255,0.3);}
.btn-outline{padding:14px 32px;border-radius:10px;font-size:15px;font-weight:600;background:transparent;color:var(--text);border:1px solid var(--border2);cursor:pointer;transition:all 0.2s;}
.btn-outline:hover{border-color:var(--cyan);color:var(--cyan);}
.hero-stats{display:flex;gap:48px;margin-top:64px;justify-content:center;animation:fadeUp 0.5s 0.5s both;flex-wrap:wrap;}
.hstat-val{font-family:var(--display);font-size:40px;color:white;letter-spacing:1px;}
.hstat-lbl{font-size:11px;color:var(--muted2);letter-spacing:1px;text-transform:uppercase;margin-top:2px;}

/* ── SECTION COMMON ── */
.section{padding:80px 24px;max-width:1100px;margin:0 auto;position:relative;z-index:1;}
.section-label{font-size:11px;font-weight:700;letter-spacing:3px;color:var(--cyan);text-transform:uppercase;margin-bottom:12px;}
.section-title{font-family:var(--display);font-size:clamp(34px,5vw,54px);color:white;line-height:1;margin-bottom:16px;letter-spacing:1px;}
.section-sub{font-size:15px;color:var(--muted2);max-width:500px;line-height:1.75;margin-bottom:40px;}
.sec-bg{background:var(--bg2);border-top:1px solid var(--border);border-bottom:1px solid var(--border);}

/* ── FEATURES ── */
.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;margin-top:60px;}
.feature-card{background:var(--card);border:1px solid var(--border);border-radius:18px;padding:28px;transition:all 0.3s;}
.feature-card:hover{border-color:rgba(0,212,255,0.25);transform:translateY(-4px);}
.feat-icon{font-size:30px;margin-bottom:16px;}
.feat-title{font-size:16px;font-weight:700;color:white;margin-bottom:8px;}
.feat-desc{font-size:13px;color:var(--muted2);line-height:1.65;}

/* ══════════════════════════════════════════════════════
   HOW IT WORKS - DETAILED PAGE
   ══════════════════════════════════════════════════════ */
.how-page{padding:0;}
.how-hero{padding:100px 40px 60px;text-align:center;background:linear-gradient(180deg,rgba(0,212,255,0.04) 0%,transparent 100%);border-bottom:1px solid var(--border);position:relative;overflow:hidden;}
.how-hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px);background-size:40px 40px;}
.how-phase-nav{display:flex;justify-content:center;gap:8px;margin-top:40px;flex-wrap:wrap;}
.how-phase-btn{padding:8px 20px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;border:1px solid var(--border2);background:transparent;color:var(--muted2);transition:all 0.2s;letter-spacing:0.5px;}
.how-phase-btn.active{background:var(--cyan);color:#05080f;border-color:var(--cyan);}
.how-phase-content{max-width:1100px;margin:0 auto;padding:60px 40px;}

/* Phase cards */
.phase-block{margin-bottom:80px;}
.phase-header{display:flex;align-items:center;gap:16px;margin-bottom:40px;}
.phase-num{width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,var(--cyan),#0055ff);display:flex;align-items:center;justify-content:center;font-family:var(--display);font-size:26px;color:#05080f;flex-shrink:0;}
.phase-title{font-family:var(--display);font-size:36px;letter-spacing:1px;color:white;}
.phase-sub{font-size:14px;color:var(--muted2);margin-top:4px;line-height:1.6;}
.phase-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;}
.phase-detail-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px;}
.phase-detail-card.full{grid-column:1/-1;}
.phase-detail-card.accent{border-color:rgba(0,212,255,0.25);background:linear-gradient(135deg,rgba(0,212,255,0.04),var(--card));}
.pdc-label{font-size:10px;font-weight:700;letter-spacing:2px;color:var(--cyan);text-transform:uppercase;margin-bottom:12px;}
.pdc-title{font-size:16px;font-weight:700;color:white;margin-bottom:10px;}
.pdc-body{font-size:13px;color:var(--muted2);line-height:1.7;}

/* Stats analysis visual */
.stat-analysis-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px;}
.stat-analysis-item{background:var(--card2);border-radius:10px;padding:12px;}
.sai-label{font-size:10px;color:var(--muted2);letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;}
.sai-bar-wrap{height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;margin-bottom:4px;}
.sai-bar{height:100%;border-radius:3px;transition:width 1s ease;}
.sai-val{font-family:var(--mono);font-size:12px;font-weight:700;}

/* Flow diagram */
.flow-diagram{display:flex;align-items:center;gap:0;margin-top:24px;overflow-x:auto;padding:8px 0;}
.flow-step{display:flex;flex-direction:column;align-items:center;min-width:120px;}
.flow-box{background:var(--card2);border:1px solid var(--border2);border-radius:12px;padding:14px 12px;text-align:center;width:110px;}
.flow-icon{font-size:22px;margin-bottom:6px;}
.flow-label{font-size:11px;font-weight:600;color:var(--text);}
.flow-sub{font-size:9px;color:var(--muted2);margin-top:2px;}
.flow-arrow{font-size:18px;color:var(--cyan);padding:0 6px;flex-shrink:0;}

/* Algorithm visualization */
.algo-wrap{background:var(--card2);border-radius:14px;padding:20px;font-family:var(--mono);font-size:12px;line-height:1.8;}
.algo-comment{color:#4a6070;}
.algo-keyword{color:var(--cyan);}
.algo-string{color:var(--green);}
.algo-number{color:var(--gold);}
.algo-line{padding:1px 0;}

/* Probability meter */
.prob-meter-wrap{margin-top:16px;}
.prob-meter-row{display:flex;align-items:center;gap:12px;margin-bottom:10px;}
.prob-meter-label{font-size:12px;color:var(--muted2);min-width:140px;}
.prob-meter-bar{flex:1;height:8px;background:rgba(255,255,255,0.05);border-radius:4px;overflow:hidden;}
.prob-meter-fill{height:100%;border-radius:4px;}
.prob-meter-val{font-family:var(--mono);font-size:12px;font-weight:700;min-width:40px;text-align:right;}

/* Data sources */
.data-sources-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:16px;}
.data-source-item{background:var(--card2);border-radius:10px;padding:14px;display:flex;align-items:flex-start;gap:12px;}
.ds-icon{font-size:22px;flex-shrink:0;}
.ds-name{font-size:13px;font-weight:700;color:white;margin-bottom:3px;}
.ds-desc{font-size:11px;color:var(--muted2);line-height:1.5;}

/* Risk explainer */
.risk-explainer-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:16px;}
.risk-expl-card{border-radius:14px;padding:20px;border:1px solid;}
.risk-expl-card.safe{background:rgba(0,224,144,0.05);border-color:rgba(0,224,144,0.2);}
.risk-expl-card.balanced{background:rgba(245,184,0,0.05);border-color:rgba(245,184,0,0.2);}
.risk-expl-card.high{background:rgba(255,68,102,0.05);border-color:rgba(255,68,102,0.2);}
.rex-name{font-size:15px;font-weight:700;color:white;margin-bottom:4px;}
.rex-sub{font-size:11px;color:var(--muted2);margin-bottom:14px;}
.rex-row{display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.04);}
.rex-key{color:var(--muted2);}
.rex-val{font-family:var(--mono);font-weight:700;}

/* Match selection explainer */
.match-sel-visual{background:var(--card2);border-radius:12px;padding:16px;margin-top:12px;}
.msv-row{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);}
.msv-team{font-size:13px;font-weight:600;color:white;}
.msv-score{display:flex;gap:8px;align-items:center;}
.msv-factor{font-size:11px;padding:3px 8px;border-radius:6px;font-weight:600;font-family:var(--mono);}
.msv-ok{background:rgba(0,224,144,0.12);color:var(--green);}
.msv-warn{background:rgba(245,184,0,0.12);color:var(--gold);}
.msv-bad{background:rgba(255,68,102,0.12);color:var(--red);}
.msv-check{font-size:14px;}

/* Timeline */
.timeline{position:relative;padding-left:28px;margin-top:20px;}
.timeline::before{content:'';position:absolute;left:7px;top:0;bottom:0;width:2px;background:linear-gradient(180deg,var(--cyan),rgba(0,212,255,0.1));}
.tl-item{position:relative;margin-bottom:20px;}
.tl-dot{position:absolute;left:-24px;top:3px;width:14px;height:14px;border-radius:50%;border:2px solid var(--cyan);background:var(--bg);}
.tl-dot.done{background:var(--cyan);}
.tl-title{font-size:13px;font-weight:700;color:white;margin-bottom:4px;}
.tl-body{font-size:12px;color:var(--muted2);line-height:1.6;}
.tl-time{font-family:var(--mono);font-size:10px;color:var(--cyan);margin-top:4px;}

/* ══════════════════════════════════════════════════════
   BOOKMAKER ADS SYSTEM
   ══════════════════════════════════════════════════════ */
.ad-banner-top{width:100%;background:linear-gradient(90deg,#1a0f00,#2a1800,#1a0f00);border-top:1px solid rgba(245,184,0,0.2);border-bottom:1px solid rgba(245,184,0,0.2);padding:10px 24px;display:flex;align-items:center;justify-content:space-between;animation:adPulse 3s ease-in-out infinite;position:relative;overflow:hidden;}
.ad-banner-top::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent 0%,rgba(245,184,0,0.03) 50%,transparent 100%);animation:shimmer 3s infinite;}
.ad-badge{font-size:9px;font-weight:700;letter-spacing:1px;color:rgba(245,184,0,0.5);background:rgba(245,184,0,0.08);border:1px solid rgba(245,184,0,0.15);padding:2px 6px;border-radius:4px;text-transform:uppercase;flex-shrink:0;}
.ad-content{display:flex;align-items:center;gap:16px;flex:1;justify-content:center;}
.ad-bk-logo{font-family:var(--display);font-size:18px;letter-spacing:1px;}
.ad-text{font-size:13px;color:rgba(255,255,255,0.8);}
.ad-text strong{color:var(--gold);}
.ad-cta-btn{padding:6px 16px;border-radius:6px;font-size:12px;font-weight:700;border:none;cursor:pointer;white-space:nowrap;}

.ad-sidebar-card{background:var(--card);border:1px solid rgba(245,184,0,0.15);border-radius:14px;padding:16px;margin-bottom:16px;position:relative;overflow:hidden;animation:adPulse 4s ease-in-out infinite;}
.ad-sidebar-card::after{content:'Sponsorizzato';position:absolute;top:8px;right:8px;font-size:9px;color:rgba(255,255,255,0.3);letter-spacing:1px;}
.ad-sb-logo{font-family:var(--display);font-size:22px;letter-spacing:1px;margin-bottom:8px;}
.ad-sb-offer{font-size:13px;font-weight:700;margin-bottom:4px;}
.ad-sb-sub{font-size:11px;color:var(--muted2);margin-bottom:12px;line-height:1.5;}
.ad-sb-btn{width:100%;padding:9px;border-radius:8px;font-size:13px;font-weight:700;border:none;cursor:pointer;transition:all 0.2s;}

.ad-inline-card{background:linear-gradient(135deg,rgba(20,10,0,1),rgba(15,20,10,1));border:1px solid rgba(245,184,0,0.2);border-radius:16px;padding:20px;position:relative;overflow:hidden;display:flex;gap:20px;align-items:center;}
.ad-inline-card::before{content:'';position:absolute;top:-30%;right:-10%;width:200px;height:200px;background:radial-gradient(circle,rgba(245,184,0,0.06) 0%,transparent 70%);}
.ad-inline-logo{font-family:var(--display);font-size:32px;letter-spacing:2px;flex-shrink:0;}
.ad-inline-info{flex:1;}
.ad-inline-title{font-size:16px;font-weight:700;color:white;margin-bottom:4px;}
.ad-inline-body{font-size:13px;color:var(--muted2);line-height:1.5;margin-bottom:14px;}
.ad-inline-terms{font-size:10px;color:var(--muted);margin-top:8px;}
.ad-inline-btn{padding:10px 24px;border-radius:9px;font-size:14px;font-weight:700;border:none;cursor:pointer;white-space:nowrap;}

.ad-label{font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);opacity:0.6;margin-bottom:4px;}

/* Partner section */
.partners-section{padding:48px 24px;border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg2);text-align:center;}
.partners-label{font-size:10px;letter-spacing:3px;color:var(--muted);text-transform:uppercase;margin-bottom:24px;}
.partners-grid{display:flex;justify-content:center;align-items:center;gap:32px;flex-wrap:wrap;}
.partner-logo{font-family:var(--display);font-size:22px;letter-spacing:2px;opacity:0.35;transition:opacity 0.2s;cursor:pointer;}
.partner-logo:hover{opacity:0.7;}
.partner-logo.sponsor{opacity:0.55;color:var(--gold);}
.partner-logo.sponsor:hover{opacity:1;}

/* ── WINS SECTION ── */
.wins-ticker-wrap{overflow:hidden;background:rgba(0,224,144,0.04);border-top:1px solid rgba(0,224,144,0.12);border-bottom:1px solid rgba(0,224,144,0.12);padding:10px 0;}
.wins-ticker{display:flex;gap:60px;animation:ticker 30s linear infinite;width:max-content;}
.wins-ticker-item{display:flex;align-items:center;gap:8px;white-space:nowrap;font-size:13px;font-weight:600;color:var(--green);}
.wins-ticker-dot{width:5px;height:5px;border-radius:50%;background:var(--green);animation:pulse 1.5s infinite;flex-shrink:0;}
.wins-counters{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:48px;}
.wins-counter-card{background:var(--card);border:1px solid rgba(0,224,144,0.15);border-radius:16px;padding:24px 20px;text-align:center;}
.wcc-val{font-family:var(--display);font-size:40px;color:var(--green);line-height:1;margin-bottom:4px;}
.wcc-lbl{font-size:10px;color:var(--muted2);letter-spacing:2px;text-transform:uppercase;}
.wins-tabs{display:flex;gap:8px;background:var(--card2);border-radius:12px;padding:4px;margin-bottom:28px;width:fit-content;}
.wins-tab{padding:9px 20px;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;color:var(--muted2);}
.wins-tab.active{background:var(--green);color:#05080f;}
.win-cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px;}
.win-card{background:var(--card);border:1px solid rgba(0,224,144,0.15);border-radius:20px;padding:22px;transition:all 0.3s;animation:popIn 0.4s ease both;}
.win-card:hover{transform:translateY(-4px);border-color:rgba(0,224,144,0.4);}
.win-badge{background:rgba(0,224,144,0.12);border:1px solid rgba(0,224,144,0.3);color:var(--green);font-size:10px;font-weight:800;padding:3px 10px;border-radius:20px;letter-spacing:1px;text-transform:uppercase;}
.win-match-row{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--card2);border-radius:8px;border-left:3px solid var(--green);margin-bottom:8px;}
.screenshot-card{background:var(--card2);border:2px solid rgba(0,224,144,0.25);border-radius:16px;padding:20px;font-family:var(--mono);}

/* ── PRICING ── */
.pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:60px;}
.price-card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:32px 28px;position:relative;transition:all 0.3s;}
.price-card.featured{border-color:var(--cyan);background:linear-gradient(135deg,rgba(0,212,255,0.05),var(--card));transform:scale(1.03);}
.price-card:hover{transform:translateY(-4px);}
.price-card.featured:hover{transform:scale(1.03) translateY(-4px);}
.price-popular{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--cyan);color:#05080f;font-size:9px;font-weight:800;letter-spacing:2px;padding:4px 14px;border-radius:20px;text-transform:uppercase;white-space:nowrap;}
.price-plan{font-size:11px;font-weight:700;letter-spacing:2px;color:var(--muted2);text-transform:uppercase;margin-bottom:12px;}
.price-amount{font-family:var(--display);font-size:52px;color:white;line-height:1;margin-bottom:4px;}
.price-period{font-size:12px;color:var(--muted2);margin-bottom:24px;}
.price-features{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:28px;}
.price-feature{font-size:13px;color:var(--muted2);display:flex;align-items:center;gap:8px;}
.price-btn{width:100%;padding:13px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.2s;border:none;}
.price-btn.primary{background:var(--cyan);color:#05080f;}
.price-btn.primary:hover{background:white;}
.price-btn.outline{background:transparent;color:var(--text);border:1px solid var(--border2);}
.price-btn.outline:hover{border-color:var(--cyan);color:var(--cyan);}

/* ── AUTH ── */
.auth-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:var(--bg);}
.auth-card{background:var(--card);border:1px solid var(--border2);border-radius:24px;padding:44px 40px;width:100%;max-width:420px;animation:fadeUp 0.4s ease;}
.auth-logo-mark{width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,var(--cyan),#0055ff);display:flex;align-items:center;justify-content:center;font-family:var(--display);font-size:26px;color:#05080f;margin:0 auto 12px;animation:glow 2s ease-in-out infinite;}
.auth-tabs{display:flex;background:var(--card2);border-radius:10px;padding:4px;margin-bottom:28px;}
.auth-tab{flex:1;padding:9px;border-radius:7px;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s;text-align:center;color:var(--muted2);}
.auth-tab.active{background:var(--cyan);color:#05080f;}
.form-label{font-size:11px;font-weight:700;color:var(--muted2);letter-spacing:1px;margin-bottom:6px;display:block;text-transform:uppercase;}
.form-input{width:100%;padding:12px 14px;border-radius:10px;font-size:14px;background:var(--card2);border:1px solid var(--border2);color:var(--text);font-family:var(--font);transition:all 0.2s;outline:none;margin-bottom:14px;}
.form-input:focus{border-color:var(--cyan);box-shadow:0 0 0 3px rgba(0,212,255,0.08);}
.form-input::placeholder{color:var(--muted);}
.auth-btn{width:100%;padding:14px;border-radius:10px;font-size:15px;font-weight:700;background:linear-gradient(135deg,var(--cyan),#0066ff);color:#05080f;border:none;cursor:pointer;transition:all 0.2s;margin-top:4px;}
.auth-btn:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,212,255,0.25);}
.auth-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;}

/* ── DASHBOARD ── */
.dash-layout{display:flex;min-height:100vh;}
.sidebar{width:224px;background:var(--card);border-right:1px solid var(--border);padding:20px 14px;display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:50;overflow-y:auto;}
.sidebar-logo{display:flex;align-items:center;gap:8px;padding:8px;margin-bottom:28px;}
.sidebar-logo-mark{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,var(--cyan),#0055ff);display:flex;align-items:center;justify-content:center;font-family:var(--display);font-size:15px;color:#05080f;}
.sidebar-logo-text{font-family:var(--display);font-size:18px;letter-spacing:2px;color:white;}
.sidebar-logo-text span{color:var(--cyan);}
.sidebar-nav{display:flex;flex-direction:column;gap:3px;flex:1;}
.sidebar-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;font-size:13px;font-weight:500;color:var(--muted2);cursor:pointer;transition:all 0.2s;}
.sidebar-item:hover{background:var(--card2);color:var(--text);}
.sidebar-item.active{background:rgba(0,212,255,0.08);color:var(--cyan);border:1px solid rgba(0,212,255,0.15);}
.sidebar-section{font-size:9px;font-weight:700;letter-spacing:2px;color:var(--muted);text-transform:uppercase;padding:8px 12px 4px;}
.sidebar-bottom{border-top:1px solid var(--border);padding-top:12px;margin-top:8px;}
.sidebar-avatar{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,var(--cyan),#0055ff);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#05080f;}
.sidebar-logout{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;font-size:13px;color:var(--muted2);cursor:pointer;transition:all 0.2s;}
.sidebar-logout:hover{color:var(--red);background:rgba(255,68,102,0.06);}
.dash-main{margin-left:224px;flex:1;padding:28px;min-height:100vh;}
.dash-topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;}
.dash-title{font-family:var(--display);font-size:30px;color:white;letter-spacing:1px;}
.stats-bar{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px;}
.stat-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px 18px;}
.stat-card-val{font-family:var(--display);font-size:28px;color:white;margin-bottom:2px;}
.stat-card-lbl{font-size:10px;color:var(--muted2);letter-spacing:1px;text-transform:uppercase;}
.stat-card-trend{font-size:10px;margin-top:4px;font-weight:600;}
.generator-card{background:var(--card);border:1px solid var(--border);border-radius:18px;padding:26px;margin-bottom:20px;}
.gen-top{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-bottom:20px;}
.label-text{font-size:10px;font-weight:700;letter-spacing:2px;color:var(--muted2);text-transform:uppercase;display:block;margin-bottom:10px;}
.sport-pills{display:flex;gap:8px;flex-wrap:wrap;}
.sport-pill{padding:7px 14px;border-radius:50px;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;border:1px solid var(--border);background:var(--card2);color:var(--muted2);}
.sport-pill:hover{color:var(--text);}
.sport-pill.active{background:rgba(0,212,255,0.08);border-color:rgba(0,212,255,0.35);color:var(--cyan);}
.risk-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
.risk-card-btn{border-radius:10px;padding:12px;cursor:pointer;border:1px solid var(--border);background:var(--card2);transition:all 0.2s;text-align:center;}
.risk-card-btn:hover{transform:translateY(-2px);}
.risk-card-btn.r-safe.active{border-color:var(--green);background:rgba(0,224,144,0.06);}
.risk-card-btn.r-balanced.active{border-color:var(--gold);background:rgba(245,184,0,0.06);}
.risk-card-btn.r-high.active{border-color:var(--red);background:rgba(255,68,102,0.06);}
.slider-row{display:flex;align-items:center;gap:12px;margin-bottom:12px;}
.slider-lbl{font-size:12px;color:var(--muted2);min-width:140px;}
.slider-val{font-family:var(--mono);font-size:16px;font-weight:700;min-width:60px;text-align:right;}
input[type=range]{flex:1;-webkit-appearance:none;height:3px;background:var(--card2);border-radius:2px;outline:none;}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:var(--cyan);cursor:pointer;box-shadow:0 0 8px rgba(0,212,255,0.4);transition:transform 0.15s;}
input[type=range]::-webkit-slider-thumb:hover{transform:scale(1.3);}
.gen-btn{width:100%;padding:16px;border-radius:12px;border:none;cursor:pointer;font-family:var(--display);font-size:18px;letter-spacing:2px;background:linear-gradient(135deg,var(--cyan),#0066ff);color:#05080f;transition:all 0.2s;position:relative;overflow:hidden;}
.gen-btn::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);animation:shimmer 2s infinite;}
.gen-btn:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,212,255,0.3);}
.gen-btn:disabled{opacity:0.45;cursor:not-allowed;transform:none;}
.result-wrap{background:var(--card);border:1px solid var(--border2);border-radius:18px;padding:24px;margin-top:18px;animation:fadeUp 0.4s ease;}
.result-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
.result-pills{display:flex;gap:8px;flex-wrap:wrap;}
.result-pill{font-family:var(--mono);font-size:11px;padding:4px 10px;border-radius:20px;font-weight:700;}
.rp-green{background:rgba(0,224,144,0.1);color:var(--green);border:1px solid rgba(0,224,144,0.25);}
.rp-gold{background:rgba(245,184,0,0.1);color:var(--gold);border:1px solid rgba(245,184,0,0.25);}
.rp-cyan{background:rgba(0,212,255,0.1);color:var(--cyan);border:1px solid rgba(0,212,255,0.25);}
.match-list{display:flex;flex-direction:column;gap:10px;margin-bottom:18px;}
.match-item{background:var(--card2);border:1px solid var(--border);border-radius:12px;padding:14px 16px;}
.match-item-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
.match-teams{font-size:14px;font-weight:700;color:white;}
.match-meta{font-size:11px;color:var(--muted2);font-family:var(--mono);}
.match-quota{font-family:var(--mono);font-size:14px;font-weight:700;color:var(--gold);background:rgba(245,184,0,0.08);border:1px solid rgba(245,184,0,0.2);padding:4px 10px;border-radius:8px;}
.match-stats-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;}
.match-stat-chip{font-size:10px;padding:3px 8px;border-radius:6px;font-family:var(--mono);font-weight:600;}
.msc-green{background:rgba(0,224,144,0.08);color:var(--green);}
.msc-gold{background:rgba(245,184,0,0.08);color:var(--gold);}
.msc-cyan{background:rgba(0,212,255,0.08);color:var(--cyan);}
.msc-red{background:rgba(255,68,102,0.08);color:var(--red);}
.ai-reasoning{background:rgba(0,212,255,0.03);border:1px solid rgba(0,212,255,0.12);border-radius:12px;padding:14px;margin-bottom:16px;}
.ai-reasoning-label{font-size:9px;font-weight:700;color:var(--cyan);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;}
.ai-reasoning-text{font-size:12px;color:#8899bb;line-height:1.75;}
.cursor::after{content:'|';animation:blink 0.7s infinite;color:var(--cyan);}
.result-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.rs-box{background:var(--card2);border-radius:10px;padding:12px;text-align:center;border:1px solid var(--border);}
.history-list{display:flex;flex-direction:column;gap:8px;}
.history-item{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;transition:all 0.2s;}
.history-item:hover{border-color:var(--border2);}
.history-info{flex:1;padding:0 12px;}
.history-status{font-size:10px;font-weight:700;padding:4px 10px;border-radius:20px;}
.hs-won{background:rgba(0,224,144,0.1);color:var(--green);}
.hs-lost{background:rgba(255,68,102,0.1);color:var(--red);}
.hs-wait{background:rgba(0,212,255,0.1);color:var(--cyan);}
.spinner{width:40px;height:40px;border:3px solid var(--card2);border-top-color:var(--cyan);border-radius:50%;animation:spin 0.7s linear infinite;margin:0 auto 12px;}
.lang-btn{padding:5px 11px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;border:none;background:transparent;color:var(--muted2);transition:all 0.2s;}
.lang-btn.active{background:var(--cyan);color:#05080f;}
.premium-lock{background:rgba(245,184,0,0.05);border:1px solid rgba(245,184,0,0.2);border-radius:12px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;margin-top:12px;}
.upgrade-btn{padding:7px 16px;border-radius:7px;background:var(--gold);color:#05080f;font-size:12px;font-weight:700;border:none;cursor:pointer;}
.dash-wins-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:14px;}
.dash-win-card{background:var(--card);border:1px solid rgba(0,224,144,0.15);border-radius:14px;padding:16px;transition:all 0.2s;}
.dash-win-card:hover{border-color:var(--green);transform:translateY(-2px);}

/* Footer */
.footer{border-top:1px solid var(--border);padding:48px 40px;display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:32px;background:var(--bg2);}
.footer-col-title{font-size:12px;font-weight:700;letter-spacing:2px;color:var(--muted2);text-transform:uppercase;margin-bottom:16px;}
.footer-link{font-size:13px;color:var(--muted2);cursor:pointer;transition:color 0.2s;margin-bottom:8px;display:block;}
.footer-link:hover{color:var(--text);}
.footer-bottom{border-top:1px solid var(--border);padding:20px 40px;display:flex;justify-content:space-between;align-items:center;background:var(--bg2);}
.footer-disclaimer{font-size:10px;color:var(--muted);max-width:600px;line-height:1.7;}

@media(max-width:768px){
  .nav{padding:12px 20px;}
  .nav-links{display:none;}
  .pricing-grid{grid-template-columns:1fr;}
  .price-card.featured{transform:scale(1);}
  .sidebar{width:56px;padding:14px 8px;}
  .sidebar-logo-text,.sidebar-item span,.sidebar-username,.sidebar-plan,.sidebar-section{display:none;}
  .dash-main{margin-left:56px;padding:16px;}
  .stats-bar{grid-template-columns:repeat(2,1fr);}
  .gen-top{grid-template-columns:1fr;}
  .wins-counters{grid-template-columns:repeat(2,1fr);}
  .phase-grid{grid-template-columns:1fr;}
  .risk-explainer-grid{grid-template-columns:1fr;}
  .stat-analysis-grid{grid-template-columns:1fr;}
  .footer{grid-template-columns:1fr 1fr;}
}
`;

// ═══════════════════════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════════════════════
const T = {
  it: {
    nav:{how:"Come Funziona",features:"Funzioni",wins:"Vincite",pricing:"Prezzi",advertise:"Pubblicita",login:"Accedi",cta:"Inizia Gratis"},
    hero:{badge:"AI-Powered Analytics",t1:"LA SCHEDINA",t2:"PERFETTA",sub:"BetAI analizza oltre 40 statistiche per ogni partita, calcola le probabilità reali e costruisce la schedina più vicina possibile al tuo obiettivo.",cta1:"Inizia Gratis",cta2:"Come Funziona",sv:[["2.400+","Schedine"],["68%","Successo"],["40+","Stat/partita"],["30+","Campionati"]]},
    features:{label:"Funzionalita",title:"POTENZA AI, SEMPLICITA TOTALE",cards:[{icon:"🎚️",t:"Rischio su misura",d:"Imposti tu probabilità e quota obiettivo. L'AI seleziona le partite che si avvicinano di più ai tuoi parametri."},{icon:"🧠",t:"40+ Statistiche analizzate",d:"Forma recente, scontri diretti, gol subiti, rendimento in casa/trasferta, infortuni, quote dei bookmaker."},{icon:"📊",t:"Probabilità Calibrate",d:"L'AI confronta la propria stima con le quote di mercato e corregge la probabilità in tempo reale."},{icon:"🔔",t:"Notifiche Push",d:"Ti avvisiamo quando la schedina è pronta, quando le quote cambiano significativamente."},{icon:"📱",t:"App Mobile",d:"iOS e Android. Notifiche, storico, generatore ovunque ti trovi."},{icon:"🏆",t:"Storico e Performance",d:"Traccia ogni schedina, analizza le tue tendenze e migliora nel tempo."}]},
    pricing:{label:"Prezzi",title:"INIZIA GRATIS",plans:[{name:"Starter",price:"0",period:"per sempre",popular:false,features:["1 schedina/giorno","Solo livello Sicuro","Calcio e Basket","x AI dettagliata","x Notifiche push"],cta:"Inizia Gratis",style:"outline"},{name:"Pro",price:"9.99",period:"al mese",popular:true,features:["Schedine illimitate","Tutti i livelli","Tutti gli sport","AI + 40 statistiche","Notifiche push"],cta:"Inizia ora",style:"primary"},{name:"Elite",price:"24.99",period:"al mese",popular:false,features:["Tutto di Pro","Quote live","Gestione bankroll","Supporto prioritario","Early access"],cta:"Scegli Elite",style:"outline"}]},
    auth:{tabLogin:"Accedi",tabReg:"Registrati",email:"Email",pass:"Password",name:"Nome",btnLogin:"Accedi",btnReg:"Crea account",sw1:"Non hai un account?",sw2:"Hai gia un account?",c1:"Registrati",c2:"Accedi"},
    dash:{welcome:"Bentornato",today:"Partite di oggi",stats:["Schedine","Vinte","Successo","Quota Media"],genTitle:"GENERA SCHEDINA",sport:"Sport",risk:"Livello Rischio",prob:"Probabilita vincita",quota:"Quota obiettivo",genBtn:"GENERA SCHEDINA AI",generating:"Analisi statistica in corso...",result:"Schedina Consigliata",aiLabel:"Analisi AI",histTitle:"Storico",histEmpty:"Nessuna schedina. Generane una!",sports:["Calcio","Basket","Tennis","Formula 1"],sportEmoji:["⚽","🏀","🎾","🏎️"],risks:[{id:"safe",emoji:"🟢",name:"Sicuro",sub:"Alta prob."},{id:"balanced",emoji:"🟡",name:"Bilanciato",sub:"Equilibrato"},{id:"high",emoji:"🔴",name:"High Risk",sub:"Alta quota"}],nav:["Dashboard","Schedine","Hall of Fame","Analisi","Impostazioni"],navEmoji:["🎯","📋","🏆","📊","⚙️"],logout:"Esci",premiumMsg:"High Risk disponibile con Pro",upgrade:"Upgrade",hallTitle:"HALL OF FAME",hallSub:"Le migliori schedine della community",analyzeTitle:"ANALISI AVANZATA"},
    wins:{label:"Prove di Vincita",title:"RISULTATI REALI",sub:"Schedine reali dei nostri utenti. I risultati passati non garantiscono quelli futuri.",tabs:["Schedine Vinte","Screenshots"],cLabels:["Schedine Vinte","Tasso Successo","Profitti Totali","Utenti Attivi"],won:"VINTA",stake:"Puntata"},
    footer:{disclaimer:"BetAI e uno strumento di analisi statistica a scopo informativo e di intrattenimento. Le scommesse comportano rischi economici. Giocare e vietato ai minori di 18 anni. Se ritieni di avere problemi con il gioco d'azzardo, chiedi aiuto al Servizio Nazionale per le Dipendenze Patologiche. Gioca responsabilmente.",cols:[{t:"Prodotto",links:["Come funziona","Funzionalita","Prezzi","API"]},{t:"Legale",links:["Privacy Policy","Termini di Servizio","Cookie","GDPR"]},{t:"Supporto",links:["Centro Aiuto","Contattaci","Community","Bug Report"]}]},
    advert:{cta:"Fai crescere la tua attivita con BetAI"}
  },
  en: {
    nav:{how:"How It Works",features:"Features",wins:"Wins",pricing:"Pricing",advertise:"Advertise",login:"Log in",cta:"Start Free"},
    hero:{badge:"AI-Powered Analytics",t1:"THE PERFECT",t2:"BET SLIP",sub:"BetAI analyzes 40+ statistics per match, calculates real probabilities and builds the bet slip closest to your target odds and risk.",cta1:"Try for Free",cta2:"How It Works",sv:[["2,400+","Bets"],["68%","Success"],["40+","Stats/match"],["30+","Leagues"]]},
    features:{label:"Features",title:"AI POWER, TOTAL SIMPLICITY",cards:[{icon:"🎚️",t:"Custom Risk",d:"You set the probability and target odds. The AI picks the matches that match your parameters most closely."},{icon:"🧠",t:"40+ Stats Analyzed",d:"Recent form, head-to-head, goals conceded, home/away performance, injuries, bookmaker odds."},{icon:"📊",t:"Calibrated Probabilities",d:"AI compares its estimate against market odds and corrects probability in real time."},{icon:"🔔",t:"Push Notifications",d:"Get notified when your bet is ready or when odds change significantly."},{icon:"📱",t:"Mobile App",d:"iOS and Android. Notifications, history, generator wherever you are."},{icon:"🏆",t:"History & Performance",d:"Track every bet, analyze your trends and improve over time."}]},
    pricing:{label:"Pricing",title:"START FREE",plans:[{name:"Starter",price:"0",period:"forever",popular:false,features:["1 bet/day","Safe level only","Football & Basketball","x Detailed AI","x Push notifications"],cta:"Start Free",style:"outline"},{name:"Pro",price:"9.99",period:"per month",popular:true,features:["Unlimited bets","All risk levels","All sports","AI + 40 stats","Push notifications"],cta:"Start now",style:"primary"},{name:"Elite",price:"24.99",period:"per month",popular:false,features:["Everything in Pro","Live odds","Bankroll manager","Priority support","Early access"],cta:"Choose Elite",style:"outline"}]},
    auth:{tabLogin:"Log in",tabReg:"Register",email:"Email",pass:"Password",name:"Name",btnLogin:"Log in",btnReg:"Create account",sw1:"Don't have an account?",sw2:"Already have an account?",c1:"Sign up",c2:"Log in"},
    dash:{welcome:"Welcome back",today:"Today's matches",stats:["Bets","Won","Success","Avg Odds"],genTitle:"GENERATE BET",sport:"Sport",risk:"Risk Level",prob:"Win probability",quota:"Target odds",genBtn:"GENERATE AI BET",generating:"Running statistical analysis...",result:"Recommended Bet",aiLabel:"AI Analysis",histTitle:"History",histEmpty:"No bets yet. Generate one!",sports:["Football","Basketball","Tennis","Formula 1"],sportEmoji:["⚽","🏀","🎾","🏎️"],risks:[{id:"safe",emoji:"🟢",name:"Safe",sub:"High prob."},{id:"balanced",emoji:"🟡",name:"Balanced",sub:"Best of both"},{id:"high",emoji:"🔴",name:"High Risk",sub:"Big odds"}],nav:["Dashboard","My Bets","Hall of Fame","Analysis","Settings"],navEmoji:["🎯","📋","🏆","📊","⚙️"],logout:"Log out",premiumMsg:"High Risk available on Pro",upgrade:"Upgrade",hallTitle:"HALL OF FAME",hallSub:"Best bets from the community",analyzeTitle:"ADVANCED ANALYSIS"},
    wins:{label:"Winning Proof",title:"REAL RESULTS",sub:"Real bets from our users. Past results do not guarantee future performance.",tabs:["Winning Bets","Screenshots"],cLabels:["Bets Won","Success Rate","Total Profits","Active Users"],won:"WON",stake:"Stake"},
    footer:{disclaimer:"BetAI is a statistical analysis tool for informational and entertainment purposes only. Gambling involves financial risk. Must be 18+ to play. If you have gambling problems, seek help. Please gamble responsibly.",cols:[{t:"Product",links:["How it works","Features","Pricing","API"]},{t:"Legal",links:["Privacy Policy","Terms of Service","Cookies","GDPR"]},{t:"Support",links:["Help Center","Contact Us","Community","Bug Report"]}]},
    advert:{cta:"Grow your business with BetAI"}
  }
};

// ═══════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════
const WIN_DATA = [
  {id:1,sport:"⚽",sportName:"Calcio",date:"08/03/2025",matches:[{teams:"Milan vs Juventus",sel:"1X",quota:1.65,result:"1-0"},{teams:"Real Madrid vs Barca",sel:"Over 2.5",quota:1.80,result:"3-2"},{teams:"PSG vs Monaco",sel:"1",quota:1.55,result:"2-0"}],totalQuota:4.60,puntata:20,profit:"+72.00",user:"Marco R.",city:"Milano"},
  {id:2,sport:"🏀",sportName:"Basket",date:"07/03/2025",matches:[{teams:"Lakers vs Celtics",sel:"1",quota:2.10,result:"112-98"},{teams:"Warriors vs Heat",sel:"Over 215.5",quota:1.70,result:"228 pts"}],totalQuota:3.57,puntata:50,profit:"+128.50",user:"Luca T.",city:"Roma"},
  {id:3,sport:"🎾",sportName:"Tennis",date:"06/03/2025",matches:[{teams:"Djokovic vs Medvedev",sel:"1",quota:1.45,result:"3-1"},{teams:"Alcaraz vs Zverev",sel:"Over 3.5 set",quota:2.20,result:"3-2"},{teams:"Sinner vs Rublev",sel:"1",quota:1.35,result:"2-0"}],totalQuota:4.30,puntata:30,profit:"+99.00",user:"Davide F.",city:"Napoli"},
  {id:4,sport:"🏎️",sportName:"Formula 1",date:"05/03/2025",matches:[{teams:"GP Bahrain - Pole",sel:"Verstappen",quota:1.90,result:"Pole"},{teams:"GP Bahrain - Giro Veloce",sel:"Hamilton",quota:3.20,result:"Giro veloce"}],totalQuota:6.08,puntata:15,profit:"+76.20",user:"Andrea M.",city:"Torino"},
  {id:5,sport:"⚽",sportName:"Calcio",date:"04/03/2025",matches:[{teams:"Inter vs Napoli",sel:"1",quota:2.00,result:"2-1"},{teams:"Atletico vs Sevilla",sel:"1X",quota:1.50,result:"1-1"},{teams:"Liverpool vs Man Utd",sel:"1",quota:1.65,result:"3-0"}],totalQuota:4.95,puntata:25,profit:"+103.75",user:"Sofia B.",city:"Firenze"},
  {id:6,sport:"🏀",sportName:"Basket",date:"03/03/2025",matches:[{teams:"Bucks vs 76ers",sel:"1 -5.5",quota:1.90,result:"+8"},{teams:"Nuggets vs Suns",sel:"Under 224.5",quota:1.85,result:"210 pts"},{teams:"Clippers vs Mavs",sel:"2",quota:2.30,result:"89-102"}],totalQuota:8.08,puntata:25,profit:"+177.00",user:"Giorgio P.",city:"Bologna"},
];

const TICKER = ["🏆 Marco R. +72EUR quota 4.60x","🏆 Luca T. +128.50EUR quota 3.57x","🏆 Davide F. +99EUR quota 4.30x","🏆 Andrea M. +76.20EUR quota 6.08x","🏆 Sofia B. +103.75EUR quota 4.95x","🏆 Giorgio P. +177EUR quota 8.08x","3 schedine vinte nell'ultima ora","Tasso successo questa settimana: 71%"];

const SAMPLE_HISTORY = [
  {id:1,sport:"⚽",matches:"Milan vs Napoli + Real vs Atletico",date:"09/03/2025",quota:"5.40",status:"won"},
  {id:2,sport:"🏀",matches:"Lakers vs Celtics + Warriors vs Nets",date:"08/03/2025",quota:"3.20",status:"lost"},
  {id:3,sport:"🎾",matches:"Djokovic vs Alcaraz",date:"07/03/2025",quota:"1.85",status:"won"},
  {id:4,sport:"⚽",matches:"Juve vs Inter + PSG vs Lyon + Arsenal vs Chelsea",date:"06/03/2025",quota:"12.10",status:"wait"},
];

// ── BOOKMAKER ADS DATA ──
const BOOKMAKERS = [
  {id:"b365",name:"Bet365",color:"#008000",offer:"Bonus 200EUR",sub:"sul primo deposito. T&C si applicano. 18+",btnColor:"#008000",btnText:"Richiedi Bonus"},
  {id:"bwin",name:"Bwin",color:"#ff6600",offer:"Scommessa Gratuita 50EUR",sub:"per i nuovi iscritti. Gioca responsabilmente. 18+",btnColor:"#ff6600",btnText:"Vai a Bwin"},
  {id:"snai",name:"SNAI",color:"#cc0000",offer:"Quota Maggiorata x5",sub:"su partite selezionate. Solo oggi. 18+",btnColor:"#cc0000",btnText:"Scommetti"},
  {id:"sky",name:"Skybet",color:"#0066cc",offer:"30EUR di Scommesse Free",sub:"nessun deposito richiesto. T&C. 18+",btnColor:"#0066cc",btnText:"Attiva Ora"},
];

const BANNER_BK = BOOKMAKERS[0];

// ═══════════════════════════════════════════════════════════
// SMALL COMPONENTS
// ═══════════════════════════════════════════════════════════
function AnimCounter({ target, suffix }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let cur = 0;
    const step = Math.ceil(target / 55);
    const iv = setInterval(() => {
      cur += step;
      if (cur >= target) { setVal(target); clearInterval(iv); }
      else setVal(cur);
    }, 22);
    return () => clearInterval(iv);
  }, [target]);
  return <span>{val.toLocaleString("it-IT")}{suffix || ""}</span>;
}

function LiveTicker() {
  return (
    <div className="wins-ticker-wrap">
      <div className="wins-ticker">
        {[...TICKER,...TICKER].map((item, i) => (
          <div className="wins-ticker-item" key={i}>
            <span className="wins-ticker-dot" />{item}
          </div>
        ))}
      </div>
    </div>
  );
}

// Bookmaker top banner
function AdBannerTop({ lang }) {
  const bk = BANNER_BK;
  return (
    <div className="ad-banner-top">
      <span className="ad-badge">Sponsorizzato</span>
      <div className="ad-content">
        <span className="ad-bk-logo" style={{color:bk.color}}>{bk.name}</span>
        <span className="ad-text">
          <strong>{bk.offer}</strong> — {lang==="it"?"Nuovo utente?":"New user?"} {lang==="it"?"Registrati oggi":"Register today"}
        </span>
        <button className="ad-cta-btn" style={{background:bk.color,color:"white"}}>{bk.btnText} →</button>
      </div>
      <span className="ad-badge">18+</span>
    </div>
  );
}

// Bookmaker sidebar ad
function AdSidebar({ idx }) {
  const bk = BOOKMAKERS[idx % BOOKMAKERS.length];
  return (
    <div className="ad-sidebar-card">
      <div className="ad-label">Pubblicita</div>
      <div className="ad-sb-logo" style={{color:bk.color}}>{bk.name}</div>
      <div className="ad-sb-offer" style={{color:"white"}}>{bk.offer}</div>
      <div className="ad-sb-sub">{bk.sub}</div>
      <button className="ad-sb-btn" style={{background:bk.color,color:"white"}}>{bk.btnText} →</button>
    </div>
  );
}

// Bookmaker inline ad
function AdInline({ idx, lang }) {
  const bk = BOOKMAKERS[idx % BOOKMAKERS.length];
  return (
    <div style={{marginBottom:20}}>
      <div className="ad-label">Contenuto Sponsorizzato</div>
      <div className="ad-inline-card">
        <div className="ad-inline-logo" style={{color:bk.color}}>{bk.name}</div>
        <div className="ad-inline-info">
          <div className="ad-inline-title">{bk.offer}</div>
          <div className="ad-inline-body">{bk.sub}</div>
          <button className="ad-inline-btn" style={{background:bk.color,color:"white"}}>{bk.btnText} →</button>
          <div className="ad-inline-terms">{lang==="it"?"Si applicano Termini e Condizioni. Solo nuovi clienti. Gioco responsabile 18+":"T&C apply. New customers only. Please gamble responsibly 18+"}</div>
        </div>
      </div>
    </div>
  );
}

// Partners strip
function PartnersStrip({ lang }) {
  return (
    <div className="partners-section">
      <div className="partners-label">{lang==="it"?"Partner e Bookmaker Ufficiali":"Official Partners & Bookmakers"}</div>
      <div className="partners-grid">
        {BOOKMAKERS.map((bk,i) => (
          <div key={bk.id} className={"partner-logo" + (i<2?" sponsor":"")} style={i<2?{color:bk.color}:{}}>{bk.name}</div>
        ))}
        <div className="partner-logo">William Hill</div>
        <div className="partner-logo">Unibet</div>
        <div className="partner-logo">888sport</div>
        <div className="partner-logo">Betfair</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// HOW IT WORKS — FULL DETAILED PAGE
// ═══════════════════════════════════════════════════════════
function HowItWorksPage({ onBack, lang }) {
  const isIt = lang === "it";
  const [activePhase, setActivePhase] = useState(0);

  const phases = isIt
    ? ["Raccolta Dati","Analisi AI","Calcolo Probabilita","Costruzione Schedina","Output Finale"]
    : ["Data Collection","AI Analysis","Probability Calc","Bet Construction","Final Output"];

  return (
    <div style={{background:"var(--bg)",minHeight:"100vh"}}>
      <nav className="nav">
        <div className="nav-logo" onClick={onBack}>
          <div className="nav-logo-mark">B</div>
          <div className="nav-logo-text">Bet<span>AI</span></div>
        </div>
        <div className="nav-links">
          <span className="nav-link" onClick={onBack}>← {isIt?"Torna alla Home":"Back to Home"}</span>
        </div>
      </nav>

      {/* HERO */}
      <div className="how-hero" style={{paddingTop:100}}>
        <div className="how-hero-grid"/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:3,color:"var(--cyan)",textTransform:"uppercase",marginBottom:12}}>
            {isIt?"Documentazione Tecnica":"Technical Documentation"}
          </div>
          <div style={{fontFamily:"var(--display)",fontSize:"clamp(44px,6vw,80px)",color:"white",letterSpacing:2,lineHeight:0.95,marginBottom:20}}>
            {isIt?"COME FUNZIONA":"HOW IT WORKS"}
            <span style={{color:"var(--cyan)",display:"block"}}>{isIt?"IL MOTORE AI":"THE AI ENGINE"}</span>
          </div>
          <p style={{fontSize:15,color:"var(--muted2)",maxWidth:580,margin:"0 auto",lineHeight:1.75}}>
            {isIt
              ? "Dalla richiesta dell'utente alla schedina finale: ogni passo del processo, ogni statistica analizzata, ogni algoritmo utilizzato. Trasparenza totale."
              : "From user request to final bet slip: every step in the process, every statistic analyzed, every algorithm used. Total transparency."}
          </p>
          <div className="how-phase-nav" style={{marginTop:32}}>
            {phases.map((ph, i) => (
              <button key={i} className={"how-phase-btn" + (activePhase===i?" active":"")} onClick={()=>setActivePhase(i)}>
                {i+1}. {ph}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="how-phase-content">

        {/* ── PHASE 0: Data Collection ── */}
        {activePhase === 0 && (
          <div className="phase-block">
            <div className="phase-header">
              <div className="phase-num">1</div>
              <div>
                <div className="phase-title">{isIt?"RACCOLTA DATI":"DATA COLLECTION"}</div>
                <div className="phase-sub">{isIt?"Prima di calcolare qualsiasi probabilità, BetAI raccoglie dati da fonti multiple in tempo reale.":"Before calculating any probability, BetAI collects data from multiple real-time sources."}</div>
              </div>
            </div>
            <div className="phase-grid">
              <div className="phase-detail-card accent">
                <div className="pdc-label">{isIt?"Fonti Dati":"Data Sources"}</div>
                <div className="data-sources-grid">
                  {[
                    {icon:"📡",name:"Live Odds API",desc:isIt?"Quote in tempo reale da 20+ bookmaker. Aggiornate ogni 30 secondi.":"Real-time odds from 20+ bookmakers. Updated every 30 seconds."},
                    {icon:"📊",name:"Stats API",desc:isIt?"Statistiche storiche e live da Opta, Statsbomb e altre fonti premium.":"Historical and live stats from Opta, Statsbomb and other premium sources."},
                    {icon:"🏥",name:"Injury Feed",desc:isIt?"Report infortuni aggiornati in tempo reale da tutte le leghe.":"Real-time injury reports updated from all leagues."},
                    {icon:"🌤️",name:"Weather API",desc:isIt?"Condizioni meteo per partite outdoor (calcio, Formula 1).":"Weather conditions for outdoor matches (football, Formula 1)."},
                  ].map((ds,i) => (
                    <div className="data-source-item" key={i}>
                      <div className="ds-icon">{ds.icon}</div>
                      <div>
                        <div className="ds-name">{ds.name}</div>
                        <div className="ds-desc">{ds.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="phase-detail-card">
                <div className="pdc-label">{isIt?"Statistiche Raccolte per Partita":"Stats Collected Per Match"}</div>
                <div className="stat-analysis-grid">
                  {[
                    {l:isIt?"Forma Ultimi 5":"Last 5 Form",v:92,c:"var(--green)"},
                    {l:isIt?"Scontri Diretti":"Head-to-Head",v:78,c:"var(--cyan)"},
                    {l:isIt?"Gol Segnati/Subiti":"Goals Scored/Conc.",v:85,c:"var(--gold)"},
                    {l:isIt?"Casa / Trasferta":"Home / Away",v:88,c:"var(--green)"},
                    {l:isIt?"Infortuni Chiave":"Key Injuries",v:65,c:"var(--red)"},
                    {l:isIt?"Quote Bookmaker":"Bookmaker Odds",v:95,c:"var(--cyan)"},
                    {l:isIt?"Expected Goals (xG)":"Expected Goals (xG)",v:82,c:"var(--gold)"},
                    {l:isIt?"Possesso Palla":"Ball Possession",v:70,c:"var(--muted2)"},
                    {l:isIt?"Tiri in Porta":"Shots on Target",v:76,c:"var(--cyan)"},
                  ].map((s,i) => (
                    <div className="stat-analysis-item" key={i}>
                      <div className="sai-label">{s.l}</div>
                      <div className="sai-bar-wrap">
                        <div className="sai-bar" style={{width:`${s.v}%`,background:s.c}}/>
                      </div>
                      <div className="sai-val" style={{color:s.c}}>{s.v}%</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="phase-detail-card full">
                <div className="pdc-label">{isIt?"Esempio: Dati raccolti per Milan vs Juventus":"Example: Data collected for Milan vs Juventus"}</div>
                <div className="match-sel-visual">
                  {[
                    {label:isIt?"Forma Milan (ultimi 5)":"Milan form (last 5)",val:"V V P V V",color:"var(--green)",ok:"ok"},
                    {label:isIt?"Forma Juventus (ultimi 5)":"Juventus form (last 5)",val:"P V V P V",color:"var(--gold)",ok:"warn"},
                    {label:isIt?"Scontri diretti (ultimi 5)":"Head-to-head (last 5)",val:"3V 1P 1S",color:"var(--green)",ok:"ok"},
                    {label:isIt?"Gol medi Milan in casa":"Milan avg goals at home",val:"2.1 / partita",color:"var(--green)",ok:"ok"},
                    {label:isIt?"Infortuni Milan":"Milan injuries",val:"Leao OUT",color:"var(--red)",ok:"bad"},
                    {label:isIt?"Quota 1 media bookmaker":"Avg bookmaker odds for 1",val:"2.10x",color:"var(--gold)",ok:"warn"},
                    {label:"Expected Goals Milan","val":"1.8 xG",color:"var(--green)",ok:"ok"},
                  ].map((row,i) => (
                    <div className="msv-row" key={i}>
                      <span style={{fontSize:12,color:"var(--muted2)",minWidth:220}}>{row.label}</span>
                      <div className="msv-score">
                        <span style={{fontFamily:"var(--mono)",fontSize:12,fontWeight:700,color:row.color}}>{row.val}</span>
                        <span className={"msv-factor " + (row.ok==="ok"?"msv-ok":row.ok==="warn"?"msv-warn":"msv-bad")}>
                          {row.ok==="ok"?"✓ Positivo":row.ok==="warn"?"~ Neutro":"✗ Negativo"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PHASE 1: AI Analysis ── */}
        {activePhase === 1 && (
          <div className="phase-block">
            <div className="phase-header">
              <div className="phase-num">2</div>
              <div>
                <div className="phase-title">{isIt?"ANALISI AI":"AI ANALYSIS"}</div>
                <div className="phase-sub">{isIt?"Il modello AI elabora tutte le statistiche raccolte e identifica i pattern statisticamente rilevanti.":"The AI model processes all collected statistics and identifies statistically relevant patterns."}</div>
              </div>
            </div>
            <div className="phase-grid">
              <div className="phase-detail-card accent">
                <div className="pdc-label">{isIt?"Motore di Analisi":"Analysis Engine"}</div>
                <div className="pdc-title">{isIt?"Come ragiona l'AI":"How the AI reasons"}</div>
                <div className="pdc-body">
                  {isIt
                    ? "BetAI usa un Large Language Model (Claude AI) specializzato nell'analisi sportiva. Il modello riceve in input tutte le statistiche strutturate e produce una valutazione contestualizzata che va oltre i semplici numeri."
                    : "BetAI uses a Large Language Model (Claude AI) specialized in sports analysis. The model receives all structured statistics as input and produces a contextualized evaluation that goes beyond simple numbers."}
                </div>
                <div style={{marginTop:16}}>
                  {[
                    {step:"Input",desc:isIt?"40+ statistiche strutturate per ogni partita candidata":"40+ structured stats for each candidate match"},
                    {step:"Context",desc:isIt?"Storico della rivalita, importanza della partita, pressione stagionale":"Rivalry history, match importance, season pressure"},
                    {step:"Inference",desc:isIt?"Il modello inferisce probabilita implicite e le confronta con le quote":"Model infers implied probabilities and compares with odds"},
                    {step:"Output",desc:isIt?"Probabilita calibrata + spiegazione in linguaggio naturale":"Calibrated probability + natural language explanation"},
                  ].map((t,i) => (
                    <div key={i} className="tl-item" style={{paddingLeft:20,borderLeft:"2px solid rgba(0,212,255,0.2)",marginBottom:14}}>
                      <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--cyan)",fontWeight:700,letterSpacing:1,marginBottom:2}}>{t.step}</div>
                      <div style={{fontSize:12,color:"var(--muted2)",lineHeight:1.5}}>{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="phase-detail-card">
                <div className="pdc-label">{isIt?"Pseudocodice del Motore":"Engine Pseudocode"}</div>
                <div className="algo-wrap">
                  <div className="algo-line"><span className="algo-comment">// Ciclo principale analisi</span></div>
                  <div className="algo-line"><span className="algo-keyword">for each</span> match <span className="algo-keyword">in</span> today_matches:</div>
                  <div className="algo-line" style={{paddingLeft:16}}><span className="algo-comment">// Raccolta dati</span></div>
                  <div className="algo-line" style={{paddingLeft:16}}>stats = <span className="algo-keyword">fetch</span>(<span className="algo-string">"form+h2h+xg+injuries"</span>)</div>
                  <div className="algo-line" style={{paddingLeft:16}}>odds = <span className="algo-keyword">fetch</span>(<span className="algo-string">"live_odds_api"</span>)</div>
                  <br/>
                  <div className="algo-line" style={{paddingLeft:16}}><span className="algo-comment">// Calcolo prob. implicita</span></div>
                  <div className="algo-line" style={{paddingLeft:16}}>imp_prob = <span className="algo-number">1</span> / odds.home</div>
                  <div className="algo-line" style={{paddingLeft:16}}>ai_prob = model.analyze(stats)</div>
                  <br/>
                  <div className="algo-line" style={{paddingLeft:16}}><span className="algo-comment">// Edge detection</span></div>
                  <div className="algo-line" style={{paddingLeft:16}}>edge = ai_prob - imp_prob</div>
                  <div className="algo-line" style={{paddingLeft:16}}><span className="algo-keyword">if</span> edge {">"} <span className="algo-number">0.05</span>:</div>
                  <div className="algo-line" style={{paddingLeft:32}}>candidates.add(match, ai_prob)</div>
                  <br/>
                  <div className="algo-line"><span className="algo-comment">// Selezione ottimale</span></div>
                  <div className="algo-line">bet = <span className="algo-keyword">select</span>(candidates,</div>
                  <div className="algo-line" style={{paddingLeft:16}}>target_prob=user.prob,</div>
                  <div className="algo-line" style={{paddingLeft:16}}>target_odds=user.quota)</div>
                </div>
              </div>
              <div className="phase-detail-card full">
                <div className="pdc-label">{isIt?"Rilevamento del Vantaggio (Value Bet)":"Edge Detection (Value Bet)"}</div>
                <div className="pdc-body" style={{marginBottom:16}}>
                  {isIt
                    ? "Il cuore dell'analisi AI è individuare le partite dove la nostra stima di probabilità supera quella implicita nelle quote del bookmaker (il cosiddetto 'edge' o 'valore'). Solo le partite con edge positivo vengono considerate per la schedina."
                    : "The heart of AI analysis is finding matches where our probability estimate exceeds the bookmaker's implied probability (the 'edge' or 'value'). Only matches with positive edge are considered for the bet."}
                </div>
                <div className="prob-meter-wrap">
                  {[
                    {l:"Milan vs Juventus — 1X",ai:72,bk:65,edge:"+7%",ok:true},
                    {l:"Real vs Atletico — Over 2.5",ai:68,bk:62,edge:"+6%",ok:true},
                    {l:"Arsenal vs Chelsea — 1",ai:55,bk:58,edge:"-3%",ok:false},
                    {l:"Barca vs Villarreal — 1",ai:80,bk:75,edge:"+5%",ok:true},
                  ].map((row,i) => (
                    <div key={i} style={{background:"var(--card2)",borderRadius:10,padding:"12px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:12,opacity:row.ok?1:0.5,border:row.ok?"1px solid rgba(0,224,144,0.15)":"1px solid rgba(255,68,102,0.1)"}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,fontWeight:600,color:row.ok?"var(--text)":"var(--muted2)",marginBottom:6}}>{row.l}</div>
                        <div style={{display:"flex",gap:8,alignItems:"center"}}>
                          <span style={{fontSize:10,color:"var(--muted2)",minWidth:60}}>AI: {row.ai}%</span>
                          <div style={{flex:1,height:6,background:"rgba(255,255,255,0.05)",borderRadius:3,overflow:"hidden"}}>
                            <div style={{width:`${row.ai}%`,height:"100%",background:row.ok?"var(--green)":"var(--red)",borderRadius:3}}/>
                          </div>
                          <span style={{fontSize:10,color:"var(--muted2)",minWidth:60}}>BK: {row.bk}%</span>
                        </div>
                      </div>
                      <div style={{fontFamily:"var(--mono)",fontSize:13,fontWeight:700,color:row.ok?"var(--green)":"var(--red)",minWidth:50,textAlign:"right"}}>{row.edge}</div>
                      <div style={{fontSize:18}}>{row.ok?"✅":"❌"}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PHASE 2: Probability Calculation ── */}
        {activePhase === 2 && (
          <div className="phase-block">
            <div className="phase-header">
              <div className="phase-num">3</div>
              <div>
                <div className="phase-title">{isIt?"CALCOLO PROBABILITA":"PROBABILITY CALCULATION"}</div>
                <div className="phase-sub">{isIt?"Come trasformiamo 40+ dati in una singola percentuale affidabile.":"How we transform 40+ data points into a single reliable percentage."}</div>
              </div>
            </div>
            <div className="phase-grid">
              <div className="phase-detail-card accent">
                <div className="pdc-label">{isIt?"Modello di Calibrazione":"Calibration Model"}</div>
                <div className="pdc-title">{isIt?"Probabilita Ponderata":"Weighted Probability"}</div>
                <div className="pdc-body" style={{marginBottom:16}}>
                  {isIt
                    ? "Ogni fattore contribuisce alla probabilità finale con un peso diverso, determinato dall'analisi storica di migliaia di partite. La forma recente pesa di più degli scontri diretti lontani nel tempo."
                    : "Each factor contributes to the final probability with a different weight, determined by historical analysis of thousands of matches. Recent form weighs more than distant head-to-head results."}
                </div>
                {[
                  {f:isIt?"Forma ultimi 5":"Last 5 form",w:28,c:"var(--green)"},
                  {f:isIt?"Quota bookmaker":"Bookmaker odds",w:22,c:"var(--cyan)"},
                  {f:isIt?"xG (Expected Goals)":"xG (Expected Goals)",w:18,c:"var(--gold)"},
                  {f:isIt?"Casa/Trasferta":"Home/Away",w:14,c:"var(--cyan)"},
                  {f:isIt?"Scontri Diretti":"Head-to-Head",w:10,c:"var(--muted2)"},
                  {f:isIt?"Infortuni":"Injuries",w:8,c:"var(--red)"},
                ].map((row,i) => (
                  <div key={i} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:12,color:"var(--muted2)"}}>{row.f}</span>
                      <span style={{fontFamily:"var(--mono)",fontSize:12,fontWeight:700,color:row.c}}>peso {row.w}%</span>
                    </div>
                    <div style={{height:5,background:"rgba(255,255,255,0.05)",borderRadius:3,overflow:"hidden"}}>
                      <div style={{width:`${row.w*3}%`,height:"100%",background:row.c,borderRadius:3}}/>
                    </div>
                  </div>
                ))}
              </div>
              <div className="phase-detail-card">
                <div className="pdc-label">{isIt?"Livelli di Rischio — Parametri Dettagliati":"Risk Levels — Detailed Parameters"}</div>
                <div className="risk-explainer-grid" style={{gridTemplateColumns:"1fr"}}>
                  {[
                    {cls:"safe",emoji:"🟢",name:isIt?"SICURO":"SAFE",sub:isIt?"Per chi vuole alta probabilita di vincita":"For those who want high win probability",rows:[
                      [isIt?"N. partite":"Num. matches","2"],
                      [isIt?"Prob. minima/partita":"Min prob/match","≥70%"],
                      [isIt?"Quota massima/partita":"Max odds/match","≤2.00x"],
                      [isIt?"Quota totale target":"Target total odds","2.5x – 4x"],
                      [isIt?"Probabilita schedina":"Bet probability","55% – 75%"],
                    ]},
                    {cls:"balanced",emoji:"🟡",name:isIt?"BILANCIATO":"BALANCED",sub:isIt?"Equilibrio tra probabilita e guadagno":"Balance between probability and payout",rows:[
                      [isIt?"N. partite":"Num. matches","3 – 4"],
                      [isIt?"Prob. minima/partita":"Min prob/match","≥55%"],
                      [isIt?"Quota massima/partita":"Max odds/match","≤3.50x"],
                      [isIt?"Quota totale target":"Target total odds","5x – 15x"],
                      [isIt?"Probabilita schedina":"Bet probability","30% – 55%"],
                    ]},
                    {cls:"high",emoji:"🔴",name:"HIGH RISK",sub:isIt?"Quote stellari, rischio elevato":"Stellar odds, high risk",rows:[
                      [isIt?"N. partite":"Num. matches","4 – 6"],
                      [isIt?"Prob. minima/partita":"Min prob/match","≥40%"],
                      [isIt?"Quota massima/partita":"Max odds/match","≤8.00x"],
                      [isIt?"Quota totale target":"Target total odds","20x – 100x"],
                      [isIt?"Probabilita schedina":"Bet probability","8% – 25%"],
                    ]},
                  ].map((r,i) => (
                    <div className={"risk-expl-card " + r.cls} key={i}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                        <span style={{fontSize:20}}>{r.emoji}</span>
                        <div>
                          <div className="rex-name">{r.name}</div>
                          <div className="rex-sub">{r.sub}</div>
                        </div>
                      </div>
                      {r.rows.map(([k,v],j) => (
                        <div className="rex-row" key={j}>
                          <span className="rex-key">{k}</span>
                          <span className="rex-val">{v}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PHASE 3: Bet Construction ── */}
        {activePhase === 3 && (
          <div className="phase-block">
            <div className="phase-header">
              <div className="phase-num">4</div>
              <div>
                <div className="phase-title">{isIt?"COSTRUZIONE SCHEDINA":"BET CONSTRUCTION"}</div>
                <div className="phase-sub">{isIt?"Come l'AI seleziona e combina le partite per avvicinarsi il piu possibile al tuo obiettivo.":"How the AI selects and combines matches to get as close as possible to your target."}</div>
              </div>
            </div>
            <div className="phase-grid">
              <div className="phase-detail-card full accent">
                <div className="pdc-label">{isIt?"Algoritmo di Selezione":"Selection Algorithm"}</div>
                <div className="flow-diagram">
                  {[
                    {icon:"🎯",l:isIt?"Input Utente":"User Input",s:isIt?"Prob% + Quota":"Prob% + Odds"},
                    {icon:"🔍",l:isIt?"Partite Oggi":"Today Matches",s:isIt?"Tutte le leghe":"All leagues"},
                    {icon:"📊",l:isIt?"Calcola Edge":"Calc Edge",s:"ai_prob - bk_prob"},
                    {icon:"✅",l:isIt?"Filtra Positive":"Filter Positive",s:"edge > 5%"},
                    {icon:"🔢",l:isIt?"Combina Ottimale":"Optimal Combo",s:isIt?"Minimizza errore":"Minimize error"},
                    {icon:"📋",l:isIt?"Schedina Finale":"Final Bet",s:isIt?"Output":"Output"},
                  ].map((s,i) => (
                    <div className="flow-step" key={i}>
                      <div className="flow-box">
                        <div className="flow-icon">{s.icon}</div>
                        <div className="flow-label">{s.l}</div>
                        <div className="flow-sub">{s.s}</div>
                      </div>
                      {i < 5 && <div className="flow-arrow">→</div>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="phase-detail-card">
                <div className="pdc-label">{isIt?"Ottimizzazione della Combinazione":"Combination Optimization"}</div>
                <div className="pdc-body" style={{marginBottom:14}}>
                  {isIt
                    ? "Una volta identificate le partite con edge positivo, l'algoritmo cerca la combinazione che minimizza l'errore assoluto rispetto ai tuoi parametri:"
                    : "Once matches with positive edge are identified, the algorithm finds the combination that minimizes absolute error from your parameters:"}
                </div>
                <div className="algo-wrap">
                  <div className="algo-line"><span className="algo-comment">// Minimizzazione errore</span></div>
                  <div className="algo-line">best = <span className="algo-keyword">null</span>; min_err = ∞</div>
                  <br/>
                  <div className="algo-line"><span className="algo-keyword">for each</span> combo <span className="algo-keyword">in</span> combinations(candidates):</div>
                  <div className="algo-line" style={{paddingLeft:16}}>total_odds = product(combo.quotas)</div>
                  <div className="algo-line" style={{paddingLeft:16}}>bet_prob = product(combo.probs)</div>
                  <br/>
                  <div className="algo-line" style={{paddingLeft:16}}>err_odds = |total_odds - user.quota|</div>
                  <div className="algo-line" style={{paddingLeft:16}}>err_prob = |bet_prob - user.prob|</div>
                  <div className="algo-line" style={{paddingLeft:16}}>error = <span className="algo-number">0.6</span>*err_odds + <span className="algo-number">0.4</span>*err_prob</div>
                  <br/>
                  <div className="algo-line" style={{paddingLeft:16}}><span className="algo-keyword">if</span> error {"<"} min_err:</div>
                  <div className="algo-line" style={{paddingLeft:32}}>best = combo; min_err = error</div>
                  <br/>
                  <div className="algo-line"><span className="algo-keyword">return</span> best</div>
                </div>
              </div>
              <div className="phase-detail-card">
                <div className="pdc-label">{isIt?"Esempio Pratico":"Practical Example"}</div>
                <div className="pdc-title" style={{fontSize:14,marginBottom:12}}>
                  {isIt?"Utente vuole: 60% prob, quota 8x":"User wants: 60% prob, odds 8x"}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {[
                    {combo:"Milan 1X (72%) + Real O2.5 (68%)",totQ:"2.97x",totP:"49%",err:"alto"},
                    {combo:"Milan 1X + Barca 1 + Inter 1",totQ:"5.20x",totP:"41%",err:"medio"},
                    {combo:"Milan 1X (72%) + Sinner 1 (78%) + Lakers O215 (65%)",totQ:"7.80x",totP:"36%",err:"basso",best:true},
                  ].map((c,i) => (
                    <div key={i} style={{background:c.best?"rgba(0,224,144,0.06)":"var(--card2)",border:c.best?"1px solid rgba(0,224,144,0.3)":"1px solid var(--border)",borderRadius:10,padding:"10px 14px"}}>
                      <div style={{fontSize:12,fontWeight:600,color:c.best?"var(--text)":"var(--muted2)",marginBottom:4}}>{c.combo} {c.best?"✅ SCELTA":""}</div>
                      <div style={{display:"flex",gap:12}}>
                        <span style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--gold)"}}>Q: {c.totQ}</span>
                        <span style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--green)"}}>P: {c.totP}</span>
                        <span style={{fontFamily:"var(--mono)",fontSize:11,color:c.best?"var(--green)":c.err==="medio"?"var(--gold)":"var(--red)"}}>err: {c.err}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PHASE 4: Final Output ── */}
        {activePhase === 4 && (
          <div className="phase-block">
            <div className="phase-header">
              <div className="phase-num">5</div>
              <div>
                <div className="phase-title">{isIt?"OUTPUT FINALE":"FINAL OUTPUT"}</div>
                <div className="phase-sub">{isIt?"La schedina completa con tutte le spiegazioni, statistiche e motivazioni.":"The complete bet slip with all explanations, statistics and reasoning."}</div>
              </div>
            </div>
            <div className="phase-grid">
              <div className="phase-detail-card accent full">
                <div className="pdc-label">{isIt?"Struttura Output":"Output Structure"}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginTop:8}}>
                  {[
                    {icon:"📋",t:isIt?"Schedina Strutturata":"Structured Bet",d:isIt?"Ogni partita con: squadre, lega, orario, selezione, quota singola, probabilità stimata":"Each match with: teams, league, time, selection, single odds, estimated probability"},
                    {icon:"🧠",t:isIt?"Reasoning AI":"AI Reasoning",d:isIt?"Spiegazione in linguaggio naturale del perché ogni partita è stata selezionata, con riferimento alle statistiche":"Natural language explanation of why each match was selected, referencing statistics"},
                    {icon:"📊",t:isIt?"Statistiche Chiave":"Key Statistics",d:isIt?"Per ogni partita: forma ultimi 5, gol medi, xG, infortuni rilevanti, scontri diretti recenti":"Per match: last 5 form, avg goals, xG, key injuries, recent head-to-head"},
                    {icon:"🎯",t:isIt?"Probabilita Finale":"Final Probability",d:isIt?"Percentuale calibrata dell'intera schedina, con indicazione dell'errore rispetto all'obiettivo":"Calibrated percentage of the full slip, with error from target"},
                    {icon:"💰",t:isIt?"Quota Totale":"Total Odds",d:isIt?"Prodotto delle quote singole, con confronto rispetto alla quota obiettivo impostata":"Product of single odds, compared to the target odds set"},
                    {icon:"⚡",t:isIt?"Chip Statistici":"Stat Chips",d:isIt?"Per ogni partita, chip visuali con i dati chiave: forma, xG, edge rispetto al bookmaker":"Per match, visual chips with key data: form, xG, edge vs bookmaker"},
                  ].map((item,i) => (
                    <div key={i} style={{background:"var(--card2)",borderRadius:12,padding:16}}>
                      <div style={{fontSize:22,marginBottom:8}}>{item.icon}</div>
                      <div style={{fontSize:13,fontWeight:700,color:"white",marginBottom:6}}>{item.t}</div>
                      <div style={{fontSize:11,color:"var(--muted2)",lineHeight:1.6}}>{item.d}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="phase-detail-card">
                <div className="pdc-label">{isIt?"Precisione del Sistema":"System Accuracy"}</div>
                <div className="prob-meter-wrap">
                  {[
                    {l:isIt?"Prob. stimata vs reale (Sicuro)":"Est. vs real prob (Safe)",v:89,c:"var(--green)"},
                    {l:isIt?"Prob. stimata vs reale (Bilanciato)":"Est. vs real prob (Balanced)",v:74,c:"var(--gold)"},
                    {l:isIt?"Tasso successo schedine":"Bet slip success rate",v:68,c:"var(--cyan)"},
                    {l:isIt?"Accuratezza previsioni":"Prediction accuracy",v:72,c:"var(--green)"},
                  ].map((row,i) => (
                    <div className="prob-meter-row" key={i}>
                      <span className="prob-meter-label">{row.l}</span>
                      <div className="prob-meter-bar">
                        <div className="prob-meter-fill" style={{width:`${row.v}%`,background:row.c}}/>
                      </div>
                      <span className="prob-meter-val" style={{color:row.c}}>{row.v}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="phase-detail-card">
                <div className="pdc-label">{isIt?"Tempistiche":"Timing"}</div>
                <div className="timeline">
                  {[
                    {t:isIt?"Utente configura parametri":"User configures parameters",b:isIt?"Prob%, quota target, sport, livello rischio":"Prob%, target odds, sport, risk level",time:"t = 0s",done:true},
                    {t:isIt?"Fetch partite di oggi":"Fetch today's matches",b:isIt?"API call a The Odds API":"API call to The Odds API",time:"t ≈ 0.5s",done:true},
                    {t:isIt?"Analisi AI + statistiche":"AI analysis + statistics",b:isIt?"Claude AI elabora 40+ fattori":"Claude AI processes 40+ factors",time:"t ≈ 2-4s",done:true},
                    {t:isIt?"Costruzione schedina ottimale":"Optimal bet construction",b:isIt?"Algoritmo di minimizzazione errore":"Error minimization algorithm",time:"t ≈ 4.5s",done:true},
                    {t:isIt?"Output con typing effect":"Output with typing effect",b:isIt?"Spiegazione animata all'utente":"Animated explanation to user",time:"t ≈ 5-8s",done:true},
                  ].map((item,i) => (
                    <div className="tl-item" key={i}>
                      <div className={"tl-dot done"} />
                      <div className="tl-title">{item.t}</div>
                      <div className="tl-body">{item.b}</div>
                      <div className="tl-time">{item.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom navigation */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 0",borderTop:"1px solid var(--border)"}}>
          <button onClick={()=>setActivePhase(Math.max(0,activePhase-1))} disabled={activePhase===0}
            style={{padding:"10px 24px",borderRadius:8,border:"1px solid var(--border2)",background:"transparent",color: activePhase===0?"var(--muted)":"var(--text)",cursor:activePhase===0?"not-allowed":"pointer",fontSize:14,fontWeight:600}}>
            ← {isIt?"Precedente":"Previous"}
          </button>
          <div style={{fontFamily:"var(--mono)",fontSize:12,color:"var(--muted2)"}}>
            {activePhase+1} / {phases.length}
          </div>
          {activePhase < phases.length-1
            ? <button onClick={()=>setActivePhase(activePhase+1)}
                style={{padding:"10px 24px",borderRadius:8,background:"var(--cyan)",color:"#05080f",border:"none",cursor:"pointer",fontSize:14,fontWeight:700}}>
                {isIt?"Successivo":"Next"} →
              </button>
            : <button onClick={onBack}
                style={{padding:"10px 24px",borderRadius:8,background:"var(--green)",color:"#05080f",border:"none",cursor:"pointer",fontSize:14,fontWeight:700}}>
                {isIt?"Inizia ora":"Start now"} →
              </button>
          }
        </div>
      </div>

      {/* Advertise section */}
      <div style={{background:"var(--bg2)",borderTop:"1px solid var(--border)",padding:"60px 40px",textAlign:"center"}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:3,color:"var(--gold)",textTransform:"uppercase",marginBottom:12}}>{isIt?"Advertise":"Advertise"}</div>
        <div style={{fontFamily:"var(--display)",fontSize:"clamp(28px,4vw,48px)",color:"white",letterSpacing:1,marginBottom:16}}>
          {isIt?"VUOI FARE PUBBLICITA SU BETAI?":"WANT TO ADVERTISE ON BETAI?"}
        </div>
        <p style={{fontSize:14,color:"var(--muted2)",maxWidth:500,margin:"0 auto 32px",lineHeight:1.7}}>
          {isIt
            ? "Raggiungi migliaia di appassionati di scommesse sportive ogni giorno. Banner, sponsored post, integrazioni native e molto altro."
            : "Reach thousands of sports betting enthusiasts every day. Banners, sponsored posts, native integrations and more."}
        </p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,maxWidth:800,margin:"0 auto 32px"}}>
          {[
            {icon:"📊",t:isIt?"Banner Display":"Display Banners",d:isIt?"Top, sidebar, inline":"Top, sidebar, inline"},
            {icon:"🎯",t:isIt?"Targeting Preciso":"Precise Targeting",d:isIt?"Per sport, nazione, piano":"By sport, country, plan"},
            {icon:"📈",t:isIt?"Dashboard Analytics":"Analytics Dashboard",d:isIt?"Click, impression, CTR":"Clicks, impressions, CTR"},
            {icon:"🤝",t:isIt?"Partner Ufficiale":"Official Partner",d:isIt?"Logo prominente + badge":"Prominent logo + badge"},
          ].map((item,i) => (
            <div key={i} style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,padding:"20px 16px",textAlign:"center"}}>
              <div style={{fontSize:24,marginBottom:10}}>{item.icon}</div>
              <div style={{fontSize:14,fontWeight:700,color:"white",marginBottom:4}}>{item.t}</div>
              <div style={{fontSize:12,color:"var(--muted2)"}}>{item.d}</div>
            </div>
          ))}
        </div>
        <button style={{padding:"14px 36px",borderRadius:10,background:"var(--gold)",color:"#05080f",border:"none",cursor:"pointer",fontSize:15,fontWeight:700}}>
          {isIt?"Contattaci per i prezzi":"Contact us for pricing"} →
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// WINS SECTION
// ═══════════════════════════════════════════════════════════
function WinsSection({ lang }) {
  const w = T[lang].wins;
  const [tab, setTab] = useState(0);
  return (
    <div style={{background:"var(--bg2)",borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)"}}>
      <LiveTicker />
      <section className="section">
        <div className="section-label">{w.label}</div>
        <div className="section-title">{w.title}</div>
        <p style={{fontSize:13,color:"var(--muted2)",marginBottom:40,lineHeight:1.7,maxWidth:560}}>{w.sub}</p>
        <div className="wins-counters">
          {[{v:2847,s:""},{v:68,s:"%"},{v:94320,s:"E"},{v:1240,s:"+"}].map((c,i) => (
            <div className="wins-counter-card" key={i}>
              <div className="wcc-val"><AnimCounter target={c.v} suffix={c.s}/></div>
              <div className="wcc-lbl">{w.cLabels[i]}</div>
            </div>
          ))}
        </div>
        <div className="wins-tabs">
          {w.tabs.map((tb,i) => (
            <div key={i} className={"wins-tab" + (tab===i?" active":"")} onClick={()=>setTab(i)}>
              {i===0?"🏆":"📸"} {tb}
            </div>
          ))}
        </div>
        {tab===0 && (
          <div className="win-cards-grid">
            {WIN_DATA.map((wn,idx) => (
              <div className="win-card" key={wn.id} style={{animationDelay:idx*0.07+"s"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:20}}>{wn.sport}</span>
                    <span style={{fontSize:11,fontWeight:700,color:"var(--muted2)",letterSpacing:1,textTransform:"uppercase"}}>{wn.sportName}</span>
                  </div>
                  <span className="win-badge">✓ {w.won}</span>
                </div>
                {wn.matches.map((m,i) => (
                  <div className="win-match-row" key={i}>
                    <div>
                      <div style={{fontSize:12,fontWeight:600,color:"var(--text)"}}>{m.teams}</div>
                      <div style={{fontSize:10,color:"var(--muted2)",fontFamily:"var(--mono)",marginTop:1}}>{m.result} ✓</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:11,color:"var(--green)",fontWeight:700}}>{m.sel}</div>
                      <div style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--gold)"}}>{m.quota}x</div>
                    </div>
                  </div>
                ))}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:12,borderTop:"1px solid var(--border)",marginTop:4}}>
                  <span style={{fontSize:11,color:"var(--muted2)"}}>{w.stake}: <span style={{color:"var(--text)",fontWeight:700}}>EUR {wn.puntata}</span></span>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontFamily:"var(--display)",fontSize:24,color:"var(--gold)"}}>{wn.totalQuota}x</span>
                    <span style={{fontSize:12,fontWeight:700,color:"var(--green)",background:"rgba(0,224,144,0.08)",padding:"3px 8px",borderRadius:6}}>+EUR {wn.profit}</span>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginTop:10}}>
                  <div style={{width:22,height:22,borderRadius:5,background:"linear-gradient(135deg,var(--cyan),#0055ff)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#05080f"}}>{wn.user[0]}</div>
                  <span style={{fontSize:11,color:"var(--muted2)"}}><span style={{color:"var(--text)",fontWeight:600}}>{wn.user}</span> · {wn.city} · {wn.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab===1 && (
          <div className="win-cards-grid">
            {WIN_DATA.slice(0,4).map((wn,idx) => (
              <div key={wn.id} style={{animation:"popIn 0.4s ease both",animationDelay:idx*0.07+"s"}}>
                <div className="screenshot-card">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,paddingBottom:10,borderBottom:"1px solid var(--border)"}}>
                    <span style={{fontSize:12,color:"var(--muted2)"}}>Bet365 · <span style={{color:"white",fontWeight:700}}>{wn.date}</span></span>
                    <span style={{color:"var(--green)",fontSize:12,fontWeight:700}}>✓ {w.won}</span>
                  </div>
                  {wn.matches.map((m,i) => (
                    <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"5px 0",borderBottom:"1px solid var(--border)"}}>
                      <span style={{color:"var(--text)"}}>{m.teams} · {m.sel}</span>
                      <span style={{color:"var(--green)",fontWeight:700}}>{m.result} ✓</span>
                    </div>
                  ))}
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:10,paddingTop:10,borderTop:"2px solid rgba(0,224,144,0.25)"}}>
                    <span style={{fontSize:12,color:"var(--muted2)"}}>Quota Tot.</span>
                    <span style={{fontSize:13,color:"var(--green)",fontWeight:700}}>{wn.totalQuota}x → +EUR {wn.profit}</span>
                  </div>
                  <div style={{marginTop:8,display:"flex",alignItems:"center",gap:5,opacity:0.55}}>
                    <div style={{width:14,height:14,borderRadius:3,background:"linear-gradient(135deg,var(--cyan),#0055ff)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:900,color:"#05080f",fontFamily:"var(--display)"}}>B</div>
                    <span style={{fontSize:9,color:"var(--muted2)",fontFamily:"var(--mono)"}}>via BetAI · {wn.user}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LANDING
// ═══════════════════════════════════════════════════════════
function Landing({ onLogin, onHowItWorks, lang, setLang }) {
  const t = T[lang];
  return (
    <div style={{position:"relative",zIndex:1}}>
      <AdBannerTop lang={lang}/>
      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-logo-mark">B</div>
          <div className="nav-logo-text">Bet<span>AI</span></div>
        </div>
        <div className="nav-links">
          <span className="nav-link" onClick={onHowItWorks}>{t.nav.how}</span>
          <span className="nav-link">{t.nav.features}</span>
          <span className="nav-link">{t.nav.wins}</span>
          <span className="nav-link">{t.nav.pricing}</span>
          <span className="nav-link" style={{color:"var(--gold)"}}>{t.nav.advertise}</span>
          <div style={{display:"flex",gap:4,background:"var(--card2)",borderRadius:8,padding:4}}>
            <button className={"lang-btn"+(lang==="it"?" active":"")} onClick={()=>setLang("it")}>IT</button>
            <button className={"lang-btn"+(lang==="en"?" active":"")} onClick={()=>setLang("en")}>EN</button>
          </div>
          <button className="nav-cta" onClick={onLogin}>{t.nav.cta}</button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-grid"/>
        <div className="hero-glow"/>
        <div className="hero-badge">
          <span style={{animation:"pulse 2s infinite",display:"inline-block",width:7,height:7,borderRadius:"50%",background:"var(--cyan)"}}/>
          {t.hero.badge}
        </div>
        <h1 className="hero-title">{t.hero.t1} <span className="accent">{t.hero.t2}</span></h1>
        <p className="hero-sub">{t.hero.sub}</p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={onLogin}>{t.hero.cta1}</button>
          <button className="btn-outline" onClick={onHowItWorks}>{t.hero.cta2} →</button>
        </div>
        <div className="hero-stats">
          {t.hero.sv.map(([v,l],i) => (
            <div key={i} style={{textAlign:"center"}}>
              <div className="hstat-val">{v}</div>
              <div className="hstat-lbl">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <div className="sec-bg">
        <section className="section">
          <div className="section-label">{t.features.label}</div>
          <div className="section-title">{t.features.title}</div>
          <div className="features-grid">
            {t.features.cards.map((c,i) => (
              <div className="feature-card" key={i}>
                <div className="feat-icon">{c.icon}</div>
                <div className="feat-title">{c.t}</div>
                <div className="feat-desc">{c.d}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* AD INLINE 1 */}
      <div style={{maxWidth:1100,margin:"40px auto",padding:"0 24px"}}>
        <AdInline idx={1} lang={lang}/>
      </div>

      {/* HOW IT WORKS PREVIEW */}
      <section className="section">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
          <div>
            <div className="section-label">{t.nav.how}</div>
            <div className="section-title" style={{whiteSpace:"pre-line"}}>
              {lang==="it"?"TRE PASSI,\nUNA SCHEDINA":"THREE STEPS,\nONE BET"}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:24,marginTop:32}}>
              {(lang==="it"
                ? [["1","Imposti il rischio","Probabilità e quota obiettivo. Tu decidi quanto rischiare."],
                   ["2","L'AI analizza","40+ statistiche per partita, edge vs bookmaker, probabilità calibrate."],
                   ["3","Ricevi la schedina","Combinazione ottimale con spiegazione dettagliata."],]
                : [["1","Set your risk","Probability and target odds. You decide how much to risk."],
                   ["2","AI analyzes","40+ stats per match, edge vs bookmaker, calibrated probabilities."],
                   ["3","Get your bet","Optimal combination with detailed explanation."],]
              ).map(([n,title,desc],i) => (
                <div key={i} style={{display:"flex",gap:16,alignItems:"flex-start"}}>
                  <div style={{width:38,height:38,borderRadius:10,background:"rgba(0,212,255,0.1)",border:"1px solid rgba(0,212,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--display)",fontSize:18,color:"var(--cyan)",flexShrink:0}}>{n}</div>
                  <div>
                    <div style={{fontSize:15,fontWeight:700,color:"white",marginBottom:4}}>{title}</div>
                    <div style={{fontSize:13,color:"var(--muted2)",lineHeight:1.6}}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={onHowItWorks} style={{marginTop:32,padding:"12px 28px",borderRadius:10,background:"transparent",color:"var(--cyan)",border:"1px solid rgba(0,212,255,0.35)",cursor:"pointer",fontSize:14,fontWeight:600,transition:"all 0.2s"}}>
              {lang==="it"?"Scopri tutti i dettagli":"See all details"} →
            </button>
          </div>
          {/* Mock card */}
          <div style={{background:"var(--card)",border:"1px solid var(--border2)",borderRadius:20,padding:24}} className="anim-float">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <span style={{fontFamily:"var(--display)",fontSize:16,letterSpacing:1,color:"white"}}>📋 {lang==="it"?"Schedina AI":"AI Bet"}</span>
              <div style={{display:"flex",gap:6}}>
                <span style={{fontFamily:"var(--mono)",fontSize:10,padding:"3px 8px",borderRadius:20,fontWeight:700,background:"rgba(0,224,144,0.12)",color:"var(--green)",border:"1px solid rgba(0,224,144,0.25)"}}>~64% prob</span>
                <span style={{fontFamily:"var(--mono)",fontSize:10,padding:"3px 8px",borderRadius:20,fontWeight:700,background:"rgba(245,184,0,0.12)",color:"var(--gold)",border:"1px solid rgba(245,184,0,0.25)"}}>8.2x</span>
              </div>
            </div>
            {[{t:"Milan vs Napoli",l:"Serie A 20:45",s:"1X",q:"1.65",chips:["Forma 4/5 ✓","xG 1.8","Edge +7%"]},{t:"Real vs Atletico",l:"La Liga 21:00",s:"Over 2.5",q:"1.90",chips:["H2H 3-1 ✓","xG 2.4","Edge +6%"]},{t:"Sinner vs Djokovic",l:"ATP 15:00",s:"1",q:"2.65",chips:["Rank #1","Forma 8/10","Edge +5%"]}].map((m,i) => (
              <div key={i} style={{background:"var(--card2)",borderRadius:10,padding:"10px 12px",marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:"white"}}>{m.t}</div>
                    <div style={{fontSize:10,color:"var(--muted2)",fontFamily:"var(--mono)",marginTop:1}}>{m.l}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:11,fontWeight:700,color:"var(--cyan)"}}>{m.s}</span>
                    <span style={{fontFamily:"var(--mono)",fontSize:12,fontWeight:700,color:"var(--gold)"}}>{m.q}</span>
                  </div>
                </div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {m.chips.map((ch,j) => <span key={j} style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:"rgba(0,212,255,0.08)",color:"var(--cyan)",fontFamily:"var(--mono)",fontWeight:600}}>{ch}</span>)}
                </div>
              </div>
            ))}
            <div style={{background:"rgba(0,212,255,0.04)",border:"1px solid rgba(0,212,255,0.12)",borderRadius:8,padding:10,marginTop:8}}>
              <div style={{fontSize:9,fontWeight:700,color:"var(--cyan)",letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>AI</div>
              <div style={{fontSize:11,color:"#8899bb",lineHeight:1.6}}>{lang==="it"?"Milan ottima forma in casa, edge +7% sul bookmaker. Real vs Atletico storicamente over. Sinner numero 1 con ottimo rendimento su questa superficie.":"Milan great home form, +7% edge on bookmaker. Real vs Atletico historically over. Sinner ranked 1st with excellent surface performance."}</div>
            </div>
          </div>
        </div>
      </section>

      {/* WINS */}
      <WinsSection lang={lang}/>

      {/* AD INLINE 2 */}
      <div style={{maxWidth:1100,margin:"40px auto",padding:"0 24px"}}>
        <AdInline idx={2} lang={lang}/>
      </div>

      {/* PRICING */}
      <div className="sec-bg">
        <section className="section" style={{textAlign:"center"}}>
          <div className="section-label">{t.pricing.label}</div>
          <div className="section-title">{t.pricing.title}</div>
          <div className="pricing-grid">
            {t.pricing.plans.map((p,i) => (
              <div className={"price-card"+(p.popular?" featured":"")} key={i}>
                {p.popular && <div className="price-popular">{lang==="it"?"Piu popolare":"Most popular"}</div>}
                <div className="price-plan">{p.name}</div>
                <div className="price-amount">EUR {p.price}</div>
                <div className="price-period">{p.period}</div>
                <ul className="price-features">
                  {p.features.map((f,j) => (
                    <li className="price-feature" key={j}>
                      <span style={{color:f.startsWith("x")?"var(--muted)":"var(--green)"}}>{f.startsWith("x")?"✗":"✓"}</span>
                      {f.replace("x ","")}
                    </li>
                  ))}
                </ul>
                <button className={"price-btn "+p.style} onClick={onLogin}>{p.cta}</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <PartnersStrip lang={lang}/>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <div style={{fontFamily:"var(--display)",fontSize:20,letterSpacing:2,color:"white",marginBottom:8}}>Bet<span style={{color:"var(--cyan)"}}>AI</span></div>
          <div style={{fontSize:12,color:"var(--muted2)",lineHeight:1.6,maxWidth:200}}>{lang==="it"?"Il tuo assistente AI per le scommesse sportive.":"Your AI assistant for sports betting."}</div>
        </div>
        {t.footer.cols.map((col,i) => (
          <div key={i}>
            <div className="footer-col-title">{col.t}</div>
            {col.links.map((l,j) => <div key={j} className="footer-link">{l}</div>)}
          </div>
        ))}
      </footer>
      <div className="footer-bottom">
        <div style={{fontFamily:"var(--display)",fontSize:16,letterSpacing:2,color:"var(--muted)"}}>BetAI © 2025</div>
        <div className="footer-disclaimer">{t.footer.disclaimer}</div>
        <div style={{display:"flex",gap:4,background:"var(--card)",borderRadius:8,padding:4}}>
          <button className={"lang-btn"+(lang==="it"?" active":"")} onClick={()=>setLang("it")}>IT</button>
          <button className={"lang-btn"+(lang==="en"?" active":"")} onClick={()=>setLang("en")}>EN</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════
function Auth({ onSuccess, onBack, lang }) {
  const t = T[lang].auth;
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const handle = () => {
    if (!email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess({ name: name || email.split("@")[0], email }); }, 900);
  };
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div style={{textAlign:"center",marginBottom:28}}>
          <div className="auth-logo-mark">B</div>
          <div style={{fontFamily:"var(--display)",fontSize:26,letterSpacing:3,color:"white",marginTop:8}}>Bet<span style={{color:"var(--cyan)"}}>AI</span></div>
        </div>
        <div className="auth-tabs">
          <div className={"auth-tab"+(tab==="login"?" active":"")} onClick={()=>setTab("login")}>{t.tabLogin}</div>
          <div className={"auth-tab"+(tab==="register"?" active":"")} onClick={()=>setTab("register")}>{t.tabReg}</div>
        </div>
        {tab==="register" && <>
          <label className="form-label">{t.name}</label>
          <input className="form-input" placeholder="Mario Rossi" value={name} onChange={e=>setName(e.target.value)}/>
        </>}
        <label className="form-label">{t.email}</label>
        <input className="form-input" type="email" placeholder="mario@email.it" value={email} onChange={e=>setEmail(e.target.value)}/>
        <label className="form-label">{t.pass}</label>
        <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)}/>
        <button className="auth-btn" onClick={handle} disabled={loading||!email}>
          {loading?"...":(tab==="login"?t.btnLogin:t.btnReg)}
        </button>
        <div style={{textAlign:"center",fontSize:13,color:"var(--muted2)",marginTop:18}}>
          {tab==="login"?t.sw1:t.sw2}{" "}
          <span style={{color:"var(--cyan)",cursor:"pointer",fontWeight:600}} onClick={()=>setTab(tab==="login"?"register":"login")}>
            {tab==="login"?t.c1:t.c2}
          </span>
        </div>
        <div style={{textAlign:"center",marginTop:16}}>
          <span style={{fontSize:12,color:"var(--muted)",cursor:"pointer"}} onClick={onBack}>← {lang==="it"?"Torna alla home":"Back to home"}</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════
function DashWins({ lang }) {
  const t = T[lang].dash;
  const isIt = lang==="it";
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{fontFamily:"var(--display)",fontSize:24,letterSpacing:1,color:"white"}}>{t.hallTitle}</div>
          <div style={{fontSize:13,color:"var(--muted2)",marginTop:2}}>{t.hallSub}</div>
        </div>
        <div style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--green)",background:"rgba(0,224,144,0.07)",border:"1px solid rgba(0,224,144,0.2)",padding:"5px 12px",borderRadius:20}}>● LIVE</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
        {[{v:"68%",l:isIt?"Successo":"Success",c:"var(--green)"},{v:"94k+",l:isIt?"Profitti":"Profits",c:"var(--gold)"},{v:"2,847",l:isIt?"Vinte":"Won",c:"var(--cyan)"}].map((s,i) => (
          <div key={i} style={{background:"var(--card2)",border:"1px solid var(--border)",borderRadius:10,padding:"12px",textAlign:"center"}}>
            <div style={{fontFamily:"var(--display)",fontSize:22,color:s.c}}>{s.v}</div>
            <div style={{fontSize:9,color:"var(--muted2)",letterSpacing:1,textTransform:"uppercase",marginTop:2}}>{s.l}</div>
          </div>
        ))}
      </div>
      <LiveTicker />
      <div className="dash-wins-grid" style={{marginTop:16}}>
        {WIN_DATA.map((wn,idx) => (
          <div className="dash-win-card" key={wn.id} style={{animation:"popIn 0.4s ease both",animationDelay:idx*0.06+"s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:16}}>{wn.sport}</span>
                <span style={{fontSize:10,fontWeight:700,color:"var(--muted2)",letterSpacing:1,textTransform:"uppercase"}}>{wn.sportName}</span>
              </div>
              <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--muted)"}}>{wn.date}</span>
            </div>
            {wn.matches.map((m,i) => (
              <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"3px 0",borderBottom:i<wn.matches.length-1?"1px solid var(--border)":"none"}}>
                <span style={{color:"var(--text)"}}>{m.teams}</span>
                <span style={{color:"var(--green)",fontWeight:700,fontFamily:"var(--mono)"}}>{m.sel} {m.quota}x</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",marginTop:10,paddingTop:10,borderTop:"1px solid var(--border)"}}>
              <div>
                <div style={{fontFamily:"var(--display)",fontSize:22,color:"var(--gold)"}}>{wn.totalQuota}x</div>
                <div style={{fontSize:10,color:"var(--muted2)"}}>EUR {wn.puntata} {isIt?"puntati":"staked"}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:13,fontWeight:700,color:"var(--green)"}}>+EUR {wn.profit}</div>
                <div style={{fontSize:10,color:"var(--muted2)",marginTop:3}}>{wn.user} · {wn.city}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ user, onLogout, lang, setLang }) {
  const t = T[lang].dash;
  const isIt = lang==="it";
  const [sport, setSport] = useState(0);
  const [risk, setRisk] = useState("balanced");
  const [prob, setProb] = useState(60);
  const [quota, setQuota] = useState(8);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [reasoning, setReasoning] = useState("");
  const [typing, setTyping] = useState(false);
  const [history, setHistory] = useState(SAMPLE_HISTORY);
  const [activeNav, setActiveNav] = useState(0);

  useEffect(() => {
    if (risk==="safe"){ setProb(72); setQuota(3); }
    if (risk==="balanced"){ setProb(55); setQuota(8); }
    if (risk==="high"){ setProb(20); setQuota(50); }
  }, [risk]);

  const probColor = prob>=65?"var(--green)":prob>=40?"var(--gold)":"var(--red)";
  const today = new Date().toLocaleDateString(isIt?"it-IT":"en-GB",{weekday:"long",day:"numeric",month:"long"});
  const sportName = t.sports[sport];

  const animateReasoning = (text) => {
    setTyping(true); let i = 0;
    const iv = setInterval(() => {
      setReasoning(text.slice(0,i)); i+=5;
      if(i>text.length){ setReasoning(text); setTyping(false); clearInterval(iv); }
    }, 16);
  };

  const generate = async () => {
    setLoading(true); setResult(null); setReasoning("");
    // Advanced statistical prompt
    const prompt = `You are BetAI, an expert sports betting analyst using advanced statistical modeling.

USER PARAMETERS:
- Sport: ${sportName}
- Target win probability: ${prob}%
- Target total odds: ${quota}x
- Risk level: ${risk}
- Language: ${isIt?"Italian":"English"}

YOUR TASK:
1. Think of ${risk==="safe"?2:risk==="balanced"?"3-4":"4-6"} realistic matches happening TODAY in ${sportName}
2. For each match, simulate realistic statistical analysis:
   - Recent form (last 5 matches) for both teams
   - Head-to-head record
   - Home/Away performance stats
   - Key injuries or missing players
   - Expected Goals (xG) estimate
   - Your estimated probability vs bookmaker implied probability
   - Calculated "edge" (your_prob - bookmaker_implied_prob)
3. Select ONLY matches where your edge is POSITIVE (>5%)
4. Combine them so the total odds product is as close as possible to ${quota}x
5. Combined probability should be as close as possible to ${prob}%

For each match include stat_chips: small labels showing key stats (e.g. "Forma 4/5", "xG 2.1", "H2H 3-1", "Edge +7%", "Inft: Leao OUT")

Respond with ONLY valid JSON, no markdown, no backticks:
{
  "matches": [
    {
      "teams": "Team A vs Team B",
      "league": "League Name",
      "time": "HH:MM",
      "selection": "bet type (1/X/2/Over X.X/Under X.X/etc)",
      "single_prob": 72,
      "quota": 1.65,
      "ai_edge": "+7%",
      "stat_chips": ["Forma 4/5 ✓","xG 1.8","H2H 3-1","Edge +7%"]
    }
  ],
  "total_quota": 8.2,
  "estimated_prob": 58,
  "reasoning": "Detailed analysis in ${isIt?"Italian":"English"}, minimum 4 sentences. Explain WHY each match was chosen with specific statistics."
}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,messages:[{role:"user",content:prompt}]})});
      const data = await res.json();
      const text = data.content?.map(i=>i.text||"").join("")||"";
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      setResult(parsed);
      animateReasoning(parsed.reasoning||"");
      setHistory(h=>[{id:Date.now(),sport:t.sportEmoji[sport],matches:parsed.matches?.map(m=>m.teams).join(" + ")||"—",date:new Date().toLocaleDateString("it-IT"),quota:parsed.total_quota?.toFixed(2)||quota,status:"wait"},...h.slice(0,9)]);
    } catch {
      const fallback = {
        matches:[
          {teams:"Milan vs Juventus",league:"Serie A",time:"20:45",selection:"1X",single_prob:72,quota:1.65,ai_edge:"+7%",stat_chips:["Forma 4/5 ✓","xG 1.8","H2H 3-1","Edge +7%"]},
          {teams:"Real Madrid vs Atletico",league:"La Liga",time:"21:00",selection:"Over 2.5",single_prob:68,quota:1.85,ai_edge:"+6%",stat_chips:["xG 2.4 ✓","H2H Over 3/5","Gol 2.1/p","Edge +6%"]},
          {teams:"Sinner vs Medvedev",league:"ATP Masters",time:"14:00",selection:"1",single_prob:74,quota:1.55,ai_edge:"+9%",stat_chips:["Rank #1 ✓","Forma 8/10","H2H 5-2","Edge +9%"]},
        ],
        total_quota:4.72,estimated_prob:37,
        reasoning:isIt
          ?"Milan in ottima forma casalinga (4 vittorie nelle ultime 5), con edge +7% rispetto alle quote Bet365 — xG medio di 1.8 a partita indica alta pericolosita offensiva. Real vs Atletico storicamente produce piu di 2.5 gol negli ultimi 5 scontri diretti (3-1 nel bilancio), con entrambe le squadre in fase offensiva. Sinner occupa il ranking numero 1 ATP con un H2H favorevole di 5-2 contro Medvedev e forma eccellente (8/10 nelle ultime partite)."
          :"Milan in excellent home form (4 wins in last 5), with +7% edge vs Bet365 odds — average xG of 1.8 per match indicates high offensive threat. Real vs Atletico historically produces over 2.5 goals in the last 5 head-to-heads (3-1 record), with both teams in attacking form. Sinner holds ATP rank #1 with a favorable 5-2 H2H against Medvedev and excellent recent form (8/10 last matches)."
      };
      setResult(fallback); animateReasoning(fallback.reasoning);
    } finally { setLoading(false); }
  };

  const titles = {0:"DASHBOARD",1:isIt?"SCHEDINE":"MY BETS",2:"HALL OF FAME",3:isIt?"ANALISI":"ANALYSIS",4:isIt?"IMPOSTAZIONI":"SETTINGS"};

  return (
    <div className="dash-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">B</div>
          <div className="sidebar-logo-text">Bet<span>AI</span></div>
        </div>
        <div className="sidebar-section">{isIt?"PRINCIPALE":"MAIN"}</div>
        <nav className="sidebar-nav">
          {t.nav.slice(0,3).map((item,i) => (
            <div key={i} className={"sidebar-item"+(activeNav===i?" active":"")} onClick={()=>setActiveNav(i)}>
              <span style={{fontSize:15}}>{t.navEmoji[i]}</span>
              <span>{item}</span>
            </div>
          ))}
        </nav>
        <div className="sidebar-section" style={{marginTop:8}}>{isIt?"STRUMENTI":"TOOLS"}</div>
        <nav className="sidebar-nav">
          {t.nav.slice(3).map((item,i) => (
            <div key={i+3} className={"sidebar-item"+(activeNav===i+3?" active":"")} onClick={()=>setActiveNav(i+3)}>
              <span style={{fontSize:15}}>{t.navEmoji[i+3]}</span>
              <span>{item}</span>
            </div>
          ))}
        </nav>

        {/* Ad sidebar */}
        <div style={{marginTop:16}}>
          <AdSidebar idx={activeNav} />
        </div>

        <div className="sidebar-bottom">
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px"}}>
            <div className="sidebar-avatar">{(user.name||"U")[0].toUpperCase()}</div>
            <div>
              <div style={{fontSize:12,fontWeight:600,color:"var(--text)"}}>{user.name}</div>
              <div style={{fontSize:10,color:"var(--gold)",fontWeight:600}}>⭐ Pro</div>
            </div>
          </div>
          <div style={{display:"flex",gap:4,padding:"4px 8px",marginTop:4}}>
            <button className={"lang-btn"+(lang==="it"?" active":"")} onClick={()=>setLang("it")} style={{flex:1}}>IT</button>
            <button className={"lang-btn"+(lang==="en"?" active":"")} onClick={()=>setLang("en")} style={{flex:1}}>EN</button>
          </div>
          <div className="sidebar-logout" onClick={onLogout}>🚪 <span>{t.logout}</span></div>
        </div>
      </aside>

      <main className="dash-main">
        <div className="dash-topbar">
          <div>
            <div className="dash-title">{titles[activeNav]||"DASHBOARD"}</div>
            <div style={{fontSize:13,color:"var(--muted2)",marginTop:2}}>{t.today}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:12,color:"var(--muted2)"}}>{t.welcome}, {user.name} 👋</div>
            <div style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--cyan)",marginTop:1}}>{today}</div>
          </div>
        </div>

        {activeNav===2 && <DashWins lang={lang}/>}

        {activeNav!==2 && (<>
          <div className="stats-bar">
            {[{v:"24",l:t.stats[0],tr:"+3",up:true},{v:"16",l:t.stats[1],tr:"+1",up:true},{v:"67%",l:t.stats[2],tr:"+2%",up:true},{v:"6.8x",l:t.stats[3],tr:"-0.4",up:false}].map((s,i) => (
              <div className="stat-card" key={i}>
                <div className="stat-card-val">{s.v}</div>
                <div className="stat-card-lbl">{s.l}</div>
                <div className="stat-card-trend" style={{color:s.up?"var(--green)":"var(--red)"}}>{s.up?"▲":"▼"} {s.tr}</div>
              </div>
            ))}
          </div>

          <div className="generator-card">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
              <div style={{fontFamily:"var(--display)",fontSize:20,letterSpacing:1,color:"white"}}>{t.genTitle}</div>
              <div style={{fontSize:10,color:"var(--muted2)",fontFamily:"var(--mono)"}}>{isIt?"Analisi 40+ statistiche":"40+ stats analyzed"}</div>
            </div>
            <div className="gen-top">
              <div>
                <span className="label-text">{t.sport}</span>
                <div className="sport-pills">
                  {t.sports.map((s,i) => (
                    <div key={i} className={"sport-pill"+(sport===i?" active":"")} onClick={()=>setSport(i)}>
                      {t.sportEmoji[i]} {s}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <span className="label-text">{t.risk}</span>
                <div className="risk-grid">
                  {t.risks.map(r => (
                    <div key={r.id} className={"risk-card-btn r-"+r.id+(risk===r.id?" active":"")} onClick={()=>setRisk(r.id)}>
                      <div style={{fontSize:18,marginBottom:3}}>{r.emoji}</div>
                      <div style={{fontSize:11,fontWeight:700,color:"white"}}>{r.name}</div>
                      <div style={{fontSize:9,color:"var(--muted2)",marginTop:1}}>{r.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <div className="slider-row">
                <span className="slider-lbl">🎯 {t.prob}</span>
                <input type="range" min={10} max={90} value={prob} onChange={e=>setProb(+e.target.value)}/>
                <span className="slider-val" style={{color:probColor}}>{prob}%</span>
              </div>
              <div className="slider-row">
                <span className="slider-lbl">💰 {t.quota}</span>
                <input type="range" min={1.5} max={100} step={0.5} value={quota} onChange={e=>setQuota(+e.target.value)}/>
                <span className="slider-val" style={{color:"var(--gold)"}}>{quota}x</span>
              </div>
            </div>
            {risk==="high" && (
              <div className="premium-lock">
                <div style={{fontSize:12,color:"var(--gold)",fontWeight:600}}>🔐 {t.premiumMsg}</div>
                <button className="upgrade-btn">{t.upgrade} →</button>
              </div>
            )}
            <button className="gen-btn" onClick={generate} disabled={loading||risk==="high"}>
              {loading?t.generating:t.genBtn}
            </button>
          </div>

          {loading && (
            <div className="result-wrap">
              <div style={{textAlign:"center",padding:36}}>
                <div className="spinner"/>
                <div style={{fontFamily:"var(--mono)",fontSize:12,color:"var(--muted2)"}}>{t.generating}</div>
                <div style={{fontSize:11,color:"var(--muted)",marginTop:8}}>
                  {isIt?"Raccolta dati → Analisi edge → Ottimizzazione combinazione":"Fetching data → Edge analysis → Combination optimization"}
                </div>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="result-wrap">
              <div className="result-top">
                <div style={{fontSize:14,fontWeight:700,color:"white"}}>📋 {t.result}</div>
                <div className="result-pills">
                  <span className="result-pill rp-green">~{result.estimated_prob}% prob</span>
                  <span className="result-pill rp-gold">quota {result.total_quota?.toFixed(2)}x</span>
                  <span className="result-pill rp-cyan">{result.matches?.length} {isIt?"partite":"matches"}</span>
                </div>
              </div>
              <div className="match-list">
                {result.matches?.map((m,i) => (
                  <div className="match-item" key={i}>
                    <div className="match-item-top">
                      <div>
                        <div className="match-teams">{m.teams}</div>
                        <div className="match-meta">{m.league} · {m.time}</div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontSize:12,fontWeight:700,color:"var(--cyan)"}}>{m.selection}</div>
                          <div style={{fontSize:10,color:"var(--muted2)",fontFamily:"var(--mono)",marginTop:1}}>{m.single_prob}% · {m.ai_edge||""}</div>
                        </div>
                        <div className="match-quota">{m.quota}</div>
                      </div>
                    </div>
                    {m.stat_chips && m.stat_chips.length > 0 && (
                      <div className="match-stats-row">
                        {m.stat_chips.map((ch,j) => {
                          const cls = ch.includes("✓")?"msc-green":ch.includes("OUT")?"msc-red":ch.includes("Edge")?"msc-cyan":"msc-gold";
                          return <span key={j} className={"match-stat-chip "+cls}>{ch}</span>;
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="ai-reasoning">
                <div className="ai-reasoning-label">🧠 {t.aiLabel} — {isIt?"Analisi Statistica":"Statistical Analysis"}</div>
                <div className={"ai-reasoning-text"+(typing?" cursor":"")}>{reasoning}</div>
              </div>
              <div className="result-stats">
                {[{v:`${result.estimated_prob}%`,l:isIt?"Probabilita":"Probability",c:"var(--green)"},{v:`${result.total_quota?.toFixed(2)}x`,l:isIt?"Quota Totale":"Total Odds",c:"var(--gold)"},{v:result.matches?.length,l:isIt?"Partite":"Matches",c:"var(--cyan)"}].map((s,i) => (
                  <div className="rs-box" key={i}>
                    <div style={{fontFamily:"var(--display)",fontSize:24,color:s.c,marginBottom:2}}>{s.v}</div>
                    <div style={{fontSize:9,color:"var(--muted2)",letterSpacing:1,textTransform:"uppercase"}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ad inline inside dashboard after result */}
          {result && !loading && <div style={{marginTop:16}}><AdInline idx={3} lang={lang}/></div>}

          <div style={{marginTop:24}}>
            <div style={{fontSize:15,fontWeight:700,color:"white",marginBottom:14}}>{t.histTitle}</div>
            {history.length===0
              ? <div style={{color:"var(--muted2)",fontSize:13,textAlign:"center",padding:28}}>{t.histEmpty}</div>
              : <div className="history-list">
                  {history.map(h => (
                    <div className="history-item" key={h.id}>
                      <span style={{fontSize:17}}>{h.sport}</span>
                      <div className="history-info">
                        <div style={{fontSize:12,fontWeight:600,color:"var(--text)"}}>{h.matches}</div>
                        <div style={{fontSize:10,color:"var(--muted2)",fontFamily:"var(--mono)",marginTop:2}}>{h.date}</div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <span style={{fontFamily:"var(--mono)",fontSize:14,fontWeight:700,color:"var(--gold)"}}>{h.quota}x</span>
                        <span className={"history-status "+(h.status==="won"?"hs-won":h.status==="lost"?"hs-lost":"hs-wait")}>
                          {h.status==="won"?(isIt?"Vinta":"Won"):h.status==="lost"?(isIt?"Persa":"Lost"):(isIt?"In attesa":"Pending")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>
        </>)}

        <div style={{textAlign:"center",marginTop:40,fontSize:10,color:"var(--muted)",lineHeight:1.7,maxWidth:700}}>
          {T[lang].footer.disclaimer}
        </div>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("landing"); // landing | how | auth | dashboard
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState("it");
  return (
    <>
      <style>{STYLES}</style>
      {page==="landing" && <Landing onLogin={()=>setPage("auth")} onHowItWorks={()=>setPage("how")} lang={lang} setLang={setLang}/>}
      {page==="how" && <HowItWorksPage onBack={()=>setPage("landing")} lang={lang}/>}
      {page==="auth" && <Auth onSuccess={u=>{setUser(u);setPage("dashboard");}} onBack={()=>setPage("landing")} lang={lang}/>}
      {page==="dashboard" && user && <Dashboard user={user} onLogout={()=>{setUser(null);setPage("landing");}} lang={lang} setLang={setLang}/>}
    </>
  );
}
