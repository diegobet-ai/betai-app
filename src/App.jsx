import { useState, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════
// SUPABASE CONFIG
// ═══════════════════════════════════════════════════════════
const SUPA_URL = "https://yydtatsromgfdykvjmbk.supabase.co";
const SUPA_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5ZHRhdHNyb21nZmR5a3ZqbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MzEyOTAsImV4cCI6MjA4OTQwNzI5MH0.bzQX0BDhoiHhqgZMd1J3zjdvx62SEuDxfo9nrMrBV18";

// ═══════════════════════════════════════════════════════════
// SPORT CONFIG
// ═══════════════════════════════════════════════════════════
const SPORT_KEYS = [
  "soccer_italy_serie_a","soccer_uefa_champs_league","soccer_epl",
  "soccer_spain_la_liga","soccer_germany_bundesliga","soccer_france_ligue_one",
  "soccer_uefa_europa_league","soccer_conmebol_copa_libertadores",
  "basketball_nba","americanfootball_nfl","icehockey_nhl","baseball_mlb","mma_mixed_martial_arts",
];
const SPORT_LABELS = {
  soccer_italy_serie_a:              {name:"Serie A",          emoji:"⚽",cat:"Calcio"},
  soccer_uefa_champs_league:         {name:"Champions League", emoji:"⚽",cat:"Calcio"},
  soccer_epl:                        {name:"Premier League",   emoji:"⚽",cat:"Calcio"},
  soccer_spain_la_liga:              {name:"La Liga",          emoji:"⚽",cat:"Calcio"},
  soccer_germany_bundesliga:         {name:"Bundesliga",       emoji:"⚽",cat:"Calcio"},
  soccer_france_ligue_one:           {name:"Ligue 1",          emoji:"⚽",cat:"Calcio"},
  soccer_uefa_europa_league:         {name:"Europa League",    emoji:"⚽",cat:"Calcio"},
  soccer_conmebol_copa_libertadores: {name:"Copa Libertadores",emoji:"⚽",cat:"Calcio"},
  basketball_nba:                    {name:"NBA",              emoji:"🏀",cat:"Basket"},
  americanfootball_nfl:              {name:"NFL",              emoji:"🏈",cat:"Football"},
  icehockey_nhl:                     {name:"NHL",              emoji:"🏒",cat:"Hockey"},
  baseball_mlb:                      {name:"MLB",              emoji:"⚾",cat:"Baseball"},
  mma_mixed_martial_arts:            {name:"MMA",              emoji:"🥊",cat:"MMA"},
};

// Supabase REST client — always sends both apikey and Authorization
function supaHeaders(token) {
  return {
    "apikey": SUPA_ANON,
    "Authorization": "Bearer " + (token || SUPA_ANON),
    "Content-Type": "application/json",
    "Prefer": "return=representation",
  };
}

const sb = {
  async signUp(email, password, name) {
    const r = await fetch(SUPA_URL+"/auth/v1/signup", {
      method:"POST",
      headers:{"apikey":SUPA_ANON,"Content-Type":"application/json"},
      body:JSON.stringify({email,password,data:{name}})
    });
    return r.json();
  },

  async signIn(email, password) {
    const r = await fetch(SUPA_URL+"/auth/v1/token?grant_type=password", {
      method:"POST",
      headers:{"apikey":SUPA_ANON,"Content-Type":"application/json"},
      body:JSON.stringify({email,password})
    });
    return r.json();
  },

  async signOut(token) {
    await fetch(SUPA_URL+"/auth/v1/logout", {
      method:"POST",
      headers:supaHeaders(token)
    }).catch(()=>{});
  },

  async getProfile(userId, token) {
    const r = await fetch(SUPA_URL+"/rest/v1/profiles?id=eq."+userId+"&select=*", {
      headers:supaHeaders(token)
    });
    const d = await r.json();
    return Array.isArray(d) ? d[0] : null;
  },

  async upsertProfile(userId, token, data) {
    await fetch(SUPA_URL+"/rest/v1/profiles?id=eq."+userId, {
      method:"PATCH",
      headers:{...supaHeaders(token),"Prefer":"return=minimal"},
      body:JSON.stringify(data)
    });
  },

  async saveSchedina(userId, token, data) {
    const r = await fetch(SUPA_URL+"/rest/v1/schedine", {
      method:"POST",
      headers:supaHeaders(token),
      body:JSON.stringify({...data, user_id:userId})
    });
    return r.json();
  },

  async getSchedine(userId, token) {
    const r = await fetch(SUPA_URL+"/rest/v1/schedine?user_id=eq."+userId+"&order=created_at.desc&limit=100&select=*", {
      headers:supaHeaders(token)
    });
    return r.json();
  },

  async updateSchedina(id, token, data) {
    await fetch(SUPA_URL+"/rest/v1/schedine?id=eq."+id, {
      method:"PATCH",
      headers:{...supaHeaders(token),"Prefer":"return=minimal"},
      body:JSON.stringify(data)
    });
  },

  async resetPassword(email) {
    const r = await fetch(SUPA_URL+"/auth/v1/recover", {
      method:"POST",
      headers:{"apikey":SUPA_ANON,"Content-Type":"application/json"},
      body:JSON.stringify({email})
    });
    return r.json();
  },

  getSession() {
    try { return JSON.parse(localStorage.getItem("betai_sess")||"null"); } catch { return null; }
  },
  setSession(s) { localStorage.setItem("betai_sess", JSON.stringify(s)); },
  clearSession() { localStorage.removeItem("betai_sess"); }
};

// Keep backward compat alias
const supa = sb;

// ═══════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#05080f;--bg2:#080c17;--card:#0c1122;--card2:#101626;--card3:#141c2e;
  --border:rgba(255,255,255,0.05);--border2:rgba(255,255,255,0.10);--border3:rgba(255,255,255,0.16);
  --cyan:#00d4ff;--cyan2:#0099cc;--purple:#8b5cf6;--gold:#f5b800;--red:#ff4466;--green:#00e090;--orange:#ff8c42;
  --text:#dde3f0;--text2:#b8c4d8;--muted:#3d4a6a;--muted2:#5d6e8e;--muted3:#7a8aaa;
  --font:'DM Sans',sans-serif;--mono:'JetBrains Mono',monospace;--display:'Bebas Neue',sans-serif;
  --shadow:0 4px 24px rgba(0,0,0,0.4);--shadow2:0 8px 40px rgba(0,0,0,0.5);
  --glow-cyan:0 0 24px rgba(0,212,255,0.2);--glow-gold:0 0 24px rgba(245,184,0,0.2);
}
body{font-family:var(--font);background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden;}
::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:var(--muted);border-radius:4px;}
::-webkit-scrollbar-thumb:hover{background:var(--cyan2);}

/* ── ANIMATIONS ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes shimmer{to{transform:translateX(200%)}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(0,212,255,0.15)}50%{box-shadow:0 0 40px rgba(0,212,255,0.4)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes popIn{0%{transform:scale(0.9);opacity:0}100%{transform:scale(1);opacity:1}}
@keyframes adPulse{0%,100%{border-color:rgba(245,184,0,0.15)}50%{border-color:rgba(245,184,0,0.45)}}
@keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.anim-float{animation:float 3s ease-in-out infinite;}

/* ── NAV ── */
.nav{position:fixed;top:0;left:0;right:0;z-index:200;display:flex;align-items:center;justify-content:space-between;padding:14px 40px;background:rgba(5,8,15,0.88);backdrop-filter:blur(32px);-webkit-backdrop-filter:blur(32px);border-bottom:1px solid var(--border);}
.nav-logo{display:flex;align-items:center;gap:10px;cursor:pointer;}
.nav-logo-mark{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,var(--cyan),#0055ff);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:#05080f;font-family:var(--display);box-shadow:var(--glow-cyan);}
.nav-logo-text{font-family:var(--display);font-size:22px;letter-spacing:2px;color:white;}
.nav-logo-text span{color:var(--cyan);}
.nav-links{display:flex;align-items:center;gap:24px;}
.nav-link{font-size:13px;font-weight:500;color:var(--muted3);cursor:pointer;transition:color 0.2s;}
.nav-link:hover{color:var(--text);}
.nav-cta{padding:9px 22px;border-radius:10px;font-size:14px;font-weight:700;background:linear-gradient(135deg,var(--cyan),#0055ff);color:#05080f;border:none;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 16px rgba(0,212,255,0.25);}
.nav-cta:hover{transform:translateY(-1px);box-shadow:0 6px 24px rgba(0,212,255,0.4);}

/* ── HERO ── */
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:120px 24px 80px;text-align:center;position:relative;overflow:hidden;background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(0,212,255,0.06) 0%,transparent 60%);}
.hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px);background-size:50px 50px;mask-image:radial-gradient(ellipse 80% 80% at 50% 30%,black 40%,transparent 100%);}
.hero-glow{position:absolute;top:-10%;left:50%;transform:translateX(-50%);width:900px;height:600px;background:radial-gradient(ellipse,rgba(0,212,255,0.05) 0%,transparent 70%);pointer-events:none;}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(0,212,255,0.07);border:1px solid rgba(0,212,255,0.2);color:var(--cyan);font-size:10px;font-weight:700;letter-spacing:3px;padding:7px 18px;border-radius:30px;margin-bottom:28px;text-transform:uppercase;animation:fadeUp 0.5s 0.1s both;}
.hero-title{font-family:var(--display);font-size:clamp(56px,9vw,108px);line-height:0.9;color:white;margin-bottom:24px;letter-spacing:2px;animation:fadeUp 0.5s 0.2s both;}
.hero-title .accent{background:linear-gradient(135deg,var(--cyan),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.hero-sub{font-size:clamp(14px,1.8vw,17px);color:var(--muted3);max-width:520px;line-height:1.8;margin-bottom:44px;animation:fadeUp 0.5s 0.3s both;}
.hero-btns{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;animation:fadeUp 0.5s 0.4s both;}
.btn-primary{padding:15px 34px;border-radius:12px;font-size:15px;font-weight:700;background:linear-gradient(135deg,var(--cyan),#0066ff);color:#05080f;border:none;cursor:pointer;transition:all 0.25s;position:relative;overflow:hidden;box-shadow:0 6px 24px rgba(0,212,255,0.3);}
.btn-primary::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);animation:shimmer 2.5s infinite;}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(0,212,255,0.4);}
.btn-outline{padding:15px 34px;border-radius:12px;font-size:15px;font-weight:600;background:rgba(255,255,255,0.03);color:var(--text2);border:1px solid var(--border2);cursor:pointer;transition:all 0.25s;backdrop-filter:blur(8px);}
.btn-outline:hover{border-color:var(--cyan);color:var(--cyan);background:rgba(0,212,255,0.04);}
.hero-stats{display:flex;gap:52px;margin-top:64px;justify-content:center;animation:fadeUp 0.5s 0.5s both;flex-wrap:wrap;}
.hstat-val{font-family:var(--display);font-size:42px;color:white;letter-spacing:1px;}
.hstat-lbl{font-size:10px;color:var(--muted3);letter-spacing:2px;text-transform:uppercase;margin-top:2px;}

/* ── SECTION ── */
.section{padding:90px 24px;max-width:1100px;margin:0 auto;position:relative;z-index:1;}
.section-label{font-size:10px;font-weight:700;letter-spacing:4px;color:var(--cyan);text-transform:uppercase;margin-bottom:12px;}
.section-title{font-family:var(--display);font-size:clamp(34px,5vw,56px);color:white;line-height:0.95;margin-bottom:16px;letter-spacing:1px;}
.sec-bg{background:var(--bg2);border-top:1px solid var(--border);border-bottom:1px solid var(--border);}

/* ── FEATURES ── */
.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;margin-top:56px;}
.feature-card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:28px;transition:all 0.3s;position:relative;overflow:hidden;}
.feature-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(0,212,255,0.3),transparent);opacity:0;transition:opacity 0.3s;}
.feature-card:hover{border-color:rgba(0,212,255,0.2);transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,0.3);}
.feature-card:hover::before{opacity:1;}
.feat-icon{font-size:28px;margin-bottom:16px;display:block;}
.feat-title{font-size:16px;font-weight:700;color:white;margin-bottom:8px;}
.feat-desc{font-size:13px;color:var(--muted3);line-height:1.7;}

/* ── WINS ── */
.wins-ticker-wrap{overflow:hidden;background:rgba(0,224,144,0.03);border-top:1px solid rgba(0,224,144,0.1);border-bottom:1px solid rgba(0,224,144,0.1);padding:10px 0;}
.wins-ticker{display:flex;gap:60px;animation:ticker 30s linear infinite;width:max-content;}
.wins-ticker-item{display:flex;align-items:center;gap:8px;white-space:nowrap;font-size:13px;font-weight:600;color:var(--green);}
.wins-ticker-dot{width:5px;height:5px;border-radius:50%;background:var(--green);animation:pulse 1.5s infinite;flex-shrink:0;}
.wins-counters{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:48px;}
.wins-counter-card{background:var(--card);border:1px solid rgba(0,224,144,0.1);border-radius:16px;padding:24px 20px;text-align:center;transition:all 0.3s;}
.wins-counter-card:hover{border-color:rgba(0,224,144,0.3);transform:translateY(-2px);}
.wcc-val{font-family:var(--display);font-size:42px;color:var(--green);line-height:1;margin-bottom:4px;}
.wcc-lbl{font-size:10px;color:var(--muted2);letter-spacing:2px;text-transform:uppercase;}
.wins-tabs{display:flex;gap:6px;background:var(--card2);border-radius:12px;padding:4px;margin-bottom:24px;width:fit-content;}
.wins-tab{padding:8px 20px;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;color:var(--muted2);}
.wins-tab.active{background:var(--green);color:#05080f;}
.win-cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;}
.win-card{background:var(--card);border:1px solid rgba(0,224,144,0.1);border-radius:20px;padding:20px;transition:all 0.3s;animation:popIn 0.4s ease both;}
.win-card:hover{transform:translateY(-3px);border-color:rgba(0,224,144,0.3);box-shadow:0 8px 32px rgba(0,0,0,0.3);}
.win-match-row{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--card2);border-radius:8px;border-left:2px solid var(--green);margin-bottom:8px;}

/* ── PRICING ── */
.pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:60px;}
.price-card{background:var(--card);border:1px solid var(--border);border-radius:24px;padding:32px 28px;position:relative;transition:all 0.3s;}
.price-card.featured{border-color:rgba(0,212,255,0.3);background:linear-gradient(135deg,rgba(0,212,255,0.04),var(--card));transform:scale(1.04);box-shadow:0 0 40px rgba(0,212,255,0.1);}
.price-card:hover{transform:translateY(-4px);}
.price-card.featured:hover{transform:scale(1.04) translateY(-4px);}
.price-popular{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,var(--cyan),#0055ff);color:#05080f;font-size:9px;font-weight:800;letter-spacing:2px;padding:4px 16px;border-radius:20px;text-transform:uppercase;white-space:nowrap;}
.price-plan{font-size:10px;font-weight:700;letter-spacing:3px;color:var(--muted2);text-transform:uppercase;margin-bottom:12px;}
.price-amount{font-family:var(--display);font-size:54px;color:white;line-height:1;margin-bottom:4px;}
.price-period{font-size:12px;color:var(--muted2);margin-bottom:24px;}
.price-features{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:28px;}
.price-feature{font-size:13px;color:var(--muted2);display:flex;align-items:center;gap:8px;}
.price-btn{width:100%;padding:13px;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.2s;border:none;}
.price-btn.primary{background:linear-gradient(135deg,var(--cyan),#0055ff);color:#05080f;}
.price-btn.primary:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,212,255,0.3);}
.price-btn.outline{background:transparent;color:var(--text2);border:1px solid var(--border2);}
.price-btn.outline:hover{border-color:var(--cyan);color:var(--cyan);}

/* ── AD ── */
.ad-banner-top{width:100%;background:linear-gradient(90deg,#120c00,#1e1400,#120c00);border-top:1px solid rgba(245,184,0,0.15);border-bottom:1px solid rgba(245,184,0,0.15);padding:10px 24px;display:flex;align-items:center;justify-content:space-between;animation:adPulse 3s ease-in-out infinite;position:relative;overflow:hidden;}
.ad-badge{font-size:9px;font-weight:700;letter-spacing:1px;color:rgba(245,184,0,0.4);background:rgba(245,184,0,0.06);border:1px solid rgba(245,184,0,0.12);padding:2px 7px;border-radius:4px;text-transform:uppercase;flex-shrink:0;}
.ad-content{display:flex;align-items:center;gap:16px;flex:1;justify-content:center;}
.ad-bk-logo{font-family:var(--display);font-size:18px;letter-spacing:1px;}
.ad-text{font-size:13px;color:rgba(255,255,255,0.7);}
.ad-text strong{color:var(--gold);}
.ad-cta-btn{padding:6px 16px;border-radius:8px;font-size:12px;font-weight:700;border:none;cursor:pointer;white-space:nowrap;}
.ad-sidebar-card{background:var(--card2);border:1px solid rgba(245,184,0,0.12);border-radius:16px;padding:16px;margin-bottom:16px;position:relative;overflow:hidden;animation:adPulse 4s ease-in-out infinite;}
.ad-sidebar-card::after{content:'Sponsorizzato';position:absolute;top:8px;right:8px;font-size:9px;color:rgba(255,255,255,0.25);letter-spacing:1px;}
.ad-sb-logo{font-family:var(--display);font-size:22px;letter-spacing:1px;margin-bottom:8px;}
.ad-sb-offer{font-size:13px;font-weight:700;margin-bottom:4px;}
.ad-sb-sub{font-size:11px;color:var(--muted2);margin-bottom:12px;line-height:1.5;}
.ad-sb-btn{width:100%;padding:9px;border-radius:10px;font-size:13px;font-weight:700;border:none;cursor:pointer;}
.ad-inline-card{background:linear-gradient(135deg,rgba(18,12,0,1),rgba(12,16,8,1));border:1px solid rgba(245,184,0,0.15);border-radius:18px;padding:20px;position:relative;overflow:hidden;display:flex;gap:20px;align-items:center;}
.ad-label{font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);opacity:0.5;margin-bottom:4px;}
.ad-inline-logo{font-family:var(--display);font-size:32px;letter-spacing:2px;flex-shrink:0;}
.ad-inline-info{flex:1;}
.ad-inline-title{font-size:16px;font-weight:700;color:white;margin-bottom:4px;}
.ad-inline-body{font-size:13px;color:var(--muted2);line-height:1.5;margin-bottom:14px;}
.ad-inline-btn{padding:10px 24px;border-radius:10px;font-size:14px;font-weight:700;border:none;cursor:pointer;}
.ad-inline-terms{font-size:10px;color:var(--muted);margin-top:8px;}
.partners-section{padding:48px 24px;border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg2);text-align:center;}
.partners-label{font-size:10px;letter-spacing:3px;color:var(--muted);text-transform:uppercase;margin-bottom:24px;}
.partners-grid{display:flex;justify-content:center;align-items:center;gap:32px;flex-wrap:wrap;}
.partner-logo{font-family:var(--display);font-size:22px;letter-spacing:2px;opacity:0.3;transition:opacity 0.2s;cursor:pointer;}
.partner-logo:hover{opacity:0.6;}
.partner-logo.sponsor{opacity:0.5;color:var(--gold);}
.partner-logo.sponsor:hover{opacity:0.9;}

/* ── AUTH ── */
.auth-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:radial-gradient(ellipse 60% 50% at 50% 0%,rgba(0,212,255,0.05) 0%,transparent 60%);}
.auth-card{background:var(--card);border:1px solid var(--border2);border-radius:24px;padding:44px 40px;width:100%;max-width:420px;animation:fadeUp 0.4s ease;box-shadow:0 24px 64px rgba(0,0,0,0.5);}
.auth-logo-mark{width:52px;height:52px;border-radius:16px;background:linear-gradient(135deg,var(--cyan),#0055ff);display:flex;align-items:center;justify-content:center;font-family:var(--display);font-size:26px;color:#05080f;margin:0 auto 12px;animation:glow 2s ease-in-out infinite;}
.auth-tabs{display:flex;background:var(--card2);border-radius:12px;padding:4px;margin-bottom:28px;gap:4px;}
.auth-tab{flex:1;padding:9px;border-radius:9px;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s;text-align:center;color:var(--muted2);}
.auth-tab.active{background:var(--cyan);color:#05080f;}
.form-label{font-size:10px;font-weight:700;color:var(--muted3);letter-spacing:1.5px;margin-bottom:6px;display:block;text-transform:uppercase;}
.form-input{width:100%;padding:12px 14px;border-radius:12px;font-size:14px;background:var(--card2);border:1px solid var(--border2);color:var(--text);font-family:var(--font);transition:all 0.2s;outline:none;margin-bottom:14px;}
.form-input:focus{border-color:var(--cyan);box-shadow:0 0 0 3px rgba(0,212,255,0.07);}
.form-input::placeholder{color:var(--muted);}
.auth-btn{width:100%;padding:14px;border-radius:12px;font-size:15px;font-weight:700;background:linear-gradient(135deg,var(--cyan),#0066ff);color:#05080f;border:none;cursor:pointer;transition:all 0.2s;margin-top:4px;box-shadow:0 4px 20px rgba(0,212,255,0.3);}
.auth-btn:hover{transform:translateY(-1px);box-shadow:0 8px 28px rgba(0,212,255,0.4);}
.auth-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;}

/* ── DASHBOARD LAYOUT ── */
.dash-layout{display:flex;min-height:100vh;background:var(--bg);}
.sidebar{width:228px;background:var(--card);border-right:1px solid var(--border);padding:20px 12px;display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:50;overflow-y:auto;}
.sidebar-logo{display:flex;align-items:center;gap:8px;padding:8px 10px;margin-bottom:24px;}
.sidebar-logo-mark{width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,var(--cyan),#0055ff);display:flex;align-items:center;justify-content:center;font-family:var(--display);font-size:15px;color:#05080f;box-shadow:0 2px 12px rgba(0,212,255,0.3);}
.sidebar-logo-text{font-family:var(--display);font-size:18px;letter-spacing:2px;color:white;}
.sidebar-logo-text span{color:var(--cyan);}
.sidebar-nav{display:flex;flex-direction:column;gap:2px;flex:1;}
.sidebar-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;font-size:13px;font-weight:500;color:var(--muted2);cursor:pointer;transition:all 0.18s;}
.sidebar-item:hover{background:var(--card2);color:var(--text2);}
.sidebar-item.active{background:rgba(0,212,255,0.07);color:var(--cyan);font-weight:600;}
.sidebar-section{font-size:9px;font-weight:700;letter-spacing:2px;color:var(--muted);text-transform:uppercase;padding:10px 12px 4px;}
.sidebar-bottom{border-top:1px solid var(--border);padding-top:12px;margin-top:8px;}
.sidebar-avatar{width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,var(--cyan),var(--purple));display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#05080f;flex-shrink:0;}
.sidebar-logout{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:9px;font-size:13px;color:var(--muted2);cursor:pointer;transition:all 0.2s;}
.sidebar-logout:hover{color:var(--red);background:rgba(255,68,102,0.06);}
.dash-main{margin-left:228px;flex:1;padding:28px 32px;min-height:100vh;max-width:calc(100vw - 228px);}
.dash-topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid var(--border);}
.dash-title{font-family:var(--display);font-size:28px;color:white;letter-spacing:1px;}
.stats-bar{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;}
.stat-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px 18px;transition:all 0.2s;}
.stat-card:hover{border-color:var(--border2);transform:translateY(-1px);}
.stat-card-val{font-family:var(--display);font-size:28px;color:white;margin-bottom:2px;}
.stat-card-lbl{font-size:9px;color:var(--muted2);letter-spacing:1.5px;text-transform:uppercase;}
.stat-card-trend{font-size:10px;margin-top:4px;font-weight:600;font-family:var(--mono);}

/* ── TODAY MATCHES ── */
.today-section{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:20px;margin-bottom:18px;}
.today-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px;}
.today-title{font-family:var(--display);font-size:19px;letter-spacing:1px;color:white;}
.today-live{display:flex;align-items:center;gap:5px;font-size:10px;font-weight:700;color:var(--green);background:rgba(0,224,144,0.07);border:1px solid rgba(0,224,144,0.18);padding:4px 10px;border-radius:20px;letter-spacing:1px;}
.today-live-dot{width:6px;height:6px;border-radius:50%;background:var(--green);animation:pulse 1.5s infinite;}
.sport-filter{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:14px;}
.sport-filter-btn{padding:5px 12px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid var(--border);background:transparent;color:var(--muted2);transition:all 0.18s;}
.sport-filter-btn:hover{color:var(--text2);border-color:var(--border2);}
.sport-filter-btn.active{background:rgba(0,212,255,0.08);border-color:rgba(0,212,255,0.3);color:var(--cyan);}
.matches-grid{display:flex;flex-direction:column;gap:6px;max-height:380px;overflow-y:auto;padding-right:4px;}
.matches-grid::-webkit-scrollbar{width:3px;}
.matches-grid::-webkit-scrollbar-thumb{background:var(--muted);border-radius:2px;}
.match-row{background:var(--card2);border:1px solid var(--border);border-radius:12px;padding:11px 14px;display:flex;align-items:center;justify-content:space-between;transition:all 0.18s;cursor:pointer;}
.match-row:hover{border-color:rgba(0,212,255,0.2);background:rgba(0,212,255,0.02);}
.match-row.selected{border-color:rgba(0,212,255,0.4);background:rgba(0,212,255,0.05);}
.match-row-left{flex:1;min-width:0;}
.match-row-teams{font-size:12px;font-weight:600;color:var(--text);margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.match-row-meta{display:flex;gap:8px;align-items:center;}
.match-row-league{font-size:10px;color:var(--muted2);font-family:var(--mono);}
.match-row-time{font-size:10px;color:var(--cyan);font-family:var(--mono);font-weight:700;}
.match-row-odds{display:flex;gap:5px;align-items:center;flex-shrink:0;}
.odds-btn{padding:5px 9px;border-radius:7px;font-size:11px;font-weight:700;font-family:var(--mono);background:var(--card);border:1px solid var(--border);color:var(--muted2);cursor:pointer;transition:all 0.18s;min-width:40px;text-align:center;}
.odds-btn:hover{border-color:var(--gold);color:var(--gold);}
.odds-btn.sel{background:rgba(245,184,0,0.08);border-color:rgba(245,184,0,0.4);color:var(--gold);}
.odds-label{font-size:8px;color:var(--muted);text-align:center;margin-top:2px;letter-spacing:0.5px;}
.no-matches{text-align:center;padding:36px;color:var(--muted2);font-size:13px;}
.matches-loading{display:flex;align-items:center;justify-content:center;gap:12px;padding:28px;color:var(--muted2);font-size:13px;}

/* ── GENERATOR ── */
.generator-card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:24px;margin-bottom:18px;}
.label-text{font-size:9px;font-weight:700;letter-spacing:2px;color:var(--muted2);text-transform:uppercase;display:block;margin-bottom:8px;}
.sport-pills{display:flex;gap:7px;flex-wrap:wrap;}
.sport-pill{padding:7px 14px;border-radius:50px;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.18s;border:1px solid var(--border);background:transparent;color:var(--muted2);}
.sport-pill:hover{color:var(--text2);border-color:var(--border2);}
.sport-pill.active{background:rgba(0,212,255,0.07);border-color:rgba(0,212,255,0.3);color:var(--cyan);}
.risk-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
.risk-card-btn{border-radius:12px;padding:14px 10px;cursor:pointer;border:1px solid var(--border);background:var(--card2);transition:all 0.2s;text-align:center;}
.risk-card-btn:hover{transform:translateY(-2px);border-color:var(--border2);}
.risk-card-btn.r-safe.active{border-color:var(--green);background:rgba(0,224,144,0.05);}
.risk-card-btn.r-balanced.active{border-color:var(--gold);background:rgba(245,184,0,0.05);}
.risk-card-btn.r-high.active{border-color:var(--red);background:rgba(255,68,102,0.05);}
.slider-row{display:flex;align-items:center;gap:12px;margin-bottom:12px;}
.slider-lbl{font-size:12px;color:var(--muted2);min-width:140px;}
.slider-val{font-family:var(--mono);font-size:16px;font-weight:700;min-width:56px;text-align:right;}
input[type=range]{flex:1;-webkit-appearance:none;height:3px;background:var(--card2);border-radius:2px;outline:none;cursor:pointer;}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:var(--cyan);cursor:pointer;box-shadow:0 0 10px rgba(0,212,255,0.5);}
.gen-btn{width:100%;padding:16px;border-radius:14px;border:none;cursor:pointer;font-family:var(--display);font-size:18px;letter-spacing:2px;background:linear-gradient(135deg,var(--cyan),#0055ff);color:#05080f;transition:all 0.25s;position:relative;overflow:hidden;box-shadow:0 4px 20px rgba(0,212,255,0.25);}
.gen-btn::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);animation:shimmer 2s infinite;}
.gen-btn:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(0,212,255,0.4);}
.gen-btn:disabled{opacity:0.45;cursor:not-allowed;transform:none;box-shadow:none;}

/* ── RESULTS ── */
.result-wrap{background:var(--card);border:1px solid var(--border2);border-radius:20px;padding:22px;margin-top:16px;animation:fadeUp 0.4s ease;}
.result-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px;}
.result-pills{display:flex;gap:7px;flex-wrap:wrap;}
.result-pill{font-family:var(--mono);font-size:10px;padding:4px 10px;border-radius:20px;font-weight:700;letter-spacing:0.5px;}
.rp-green{background:rgba(0,224,144,0.08);color:var(--green);border:1px solid rgba(0,224,144,0.2);}
.rp-gold{background:rgba(245,184,0,0.08);color:var(--gold);border:1px solid rgba(245,184,0,0.2);}
.rp-cyan{background:rgba(0,212,255,0.08);color:var(--cyan);border:1px solid rgba(0,212,255,0.2);}
.match-list{display:flex;flex-direction:column;gap:8px;margin-bottom:16px;}
.match-item{background:var(--card2);border:1px solid var(--border);border-radius:14px;padding:14px 16px;transition:all 0.2s;}
.match-item:hover{border-color:var(--border2);}
.match-item-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
.match-teams{font-size:14px;font-weight:700;color:white;}
.match-meta{font-size:10px;color:var(--muted2);font-family:var(--mono);margin-top:2px;}
.match-quota{font-family:var(--mono);font-size:14px;font-weight:700;color:var(--gold);background:rgba(245,184,0,0.07);border:1px solid rgba(245,184,0,0.18);padding:5px 11px;border-radius:9px;}
.match-stats-row{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;}
.match-stat-chip{font-size:10px;padding:3px 8px;border-radius:6px;font-family:var(--mono);font-weight:600;}
.msc-green{background:rgba(0,224,144,0.07);color:var(--green);}
.msc-gold{background:rgba(245,184,0,0.07);color:var(--gold);}
.msc-cyan{background:rgba(0,212,255,0.07);color:var(--cyan);}
.msc-red{background:rgba(255,68,102,0.07);color:var(--red);}
.ai-reasoning{background:rgba(0,212,255,0.02);border:1px solid rgba(0,212,255,0.1);border-radius:14px;padding:14px;margin-bottom:14px;}
.ai-reasoning-label{font-size:9px;font-weight:700;color:var(--cyan);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;}
.ai-reasoning-text{font-size:12px;color:var(--muted3);line-height:1.8;}
.cursor::after{content:'|';animation:blink 0.7s infinite;color:var(--cyan);}
.result-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
.rs-box{background:var(--card2);border-radius:12px;padding:14px;text-align:center;border:1px solid var(--border);}

/* ── HISTORY ── */
.history-list{display:flex;flex-direction:column;gap:6px;}
.history-item{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:13px 16px;display:flex;align-items:center;gap:12px;transition:all 0.2s;}
.history-item:hover{border-color:var(--border2);}
.history-info{flex:1;min-width:0;}
.history-status{font-size:9px;font-weight:700;padding:3px 10px;border-radius:20px;letter-spacing:0.5px;}
.hs-won{background:rgba(0,224,144,0.08);color:var(--green);border:1px solid rgba(0,224,144,0.2);}
.hs-lost{background:rgba(255,68,102,0.08);color:var(--red);border:1px solid rgba(255,68,102,0.2);}
.hs-wait{background:rgba(0,212,255,0.08);color:var(--cyan);border:1px solid rgba(0,212,255,0.2);}
.spinner{width:38px;height:38px;border:3px solid var(--card2);border-top-color:var(--cyan);border-radius:50%;animation:spin 0.7s linear infinite;margin:0 auto 12px;}
.lang-btn{padding:5px 12px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;border:none;background:transparent;color:var(--muted2);transition:all 0.2s;}
.lang-btn.active{background:var(--cyan);color:#05080f;}
.premium-lock{background:rgba(245,184,0,0.04);border:1px solid rgba(245,184,0,0.15);border-radius:14px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;margin-top:12px;}
.upgrade-btn{padding:7px 16px;border-radius:8px;background:var(--gold);color:#05080f;font-size:12px;font-weight:700;border:none;cursor:pointer;}
.dash-wins-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;}
.dash-win-card{background:var(--card);border:1px solid rgba(0,224,144,0.1);border-radius:16px;padding:16px;transition:all 0.2s;}
.dash-win-card:hover{border-color:rgba(0,224,144,0.3);transform:translateY(-2px);}
.footer{border-top:1px solid var(--border);padding:48px 40px;display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:32px;background:var(--bg2);}
.footer-col-title{font-size:11px;font-weight:700;letter-spacing:2px;color:var(--muted2);text-transform:uppercase;margin-bottom:16px;}
.footer-link{font-size:13px;color:var(--muted2);cursor:pointer;transition:color 0.2s;margin-bottom:8px;display:block;}
.footer-link:hover{color:var(--text);}
.footer-bottom{border-top:1px solid var(--border);padding:20px 40px;display:flex;justify-content:space-between;align-items:center;background:var(--bg2);}
.footer-disclaimer{font-size:10px;color:var(--muted);max-width:600px;line-height:1.7;}

/* ── MOBILE ── */
@media(max-width:768px){
  .nav{padding:12px 16px;}.nav-links{display:none;}
  .hero{padding:90px 16px 60px;background:none;}
  .hero-stats{gap:24px;margin-top:36px;}
  .hstat-val{font-size:30px;}
  .hero-btns{flex-direction:column;align-items:stretch;width:100%;max-width:320px;}
  .btn-primary,.btn-outline{text-align:center;}
  .pricing-grid{grid-template-columns:1fr;}.price-card.featured{transform:none;}
  .footer{grid-template-columns:1fr 1fr;padding:28px 16px;gap:16px;}
  .footer-bottom{flex-direction:column;gap:8px;text-align:center;padding:14px 16px;}
  .sidebar{display:none;}
  .dash-main{margin-left:0 !important;padding:14px 14px 80px !important;max-width:100vw !important;}
  .dash-topbar{padding-bottom:12px;margin-bottom:14px;}
  .dash-title{font-size:22px;}
  .stats-bar{grid-template-columns:repeat(2,1fr);gap:8px;}
  .stat-card{padding:12px;}
  .stat-card-val{font-size:22px;}
  .generator-card{padding:14px !important;}
  .risk-grid{grid-template-columns:1fr !important;}
  .today-section{padding:14px !important;}
  .match-row-odds{display:none;}
  .result-wrap{padding:14px !important;}
  .result-top{flex-direction:column;align-items:flex-start;}
  .result-stats{gap:6px;}
  .rs-box{padding:10px 6px;}
  .match-item{padding:10px 12px !important;}
  .match-teams{font-size:13px !important;}
  .history-item{flex-wrap:wrap;}
  .wins-counters{grid-template-columns:repeat(2,1fr);}
  .dash-wins-grid{grid-template-columns:1fr;}
  .gen-btn{font-size:15px !important;padding:14px !important;}
  .slider-lbl{min-width:100px;font-size:11px;}
  .auth-card{padding:28px 20px;}
  .today-header{gap:6px;}
}

/* ── TABLET ── */
@media(min-width:769px) and (max-width:1100px){
  .sidebar{width:64px;padding:14px 8px;}
  .sidebar-logo-text,.sidebar-item span,.sidebar-section,.sidebar-bottom > div:first-child div{display:none;}
  .sidebar-item{justify-content:center;padding:10px;}
  .dash-main{margin-left:64px;padding:20px 24px;max-width:calc(100vw - 64px);}
  .stats-bar{grid-template-columns:repeat(2,1fr);}
}

/* ── BOTTOM NAV (mobile) ── */
.mobile-bottom-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:rgba(8,12,23,0.97);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-top:1px solid var(--border2);z-index:300;padding:4px 0 env(safe-area-inset-bottom,4px);}
.mobile-nav-item{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:7px 4px;cursor:pointer;transition:all 0.18s;color:var(--muted);font-size:8px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;}
.mobile-nav-item.active{color:var(--cyan);}
.mobile-nav-item .nav-icon{font-size:19px;line-height:1;}
@media(max-width:768px){.mobile-bottom-nav{display:flex !important;}}
`;

// ═══════════════════════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════════════════════
const T = {
  it:{
    nav:{how:"Come Funziona",features:"Funzioni",wins:"Vincite",pricing:"Prezzi",login:"Accedi",cta:"Inizia Gratis"},
    hero:{badge:"AI-Powered Analytics",t1:"LA SCHEDINA",t2:"PERFETTA",sub:"BetAI analizza le partite di oggi in tempo reale, studia quote e statistiche di ogni squadra, e costruisce la schedina più vicina possibile al tuo obiettivo.",cta1:"Inizia Gratis",cta2:"Come Funziona",sv:[["2.400+","Schedine"],["68%","Successo"],["40+","Stat/partita"],["30+","Campionati"]]},
    features:{label:"Funzionalità",title:"AI REALE, PARTITE REALI",cards:[{icon:"📡",t:"Partite di oggi in tempo reale",d:"BetAI carica automaticamente tutte le partite di oggi con le quote live dei bookmaker."},{icon:"🧠",t:"40+ Statistiche per partita",d:"Forma recente, scontri diretti, xG, infortuni, rendimento casa/trasferta."},{icon:"📊",t:"Edge vs Bookmaker",d:"L'AI confronta la propria stima con le quote reali e seleziona solo le partite con vantaggio positivo."},{icon:"🎚️",t:"Rischio su misura",d:"Imposti tu probabilità e quota obiettivo. L'AI seleziona le partite che si avvicinano di più."},{icon:"🔔",t:"Notifiche Push",d:"Ti avvisiamo quando la schedina è pronta o le quote cambiano significativamente."},{icon:"🏆",t:"Storico Performance",d:"Traccia ogni schedina, analizza le tue tendenze e migliora nel tempo."}]},
    pricing:{label:"Prezzi",title:"INIZIA GRATIS",plans:[{name:"Starter",price:"0",period:"per sempre",popular:false,features:["1 schedina/giorno","Solo livello Sicuro","Calcio e Basket","x AI dettagliata","x Notifiche push"],cta:"Inizia Gratis",style:"outline"},{name:"Pro",price:"9.99",period:"al mese",popular:true,features:["Schedine illimitate","Tutti i livelli","Tutti gli sport","AI + 40 statistiche","Notifiche push"],cta:"Inizia ora",style:"primary"},{name:"Elite",price:"24.99",period:"al mese",popular:false,features:["Tutto di Pro","Quote live","Gestione bankroll","Supporto prioritario","Early access"],cta:"Scegli Elite",style:"outline"}]},
    auth:{tabLogin:"Accedi",tabReg:"Registrati",email:"Email",pass:"Password",name:"Nome",btnLogin:"Accedi",btnReg:"Crea account",sw1:"Non hai un account?",sw2:"Hai già un account?",c1:"Registrati",c2:"Accedi"},
    dash:{welcome:"Bentornato",stats:["Schedine","Vinte","Successo","Quota Media"],genTitle:"GENERA SCHEDINA",sport:"Sport",risk:"Livello Rischio",prob:"Probabilità vincita",quota:"Quota obiettivo",genBtn:"GENERA SCHEDINA AI",generating:"Analisi statistica in corso...",result:"Schedina Consigliata",aiLabel:"Analisi AI",histTitle:"Storico",histEmpty:"Nessuna schedina. Generane una!",sports:["Calcio","Basket","Tennis","Formula 1"],sportEmoji:["⚽","🏀","🎾","🏎️"],risks:[{id:"safe",emoji:"🟢",name:"Sicuro",sub:"Alta prob."},{id:"balanced",emoji:"🟡",name:"Bilanciato",sub:"Equilibrato"},{id:"high",emoji:"🔴",name:"High Risk",sub:"Alta quota"}],nav:["Dashboard","Schedine","Hall of Fame","Analisi Schedina","Profilo"],navEmoji:["🎯","📋","🏆","🔬","👤"],logout:"Esci",premiumMsg:"High Risk disponibile con Pro",upgrade:"Upgrade",hallTitle:"HALL OF FAME",hallSub:"Le migliori schedine della community",todayTitle:"PARTITE DI OGGI",todayLive:"LIVE",todayEmpty:"Nessuna partita trovata per oggi.",todayLoading:"Caricamento partite...",todayFilter:"Filtra per campionato",todayCount:"partite trovate",todayRefresh:"Aggiorna",selMatch:"Usa questa partita"},
    wins:{label:"Prove di Vincita",title:"RISULTATI REALI",sub:"Schedine reali dei nostri utenti.",tabs:["Schedine Vinte","Screenshots"],cLabels:["Schedine Vinte","Tasso Successo","Profitti Totali","Utenti Attivi"],won:"VINTA",stake:"Puntata"},
    footer:{disclaimer:"BetAI è uno strumento di analisi statistica a scopo informativo. Le scommesse comportano rischi. Vietato ai minori di 18 anni. Gioca responsabilmente.",cols:[{t:"Prodotto",links:["Come funziona","Funzionalità","Prezzi","API"]},{t:"Legale",links:["Privacy Policy","Termini","Cookie","GDPR"]},{t:"Supporto",links:["Centro Aiuto","Contattaci","Community"]}]},
  },
  en:{
    nav:{how:"How It Works",features:"Features",wins:"Wins",pricing:"Pricing",login:"Log in",cta:"Start Free"},
    hero:{badge:"AI-Powered Analytics",t1:"THE PERFECT",t2:"BET SLIP",sub:"BetAI loads today's real matches, analyzes odds and team statistics, and builds the bet slip closest to your target.",cta1:"Try for Free",cta2:"How It Works",sv:[["2,400+","Bets"],["68%","Success"],["40+","Stats/match"],["30+","Leagues"]]},
    features:{label:"Features",title:"REAL AI, REAL MATCHES",cards:[{icon:"📡",t:"Today's matches live",d:"BetAI automatically loads all today's matches with live bookmaker odds."},{icon:"🧠",t:"40+ Stats per match",d:"Recent form, H2H, xG, injuries, home/away performance."},{icon:"📊",t:"Edge vs Bookmaker",d:"AI compares its estimate against real odds and picks only positive-edge matches."},{icon:"🎚️",t:"Custom risk",d:"You set probability and target odds. AI picks the closest matches."},{icon:"🔔",t:"Push notifications",d:"Get notified when your bet is ready or odds change significantly."},{icon:"🏆",t:"History & Performance",d:"Track every bet, analyze trends and improve over time."}]},
    pricing:{label:"Pricing",title:"START FREE",plans:[{name:"Starter",price:"0",period:"forever",popular:false,features:["1 bet/day","Safe level only","Football & Basketball","x Detailed AI","x Push notifications"],cta:"Start Free",style:"outline"},{name:"Pro",price:"9.99",period:"per month",popular:true,features:["Unlimited bets","All risk levels","All sports","AI + 40 stats","Push notifications"],cta:"Start now",style:"primary"},{name:"Elite",price:"24.99",period:"per month",popular:false,features:["Everything in Pro","Live odds","Bankroll manager","Priority support","Early access"],cta:"Choose Elite",style:"outline"}]},
    auth:{tabLogin:"Log in",tabReg:"Register",email:"Email",pass:"Password",name:"Name",btnLogin:"Log in",btnReg:"Create account",sw1:"Don't have an account?",sw2:"Already have an account?",c1:"Sign up",c2:"Log in"},
    dash:{welcome:"Welcome back",stats:["Bets","Won","Success","Avg Odds"],genTitle:"GENERATE BET",sport:"Sport",risk:"Risk Level",prob:"Win probability",quota:"Target odds",genBtn:"GENERATE AI BET",generating:"Running statistical analysis...",result:"Recommended Bet",aiLabel:"AI Analysis",histTitle:"History",histEmpty:"No bets yet. Generate one!",sports:["Football","Basketball","Tennis","Formula 1"],sportEmoji:["⚽","🏀","🎾","🏎️"],risks:[{id:"safe",emoji:"🟢",name:"Safe",sub:"High prob."},{id:"balanced",emoji:"🟡",name:"Balanced",sub:"Best of both"},{id:"high",emoji:"🔴",name:"High Risk",sub:"Big odds"}],nav:["Dashboard","My Bets","Hall of Fame","Bet Analysis","Profile"],navEmoji:["🎯","📋","🏆","🔬","👤"],logout:"Log out",premiumMsg:"High Risk available on Pro",upgrade:"Upgrade",hallTitle:"HALL OF FAME",hallSub:"Best bets from the community",todayTitle:"TODAY'S MATCHES",todayLive:"LIVE",todayEmpty:"No matches found for today.",todayLoading:"Loading matches...",todayFilter:"Filter by league",todayCount:"matches found",todayRefresh:"Refresh",selMatch:"Use this match"},
    wins:{label:"Winning Proof",title:"REAL RESULTS",sub:"Real bets from our users.",tabs:["Winning Bets","Screenshots"],cLabels:["Bets Won","Success Rate","Total Profits","Active Users"],won:"WON",stake:"Stake"},
    footer:{disclaimer:"BetAI is a statistical analysis tool for informational purposes only. Gambling involves financial risk. Must be 18+. Please gamble responsibly.",cols:[{t:"Product",links:["How it works","Features","Pricing","API"]},{t:"Legal",links:["Privacy Policy","Terms","Cookies","GDPR"]},{t:"Support",links:["Help Center","Contact Us","Community"]}]},
  }
};

// ═══════════════════════════════════════════════════════════
// STATIC DATA
// ═══════════════════════════════════════════════════════════
const WIN_DATA = [
  {id:1,sport:"⚽",sportName:"Calcio",date:"08/03/2025",matches:[{teams:"Milan vs Juventus",sel:"1X",quota:1.65,result:"1-0"},{teams:"Real Madrid vs Barca",sel:"Over 2.5",quota:1.80,result:"3-2"},{teams:"PSG vs Monaco",sel:"1",quota:1.55,result:"2-0"}],totalQuota:4.60,puntata:20,profit:"+72.00",user:"Marco R.",city:"Milano"},
  {id:2,sport:"🏀",sportName:"Basket",date:"07/03/2025",matches:[{teams:"Lakers vs Celtics",sel:"1",quota:2.10,result:"112-98"},{teams:"Warriors vs Heat",sel:"Over 215.5",quota:1.70,result:"228 pts"}],totalQuota:3.57,puntata:50,profit:"+128.50",user:"Luca T.",city:"Roma"},
  {id:3,sport:"🎾",sportName:"Tennis",date:"06/03/2025",matches:[{teams:"Djokovic vs Medvedev",sel:"1",quota:1.45,result:"3-1"},{teams:"Alcaraz vs Zverev",sel:"Over 3.5 set",quota:2.20,result:"3-2"}],totalQuota:3.19,puntata:30,profit:"+65.70",user:"Davide F.",city:"Napoli"},
  {id:4,sport:"⚽",sportName:"Calcio",date:"05/03/2025",matches:[{teams:"Inter vs Napoli",sel:"1",quota:2.00,result:"2-1"},{teams:"Atletico vs Sevilla",sel:"1X",quota:1.50,result:"1-1"},{teams:"Liverpool vs Man Utd",sel:"1",quota:1.65,result:"3-0"}],totalQuota:4.95,puntata:25,profit:"+103.75",user:"Sofia B.",city:"Firenze"},
  {id:5,sport:"⚽",sportName:"Calcio",date:"04/03/2025",matches:[{teams:"Bucks vs 76ers",sel:"1 -5.5",quota:1.90,result:"+8"},{teams:"Nuggets vs Suns",sel:"Under 224.5",quota:1.85,result:"210 pts"}],totalQuota:3.52,puntata:40,profit:"+100.80",user:"Giorgio P.",city:"Bologna"},
];

const TICKER = ["🏆 Marco R. +72EUR quota 4.60x","🏆 Luca T. +128.50EUR quota 3.57x","🏆 Davide F. +65.70EUR quota 3.19x","🏆 Sofia B. +103.75EUR quota 4.95x","🏆 Giorgio P. +100.80EUR quota 3.52x","Tasso successo questa settimana: 71%"];

const BOOKMAKERS = [
  {id:"b365",name:"Bet365",color:"#008000",offer:"Bonus 200EUR",sub:"sul primo deposito. T&C. 18+",btnText:"Richiedi Bonus"},
  {id:"bwin",name:"Bwin",color:"#ff6600",offer:"Scommessa Gratuita 50EUR",sub:"per i nuovi iscritti. 18+",btnText:"Vai a Bwin"},
  {id:"snai",name:"SNAI",color:"#cc0000",offer:"Quota Maggiorata x5",sub:"su partite selezionate. 18+",btnText:"Scommetti"},
  {id:"sky",name:"Skybet",color:"#0066cc",offer:"30EUR Scommesse Free",sub:"nessun deposito. T&C. 18+",btnText:"Attiva Ora"},
];

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════
function AnimCounter({ target, suffix }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let cur = 0; const step = Math.ceil(target/55);
    const iv = setInterval(()=>{ cur+=step; if(cur>=target){setVal(target);clearInterval(iv);}else setVal(cur); },22);
    return ()=>clearInterval(iv);
  }, [target]);
  return <span>{val.toLocaleString("it-IT")}{suffix||""}</span>;
}

function LiveTicker() {
  return (
    <div className="wins-ticker-wrap">
      <div className="wins-ticker">
        {[...TICKER,...TICKER].map((item,i)=>(
          <div className="wins-ticker-item" key={i}>
            <span className="wins-ticker-dot"/>{item}
          </div>
        ))}
      </div>
    </div>
  );
}

function AdBannerTop({ lang }) {
  const bk = BOOKMAKERS[0];
  return (
    <div className="ad-banner-top">
      <span className="ad-badge">Sponsorizzato</span>
      <div className="ad-content">
        <span className="ad-bk-logo" style={{color:bk.color}}>{bk.name}</span>
        <span className="ad-text"><strong>{bk.offer}</strong> — {lang==="it"?"Nuovo utente? Registrati oggi":"New user? Register today"}</span>
        <button className="ad-cta-btn" style={{background:bk.color,color:"white"}}>{bk.btnText} →</button>
      </div>
      <span className="ad-badge">18+</span>
    </div>
  );
}

function AdSidebar({ idx }) {
  const bk = BOOKMAKERS[idx % BOOKMAKERS.length];
  return (
    <div className="ad-sidebar-card">
      <div className="ad-label">Pubblicità</div>
      <div className="ad-sb-logo" style={{color:bk.color}}>{bk.name}</div>
      <div className="ad-sb-offer" style={{color:"white"}}>{bk.offer}</div>
      <div className="ad-sb-sub">{bk.sub}</div>
      <button className="ad-sb-btn" style={{background:bk.color,color:"white"}}>{bk.btnText} →</button>
    </div>
  );
}

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
          <div className="ad-inline-terms">{lang==="it"?"T&C applicano. Solo nuovi clienti. 18+":"T&C apply. New customers only. 18+"}</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TODAY'S MATCHES COMPONENT
// ═══════════════════════════════════════════════════════════
function TodayMatches({ lang, onMatchesLoaded }) {
  const t = T[lang].dash;
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Tutti");
  const [timeFilter, setTimeFilter] = useState("Tutti");
  const [selectedOdds, setSelectedOdds] = useState({});

  const fetchMatches = async () => {
    setLoading(true); setError(null);
    try {
      const allMatches = [];
      const fetches = SPORT_KEYS.map(sportKey =>
        fetch(`/api/odds?sport=${sportKey}`)
          .then(r => r.ok ? r.json() : [])
          .catch(() => [])
      );
      const results = await Promise.all(fetches);
      results.forEach((data, i) => {
        if (!Array.isArray(data)) return;
        const sportKey = SPORT_KEYS[i];
        const label = SPORT_LABELS[sportKey];
        data.forEach(event => {
          // Extract ALL markets from best bookmaker
          let home_odds = null, away_odds = null, draw_odds = null;
          const allMarkets = []; // [{name, outcomes:[{label,price}]}]

          if (event.bookmakers && event.bookmakers.length > 0) {
            // Pick bookmaker with most markets
            const bk = event.bookmakers.reduce((best,b) =>
              (b.markets?.length||0) > (best.markets?.length||0) ? b : best
            , event.bookmakers[0]);

            bk.markets?.forEach(market => {
              const outcomes = market.outcomes?.map(o => ({
                label: o.name, price: o.price, point: o.point
              })) || [];

              // Store 1X2
              if (market.key === "h2h") {
                outcomes.forEach(o => {
                  if(o.label === event.home_team) home_odds = o.price;
                  else if(o.label === event.away_team) away_odds = o.price;
                  else draw_odds = o.price;
                });
                allMarkets.push({name:"1X2", outcomes:[
                  {label:"1 ("+event.home_team+")", price:home_odds},
                  draw_odds?{label:"X (Pareggio)", price:draw_odds}:null,
                  {label:"2 ("+event.away_team+")", price:away_odds},
                ].filter(Boolean)});
              }
              // Over/Under
              else if (market.key === "totals") {
                const grouped = {};
                outcomes.forEach(o => {
                  const k = o.point||"2.5";
                  if(!grouped[k]) grouped[k] = {};
                  if(o.label==="Over") grouped[k].over = o.price;
                  if(o.label==="Under") grouped[k].under = o.price;
                });
                Object.entries(grouped).forEach(([pt,v]) => {
                  if(v.over) allMarkets.push({name:`Over ${pt}`, outcomes:[{label:`Over ${pt}`, price:v.over}]});
                  if(v.under) allMarkets.push({name:`Under ${pt}`, outcomes:[{label:`Under ${pt}`, price:v.under}]});
                });
              }
              // Spreads/Handicap
              else if (market.key === "spreads") {
                outcomes.forEach(o => {
                  const sign = o.point>0?"+":"";
                  allMarkets.push({name:`Handicap ${o.label}`, outcomes:[{label:`${o.label} ${sign}${o.point}`, price:o.price}]});
                });
              }
              // BTTS / Both teams score
              else if (market.key === "btts" || market.key === "both_teams_score") {
                outcomes.forEach(o => {
                  allMarkets.push({name:"BTTS "+o.label, outcomes:[{label:"BTTS "+o.label, price:o.price}]});
                });
              }
            });
          }

          const matchTime = new Date(event.commence_time);
          const now2 = new Date();
          const isToday = matchTime.toDateString() === now2.toDateString();
          const isTomorrow = matchTime.toDateString() === new Date(now2.getTime()+86400000).toDateString();
          const dayLabel = isToday ? "Oggi" : isTomorrow ? "Domani" : matchTime.toLocaleDateString("it-IT",{weekday:"short",day:"numeric",month:"short"});
          allMatches.push({
            id: event.id, sportKey,
            league: label.name, cat: label.cat, emoji: label.emoji,
            home: event.home_team, away: event.away_team,
            teams: `${event.home_team} vs ${event.away_team}`,
            time: matchTime.toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"}),
            date: dayLabel,
            timestamp: matchTime,
            home_odds, away_odds, draw_odds,
            allMarkets,
          });
        });
      });

      allMatches.sort((a,b) => a.timestamp - b.timestamp);
      // Filtra: prossime 72 ore (3 giorni) per coprire fusi orari
      const now = new Date();
      const from = new Date(now.getTime() - 2*60*60*1000); // 2 ore fa (partite iniziate)
      const to = new Date(now.getTime() + 72*60*60*1000);  // prossimi 3 giorni
      const upcoming = allMatches.filter(m => m.timestamp >= from && m.timestamp <= to);
      const toShow = upcoming.length > 0 ? upcoming : allMatches.slice(0,40);
      setMatches(toShow);
      if (onMatchesLoaded) onMatchesLoaded(toShow);
      console.log("BetAI partite prossime 72h:", upcoming.length, "| totale API:", allMatches.length);
    } catch(e) {
      console.error("BetAI fetch error:", e);
      setError(lang==="it"?"Errore nel caricamento: "+e.message:"Error loading: "+e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMatches(); }, []);

  const allLeagues = ["Tutti", ...new Set(matches.map(m => m.cat))];
  const leagues = allLeagues;
  const filtered = activeFilter === "Tutti" ? matches : matches.filter(m => m.cat === activeFilter);

  const toggleOdds = (matchId, type, odds) => {
    setSelectedOdds(prev => {
      const key = `${matchId}_${type}`;
      if (prev[key]) {
        const updated = {...prev}; delete updated[key]; return updated;
      }
      return {...prev, [key]: {matchId, type, odds}};
    });
  };

  const isSelected = (matchId, type) => !!selectedOdds[`${matchId}_${type}`];

  return (
    <div className="today-section">
      <div className="today-header">
        <div className="today-title">📅 {t.todayTitle}</div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {!loading && <span style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--muted2)"}}>{filtered.length} {t.todayCount}</span>}
          <div className="today-live"><span className="today-live-dot"/>{t.todayLive}</div>
          <button onClick={fetchMatches} style={{padding:"4px 12px",borderRadius:8,background:"var(--card2)",border:"1px solid var(--border2)",color:"var(--muted2)",fontSize:11,cursor:"pointer",fontWeight:600}}>↻ {t.todayRefresh}</button>
        </div>
      </div>

      {/* Sport filter */}
      <div className="sport-filter">
        {leagues.map(l => (
          <button key={l} className={"sport-filter-btn"+(activeFilter===l?" active":"")} onClick={()=>setActiveFilter(l)}>{l}</button>
        ))}
      </div>

      {/* Matches list */}
      {loading && (
        <div className="matches-loading">
          <div style={{width:18,height:18,border:"2px solid var(--card2)",borderTopColor:"var(--cyan)",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
          {t.todayLoading}
        </div>
      )}

      {error && (
        <div className="no-matches">
          <div style={{fontSize:20,marginBottom:8}}>⚠️</div>
          <div>{error}</div>
          <button onClick={fetchMatches} style={{marginTop:12,padding:"8px 20px",borderRadius:8,background:"var(--cyan)",color:"#05080f",border:"none",cursor:"pointer",fontWeight:700,fontSize:12}}>Riprova</button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="no-matches">
          <div style={{fontSize:24,marginBottom:8}}>📭</div>
          <div>{t.todayEmpty}</div>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="matches-grid">
          {filtered.map(m => (
            <div key={m.id} className="match-row">
              <div className="match-row-left">
                <div className="match-row-teams">{m.emoji} {m.teams}</div>
                <div className="match-row-meta">
                  <span className="match-row-league">{m.league}</span>
                  <span style={{color:"var(--muted)",fontSize:10}}>•</span>
                  <span className="match-row-time">{m.date&&m.date!=="Oggi"?<span style={{color:"var(--muted2)",marginRight:3}}>{m.date}</span>:null} ⏰ {m.time}</span>
                </div>
              </div>
              <div className="match-row-odds">
                {m.home_odds && (
                  <div style={{textAlign:"center"}}>
                    <button className={"odds-btn"+(isSelected(m.id,"1")?" sel":"")} onClick={()=>toggleOdds(m.id,"1",m.home_odds)}>
                      {m.home_odds.toFixed(2)}
                    </button>
                    <div className="odds-label">1</div>
                  </div>
                )}
                {m.draw_odds && (
                  <div style={{textAlign:"center"}}>
                    <button className={"odds-btn"+(isSelected(m.id,"X")?" sel":"")} onClick={()=>toggleOdds(m.id,"X",m.draw_odds)}>
                      {m.draw_odds.toFixed(2)}
                    </button>
                    <div className="odds-label">X</div>
                  </div>
                )}
                {m.away_odds && (
                  <div style={{textAlign:"center"}}>
                    <button className={"odds-btn"+(isSelected(m.id,"2")?" sel":"")} onClick={()=>toggleOdds(m.id,"2",m.away_odds)}>
                      {m.away_odds.toFixed(2)}
                    </button>
                    <div className="odds-label">2</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {Object.keys(selectedOdds).length > 0 && (
        <div style={{marginTop:12,padding:"10px 14px",background:"rgba(0,212,255,0.06)",border:"1px solid rgba(0,212,255,0.2)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:12,color:"var(--cyan)",fontWeight:600}}>
            ✓ {Object.keys(selectedOdds).length} {lang==="it"?"selezioni scelte — l'AI le userà per l'analisi":"selections chosen — AI will use them for analysis"}
          </span>
          <button onClick={()=>setSelectedOdds({})} style={{fontSize:11,color:"var(--muted2)",background:"none",border:"none",cursor:"pointer"}}>✕ Cancella</button>
        </div>
      )}
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
      <LiveTicker/>
      <section className="section">
        <div className="section-label">{w.label}</div>
        <div className="section-title">{w.title}</div>
        <p style={{fontSize:13,color:"var(--muted2)",marginBottom:40,lineHeight:1.7,maxWidth:560}}>{w.sub}</p>
        <div className="wins-counters">
          {[{v:2847,s:""},{v:68,s:"%"},{v:94320,s:"€"},{v:1240,s:"+"}].map((c,i)=>(
            <div className="wins-counter-card" key={i}>
              <div className="wcc-val"><AnimCounter target={c.v} suffix={c.s}/></div>
              <div className="wcc-lbl">{w.cLabels[i]}</div>
            </div>
          ))}
        </div>
        <div className="wins-tabs">
          {w.tabs.map((tb,i)=>(
            <div key={i} className={"wins-tab"+(tab===i?" active":"")} onClick={()=>setTab(i)}>
              {i===0?"🏆":"📸"} {tb}
            </div>
          ))}
        </div>
        <div className="win-cards-grid">
          {WIN_DATA.map((wn,idx)=>(
            <div className="win-card" key={wn.id} style={{animationDelay:idx*0.07+"s"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:20}}>{wn.sport}</span>
                  <span style={{fontSize:11,fontWeight:700,color:"var(--muted2)",letterSpacing:1,textTransform:"uppercase"}}>{wn.sportName}</span>
                </div>
                <span style={{background:"rgba(0,224,144,0.12)",border:"1px solid rgba(0,224,144,0.3)",color:"var(--green)",fontSize:10,fontWeight:800,padding:"3px 10px",borderRadius:20,letterSpacing:1,textTransform:"uppercase"}}>✓ {w.won}</span>
              </div>
              {wn.matches.map((m,i)=>(
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
                <span style={{fontSize:11,color:"var(--muted2)"}}>{w.stake}: <span style={{color:"var(--text)",fontWeight:700}}>€{wn.puntata}</span></span>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontFamily:"var(--display)",fontSize:24,color:"var(--gold)"}}>{wn.totalQuota}x</span>
                  <span style={{fontSize:12,fontWeight:700,color:"var(--green)",background:"rgba(0,224,144,0.08)",padding:"3px 8px",borderRadius:6}}>{wn.profit}€</span>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginTop:10}}>
                <div style={{width:22,height:22,borderRadius:5,background:"linear-gradient(135deg,var(--cyan),#0055ff)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#05080f"}}>{wn.user[0]}</div>
                <span style={{fontSize:11,color:"var(--muted2)"}}><span style={{color:"var(--text)",fontWeight:600}}>{wn.user}</span> · {wn.city} · {wn.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LANDING
// ═══════════════════════════════════════════════════════════
function Landing({ onLogin, lang, setLang }) {
  const t = T[lang];
  return (
    <div>
      <AdBannerTop lang={lang}/>
      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-logo-mark">B</div>
          <div className="nav-logo-text">Bet<span>AI</span></div>
        </div>
        <div className="nav-links">
          <span className="nav-link">{t.nav.how}</span>
          <span className="nav-link">{t.nav.features}</span>
          <span className="nav-link">{t.nav.wins}</span>
          <span className="nav-link">{t.nav.pricing}</span>
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
          <button className="btn-outline" onClick={onLogin}>{t.hero.cta2} →</button>
        </div>
        <div className="hero-stats">
          {t.hero.sv.map(([v,l],i)=>(
            <div key={i} style={{textAlign:"center"}}>
              <div className="hstat-val">{v}</div>
              <div className="hstat-lbl">{l}</div>
            </div>
          ))}
        </div>
      </section>
      <div className="sec-bg">
        <section className="section">
          <div className="section-label">{t.features.label}</div>
          <div className="section-title">{t.features.title}</div>
          <div className="features-grid">
            {t.features.cards.map((c,i)=>(
              <div className="feature-card" key={i}>
                <div className="feat-icon">{c.icon}</div>
                <div className="feat-title">{c.t}</div>
                <div className="feat-desc">{c.d}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div style={{maxWidth:1100,margin:"40px auto",padding:"0 24px"}}>
        <AdInline idx={1} lang={lang}/>
      </div>
      <WinsSection lang={lang}/>
      <div style={{maxWidth:1100,margin:"40px auto",padding:"0 24px"}}>
        <AdInline idx={2} lang={lang}/>
      </div>
      <div className="sec-bg">
        <section className="section" style={{textAlign:"center"}}>
          <div className="section-label">{t.pricing.label}</div>
          <div className="section-title">{t.pricing.title}</div>
          <div className="pricing-grid">
            {t.pricing.plans.map((p,i)=>(
              <div className={"price-card"+(p.popular?" featured":"")} key={i}>
                {p.popular && <div className="price-popular">{lang==="it"?"Più popolare":"Most popular"}</div>}
                <div className="price-plan">{p.name}</div>
                <div className="price-amount">€{p.price}</div>
                <div className="price-period">{p.period}</div>
                <ul className="price-features">
                  {p.features.map((f,j)=>(
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
      <div className="partners-section">
        <div className="partners-label">{lang==="it"?"Partner Ufficiali":"Official Partners"}</div>
        <div className="partners-grid">
          {BOOKMAKERS.map((bk,i)=>(
            <div key={bk.id} className={"partner-logo"+(i<2?" sponsor":"")} style={i<2?{color:bk.color}:{}}>{bk.name}</div>
          ))}
          <div className="partner-logo">Unibet</div>
          <div className="partner-logo">888sport</div>
        </div>
      </div>
      <footer className="footer">
        <div>
          <div style={{fontFamily:"var(--display)",fontSize:20,letterSpacing:2,color:"white",marginBottom:8}}>Bet<span style={{color:"var(--cyan)"}}>AI</span></div>
          <div style={{fontSize:12,color:"var(--muted2)",lineHeight:1.6,maxWidth:200}}>{lang==="it"?"Il tuo assistente AI per le scommesse sportive.":"Your AI assistant for sports betting."}</div>
        </div>
        {t.footer.cols.map((col,i)=>(
          <div key={i}>
            <div className="footer-col-title">{col.t}</div>
            {col.links.map((l,j)=><div key={j} className="footer-link">{l}</div>)}
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
  const isIt = lang==="it";
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handle = async () => {
    if (!email || !password) { setError(isIt?"Inserisci email e password":"Enter email and password"); return; }
    if (tab==="register" && password.length < 6) { setError(isIt?"Password minimo 6 caratteri":"Password min 6 characters"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      if (tab==="register") {
        const res = await sb.signUp(email, password, name||email.split("@")[0]);
        if (res.error) throw new Error(res.error.message);
        setSuccess(isIt?"Registrazione completata! Controlla la tua email per confermare l'account.":"Registration complete! Check your email to confirm your account.");
        setTab("login");
      } else {
        const res = await sb.signIn(email, password);
        console.log("BetAI signIn response:", JSON.stringify(res).slice(0,200));
        if (res.error) {
          if(res.error.message?.includes("Email not confirmed"))
            throw new Error(isIt?"Conferma prima la tua email!":"Please confirm your email first!");
          throw new Error(isIt?"Email o password errati":"Invalid email or password");
        }
        // Supabase can return user in different places
        const authUser = res.user || res.data?.user || res.session?.user;
        const accessToken = res.access_token || res.data?.session?.access_token || res.session?.access_token;
        if (!authUser || !accessToken) {
          throw new Error(isIt?"Risposta auth non valida, riprova":"Invalid auth response, please retry");
        }
        sb.setSession({ access_token: accessToken, user: authUser });
        const profile = await sb.getProfile(authUser.id, accessToken).catch(()=>null);
        onSuccess({
          id: authUser.id,
          name: profile?.name || name || email.split("@")[0],
          email: authUser.email,
          plan: profile?.plan || "free",
          token: accessToken,
          profile,
        });
      }
    } catch(e) { setError(e.message||"Errore"); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div style={{textAlign:"center",marginBottom:28}}>
          <div className="auth-logo-mark">B</div>
          <div style={{fontFamily:"var(--display)",fontSize:26,letterSpacing:3,color:"white",marginTop:8}}>Bet<span style={{color:"var(--cyan)"}}>AI</span></div>
          <div style={{fontSize:12,color:"var(--muted2)",marginTop:4}}>{isIt?"Il tuo analista AI":"Your AI analyst"}</div>
        </div>
        <div className="auth-tabs">
          <div className={"auth-tab"+(tab==="login"?" active":"")} onClick={()=>{setTab("login");setError("");setSuccess("");}}>
            {t.tabLogin}
          </div>
          <div className={"auth-tab"+(tab==="register"?" active":"")} onClick={()=>{setTab("register");setError("");setSuccess("");}}>
            {t.tabReg}
          </div>
        </div>
        {success&&<div style={{background:"rgba(0,224,144,0.08)",border:"1px solid rgba(0,224,144,0.25)",borderRadius:10,padding:"12px 14px",marginBottom:16,fontSize:13,color:"var(--green)",lineHeight:1.5}}>✓ {success}</div>}
        {error&&<div style={{background:"rgba(255,68,102,0.08)",border:"1px solid rgba(255,68,102,0.25)",borderRadius:10,padding:"12px 14px",marginBottom:16,fontSize:13,color:"var(--red)"}}>⚠ {error}</div>}
        {tab==="register"&&<><label className="form-label">{t.name}</label><input className="form-input" placeholder="Mario Rossi" value={name} onChange={e=>setName(e.target.value)}/></>}
        <label className="form-label">{t.email}</label>
        <input className="form-input" type="email" placeholder="mario@email.it" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
        <label className="form-label">{t.pass}</label>
        <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
        {tab==="register"&&<div style={{fontSize:11,color:"var(--muted2)",marginBottom:14,lineHeight:1.6,padding:"10px 12px",background:"var(--card2)",borderRadius:8,border:"1px solid var(--border)"}}>
          📧 {isIt?"Riceverai una email di conferma. Clicca il link per attivare l'account.":"You will receive a confirmation email. Click the link to activate your account."}
        </div>}
        <button className="auth-btn" onClick={handle} disabled={loading||!email||!password}>
          {loading?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span style={{width:14,height:14,border:"2px solid rgba(5,8,15,0.3)",borderTopColor:"#05080f",borderRadius:"50%",animation:"spin 0.7s linear infinite",display:"inline-block"}}/>{isIt?"Accesso...":"Signing in..."}</span>:(tab==="login"?t.btnLogin:t.btnReg)}
        </button>
        <div style={{textAlign:"center",fontSize:13,color:"var(--muted2)",marginTop:18}}>
          {tab==="login"?t.sw1:t.sw2}{" "}
          <span style={{color:"var(--cyan)",cursor:"pointer",fontWeight:600}} onClick={()=>{setTab(tab==="login"?"register":"login");setError("");setSuccess("");}}>
            {tab==="login"?t.c1:t.c2}
          </span>
        </div>
        {tab==="login" && (
          <div style={{textAlign:"center",marginTop:10}}>
            <span style={{fontSize:12,color:"var(--cyan)",cursor:"pointer",fontWeight:600}}
              onClick={async()=>{
                if(!email){setError(isIt?"Inserisci la tua email":"Enter your email");return;}
                const r = await sb.resetPassword(email);
                if(r.error) setError(r.error.message);
                else setSuccess(isIt?"Email per reset password inviata!":"Password reset email sent!");
              }}>
              {isIt?"Password dimenticata?":"Forgot password?"}
            </span>
          </div>
        )}
        <div style={{textAlign:"center",marginTop:14}}>
          <span style={{fontSize:12,color:"var(--muted)",cursor:"pointer"}} onClick={onBack}>
            {isIt?"← Torna alla home":"← Back to home"}
          </span>
        </div>
      </div>
    </div>
  );
}
// ═══════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════
function DashWins({ lang, history = [] }) {
  const t = T[lang].dash;
  const isIt = lang==="it";
  const wonSchedule = history.filter(h=>(h.status||h.esito)==="won");

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{fontFamily:"var(--display)",fontSize:24,letterSpacing:1,color:"white"}}>{t.hallTitle}</div>
          <div style={{fontSize:13,color:"var(--muted2)",marginTop:2}}>{t.hallSub}</div>
        </div>
        <div style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--green)",background:"rgba(0,224,144,0.07)",border:"1px solid rgba(0,224,144,0.2)",padding:"5px 12px",borderRadius:20}}>● LIVE</div>
      </div>
      <LiveTicker/>
      <div className="dash-wins-grid" style={{marginTop:16}}>
        {wonSchedule.length === 0 ? (
          <div style={{gridColumn:"1/-1",textAlign:"center",padding:"48px 24px",color:"var(--muted2)"}}>
            <div style={{fontSize:40,marginBottom:12}}>🏆</div>
            <div style={{fontSize:16,fontWeight:700,color:"var(--text)",marginBottom:8}}>
              {isIt?"Nessuna schedina vincente ancora":"No winning bets yet"}
            </div>
            <div style={{fontSize:13,color:"var(--muted2)"}}>
              {isIt?"Genera una schedina, scommetti e segna le vincite dalla sezione Schedine!":"Generate a bet, play it and mark wins from the Bets section!"}
            </div>
          </div>
        ) : wonSchedule.map((wn,idx)=>{
          const matches = wn.details || wn.full?.matches || [];
          return (
            <div className="dash-win-card" key={wn.id} style={{animation:"popIn 0.4s ease both",animationDelay:idx*0.06+"s"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:16}}>{wn.sport}</span>
                  <span style={{fontSize:10,fontWeight:700,color:"var(--muted2)",letterSpacing:1,textTransform:"uppercase"}}>{wn.risk?.toUpperCase()}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--muted)"}}>{wn.date}</span>
                  <span style={{fontSize:10,fontWeight:700,color:"var(--green)",background:"rgba(0,224,144,0.08)",border:"1px solid rgba(0,224,144,0.2)",padding:"2px 8px",borderRadius:20}}>✓ VINTA</span>
                </div>
              </div>
              {matches.slice(0,4).map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"4px 0",borderBottom:i<Math.min(matches.length,4)-1?"1px solid var(--border)":"none"}}>
                  <span style={{color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"60%"}}>{m.teams}</span>
                  <span style={{color:"var(--green)",fontWeight:700,fontFamily:"var(--mono)",flexShrink:0}}>{m.selection} {m.quota}x</span>
                </div>
              ))}
              {matches.length > 4 && <div style={{fontSize:10,color:"var(--muted2)",marginTop:4}}>+{matches.length-4} {isIt?"altre partite":"more matches"}</div>}
              <div style={{display:"flex",justifyContent:"space-between",marginTop:10,paddingTop:10,borderTop:"1px solid var(--border)"}}>
                <div>
                  <div style={{fontFamily:"var(--display)",fontSize:22,color:"var(--gold)"}}>{wn.quota}x</div>
                  <div style={{fontSize:10,color:"var(--muted2)"}}>{wn.n} {isIt?"partite":"picks"}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:12,fontWeight:700,color:"var(--green)"}}>🏆 {isIt?"VINCITA":"WIN"}</div>
                  <div style={{fontSize:10,color:"var(--muted2)",marginTop:3}}>{user?.name||"Tu"}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PROFILE PAGE
// ═══════════════════════════════════════════════════════════
function ProfilePage({ user, lang, history = [] }) {
  const isIt = lang==="it";
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState({
    defaultRisk: user?.profile?.default_risk || "balanced",
    defaultMatches: user?.profile?.default_matches || 3,
    emailAlerts: user?.profile?.email_alerts ?? true,
  });

  // Real stats from history
  const total = history.length;
  const won = history.filter(h=>(h.status||h.esito)==="won").length;
  const lost = history.filter(h=>(h.status||h.esito)==="lost").length;
  const pending = history.filter(h=>(h.status||h.esito||"pending")==="pending").length;
  const winRate = (won+lost) > 0 ? Math.round((won/(won+lost))*100) : 0;
  const avgQuota = total > 0 ? (history.reduce((a,h)=>a+(parseFloat(h.quota)||0),0)/total).toFixed(2) : "0";
  // Streak: consecutive won from most recent
  let streak = 0;
  for(let i=0; i<history.length; i++) {
    const e = history[i].status||history[i].esito||"pending";
    if(e==="won") streak++; else if(e==="lost") break; else break;
  }

  const memberSince = user?.profile?.created_at
    ? new Date(user.profile.created_at).toLocaleDateString(isIt?"it-IT":"en-GB",{month:"long",year:"numeric"})
    : "2026";

  const save = async () => {
    if(user?.token && user?.id) {
      await sb.upsertProfile(user.id, user.token, {
        default_risk: prefs.defaultRisk,
        default_matches: prefs.defaultMatches,
        email_alerts: prefs.emailAlerts,
      }).catch(()=>{});
    }
    setSaved(true); setTimeout(()=>setSaved(false),2500);
  };

  return (
    <div style={{maxWidth:700}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20,padding:24,background:"var(--card)",borderRadius:18,border:"1px solid var(--border)"}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,var(--cyan),var(--purple))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:900,color:"#05080f",flexShrink:0}}>
          {(user.name||"U")[0].toUpperCase()}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:20,fontWeight:700,color:"white"}}>{user.name}</div>
          <div style={{fontSize:13,color:"var(--muted2)",marginTop:2}}>{user.email}</div>
          <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
            <span style={{fontSize:11,fontWeight:700,color:"var(--gold)",background:"rgba(255,200,0,0.1)",border:"1px solid rgba(255,200,0,0.2)",padding:"2px 10px",borderRadius:20}}>
              ⭐ {user.plan==="elite"?"Elite":user.plan==="pro"?"Pro":"Free"}
            </span>
            <span style={{fontSize:11,color:"var(--muted2)",fontFamily:"var(--mono)"}}>
              {isIt?"Membro da":"Member since"} {memberSince}
            </span>
          </div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{fontFamily:"var(--display)",fontSize:28,color:"var(--cyan)"}}>{total}</div>
          <div style={{fontSize:10,color:"var(--muted2)",letterSpacing:1}}>{isIt?"SCHEDINE":"BETS"}</div>
        </div>
      </div>

      {/* Real Stats */}
      <div style={{background:"var(--card)",borderRadius:18,border:"1px solid var(--border)",padding:24,marginBottom:16}}>
        <div style={{fontSize:15,fontWeight:700,color:"white",marginBottom:16}}>📊 {isIt?"Le tue statistiche reali":"Your real statistics"}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {[
            {v:total,l:isIt?"Schedine totali":"Total bets",c:"var(--cyan)"},
            {v:won,l:isIt?"Vinte":"Won",c:"var(--green)"},
            {v:lost,l:isIt?"Perse":"Lost",c:"var(--red)"},
            {v:winRate+"%",l:isIt?"Win rate":"Win rate",c:"var(--gold)"},
            {v:avgQuota+"x",l:isIt?"Quota media":"Avg odds",c:"var(--purple)"},
            {v:streak,l:isIt?"Serie vincente":"Win streak",c:"var(--cyan)"},
          ].map((s,i)=>(
            <div key={i} style={{background:"var(--card2)",borderRadius:12,padding:"14px 12px",textAlign:"center",border:"1px solid var(--border)"}}>
              <div style={{fontFamily:"var(--display)",fontSize:24,color:s.c,marginBottom:4}}>{s.v}</div>
              <div style={{fontSize:10,color:"var(--muted2)",letterSpacing:0.5,textTransform:"uppercase"}}>{s.l}</div>
            </div>
          ))}
        </div>
        {pending > 0 && (
          <div style={{marginTop:12,padding:"8px 14px",background:"rgba(0,212,255,0.05)",borderRadius:10,border:"1px solid rgba(0,212,255,0.15)",fontSize:12,color:"var(--cyan)"}}>
            ⏳ {pending} {isIt?"schedine in attesa di risultato — vai su Schedine per aggiornarle":"bets pending result — go to Bets to update them"}
          </div>
        )}
      </div>

      {/* Preferenze */}
      <div style={{background:"var(--card)",borderRadius:18,border:"1px solid var(--border)",padding:24,marginBottom:16}}>
        <div style={{fontSize:15,fontWeight:700,color:"white",marginBottom:20}}>⚙️ {isIt?"Preferenze Default":"Default Preferences"}</div>
        <div style={{marginBottom:18}}>
          <div style={{fontSize:12,color:"var(--muted2)",marginBottom:8,fontWeight:600}}>{isIt?"Rischio default":"Default risk"}</div>
          <div style={{display:"flex",gap:8}}>
            {["safe","balanced","high"].map(r=>(
              <button key={r} onClick={()=>setPrefs(p=>({...p,defaultRisk:r}))}
                style={{flex:1,padding:"8px 4px",borderRadius:10,border:"1px solid",fontSize:11,fontWeight:700,cursor:"pointer",transition:"all 0.2s",
                  background:prefs.defaultRisk===r?"rgba(0,212,255,0.1)":"var(--card2)",
                  borderColor:prefs.defaultRisk===r?"var(--cyan)":"var(--border)",
                  color:prefs.defaultRisk===r?"var(--cyan)":"var(--muted2)"}}>
                {r==="safe"?"🟢 Safe":r==="balanced"?"🟡 Balanced":"🔴 High"}
              </button>
            ))}
          </div>
        </div>
        <div style={{marginBottom:18}}>
          <div style={{fontSize:12,color:"var(--muted2)",marginBottom:8,fontWeight:600}}>{isIt?"Partite default":"Default matches"}</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {[1,2,3,5,8,10].map(n=>(
              <button key={n} onClick={()=>setPrefs(p=>({...p,defaultMatches:n}))}
                style={{padding:"6px 14px",borderRadius:8,border:"1px solid",fontSize:12,fontWeight:700,cursor:"pointer",
                  background:prefs.defaultMatches===n?"rgba(0,212,255,0.1)":"var(--card2)",
                  borderColor:prefs.defaultMatches===n?"var(--cyan)":"var(--border)",
                  color:prefs.defaultMatches===n?"var(--cyan)":"var(--muted2)"}}>
                {n}
              </button>
            ))}
          </div>
        </div>
        <div style={{marginBottom:18}}>
          <div style={{fontSize:12,color:"var(--muted2)",marginBottom:8,fontWeight:600}}>{isIt?"Notifiche email":"Email notifications"}</div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div onClick={()=>setPrefs(p=>({...p,emailAlerts:!p.emailAlerts}))}
              style={{width:44,height:24,borderRadius:12,background:prefs.emailAlerts?"var(--cyan)":"var(--card2)",border:"1px solid var(--border2)",cursor:"pointer",position:"relative",transition:"all 0.3s"}}>
              <div style={{position:"absolute",top:3,left:prefs.emailAlerts?22:3,width:16,height:16,borderRadius:"50%",background:"white",transition:"all 0.3s"}}/>
            </div>
            <span style={{fontSize:12,color:"var(--muted2)"}}>{prefs.emailAlerts?(isIt?"Attive":"Active"):(isIt?"Disattive":"Disabled")}</span>
          </div>
        </div>
        <button onClick={save} style={{width:"100%",padding:"12px",borderRadius:12,background:saved?"var(--green)":"var(--cyan)",color:"#05080f",border:"none",fontWeight:700,fontSize:13,cursor:"pointer",transition:"all 0.3s"}}>
          {saved?(isIt?"✓ Salvato!":"✓ Saved!"):(isIt?"Salva Preferenze":"Save Preferences")}
        </button>
      </div>

      {/* Email automatiche info */}
      <div style={{background:"var(--card)",borderRadius:18,border:"1px solid var(--border)",padding:24}}>
        <div style={{fontSize:15,fontWeight:700,color:"white",marginBottom:12}}>📧 {isIt?"Email automatiche":"Automatic emails"}</div>
        <div style={{fontSize:12,color:"var(--muted2)",lineHeight:1.7,marginBottom:16}}>
          {isIt
            ?"BetAI ti invia email automatiche in questi casi:"
            :"BetAI sends you automatic emails in these cases:"}
        </div>
        {[
          {icon:"🔔",t:isIt?"Schedina pronta":"Bet ready",d:isIt?"Quando una nuova schedina AI è disponibile":"When a new AI bet is available"},
          {icon:"😴",t:isIt?"Sei inattivo da 7 giorni":"Inactive for 7 days",d:isIt?"Ti ricordiamo che ci sei perso! Torna a giocare 😄":"We remind you we miss you! Come back and play 😄"},
          {icon:"📈",t:isIt?"Quote cambiate":"Odds changed",d:isIt?"Quando le quote di una tua schedina cambiano significativamente":"When odds on your bet change significantly"},
          {icon:"🏆",t:isIt?"Risultato schedina":"Bet result",d:isIt?"Quando le partite della tua schedina terminano":"When matches in your bet are finished"},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"10px 0",borderBottom:i<3?"1px solid var(--border)":"none"}}>
            <span style={{fontSize:18}}>{item.icon}</span>
            <div>
              <div style={{fontSize:12,fontWeight:600,color:"var(--text)"}}>{item.t}</div>
              <div style={{fontSize:11,color:"var(--muted2)",marginTop:2}}>{item.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ANALISI SCHEDINA PAGE
// ═══════════════════════════════════════════════════════════
function AnalisiPage({ lang }) {
  const isIt = lang==="it";
  const [mode, setMode] = useState("manual"); // "manual" | "photo"
  const [matches, setMatches] = useState([{id:1,teams:"",selection:"",quota:""}]);
  const [loading, setLoading] = useState(false);
  const [stake, setStake] = useState(10);
  const [result, setResult] = useState(null);
  const [reasoning, setReasoning] = useState("");
  const [typing, setTyping] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedBase64, setUploadedBase64] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const addMatch = () => setMatches(m=>[...m,{id:Date.now(),teams:"",selection:"",quota:""}]);
  const removeMatch = (id) => setMatches(m=>m.filter(x=>x.id!==id));
  const updateMatch = (id,field,val) => setMatches(m=>m.map(x=>x.id===id?{...x,[field]:val}:x));

  const handleFile = (file) => {
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
      setUploadedBase64(e.target.result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const analyzePhoto = async () => {
    if(!uploadedBase64) return;
    setLoading(true); setResult(null); setReasoning("");
    try {
      const res = await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,messages:[{role:"user",content:[
          {type:"image",source:{type:"base64",media_type:"image/jpeg",data:uploadedBase64}},
          {type:"text",text:`Sei BetAI. Analizza la schedina in questa immagine.
Estrai tutte le selezioni (squadre, esito, quota).
Per ogni selezione analizza: prob implicita, prob stimata reale, edge, giudizio.
Rispondi SOLO in JSON:
{"selections":[{"teams":"A vs B","selection":"1","quota":1.85,"implied_prob":54,"estimated_prob":62,"edge":"+8%","verdict":"OTTIMA","verdict_color":"green","reason":"breve spiegazione"}],"combined_prob":18,"total_quota":3.5,"overall_verdict":"SOLIDA","overall_color":"gold","tips":["consiglio"],"reasoning":"analisi dettagliata in italiano"}`}
        ]}]})});
      const data = await res.json();
      const raw = data.content?.map(b=>b.text||"").join("")||"";
      const parsed = JSON.parse(raw.replace(/```json/g,"").replace(/```/g,"").trim());
      setResult(parsed);
      let i=0; const txt=parsed.reasoning||""; setTyping(true);
      const iv=setInterval(()=>{setReasoning(txt.slice(0,i));i+=6;if(i>txt.length){setReasoning(txt);setTyping(false);clearInterval(iv);}},18);
    } catch(e) { setResult({error:true,message:e.message}); }
    finally { setLoading(false); }
  };

  const analyze = async () => {
    const valid = matches.filter(m=>m.teams.trim()&&m.selection.trim()&&m.quota);
    if(valid.length===0) return;
    setLoading(true); setResult(null); setReasoning("");

    const schedina = valid.map((m,i)=>`${i+1}. ${m.teams} - Selezione: ${m.selection} - Quota: ${m.quota}`).join("\n");
    const totQ = valid.reduce((a,m)=>a*(parseFloat(m.quota)||1),1).toFixed(2);

    const prompt = `Sei BetAI, analista esperto di scommesse sportive. Analizza questa schedina inserita dall'utente.

SCHEDINA:
${schedina}
QUOTA TOTALE: ${totQ}x

Per OGNI selezione:
1. Analizza la partita/evento con la tua conoscenza (forma recente, H2H, statistiche)
2. Stima la probabilità reale di vittoria per quella selezione (%)
3. Confronta con la probabilità implicita del bookmaker (1/quota*100)
4. Calcola edge = prob_stimata - prob_implicita
5. Dai un giudizio: OTTIMA SCELTA / BUONA / NELLA MEDIA / RISCHIOSA / SCONSIGLIATA

Alla fine:
- Probabilità combinata stimata della schedina intera
- Giudizio complessivo
- Suggerimenti per migliorarla

Rispondi SOLO in JSON valido:
{"selections":[{"teams":"nome partita","selection":"esito","quota":1.85,"implied_prob":54,"estimated_prob":61,"edge":"+7%","verdict":"OTTIMA SCELTA","verdict_color":"green","reason":"spiegazione breve"}],"combined_prob":18,"total_quota":${totQ},"overall_verdict":"SCHEDINA SOLIDA","overall_color":"gold","tips":["consiglio 1","consiglio 2","consiglio 3"],"reasoning":"analisi dettagliata in ${isIt?"italiano":"english"} — min 5 frasi"}`;

    try {
      const res = await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:2000,messages:[{role:"user",content:prompt}]})});
      const data = await res.json();
      const raw = data.content?.map(b=>b.text||"").join("")||"";
      const clean = raw.replace(/```json/g,"").replace(/```/g,"").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      // animate reasoning
      setTyping(true); let i=0;
      const txt = parsed.reasoning||"";
      const iv = setInterval(()=>{setReasoning(txt.slice(0,i));i+=6;if(i>txt.length){setReasoning(txt);setTyping(false);clearInterval(iv);}},18);
    } catch(e) {
      setResult({error:true,message:e.message});
    } finally { setLoading(false); }
  };

  const verdictStyle = (color) => ({
    padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,
    background:color==="green"?"rgba(0,224,144,0.1)":color==="gold"?"rgba(255,200,0,0.1)":color==="red"?"rgba(255,80,80,0.1)":"rgba(0,212,255,0.1)",
    color:color==="green"?"var(--green)":color==="gold"?"var(--gold)":color==="red"?"var(--red)":"var(--cyan)",
    border:`1px solid ${color==="green"?"rgba(0,224,144,0.3)":color==="gold"?"rgba(255,200,0,0.3)":color==="red"?"rgba(255,80,80,0.3)":"rgba(0,212,255,0.3)"}`,
  });

  return (
    <div style={{maxWidth:760}}>
      <div style={{marginBottom:24,padding:20,background:"linear-gradient(135deg,rgba(0,212,255,0.08),rgba(139,92,246,0.08))",borderRadius:18,border:"1px solid var(--border)"}}>
        <div style={{fontSize:13,color:"var(--cyan)",fontFamily:"var(--mono)",marginBottom:4}}>🔬 ANALISI SCHEDINA</div>
        <div style={{fontSize:20,fontWeight:700,color:"white",marginBottom:6}}>
          {isIt?"Analizza la tua schedina":"Analyze your bet slip"}
        </div>
        <div style={{fontSize:12,color:"var(--muted2)"}}>
          {isIt?"Inserisci le partite che vuoi giocare e l'AI ti dice la probabilità reale di vincita e il valore di ogni selezione."
               :"Enter the matches you want to bet on and AI tells you the real win probability and value of each selection."}
        </div>
      </div>

      {/* Mode toggle */}
      <div style={{display:"flex",gap:6,marginBottom:16,background:"var(--card2)",borderRadius:12,padding:4}}>
        <button onClick={()=>setMode("manual")}
          style={{flex:1,padding:"9px",borderRadius:9,fontSize:13,fontWeight:700,cursor:"pointer",border:"none",transition:"all 0.2s",
            background:mode==="manual"?"var(--cyan)":"transparent",color:mode==="manual"?"#05080f":"var(--muted2)"}}>
          ✏️ {isIt?"Inserimento manuale":"Manual input"}
        </button>
        <button onClick={()=>setMode("photo")}
          style={{flex:1,padding:"9px",borderRadius:9,fontSize:13,fontWeight:700,cursor:"pointer",border:"none",transition:"all 0.2s",
            background:mode==="photo"?"var(--cyan)":"transparent",color:mode==="photo"?"#05080f":"var(--muted2)"}}>
          📸 {isIt?"Carica foto/file":"Upload photo/file"}
        </button>
      </div>

      {/* Photo upload */}
      {mode==="photo" && (
        <div style={{background:"var(--card)",borderRadius:18,border:"1px solid var(--border)",padding:24,marginBottom:16}}>
          <div style={{fontSize:14,fontWeight:700,color:"white",marginBottom:16}}>
            📸 {isIt?"Carica la foto della schedina":"Upload your bet slip photo"}
          </div>
          <div
            onDragOver={e=>{e.preventDefault();setDragOver(true);}}
            onDragLeave={()=>setDragOver(false)}
            onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0]);}}
            onClick={()=>document.getElementById("betai-file-input").click()}
            style={{border:`2px dashed ${dragOver?"var(--cyan)":"var(--border2)"}`,borderRadius:14,padding:32,textAlign:"center",cursor:"pointer",transition:"all 0.2s",
              background:dragOver?"rgba(0,212,255,0.04)":"transparent"}}>
            {uploadedImage ? (
              <div>
                <img src={uploadedImage} alt="schedina" style={{maxWidth:"100%",maxHeight:300,borderRadius:10,marginBottom:12}}/>
                <div style={{fontSize:12,color:"var(--green)",fontWeight:600}}>✓ {isIt?"Immagine caricata":"Image loaded"}</div>
              </div>
            ) : (
              <div>
                <div style={{fontSize:40,marginBottom:12}}>📷</div>
                <div style={{fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:6}}>
                  {isIt?"Trascina la foto qui o clicca per selezionare":"Drag photo here or click to select"}
                </div>
                <div style={{fontSize:11,color:"var(--muted2)"}}>
                  {isIt?"Supporta JPG, PNG, PDF, screenshot":"Supports JPG, PNG, PDF, screenshot"}
                </div>
              </div>
            )}
          </div>
          <input id="betai-file-input" type="file" accept="image/*,.pdf" style={{display:"none"}}
            onChange={e=>handleFile(e.target.files[0])}/>
          {uploadedImage && (
            <button onClick={analyzePhoto} disabled={loading}
              style={{width:"100%",marginTop:14,padding:"13px",borderRadius:12,background:"var(--cyan)",color:"#05080f",border:"none",cursor:"pointer",fontSize:14,fontWeight:700}}>
              {loading?(isIt?"Analisi in corso...":"Analyzing..."):(isIt?"🔬 Analizza schedina con AI":"🔬 Analyze bet with AI")}
            </button>
          )}
          {uploadedImage && (
            <button onClick={()=>{setUploadedImage(null);setUploadedBase64(null);setResult(null);}}
              style={{width:"100%",marginTop:8,padding:"10px",borderRadius:12,background:"transparent",color:"var(--muted2)",border:"1px solid var(--border)",cursor:"pointer",fontSize:12}}>
              {isIt?"Rimuovi immagine":"Remove image"}
            </button>
          )}
        </div>
      )}

      {/* Match inputs */}
      {mode==="manual" && <div style={{background:"var(--card)",borderRadius:18,border:"1px solid var(--border)",padding:24,marginBottom:16}}>
        <div style={{fontSize:14,fontWeight:700,color:"white",marginBottom:18}}>
          📋 {isIt?"Le tue selezioni":"Your selections"}
        </div>
        {matches.map((m,i)=>(
          <div key={m.id} style={{marginBottom:14,padding:16,background:"var(--card2)",borderRadius:12,border:"1px solid var(--border)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <span style={{fontSize:12,fontWeight:700,color:"var(--cyan)",fontFamily:"var(--mono)"}}>#{i+1}</span>
              {matches.length>1&&<button onClick={()=>removeMatch(m.id)} style={{background:"none",border:"none",color:"var(--red)",cursor:"pointer",fontSize:16}}>✕</button>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 80px",gap:8}}>
              <input value={m.teams} onChange={e=>updateMatch(m.id,"teams",e.target.value)}
                placeholder={isIt?"Squadra A vs Squadra B":"Team A vs Team B"}
                style={{padding:"9px 12px",borderRadius:8,background:"var(--card)",border:"1px solid var(--border2)",color:"var(--text)",fontSize:12,outline:"none"}}/>
              <input value={m.selection} onChange={e=>updateMatch(m.id,"selection",e.target.value)}
                placeholder={isIt?"Es: 1, X, Over 2.5":"E.g: 1, X, Over 2.5"}
                style={{padding:"9px 12px",borderRadius:8,background:"var(--card)",border:"1px solid var(--border2)",color:"var(--text)",fontSize:12,outline:"none"}}/>
              <input value={m.quota} onChange={e=>updateMatch(m.id,"quota",e.target.value)}
                placeholder="Quota" type="number" step="0.01" min="1"
                style={{padding:"9px 12px",borderRadius:8,background:"var(--card)",border:"1px solid var(--border2)",color:"var(--text)",fontSize:12,outline:"none"}}/>
            </div>
          </div>
        ))}
        <div style={{display:"flex",gap:10,marginTop:4}}>
          <button onClick={addMatch} style={{flex:1,padding:"10px",borderRadius:10,background:"var(--card2)",border:"1px dashed var(--border2)",color:"var(--muted2)",cursor:"pointer",fontSize:12,fontWeight:600}}>
            + {isIt?"Aggiungi selezione":"Add selection"}
          </button>
          <button onClick={analyze} disabled={loading}
            style={{flex:2,padding:"10px",borderRadius:10,background:"var(--cyan)",color:"#05080f",border:"none",cursor:"pointer",fontSize:13,fontWeight:700}}>
            {loading?(isIt?"Analisi in corso...":"Analyzing..."):(isIt?"🔬 Analizza con AI":"🔬 Analyze with AI")}
          </button>
        </div>
      </div>}

      {/* Results */}
      {result&&!result.error&&(
        <div style={{background:"var(--card)",borderRadius:18,border:"1px solid var(--border)",padding:24}}>
          {/* Overall verdict */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,padding:16,background:"var(--card2)",borderRadius:12}}>
            <div>
              <div style={{fontSize:12,color:"var(--muted2)",marginBottom:4}}>{isIt?"Giudizio complessivo":"Overall verdict"}</div>
              <span style={verdictStyle(result.overall_color)}>{result.overall_verdict}</span>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontFamily:"var(--display)",fontSize:28,color:"var(--green)"}}>{result.combined_prob?.toFixed(0)}%</div>
              <div style={{fontSize:10,color:"var(--muted2)"}}>{isIt?"prob. vincita":"win prob."}</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontFamily:"var(--display)",fontSize:28,color:"var(--gold)"}}>{result.total_quota}x</div>
              <div style={{fontSize:10,color:"var(--muted2)"}}>{isIt?"quota totale":"total odds"}</div>
            </div>
          </div>

          {/* Each selection */}
          {result.selections?.map((s,i)=>(
            <div key={i} style={{marginBottom:12,padding:14,background:"var(--card2)",borderRadius:12,border:"1px solid var(--border)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:"white"}}>{s.teams}</div>
                  <div style={{fontSize:11,color:"var(--muted2)",marginTop:2}}>{s.selection} · quota {s.quota}</div>
                </div>
                <span style={verdictStyle(s.verdict_color)}>{s.verdict}</span>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <span style={{fontSize:11,fontFamily:"var(--mono)",color:"var(--muted2)"}}>Impl. {s.implied_prob}%</span>
                <span style={{fontSize:11,color:"var(--muted2)"}}>→</span>
                <span style={{fontSize:11,fontFamily:"var(--mono)",color:"var(--cyan)"}}>Reale ~{s.estimated_prob}%</span>
                <span style={{fontSize:11,fontFamily:"var(--mono)",color:s.edge?.startsWith("+")||s.edge>0?"var(--green)":"var(--red)"}}>Edge {s.edge}</span>
              </div>
              <div style={{fontSize:11,color:"var(--muted2)",lineHeight:1.5}}>{s.reason}</div>
            </div>
          ))}

          {/* Tips */}
          {result.tips?.length>0&&(
            <div style={{marginTop:16,padding:14,background:"rgba(0,212,255,0.05)",borderRadius:12,border:"1px solid rgba(0,212,255,0.15)"}}>
              <div style={{fontSize:12,fontWeight:700,color:"var(--cyan)",marginBottom:10}}>💡 {isIt?"Suggerimenti AI":"AI Tips"}</div>
              {result.tips.map((tip,i)=>(
                <div key={i} style={{fontSize:12,color:"var(--muted2)",marginBottom:6,paddingLeft:12,borderLeft:"2px solid var(--cyan)"}}>
                  {tip}
                </div>
              ))}
            </div>
          )}

          {/* Reasoning */}
          <div style={{marginTop:16,padding:14,background:"var(--card2)",borderRadius:12,border:"1px solid var(--border)"}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--cyan)",marginBottom:8,fontFamily:"var(--mono)"}}>🧠 ANALISI DETTAGLIATA</div>
            <div style={{fontSize:12,color:"var(--muted2)",lineHeight:1.7}}>{reasoning}{typing&&<span style={{animation:"blink 1s infinite"}}>|</span>}</div>
          </div>
        </div>
      )}

      {result?.error&&(
        <div style={{padding:20,background:"rgba(255,80,80,0.08)",borderRadius:12,border:"1px solid rgba(255,80,80,0.2)",color:"var(--red)",fontSize:12}}>
          ⚠️ Errore: {result.message}
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════
// SCHEDINE PAGE — storico completo con riapertura
// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
// SCHEDINE PAGE
// ═══════════════════════════════════════════════════════════
function SchedinePage({ history, isIt, selectedSchedina, setSelectedSchedina, updateEsito }) {
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("month"); // "month" | "day" | "all"

  const filtered = history.filter(h => {
    if(filter==="won") return (h.status||h.esito)==="won";
    if(filter==="lost") return (h.status||h.esito)==="lost";
    if(filter==="pending") return (h.status||h.esito||"pending")==="pending";
    return true;
  });

  // Group by month or day
  const grouped = {};
  filtered.forEach(h => {
    let key;
    if(view==="month") {
      // Parse date dd/mm/yyyy
      const parts = h.date?.split("/");
      key = parts?.length===3 ? `${parts[1]}/${parts[2]}` : h.date || "—";
    } else {
      key = h.date || "—";
    }
    if(!grouped[key]) grouped[key] = [];
    grouped[key].push(h);
  });

  const monthNames = {
    "01":"Gennaio","02":"Febbraio","03":"Marzo","04":"Aprile","05":"Maggio","06":"Giugno",
    "07":"Luglio","08":"Agosto","09":"Settembre","10":"Ottobre","11":"Novembre","12":"Dicembre"
  };

  const formatGroupKey = (key) => {
    if(view==="month") {
      const [m,y] = key.split("/");
      return isIt ? `${monthNames[m]||m} ${y}` : `${new Date(2000,parseInt(m)-1).toLocaleString("en",{month:"long"})} ${y}`;
    }
    return key;
  };

  const wins = history.filter(h=>(h.status||h.esito)==="won").length;
  const lost2 = history.filter(h=>(h.status||h.esito)==="lost").length;
  const winRate = (wins+lost2)>0?Math.round(wins/(wins+lost2)*100):0;

  // Download schedina as image using canvas
  const downloadSchedina = async (s) => {
    const matches = s.details || s.full?.matches || [];
    const canvas = document.createElement("canvas");
    canvas.width = 600; canvas.height = 120 + matches.length * 56 + 80;
    const ctx = canvas.getContext("2d");
    // Background
    ctx.fillStyle = "#0c1122"; ctx.fillRect(0,0,canvas.width,canvas.height);
    // Header
    ctx.fillStyle = "#00d4ff"; ctx.font = "bold 28px sans-serif"; ctx.fillText("BetAI", 24, 44);
    ctx.fillStyle = "#5d6e8e"; ctx.font = "13px sans-serif";
    ctx.fillText(`${s.date} · ${s.risk?.toUpperCase()} · ${s.n} ${isIt?"partite":"picks"}`, 24, 68);
    // Divider
    ctx.fillStyle = "rgba(255,255,255,0.06)"; ctx.fillRect(0, 84, canvas.width, 1);
    // Matches
    matches.forEach((m, i) => {
      const y = 108 + i * 56;
      ctx.fillStyle = "#111827"; ctx.beginPath();
      ctx.roundRect(16, y, canvas.width-32, 48, 8); ctx.fill();
      ctx.fillStyle = "#dde3f0"; ctx.font = "bold 13px sans-serif";
      ctx.fillText(m.teams?.slice(0,38)||"", 28, y+18);
      ctx.fillStyle = "#00d4ff"; ctx.font = "bold 12px sans-serif";
      ctx.fillText(m.selection||"", 28, y+36);
      ctx.fillStyle = "#f5b800"; ctx.font = "bold 16px sans-serif";
      ctx.fillText(`${m.quota}x`, canvas.width-60, y+28);
    });
    // Total
    const botY = canvas.height - 56;
    ctx.fillStyle = "rgba(255,255,255,0.04)"; ctx.fillRect(0, botY-8, canvas.width, 64);
    ctx.fillStyle = "#f5b800"; ctx.font = "bold 22px sans-serif";
    ctx.fillText(`QUOTA: ${s.quota}x`, 24, botY+22);
    ctx.fillStyle = "#5d6e8e"; ctx.font = "11px sans-serif";
    ctx.fillText("betai-app-theta.vercel.app", canvas.width-220, botY+22);
    // Download
    const link = document.createElement("a");
    link.download = `BetAI_${s.date?.replace(/\//g,"-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  if(selectedSchedina) {
    const s = selectedSchedina;
    const matches = s.details || s.full?.matches || [];
    const esito = s.status || s.esito || "pending";
    return (
      <div style={{maxWidth:720}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:10}}>
          <button onClick={()=>setSelectedSchedina(null)}
            style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",color:"var(--cyan)",cursor:"pointer",fontSize:13,fontWeight:600,padding:0}}>
            ← {isIt?"Torna alle schedine":"Back to bets"}
          </button>
          <button onClick={()=>downloadSchedina(s)}
            style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:10,background:"rgba(0,212,255,0.08)",border:"1px solid rgba(0,212,255,0.25)",color:"var(--cyan)",cursor:"pointer",fontSize:12,fontWeight:700}}>
            ⬇️ {isIt?"Scarica PNG":"Download PNG"}
          </button>
        </div>

        <div style={{background:"var(--card)",borderRadius:20,border:"1px solid var(--border2)",padding:24,marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:12}}>
            <div>
              <div style={{fontSize:20,fontFamily:"var(--display)",color:"white",letterSpacing:1}}>
                {isIt?"Schedina del":"Bet from"} {s.date}
              </div>
              <div style={{fontSize:12,color:"var(--muted2)",marginTop:4,fontFamily:"var(--mono)"}}>
                {s.risk?.toUpperCase()} · {s.n} {isIt?"partite":"picks"} · {s.sport}
              </div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <div style={{textAlign:"center",padding:"8px 16px",background:"var(--card2)",borderRadius:12,border:"1px solid var(--border)"}}>
                <div style={{fontFamily:"var(--display)",fontSize:22,color:"var(--gold)"}}>{s.quota}x</div>
                <div style={{fontSize:9,color:"var(--muted2)",letterSpacing:1,textTransform:"uppercase"}}>quota</div>
              </div>
              {esito==="pending" ? (
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <button onClick={()=>{updateEsito(s.id,"won");setSelectedSchedina({...s,status:"won"});}}
                    style={{padding:"8px 16px",borderRadius:10,background:"rgba(0,224,144,0.1)",border:"1px solid rgba(0,224,144,0.3)",color:"var(--green)",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                    ✓ {isIt?"VINTA":"WON"}
                  </button>
                  <button onClick={()=>{updateEsito(s.id,"lost");setSelectedSchedina({...s,status:"lost"});}}
                    style={{padding:"8px 16px",borderRadius:10,background:"rgba(255,68,102,0.1)",border:"1px solid rgba(255,68,102,0.3)",color:"var(--red)",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                    ✗ {isIt?"PERSA":"LOST"}
                  </button>
                </div>
              ) : (
                <div style={{padding:"10px 20px",borderRadius:12,
                  background:esito==="won"?"rgba(0,224,144,0.1)":"rgba(255,68,102,0.1)",
                  border:`1px solid ${esito==="won"?"rgba(0,224,144,0.3)":"rgba(255,68,102,0.3)"}`,
                  color:esito==="won"?"var(--green)":"var(--red)",
                  fontSize:14,fontWeight:700,textAlign:"center"}}>
                  {esito==="won"?(isIt?"🏆 VINTA":"🏆 WON"):(isIt?"❌ PERSA":"❌ LOST")}
                </div>
              )}
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {matches.length > 0 ? matches.map((m,i)=>(
              <div key={i} style={{background:"var(--card2)",borderRadius:12,padding:"12px 16px",border:"1px solid var(--border)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:"white"}}>{m.teams}</div>
                    <div style={{fontSize:10,color:"var(--muted2)",fontFamily:"var(--mono)",marginTop:2}}>{m.league} · {m.time}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:12,fontWeight:700,color:"var(--cyan)"}}>{m.selection}</div>
                      <div style={{fontSize:10,color:"var(--muted2)",fontFamily:"var(--mono)"}}>{m.single_prob}% · {m.ai_edge}</div>
                    </div>
                    <div style={{fontFamily:"var(--mono)",fontSize:14,fontWeight:700,color:"var(--gold)",background:"rgba(245,184,0,0.08)",border:"1px solid rgba(245,184,0,0.2)",padding:"4px 10px",borderRadius:8}}>{m.quota}</div>
                  </div>
                </div>
                {m.stat_chips?.length>0&&(
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:6}}>
                    {m.stat_chips.map((ch,j)=>(
                      <span key={j} style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:"rgba(0,212,255,0.07)",color:"var(--cyan)",fontFamily:"var(--mono)"}}>{ch}</span>
                    ))}
                  </div>
                )}
              </div>
            )) : <div style={{color:"var(--muted2)",fontSize:13,padding:16,textAlign:"center"}}>{isIt?"Dettagli non disponibili":"Details not available"}</div>}
          </div>

          {(s.full?.reasoning||s.reasoning) && (
            <div style={{marginTop:16,padding:14,background:"rgba(0,212,255,0.02)",borderRadius:12,border:"1px solid rgba(0,212,255,0.1)"}}>
              <div style={{fontSize:9,fontWeight:700,color:"var(--cyan)",letterSpacing:2,marginBottom:8,textTransform:"uppercase"}}>🧠 AI Analysis</div>
              <div style={{fontSize:12,color:"var(--muted3)",lineHeight:1.8}}>{s.full?.reasoning||s.reasoning}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{maxWidth:760}}>
      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
        {[
          {v:history.length,l:isIt?"Totali":"Total",c:"var(--cyan)"},
          {v:wins,l:isIt?"Vinte":"Won",c:"var(--green)"},
          {v:lost2,l:isIt?"Perse":"Lost",c:"var(--red)"},
          {v:winRate+"%",l:"Win Rate",c:"var(--gold)"},
        ].map((s,i)=>(
          <div key={i} style={{background:"var(--card)",borderRadius:14,padding:"14px",textAlign:"center",border:"1px solid var(--border)"}}>
            <div style={{fontFamily:"var(--display)",fontSize:26,color:s.c}}>{s.v}</div>
            <div style={{fontSize:9,color:"var(--muted2)",letterSpacing:1,textTransform:"uppercase",marginTop:2}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",justifyContent:"space-between"}}>
        <div style={{display:"flex",gap:6}}>
          {[["all",isIt?"Tutte":"All"],["pending",isIt?"In attesa":"Pending"],["won",isIt?"Vinte":"Won"],["lost",isIt?"Perse":"Lost"]].map(([k,l])=>(
            <button key={k} onClick={()=>setFilter(k)}
              style={{padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:700,cursor:"pointer",border:"1px solid",transition:"all 0.2s",
                background:filter===k?"rgba(0,212,255,0.1)":"transparent",
                borderColor:filter===k?"var(--cyan)":"var(--border)",
                color:filter===k?"var(--cyan)":"var(--muted2)"}}>
              {l}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:6}}>
          {[["month",isIt?"Per mese":"By month"],["day",isIt?"Per giorno":"By day"]].map(([k,l])=>(
            <button key={k} onClick={()=>setView(k)}
              style={{padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:700,cursor:"pointer",border:"1px solid",transition:"all 0.2s",
                background:view===k?"rgba(139,92,246,0.1)":"transparent",
                borderColor:view===k?"var(--purple)":"var(--border)",
                color:view===k?"var(--purple)":"var(--muted2)"}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped list */}
      {filtered.length === 0 ? (
        <div style={{textAlign:"center",padding:48,color:"var(--muted2)"}}>
          <div style={{fontSize:32,marginBottom:12}}>📋</div>
          <div style={{fontSize:14}}>{isIt?"Nessuna schedina trovata":"No bets found"}</div>
        </div>
      ) : (
        Object.entries(grouped).sort((a,b)=>b[0].localeCompare(a[0])).map(([key, items])=>(
          <div key={key} style={{marginBottom:20}}>
            {/* Group header */}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:700,color:"var(--text2)"}}>{formatGroupKey(key)}</div>
              <div style={{flex:1,height:1,background:"var(--border)"}}/>
              <div style={{fontSize:11,color:"var(--muted2)",fontFamily:"var(--mono)"}}>{items.length} {isIt?"schedine":"bets"}</div>
            </div>
            {/* Items */}
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {items.map(h=>{
                const esito = h.status||h.esito||"pending";
                return (
                  <div key={h.id} onClick={()=>setSelectedSchedina(h)}
                    style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,padding:"13px 16px",cursor:"pointer",transition:"all 0.18s",display:"flex",alignItems:"center",gap:12}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="var(--border2)"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
                    <div style={{fontSize:20}}>{h.sport}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:600,color:"var(--text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{h.matches}</div>
                      <div style={{fontSize:10,color:"var(--muted2)",fontFamily:"var(--mono)",marginTop:3}}>
                        {h.date} · {h.n} {isIt?"partite":"picks"} · {h.risk?.toUpperCase()}
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                      <span style={{fontFamily:"var(--mono)",fontSize:13,fontWeight:700,color:"var(--gold)"}}>{h.quota}x</span>
                      <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:20,
                        background:esito==="won"?"rgba(0,224,144,0.08)":esito==="lost"?"rgba(255,68,102,0.08)":"rgba(0,212,255,0.08)",
                        color:esito==="won"?"var(--green)":esito==="lost"?"var(--red)":"var(--cyan)",
                        border:`1px solid ${esito==="won"?"rgba(0,224,144,0.2)":esito==="lost"?"rgba(255,68,102,0.2)":"rgba(0,212,255,0.2)"}`}}>
                        {esito==="won"?(isIt?"VINTA":"WON"):esito==="lost"?(isIt?"PERSA":"LOST"):(isIt?"ATTESA":"PENDING")}
                      </span>
                      <span style={{color:"var(--muted2)"}}>›</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function Dashboard({ user, onLogout, lang, setLang }) {
  const t = T[lang].dash;
  const isIt = lang==="it";

  // ── State ──
  const [selectedSports, setSelectedSports] = useState(new Set(["Calcio","Basket","Football","Hockey","Baseball","MMA"]));
  const [risk, setRisk] = useState("balanced");
  const [numMatches, setNumMatches] = useState(3);
  const [prob, setProb] = useState(55);
  const [quota, setQuota] = useState(8);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [reasoning, setReasoning] = useState("");
  const [typing, setTyping] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedSchedina, setSelectedSchedina] = useState(null);

  // Load schedine from Supabase on mount
  useEffect(()=>{
    if(!user?.token || !user?.id) return;
    console.log("BetAI: carico schedine per utente", user.id);
    sb.getSchedine(user.id, user.token).then(data=>{
      console.log("BetAI: schedine ricevute:", data?.length, data);
      if(!Array.isArray(data)) { console.warn("Schedine non array:", data); return; }
      setHistory(data.map(s=>({
        id: s.id,
        sport: s.sport || "⚽",
        matches: Array.isArray(s.matches) ? s.matches.map(m=>m.teams).join(" | ") : "-",
        date: new Date(s.created_at).toLocaleDateString("it-IT"),
        quota: s.quota_totale?.toFixed(2)||"-",
        status: s.esito||"pending",
        risk: s.risk,
        n: s.num_matches,
        details: s.matches,
        reasoning: s.reasoning,
        full: s,
      })));
    }).catch(e=>console.error("Schedine error:", e));
  },[user?.id]);
  const [activeNav, setActiveNav] = useState(0);
  const [todayMatches, setTodayMatches] = useState([]);

  // All available sport categories from loaded matches
  const availableCats = [...new Set(todayMatches.map(m => m.cat))].filter(Boolean);

  const RISK_CONFIG = {
    safe:     { minQ:1.05, maxQ:1.60, label:"SAFE 1.05–1.60",     color:"var(--green)", desc:"Quote basse, favoriti sicuri" },
    balanced: { minQ:1.61, maxQ:2.00, label:"BALANCED 1.61–2.00", color:"var(--gold)",  desc:"Equilibrio rischio/rendimento" },
    high:     { minQ:2.01, maxQ:99,   label:"HIGH RISK >2.00",    color:"var(--red)",   desc:"Quote alte, massima vincita" },
  };

  const probColor = prob>=65?"var(--green)":prob>=40?"var(--gold)":"var(--red)";
  const today = new Date().toLocaleDateString(isIt?"it-IT":"en-GB",{weekday:"long",day:"numeric",month:"long"});

  // Load history from Supabase
  useEffect(()=>{
    if(!user?.token || !user?.id) return;
    sb.getSchedine(user.id, user.token).then(data=>{
      if(!Array.isArray(data)) return;
      setHistory(data.map(s=>({
        id:s.id, dbId:s.id,
        sport:(s.sport||"").split(",").map(c=>c==="Calcio"?"⚽":c==="Basket"?"🏀":c==="Football"?"🏈":c==="Hockey"?"🏒":"🥊").join(""),
        matches:Array.isArray(s.matches)?s.matches.map(m=>m.teams).join(" | "):"—",
        date:new Date(s.created_at).toLocaleDateString("it-IT"),
        quota:s.quota_totale?.toFixed(2)||"—",
        esito:s.esito||"pending",
        risk:s.risk, n:s.num_matches, details:s.matches,
      })));
    }).catch(()=>{});
  },[user]);

  const toggleSport = (cat) => {
    setSelectedSports(prev => {
      const next = new Set(prev);
      if(next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  const animateReasoning = (text) => {
    setTyping(true); let i=0;
    const iv = setInterval(()=>{
      setReasoning(text.slice(0,i)); i+=6;
      if(i>text.length){ setReasoning(text); setTyping(false); clearInterval(iv); }
    },18);
  };

  const updateEsito = async (schedId, esito) => {
    setHistory(h=>h.map(x=>x.id===schedId?{...x,status:esito}:x));
    if(user?.token && typeof schedId === "string" && schedId.length > 10) {
      await sb.updateSchedina(schedId, user.token, {esito}).catch(()=>{});
    }
  };

  const generate = async () => {
    // Snapshot all params at click time
    const N = numMatches;
    const R = risk;
    const RC = RISK_CONFIG[R];
    const minQ = RC.minQ;
    const maxQ = RC.maxQ;
    const cats = selectedSports.size > 0 ? selectedSports : new Set(availableCats);

    setLoading(true); setResult(null); setReasoning("");

    // Filter matches by selected sports
    const filtered = todayMatches.filter(m => cats.has(m.cat));
    // Se nessuna partita trovata per gli sport selezionati, usa tutte le partite disponibili
    const finalFiltered = filtered.length > 0 ? filtered : todayMatches;
    const sportLabel = filtered.length > 0 ? [...cats].join(", ") : "Tutti gli sport disponibili";

    // Shuffle for variety
    const seed = Math.random().toString(36).slice(2,8).toUpperCase();
    const shuffled = [...finalFiltered].sort(() => Math.random() - 0.5);

    // Build match list with ALL markets
    const matchList = shuffled.slice(0,25).map((m,idx) => {
      // Base 1X2
      const i1 = m.home_odds ? (100/m.home_odds).toFixed(1)+"%" : "N/A";
      const ix = m.draw_odds ? (100/m.draw_odds).toFixed(1)+"%" : "-";
      const i2 = m.away_odds ? (100/m.away_odds).toFixed(1)+"%" : "N/A";
      let line = `${idx+1}. [${m.cat}] ${m.teams} | ${m.league} | ${m.time}\n`;
      line += `   1X2: 1=${m.home_odds||"?"} (impl.${i1})  X=${m.draw_odds||"-"} (impl.${ix})  2=${m.away_odds||"?"} (impl.${i2})`;
      // Extra markets
      if(m.allMarkets && m.allMarkets.length > 1) {
        const extras = m.allMarkets
          .filter(mk => mk.name !== "1X2")
          .slice(0,8)
          .map(mk => mk.outcomes.map(o => `${o.label}=${o.price} (impl.${(100/o.price).toFixed(1)}%)`).join("  "))
          .join("  |  ");
        if(extras) line += `\n   ALTRI MERCATI: ${extras}`;
      }
      return line;
    }).join("\n");

    const hasMatches = finalFiltered.length > 0;
    const totalLoaded = todayMatches.length;

    const strategyMap = {
      safe: `Seleziona SOLO esiti con quota tra ${minQ} e ${maxQ}.
Prediligi i FAVORITI NETTI (1X2 con prob >62%).
Per ogni partita: calcola prob implicita = 1/quota*100. Stima prob reale. Edge = stima-implicita.
Scegli l'esito con edge POSITIVO PIU ALTO nella fascia ${minQ}-${maxQ}.
Esplora anche Over/Under bassi e BTTS se rientrano nella fascia.
VIETATO usare quote fuori dal range ${minQ}-${maxQ}.`,
      balanced: `Seleziona SOLO esiti con quota tra ${minQ} e ${maxQ}.
Cerca il MASSIMO VALORE (edge = prob_stimata - prob_implicita).
Non scegliere solo 1 e 2 - valuta anche X, Over 2.5, BTTS Yes se rientrano in ${minQ}-${maxQ}.
Privilegia le selezioni con edge > 5%.
VIETATO usare quote fuori dal range ${minQ}-${maxQ}.`,
      high: `Seleziona SOLO esiti con quota SUPERIORE a ${minQ}.
Cerca underdog, outsider, Over alti, pareggi a sorpresa.
Accetta prob basse (anche 20-35%) se la quota offre valore reale.
Valuta: squadre in forma ma sottovalutate, trasferte difficili, partite offensive.
VIETATO usare quote sotto ${minQ}.`,
    };

    const prompt = `[${seed}] Sei BetAI, analista sportivo esperto. Costruisci una schedina rispettando TUTTI i parametri.

DATA: ${new Date().toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
LINGUA RISPOSTA: ${isIt?"Italiano":"Inglese"}

╔══ PARAMETRI OBBLIGATORI ══╗
║ Numero selezioni: ESATTAMENTE ${N}
║ Fascia quota: OGNI quota DEVE essere tra ${minQ} e ${maxQ===99?"99 (no limite)":maxQ}
║ Livello rischio: ${R.toUpperCase()} - ${RC.desc}
║ Sport richiesti: ${sportLabel}
╚═══════════════════════════╝

${hasMatches ? `PARTITE REALI DISPONIBILI (quote live bookmaker):
${matchList}` : `NESSUNA PARTITA REALE DISPONIBILE DALL'API.
USA LA TUA CONOSCENZA AGGIORNATA:
Data ESATTA di oggi: ${new Date().toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}.
Devi trovare ${N} partite che si giocano ESATTAMENTE OGGI o domani (non ieri, non la prossima settimana).
Sport richiesti: ${sportLabel}.

Pensa a quali partite reali si giocano oggi:
- Serie A, Premier League, La Liga, Bundesliga, Ligue 1 giocano nei weekend e infrasettimanali
- Champions League / Europa League giocano il martedi/mercoledi/giovedi
- NBA gioca quasi ogni giorno
- Usa la tua conoscenza del calendario sportivo reale per questa data specifica.

Per ogni partita indica:
- Squadre reali che si affrontano oggi
- Orario reale stimato
- Quote realistiche basate sui valori reali delle squadre
- Fascia quote OBBLIGATORIA: ${minQ} - ${maxQ===99?20:maxQ}`}

ANALISI DA FARE PER OGNI PARTITA:
Per ogni partita analizza TUTTI i mercati disponibili (1X2, Over/Under, Handicap, BTTS, ecc.):
1. Per ogni singolo esito/quota disponibile nella fascia ${minQ}-${maxQ===99?"99":maxQ}:
   - Stima prob reale: forma recente, H2H, casa/trasferta, infortuni, contesto partita
   - Calcola prob implicita = 1/quota * 100
   - Calcola edge = prob_stimata - prob_implicita
2. Scegli l'esito con edge PIU ALTO in assoluto (non limitarti a 1X2!)
3. Esplora Over/Under, BTTS, Handicap - spesso hanno piu valore di 1X2

STRATEGIA ${R.toUpperCase()}:
${strategyMap[R]}

REGOLA ASSOLUTA: restituisci ESATTAMENTE ${N} selezioni. Ne ${N}. Zero di piu, zero di meno.
Ogni quota singola DEVE essere >= ${minQ} e <= ${maxQ===99?99:maxQ}.

RISPOSTA: solo JSON valido, zero testo extra, zero markdown:
{"matches":[{"teams":"Squadra A vs Squadra B","league":"Lega","time":"HH:MM","selection":"esito","single_prob":65,"quota":1.45,"ai_edge":"+7%","stat_chips":["Forma 4/5","H2H 3-1","Edge +7%","Impl. 55%→Reale 62%"]}],"total_quota":4.20,"estimated_prob":18,"reasoning":"${isIt?"Analisi in italiano":"Analysis in English"} — min 4 frasi, spiega ogni scelta con dati e calcolo edge."}`;

    try {
      const res = await fetch("/api/analyze", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-haiku-4-5-20251001",
          max_tokens:3000,
          messages:[{role:"user",content:prompt}]
        })
      });
      const data = await res.json();
      if(data.error) throw new Error(data.error.message);
      const raw = data.content?.map(b=>b.text||"").join("")||"";
      const clean = raw.replace(/```json/g,"").replace(/```/g,"").trim();
      const parsed = JSON.parse(clean);

      // Enforce N matches client-side as safety net
      if(parsed.matches && parsed.matches.length !== N) {
        parsed.matches = parsed.matches.slice(0, N);
        const tq = parsed.matches.reduce((a,m)=>a*(m.quota||1.5),1);
        const ep = parsed.matches.reduce((a,m)=>a*(m.single_prob/100),1)*100;
        parsed.total_quota = parseFloat(tq.toFixed(2));
        parsed.estimated_prob = parseFloat(ep.toFixed(1));
      }

      setResult(parsed);
      animateReasoning(parsed.reasoning||"");
      // Save to Supabase if logged in
      const schedEntry = {
        sport: [...cats].join(","),
        risk: R,
        num_matches: N,
        quota_totale: parsed.total_quota,
        prob_stimata: parsed.estimated_prob,
        matches: parsed.matches,
        reasoning: parsed.reasoning,
        esito: "pending",
      };
      let savedId = null;
      if (user?.token && user?.id) {
        try {
          const saved = await sb.saveSchedina(user.id, user.token, schedEntry);
          savedId = saved?.[0]?.id || null;
        } catch(e) { console.warn("Salvataggio schedina fallito:", e); }
      }
      const histEntry = {
        id: savedId || Date.now(),
        dbId: savedId,
        sport: [...cats].map(c=>c==="Calcio"?"⚽":c==="Basket"?"🏀":c==="Tennis"?"🎾":c==="Football"?"🏈":c==="Hockey"?"🏒":"🥊").join(""),
        matches: parsed.matches?.map(m=>m.teams).join(" | ")||"-",
        date: new Date().toLocaleDateString("it-IT"),
        quota: parsed.total_quota?.toFixed(2)||"-",
        status: "pending",
        risk: R,
        n: N,
        details: parsed.matches,
      };
      setHistory(h=>[histEntry,...h.slice(0,19)]);
    } catch(err) {
      // Fallback: use real matches with correct odds range
      // Fallback con partite reali disponibili
      const allAvailable = [...finalFiltered].sort(() => Math.random() - 0.5);
      const fallbackMatches = allAvailable
        .slice(0, N)
        .map(m => {
          const useOdds = R==="safe" ? (m.home_odds||1.40) : R==="balanced" ? (m.home_odds||1.75) : (m.away_odds||2.50);
          return {
            teams: m.teams, league: m.league, time: m.time,
            selection: R==="safe"?"1":R==="balanced"?"1":"2",
            single_prob: m.home_odds ? Math.round(100/m.home_odds) : 55,
            quota: useOdds,
            ai_edge:"+5%",
            stat_chips:["Quota live ✓","Analisi base","Edge +5%"]
          };
        });
      const fb = fallbackMatches.length > 0 ? fallbackMatches : [
        {teams:"Partita non disponibile",league:"—",time:"—",selection:"1",single_prob:60,quota:1.50,ai_edge:"+5%",stat_chips:["Dati limitati"]},
      ];
      const tq = fb.reduce((a,m)=>a*(m.quota||1.5),1);
      const ep = fb.reduce((a,m)=>a*(m.single_prob/100),1)*100;
      setResult({matches:fb,total_quota:parseFloat(tq.toFixed(2)),estimated_prob:parseFloat(ep.toFixed(1)),reasoning:isIt?"Analisi basata sulle quote live. Verifica gli infortuni prima di scommettere.":"Analysis based on live odds. Check injuries before betting."});
      animateReasoning(isIt?"Analisi basata sulle quote live. Verifica gli infortuni prima di scommettere.":"Analysis based on live odds. Check injuries before betting.");
    } finally { setLoading(false); }
  };

  const titles = {0:"DASHBOARD",1:isIt?"SCHEDINE":"MY BETS",2:"HALL OF FAME",3:isIt?"ANALISI SCHEDINA":"BET ANALYSIS",4:isIt?"PROFILO":"PROFILE"};

  return (
    <div className="dash-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">B</div>
          <div className="sidebar-logo-text">Bet<span>AI</span></div>
        </div>
        <div className="sidebar-section">{isIt?"PRINCIPALE":"MAIN"}</div>
        <nav className="sidebar-nav">
          {t.nav.slice(0,3).map((item,i)=>(
            <div key={i} className={"sidebar-item"+(activeNav===i?" active":"")} onClick={()=>setActiveNav(i)}>
              <span style={{fontSize:15}}>{t.navEmoji[i]}</span><span>{item}</span>
            </div>
          ))}
        </nav>
        <div className="sidebar-section" style={{marginTop:8}}>{isIt?"STRUMENTI":"TOOLS"}</div>
        <nav className="sidebar-nav">
          {t.nav.slice(3).map((item,i)=>(
            <div key={i+3} className={"sidebar-item"+(activeNav===i+3?" active":"")} onClick={()=>setActiveNav(i+3)}>
              <span style={{fontSize:15}}>{t.navEmoji[i+3]}</span><span>{item}</span>
            </div>
          ))}
        </nav>
        <div style={{marginTop:16}}><AdSidebar idx={activeNav}/></div>
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
            <div style={{fontSize:13,color:"var(--muted2)",marginTop:2}}>{today}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:12,color:"var(--muted2)"}}>{t.welcome}, {user.name} 👋</div>
          </div>
        </div>

        {activeNav===1 && (
          <SchedinePage
            history={history}
            isIt={isIt}
            selectedSchedina={selectedSchedina}
            setSelectedSchedina={setSelectedSchedina}
            updateEsito={updateEsito}
          />
        )}
        {activeNav===2 && <DashWins lang={lang} history={history}/>}
        {activeNav===3 && <AnalisiPage lang={lang}/>}
        {activeNav===4 && <ProfilePage user={user} lang={lang} history={history}/>}

        {activeNav!==1 && activeNav!==2 && activeNav!==3 && activeNav!==4 && (<>
          {/* Stats bar */}
          <div className="stats-bar">
            {[{v:"24",l:t.stats[0],tr:"+3",up:true},{v:"16",l:t.stats[1],tr:"+1",up:true},{v:"67%",l:t.stats[2],tr:"+2%",up:true},{v:"6.8x",l:t.stats[3],tr:"-0.4",up:false}].map((s,i)=>(
              <div className="stat-card" key={i}>
                <div className="stat-card-val">{s.v}</div>
                <div className="stat-card-lbl">{s.l}</div>
                <div className="stat-card-trend" style={{color:s.up?"var(--green)":"var(--red)"}}>{s.up?"▲":"▼"} {s.tr}</div>
              </div>
            ))}
          </div>

          {/* Today Matches */}
          <TodayMatches lang={lang} onMatchesLoaded={setTodayMatches}/>

          {/* Generator */}
          <div className="generator-card">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
              <div style={{fontFamily:"var(--display)",fontSize:20,letterSpacing:1,color:"white"}}>{t.genTitle}</div>
              <div style={{fontSize:10,color:todayMatches.length>0?"var(--green)":"var(--muted2)",fontFamily:"var(--mono)"}}>
                {todayMatches.length>0?`✓ ${todayMatches.length} partite caricate`:"Nessuna partita"}
              </div>
            </div>

            {/* Sport multi-select */}
            <div style={{marginBottom:20}}>
              <span className="label-text">{isIt?"Sport (selezione multipla per schedina mista)":"Sports (multi-select for mixed bet)"}</span>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10}}>
                <button
                  onClick={()=>setSelectedSports(new Set(availableCats.length>0?availableCats:["Calcio","Basket","Football","Hockey","Baseball","MMA"]))}
                  style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:700,cursor:"pointer",border:"1px solid",transition:"all 0.2s",
                    background:selectedSports.size>=availableCats.length?"rgba(0,212,255,0.1)":"var(--card2)",
                    borderColor:selectedSports.size>=availableCats.length?"var(--cyan)":"var(--border)",
                    color:selectedSports.size>=availableCats.length?"var(--cyan)":"var(--muted2)"}}>
                  🌍 {isIt?"Tutti":"All"}
                </button>
                {(availableCats.length>0?availableCats:["Calcio","Basket","Football","Hockey","Baseball","MMA"]).map(cat=>{
                  const emoji = cat==="Calcio"?"⚽":cat==="Basket"?"🏀":cat==="Tennis"?"🎾":cat==="Football"?"🏈":cat==="Hockey"?"🏒":cat==="Baseball"?"⚾":"🥊";
                  const active = selectedSports.has(cat);
                  return (
                    <button key={cat} onClick={()=>toggleSport(cat)}
                      style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:700,cursor:"pointer",border:"1px solid",transition:"all 0.2s",position:"relative",
                        background:active?"rgba(0,212,255,0.1)":"var(--card2)",
                        borderColor:active?"var(--cyan)":"var(--border)",
                        color:active?"var(--cyan)":"var(--muted2)"}}>
                      {emoji} {cat}
                      {active&&<span style={{position:"absolute",top:-5,right:-5,width:14,height:14,borderRadius:"50%",background:"var(--cyan)",color:"#05080f",fontSize:9,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>✓</span>}
                    </button>
                  );
                })}
              </div>
              {selectedSports.size>1&&<div style={{marginTop:8,fontSize:11,color:"var(--cyan)",fontFamily:"var(--mono)"}}>
                🎯 {isIt?"Schedina mista":"Mixed bet"}: {[...selectedSports].join(" + ")}
              </div>}
            </div>

            {/* Risk */}
            <div style={{marginBottom:20}}>
              <span className="label-text">{t.risk}</span>
              <div className="risk-grid" style={{marginTop:10}}>
                {Object.entries(RISK_CONFIG).map(([id,rc])=>(
                  <div key={id} className={"risk-card-btn r-"+id+(risk===id?" active":"")} onClick={()=>setRisk(id)}
                    style={{borderColor:risk===id?rc.color:"var(--border)"}}>
                    <div style={{fontSize:18,marginBottom:3}}>{id==="safe"?"🟢":id==="balanced"?"🟡":"🔴"}</div>
                    <div style={{fontSize:11,fontWeight:700,color:"white"}}>{rc.label}</div>
                    <div style={{fontSize:9,color:"var(--muted2)",marginTop:2}}>{rc.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Numero partite */}
            <div style={{marginBottom:20}}>
              <span className="label-text">{isIt?"Numero partite nella schedina":"Number of matches"}</span>
              <div style={{display:"flex",alignItems:"center",gap:14,marginTop:10}}>
                <div style={{display:"flex",alignItems:"center",gap:8,background:"var(--card2)",border:"1px solid var(--border2)",borderRadius:12,padding:"8px 16px"}}>
                  <button onClick={()=>setNumMatches(n=>Math.max(1,n-1))}
                    style={{width:28,height:28,borderRadius:8,border:"1px solid var(--border2)",background:"var(--card)",color:"var(--text)",fontSize:18,cursor:"pointer",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                  <span style={{fontFamily:"var(--display)",fontSize:32,color:"var(--cyan)",minWidth:36,textAlign:"center"}}>{numMatches}</span>
                  <button onClick={()=>setNumMatches(n=>Math.min(25,n+1))}
                    style={{width:28,height:28,borderRadius:8,border:"1px solid var(--border2)",background:"var(--card)",color:"var(--text)",fontSize:18,cursor:"pointer",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                </div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {[1,2,3,5,8,10,15,20,25].map(n=>(
                    <button key={n} onClick={()=>setNumMatches(n)}
                      style={{padding:"5px 10px",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",border:"1px solid",transition:"all 0.2s",
                        background:numMatches===n?"rgba(0,212,255,0.1)":"var(--card2)",
                        borderColor:numMatches===n?"var(--cyan)":"var(--border)",
                        color:numMatches===n?"var(--cyan)":"var(--muted2)"}}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sliders */}
            <div style={{marginBottom:20}}>
              <div className="slider-row">
                <span className="slider-lbl">🎯 {t.prob}</span>
                <input type="range" min={5} max={95} value={prob} onChange={e=>setProb(+e.target.value)}/>
                <span className="slider-val" style={{color:probColor}}>{prob}%</span>
              </div>
              <div className="slider-row">
                <span className="slider-lbl">💰 {t.quota}</span>
                <input type="range" min={1.1} max={500} step={0.5} value={quota} onChange={e=>setQuota(+e.target.value)}/>
                <span className="slider-val" style={{color:"var(--gold)"}}>{quota}x</span>
              </div>
            </div>

            {/* Puntata e vincita potenziale */}
            <div style={{marginBottom:20,padding:16,background:"var(--card2)",borderRadius:14,border:"1px solid var(--border)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                <span style={{fontSize:12,fontWeight:700,color:"var(--muted2)",letterSpacing:1,textTransform:"uppercase"}}>💰 {isIt?"Puntata":"Stake"}</span>
                <div style={{display:"flex",gap:6}}>
                  {[5,10,20,50,100].map(v=>(
                    <button key={v} onClick={()=>setStake(v)}
                      style={{padding:"3px 8px",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer",border:"1px solid",
                        background:stake===v?"rgba(245,184,0,0.1)":"transparent",
                        borderColor:stake===v?"var(--gold)":"var(--border)",
                        color:stake===v?"var(--gold)":"var(--muted2)"}}>
                      €{v}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:13,color:"var(--muted2)"}}>€</span>
                <input type="number" min="1" max="10000" value={stake} onChange={e=>setStake(Math.max(1,+e.target.value))}
                  style={{flex:1,padding:"8px 12px",borderRadius:8,background:"var(--card)",border:"1px solid var(--border2)",color:"var(--text)",fontSize:14,fontWeight:700,outline:"none",fontFamily:"var(--mono)"}}/>
                <div style={{textAlign:"right",minWidth:100}}>
                  <div style={{fontSize:11,color:"var(--muted2)"}}>{isIt?"Vincita pot.":"Pot. win"}</div>
                  <div style={{fontFamily:"var(--display)",fontSize:18,color:"var(--green)"}}>€{(stake*quota).toFixed(2)}</div>
                </div>
              </div>
            </div>

            <button className="gen-btn" onClick={generate} disabled={loading}>
              {loading?t.generating:t.genBtn}
            </button>
          </div>

          {/* Loading */}
          {loading&&(
            <div className="result-wrap" style={{textAlign:"center",padding:40}}>
              <div className="spinner"/>
              <div style={{fontFamily:"var(--mono)",fontSize:12,color:"var(--muted2)"}}>{t.generating}</div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:8}}>
                {isIt?`Analisi ${numMatches} selezioni in fascia ${RISK_CONFIG[risk].label}...`:`Analyzing ${numMatches} picks in range ${RISK_CONFIG[risk].label}...`}
              </div>
            </div>
          )}

          {/* Result */}
          {result&&!loading&&(
            <div className="result-wrap">
              <div className="result-top">
                <div style={{fontSize:14,fontWeight:700,color:"white"}}>📋 {t.result}</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                  <div className="result-pills">
                    <span className="result-pill rp-green">~{result.estimated_prob?.toFixed(0)||"?"}% prob</span>
                    <span className="result-pill rp-gold">quota {result.total_quota?.toFixed(2)||"?"}x</span>
                    <span className="result-pill rp-cyan">{result.matches?.length||0} {isIt?"partite":"matches"}</span>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>{
                      const text = (result.matches||[]).map(m=>m.teams+" - "+m.selection+" @"+m.quota).join("\n");
                      const msg = "🎯 BetAI Schedina\n"+text+"\n💰 Quota: "+result.total_quota+"x";
                      if(navigator.share) navigator.share({title:"BetAI Schedina",text:msg});
                      else navigator.clipboard.writeText(msg).then(()=>alert(isIt?"Copiata!":"Copied!"));
                    }} style={{padding:"4px 10px",borderRadius:8,background:"rgba(0,212,255,0.08)",border:"1px solid rgba(0,212,255,0.2)",color:"var(--cyan)",fontSize:11,fontWeight:700,cursor:"pointer"}}>
                      📤 {isIt?"Condividi":"Share"}
                    </button>
                    <button onClick={()=>{
                      const text2 = (result.matches||[]).map(m=>m.teams+" - "+m.selection+" @"+m.quota).join("\n");
                      const wa = "https://wa.me/?text="+encodeURIComponent("🎯 BetAI Schedina\n"+text2+"\n💰 Quota: "+result.total_quota+"x");
                      window.open(wa,"_blank");
                    }} style={{padding:"4px 10px",borderRadius:8,background:"rgba(37,211,102,0.08)",border:"1px solid rgba(37,211,102,0.2)",color:"#25d366",fontSize:11,fontWeight:700,cursor:"pointer"}}>
                      💬 WhatsApp
                    </button>
                  </div>
                </div>
              </div>
              <div className="match-list">
                {result.matches?.map((m,i)=>(
                  <div className="match-item" key={i}>
                    <div className="match-item-top">
                      <div>
                        <div className="match-teams">{m.teams}</div>
                        <div className="match-meta">{m.league} · {m.date ? m.date+" · " : ""}{m.time}</div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontSize:12,fontWeight:700,color:"var(--cyan)"}}>{m.selection}</div>
                          <div style={{fontSize:10,color:"var(--muted2)",fontFamily:"var(--mono)",marginTop:1}}>{m.single_prob}% · {m.ai_edge}</div>
                        </div>
                        <div className="match-quota">{m.quota}</div>
                      </div>
                    </div>
                    {m.stat_chips?.length>0&&(
                      <div className="match-stats-row">
                        {m.stat_chips.map((ch,j)=>{
                          const cls=ch.includes("✓")?"msc-green":ch.includes("OUT")?"msc-red":ch.includes("Edge")||ch.includes("Reale")?"msc-cyan":"msc-gold";
                          return <span key={j} className={"match-stat-chip "+cls}>{ch}</span>;
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="ai-reasoning">
                <div className="ai-reasoning-label">🧠 {t.aiLabel}</div>
                <div className={"ai-reasoning-text"+(typing?" cursor":"")}>{reasoning}</div>
              </div>
              <div className="result-stats">
                {[{v:`${result.estimated_prob?.toFixed(0)||"?"}%`,l:isIt?"Probabilità":"Probability",c:"var(--green)"},
                  {v:`${result.total_quota?.toFixed(2)||"?"}x`,l:isIt?"Quota Totale":"Total Odds",c:"var(--gold)"},
                  {v:`€${(stake*(result.total_quota||1)).toFixed(2)}`,l:isIt?"Vincita Pot.":"Pot. Win",c:"var(--green)"},
                  {v:result.matches?.length||0,l:isIt?"Partite":"Matches",c:"var(--cyan)"}].map((s,i)=>(
                  <div className="rs-box" key={i}>
                    <div style={{fontFamily:"var(--display)",fontSize:24,color:s.c,marginBottom:2}}>{s.v}</div>
                    <div style={{fontSize:9,color:"var(--muted2)",letterSpacing:1,textTransform:"uppercase"}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result&&!loading&&<div style={{marginTop:16}}><AdInline idx={3} lang={lang}/></div>}

          {/* History */}
          <div style={{marginTop:24}}>
            <div style={{fontSize:15,fontWeight:700,color:"white",marginBottom:14}}>{t.histTitle}</div>
            {history.length===0
              ?<div style={{color:"var(--muted2)",fontSize:13,textAlign:"center",padding:28}}>{t.histEmpty}</div>
              :<div className="history-list">
                {history.map(h=>(
                  <div className="history-item" key={h.id}>
                    <span style={{fontSize:16,flexShrink:0}}>{h.sport}</span>
                    <div className="history-info">
                      <div style={{fontSize:12,fontWeight:600,color:"var(--text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{h.matches}</div>
                      <div style={{fontSize:10,color:"var(--muted2)",fontFamily:"var(--mono)",marginTop:2}}>{h.date} · {h.n||"?"} {isIt?"partite":"picks"} · {(h.risk||"balanced").toUpperCase()}</div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                      <span style={{fontFamily:"var(--mono)",fontSize:13,fontWeight:700,color:"var(--gold)"}}>{h.quota}x</span>
                      {(!h.esito||h.esito==="pending") ? (
                        <div style={{display:"flex",gap:4}}>
                          <button onClick={async()=>{
                            if(h.dbId&&user?.token) await supa.updateEsito(h.dbId,user.token,"won").catch(()=>{});
                            setHistory(prev=>prev.map(x=>x.id===h.id?{...x,esito:"won"}:x));
                          }} style={{padding:"3px 8px",borderRadius:6,background:"rgba(0,224,144,0.1)",border:"1px solid rgba(0,224,144,0.3)",color:"var(--green)",fontSize:10,fontWeight:700,cursor:"pointer"}}>✓ {isIt?"Vinta":"Won"}</button>
                          <button onClick={async()=>{
                            if(h.dbId&&user?.token) await supa.updateEsito(h.dbId,user.token,"lost").catch(()=>{});
                            setHistory(prev=>prev.map(x=>x.id===h.id?{...x,esito:"lost"}:x));
                          }} style={{padding:"3px 8px",borderRadius:6,background:"rgba(255,68,102,0.1)",border:"1px solid rgba(255,68,102,0.3)",color:"var(--red)",fontSize:10,fontWeight:700,cursor:"pointer"}}>✗ {isIt?"Persa":"Lost"}</button>
                        </div>
                      ) : (
                        <span className={"history-status "+(h.esito==="won"?"hs-won":"hs-lost")}>
                          {h.esito==="won"?(isIt?"✓ Vinta":"✓ Won"):(isIt?"✗ Persa":"✗ Lost")}
                        </span>
                      )}
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

    {/* Mobile Bottom Nav */}
    <nav className="mobile-bottom-nav">
      {t.nav.map((item,i)=>(
        <div key={i} className={"mobile-nav-item"+(activeNav===i?" active":"")} onClick={()=>setActiveNav(i)}>
          <span className="nav-icon">{t.navEmoji[i]}</span>
          <span>{item}</span>
        </div>
      ))}
    </nav>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState("it");

  useEffect(()=>{
    const session = sb.getSession();
    if(session?.access_token && session?.user) {
      sb.getProfile(session.user.id, session.access_token).then(profile=>{
        setUser({ 
          id: session.user.id, 
          name: profile?.name || session.user.email?.split("@")[0] || "User", 
          email: session.user.email, 
          plan: profile?.plan || "free", 
          token: session.access_token, 
          profile 
        });
        setPage("dashboard");
      }).catch(()=>{ sb.clearSession(); });
    }
  },[]);

  const handleLogout = async () => {
    const session = sb.getSession();
    if(session?.access_token) await sb.signOut(session.access_token).catch(()=>{});
    sb.clearSession(); setUser(null); setPage("landing");
  };

  return (
    <>
      <style>{STYLES}</style>
      {page==="landing" && <Landing onLogin={()=>setPage("auth")} lang={lang} setLang={setLang}/>}
      {page==="auth" && <Auth onSuccess={u=>{setUser(u);setPage("dashboard");}} onBack={()=>setPage("landing")} lang={lang}/>}
      {page==="dashboard" && user && <Dashboard user={user} onLogout={handleLogout} lang={lang} setLang={setLang}/>}
    </>
  );
}
