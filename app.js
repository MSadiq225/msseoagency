/* msseoagency — front-end only. Data lives in this browser (localStorage).
   It NEVER marks a mail as sent unless (a) the backend /api/send returns
   ok:true, or (b) you press Mark Sent after sending it yourself.
   It NEVER fabricates a backlink, a traffic figure, or a Pass/Fail. */

const STORE = 'msseoagency-v1';
const CLIENTS = {
  'Macfox': { preset: 'Macfox', sender: 'Muhammad Sadiq — from Macfox (macfoxebike@gmail.com)', rules: 'Semrush Authority Score 30+; teenagers/families audience (cycling, outdoor, urban mobility); upward traffic 3–6 months; family-friendly — NO sexually explicit, gambling, alcohol, cannabis. Dofollow, permanent, no budget in first email.' },
  'ELEGOO': { preset: 'Boss MF / ELEGOO', sender: 'Muhammad Sadiq / ELEGOO (elegoofficial@gmail.com)', rules: 'Semrush Organic EN >10,000, DE/FR/JP >5,000; stable traffic, no sharp drop; dofollow, indexable, permanent; no upfront; price try under $500; exclude news/review/PR; exclude bulk-WordPress backlink sites; exclude All3DP & 3DPrint.com; no sponsored posts.' },
  'Casino': { preset: 'Casino', sender: 'Aqib Ali, Founder & Owner, MS SEO Agency (foundermsseoagency@gmail.com)', rules: 'Real sites with real traffic that accept gambling content; dofollow, permanent, full live URL report; no PBNs, no automated links; no budget/link/attachment in first email; small test order of 3 sample publishers.' },
  'Qiolor': { preset: 'Qiolor', sender: 'Muhammad Sadiq / Qiolor (qiolorbike@gmail.com)', rules: 'Hands-on Qiolor e-bike product review + guest feature on e-bikes/outdoor riding; no link, attachment or budget in first email; re-check site for Qiolor first, skip if already carrying a Qiolor article.' },
  'Black Friday': { preset: 'Black Friday Premium', sender: 'Muhammad Sadiq, MS SEO Agency (foundermsseoagency@gmail.com)', rules: 'Review post on premium sites (Forbes, Electrek, Autoevolution, CleanTechnica, The Gadgeteer, EbikeEscape, ElectricBikeReport, CNET) at 50% off; guest/sponsored post as extra option; pitch as Early Black Friday.' },
  'Custom': { preset: 'Custom', sender: 'MS SEO Agency', rules: 'Define the brief first: niche, traffic minimum, dofollow/permanent, price cap, exclusions — then prospect and outreach.' },
};

const CASINO_TEMPLATE = {
  subject: 'Guest Post Backlinks for Casino Sites',
  body: "Hello,\n\nI'm Aqib Ali, Founder & Owner of MS SEO Agency.\n\nWe specialise in manual off-page SEO and high-authority guest post placements for casino and sports betting brands, published only on real websites with real traffic that accept gambling content. Each placement is dofollow, permanent, and delivered with a full live URL report — no PBNs, no automated links.\n\nIf you're open to it, I'd be happy to share 3 sample publishers matched to your niche for a small test order.\n\nBest regards,\nAqib Ali\nFounder & Owner, MS SEO Agency",
  follow: "Hello,\n\nJust following up on my note about guest post backlinks for casino and sports betting brands.\n\nIf you're open to a small test, I can share 3 sample publishers matched to your niche — dofollow, permanent, with a full live URL report.\n\nBest regards,\nAqib Ali\nFounder & Owner, MS SEO Agency"
};

// Embedded from casino-top-50-high-response-2026-11-10.xlsx (Top 50 tab).
// One email per prospect: named decision-maker where the sheet had one,
// otherwise the first listed public email. Traffic/price: Unverified.
const CASINO_TOP_50 = [
  {rank:1,name:"BetAndSkill (Bet & Skill)",domain:"betandskill.com",niche:"Sports Betting Affiliate",geo:"UK / English",email:"david@betandskill.com"},
  {rank:2,name:"Andy's Bet Club",domain:"andysbetclub.co.uk",niche:"Sports Betting Affiliate",geo:"UK / English",email:"andy@andysbetclub.co.uk"},
  {rank:3,name:"BestBonus",domain:"bestbonus.co.nz",niche:"Online Casino Affiliate",geo:"NZ / English",email:"lukas@bestbonus.co.nz"},
  {rank:4,name:"TopEndSports",domain:"topendsports.com",niche:"Sports Betting Affiliate",geo:"US + UK / English",email:"gustavocantella@topendsports.com"},
  {rank:5,name:"VSiN (Vegas Stats & Information Network)",domain:"vsin.com",niche:"Sports Betting Affiliate",geo:"US / English",email:"michelle@vsin.com"},
  {rank:6,name:"BestOnlineSlots.uk.com",domain:"bestonlineslots.uk.com",niche:"Slots / Casino Review",geo:"UK / English",email:"james@bestonlineslots.uk.com"},
  {rank:7,name:"Casino Reports",domain:"casinoreports.com",niche:"Slots / Casino Review",geo:"US / English",email:"brett@thirdplanet.us"},
  {rank:8,name:"PromoGuy",domain:"promoguy.us",niche:"Crypto-Sweepstakes Affiliate",geo:"US / English",email:"collin@promoguy.us"},
  {rank:9,name:"Blockonomi",domain:"blockonomi.com",niche:"Crypto-Sweepstakes Affiliate",geo:"UK / English",email:"oliver@blockonomi.com"},
  {rank:10,name:"Best Casinos in Canada",domain:"bestcasinosincanada.net",niche:"Online Casino Affiliate",geo:"CA / English",email:"jeff.vertes26@gmail.com"},
  {rank:11,name:"King Casino Bonus NZ",domain:"kingcasinobonus.co.nz",niche:"Online Casino Affiliate",geo:"NZ / English",email:"support@kingcasinobonus.uk"},
  {rank:12,name:"RacingBase",domain:"racingbase.com.au",niche:"Sports Betting Affiliate",geo:"AU / English",email:"info@onetwentygroup.com"},
  {rank:13,name:"Betting Gods",domain:"bettinggods.com",niche:"Sports Betting Affiliate",geo:"UK / Malta / English",email:"support@bettinggods.com"},
  {rank:14,name:"OnlineCasinos.net",domain:"onlinecasinos.net",niche:"Slots / Casino Review",geo:"CA / English",email:"janicedoughtrey@onlinecasinos.net"},
  {rank:15,name:"SweepsPulse",domain:"sweepspulse.com",niche:"Crypto-Sweepstakes Affiliate",geo:"US / English",email:"maria@sweepspulse.com"},
  {rank:16,name:"VIP Gambler Hub",domain:"vipgamblerhub.com",niche:"Online Casino Affiliate",geo:"US / English",email:"info@vipgamblerhub.com"},
  {rank:17,name:"Thatsagoal",domain:"thatsagoal.com",niche:"Sports Betting Affiliate",geo:"UK / English",email:"editor@thatsagoal.com"},
  {rank:18,name:"MrFixitsTips",domain:"mrfixitstips.co.uk",niche:"Sports Betting Affiliate",geo:"UK / English",email:"hello@mrfixitstips.co.uk"},
  {rank:19,name:"CasinoAlpha",domain:"casinoalpha.com",niche:"Slots / Casino Review",geo:"UK / English",email:"support@casinoalpha.com"},
  {rank:20,name:"CoinRoop",domain:"coinroop.com",niche:"Crypto-Sweepstakes Affiliate",geo:"US / English",email:"hello@coinroop.com"},
  {rank:21,name:"BettingSeeker",domain:"bettingseeker.com",niche:"Online Casino Affiliate",geo:"US / English",email:"info@bettingseeker.com"},
  {rank:22,name:"Bonuses.com",domain:"bonuses.com",niche:"Online Casino Affiliate",geo:"International / English",email:"info@bonuses.com"},
  {rank:23,name:"CasinoBonusCA",domain:"casinobonusca.com",niche:"Slots / Casino Review",geo:"CA / English",email:"support@casinobonusca.com"},
  {rank:24,name:"CasinoInsiderPicks",domain:"casinoinsiderpicks.com",niche:"Crypto-Sweepstakes Affiliate",geo:"US / English",email:"hello@casinoinsiderpicks.com"},
  {rank:25,name:"Chipy.com",domain:"chipy.com",niche:"Online Casino Affiliate",geo:"US / English",email:"marketing@chipy.com"},
  {rank:26,name:"Sister Casino UK",domain:"sistercasinouk.com",niche:"Online Casino Affiliate",geo:"UK / English",email:"info@sistercasinouk.com"},
  {rank:27,name:"Gamblorium",domain:"gamblorium.com",niche:"Online Casino Affiliate",geo:"NZ / English",email:"info@gamblorium.com"},
  {rank:28,name:"SweepsKings",domain:"sweepskings.com",niche:"Online Casino Affiliate",geo:"US / English",email:"hello@sweepskings.com"},
  {rank:29,name:"CasinoCrawlers",domain:"casinocrawlers.com",niche:"Online Casino Affiliate",geo:"NZ / English",email:"info@casinocrawlers.com"},
  {rank:30,name:"CasinoCanada.com",domain:"casinocanada.com",niche:"Online Casino Affiliate",geo:"CA / English",email:"partners@casinocanada.com"},
  {rank:31,name:"Sportsgambler",domain:"sportsgambler.com",niche:"Sports Betting Affiliate",geo:"UK / Global",email:"contact@sportsgambler.com"},
  {rank:32,name:"KRUZEY",domain:"kruzey.com.au",niche:"Sports Betting Affiliate",geo:"AU / English",email:"admin@kruzey.com.au"},
  {rank:33,name:"Football Ground Guide",domain:"footballgroundguide.com",niche:"Sports Betting Affiliate",geo:"UK / English",email:"contact@footballgroundguide.com"},
  {rank:34,name:"Bets.com.au",domain:"bets.com.au",niche:"Sports Betting Affiliate",geo:"AU / English",email:"hello@bets.com.au"},
  {rank:35,name:"EveryTip",domain:"everytip.co.uk",niche:"Sports Betting Affiliate",geo:"UK / English",email:"info@everytip.co.uk"},
  {rank:36,name:"RG.org (Research Ground)",domain:"rg.org",niche:"Sports Betting Affiliate",geo:"US + CA / English",email:"support@rg.org"},
  {rank:37,name:"SportsHub",domain:"sportshub.com",niche:"Sports Betting Affiliate",geo:"US / English",email:"support@sportshub.com"},
  {rank:38,name:"BetSmart",domain:"betsmart.co",niche:"Sports Betting Affiliate",geo:"US / English",email:"hello@betsmart.co"},
  {rank:39,name:"SlotFruit",domain:"slotfruit.co.uk",niche:"Slots / Casino Review",geo:"UK / English",email:"hello@slotfruit.co.uk"},
  {rank:40,name:"Casino Sites Review",domain:"casinositesreview.io",niche:"Slots / Casino Review",geo:"AU / English",email:"editorial@casinositesreview.io"},
  {rank:41,name:"WhichBingo",domain:"whichbingo.co.uk",niche:"Slots / Casino Review",geo:"UK / English",email:"whichbingo.contactus@grandstand.com"},
  {rank:42,name:"Bingo Paradise",domain:"bingoparadise.co.uk",niche:"Slots / Casino Review",geo:"UK / English",email:"privacy@bingoparadise.co.uk"},
  {rank:43,name:"Best Pokies Online Australia",domain:"bestpokiesonlineaustralia.com",niche:"Slots / Casino Review",geo:"AU / English",email:"info@bestpokiesonlineaustralia.com"},
  {rank:44,name:"ATS.io",domain:"ats.io",niche:"Crypto-Sweepstakes Affiliate",geo:"US / English",email:"support@ats.io"},
  {rank:45,name:"AskBonus",domain:"askbonus.com",niche:"Crypto-Sweepstakes Affiliate",geo:"UK/CA / English",email:"ab@askbonus.com"},
  {rank:46,name:"Altcoin Investor",domain:"altcoininvestor.com",niche:"Crypto-Sweepstakes Affiliate",geo:"US / English",email:"hello@altcoininvestor.com"},
  {rank:47,name:"CasinoMary",domain:"casinomary.com",niche:"Slots / Casino Review",geo:"UK & CA / English",email:"mary@casinomary.com"},
  {rank:48,name:"Fruity Slots",domain:"fruityslots.com",niche:"Slots / Casino Review",geo:"UK / English",email:"contact@fruityslots.com"},
  {rank:49,name:"SoccerTips.ai",domain:"soccertips.ai",niche:"Sports Betting Affiliate",geo:"UK / English",email:"contact@soccertips.ai"},
  {rank:50,name:"The Casino Reviews",domain:"thecasinoreviews.com",niche:"Online Casino Affiliate",geo:"US / English",email:"advertise@thecasinoreviews.com"}
];

/* UNIVERSAL CLIENTS — presets/examples above are NOT the whole tool.
   state.customClients holds any client Sadiq adds (any name, any niche,
   any rules, any sender, any template) and it works end-to-end exactly
   like a built-in preset: Clients board, pipeline, Prospects, Templates,
   Campaign/Queue and the URL Checker all read from allClients(). */
function customClients() { return state.customClients || []; }
function allClients() {
  return Object.entries(CLIENTS).map(([name, c]) => ({ id: 'preset:' + name, name, ...c, builtin: true, rulesList: String(c.rules || '').split(';').map(s => s.trim()).filter(Boolean) }))
    .concat(customClients());
}
function getClient(name) { return allClients().find(c => c.name === name) || null; }
function rulesArray(c) {
  if (!c) return [];
  if (c.rulesList && c.rulesList.length) return c.rulesList;
  return String(c.rules || '').split(';').map(s => s.trim()).filter(Boolean);
}
/* Template for any client: the client's own subject/body if saved,
   Casino's settled template for Casino, otherwise a generic
   zero-placeholder template built from the client's real sender + niche.
   No [Brand] / [Website Name] placeholder, no budget/link/attachment. */
function clientTemplate(c) {
  if (!c) return CASINO_TEMPLATE;
  if (c.builtin && c.name === 'Casino') return CASINO_TEMPLATE;
  if (c.templateSubject && c.templateBody) return { subject: c.templateSubject, body: c.templateBody, follow: c.followUp || '' };
  const fromName = c.senderName || 'Muhammad Sadiq';
  const fromTitle = c.senderTitle || 'MS SEO Agency';
  const niche = (c.niche && c.niche !== '—') ? c.niche : 'guest posting';
  const body = "Hello,\n\nI'm " + fromName + ", " + fromTitle + ".\n\nWe specialise in manual off-page SEO and high-authority guest post placements for " + niche + " brands, published only on real websites with real traffic. Each placement is dofollow, permanent, and delivered with a full live URL report — no PBNs, no automated links.\n\nIf you're open to it, I'd be happy to share a few sample publishers matched to your niche for a small test order.\n\nBest regards,\n" + fromName + "\n" + fromTitle + ", MS SEO Agency";
  const follow = "Hello,\n\nJust following up on my note about guest post backlinks for " + niche + " brands.\n\nIf you're open to a small test, I can share a few sample publishers matched to your niche — dofollow, permanent, with a full live URL report.\n\nBest regards,\n" + fromName + "\n" + fromTitle + ", MS SEO Agency";
  return { subject: 'Guest Post Backlinks', body, follow };
}
function blankState() {
  return {
    users: [{ id: 1, name: 'Muhammad Sadiq', role: 'admin' }],
    senders: [
      { id: 1, email: 'info@msseoagency.com', provider: 'hostinger', label: 'MS SEO Agency', warmup: true, cap: 15, gapMin: 7, autoSend: false, connected: false },
      { id: 2, email: 'foundermsseoagency@gmail.com', provider: 'gmail', label: 'Aqib Ali — Casino', warmup: true, cap: 15, gapMin: 6, autoSend: false, connected: false }
    ],
    prospects: CASINO_TOP_50.map(p => ({ ...p, client: 'Casino', phone: '', whatsapp: 'Unknown', status: 'new' })),
    queue: [],
    customClients: [],
    semrushKey: '', ahrefsKey: '', backendUrl: ''
  };
}
let state = blankState();
try {
  const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
  if (saved && saved.prospects) state = { ...blankState(), ...saved, prospects: saved.prospects, customClients: saved.customClients || [] };
} catch (e) { /* keep defaults */ }
function save() { localStorage.setItem(STORE, JSON.stringify(state)); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function copyText(t) { navigator.clipboard.writeText(t).then(() => alert('Copied.')).catch(() => { const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); alert('Copied.'); }); }

document.querySelectorAll('#tabs button').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('#tabs button').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('main section').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  document.getElementById(b.dataset.tab).classList.add('active');
}));

/* Keep every client select (Prospects, Campaign, Checker, Templates,
   Pipeline) in sync with the full client list — built-ins + new ones. */
function populateClientSelects() {
  const clients = allClients();
  ['prospectClient', 'campClient', 'checkPreset', 'templateClient', 'pipelineClient'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const prev = el.value;
    el.innerHTML = clients.map(c => `<option value="${esc(c.name)}">${esc(c.name)}${c.builtin ? '' : ' (custom)'}</option>`).join('');
    el.value = clients.some(c => c.name === prev) ? prev : 'Casino';
  });
}
function renderClients() {
  document.getElementById('clientBoard').innerHTML = allClients().map(c =>
    `<div class="card"><h3>${esc(c.name)} <span class="chip">${esc(c.preset || (c.builtin ? 'Preset' : 'Custom'))}</span>${c.builtin ? '' : ' <span class="chip verified">aapka client</span>'}</h3>
    <p class="muted">Niche: ${esc(c.niche || '—')} · Sender: ${esc(c.sender || ((c.senderName || '') + (c.senderEmail ? ' (' + c.senderEmail + ')' : '')))}</p>
    <p>${esc(rulesArray(c).join(' · ') || c.rules || '')}</p>
    <p class="muted">Prospects in this browser: ${state.prospects.filter(p => p.client === c.name).length} · Queued: ${state.queue.filter(q => q.client === c.name).length}</p>
    ${c.builtin ? '' : `<button class="btn small danger" onclick="deleteClient(decodeURIComponent('${encodeURIComponent(c.name)}'))">Delete client</button>`}</div>`).join('');
}
function renderUsers() {
  document.getElementById('userList').innerHTML = state.users.map(u =>
    `<div class="row" style="margin:6px 0"><span class="chip">${esc(u.role)}</span><b>${esc(u.name)}</b><span class="muted">senders: ${state.senders.filter(s => s.userId === u.id || (!s.userId && u.role === 'admin')).length}</span></div>`).join('');
}
function renderSenders() {
  document.getElementById('senderLanes').innerHTML = state.senders.map((s) => {
    const sentToday = state.queue.filter(q => q.sender === s.email && q.status.startsWith('Sent')).length;
    const queued = state.queue.filter(q => q.sender === s.email && q.status === 'queued').length;
    return `<div class="lane"><h4>${esc(s.email)}</h4><p class="muted">${esc(s.provider)} · ${esc(s.label || '')}</p>
    <p>Status: ${s.connected ? '<span class="chip verified">Connected — ready to send</span>' : '<span class="chip unverified">Manual only — mailbox not connected</span>'}</p>
    <p>Warmup: ${s.warmup ? 'ON — cap 15/day' : 'OFF — cap ' + s.cap + '/day'} · Gap ${s.gapMin} min · Sent today ${sentToday} · Queued ${queued}</p>
    <div class="row"><button class="btn small" onclick="toggleWarmup(${s.id})">${s.warmup ? 'Warmup OFF (cap 55)' : 'Warmup ON (cap 15)'}</button><button class="btn small ghost" onclick="toggleConnected(${s.id})">${s.connected ? 'Mark disconnected' : 'Mark connected (after Test)'}</button><button class="btn small ghost" onclick="toggleAuto(${s.id})">Auto-send: ${s.autoSend ? 'ON' : 'OFF'}</button></div>
    <p class="muted">Auto-send sirf tab kaam karega jab backend connected ho aur mailbox ke SMTP env vars set hon. Password yahan mat likho — backend (Render) ke env vars mein daalo.</p></div>`;
  }).join('');
}
function renderStats() {
  const q = state.queue, p = state.prospects;
  const n = s => q.filter(x => x.status === s).length;
  document.getElementById('stats').innerHTML = `
    <div class="stat"><b>${state.users.length}</b>Team members</div>
    <div class="stat"><b>${state.senders.length}</b>Sender lanes</div>
    <div class="stat"><b>${p.length}</b>Prospects</div>
    <div class="stat"><b>${n('queued')}</b>Queued</div>
    <div class="stat"><b>${q.filter(x => x.status.startsWith('Sent')).length}</b>Sent</div>
    <div class="stat"><b>${n('replied')}</b>Replied</div>`;
  const stages = ['new', 'queued', 'Sent', 'replied', 'price', 'order'];
  const pipeClient = (document.getElementById('pipelineClient') && document.getElementById('pipelineClient').value) || 'Casino';
  document.getElementById('pipeline').innerHTML = stages.map(s => {
    const c = s === 'new' ? p.filter(x => x.status === 'new' && x.client === pipeClient).length : q.filter(x => x.status.startsWith(s) && x.client === pipeClient).length;
    return `<span class="chip">${s}: ${c}</span> `;
  }).join('') + `<span class="muted"> — ${esc(pipeClient)}</span>`;
}
/* Templates tab: show the selected client's own template. */
function renderTemplate() {
  const sel = document.getElementById('templateClient');
  const c = getClient(sel ? sel.value : 'Casino') || getClient('Casino');
  if (!c) return;
  const tpl = clientTemplate(c);
  document.getElementById('tSubject').textContent = tpl.subject;
  document.getElementById('tBody').innerText = tpl.body;
  document.getElementById('tFollow').innerText = tpl.follow || '— (koi follow-up save nahi hai)';
  const from = document.getElementById('tFrom');
  if (from) from.textContent = 'From: ' + (c.sender || c.senderName || 'MS SEO Agency') + ' · Client: ' + c.name + (c.niche ? ' · Niche: ' + c.niche : '');
}
function renderProspects() {
  const f = (document.getElementById('prospectFilter').value || '').toLowerCase();
  const client = document.getElementById('prospectClient').value;
  const list = state.prospects.filter(p => p.client === client && (!f || (p.name + p.domain + p.email).toLowerCase().includes(f)));
  document.getElementById('prospectRows').innerHTML = list.map(p => {
    const wa = p.phone ? `<a href="https://wa.me/${p.phone.replace(/[^0-9]/g, '')}" target="_blank" rel="noopener">wa.me ↗</a>` : '—';
    return `<tr><td>${p.rank || ''}</td><td><b>${esc(p.name)}</b><br><span class="muted">${esc(p.domain)} · ${esc(p.niche || '')} · ${esc(p.geo || '')}</span></td><td>${esc(p.email)}</td><td><span class="chip unverified">WhatsApp: ${esc(p.whatsapp || 'Unknown')}</span><br>${wa}</td><td><span class="chip unverified">${esc(p.status)}</span> <span class="chip unverified">Traffic: Unverified</span></td></tr>`;
  }).join('') || '<tr><td colspan="5">No prospects for this client yet — add one below or change the client filter.</td></tr>';
}
function renderQueue() {
  document.getElementById('queueStats').innerHTML = `<p class="muted">Queued: ${state.queue.filter(q => q.status === 'queued').length} · Sent: ${state.queue.filter(q => q.status.startsWith('Sent')).length} · Replied: ${state.queue.filter(q => q.status === 'replied').length} · Failed: ${state.queue.filter(q => q.status === 'failed').length}</p>`;
  document.getElementById('queueRows').innerHTML = state.queue.map((q, i) =>
    `<tr><td>${i + 1}</td><td>${esc(q.email)}<br><span class="muted">${esc(q.domain)}</span></td><td>${esc(q.sender)}</td><td>${esc(q.scheduledAt || '')}</td><td>${q.status.startsWith('Sent') ? '<span class="chip verified">' + esc(q.status) + '</span>' : q.status === 'failed' ? '<span class="chip fail">Failed</span>' : '<span class="chip unverified">' + esc(q.status) + '</span>'}${q.failReason ? '<br><span class="muted">' + esc(q.failReason) + '</span>' : ''}</td><td><div class="row">${q.status === 'queued' ? `<button class="btn small" onclick="sendOne(${i})">Send via backend</button><button class="btn small ghost" onclick="markSent(${i})">Mark Sent</button>` : ''}${q.status.startsWith('Sent') ? `<button class="btn small ghost" onclick="markReplied(${i})">Mark Replied</button>` : ''}</div></td></tr>`).join('')
    || '<tr><td colspan="6">Queue is empty — build a campaign queue from the Prospects.</td></tr>';
}
function renderAll() { populateClientSelects(); renderStats(); renderClients(); renderUsers(); renderSenders(); renderProspects(); renderQueue(); renderTemplate(); document.getElementById('semrushKey').value = state.semrushKey || ''; document.getElementById('ahrefsKey').value = state.ahrefsKey || ''; document.getElementById('backendUrl').value = state.backendUrl || ''; }

/* NEW CLIENT — the universal builder. Any name, any niche (free text,
   suggestions only — never forced), any rules (free-form lines + optional
   numbers/checkboxes), any sender identity, any template. The client is
   saved to localStorage and appears everywhere a built-in client does. */
window.addClient = function () {
  const name = document.getElementById('ncName').value.trim();
  const niche = document.getElementById('ncNiche').value.trim();
  if (!name) return alert('Client ka naam likho.');
  if (getClient(name)) return alert('Ye client pehle se hai — alag naam likho.');
  const sName = document.getElementById('ncSenderName').value.trim();
  const sTitle = document.getElementById('ncSenderTitle').value.trim();
  const sEmail = document.getElementById('ncSenderEmail').value.trim();
  if (sEmail && !/.+@.+\..+/.test(sEmail)) return alert('Sender email sahi likho (ya khaali chhodo).');
  const lines = document.getElementById('ncRules').value.split('\n').map(s => s.trim()).filter(Boolean);
  const minTraffic = document.getElementById('ncTraffic').value.trim();
  const minAS = document.getElementById('ncAS').value.trim();
  const priceCap = document.getElementById('ncPrice').value.trim();
  const extra = [];
  if (minTraffic) extra.push('Min monthly organic traffic: ' + minTraffic);
  if (minAS) extra.push('Min Authority Score: ' + minAS);
  if (priceCap) extra.push('Price cap: $' + priceCap + '/post');
  if (document.getElementById('ncDofollow').checked) extra.push('Links: dofollow');
  if (document.getElementById('ncPermanent').checked) extra.push('Links: permanent');
  if (document.getElementById('ncNoUpfront').checked) extra.push('No upfront payment');
  const rulesList = lines.concat(extra);
  const sender = [sName, sTitle].filter(Boolean).join(', ') + (sEmail ? ' (' + sEmail + ')' : '');
  state.customClients.push({
    id: 'custom:' + Date.now(), name, niche: niche || '—', preset: 'Custom', builtin: false,
    senderName: sName, senderTitle: sTitle, senderEmail: sEmail, sender: sender || 'MS SEO Agency',
    rulesList, rules: rulesList.join('; '),
    minTraffic, minAS, priceCap,
    dofollow: document.getElementById('ncDofollow').checked,
    permanent: document.getElementById('ncPermanent').checked,
    noUpfront: document.getElementById('ncNoUpfront').checked,
    templateSubject: document.getElementById('ncSubject').value.trim(),
    templateBody: document.getElementById('ncBody').value.trim(),
    followUp: document.getElementById('ncFollow').value.trim()
  });
  save();
  ['prospectClient', 'campClient', 'checkPreset', 'templateClient', 'pipelineClient'].forEach(id => { const el = document.getElementById(id); if (el) el.value = name; });
  renderAll();
  alert('Naya client "' + name + '" add ho gaya — ab ye Clients board, pipeline, Prospects, Templates, Campaign aur URL Checker mein dikhega. Prospects add karo, phir Build Queue dabao.');
};
window.deleteClient = function (name) {
  if (!confirm('Client "' + name + '" delete kar dun? Iske prospects/queue save rahenge, lekin client list se nikal jayega.')) return;
  state.customClients = customClients().filter(c => c.name !== name);
  save(); renderAll();
};

/* Actions (also used by the inline onclick handlers in index.html) */
window.addUser = function () {
  const name = document.getElementById('newUserName').value.trim();
  if (!name) return alert('Student ka naam likho.');
  state.users.push({ id: Date.now(), name, role: document.getElementById('newUserRole').value });
  document.getElementById('newUserName').value = ''; save(); renderAll();
};
window.addSender = function () {
  const email = document.getElementById('senderEmail').value.trim();
  const provider = document.getElementById('senderProvider').value;
  if (!/.+@.+\..+/.test(email)) return alert('Sahi email likho.');
  if (state.senders.some(s => s.email.toLowerCase() === email.toLowerCase())) return alert('Ye sender pehle se add hai.');
  state.senders.push({ id: Date.now(), email, provider, label: document.getElementById('senderLabel').value.trim(), warmup: true, cap: 15, gapMin: provider === 'gmail' ? 6 : 7, autoSend: false, connected: false });
  save(); renderAll();
};
window.toggleWarmup = function (id) { const s = state.senders.find(x => x.id === id); s.warmup = !s.warmup; s.cap = s.warmup ? 15 : 55; save(); renderAll(); };
window.toggleConnected = function (id) { const s = state.senders.find(x => x.id === id); s.connected = !s.connected; if (!s.connected) s.autoSend = false; save(); renderAll(); };
window.toggleAuto = function (id) { const s = state.senders.find(x => x.id === id); if (!s.connected) return alert('Pehle mailbox connect karo (Test connection) — bina connected mailbox ke auto-send ON nahi hoga.'); s.autoSend = !s.autoSend; save(); renderAll(); };
window.addProspect = function () {
  const domain = document.getElementById('pDomain').value.trim();
  const email = document.getElementById('pEmail').value.trim();
  if (!domain) return alert('Domain likho.');
  state.prospects.push({ rank: '', name: domain, domain, niche: '', geo: '', email, client: document.getElementById('prospectClient').value, phone: document.getElementById('pPhone').value.trim(), whatsapp: 'Unknown', status: 'new' });
  save(); renderAll();
};
window.buildQueue = function () {
  const client = document.getElementById('campClient').value;
  const name = document.getElementById('campName').value.trim() || 'Campaign';
  const clientObj = getClient(client);
  const tpl = clientTemplate(clientObj); // any client's own template
  const lanes = state.senders.filter(s => s);
  if (!lanes.length) return alert('Pehle ek sender add karo.');
  const fresh = state.prospects.filter(p => p.client === client && p.status === 'new' && p.email);
  if (!fresh.length) return alert('Is client ke liye koi new prospect with email nahi mila.');
  const perLane = {}; lanes.forEach(l => perLane[l.email] = 0);
  const now = Date.now();
  let added = 0, skipped = 0;
  fresh.forEach((p, idx) => {
    const lane = lanes[idx % lanes.length];
    const cap = lane.warmup ? 15 : 55;
    const sentToday = state.queue.filter(q => q.sender === lane.email && q.status.startsWith('Sent') && new Date(q.sentAt || 0).toDateString() === new Date().toDateString()).length;
    if (perLane[lane.email] + sentToday >= cap) { skipped++; return; }
    const at = new Date(now + perLane[lane.email] * lane.gapMin * 60000);
    state.queue.push({ client, campaign: name, domain: p.domain, email: p.email, sender: lane.email, scheduledAt: at.toLocaleString(), scheduledTs: at.getTime(), status: 'queued', subject: tpl.subject, body: tpl.body });
    p.status = 'queued'; perLane[lane.email]++; added++;
  });
  save(); renderAll();
  alert(`Queue built: ${added} first emails queued across ${lanes.length} parallel lane(s) for ${client}. ${skipped ? skipped + ' skipped — warmup daily cap reached, kal dobara Build Queue dabao.' : ''}`);
};
window.markSent = function (i) { const q = state.queue[i]; q.status = 'Sent (manual)'; q.sentAt = new Date().toISOString(); const p = state.prospects.find(x => x.email === q.email); if (p) p.status = 'Sent (manual)'; save(); renderAll(); };
window.markReplied = function (i) { const q = state.queue[i]; q.status = 'replied'; const p = state.prospects.find(x => x.email === q.email); if (p) p.status = 'replied'; save(); renderAll(); };
window.sendOne = async function (i) {
  const q = state.queue[i];
  const base = (state.backendUrl || '').replace(/\/$/, '');
  if (!base) { alert('Backend connected nahi hai — Backend URL Settings mein daalo (Render URL), ya khud mailbox se bhej kar Mark Sent dabao. Ye mail sent mark NAHI hui.'); return; }
  q.status = 'sending'; renderQueue();
  try {
    const res = await fetch(base + '/api/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: q.email, subject: q.subject, body: q.body, from: q.sender }) });
    const data = await res.json();
    if (res.ok && data.ok) { q.status = 'Sent (auto)'; q.sentAt = new Date().toISOString(); const p = state.prospects.find(x => x.email === q.email); if (p) p.status = 'Sent (auto)'; }
    else { q.status = 'failed'; q.failReason = (data && (data.detail || data.error)) || ('HTTP ' + res.status); }
  } catch (e) { q.status = 'failed'; q.failReason = 'Backend tak connection nahi hua: ' + e.message; }
  save(); renderAll();
};
window.sendDue = async function () {
  const due = state.queue.map((q, i) => ({ q, i })).filter(x => x.q.status === 'queued' && x.q.scheduledTs <= Date.now());
  if (!due.length) return alert('Abhi koi due mail nahi hai.');
  for (const { i } of due) { await window.sendOne(i); }
};
window.runChecker = function () {
  const url = document.getElementById('checkUrl').value.trim();
  const clientName = document.getElementById('checkPreset').value;
  const c = getClient(clientName) || getClient('Casino');
  if (!url) return alert('Site ka URL paste karo.');
  if (!c) return alert('Pehle ek client select karo.');
  const hasKey = !!(state.semrushKey || state.ahrefsKey);
  const today = new Date().toLocaleDateString();
  const rules = rulesArray(c);
  const checklist = rules.map(r => `<li>${esc(r)} — <span class="chip unverified">Unverified — no evidence yet (${esc(today)})</span></li>`).join('');
  document.getElementById('checkResult').innerHTML = `
    <p><b>Site:</b> ${esc(url)} · <b>Client:</b> ${esc(c.name)}${c.niche ? ' · <b>Niche:</b> ' + esc(c.niche) : ''}</p>
    <p><span class="chip unverified">Backlinks (last 1 month): Unverified — not checked</span> <span class="chip unverified">Traffic: Unverified</span> <span class="chip unverified">Authority: Unverified</span></p>
    <h3>${esc(c.name)} ki requirements — checklist</h3>
    <ul>${checklist || '<li>No rules saved for this client — pehle Clients mein rules likho.</li>'}</ul>
    <p><b>Honest result:</b> is page se last-1-month backlinks nikaale nahi ja sakte aur koi Pass/Fail nahi diya ja sakta — traffic ya backlink ka koi figure banaya nahi gaya hai. Upar har rule <b>Unverified</b> hai jab tak aap khud evidence (source page + date) na dein ya API key se verified check na ho. ${hasKey ? 'API key save hai (is browser mein), lekin is static page mein live Semrush/Ahrefs call nahi chalti — verified check ke liye backend chahiye, jahan key env vars mein ho.' : 'Verified check ke liye Settings mein Semrush ya Ahrefs API key paste karo. Key ke baghair sab kuch Unverified hi rahega — yehi sahi tareeqa hai.'}</p>
    <p class="muted">Aap khud ye check karo: site kholo, dekho brand pehle se hai ya nahi, guest-post page hai ya nahi, contact email aur phone number nikalo — phir Prospects mein ${esc(c.name)} client select kar ke add karo.</p>`;
};
window.saveKeys = function () { state.semrushKey = document.getElementById('semrushKey').value.trim(); state.ahrefsKey = document.getElementById('ahrefsKey').value.trim(); save(); alert('Keys sirf is browser mein save hui hain.'); };
window.saveBackend = function () { state.backendUrl = document.getElementById('backendUrl').value.trim(); save(); checkBackend(); };
window.clearAll = function () { if (confirm('Is browser ka sara saved data delete kar dun?')) { localStorage.removeItem(STORE); state = blankState(); save(); renderAll(); } };
window.checkBackend = async function () {
  const chip = document.getElementById('backendChip');
  const base = (state.backendUrl || '').replace(/\/$/, '');
  if (!base) { chip.textContent = 'Backend: not connected (manual only)'; chip.className = 'chip unverified'; return; }
  try {
    const res = await fetch(base + '/api/health');
    const data = await res.json();
    chip.textContent = data.smtp_connected ? 'Backend: connected — SMTP ready' : 'Backend: reachable — mailbox not connected';
    chip.className = 'chip ' + (data.smtp_connected ? 'verified' : 'unverified');
    document.getElementById('backendStatus').textContent = data.smtp_connected ? 'Backend reachable aur SMTP connected hai.' : 'Backend reachable hai, lekin SMTP env vars set nahi hain — mail manual only rahega.';
  } catch (e) { chip.textContent = 'Backend: unreachable'; chip.className = 'chip fail'; document.getElementById('backendStatus').textContent = 'Backend URL tak connection nahi hua: ' + e.message; }
};
renderAll();
