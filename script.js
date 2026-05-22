<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<title>LYL-FX Bot | SMC Auto Trader</title>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=JetBrains+Mono:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root{
  --gold:#C9A84C;--gold-l:#E8C96A;--gold-d:#8B6914;--gold-pale:#F5E6B8;
  --black:#000;--b1:#0A0A0A;--b2:#111;--b3:#161616;--b4:#1C1C1C;--b5:#222;
  --border:#2A2A2A;--white:#FFF;--off:#F0EDE8;--muted:#888;
  --green:#27AE60;--green-l:#2ECC71;--red:#C0392B;--red-l:#E74C3C;
  --blue:#2980B9;--purple:#8E44AD;
  --font-d:'Cinzel',serif;--font-m:'JetBrains Mono',monospace;--font-b:'Inter',sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:var(--font-b);background:var(--b1);color:var(--off);min-height:100vh;overflow-x:hidden;}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:var(--black);}
::-webkit-scrollbar-thumb{background:var(--gold-d);border-radius:3px;}
body::before{content:'';position:fixed;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,var(--gold),var(--gold-l),var(--gold),transparent);z-index:9999;}

/* ══ TOPBAR ══ */
.topbar{position:fixed;top:2px;left:0;right:0;height:58px;background:rgba(0,0,0,0.97);
  border-bottom:1px solid var(--border);z-index:998;display:flex;align-items:center;
  padding:0 1.2rem;gap:1rem;backdrop-filter:blur(20px);}
.logo-wrap{display:flex;align-items:center;gap:.6rem;flex-shrink:0;}
.logo-img{width:38px;height:38px;border-radius:4px;overflow:hidden;border:1px solid rgba(201,168,76,.5);background:#000;}
.logo-img img{width:100%;height:100%;object-fit:contain;display:block;}
.logo-text{font-family:var(--font-d);font-size:.9rem;color:var(--gold);letter-spacing:.12em;font-weight:700;white-space:nowrap;}
.logo-text span{color:var(--off);}
.logo-sub{font-family:var(--font-m);font-size:.42rem;letter-spacing:.15em;color:var(--muted);text-transform:uppercase;margin-top:1px;}
.topbar-status{display:flex;align-items:center;gap:.5rem;margin-left:auto;flex-wrap:wrap;}
.status-dot{width:8px;height:8px;border-radius:50%;background:var(--muted);flex-shrink:0;transition:all .3s;}
.status-dot.connected{background:var(--green);box-shadow:0 0 8px var(--green);}
.status-dot.trading{background:var(--gold);box-shadow:0 0 8px var(--gold);animation:pulse 1s infinite;}
.status-dot.error{background:var(--red);box-shadow:0 0 8px var(--red);}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
.status-txt{font-family:var(--font-m);font-size:.62rem;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;}
.bot-toggle{display:flex;align-items:center;gap:.5rem;padding:.35rem .8rem;border-radius:2px;
  font-family:var(--font-d);font-size:.58rem;letter-spacing:.12em;text-transform:uppercase;
  cursor:pointer;border:none;transition:all .2s;font-weight:700;}
.bot-toggle.start{background:linear-gradient(135deg,var(--gold-d),var(--gold));color:var(--black);}
.bot-toggle.stop{background:var(--red);color:#fff;}
.bot-toggle:hover{filter:brightness(1.15);}
.emergency-btn{background:var(--red);color:#fff;border:none;padding:.35rem .7rem;border-radius:2px;
  font-family:var(--font-m);font-size:.58rem;letter-spacing:.08em;cursor:pointer;text-transform:uppercase;
  transition:all .2s;}
.emergency-btn:hover{background:#a93226;}

/* ══ LAYOUT ══ */
.app{display:grid;grid-template-columns:280px 1fr;grid-template-rows:auto;min-height:100vh;padding-top:60px;}
@media(max-width:900px){.app{grid-template-columns:1fr;}}
.sidebar{background:var(--b2);border-right:1px solid var(--border);padding:1.2rem;display:flex;flex-direction:column;gap:1rem;min-height:calc(100vh - 60px);}
.main{padding:1.2rem;display:flex;flex-direction:column;gap:1rem;overflow-y:auto;}

/* ══ PANELS ══ */
.panel{background:var(--b2);border:1px solid var(--border);border-radius:2px;overflow:hidden;}
.panel-head{background:var(--b3);padding:.7rem 1rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);}
.panel-title{font-family:var(--font-d);font-size:.72rem;letter-spacing:.15em;text-transform:uppercase;color:var(--gold);font-weight:600;}
.panel-badge{font-family:var(--font-m);font-size:.56rem;letter-spacing:.1em;text-transform:uppercase;padding:.2rem .5rem;border-radius:1px;}
.panel-body{padding:1rem;}

/* ══ CONNECTION FORM ══ */
.conn-tabs{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid var(--border);}
.conn-tab{padding:.65rem;font-family:var(--font-d);font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;
  color:var(--muted);cursor:pointer;text-align:center;transition:all .2s;border:none;background:transparent;}
.conn-tab.active{color:var(--gold);background:rgba(201,168,76,.06);border-bottom:2px solid var(--gold);}
.conn-tab:hover:not(.active){color:var(--off);background:rgba(255,255,255,.03);}
.broker-content{display:none;padding:1rem;}
.broker-content.active{display:block;}
.form-group{margin-bottom:.8rem;}
.form-label{font-family:var(--font-m);font-size:.6rem;letter-spacing:.12em;color:var(--muted);
  text-transform:uppercase;margin-bottom:.35rem;display:block;}
.form-input{width:100%;background:var(--b4);border:1px solid var(--border);border-radius:2px;
  padding:.55rem .75rem;font-family:var(--font-m);font-size:.78rem;color:var(--off);
  outline:none;transition:border-color .2s;}
.form-input:focus{border-color:var(--gold-d);}
.form-input::placeholder{color:#444;}
.form-select{width:100%;background:var(--b4);border:1px solid var(--border);border-radius:2px;
  padding:.55rem .75rem;font-family:var(--font-m);font-size:.78rem;color:var(--off);
  outline:none;cursor:pointer;appearance:none;-webkit-appearance:none;}
.form-select option{background:var(--b2);}
.connect-btn{width:100%;background:linear-gradient(135deg,var(--gold-d),var(--gold));
  color:var(--black);border:none;padding:.7rem;font-family:var(--font-d);font-size:.7rem;
  letter-spacing:.15em;text-transform:uppercase;font-weight:700;cursor:pointer;border-radius:2px;
  transition:all .2s;margin-top:.5rem;}
.connect-btn:hover{filter:brightness(1.1);}
.connect-btn:disabled{opacity:.4;cursor:not-allowed;}
.conn-note{font-family:var(--font-m);font-size:.58rem;color:var(--muted);line-height:1.6;margin-top:.6rem;
  border-left:2px solid var(--gold-d);padding-left:.6rem;}
.conn-note a{color:var(--gold);text-decoration:none;}
.conn-note a:hover{text-decoration:underline;}

/* ══ BOT CONFIG ══ */
.config-row{display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin-bottom:.6rem;}
.config-row.single{grid-template-columns:1fr;}
.param-box{background:var(--b3);border:1px solid var(--border);padding:.6rem .8rem;border-radius:2px;}
.param-label{font-family:var(--font-m);font-size:.56rem;letter-spacing:.1em;color:var(--muted);
  text-transform:uppercase;margin-bottom:.3rem;}
.param-val{font-family:var(--font-d);font-size:.95rem;color:var(--gold);font-weight:600;}
.param-val.green{color:var(--green);}
.param-val.red{color:var(--red);}
.range-wrap{display:flex;flex-direction:column;gap:.3rem;}
.range-row{display:flex;justify-content:space-between;align-items:center;}
.range-label{font-family:var(--font-m);font-size:.6rem;color:var(--muted);}
.range-num{font-family:var(--font-m);font-size:.7rem;color:var(--gold);}
input[type=range]{width:100%;height:4px;background:var(--border);border-radius:2px;
  outline:none;cursor:pointer;accent-color:var(--gold);}

/* ══ STATS GRID ══ */
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:.8rem;}
@media(max-width:700px){.stats-row{grid-template-columns:repeat(2,1fr);}}
.stat-card{background:var(--b2);border:1px solid var(--border);padding:.9rem 1rem;border-radius:2px;
  position:relative;overflow:hidden;}
.stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,var(--gold-d),var(--gold),transparent);}
.stat-lbl{font-family:var(--font-m);font-size:.58rem;letter-spacing:.12em;color:var(--muted);
  text-transform:uppercase;margin-bottom:.4rem;}
.stat-val{font-family:var(--font-d);font-size:1.4rem;font-weight:700;color:var(--gold);}
.stat-val.green{color:var(--green-l);}
.stat-val.red{color:var(--red-l);}
.stat-change{font-family:var(--font-m);font-size:.6rem;margin-top:.2rem;}
.stat-change.up{color:var(--green);}
.stat-change.dn{color:var(--red);}

/* ══ CHART AREA ══ */
.chart-wrap{background:var(--b2);border:1px solid var(--border);border-radius:2px;overflow:hidden;}
.chart-topbar{background:var(--b3);padding:.6rem 1rem;display:flex;align-items:center;gap:1rem;
  border-bottom:1px solid var(--border);flex-wrap:wrap;}
.chart-symbol{font-family:var(--font-d);font-size:.85rem;color:var(--gold);font-weight:700;letter-spacing:.05em;}
.chart-price{font-family:var(--font-m);font-size:.9rem;color:var(--off);}
.chart-change-up{font-family:var(--font-m);font-size:.72rem;color:var(--green);}
.chart-change-dn{font-family:var(--font-m);font-size:.72rem;color:var(--red);}
.tf-btns{display:flex;gap:.3rem;margin-left:auto;}
.tf-btn{background:transparent;border:1px solid var(--border);color:var(--muted);
  font-family:var(--font-m);font-size:.6rem;padding:.25rem .55rem;cursor:pointer;border-radius:1px;
  transition:all .2s;text-transform:uppercase;letter-spacing:.08em;}
.tf-btn.active,.tf-btn:hover{border-color:var(--gold-d);color:var(--gold);background:rgba(201,168,76,.06);}
.chart-canvas-wrap{position:relative;height:320px;background:var(--b1);}
canvas#mainChart{width:100%;height:100%;}
.chart-overlay{position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;}
/* SMC Annotations on chart */
.smc-tag{position:absolute;font-family:var(--font-m);font-size:.58rem;padding:.15rem .4rem;border-radius:1px;letter-spacing:.06em;}
.smc-tag.ob{background:rgba(201,168,76,.18);border:1px solid var(--gold-d);color:var(--gold);}
.smc-tag.fib{background:rgba(41,128,185,.18);border:1px solid #2980B9;color:#64B5F6;}
.smc-tag.choch{background:rgba(230,126,34,.18);border:1px solid #E67E22;color:#FFA726;}
.smc-tag.bos-bull{background:rgba(39,174,96,.18);border:1px solid var(--green);color:var(--green);}
.smc-tag.bos-bear{background:rgba(192,57,43,.18);border:1px solid var(--red);color:var(--red-l);}

/* ══ TRADES TABLE ══ */
.trades-table{width:100%;border-collapse:collapse;font-size:.78rem;}
.trades-table th{font-family:var(--font-m);font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;
  color:var(--gold);padding:.5rem .75rem;border-bottom:1px solid var(--gold-d);text-align:left;
  background:rgba(201,168,76,.05);}
.trades-table td{padding:.55rem .75rem;border-bottom:1px solid var(--border);font-family:var(--font-m);
  font-size:.7rem;color:var(--muted);}
.trades-table tr:hover td{background:rgba(255,255,255,.02);}
.trade-buy{color:var(--green);font-weight:600;}
.trade-sell{color:var(--red-l);font-weight:600;}
.trade-pnl-pos{color:var(--green);}
.trade-pnl-neg{color:var(--red-l);}
.badge{display:inline-block;padding:.18rem .5rem;border-radius:1px;font-family:var(--font-m);
  font-size:.56rem;letter-spacing:.08em;text-transform:uppercase;}
.badge-open{background:rgba(201,168,76,.15);border:1px solid var(--gold-d);color:var(--gold);}
.badge-closed{background:rgba(39,174,96,.12);border:1px solid var(--green);color:var(--green);}
.badge-pending{background:rgba(41,128,185,.12);border:1px solid var(--blue);color:#64B5F6;}
.badge-sl{background:rgba(192,57,43,.12);border:1px solid var(--red);color:var(--red-l);}

/* ══ LOG ══ */
.log-wrap{background:var(--black);border:1px solid var(--border);border-radius:2px;
  height:180px;overflow-y:auto;padding:.75rem;font-family:var(--font-m);font-size:.65rem;line-height:1.7;}
.log-line{margin-bottom:.2rem;display:flex;gap:.6rem;}
.log-time{color:#444;flex-shrink:0;}
.log-info{color:var(--muted);}
.log-success{color:var(--green);}
.log-warn{color:var(--gold);}
.log-error{color:var(--red-l);}
.log-trade{color:var(--gold-l);}

/* ══ SIGNAL PANEL ══ */
.signal-wrap{display:flex;flex-direction:column;gap:.5rem;}
.signal-card{background:var(--b3);border:1px solid var(--border);border-radius:2px;
  padding:.75rem 1rem;display:flex;align-items:center;gap:.8rem;transition:border-color .3s;}
.signal-card.bullish{border-left:3px solid var(--green);}
.signal-card.bearish{border-left:3px solid var(--red);}
.signal-card.neutral{border-left:3px solid var(--muted);}
.signal-icon{font-size:1.3rem;flex-shrink:0;}
.signal-info{flex:1;}
.signal-pair{font-family:var(--font-d);font-size:.78rem;color:var(--off);font-weight:600;letter-spacing:.05em;}
.signal-detail{font-family:var(--font-m);font-size:.62rem;color:var(--muted);margin-top:.2rem;}
.signal-conf{font-family:var(--font-d);font-size:.95rem;font-weight:700;flex-shrink:0;}
.signal-conf.high{color:var(--green);}
.signal-conf.med{color:var(--gold);}
.signal-conf.low{color:var(--red-l);}

/* ══ FIBONACCI DISPLAY ══ */
.fib-panel{background:var(--b3);border:1px solid var(--border);border-radius:2px;padding:.75rem;}
.fib-row{display:flex;justify-content:space-between;align-items:center;padding:.3rem 0;
  border-bottom:1px solid rgba(42,42,42,.5);}
.fib-row:last-child{border-bottom:none;}
.fib-level{font-family:var(--font-m);font-size:.65rem;color:var(--muted);}
.fib-price{font-family:var(--font-m);font-size:.7rem;color:var(--off);}
.fib-label{font-family:var(--font-m);font-size:.58rem;padding:.12rem .4rem;border-radius:1px;}
.fib-ote{background:rgba(201,168,76,.2);border:1px solid var(--gold-d);color:var(--gold);}
.fib-normal{background:rgba(42,42,42,.8);color:var(--muted);}

/* ══ PERFORMANCE CHART ══ */
.perf-wrap{height:120px;position:relative;}
canvas#perfChart{width:100%;height:100%;}

/* ══ ALERTS ══ */
.alert-box{border-radius:2px;padding:.75rem 1rem;margin-bottom:.8rem;display:flex;gap:.7rem;align-items:flex-start;}
.alert-box.info{background:rgba(41,128,185,.08);border:1px solid rgba(41,128,185,.3);}
.alert-box.warning{background:rgba(230,126,34,.08);border:1px solid rgba(230,126,34,.3);}
.alert-box.success{background:rgba(39,174,96,.08);border:1px solid rgba(39,174,96,.3);}
.alert-box.danger{background:rgba(192,57,43,.08);border:1px solid rgba(192,57,43,.3);}
.alert-icon{font-size:1rem;flex-shrink:0;}
.alert-text{font-family:var(--font-m);font-size:.68rem;line-height:1.7;color:var(--off);}
.alert-text strong{font-weight:600;}

/* ══ MOBILE ══ */
@media(max-width:900px){
  .app{grid-template-columns:1fr;padding-top:58px;}
  .sidebar{min-height:auto;border-right:none;border-bottom:1px solid var(--border);}
  .stats-row{grid-template-columns:repeat(2,1fr);}
  .tf-btns{margin-left:0;}
  .topbar{padding:0 .8rem;gap:.5rem;}
  .logo-text{font-size:.75rem;}
  .bot-toggle,.emergency-btn{font-size:.52rem;padding:.3rem .6rem;}
}
@media(max-width:480px){
  .stats-row{grid-template-columns:repeat(2,1fr);}
  .chart-canvas-wrap{height:220px;}
}

/* ══ SPINNER ══ */
.spinner{width:16px;height:16px;border:2px solid rgba(201,168,76,.2);border-top-color:var(--gold);
  border-radius:50%;animation:spin .6s linear infinite;display:inline-block;vertical-align:middle;margin-right:.4rem;}
@keyframes spin{to{transform:rotate(360deg);}}

/* ══ MODAL ══ */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9998;display:none;
  align-items:center;justify-content:center;backdrop-filter:blur(8px);}
.modal-overlay.show{display:flex;}
.modal-box{background:var(--b2);border:1px solid var(--border);border-top:3px solid var(--gold);
  max-width:480px;width:90%;padding:2rem;border-radius:2px;}
.modal-title{font-family:var(--font-d);font-size:1.1rem;color:var(--gold);margin-bottom:.5rem;font-weight:700;}
.modal-body{font-family:var(--font-m);font-size:.72rem;color:var(--muted);line-height:1.8;margin-bottom:1.5rem;}
.modal-body ol{padding-left:1.2rem;}
.modal-body li{margin-bottom:.4rem;}
.modal-body a{color:var(--gold);}
.modal-btns{display:flex;gap:.8rem;justify-content:flex-end;}
.modal-btn{padding:.6rem 1.4rem;border-radius:2px;font-family:var(--font-d);font-size:.65rem;
  letter-spacing:.1em;text-transform:uppercase;font-weight:700;cursor:pointer;border:none;transition:all .2s;}
.modal-btn.primary{background:linear-gradient(135deg,var(--gold-d),var(--gold));color:var(--black);}
.modal-btn.secondary{background:transparent;border:1px solid var(--border);color:var(--muted);}
.modal-btn:hover{filter:brightness(1.1);}

/* DIVIDER */
.divider{height:1px;background:linear-gradient(90deg,transparent,var(--gold-d),transparent);margin:.5rem 0;}
</style>
</head>
<body>

<!-- ══ TOPBAR ══ -->
<nav class="topbar">
  <div class="logo-wrap">
    <div class="logo-img"><img src="data:image/jpeg;base64,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" alt="LYL-FX"></div>
    <div>
      <div class="logo-text">LYL<span>-FX</span></div>
      <div class="logo-sub">SMC Auto Trader</div>
    </div>
  </div>

  <div class="topbar-status">
    <div class="status-dot" id="connDot"></div>
    <span class="status-txt" id="connTxt">Déconnecté</span>
    <div class="divider" style="width:1px;height:20px;background:var(--border);margin:0 .3rem;"></div>
    <button class="bot-toggle start" id="botToggle" onclick="toggleBot()">▶ Démarrer Bot</button>
    <button class="emergency-btn" onclick="emergencyStop()" title="Fermer toutes les positions">⛔ STOP</button>
  </div>
</nav>

<!-- ══ MAIN APP ══ -->
<div class="app">

<!-- ══ SIDEBAR ══ -->
<aside class="sidebar">

  <!-- CONNECTION -->
  <div class="panel">
    <div class="panel-head">
      <span class="panel-title">🔗 Connexion Broker</span>
      <span class="panel-badge" id="connBadge" style="background:rgba(136,136,128,.15);border:1px solid var(--border);color:var(--muted);">HORS LIGNE</span>
    </div>
    <div class="conn-tabs">
      <button class="conn-tab active" onclick="switchBroker('deriv')" id="tab-deriv">Deriv</button>
      <button class="conn-tab" onclick="switchBroker('exness')" id="tab-exness">Exness</button>
    </div>

    <!-- DERIV -->
    <div class="broker-content active" id="broker-deriv">
      <div class="alert-box info">
        <span class="alert-icon">ℹ️</span>
        <div class="alert-text">Deriv offre une <strong>API publique WebSocket</strong> gratuite. Générez votre token API depuis votre compte Deriv.</div>
      </div>
      <div class="form-group">
        <label class="form-label">API Token Deriv</label>
        <input type="password" class="form-input" id="derivToken" placeholder="Votre token API Deriv">
      </div>
      <div class="form-group">
        <label class="form-label">Type de Compte</label>
        <select class="form-select" id="derivAccType">
          <option value="demo">💡 Compte Démo</option>
          <option value="real">💰 Compte Réel</option>
        </select>
      </div>
      <button class="connect-btn" id="connectDerivBtn" onclick="connectDeriv()">Connexion Deriv</button>
      <div class="conn-note">
        1. Allez sur <a href="https://app.deriv.com/account/api-token" target="_blank">app.deriv.com/account/api-token</a><br>
        2. Créez un token avec droits <strong>Read + Trade</strong><br>
        3. Copiez et collez le token ci-dessus<br>
        ⚠️ Votre token ne quitte pas votre appareil
      </div>
    </div>

    <!-- EXNESS -->
    <div class="broker-content" id="broker-exness">
      <div class="alert-box warning">
        <span class="alert-icon">⚠️</span>
        <div class="alert-text">Exness nécessite l'<strong>API MetaTrader 5</strong>. Utilisez votre numéro de compte MT5 + mot de passe + serveur Exness.</div>
      </div>
      <div class="form-group">
        <label class="form-label">Numéro Compte MT5</label>
        <input type="text" class="form-input" id="exnessLogin" placeholder="Ex: 12345678">
      </div>
      <div class="form-group">
        <label class="form-label">Mot de Passe Investisseur</label>
        <input type="password" class="form-input" id="exnessPass" placeholder="Mot de passe MT5">
      </div>
      <div class="form-group">
        <label class="form-label">Serveur Exness</label>
        <select class="form-select" id="exnessServer">
          <option value="Exness-MT5Trial">Exness-MT5Trial (Démo)</option>
          <option value="Exness-MT5Real">Exness-MT5Real (Réel)</option>
          <option value="Exness-MT5Real2">Exness-MT5Real2</option>
        </select>
      </div>
      <button class="connect-btn" id="connectExnessBtn" onclick="connectExness()">Connexion Exness MT5</button>
      <div class="conn-note">
        Via <strong>MetaAPI.cloud</strong> (connexion sécurisée MT5).<br>
        Ne jamais partager votre mot de passe principal.<br>
        Utilisez uniquement le <strong>mot de passe investisseur</strong> (lecture seule) ou créez un sous-compte dédié.
      </div>
    </div>
  </div>

  <!-- ACCOUNT INFO -->
  <div class="panel" id="accountPanel" style="display:none;">
    <div class="panel-head">
      <span class="panel-title">👤 Compte</span>
      <span class="panel-badge badge-open" id="accTypeBadge">DEMO</span>
    </div>
    <div class="panel-body">
      <div class="config-row">
        <div class="param-box">
          <div class="param-label">Solde</div>
          <div class="param-val" id="accBalance">$0.00</div>
        </div>
        <div class="param-box">
          <div class="param-label">Équité</div>
          <div class="param-val" id="accEquity">$0.00</div>
        </div>
      </div>
      <div class="config-row">
        <div class="param-box">
          <div class="param-label">Marge Libre</div>
          <div class="param-val" id="accFreeMargin">$0.00</div>
        </div>
        <div class="param-box">
          <div class="param-label">P&amp;L Ouvert</div>
          <div class="param-val" id="accPnl">$0.00</div>
        </div>
      </div>
    </div>
  </div>

  <!-- BOT CONFIG -->
  <div class="panel">
    <div class="panel-head">
      <span class="panel-title">⚙️ Configuration SMC</span>
    </div>
    <div class="panel-body">
      <div class="form-group">
        <label class="form-label">Paire de Trading</label>
        <select class="form-select" id="tradePair" onchange="updatePair()">
          <optgroup label="Forex Majeurs">
            <option value="R_10">Volatility 10 Index (Deriv)</option>
            <option value="R_25">Volatility 25 Index (Deriv)</option>
            <option value="R_50">Volatility 50 Index (Deriv)</option>
            <option value="frxEURUSD">EUR/USD</option>
            <option value="frxGBPUSD">GBP/USD</option>
            <option value="frxUSDJPY">USD/JPY</option>
            <option value="frxXAUUSD">XAU/USD (Or)</option>
          </optgroup>
          <optgroup label="Crypto">
            <option value="cryBTCUSD">BTC/USD</option>
            <option value="cryETHUSD">ETH/USD</option>
          </optgroup>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Timeframe d'Analyse</label>
        <select class="form-select" id="tfSelect">
          <option value="60">M1 (1 Minute) — Scalping Ultra</option>
          <option value="300" selected>M5 (5 Minutes) — Scalping Standard</option>
          <option value="900">M15 (15 Minutes) — Scalping Swing</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Risque par Trade</label>
        <div class="range-wrap">
          <div class="range-row">
            <span class="range-label">0.5%</span>
            <span class="range-num" id="riskPct">1%</span>
            <span class="range-label">3%</span>
          </div>
          <input type="range" min="0.5" max="3" step="0.5" value="1" id="riskRange" oninput="updateRisk(this.value)">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Risk:Reward Cible</label>
        <select class="form-select" id="rrSelect">
          <option value="2">1:2 (Conservateur)</option>
          <option value="3" selected>1:3 (Recommandé SMC)</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Seuil de Confiance Min.</label>
        <div class="range-wrap">
          <div class="range-row">
            <span class="range-label">60%</span>
            <span class="range-num" id="confPct">75%</span>
            <span class="range-label">95%</span>
          </div>
          <input type="range" min="60" max="95" step="5" value="75" id="confRange" oninput="updateConf(this.value)">
        </div>
      </div>

      <div class="config-row">
        <div class="param-box">
          <div class="param-label">Trades Max/Jour</div>
          <input type="number" class="form-input" value="5" min="1" max="20" id="maxTrades" style="margin-top:.3rem;">
        </div>
        <div class="param-box">
          <div class="param-label">Perte Max/Jour $</div>
          <input type="number" class="form-input" value="2" min="0.5" step="0.5" id="maxLoss" style="margin-top:.3rem;">
        </div>
      </div>
    </div>
  </div>

  <!-- SMC STRATEGY INFO -->
  <div class="panel">
    <div class="panel-head">
      <span class="panel-title">📐 Stratégie SMC Active</span>
    </div>
    <div class="panel-body" style="font-family:var(--font-m);font-size:.65rem;line-height:1.9;color:var(--muted);">
      <div style="color:var(--gold);font-weight:600;margin-bottom:.5rem;">LOGIQUE D'ENTRÉE LYL-FX :</div>
      <div>① Détecter le 1er <span style="color:#FFA726;">CHoCH</span> (haussier/baissier)</div>
      <div>② Tracer Fibonacci sur le CHoCH</div>
      <div>③ <span style="color:var(--green);">BUY</span> si BOS baissier cassé (tendance ↑)</div>
      <div>④ <span style="color:var(--red-l);">SELL</span> si BOS haussier cassé (tendance ↓)</div>
      <div>⑤ Entrée dans la zone <span style="color:var(--gold);">OTE (61.8–79%)</span></div>
      <div>⑥ SL sous/sur l'OB le plus proche</div>
      <div>⑦ TP = <span style="color:var(--gold);">R:R 1:2 ou 1:3</span></div>
      <div style="margin-top:.5rem;color:#444;">───────────────────</div>
      <div>Confirmations requises :</div>
      <div>• BOS confirmé sur TF actif</div>
      <div>• CHoCH validé + FVG identifié</div>
      <div>• Confluence ≥ <span id="confDisplay" style="color:var(--gold);">75%</span></div>
    </div>
  </div>

</aside>

<!-- ══ MAIN CONTENT ══ -->
<main class="main">

  <!-- STATS ROW -->
  <div class="stats-row">
    <div class="stat-card">
      <div class="stat-lbl">P&amp;L Total</div>
      <div class="stat-val" id="totalPnl">$0.00</div>
      <div class="stat-change" id="pnlChange">-- session</div>
    </div>
    <div class="stat-card">
      <div class="stat-lbl">Win Rate</div>
      <div class="stat-val green" id="winRate">--%</div>
      <div class="stat-change up" id="winRateDetail">0W / 0L</div>
    </div>
    <div class="stat-card">
      <div class="stat-lbl">Trades Ouverts</div>
      <div class="stat-val" id="openTrades">0</div>
      <div class="stat-change" id="openDetail">0 en attente</div>
    </div>
    <div class="stat-card">
      <div class="stat-lbl">Signaux Détectés</div>
      <div class="stat-val" id="signalCount">0</div>
      <div class="stat-change" id="signalDetail">Analyse en cours...</div>
    </div>
  </div>

  <!-- CHART -->
  <div class="chart-wrap">
    <div class="chart-topbar">
      <div>
        <div class="chart-symbol" id="chartSymbol">EUR/USD</div>
        <div class="chart-price" id="chartPrice">---.-----</div>
      </div>
      <div id="chartChange" class="chart-change-up">+0.00%</div>
      <div style="font-family:var(--font-m);font-size:.6rem;color:var(--muted);" id="chartSpread">Spread: --</div>
      <div class="tf-btns">
        <button class="tf-btn active" onclick="switchTF(60,this)">M1</button>
        <button class="tf-btn" onclick="switchTF(300,this)">M5</button>
        <button class="tf-btn" onclick="switchTF(900,this)">M15</button>
      </div>
    </div>
    <div class="chart-canvas-wrap">
      <canvas id="mainChart"></canvas>
      <!-- SMC Annotations -->
      <div class="chart-overlay" id="chartOverlay"></div>
    </div>
    <!-- Fibonacci Panel -->
    <div style="padding:.8rem 1rem;border-top:1px solid var(--border);">
      <div style="font-family:var(--font-m);font-size:.6rem;letter-spacing:.12em;color:var(--gold);text-transform:uppercase;margin-bottom:.6rem;">
        📐 Niveaux Fibonacci — Zone OTE Active
      </div>
      <div id="fibPanel" class="fib-panel">
        <div class="fib-row"><span class="fib-level">0.0%</span><span class="fib-price" id="fib0">---</span><span class="fib-label fib-normal">Bas du Swing</span></div>
        <div class="fib-row"><span class="fib-level">23.6%</span><span class="fib-price" id="fib236">---</span><span class="fib-label fib-normal">Zone 1</span></div>
        <div class="fib-row"><span class="fib-level">38.2%</span><span class="fib-price" id="fib382">---</span><span class="fib-label fib-normal">Zone 2</span></div>
        <div class="fib-row"><span class="fib-level">50.0%</span><span class="fib-price" id="fib500">---</span><span class="fib-label fib-normal">Équilibre</span></div>
        <div class="fib-row"><span class="fib-level">61.8%</span><span class="fib-price" id="fib618">---</span><span class="fib-label fib-ote">OTE Début ★</span></div>
        <div class="fib-row"><span class="fib-level">70.5%</span><span class="fib-price" id="fib705">---</span><span class="fib-label fib-ote">OTE Optimal ★★</span></div>
        <div class="fib-row"><span class="fib-level">79.0%</span><span class="fib-price" id="fib790">---</span><span class="fib-label fib-ote">OTE Fin ★</span></div>
        <div class="fib-row"><span class="fib-level">100%</span><span class="fib-price" id="fib100">---</span><span class="fib-label fib-normal">Haut du Swing</span></div>
      </div>
    </div>
  </div>

  <!-- GRID: Signals + Performance -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">

    <!-- SIGNALS -->
    <div class="panel">
      <div class="panel-head">
        <span class="panel-title">📡 Signaux SMC</span>
        <span class="panel-badge" id="signalBadgeCount" style="background:rgba(201,168,76,.1);border:1px solid var(--gold-d);color:var(--gold);">0 actifs</span>
      </div>
      <div class="panel-body">
        <div class="signal-wrap" id="signalList">
          <div class="signal-card neutral">
            <span class="signal-icon">🔍</span>
            <div class="signal-info">
              <div class="signal-pair">En attente de connexion...</div>
              <div class="signal-detail">Connectez-vous à un broker pour démarrer l'analyse</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PERFORMANCE -->
    <div class="panel">
      <div class="panel-head">
        <span class="panel-title">📈 Performance</span>
        <span class="panel-badge badge-open" id="sessionBadge">SESSION 0</span>
      </div>
      <div class="panel-body">
        <div class="config-row" style="margin-bottom:.8rem;">
          <div class="param-box">
            <div class="param-label">Meilleur Trade</div>
            <div class="param-val green" id="bestTrade">$0.00</div>
          </div>
          <div class="param-box">
            <div class="param-label">Pire Trade</div>
            <div class="param-val red" id="worstTrade">$0.00</div>
          </div>
        </div>
        <div class="perf-wrap">
          <canvas id="perfChart"></canvas>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:.6rem;">
          <span style="font-family:var(--font-m);font-size:.62rem;color:var(--muted);">Facteur de Profit: <span id="profitFactor" style="color:var(--gold);">--</span></span>
          <span style="font-family:var(--font-m);font-size:.62rem;color:var(--muted);">Sharpe: <span id="sharpeRatio" style="color:var(--gold);">--</span></span>
          <span style="font-family:var(--font-m);font-size:.62rem;color:var(--muted);">Drawdown: <span id="maxDrawdown" style="color:var(--red-l);">0%</span></span>
        </div>
      </div>
    </div>
  </div>

  <!-- TRADES TABLE -->
  <div class="panel">
    <div class="panel-head">
      <span class="panel-title">📋 Historique des Trades</span>
      <button onclick="clearTrades()" style="background:transparent;border:1px solid var(--border);color:var(--muted);font-family:var(--font-m);font-size:.58rem;padding:.2rem .5rem;cursor:pointer;border-radius:1px;letter-spacing:.08em;">Effacer</button>
    </div>
    <div style="overflow-x:auto;">
      <table class="trades-table">
        <thead>
          <tr>
            <th>#</th><th>Heure</th><th>Paire</th><th>Dir.</th><th>TF</th>
            <th>Entrée</th><th>SL</th><th>TP</th><th>Lot</th><th>P&amp;L</th>
            <th>Conf.</th><th>Status</th>
          </tr>
        </thead>
        <tbody id="tradesBody">
          <tr><td colspan="12" style="text-align:center;color:var(--muted);font-family:var(--font-m);font-size:.65rem;padding:1.5rem;">Aucun trade — démarrez le bot pour analyser les marchés</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- LOG -->
  <div class="panel">
    <div class="panel-head">
      <span class="panel-title">📟 Journal du Bot</span>
      <button onclick="clearLog()" style="background:transparent;border:1px solid var(--border);color:var(--muted);font-family:var(--font-m);font-size:.58rem;padding:.2rem .5rem;cursor:pointer;border-radius:1px;letter-spacing:.08em;">Vider</button>
    </div>
    <div class="panel-body" style="padding:.5rem;">
      <div class="log-wrap" id="logWrap">
        <div class="log-line"><span class="log-time">00:00:00</span><span class="log-info">LYL-FX SMC Bot v2.0 initialisé — Stratégie CHoCH + FVG + OTE active</span></div>
        <div class="log-line"><span class="log-time">00:00:00</span><span class="log-warn">⚠ Connectez-vous à Deriv ou Exness pour commencer le trading automatique</span></div>
      </div>
    </div>
  </div>

</main>
</div>

<!-- ══ API TOKEN MODAL ══ -->
<div class="modal-overlay" id="apiModal">
  <div class="modal-box">
    <div class="modal-title">🔑 Comment Obtenir votre Token Deriv</div>
    <div class="modal-body">
      <ol>
        <li>Créez un compte sur <a href="https://deriv.com" target="_blank">deriv.com</a> (gratuit, démo disponible)</li>
        <li>Allez dans <strong>Paramètres → Sécurité → Tokens API</strong></li>
        <li>Cliquez <strong>"Créer un token"</strong></li>
        <li>Cochez les droits : <strong>Read + Trade + Payments</strong></li>
        <li>Nommez-le "LYL-FX Bot" et copiez le token</li>
        <li>Collez-le dans le champ "API Token Deriv"</li>
      </ol>
      <br>
      <div class="alert-box success">
        <span class="alert-icon">✅</span>
        <div class="alert-text"><strong>Sécurité :</strong> Votre token est stocké uniquement dans votre navigateur (localStorage). Il n'est jamais envoyé à un serveur tiers.</div>
      </div>
    </div>
    <div class="modal-btns">
      <button class="modal-btn secondary" onclick="closeModal('apiModal')">Fermer</button>
      <button class="modal-btn primary" onclick="window.open('https://app.deriv.com/account/api-token','_blank')">Ouvrir Deriv →</button>
    </div>
  </div>
</div>

<!-- ══ TRADE CONFIRM MODAL ══ -->
<div class="modal-overlay" id="tradeModal">
  <div class="modal-box">
    <div class="modal-title" id="tradeModalTitle">⚡ Signal Détecté — Confirmation</div>
    <div class="modal-body" id="tradeModalBody"></div>
    <div class="modal-btns">
      <button class="modal-btn secondary" onclick="closeModal('tradeModal')">Ignorer</button>
      <button class="modal-btn primary" onclick="confirmTrade()" id="confirmTradeBtn">Exécuter Trade</button>
    </div>
  </div>
</div>

<script>
// ═══════════════════════════════════════════════════════════
// LYL-FX SMC BOT — CORE ENGINE v2.0
// Stratégie: CHoCH + Fibonacci OTE + BOS + Order Block
// ═══════════════════════════════════════════════════════════

// ── STATE ──────────────────────────────────────────────────
const BOT = {
  connected: false, running: false, broker: 'deriv',
  ws: null, token: '', accountId: '', accType: 'demo',
  pair: 'frxEURUSD', tf: 300, risk: 1, rr: 3, confMin: 75,
  balance: 0, equity: 0, freeMargin: 0,
  trades: [], openTrades: [], signals: [],
  stats: { wins: 0, losses: 0, totalPnl: 0, best: 0, worst: 0, tradeNum: 0 },
  perfData: [], analysisInterval: null, tickInterval: null,
  currentPrice: 0, prevPrice: 0, priceHistory: [],
  swingHigh: 0, swingLow: 0, chochDetected: false,
  chochDir: null, bosLevel: 0, fibLevels: {},
  pendingTrade: null, dailyLoss: 0, dailyTrades: 0,
  lastCandles: [], tickBuffer: [], lastTick: 0
};

// ── CANDLE CHART ───────────────────────────────────────────
let chartCtx, perfCtx, animFrame;
let candles = [];
const MAX_CANDLES = 80;

function initChart() {
  const canvas = document.getElementById('mainChart');
  if (!canvas) return;
  chartCtx = canvas.getContext('2d');
  const wrap = canvas.parentElement;
  canvas.width = wrap.clientWidth || 600;
  canvas.height = wrap.clientHeight || 320;
  drawChart();
}

function generateDemoCandles(n=60, basePrice=1.08500, volatility=0.0008) {
  const c = [];
  let price = basePrice;
  for (let i = 0; i < n; i++) {
    const open = price;
    const change = (Math.random() - 0.49) * volatility;
    const close = open + change;
    const highExtra = Math.random() * volatility * 0.5;
    const lowExtra = Math.random() * volatility * 0.5;
    const high = Math.max(open, close) + highExtra;
    const low = Math.min(open, close) - lowExtra;
    c.push({ o: open, h: high, l: low, c: close, t: Date.now() - (n - i) * (BOT.tf * 1000) });
    price = close;
  }
  return c;
}

function drawChart() {
  if (!chartCtx) return;
  const cv = document.getElementById('mainChart');
  const W = cv.width, H = cv.height;
  const ctx = chartCtx;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0A0A0A';
  ctx.fillRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = 'rgba(42,42,42,0.8)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 8; i++) {
    const y = (H / 8) * i;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  for (let i = 0; i <= 10; i++) {
    const x = (W / 10) * i;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }

  if (candles.length === 0) {
    ctx.fillStyle = '#333';
    ctx.font = '13px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText('Connectez-vous pour afficher les prix en temps réel', W/2, H/2 - 10);
    ctx.fillStyle = '#C9A84C';
    ctx.fillText('LYL-FX SMC Auto Trader', W/2, H/2 + 15);
    return;
  }

  const disp = candles.slice(-MAX_CANDLES);
  const allH = disp.map(c => c.h);
  const allL = disp.map(c => c.l);
  const maxP = Math.max(...allH);
  const minP = Math.min(...allL);
  const range = maxP - minP || 0.001;
  const PAD = 30;
  const chartH = H - PAD * 2;

  const toY = p => PAD + chartH * (1 - (p - minP) / range);
  const cW = Math.max(3, (W - 20) / disp.length - 1);

  // Draw FIB zones
  if (BOT.fibLevels && BOT.fibLevels.level618) {
    const y618 = toY(BOT.fibLevels.level618);
    const y790 = toY(BOT.fibLevels.level790);
    if (!isNaN(y618) && !isNaN(y790)) {
      ctx.fillStyle = 'rgba(201,168,76,0.08)';
      ctx.fillRect(0, Math.min(y618, y790), W, Math.abs(y790 - y618));
      ctx.strokeStyle = 'rgba(201,168,76,0.4)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, y618); ctx.lineTo(W, y618); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, y790); ctx.lineTo(W, y790); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(201,168,76,0.7)';
      ctx.font = '9px JetBrains Mono';
      ctx.textAlign = 'right';
      ctx.fillText('OTE ZONE', W - 5, Math.min(y618, y790) - 3);
    }
  }

  // Draw BOS level
  if (BOT.bosLevel > 0) {
    const yBos = toY(BOT.bosLevel);
    if (!isNaN(yBos)) {
      ctx.strokeStyle = BOT.chochDir === 'bull' ? 'rgba(39,174,96,0.6)' : 'rgba(192,57,43,0.6)';
      ctx.setLineDash([6, 3]);
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, yBos); ctx.lineTo(W, yBos); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = BOT.chochDir === 'bull' ? '#27AE60' : '#E74C3C';
      ctx.font = '9px JetBrains Mono';
      ctx.textAlign = 'left';
      ctx.fillText('BOS', 5, yBos - 3);
    }
  }

  // Candles
  disp.forEach((c, i) => {
    const x = 10 + i * ((W - 20) / disp.length);
    const yO = toY(c.o), yC = toY(c.c);
    const yH = toY(c.h), yL = toY(c.l);
    const bull = c.c >= c.o;
    const col = bull ? '#27AE60' : '#C0392B';
    const colL = bull ? '#2ECC71' : '#E74C3C';

    // Wick
    ctx.strokeStyle = col;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x + cW/2, yH); ctx.lineTo(x + cW/2, yL); ctx.stroke();

    // Body
    const bodyY = Math.min(yO, yC);
    const bodyH = Math.max(1, Math.abs(yC - yO));
    ctx.fillStyle = col;
    ctx.fillRect(x, bodyY, cW, bodyH);

    // CHoCH marker
    if (BOT.chochDetected && i === disp.length - 8) {
      ctx.fillStyle = 'rgba(230,126,34,0.9)';
      ctx.font = 'bold 8px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText('CHoCH', x + cW/2, yH - 6);
    }
  });

  // Current price line
  if (BOT.currentPrice > 0) {
    const yNow = toY(BOT.currentPrice);
    ctx.strokeStyle = 'rgba(201,168,76,0.8)';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, yNow); ctx.lineTo(W, yNow); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(201,168,76,0.9)';
    ctx.font = 'bold 9px JetBrains Mono';
    ctx.textAlign = 'right';
    ctx.fillText(BOT.currentPrice.toFixed(5), W - 5, yNow - 3);
  }

  // Price scale
  ctx.fillStyle = '#444';
  ctx.font = '8px JetBrains Mono';
  ctx.textAlign = 'left';
  for (let i = 0; i <= 4; i++) {
    const p = minP + range * i / 4;
    const y = toY(p);
    ctx.fillText(p.toFixed(5), 2, y - 1);
  }
}

// ── PERFORMANCE CHART ──────────────────────────────────────
function drawPerfChart() {
  const cv = document.getElementById('perfChart');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const wrap = cv.parentElement;
  cv.width = wrap.clientWidth || 300;
  cv.height = 120;
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0D0D0D';
  ctx.fillRect(0, 0, W, H);

  const data = BOT.perfData.length > 0 ? BOT.perfData : [0];
  const maxV = Math.max(...data, 0.01);
  const minV = Math.min(...data, -0.01);
  const range = maxV - minV || 0.01;

  ctx.beginPath();
  data.forEach((v, i) => {
    const x = (i / Math.max(data.length - 1, 1)) * W;
    const y = H - ((v - minV) / range) * (H - 20) - 10;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  const lastV = data[data.length - 1];
  ctx.strokeStyle = lastV >= 0 ? '#27AE60' : '#C0392B';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Fill
  const zeroY = H - ((0 - minV) / range) * (H - 20) - 10;
  ctx.lineTo(W, zeroY); ctx.lineTo(0, zeroY); ctx.closePath();
  ctx.fillStyle = lastV >= 0 ? 'rgba(39,174,96,0.1)' : 'rgba(192,57,43,0.1)';
  ctx.fill();

  // Zero line
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(0, zeroY); ctx.lineTo(W, zeroY); ctx.stroke();
  ctx.setLineDash([]);
}

// ── DERIV WS CONNECTION ────────────────────────────────────
function connectDeriv() {
  const token = document.getElementById('derivToken').value.trim();
  if (!token) { addLog('error', '⛔ Token API vide — Cliquez sur "Connexion Deriv" après avoir entré le token'); showModal('apiModal'); return; }

  BOT.token = token;
  BOT.broker = 'deriv';
  addLog('info', '🔌 Connexion à Deriv WebSocket API...');
  document.getElementById('connectDerivBtn').disabled = true;
  document.getElementById('connectDerivBtn').innerHTML = '<span class="spinner"></span>Connexion...';

  try {
    const wsUrl = 'wss://ws.binaryws.com/websockets/v3?app_id=1089';
    BOT.ws = new WebSocket(wsUrl);

    BOT.ws.onopen = () => {
      addLog('success', '✅ WebSocket Deriv connecté');
      BOT.ws.send(JSON.stringify({ authorize: token }));
    };

    BOT.ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      handleDerivMessage(data);
    };

    BOT.ws.onerror = (err) => {
      addLog('error', '❌ Erreur WebSocket: Vérifiez votre token API');
      setConnStatus('error', 'Erreur connexion');
      document.getElementById('connectDerivBtn').disabled = false;
      document.getElementById('connectDerivBtn').innerHTML = 'Connexion Deriv';
    };

    BOT.ws.onclose = () => {
      if (BOT.connected) {
        addLog('warn', '⚠ Connexion perdue — Reconnexion automatique dans 5s...');
        setConnStatus('error', 'Déconnecté');
        BOT.connected = false;
        setTimeout(() => { if (BOT.token) connectDeriv(); }, 5000);
      }
    };
  } catch(e) {
    addLog('error', `❌ Erreur: ${e.message}`);
    document.getElementById('connectDerivBtn').disabled = false;
    document.getElementById('connectDerivBtn').innerHTML = 'Connexion Deriv';
  }
}

function handleDerivMessage(data) {
  if (data.msg_type === 'authorize') {
    if (data.error) {
      addLog('error', `❌ Auth Deriv échoué: ${data.error.message}`);
      addLog('warn', '💡 Token invalide. Générez un nouveau token sur app.deriv.com/account/api-token');
      setConnStatus('error', 'Auth échoué');
      document.getElementById('connectDerivBtn').disabled = false;
      document.getElementById('connectDerivBtn').innerHTML = 'Connexion Deriv';
      return;
    }
    const acc = data.authorize;
    BOT.connected = true;
    BOT.accountId = acc.loginid;
    BOT.balance = acc.balance;
    BOT.accType = acc.is_virtual ? 'demo' : 'real';

    setConnStatus('connected', `${BOT.accountId} — ${BOT.accType.toUpperCase()}`);
    addLog('success', `✅ Compte Deriv autorisé: ${BOT.accountId} (${BOT.accType.toUpperCase()})`);
    addLog('success', `💰 Solde: ${acc.balance} ${acc.currency}`);

    document.getElementById('accBalance').textContent = `${acc.balance} ${acc.currency}`;
    document.getElementById('accEquity').textContent = `${acc.balance} ${acc.currency}`;
    document.getElementById('accTypeBadge').textContent = BOT.accType.toUpperCase();
    document.getElementById('accountPanel').style.display = 'block';
    document.getElementById('connectDerivBtn').innerHTML = '✅ Connecté';

    // Subscribe to ticks
    subscribeDerivTicks();

    // Get account balance updates
    BOT.ws.send(JSON.stringify({ balance: 1, subscribe: 1 }));
  }

  if (data.msg_type === 'balance') {
    BOT.balance = data.balance.balance;
    document.getElementById('accBalance').textContent = `${data.balance.balance.toFixed(2)} ${data.balance.currency}`;
  }

  if (data.msg_type === 'tick') {
    const tick = data.tick;
    BOT.prevPrice = BOT.currentPrice;
    BOT.currentPrice = tick.quote;
    BOT.lastTick = tick.epoch;

    document.getElementById('chartPrice').textContent = tick.quote.toFixed(tick.quote > 100 ? 2 : 5);
    const chg = BOT.prevPrice > 0 ? ((BOT.currentPrice - BOT.prevPrice) / BOT.prevPrice * 100) : 0;
    const chgEl = document.getElementById('chartChange');
    chgEl.textContent = (chg >= 0 ? '+' : '') + chg.toFixed(4) + '%';
    chgEl.className = chg >= 0 ? 'chart-change-up' : 'chart-change-dn';

    // Add to tick buffer for candle building
    BOT.tickBuffer.push({ price: tick.quote, time: tick.epoch });
    processTicks();
    drawChart();
  }

  if (data.msg_type === 'candles') {
    if (data.candles) {
      candles = data.candles.map(c => ({ o: c.open, h: c.high, l: c.low, c: c.close, t: c.epoch * 1000 }));
      BOT.lastCandles = [...candles];
      addLog('info', `📊 ${candles.length} bougies M${BOT.tf/60} chargées`);
      drawChart();
      if (BOT.running) runSMCAnalysis();
    }
  }

  if (data.msg_type === 'ohlc') {
    const ohlc = data.ohlc;
    const newCandle = { o: ohlc.open, h: ohlc.high, l: ohlc.low, c: ohlc.close, t: ohlc.open_time * 1000 };
    if (candles.length > 0 && candles[candles.length-1].t === newCandle.t) {
      candles[candles.length-1] = newCandle;
    } else {
      candles.push(newCandle);
      if (candles.length > MAX_CANDLES + 20) candles.shift();
      if (BOT.running) runSMCAnalysis();
    }
    drawChart();
  }

  if (data.msg_type === 'buy') {
    if (data.error) {
      addLog('error', `❌ Ordre rejeté: ${data.error.message}`);
      return;
    }
    const buy = data.buy;
    addLog('trade', `✅ Ordre exécuté: ${buy.contract_type} — ${buy.buy_price} — ID: ${buy.contract_id}`);
    BOT.stats.tradeNum++;
    BOT.dailyTrades++;
  }

  if (data.msg_type === 'proposal') {
    if (data.error) { addLog('warn', `⚠ Proposition refusée: ${data.error.message}`); return; }
  }
}

function subscribeDerivTicks() {
  const pair = document.getElementById('tradePair').value;
  const tf = parseInt(document.getElementById('tfSelect').value);
  BOT.pair = pair;
  BOT.tf = tf;

  const symName = pair.replace('frx','').replace('cry','');
  document.getElementById('chartSymbol').textContent = symName;

  // Subscribe ticks
  BOT.ws.send(JSON.stringify({ ticks: pair, subscribe: 1 }));

  // Get historical candles
  BOT.ws.send(JSON.stringify({
    ticks_history: pair,
    adjust_start_time: 1,
    count: 100,
    end: 'latest',
    granularity: tf,
    start: 1,
    style: 'candles'
  }));

  // Subscribe to OHLC stream
  BOT.ws.send(JSON.stringify({
    ticks_history: pair,
    adjust_start_time: 1,
    count: 1,
    end: 'latest',
    granularity: tf,
    start: 1,
    style: 'candles',
    subscribe: 1
  }));

  addLog('info', `📡 Abonné aux ticks: ${symName} (M${tf/60})`);
}

// ── EXNESS MT5 (MetaAPI simulation) ───────────────────────
function connectExness() {
  const login = document.getElementById('exnessLogin').value.trim();
  const pass = document.getElementById('exnessPass').value.trim();
  const server = document.getElementById('exnessServer').value;
  if (!login || !pass) { addLog('error', '⛔ Login et mot de passe requis'); return; }

  addLog('info', `🔌 Connexion Exness MT5 (${server})...`);
  document.getElementById('connectExnessBtn').disabled = true;
  document.getElementById('connectExnessBtn').innerHTML = '<span class="spinner"></span>Connexion MT5...';

  // Simulate MT5 connection attempt
  setTimeout(() => {
    addLog('warn', '⚠️ Connexion MT5 nécessite MetaAPI.cloud');
    addLog('info', '💡 Pour Exness MT5 réel: créez un compte sur MetaAPI.cloud, obtenez une clé API, et utilisez leur SDK.');
    addLog('info', '✅ Mode simulation Exness activé pour démonstration');

    BOT.connected = true;
    BOT.broker = 'exness';
    BOT.balance = 10.00;
    BOT.accType = server.includes('Trial') ? 'demo' : 'real';

    setConnStatus('connected', `MT5:${login} — ${BOT.accType.toUpperCase()}`);
    document.getElementById('accBalance').textContent = '$10.00';
    document.getElementById('accEquity').textContent = '$10.00';
    document.getElementById('accFreeMargin').textContent = '$10.00';
    document.getElementById('accTypeBadge').textContent = BOT.accType.toUpperCase();
    document.getElementById('accountPanel').style.display = 'block';
    document.getElementById('connectExnessBtn').innerHTML = '✅ Simulé';

    // Start demo price simulation
    startPriceSimulation();
    candles = generateDemoCandles(80);
    drawChart();
    addLog('success', `✅ Session Exness simulée — Balance: $10.00`);
  }, 2000);
}

// ── PRICE SIMULATION (when no real WS) ────────────────────
function startPriceSimulation() {
  if (BOT.tickInterval) clearInterval(BOT.tickInterval);
  let basePrice = 1.08500;
  BOT.currentPrice = basePrice;

  BOT.tickInterval = setInterval(() => {
    const change = (Math.random() - 0.49) * 0.0003;
    BOT.prevPrice = BOT.currentPrice;
    BOT.currentPrice = Math.max(basePrice * 0.99, Math.min(basePrice * 1.01, BOT.currentPrice + change));
    basePrice += (Math.random() - 0.5) * 0.00005;

    document.getElementById('chartPrice').textContent = BOT.currentPrice.toFixed(5);

    // Update last candle
    if (candles.length > 0) {
      const lc = candles[candles.length - 1];
      lc.c = BOT.currentPrice;
      lc.h = Math.max(lc.h, BOT.currentPrice);
      lc.l = Math.min(lc.l, BOT.currentPrice);
    }

    // New candle every ~30 ticks
    if (Math.random() < 0.033) {
      candles.push({
        o: BOT.currentPrice, h: BOT.currentPrice,
        l: BOT.currentPrice, c: BOT.currentPrice,
        t: Date.now()
      });
      if (candles.length > MAX_CANDLES + 20) candles.shift();
      if (BOT.running) runSMCAnalysis();
    }
    drawChart();
    checkOpenTrades();
  }, 1000);
}

function processTicks() {
  // Build real-time candle from ticks
  if (candles.length > 0) {
    const lc = candles[candles.length - 1];
    lc.c = BOT.currentPrice;
    lc.h = Math.max(lc.h, BOT.currentPrice);
    lc.l = Math.min(lc.l, BOT.currentPrice);
  }
  checkOpenTrades();
}

// ── SMC ANALYSIS ENGINE ────────────────────────────────────
function runSMCAnalysis() {
  if (!BOT.connected || !BOT.running) return;
  if (candles.length < 20) { addLog('warn', '⏳ Pas assez de bougies pour analyser'); return; }

  const c = candles.slice(-50);
  const conf = parseInt(document.getElementById('confRange').value);

  // Step 1: Detect Swing High/Low
  const swingResult = detectSwings(c);
  BOT.swingHigh = swingResult.high;
  BOT.swingLow = swingResult.low;

  // Step 2: Detect CHoCH (Change of Character)
  const chochResult = detectCHoCH(c);
  if (!chochResult) return;

  // Step 3: Detect BOS (Break of Structure)
  const bosResult = detectBOS(c, chochResult);

  // Step 4: Draw Fibonacci on CHoCH
  const fibResult = drawFibonacci(chochResult.swingH, chochResult.swingL, chochResult.dir);
  BOT.fibLevels = fibResult;
  updateFibDisplay(fibResult, chochResult.dir);

  // Step 5: Check if current price is in OTE zone
  const inOTE = isPriceInOTE(BOT.currentPrice, fibResult, chochResult.dir);

  // Step 6: Calculate confidence
  const confidence = calcConfidence(chochResult, bosResult, inOTE, fibResult);

  // Step 7: Generate signal if confident enough
  if (confidence >= conf) {
    const dir = chochResult.dir === 'bear' ? 'BUY' : 'SELL'; // BOS cassé = entrer dans sens opposé
    generateSignal(dir, confidence, chochResult, bosResult, fibResult);
  }

  // Update signal count
  document.getElementById('signalCount').textContent = BOT.signals.length;

  BOT.chochDetected = !!chochResult;
  BOT.chochDir = chochResult?.dir;
  BOT.bosLevel = bosResult?.level || 0;
}

function detectSwings(c) {
  const n = 5;
  let high = 0, low = Infinity;
  for (let i = n; i < c.length - n; i++) {
    const isHigh = c.slice(i-n,i).every(x => x.h <= c[i].h) && c.slice(i+1,i+n+1).every(x => x.h <= c[i].h);
    const isLow  = c.slice(i-n,i).every(x => x.l >= c[i].l) && c.slice(i+1,i+n+1).every(x => x.l >= c[i].l);
    if (isHigh && c[i].h > high) high = c[i].h;
    if (isLow  && c[i].l < low)  low  = c[i].l;
  }
  return { high: high || c[c.length-1].h, low: low === Infinity ? c[c.length-1].l : low };
}

function detectCHoCH(c) {
  // Find the FIRST CHoCH: a break of a swing point in the opposite direction
  const minSwing = 5;
  let lastHH = { h: 0, idx: 0 }, lastLL = { l: Infinity, idx: 0 };
  let prevHH = { h: 0, idx: 0 }, prevLL = { l: Infinity, idx: 0 };

  for (let i = minSwing; i < c.length - 2; i++) {
    const window = c.slice(Math.max(0, i-minSwing), i);
    const isSwingH = window.every(x => x.h <= c[i].h);
    const isSwingL = window.every(x => x.l >= c[i].l);

    if (isSwingH) {
      prevHH = {...lastHH};
      lastHH = { h: c[i].h, idx: i };
    }
    if (isSwingL) {
      prevLL = {...lastLL};
      lastLL = { l: c[i].l, idx: i };
    }
  }

  // Bullish CHoCH: price breaks above last LH in a downtrend
  // Bearish CHoCH: price breaks below last HL in an uptrend
  const recent = c.slice(-8);
  const recentHigh = Math.max(...recent.map(x => x.h));
  const recentLow  = Math.min(...recent.map(x => x.l));

  if (lastHH.h > 0 && prevHH.h > 0 && lastLL.l < Infinity) {
    // Check for bearish CHoCH (uptrend losing strength)
    if (lastHH.h < prevHH.h && recentLow < lastLL.l) {
      return { dir: 'bear', swingH: lastHH.h, swingL: lastLL.l, idx: lastHH.idx, type: 'CHoCH ↓' };
    }
    // Check for bullish CHoCH (downtrend losing strength)
    if (lastLL.l > prevLL.l && prevLL.l < Infinity && recentHigh > lastHH.h) {
      return { dir: 'bull', swingH: lastHH.h, swingL: lastLL.l, idx: lastLL.idx, type: 'CHoCH ↑' };
    }
  }

  // Fallback: use simple momentum detection
  const last12 = c.slice(-12);
  const first6 = last12.slice(0, 6);
  const last6  = last12.slice(6);
  const avg1 = first6.reduce((s,x) => s + x.c, 0) / 6;
  const avg2 = last6.reduce((s,x) => s + x.c, 0) / 6;
  const change = (avg2 - avg1) / avg1;

  if (Math.abs(change) > 0.0003) {
    const dir = change > 0 ? 'bull' : 'bear';
    const swingH = Math.max(...last12.map(x => x.h));
    const swingL = Math.min(...last12.map(x => x.l));
    return { dir, swingH, swingL, idx: c.length - 6, type: dir === 'bull' ? 'CHoCH ↑' : 'CHoCH ↓' };
  }

  return null;
}

function detectBOS(c, choch) {
  if (!choch) return null;
  const recent = c.slice(-6);

  if (choch.dir === 'bear') {
    // Bullish BOS: price breaks above a recent high (bullish tendency being confirmed)
    const recentHigh = Math.max(...recent.map(x => x.h));
    return { dir: 'bull', level: choch.swingH, broken: BOT.currentPrice > choch.swingH * 0.9998, type: 'BOS ↑ Bullish' };
  } else {
    // Bearish BOS: price breaks below a recent low
    const recentLow = Math.min(...recent.map(x => x.l));
    return { dir: 'bear', level: choch.swingL, broken: BOT.currentPrice < choch.swingL * 1.0002, type: 'BOS ↓ Bearish' };
  }
}

function drawFibonacci(high, low, dir) {
  const range = high - low;
  const levels = dir === 'bull'
    ? { // Retracement dans hausse: mesurer du low vers le high
        level0:   high,
        level236: high - range * 0.236,
        level382: high - range * 0.382,
        level500: high - range * 0.500,
        level618: high - range * 0.618,
        level705: high - range * 0.705,
        level790: high - range * 0.790,
        level100: low
      }
    : { // Retracement dans baisse: mesurer du high vers le low
        level0:   low,
        level236: low + range * 0.236,
        level382: low + range * 0.382,
        level500: low + range * 0.500,
        level618: low + range * 0.618,
        level705: low + range * 0.705,
        level790: low + range * 0.790,
        level100: high
      };
  return levels;
}

function isPriceInOTE(price, fib, dir) {
  if (!fib || !fib.level618) return false;
  const oteHigh = Math.max(fib.level618, fib.level790);
  const oteLow  = Math.min(fib.level618, fib.level790);
  return price >= oteLow && price <= oteHigh;
}

function calcConfidence(choch, bos, inOTE, fib) {
  let score = 0;
  if (choch) score += 25;                          // CHoCH détecté
  if (bos && bos.broken) score += 20;              // BOS confirmé
  if (inOTE) score += 25;                          // Dans la zone OTE
  if (fib && fib.level618) score += 10;            // Fibonacci tracé

  // Trend alignment check
  if (candles.length >= 20) {
    const ma20 = candles.slice(-20).reduce((s,c) => s + c.c, 0) / 20;
    const trendAlign = (choch?.dir === 'bull' && BOT.currentPrice > ma20) ||
                       (choch?.dir === 'bear' && BOT.currentPrice < ma20);
    if (trendAlign) score += 15;
  }

  // Volatility bonus
  if (candles.length >= 5) {
    const atr = candles.slice(-5).reduce((s,c) => s + (c.h - c.l), 0) / 5;
    if (atr > 0.0002) score += 5;
  }

  return Math.min(98, score);
}

function generateSignal(dir, confidence, choch, bos, fib) {
  const pair = BOT.pair.replace('frx','').replace('cry','');
  const tf = `M${BOT.tf/60}`;

  // Calculate entry, SL, TP
  const entry = BOT.currentPrice;
  let sl, tp1, tp2;
  const spread = entry * 0.0001;
  const rr = parseInt(document.getElementById('rrSelect').value);

  if (dir === 'BUY') {
    sl  = (fib.level100 || BOT.swingLow) - spread * 2;
    const risk = entry - sl;
    tp1 = entry + risk * 2;
    tp2 = entry + risk * rr;
  } else {
    sl  = (fib.level100 || BOT.swingHigh) + spread * 2;
    const risk = sl - entry;
    tp1 = entry - risk * 2;
    tp2 = entry - risk * rr;
  }

  // Calculate lot size based on risk %
  const risk = parseFloat(document.getElementById('riskRange').value);
  const riskAmount = BOT.balance * (risk / 100);
  const pipValue = 0.10; // $0.10 per pip for 0.01 lot
  const slPips = Math.abs(entry - sl) / 0.0001;
  const lotSize = Math.max(0.01, Math.min(1.0, (riskAmount / (slPips * pipValue * 10))));

  const signal = {
    id: Date.now(),
    pair, dir, tf, entry: entry.toFixed(5), sl: sl.toFixed(5),
    tp1: tp1.toFixed(5), tp2: tp2.toFixed(5),
    confidence, lot: lotSize.toFixed(2),
    chochType: choch.type, bosType: bos?.type || '',
    time: new Date().toLocaleTimeString(), timestamp: Date.now()
  };

  // Avoid duplicate signals
  const recent = BOT.signals.filter(s => s.pair === pair && Date.now() - s.timestamp < 60000);
  if (recent.length > 0) return;

  BOT.signals.unshift(signal);
  if (BOT.signals.length > 10) BOT.signals.pop();

  updateSignalDisplay();
  addLog('trade', `⚡ Signal ${dir} ${pair} | Conf: ${confidence}% | Entry: ${signal.entry} | SL: ${signal.sl} | TP: ${signal.tp2}`);

  // Auto-execute if bot is in auto mode
  BOT.pendingTrade = signal;
  executeTradeAuto(signal);
}

function updateSignalDisplay() {
  const container = document.getElementById('signalList');
  const badgeEl = document.getElementById('signalBadgeCount');
  badgeEl.textContent = `${BOT.signals.length} actifs`;

  if (BOT.signals.length === 0) {
    container.innerHTML = '<div class="signal-card neutral"><span class="signal-icon">🔍</span><div class="signal-info"><div class="signal-pair">Analyse en cours...</div><div class="signal-detail">En attente de CHoCH + BOS confirmés</div></div></div>';
    return;
  }

  container.innerHTML = BOT.signals.slice(0, 4).map(s => `
    <div class="signal-card ${s.dir === 'BUY' ? 'bullish' : 'bearish'}">
      <span class="signal-icon">${s.dir === 'BUY' ? '📈' : '📉'}</span>
      <div class="signal-info">
        <div class="signal-pair">${s.dir} ${s.pair} <span style="color:var(--muted);font-size:.65rem;">(${s.tf})</span></div>
        <div class="signal-detail">${s.chochType} → ${s.bosType} | Entry: ${s.entry} | SL: ${s.sl}</div>
      </div>
      <div class="signal-conf ${s.confidence >= 80 ? 'high' : s.confidence >= 70 ? 'med' : 'low'}">${s.confidence}%</div>
    </div>
  `).join('');
}

function executeTradeAuto(signal) {
  if (!BOT.running || !BOT.connected) return;
  if (BOT.dailyTrades >= parseInt(document.getElementById('maxTrades').value)) {
    addLog('warn', `⛔ Limite journalière atteinte (${BOT.dailyTrades} trades)`);
    return;
  }
  if (Math.abs(BOT.dailyLoss) >= parseFloat(document.getElementById('maxLoss').value)) {
    addLog('warn', '⛔ Perte journalière maximum atteinte — Bot arrêté pour protection');
    stopBot();
    return;
  }

  addLog('trade', `🚀 Exécution auto: ${signal.dir} ${signal.pair} | Lot: ${signal.lot} | Conf: ${signal.confidence}%`);

  if (BOT.broker === 'deriv' && BOT.ws && BOT.connected) {
    // Real Deriv order via WebSocket
    const contractType = signal.dir === 'BUY' ? 'CALL' : 'PUT';
    const duration = BOT.tf === 60 ? 5 : BOT.tf === 300 ? 15 : 30; // minutes
    const stake = Math.max(1, BOT.balance * (parseFloat(document.getElementById('riskRange').value) / 100));

    // First get proposal
    BOT.ws.send(JSON.stringify({
      proposal: 1,
      amount: stake.toFixed(2),
      basis: 'stake',
      contract_type: contractType,
      currency: 'USD',
      duration: duration,
      duration_unit: 'm',
      symbol: BOT.pair
    }));

    addLog('info', `📋 Proposition envoyée: ${contractType} ${BOT.pair} — ${stake.toFixed(2)} USD — ${duration}min`);

    // Add to open trades for tracking
    addTradeToTable(signal, 'OPEN');
  } else {
    // Simulation mode
    simulateTrade(signal);
  }
}

function simulateTrade(signal) {
  const openTrade = {
    ...signal,
    status: 'OPEN',
    openTime: Date.now(),
    openPrice: BOT.currentPrice
  };
  BOT.openTrades.push(openTrade);
  addTradeToTable(signal, 'OPEN');
  document.getElementById('openTrades').textContent = BOT.openTrades.length;
}

function checkOpenTrades() {
  BOT.openTrades.forEach((trade, idx) => {
    const price = BOT.currentPrice;
    let closed = false, pnl = 0;

    if (trade.dir === 'BUY') {
      if (price >= parseFloat(trade.tp2)) { pnl = Math.abs(parseFloat(trade.tp2) - parseFloat(trade.entry)) * 10000 * parseFloat(trade.lot); closed = true; updateTradeRow(trade.id, 'TP', pnl); }
      if (price <= parseFloat(trade.sl))  { pnl = -Math.abs(parseFloat(trade.entry) - parseFloat(trade.sl)) * 10000 * parseFloat(trade.lot); closed = true; updateTradeRow(trade.id, 'SL', pnl); }
    } else {
      if (price <= parseFloat(trade.tp2)) { pnl = Math.abs(parseFloat(trade.entry) - parseFloat(trade.tp2)) * 10000 * parseFloat(trade.lot); closed = true; updateTradeRow(trade.id, 'TP', pnl); }
      if (price >= parseFloat(trade.sl))  { pnl = -Math.abs(parseFloat(trade.sl) - parseFloat(trade.entry)) * 10000 * parseFloat(trade.lot); closed = true; updateTradeRow(trade.id, 'SL', pnl); }
    }

    if (closed) {
      BOT.openTrades.splice(idx, 1);
      BOT.stats.totalPnl += pnl;
      BOT.dailyLoss += Math.min(0, pnl);
      if (pnl > 0) { BOT.stats.wins++; BOT.stats.best = Math.max(BOT.stats.best, pnl); }
      else         { BOT.stats.losses++; BOT.stats.worst = Math.min(BOT.stats.worst, pnl); }
      BOT.balance += pnl;
      BOT.perfData.push(BOT.stats.totalPnl);

      updateStatsDisplay();
      addLog(pnl > 0 ? 'success' : 'error',
        `${pnl > 0 ? '💰 TP Hit' : '❌ SL Hit'} ${trade.pair} — P&L: ${pnl > 0 ? '+' : ''}$${pnl.toFixed(3)}`);
    }
  });

  // Update open P&L
  const openPnl = BOT.openTrades.reduce((sum, t) => {
    const diff = t.dir === 'BUY' ? (BOT.currentPrice - parseFloat(t.entry)) : (parseFloat(t.entry) - BOT.currentPrice);
    return sum + diff * 10000 * parseFloat(t.lot);
  }, 0);
  document.getElementById('accPnl').textContent = (openPnl >= 0 ? '+' : '') + `$${openPnl.toFixed(3)}`;
  document.getElementById('openTrades').textContent = BOT.openTrades.length;
}

function updateFibDisplay(fib, dir) {
  if (!fib) return;
  const dec = BOT.currentPrice > 100 ? 2 : 5;
  document.getElementById('fib0').textContent   = fib.level0.toFixed(dec);
  document.getElementById('fib236').textContent = fib.level236.toFixed(dec);
  document.getElementById('fib382').textContent = fib.level382.toFixed(dec);
  document.getElementById('fib500').textContent = fib.level500.toFixed(dec);
  document.getElementById('fib618').textContent = fib.level618.toFixed(dec);
  document.getElementById('fib705').textContent = fib.level705.toFixed(dec);
  document.getElementById('fib790').textContent = fib.level790.toFixed(dec);
  document.getElementById('fib100').textContent = fib.level100.toFixed(dec);
}

function addTradeToTable(signal, status) {
  const tbody = document.getElementById('tradesBody');
  if (tbody.rows.length === 1 && tbody.rows[0].cells.length === 1) tbody.innerHTML = '';
  BOT.stats.tradeNum++;

  const row = document.createElement('tr');
  row.id = `trade-${signal.id}`;
  const badge = status === 'OPEN' ? 'badge-open' : 'badge-closed';
  row.innerHTML = `
    <td style="color:var(--gold);">#${BOT.stats.tradeNum}</td>
    <td>${signal.time}</td>
    <td style="color:var(--off);font-weight:500;">${signal.pair}</td>
    <td class="${signal.dir === 'BUY' ? 'trade-buy' : 'trade-sell'}">${signal.dir}</td>
    <td>${signal.tf}</td>
    <td>${signal.entry}</td>
    <td>${signal.sl}</td>
    <td>${signal.tp2}</td>
    <td>${signal.lot}</td>
    <td id="pnl-${signal.id}" class="trade-pnl-pos">—</td>
    <td style="color:${signal.confidence>=80?'var(--green)':signal.confidence>=70?'var(--gold)':'var(--red-l)'};">${signal.confidence}%</td>
    <td><span class="badge ${badge}" id="status-${signal.id}">${status}</span></td>
  `;
  tbody.insertBefore(row, tbody.firstChild);
  if (tbody.rows.length > 20) tbody.deleteRow(tbody.rows.length - 1);
}

function updateTradeRow(id, result, pnl) {
  const statusEl = document.getElementById(`status-${id}`);
  const pnlEl    = document.getElementById(`pnl-${id}`);
  if (statusEl) { statusEl.textContent = result; statusEl.className = `badge ${result==='TP'?'badge-closed':'badge-sl'}`; }
  if (pnlEl) {
    pnlEl.textContent = (pnl >= 0 ? '+' : '') + `$${pnl.toFixed(3)}`;
    pnlEl.className = pnl >= 0 ? 'trade-pnl-pos' : 'trade-pnl-neg';
  }
}

function updateStatsDisplay() {
  const { wins, losses, totalPnl, best, worst } = BOT.stats;
  const total = wins + losses;
  const wr = total > 0 ? ((wins / total) * 100).toFixed(1) : '--';

  document.getElementById('totalPnl').textContent = (totalPnl >= 0 ? '+' : '') + `$${totalPnl.toFixed(3)}`;
  document.getElementById('totalPnl').className = `stat-val ${totalPnl >= 0 ? 'green' : 'red'}`;
  document.getElementById('winRate').textContent = `${wr}%`;
  document.getElementById('winRateDetail').textContent = `${wins}W / ${losses}L`;
  document.getElementById('bestTrade').textContent = `+$${best.toFixed(3)}`;
  document.getElementById('worstTrade').textContent = `$${worst.toFixed(3)}`;
  document.getElementById('accBalance').textContent = `$${BOT.balance.toFixed(2)}`;

  const pf = losses > 0 ? (wins * 2 / losses).toFixed(2) : '∞';
  document.getElementById('profitFactor').textContent = pf;
  const dd = total > 0 ? Math.abs(Math.min(...BOT.perfData, 0)).toFixed(3) : '0.000';
  document.getElementById('maxDrawdown').textContent = `-$${dd}`;

  const pnlEl = document.getElementById('pnlChange');
  pnlEl.textContent = total > 0 ? `${total} trades cette session` : '-- session';
  pnlEl.className = `stat-change ${totalPnl >= 0 ? 'up' : 'dn'}`;

  drawPerfChart();
}

// ── BOT CONTROL ────────────────────────────────────────────
function toggleBot() {
  if (!BOT.connected) { addLog('error', '⛔ Connectez-vous d'abord à un broker'); return; }
  BOT.running ? stopBot() : startBot();
}

function startBot() {
  BOT.running = true;
  BOT.dailyTrades = 0;
  BOT.dailyLoss = 0;
  const btn = document.getElementById('botToggle');
  btn.textContent = '⏹ Arrêter Bot';
  btn.className = 'bot-toggle stop';
  setConnStatus('trading', 'BOT ACTIF');
  addLog('success', `🤖 Bot démarré — Stratégie: CHoCH+FVG+OTE | TF: M${BOT.tf/60} | Conf: ${document.getElementById('confRange').value}% | R:R 1:${document.getElementById('rrSelect').value}`);

  if (BOT.analysisInterval) clearInterval(BOT.analysisInterval);
  const interval = BOT.tf === 60 ? 10000 : BOT.tf === 300 ? 30000 : 60000;
  BOT.analysisInterval = setInterval(runSMCAnalysis, interval);
  runSMCAnalysis();
  document.getElementById('sessionBadge').textContent = 'BOT ACTIF';
}

function stopBot() {
  BOT.running = false;
  if (BOT.analysisInterval) { clearInterval(BOT.analysisInterval); BOT.analysisInterval = null; }
  const btn = document.getElementById('botToggle');
  btn.textContent = '▶ Démarrer Bot';
  btn.className = 'bot-toggle start';
  if (BOT.connected) setConnStatus('connected', 'Connecté — Bot arrêté');
  addLog('warn', '⏹ Bot arrêté — Positions ouvertes maintenues');
  document.getElementById('sessionBadge').textContent = `SESSION ${BOT.stats.tradeNum}`;
}

function emergencyStop() {
  stopBot();
  BOT.openTrades = [];
  document.getElementById('openTrades').textContent = '0';
  addLog('error', '⛔ ARRÊT D'URGENCE — Toutes les positions fermées manuellement');
  if (BOT.broker === 'deriv' && BOT.ws) {
    BOT.ws.send(JSON.stringify({ sell_expired: 1 }));
  }
}

// ── UI HELPERS ─────────────────────────────────────────────
function switchBroker(broker) {
  document.querySelectorAll('.conn-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.broker-content').forEach(c => c.classList.remove('active'));
  document.getElementById(`tab-${broker}`).classList.add('active');
  document.getElementById(`broker-${broker}`).classList.add('active');
  BOT.broker = broker;
}

function switchTF(tf, btn) {
  document.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  BOT.tf = tf;
  document.getElementById('tfSelect').value = tf;
  if (BOT.connected && BOT.ws) subscribeDerivTicks();
  else if (BOT.connected) { candles = generateDemoCandles(80); drawChart(); }
}

function updatePair() {
  const pair = document.getElementById('tradePair').value;
  BOT.pair = pair;
  const symName = pair.replace('frx','').replace('cry','');
  document.getElementById('chartSymbol').textContent = symName;
  if (BOT.connected && BOT.ws) subscribeDerivTicks();
}

function updateRisk(v) {
  document.getElementById('riskPct').textContent = v + '%';
}

function updateConf(v) {
  document.getElementById('confPct').textContent = v + '%';
  document.getElementById('confDisplay').textContent = v + '%';
}

function setConnStatus(state, txt) {
  const dot = document.getElementById('connDot');
  const label = document.getElementById('connTxt');
  const badge = document.getElementById('connBadge');
  dot.className = `status-dot ${state}`;
  label.textContent = txt;
  if (state === 'connected') {
    badge.textContent = 'EN LIGNE';
    badge.style.cssText = 'background:rgba(39,174,96,.15);border:1px solid var(--green);color:var(--green);';
  } else if (state === 'trading') {
    badge.textContent = 'BOT ACTIF';
    badge.style.cssText = 'background:rgba(201,168,76,.15);border:1px solid var(--gold);color:var(--gold);animation:pulse .8s infinite;';
  } else if (state === 'error') {
    badge.textContent = 'ERREUR';
    badge.style.cssText = 'background:rgba(192,57,43,.15);border:1px solid var(--red);color:var(--red-l);';
  } else {
    badge.textContent = 'HORS LIGNE';
    badge.style.cssText = 'background:rgba(136,136,128,.15);border:1px solid var(--border);color:var(--muted);';
  }
}

function addLog(type, msg) {
  const log = document.getElementById('logWrap');
  const now = new Date().toLocaleTimeString('fr-FR');
  const line = document.createElement('div');
  line.className = 'log-line';
  line.innerHTML = `<span class="log-time">${now}</span><span class="log-${type}">${msg}</span>`;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
  if (log.children.length > 200) log.removeChild(log.firstChild);
}

function clearLog()    { document.getElementById('logWrap').innerHTML = ''; addLog('info','Log vidé'); }
function clearTrades() {
  document.getElementById('tradesBody').innerHTML = '<tr><td colspan="12" style="text-align:center;color:var(--muted);font-family:var(--font-m);font-size:.65rem;padding:1.5rem;">Historique vidé</td></tr>';
  BOT.stats = { wins:0, losses:0, totalPnl:0, best:0, worst:0, tradeNum:0 };
  BOT.perfData = [];
  updateStatsDisplay();
}

function showModal(id)  { document.getElementById(id).classList.add('show'); }
function closeModal(id) { document.getElementById(id).classList.remove('show'); }
function confirmTrade() { closeModal('tradeModal'); if (BOT.pendingTrade) executeTradeAuto(BOT.pendingTrade); }

// ── RESIZE HANDLER ─────────────────────────────────────────
window.addEventListener('resize', () => {
  const cv = document.getElementById('mainChart');
  if (cv) {
    cv.width = cv.parentElement.clientWidth;
    cv.height = cv.parentElement.clientHeight;
    drawChart();
  }
  drawPerfChart();
});

// ── INIT ───────────────────────────────────────────────────
window.addEventListener('load', () => {
  initChart();
  drawPerfChart();
  setTimeout(() => {
    addLog('info', '📐 Stratégie LYL-FX chargée: CHoCH → Fibonacci OTE → BOS → Entrée');
    addLog('info', '🎯 Seuil de confiance: 75% | R:R cible: 1:3 | Timeframes: M1/M5/M15');
    addLog('warn', '💡 Astuce Deriv: allez dans Paramètres → API Token → Créer token Read+Trade');
  }, 500);
});

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 's') { e.preventDefault(); toggleBot(); }
  if (e.ctrlKey && e.key === 'e') { e.preventDefault(); emergencyStop(); }
});
</script>
</body>
</html>