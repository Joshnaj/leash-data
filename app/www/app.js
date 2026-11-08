/* Leash, with Ellie. Safe to spend today, with everything else feeding into it.
   Plain JS, no build step. Data lives on this device (localStorage); Android extras via Capacitor when present. */
(() => {
'use strict';

/* ---------------- helpers ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const inr = (n) => '₹' + Math.round(Number(n) || 0).toLocaleString('en-IN');
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const pad2 = (n) => String(n).padStart(2, '0');
const dkey = (d) => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
const mkey = (d) => d.getFullYear() + '-' + pad2(d.getMonth() + 1);
const parseKey = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d || 1); };
const today0 = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const daysBetween = (a, b) => Math.round((b - a) / 86400000);
const dim = (y, m) => new Date(y, m + 1, 0).getDate();
const onDay = (y, m, day) => new Date(y, m, Math.min(day, dim(y, m)));
const short = (d) => d.getDate() + ' ' + MON[d.getMonth()];
const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };

/* ---------------- icons ---------------- */
const P = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chat: '<path d="M21 12a8 8 0 0 1-8 8H7l-4 2 1.5-4A8 8 0 0 1 13 4a8 8 0 0 1 8 8z"/>',
  bulb: '<path d="M12 3a6 6 0 0 1 4 10.5V15H8v-1.5A6 6 0 0 1 12 3zM9 18h6M10 21h4"/>',
  gift: '<path d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-1.5-3-5-3-5-1s3 1 5 1zm0 0c1.5-3 5-3 5-1s-3 1-5 1z"/>',
  send: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  pie: '<path d="M12 3a9 9 0 1 0 9 9h-9zM15 3.5A9 9 0 0 1 20.5 9H15z"/>',
  gem: '<path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8.5 9.5l3.5-3 3.5 3-3.5 7z"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  back: '<path d="M15 6l-6 6 6 6"/>',
  chev: '<path d="M9 6l6 6-6 6"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  flame: '<path d="M12 3c2 4 6 5.5 6 10a6 6 0 0 1-12 0c0-2.5 1.5-4 3-5 0 2 1 3 2 3 0-3-1-5 1-8z"/>',
  food: '<path d="M4 12h16a8 8 0 0 1-16 0zM9 3.5c-.8 1 .8 2 0 3.5M13 3.5c-.8 1 .8 2 0 3.5"/>',
  travel: '<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17l4-8h5l3 8M10 9l-1-3H7"/>',
  home: '<path d="M3 11l9-7 9 7M5 10v10h14V10"/>',
  bag: '<path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/>',
  coin: '<circle cx="12" cy="12" r="8"/><path d="M9 10h6M9 14h6M12 7v10"/>',
  bolt: '<path d="M13 3L5 13h6l-1 8 8-10h-6z"/>',
  smile: '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
  heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
  dots: '<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
  bookmark: '<path d="M6 4h12v17l-6-4-6 4z"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM5 5h3v3a3 3 0 0 1-3-3zM19 5h-3v3a3 3 0 0 0 3-3zM12 13v4M8 20h8"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  down: '<path d="M12 4v12M6 10l6 6 6-6M5 20h14"/>',
  repeat: '<path d="M17 2l3 3-3 3M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3M20 13v2a4 4 0 0 1-4 4H4"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6"/>',
  calc: '<rect x="5" y="3" width="14" height="18" rx="3"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
  basket: '<path d="M3 10h18l-2 10H5zM7 10l3-6M17 10l-3-6M9 14v3M15 14v3"/>',
  cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 10v4M18 10v4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  share: '<path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13"/>',
  bell: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  piggy: '<path d="M5 11a7 6 0 0 1 13-2l3-1-1 4a6 6 0 0 1-2 5v3h-3v-2h-4v2H8v-3a6 6 0 0 1-3-6z"/>',
  news: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 9h10M7 13h10M7 17h6"/>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  wallet: '<path d="M4 7a2 2 0 0 1 2-2h12v4M4 7v10a2 2 0 0 0 2 2h14V9H6a2 2 0 0 1-2-2zM16 14h.01"/>',
  receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6"/>',
  jar: '<path d="M7 4h10M8 4v3c-2 1-3 2-3 4v7a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-7c0-2-1-3-3-4V4"/>'
};
const ico = (n, w = 2) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || P.dots) + '</svg>';

/* ---------------- state ---------------- */
const KEY = 'kharcha.v2';
const CAT_COLORS = [['#d7f0e4', '#1d6b48'], ['#ffe4d4', '#b8441a'], ['#d6e6f8', '#2d4a6b'], ['#e5def7', '#4b3a86'], ['#f6e7bf', '#7a5a00'], ['#fde4ef', '#9c2f62'], ['#e2ecd4', '#4a6320'], ['#dff1f6', '#1f6070'], ['#e6f2d3', '#3d6414']];
const DEFAULT_CATS = [
  { id: 'food', name: 'Food', icon: 'food', c: 0 }, { id: 'junk', name: 'Junk food', icon: 'food', c: 3 }, { id: 'travel', name: 'Travel', icon: 'travel', c: 1 },
  { id: 'home', name: 'Home', icon: 'home', c: 2 }, { id: 'groceries', name: 'Family groceries', icon: 'basket', c: 8 },
  { id: 'shop', name: 'Shopping', icon: 'bag', c: 3 },
  { id: 'gold', name: 'Gold', icon: 'coin', c: 4 }, { id: 'bills', name: 'Bills', icon: 'bolt', c: 7 },
  { id: 'fun', name: 'Fun', icon: 'smile', c: 5 }, { id: 'care', name: 'Self-care', icon: 'heart', c: 6 }, { id: 'atm', name: 'ATM cash', icon: 'cash', c: 2, withdrawal: true },
  { id: 'other', name: 'Other', icon: 'dots', c: 0 }
];
const KINDS = { bill: 'Bill', emi: 'EMI', sub: 'Subscription', save: 'Savings / SIP', home: 'Sent home', remind: 'Reminder only' };
const BILL_KINDS = ['bill', 'emi', 'sub', 'home'];
// Extra features. Each one is switched on or off in Settings, so the main screens stay clean.
const EXTRAS = [
  { key: 'gold', act: 'gold', icon: 'coin', title: 'Gold locker', sub: 'Your gold and its value today', on: true, home: 'jars', tone: 'gold' },
  { key: 'silver', act: 'silver', icon: 'gem', title: 'Silver locker', sub: 'Your silver and its value today', on: true, home: 'jars', tone: 'gold silver' },
  { key: 'jar', act: 'jar', icon: 'piggy', title: 'Savings jar', sub: 'Leftover money lands here on payday', on: true, home: 'jars', tone: 'mint' },
  { key: 'emi', act: 'emi', icon: 'bolt', title: 'EMI payoff', sub: 'When each loan ends', on: true, home: 'jars', tone: 'lav' },
  { key: 'subs', act: 'module', id: 'subscriptions', icon: 'repeat', title: 'Subscriptions', sub: 'Renewal dates and yearly total', on: false, home: 'jars', tone: 'lav' },
  { key: 'reminders', act: 'reminders', icon: 'bell', title: 'Reminders', sub: 'One-off and monthly nudges', on: false, home: 'jars', tone: 'sky' },
  { key: 'afford', act: 'afford', icon: 'calc', title: 'Can I afford it?', sub: 'Check a purchase before you buy', on: false, home: 'jars', tone: 'sun' },
  { key: 'news', act: 'news', icon: 'news', title: 'Money news', sub: 'Gold rate, tax and savings news', on: true, home: 'learn', tone: 'sky' },
  { key: 'tax', act: 'tax', icon: 'calc', title: 'Tax helper', sub: 'New regime estimate', on: false, home: 'learn', tone: 'mint' }
];
const fresh = () => ({
  v: 2, schema: 5, created: dkey(today0()), onboarded: false,
  // payday: day of month 1–31 (31 = last day of the month). payShift: 'none' | 'before' (Friday before a weekend) | 'after' (Monday after).
  profile: { name: '', salary: 0, payday: 31, payShift: 'before', homePct: 0 },
  items: [], spends: [], cats: DEFAULT_CATS.slice(), goals: [], gold: [],
  settings: { theme: 'light', roast: true, roastTime: '20:00', billReminders: true, remindHour: 9 },
  features: Object.fromEntries(EXTRAS.map((x) => [x.key, x.on])),
  jar: { out: [] }, // money taken out of the savings jar
  silver: [],       // silver pieces in grams
  income: [],       // money in that isn't salary: refunds, gifts
  chat: [],         // today's messages with Ellie
  learned: [],      // Explain Like I'm 5 cards marked Got it
  read: [], saved: [], market: null, seenBanners: {},
  paylog: {},   // salary actually received, by cycle start date: { '2026-10-31': { amount, date } }
  learn: {},    // note → category the user chose, for smart categorisation
  modules: {},  // private storage for add-on modules (see modules/)
  reminders: [], // one-off reminders: { id, text, date, done }
  ppf: { put: {}, balance: 0 }, // PPF deposits per tax year ('2026-27') and the approximate balance
  goldCut: 5,   // jeweller's deduction (%) used for the gold sell estimate
  noSpend: {},  // days marked "no spends today"
  dismissed: [], goldSeen: null, goldTarget: 0, best: { log: 0, under: 0 }
});
let S;
// Schema 3: bills are marked paid per due month ("2026-11") instead of per pay cycle ("2026-10-01"),
// so a payday can be any day of the month without bills slipping between cycles.
const ensureNewFields = () => {
  const blank = fresh();
  ['features', 'jar', 'silver', 'income', 'chat', 'learned'].forEach((k) => { if (S[k] == null) S[k] = blank[k]; });
  EXTRAS.forEach((x) => { if (S.features[x.key] == null) S.features[x.key] = x.on; });
  // The home share percentage is gone: home is a fixed monthly payment like any other.
  S.profile.homePct = 0;
};
const migratePaid = () => S.items.forEach((it) => {
  if (!it.paid) return;
  const out = {};
  Object.entries(it.paid).forEach(([k, v]) => {
    if (k.length !== 10) { out[k] = v; return; }
    const st = parseKey(k); const p = st.getDate(); const d = Number(it.day) || 1;
    const due = d >= p ? onDay(st.getFullYear(), st.getMonth(), d) : onDay(st.getFullYear(), st.getMonth() + 1, d);
    out[mkey(due)] = v;
  });
  it.paid = out;
});
const load = () => {
  let was = 4; // schema of the stored data; a fresh start is already current
  try { const raw = localStorage.getItem(KEY); const d = raw ? JSON.parse(raw) : null; S = d ? Object.assign(fresh(), d) : fresh(); if (d) was = d.schema || 2; }
  catch (e) { S = fresh(); }
  S.settings = Object.assign(fresh().settings, S.settings || {});
  S.profile = Object.assign(fresh().profile, S.profile || {});
  ensureNewFields();
  S.paylog = S.paylog || {}; S.learn = S.learn || {}; S.modules = S.modules || {};
  S.reminders = S.reminders || []; S.ppf = Object.assign({ put: {}, balance: 0 }, S.ppf || {}); if (S.goldCut == null) S.goldCut = 5; S.noSpend = S.noSpend || {}; S.dismissed = S.dismissed || []; S.best = S.best || { log: 0, under: 0 };
  if (was < 3) migratePaid();
  if (was < 4) {
    // Schema 4: a Groceries category, and the light theme by default.
    if (!S.cats.some((c) => c.id === 'groceries')) { const i = S.cats.findIndex((c) => c.id === 'home'); S.cats.splice(i < 0 ? S.cats.length : i + 1, 0, { id: 'groceries', name: 'Groceries', icon: 'basket', c: 8 }); }
    if (S.settings.theme === 'auto') S.settings.theme = 'light';
  }
  if (was < 5) {
    // Schema 5: no credit cards; every spend is paid by UPI/card or cash, and can come from savings. ATM cash is its own category.
    S.spends.forEach((sp) => { sp.method = sp.method || 'upi'; delete sp.src; });
    delete S.cards; delete S.cardPays;
    if (!S.cats.some((c) => c.id === 'atm')) S.cats.push({ id: 'atm', name: 'ATM cash', icon: 'cash', c: 2, withdrawal: true });
    S.goals.forEach((g) => { if (g.kind !== 'emergency' && !g.horizon) g.horizon = 'near'; });
  }
  if (was < 5) { S.schema = 5; save(); }
};
const save = () => { ledgerMemo = null; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage full or blocked */ } };

/* ---------------- money engine ---------------- */
const sum = (arr) => arr.reduce((s, x) => s + (Number(x.amt) || 0), 0);
const E = window.LeashEngine;
const paydayFor = E.paydayFor;
const paydayIn = (y, m) => paydayFor(y, m, S.profile.payday, S.profile.payShift);
const cycleFor = (d) => { const c = E.cycleFor(d, S.profile.payday, S.profile.payShift); return { ...c, key: dkey(c.start) }; };
// The calendar month a pay cycle mostly covers (a cycle from 30 Oct is "November").
const cycMonth = (cyc) => addDays(cyc.start, Math.floor(cyc.days / 2));
const nextPaydays = (n, day = S.profile.payday, shift = S.profile.payShift) => {
  const t = today0(); const out = [];
  for (let i = -1; i < n + 2 && out.length < n; i++) { const p = paydayFor(t.getFullYear(), t.getMonth() + i, day, shift); if (p >= t) out.push(p); }
  return out;
};
const monthOk = (it, due) => { const m = mkey(due); return !(it.start && m < it.start.slice(0, 7)) && !(it.end && m > it.end.slice(0, 7)); };
// Every monthly item belongs to exactly one pay period, whichever day of the month it is due.
const occIn = (it, cyc) => { const due = E.dueInCycle(cyc, it.day, S.profile.payday); return monthOk(it, due) ? [due] : []; };
// The home share follows the pay that actually arrived. Set the share to 0 to use a fixed amount instead.
const itemAmount = (it, cyc) => (it.kind === 'home' && Number(S.profile.homePct) > 0 ? E.homeShare(salaryFor(cyc), S.profile.homePct) : Number(it.amount) || 0);
const cycItems = (cyc) => S.items.filter((it) => it.kind !== 'remind')
  .flatMap((it) => occIn(it, cyc).map((due) => ({ it, due, key: mkey(due), amount: itemAmount(it, cyc), paid: !!(it.paid && it.paid[mkey(due)]) })))
  .sort((a, b) => a.due - b.due);
const goalsMonthly = () => 0; // Goals were removed; old goal data stays in backups but no longer changes the numbers.
const fixedTotal = (cyc) => cycItems(cyc).reduce((s, x) => s + x.amount, 0);
const sumKind = (list, kinds) => list.filter((x) => kinds.includes(x.it.kind)).reduce((s, x) => s + x.amount, 0);
// Salary for a cycle: what actually arrived if you logged it, otherwise your usual salary.
const salaryFor = (cyc) => { const p = S.paylog[cyc.key]; return p && p.amount != null ? Number(p.amount) : (Number(S.profile.salary) || 0); };
// The month you start in is special: you tell Leash what's left, and only bills still ahead come out of it.
// A bill marked paid on or before the day you started was already out of the balance you typed in.
const paidBeforeStart = (x) => { const v = x.it.paid && x.it.paid[x.key]; return !!v && (/^before-/.test(v) || v <= S.created); };
// What the month's spending money is made of, so the app can show its working (e.g. why today is ₹0).
const poolParts = (cyc) => {
  const from = parseKey(S.created);
  if (S.start && S.start.left != null && from >= cyc.start && from < cyc.end) {
    const rows = cycItems(cyc).filter((x) => x.due >= from && !paidBeforeStart(x));
    const out = rows.reduce((s2, x) => s2 + x.amount, 0);
    return { start: true, base: Number(S.start.left), rows, goals: 0, pool: Number(S.start.left) - out };
  }
  const rows = cycItems(cyc); const goals = goalsMonthly();
  return { start: false, base: salaryFor(cyc), rows, goals, pool: salaryFor(cyc) - fixedTotal(cyc) - goals };
};
// Money out of daily spending. Spends paid from savings, ATM withdrawals (the cash counts when you spend it)
// and credit card spends (they leave the bank when the card bill is paid) don't count.
const counts = (sp) => !sp.fromSavings && sp.method !== 'card' && !catOf(sp.cat).withdrawal;
const outflows = () => S.spends.filter(counts);
const spendsBetween = (a, b) => outflows().filter((s) => s.date >= dkey(a) && s.date < dkey(b));
// Finished pay periods: leftovers fill the savings jar and overspending comes off the next period.
const extrasIn = (cyc) => sum(S.income.concat(S.jar.out).filter((x) => x.date >= dkey(cyc.start) && x.date < dkey(cyc.end)));
const spentIn = (cyc) => sum(spendsBetween(cyc.start, cyc.end));
let ledgerMemo = null;
const ledger = () => {
  const today = dkey(today0());
  if (ledgerMemo && ledgerMemo.today === today) return ledgerMemo;
  const periods = [];
  if (Number(S.profile.salary) || S.start) {
    let cyc = cycleFor(parseKey(S.created)); const now = cycleFor(today0());
    while (cyc.key !== now.key && periods.length < 240) { periods.push({ key: cyc.key, pool: poolParts(cyc).pool + extrasIn(cyc), spent: spentIn(cyc) }); cyc = cycleFor(cyc.end); }
  }
  const r = E.closePeriods(periods);
  r.carryInto[cycleFor(today0()).key] = r.carry;
  ledgerMemo = { ...r, today };
  return ledgerMemo;
};
const jarBalance = () => ledger().jar - sum(S.jar.out);
const poolFor = (cyc) => poolParts(cyc).pool + extrasIn(cyc) + (ledger().carryInto[cyc.key] || 0);
const dayCalc = (d) => {
  const cyc = cycleFor(d);
  const pool = poolFor(cyc);
  const before = sum(spendsBetween(cyc.start, d));
  const todaySp = sum(outflows().filter((s2) => s2.date === dkey(d)));
  const daysLeft = Math.max(1, daysBetween(d, cyc.end));
  const limit = E.dailyLimit(pool, before, daysLeft);
  const left = limit - todaySp;
  const tomorrow = daysLeft > 1 ? E.dailyLimit(pool, before + todaySp, daysLeft - 1) : 0;
  return { cyc, pool, before, todaySp, daysLeft, limit, left, tomorrow };
};
const loggedDays = () => { const set = new Set(S.spends.map((s) => s.date)); Object.keys(S.noSpend).forEach((k) => set.add(k)); [].forEach((l) => { if (l.type === 'sent') set.add(l.date); }); return set; };

/* ---------------- tax (new regime, Tax Year 2026-27) ---------------- */
const newRegimeTax = (gross) => {
  const taxable = Math.max(0, gross - 75000);
  const slabs = [[400000, 0], [800000, .05], [1200000, .10], [1600000, .15], [2000000, .20], [2400000, .25], [Infinity, .30]];
  let tax = 0, prev = 0;
  for (const [cap, r] of slabs) { if (taxable > prev) tax += (Math.min(taxable, cap) - prev) * r; prev = cap; }
  if (taxable <= 1200000) tax = 0; else tax = Math.min(tax, taxable - 1200000); // 87A rebate + marginal relief
  return { taxable, tax: Math.round(tax * 1.04) };
};

/* ---------------- smart categories ---------------- */
// Words people actually type for each built-in category. Learned choices (S.learn) always win over these.
const KEYWORDS = {
  groceries: 'groceries grocery vegetables veggies sabzi fruits milk curd eggs bread rice dal atta oil bigbasket blinkit zepto instamart dmart ration kirana'.split(' '),
  junk: 'junk pizza burger fries chips kfc mcdonalds dominos momos samosa puffs chocolate icecream shawarma'.split(' '),
  food: 'swiggy zomato chai tea coffee lunch dinner breakfast snack snacks restaurant biryani juice bakery tiffin mess canteen food dosa idli maggi'.split(' '),
  travel: 'rapido uber ola auto metro bus train cab taxi petrol diesel fuel parking toll irctc flight redbus bike yulu commute ticket'.split(' '),
  home: 'pg furniture kitchen utensils cleaning detergent soap repair plumber maid cook cylinder bucket mattress pillow'.split(' '),
  shop: 'amazon flipkart myntra meesho ajio nykaa clothes dress shoes kurti saree shirt jeans bag shopping mall top'.split(' '),
  gold: 'gold jewellery jewelry chain ring earrings bangle bangles tanishq kalyan malabar'.split(' '),
  bills: 'rent electricity current bill recharge mobile jio airtel bsnl wifi broadband internet dth water emi insurance premium'.split(' '),
  fun: 'movie movies cinema pvr inox netflix prime hotstar spotify party outing trip concert game games'.split(' '),
  care: 'salon parlour parlor haircut gym yoga medicine medicines tablets pharmacy doctor hospital clinic skincare spa apollo medplus'.split(' ')
};
const normNote = (s) => String(s || '').toLowerCase().replace(/[₹\d.,]+/g, ' ').replace(/[^\p{L}\s-]/gu, ' ').replace(/\s+/g, ' ').trim();
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const guessCat = (note) => {
  const t = normNote(note); if (!t) return null;
  const has = (id) => (S.cats.some((c) => c.id === id) ? id : null);
  if (S.learn[t] && has(S.learn[t])) return S.learn[t];
  const words = t.split(' ');
  for (const c of S.cats) { const n = c.name.toLowerCase(); if (n.length > 2 && new RegExp('(^|\\s)' + reEsc(n) + '(\\s|$)').test(t)) return c.id; }
  if (words[0].length > 2) for (const [k, v] of Object.entries(S.learn)) if (has(v) && k.split(' ')[0] === words[0]) return v;
  for (const [id, keys] of Object.entries(KEYWORDS)) {
    if (!has(id)) continue;
    if (words.some((w) => keys.includes(w) || (w.length > 4 && keys.some((k) => k.length > 3 && w.startsWith(k))))) return id;
  }
  return null;
};
const learn = (note, cat) => {
  const t = normNote(note); if (!t || !cat) return;
  delete S.learn[t]; S.learn[t] = cat;
  const keys = Object.keys(S.learn); if (keys.length > 400) keys.slice(0, keys.length - 400).forEach((k) => delete S.learn[k]);
};
/* ---------------- money sent home ---------------- */

/* ---------------- how a spend was paid ---------------- */
const METHODS = [['upi', 'UPI'], ['cash', 'Cash'], ['card', 'Credit card']];
const fyKey = (d) => { const y = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1; return y + '-' + String(y + 1).slice(2); };

/* ---------------- market (gold + news) ---------------- */
const market = () => S.market || window.KH_MARKET || { gold: null, news: { items: [] } };
const refreshMarket = async () => {
  const url = window.KH_MARKET_URL;
  if (!url) return;
  try {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) return;
    const m = await r.json();
    if (m && m.gold && +m.gold.r24 > 0 && m.news && Array.isArray(m.news.items)) { S.market = m; window.KH_LIVE = true; trackGold(); save(); render(); }
  } catch (e) { /* offline: keep the cached copy */ }
};
const PURITY = { 24: 0.999, 22: 0.916, 18: 0.75, 14: 0.585 };
// Rate per gram for a purity. Uses the quoted 22K rate when the 24K rate hasn't been edited, otherwise scales by purity.
const goldRate = (k, r24) => {
  const g = market().gold; const base = r24 != null ? Number(r24) : (g && g.r24) || 0;
  k = Number(k) || 22;
  if (k === 24) return base;
  if (k === 22 && g && g.r22 && (r24 == null || Number(r24) === g.r24)) return g.r22;
  return base * (PURITY[k] || PURITY[22]) / PURITY[24];
};
const newsId = (n) => 'n' + hash((n.title || '') + '|' + (n.src || ''));
const safeUrl = (u) => (/^https:\/\//i.test(u || '') ? u : '#');

/* ---------------- native bridges (Capacitor) ---------------- */
const Cap = window.Capacitor;
const isNative = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform());
const plugin = (name) => { try { return isNative && Cap.registerPlugin ? Cap.registerPlugin(name) : null; } catch (e) { return null; } };
const LN = plugin('LocalNotifications');
const FS = plugin('Filesystem');
const SH = plugin('Share');

const occurrences = (it, fromDate, count) => {
  const out = []; let d = new Date(fromDate.getFullYear(), fromDate.getMonth(), 1);
  for (let i = 0; i < 40 && out.length < count; i++) {
    const due = onDay(d.getFullYear(), d.getMonth(), Number(it.day) || 1);
    const m = mkey(due);
    if ((!it.start || m >= it.start.slice(0, 7)) && (!it.end || m <= it.end.slice(0, 7)) && due >= fromDate) out.push(due);
    d = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  }
  return out;
};
const reminderText = (it, due) => {
  const amt = Number(it.amount) ? ' · ' + inr(it.amount) : '';
  if (it.kind === 'remind') return { title: it.name, body: it.note || ('Reminder for ' + short(due) + '.') };
  if (it.kind === 'home') return { title: 'Sending money home on ' + short(due) + amt, body: 'Mark it sent in Leash when it goes.' };
  if (it.kind === 'save') return { title: it.name + ' on ' + short(due) + amt, body: 'Future you says thank you in advance.' };
  return { title: it.name + ' due on ' + short(due) + amt, body: it.end ? 'Repeats monthly until ' + MON[Number(it.end.slice(5, 7)) - 1] + ' ' + it.end.slice(0, 4) + ', then this reminder retires.' : 'Pay it, then mark it paid in Leash.' };
};
const scheduleNotifications = async () => {
  if (!LN) return;
  try {
    const perm = await LN.checkPermissions();
    if (perm.display !== 'granted') { const r = await LN.requestPermissions(); if (r.display !== 'granted') return; }
    const pending = await LN.getPending();
    if (pending.notifications && pending.notifications.length) await LN.cancel({ notifications: pending.notifications.map((n) => ({ id: n.id })) });
    const list = []; const now = new Date();
    if (S.settings.billReminders) {
      S.items.forEach((it) => {
        if (it.remindBefore === -1) return;
        occurrences(it, today0(), 4).forEach((due) => {
          const at = addDays(due, -(Number(it.remindBefore) || 0)); at.setHours(S.settings.remindHour || 9, 0, 0, 0);
          if (at <= now) return;
          const t = reminderText(it, due);
          list.push({ id: hash(it.id + dkey(due)) % 2000000000, title: t.title, body: t.body, schedule: { at, allowWhileIdle: true } });
        });
      });
    }
    if (S.settings.billReminders && S.profile.salary) {
      nextPaydays(2).forEach((p, i) => {
        const at = new Date(p); at.setHours(S.settings.remindHour || 9, 30, 0, 0);
        if (at > now) list.push({ id: 1890000000 + i, title: 'Payday 🎉', body: 'Once your salary lands, tap "Yes" in Leash so this month is planned from the real amount.', schedule: { at, allowWhileIdle: true } });
      });
    }
    if (S.settings.billReminders && S.features.reminders) {
      S.reminders.filter((r) => !r.done && r.date).forEach((r) => {
        const at = parseKey(r.date); at.setHours(S.settings.remindHour || 9, 0, 0, 0);
        if (at > now) list.push({ id: hash('rem' + r.id) % 2000000000, title: r.text, body: 'Your reminder for today.', schedule: { at, allowWhileIdle: true } });
      });
    }
    if (S.settings.roast) {
      const [h, m] = (S.settings.roastTime || '21:00').split(':').map(Number);
      for (let i = 0; i < 7; i++) {
        const at = addDays(today0(), i); at.setHours(h, m, 0, 0);
        if (at <= now) continue;
        list.push({ id: 1900000000 + i, title: 'How was today?', body: 'Tell Ellie what you spent. It only takes a moment.', schedule: { at, allowWhileIdle: true } });
      }
    }
    list.sort((a, b) => a.schedule.at - b.schedule.at);
    if (list.length) await LN.schedule({ notifications: list.slice(0, 60) });
  } catch (e) { /* notifications are best-effort */ }
};

/* ---------------- UI primitives ---------------- */
const toast = (msg) => { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2400); };
const banner = (title, body, when = 'now') => {
  const host = $('#banners');
  host.querySelectorAll('.glass').forEach((o) => { o.classList.remove('show'); setTimeout(() => o.remove(), 450); });
  const b = document.createElement('button');
  b.className = 'glass'; b.type = 'button';
  b.innerHTML = '<span class="gi">₹</span><span class="gb"><div><b>' + esc(title) + '</b><small>' + esc(when) + '</small></div><span>' + esc(body) + '</span></span>';
  b.addEventListener('click', () => dismiss());
  host.appendChild(b);
  requestAnimationFrame(() => requestAnimationFrame(() => b.classList.add('show')));
  const dismiss = () => { b.classList.remove('show'); setTimeout(() => b.remove(), 450); };
  setTimeout(dismiss, 6000);
};
const catOf = (id) => S.cats.find((c) => c.id === id) || { name: 'Other', icon: 'dots', c: 2 };
/* 3D icons (Microsoft Fluent Emoji, MIT licence, bundled in icons/). Each one sits on a soft pastel tile.
   Categories without a picture get their first letter on the tile instead. */
const TONES = { peach: ['#FFE6D6', '#FFD2B8', '#6E3412'], lav: ['#ECE4FA', '#DCCDF6', '#45307A'], mint: ['#DDF2E3', '#C3E8CF', '#1F5C37'], sky: ['#DDEBFA', '#C6DCF5', '#1D4775'], pink: ['#FCE1EA', '#F7CBDA', '#7A2446'], butter: ['#FFF1C9', '#FBE29F', '#6B4A00'] };
const TONE_ORDER = ['butter', 'peach', 'sky', 'lav', 'mint', 'pink'];
const CAT3D = { food: 'hamburger', junk: 'french_fries', travel: 'motor_scooter', home: 'house', groceries: 'shopping_cart', shop: 'shopping_bags', gold: 'coin', bills: 'receipt', fun: 'party_popper', care: 'lotion_bottle', atm: 'bank', other: 'money_with_wings' };
const catTone = (c) => TONES[c.tone || TONE_ORDER[(Number(c.c) || 0) % TONE_ORDER.length]];
const tile3d = (pic, tone, size, letter) => '<span class="ic3" style="background:' + tone[1] + ';color:' + tone[2] + (size ? ';width:' + size + 'px;height:' + size + 'px' : '') + '">' +
  (pic ? '<img src="icons/' + pic + '.png" alt="" draggable="false">' : '<b>' + esc(letter || '?') + '</b>') + '</span>';
const catIc = (c, size) => tile3d(CAT3D[c.id], catTone(c), size, (c.name || '?').charAt(0).toUpperCase());
// Monthly payments: picked by kind, with a few names that deserve their own picture.
const itemPic = (it) => (/\b(pg|rent|room|hostel)\b/i.test(it.name) ? ['bed', 'sky'] : /card/i.test(it.name) ? ['credit_card', 'pink']
  : it.kind === 'home' ? ['house', 'peach'] : it.kind === 'emi' ? ['bank', 'lav'] : it.kind === 'save' ? ['seedling', 'mint'] : it.kind === 'sub' ? ['spiral_calendar', 'sky'] : it.kind === 'remind' ? ['bell', 'butter'] : ['receipt', 'butter']);
const itemIc = (it, size) => { const [pic, tone] = itemPic(it); return tile3d(pic, TONES[tone], size); };
const IN3D = { gift: 'wrapped_gift', bonus: 'party_popper', cashback: 'coin', other: 'money_bag' };

// Calendar date picker: a month grid that drops down under its field (or stays open with inline).
const fmtDate = (d) => DAY[d.getDay()].slice(0, 3) + ', ' + d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear();
const calGrid = (view, sel, min) => {
  const [y, m] = view.split('-').map(Number); const lead = (new Date(y, m - 1, 1).getDay() + 6) % 7; const n = dim(y, m - 1); const tk = dkey(today0());
  let h = '<div class="cphead"><button type="button" class="iconbtn" data-act="cp-nav" data-dir="-1" aria-label="Previous month">' + ico('back') + '</button><b>' + MONTH[m - 1] + ' ' + y + '</b>' +
    '<button type="button" class="iconbtn" data-act="cp-nav" data-dir="1" aria-label="Next month">' + ico('chev') + '</button></div><div class="cpgrid">' + ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d) => '<span>' + d + '</span>').join('');
  for (let i = 0; i < lead; i++) h += '<span></span>';
  for (let d = 1; d <= n; d++) {
    const k = y + '-' + pad2(m) + '-' + pad2(d);
    h += '<button type="button" data-act="cp-pick" data-v="' + k + '" aria-pressed="' + (k === sel) + '"' + (k === tk ? ' class="today"' : '') + (min && k < min ? ' disabled' : '') + ' aria-label="' + fmtDate(parseKey(k)) + '">' + d + '</button>';
  }
  return h + '</div>';
};
const calPicker = (name, value, label, opts = {}) => {
  const v = value || ''; const view = (v || dkey(today0())).slice(0, 7);
  const clear = opts.empty && !opts.inline ? '<button type="button" class="link" data-act="cp-clear">' + esc(opts.empty) + '</button>' : '';
  return '<div class="field cp' + (opts.inline ? ' inline' : '') + '" data-view="' + view + '" data-min="' + (opts.min || '') + '"' + (opts.empty ? ' data-empty="' + esc(opts.empty) + '"' : '') + '>' +
    (label ? '<span class="flabel">' + label + '</span>' : '') +
    (opts.inline ? '' : '<button type="button" class="input cpbtn" data-act="cp-toggle" aria-haspopup="true" aria-expanded="false"><span>' + (v ? fmtDate(parseKey(v)) : esc(opts.empty || 'Pick a date')) + '</span>' + ico('cal') + '</button>') +
    '<div class="cpop"' + (opts.inline ? '' : ' hidden') + '>' + calGrid(view, v, opts.min) + clear + '</div>' +
    '<input type="hidden" name="' + name + '" value="' + v + '"></div>';
};
const closePickers = () => document.querySelectorAll('.cp:not(.inline) .cpop:not([hidden])').forEach((g) => { g.hidden = true; const b = g.parentElement.querySelector('.cpbtn'); if (b) b.setAttribute('aria-expanded', 'false'); });
const dayLabel = (v) => (Number(v) >= 31 ? 'Last day' : ordinal(v));
const SHIFTS = [['none', 'On that day'], ['before', 'Friday before'], ['after', 'Monday after']];
const payRule = (day = S.profile.payday, shift = S.profile.payShift) => (Number(day) >= 31 ? 'Last day of the month' : 'The ' + ordinal(day) + ' of every month') +
  (shift === 'before' ? ', or the Friday before a weekend' : shift === 'after' ? ', or the Monday after a weekend' : '');
const payPreview = (day, shift) => payRule(day, shift) + '.<br>Next paydays: <b>' + nextPaydays(3, day, shift).map((d) => DAY[d.getDay()].slice(0, 3) + ' ' + short(d)).join('</b> · <b>') + '</b>';
// Payday: pick any salary date on the calendar; Leash repeats that day every month (e.g. the 30th, counted until next month's 30th).
const paydayFields = (day, shift, inline) => {
  const nominal = nextPaydays(1, day, 'none')[0] || today0();
  return calPicker('payDate', dkey(nominal), inline ? 'Tap the date your salary arrives' : 'Salary date', { inline }) +
    '<label class="check"><input type="checkbox" name="payLast" value="1"' + (Number(day) >= 31 ? ' checked' : '') + '><span>It\'s always the last day of the month</span></label>' +
    '<div class="field"><span class="flabel">If that day is a Saturday or Sunday, salary comes</span><div class="seg">' + SHIFTS.map(([v, l]) => '<button type="button" aria-pressed="' + ((shift || 'none') === v) + '" data-act="simple-seg" data-v="' + v + '">' + l + '</button>').join('') +
    '</div><input type="hidden" name="payShift" value="' + esc(shift || 'none') + '"></div>' +
    '<p class="pdprev" data-pd-preview aria-live="polite">' + payPreview(day, shift) + '</p>';
};
const readPayday = (form) => {
  const d = (form.querySelector('input[name=payDate]') || {}).value; const last = (form.querySelector('input[name=payLast]') || {}).checked;
  return { day: last ? 31 : (d ? parseKey(d).getDate() : 1), shift: (form.querySelector('input[name=payShift]') || {}).value || 'none' };
};
const updatePaydayPreview = (el) => {
  const form = el.closest('form'); const out = form && form.querySelector('[data-pd-preview]'); if (!out) return;
  const p = readPayday(form); out.innerHTML = payPreview(p.day, p.shift);
};
const repeatHint = (k) => { if (!k) return ''; const d = parseKey(k).getDate(); return 'Repeats every month on the ' + (d >= 31 ? 'last day' : ordinal(d)) + '.'; };
const onPicked = (f) => {
  updatePaydayPreview(f);
  const form = f.closest('form'); const rule = form && form.querySelector('[data-repeat]');
  if (rule && f.querySelector('input[name=first]')) rule.textContent = repeatHint(f.querySelector('input[name=first]').value);
};

/* ---------------- navigation ----------------
   Four tabs. Detail screens open on top of the tab they came from and remember the way back,
   so Settings → Bills → back lands on Settings again. */
// Four tabs in a bar at the top, every one a single tap away. Your initial (top left) opens Settings.
let tab = 'money'; let view = null; const stack = [];
const TABS = [['money', 'Money', 'wallet'], ['bills', 'Bills', 'receipt'], ['jar', 'Jar', 'jar'], ['gold', 'Gold', 'gem']];
const TAB_TITLE = { money: 'Money', bills: 'Bills', jar: 'Jar', gold: 'Gold' };
const viewTitle = (v) => {
  if (!v) return '';
  if (v.startsWith('mod:')) { const m = MODS.find((x) => x.id === v.slice(4)); return m ? m.title : ''; }
  return { statement: 'This month', settings: 'Settings', allbills: 'All bills', cats: 'Categories', news: 'Money news', tax: 'Tax', emi: 'EMI payoff', reminders: 'Reminders' }[v] || '';
};
const backBtn = () => { const p = stack[stack.length - 1]; const label = p ? (p.view ? viewTitle(p.view) : TAB_TITLE[p.tab]) : TAB_TITLE[tab]; return '<button class="back" data-act="close-view">' + ico('back', 2.2) + esc(label) + '</button>'; };
const chev = '<span class="chev">' + ico('chev') + '</span>';
const navRow = (act, icon, title, sub, extra) => '<button class="row nav" data-act="' + act + '"' + (extra || '') + '><span class="ic soft">' + ico(icon) + '</span><span class="grow"><b>' + title + '</b>' + (sub ? '<span>' + sub + '</span>' : '') + '</span>' + chev + '</button>';

/* ---------------- screens ---------------- */

const roastLine = (c) => {
  const sp = S.spends.filter((s2) => s2.date === dkey(today0()) && counts(s2));
  if (!sp.length) return { b: 'Zero spends today. Either you are a monk, or you forgot to log the chai.', s: 'Log it now or enjoy the halo.' };
  const byCat = {}; sp.forEach((s2) => { byCat[s2.cat] = (byCat[s2.cat] || 0) + Number(s2.amt); });
  const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
  const name = catOf(top[0]).name.toLowerCase(); const pct = Math.round(top[1] / Math.max(1, c.todaySp) * 100);
  const travelN = sp.filter((s2) => s2.cat === 'travel').length;
  const lines = { food: name + ' took ' + pct + '% of today. The PG kitchen misses you.', travel: travelN >= 3 ? travelN + ' rides today. Your legs have filed a missing-person report.' : 'Travel was ' + pct + '% of today. Fair, the city is big.', groceries: 'Groceries led today. Cooking at home? Your wallet says thank you.', shop: 'Shopping was ' + pct + '% of today. "It was on sale" is not a savings plan.', fun: 'Fun ate ' + pct + '% of today. No regrets, just receipts.' };
  if (c.left < 0) return { b: inr(-c.left) + ' over today, mostly ' + name + '. Tomorrow you get a little less. That is the deal.', s: 'Tomorrow: ' + inr(c.tomorrow) + '.' };
  return { b: lines[top[0]] || (inr(c.todaySp) + ' today, mostly ' + name + '. Respectable. Mildly suspicious, but respectable.'), s: inr(c.left) + ' left, rolling into tomorrow.' };
};

// When there's nothing to spend, show the sum that got there instead of a bare ₹0.
const whyZero = (c) => {
  if (c.pool > 0 || !(S.profile.salary || S.start)) return '';
  const pp = poolParts(c.cyc);
  const unpaid = pp.rows.filter((x) => !x.paid);
  return '<section class="why" aria-label="Why safe to spend is zero"><b>Why ₹0?</b>' +
    '<div class="whyrows"><div><span>' + (pp.start ? 'Money you said was left on ' + short(parseKey(S.created)) : 'Salary this cycle') + '</span><b class="num">' + inr(pp.base) + '</b></div>' +
    pp.rows.map((x) => '<div><span>− ' + esc(x.it.name) + ' · ' + (x.paid ? 'paid' : short(x.due)) + '</span><b class="num">' + inr(x.amount) + '</b></div>').join('') +
    (pp.goals ? '<div><span>− Monthly goals</span><b class="num">' + inr(pp.goals) + '</b></div>' : '') +
    '<div class="tot"><span>Left for ' + c.cyc.days + ' days</span><b class="num">' + (pp.pool < 0 ? '−' + inr(-pp.pool) : inr(pp.pool)) + '</b></div></div>' +
    (pp.start && unpaid.length ? '<p class="hint">Already paid or sent any of these before you typed that balance? Mark it paid in Money and it stops being taken out again.</p>' : '') +
    '<button class="btn soft sm" data-act="bills">Open Bills</button></section>';
};

const whenTxt = (dd) => (dd < 0 ? -dd + 'd late' : dd === 0 ? 'Today' : dd === 1 ? 'Tomorrow' : 'In ' + dd + ' days');

/* ---------------- money tab ---------------- */
let ellieFlash = null; // a short reaction after you tell Ellie something
let thinking = false;
const CHAT_LIMIT = 12;
const chatToday = () => S.chat.filter((m) => m.day === dkey(today0())).slice(-CHAT_LIMIT);
let scrollChat = false;
const say = (who, text, extra) => { scrollChat = true; S.chat = chatToday().concat([{ id: uid(), day: dkey(today0()), at: Date.now(), who, text, ...extra }]); };
const spentThisPeriod = (c) => c.before + c.todaySp;
const currentMood = (c, t) => (ellieFlash && Date.now() - ellieFlash.at < 8000 ? ellieFlash.mood : E.moodFor({
  pool: c.pool, spent: spentThisPeriod(c), left: c.pool - spentThisPeriod(c), daysPassed: daysBetween(c.cyc.start, t) + 1, days: c.cyc.days,
  noSpendToday: !!S.noSpend[dkey(t)] && !c.todaySp }));
const chatRow = (r) => '<div class="crow">' + (r.cat ? catIc(catOf(r.cat), 28) : '<span class="ic soft">' + ico(r.icon || 'wallet') + '</span>') + '<span>' + esc(r.label) + '</span><b class="num">' + inr(r.amt) + '</b></div>';
const chatBubble = (m) => {
  if (m.who === 'me') return '<div class="bub me">' + esc(m.text) + '</div>';
  return '<div class="bub ellie">' + (m.text ? '<p>' + esc(m.text.replace(/^₹[\d,]+ is safe today\.$/, 'Got it!')) + '</p>' : '') + (m.rows ? m.rows.map(chatRow).join('') : '') +
    (m.ask ? '<div class="askbtns"><button class="btn sm" data-act="ask-pay" data-id="' + m.id + '">Yes, it\'s my pay</button><button class="btn soft sm" data-act="ask-spend" data-id="' + m.id + '">No, I spent it</button></div>' : '') +
    (m.undo ? '<button class="link" data-act="chat-undo" data-id="' + m.id + '">Undo</button>' : '') + '</div>';
};
const signed = (n) => (n < 0 ? '−' + inr(-n) : inr(n));
// Money tab: what's safe today, what went out and came in, and where it went, one row per kind of payment
// or spending category (biggest first). Every row opens the month's statement.
const renderHome = () => {
  const t = today0(); const c = dayCalc(t); const cyc = c.cyc; const pp = poolParts(cyc);
  const leftTill = c.pool - c.before - c.todaySp;
  const fill = c.pool > 0 ? clamp(leftTill / c.pool * 100, 3, 100) : 3;
  const latest = chatToday().filter((m) => m.who === 'ellie').pop();
  const showBubble = thinking || (latest && (latest.ask || Date.now() - (latest.at || 0) < 5 * 60000));
  const payDue = daysBetween(cyc.start, t) <= 6 && !S.paylog[cyc.key] && !(S.start && parseKey(S.created) >= cyc.start);
  const wentOut = pp.rows.reduce((n, x) => n + x.amount, 0) + spentIn(cyc);
  const cameIn = pp.base + extrasIn(cyc);
  // Where it went: grouped monthly payments, then spending by category.
  const rows = [];
  const grp = (kind, name, pic, tone) => { const list = pp.rows.filter((x) => x.it.kind === kind && !itemPic(x.it)[0].match(/bed|credit_card/));
    if (list.length) rows.push({ pic, tone, name, sub: list.length > 1 ? list.map((x) => x.it.name).join(', ') : (list[0].paid ? 'Paid' : 'Due ' + short(list[0].due)), amt: list.reduce((n, x) => n + x.amount, 0) }); };
  grp('home', 'Home', 'house', 'peach'); grp('emi', 'Loans and EMIs', 'bank', 'lav'); grp('save', 'Saved', 'seedling', 'mint');
  pp.rows.filter((x) => !['home', 'emi', 'save'].includes(x.it.kind) || /bed|credit_card/.test(itemPic(x.it)[0])).forEach((x) => { const [pic, tone] = itemPic(x.it); rows.push({ pic, tone, name: x.it.name, sub: x.paid ? 'Paid' : 'Due ' + short(x.due), amt: x.amount }); });
  const byCat = {}; S.spends.filter((sp) => sp.date >= dkey(cyc.start) && sp.date < dkey(cyc.end) && !sp.fromSavings && !catOf(sp.cat).withdrawal)
    .forEach((sp) => { const b = byCat[sp.cat] = byCat[sp.cat] || { n: 0, amt: 0, card: 0 }; b.n++; b.amt += Number(sp.amt) || 0; if (sp.method === 'card') b.card += Number(sp.amt) || 0; });
  Object.entries(byCat).forEach(([id, b]) => { const ct = catOf(id); rows.push({ cat: ct, name: ct.name, sub: b.n + ' spend' + (b.n === 1 ? '' : 's') + (b.card ? ', ' + inr(b.card) + ' on card' : ''), amt: b.amt }); });
  rows.sort((a, b) => b.amt - a.amt);
  const row = (r) => { const tone = r.cat ? catTone(r.cat) : TONES[r.tone];
    return '<button class="wrow3" data-act="statement" style="background:' + tone[0] + ';color:' + tone[2] + '">' + (r.cat ? catIc(r.cat, 46) : tile3d(r.pic, tone, 46)) +
      '<span class="grow"><b>' + esc(r.name) + '</b><span>' + esc(r.sub) + '</span></span><b class="num">' + inr(r.amt) + '</b></button>'; };
  return '<div class="screen home">' +
    '<section class="jarhero" aria-label="Safe to spend today"><span class="jarart" aria-hidden="true"><i class="lid"></i><i class="body"><i class="fill" style="height:' + fill + '%"></i></i></span>' +
      '<span class="jartxt"><span class="k">Safe to spend today</span><b class="num' + (c.left < 0 ? ' over' : '') + '">' + signed(c.left) + '</b>' +
      '<button class="jarsub" data-act="limit-info">' + signed(leftTill) + ' left · ' + c.daysLeft + ' day' + (c.daysLeft === 1 ? '' : 's') + ' to payday</button></span></section>' +
    (S.profile.salary || S.start ? '' : '<button class="btn soft" data-act="edit-profile">Add your salary to see your number</button>') +
    whyZero(c) +
    (payDue ? '<section class="group padded stack"><b>Did your pay come?</b><div class="btns"><button class="btn sm" data-act="pay-yes">Yes, it came</button><button class="btn soft sm" data-act="pay-other">Different amount</button></div></section>' : '') +
    (showBubble ? '<section class="chat" aria-label="Ellie\'s latest reply" aria-live="polite">' + (thinking ? '<div class="bub ellie dots3"><i></i><i></i><i></i></div>' : chatBubble(latest)) + '</section>' : '') +
    '<div class="flowcards"><button class="flow out" data-act="statement"><img src="icons/money_with_wings.png" alt=""><span>Went out</span><b class="num">' + inr(wentOut) + '</b></button>' +
      '<button class="flow in" data-act="statement"><img src="icons/money_bag.png" alt=""><span>Came in</span><b class="num">' + inr(cameIn) + '</b></button></div>' +
    '<div class="sechead"><h2>Where it went</h2><button class="link" data-act="statement">' + MONTH[cycMonth(cyc).getMonth()] + '</button></div>' +
    (rows.length ? '<div class="wlist3">' + rows.map(row).join('') + '</div>' : '<p class="empty">Nothing yet this month. Tap + when you spend.</p>') +
    '<button class="link centered" data-act="statement">See every entry</button>' +
    '<div class="fabs"><button class="micfab" data-act="mic" aria-label="Speak a spend">' + ico('mic') + '</button><button class="addfab" data-act="add" aria-label="Add money">' + ico('plus', 2.6) + '</button></div>' +
    '</div>';
};

// Bills tab: this month's payments with a clear state. Green = paid, yellow = to pay, red = due tomorrow, today or late.
const billState = (x, t) => { if (x.paid) return 'paid'; const dd = daysBetween(t, x.due); return dd <= 1 ? 'late' : 'due'; };
const billPill = (x, t) => { const st = billState(x, t); const dd = daysBetween(t, x.due); const home = x.it.kind === 'home';
  const label = st === 'paid' ? ico('check', 3) + (home ? 'Sent' : 'Paid') : st === 'late' ? '! ' + (dd < 0 ? -dd + 'd late' : dd === 0 ? 'Due today' : 'Due tomorrow') : 'Due ' + short(x.due);
  return '<button class="bpill st-' + st + '" data-act="toggle-paid" data-id="' + x.it.id + '" data-key="' + x.key + '" aria-pressed="' + x.paid + '" aria-label="' + esc(x.it.name) + ': ' + (x.paid ? 'paid, tap to undo' : 'tap when paid') + '">' + label + '</button>'; };
const billRow3 = (x, t) => { const e = x.it.kind === 'emi' ? emiInfo(x.it) : null;
  const sub = e ? (e.left ? e.left + ' left · ends ' + e.freeBy : 'Last one') : (KINDS[x.it.kind] || 'Bill') + ' · every month';
  return '<div class="brow">' + '<button class="bmain" data-act="edit-item" data-id="' + x.it.id + '">' + itemIc(x.it, 46) + '<span class="grow"><b>' + esc(x.it.name) + '</b><span>' + esc(sub) + '</span></span></button>' +
    '<span class="bend"><b class="num">' + inr(x.amount) + '</b>' + billPill(x, t) + '</span></div>'; };
const renderBillsTab = () => {
  const t = today0(); const cyc = cycleFor(t); const next = cycleFor(cyc.end);
  const now = cycItems(cyc); const later = cycItems(next).filter((x) => !now.some((y) => y.it.id === x.it.id && y.key === x.key));
  const unpaid = now.filter((x) => !x.paid); const late = unpaid.filter((x) => billState(x, t) === 'late');
  const total = now.reduce((n, x) => n + x.amount, 0); const owe = unpaid.reduce((n, x) => n + x.amount, 0);
  const summary = !now.length ? '' : !unpaid.length
    ? '<section class="bsum st-paid"><img src="icons/check_mark_button.png" alt=""><span><b>All ' + now.length + ' paid</b><span>' + inr(total) + ' done for ' + MONTH[cycMonth(cyc).getMonth()] + '</span></span></section>'
    : '<section class="bsum st-' + (late.length ? 'late' : 'due') + '"><img src="icons/' + (late.length ? 'bell' : 'hourglass_not_done') + '.png" alt=""><span><b>' + unpaid.length + ' to pay · ' + inr(owe) + '</b><span>' + esc(unpaid[0].it.name) + ' is due ' + (daysBetween(t, unpaid[0].due) <= 1 ? whenTxt(daysBetween(t, unpaid[0].due)).toLowerCase() : 'on ' + short(unpaid[0].due)) + '</span></span></section>';
  return '<div class="screen bills">' + summary +
    '<div class="legend" aria-label="What the colours mean"><span class="bpill st-paid">' + ico('check', 3) + 'Paid</span><span class="bpill st-due">To pay</span><span class="bpill st-late">! Due tomorrow or late</span></div>' +
    (now.length ? '<div class="blist">' + now.map((x) => billRow3(x, t)).join('') + '</div>'
      : '<section class="group padded stack"><p class="empty">Rent, EMIs, PPF, money for home: add them once and Leash takes them out before your daily number.</p></section>') +
    (later.length ? '<div class="sechead"><h2>Next month</h2><span class="aside">From ' + short(next.start) + '</span></div><div class="blist">' + later.map((x) => billRow3(x, t)).join('') + '</div>' : '') +
    '<div class="btns"><button class="btn" data-act="new-item">' + ico('plus') + 'Add a bill</button><button class="btn soft" data-act="allbills">See all</button></div>' +
    '</div>';
};

// Jar tab: leftover money from each finished month, ready to take out.
const renderJarTab = () => {
  const jar = jarBalance(); const closed = ledger().closed.filter((x) => x.toJar > 0).reverse();
  const c = dayCalc(today0()); const leftTill = Math.max(0, c.pool - c.before - c.todaySp);
  const fill = jar > 0 ? clamp(jar / Math.max(jar, Number(S.profile.salary) || jar) * 100 + 10, 12, 92) : 6;
  return '<div class="screen jar">' +
    '<section class="bigjar" aria-label="Savings jar balance"><span class="jarart big" aria-hidden="true"><i class="lid"></i><i class="body"><i class="fill" style="height:' + fill + '%"></i></i></span>' +
      '<b class="num">' + inr(jar) + '</b><span>' + (jar > 0 ? 'Saved from your leftover money' : 'On payday, whatever is left drops in here') + '</span></section>' +
    '<div class="brow"><span class="bmain">' + tile3d('spiral_calendar', TONES.sky, 46) + '<span class="grow"><b>Next drop</b><span>' + DAY[c.cyc.end.getDay()] + ', ' + short(c.cyc.end) + '</span></span></span><span class="bend"><b class="num">up to ' + inr(leftTill) + '</b></span></div>' +
    (closed.length ? '<div class="sechead"><h2>Dropped in</h2></div><section class="group">' + closed.map((x) => '<div class="row"><span class="grow"><b>From ' + short(parseKey(x.key)) + ' pay</b></span><b class="num">' + inr(x.toJar) + '</b></div>').join('') + '</section>' : '') +
    (S.jar.out.length ? '<div class="sechead"><h2>Taken out</h2></div><section class="group">' + S.jar.out.slice().reverse().map((x) => '<div class="row"><span class="grow"><b>' + short(parseKey(x.date)) + '</b></span><b class="num">−' + inr(x.amt) + '</b></div>').join('') + '</section>' : '') +
    '<button class="btn full" data-act="jar-out">Take out</button></div>';
};

// Gold tab: the shiny gold and silver lockers, as before, on one page.
const renderGoldTab = () => {
  const gt = goldTotals(); const st = silverTotals(); const need = S.goldTarget ? Math.max(0, S.goldTarget - gt.grams) : 0;
  return '<div class="screen goldtab">' + goldCard(gt, true) +
    '<section class="group">' + (S.gold.length ? S.gold.map((x) => '<button class="row" data-act="edit-gold" data-id="' + x.id + '"><span class="grow"><b>' + esc(x.note || 'Gold') + '</b><span>' + x.karat + 'K' + (x.date ? ' · ' + short(parseKey(x.date)) : '') + '</span></span><b class="num">' + x.grams + ' g</b></button>').join('')
      : '<p class="empty">Add a chain, ring or coin to see what it\'s worth today.</p>') + '</section>' +
    '<div class="goldsell"><span>If you sold today</span><b class="num">' + inr(gt.sell) + '</b><span>after a ' + S.goldCut + '% jeweller\'s cut</span>' +
      '<div class="seg">' + [2, 5, 8, 10].map((n) => '<button aria-pressed="' + (Number(S.goldCut) === n) + '" data-act="gold-cut" data-v="' + n + '">' + n + '%</button>').join('') + '</div></div>' +
    '<section class="gold silver lg"><div class="gl"><span class="gk">' + ico('gem') + 'Silver locker</span><span class="gv num">' + st.grams + ' g</span><span class="gs">' + (st.grams ? 'Worth about ' + inr(st.value) : 'Add your silver to see its value') + '</span>' +
      (st.g ? '<span class="gs rate">' + esc(st.g.date) + ': ' + inr(st.g.r999) + ' a gram</span>' : '<span class="gs rate">Silver rate not available yet</span>') + '</div></section>' +
    (S.silver.length ? '<section class="group">' + S.silver.map((x) => '<button class="row" data-act="edit-silver" data-id="' + x.id + '"><span class="grow"><b>' + esc(x.note || 'Silver') + '</b></span><b class="num">' + x.grams + ' g</b></button>').join('') + '</section>' : '') +
    '<button class="btn soft full" data-act="add-silver">Add silver</button>' +
    '<section class="group padded stack"><div class="split"><b>Gold goal</b><button class="link" data-act="gold-goal">' + (S.goldTarget ? 'Change' : 'Set one') + '</button></div>' +
      (S.goldTarget ? '<p class="hint">' + (need ? need.toFixed(2) + ' g to go ≈ ' + inr(need * goldRate(22)) + ' at today\'s 22K rate.' : 'Goal reached. Shiny.') + '</p>' : '<p class="hint">Pick a number of grams to own, and Leash tracks how close you are.</p>') + '</section>' +
    (gt.g && gt.g.src ? '<p class="hint centered">Rates from ' + esc(gt.g.srcName || 'source') + '. City rates vary.</p>' : '') + '</div>';
};

/* ---------------- money in: gifts, bonus, cashback ---------------- */
const IN_KINDS = [['gift', 'Gift', 'gift'], ['bonus', 'Bonus', 'star'], ['cashback', 'Cashback', 'repeat'], ['other', 'Other', 'wallet']];
const inKind = (k) => IN_KINDS.find((x) => x[0] === k) || IN_KINDS[3];
const addMoneyIn = (amt, kind, note, date) => { const x = { id: uid(), amt, kind: kind || 'other', note: (note || '').trim(), date: date || dkey(today0()) }; S.income.push(x); return x; };
const moneyInSheet = (x) => {
  const seg = (name, val, opts) => '<input type="hidden" name="' + name + '" value="' + val + '"><div class="seg">' + opts.map(([v, l]) => '<button type="button" aria-pressed="' + (val === v) + '" data-act="simple-seg" data-v="' + v + '">' + l + '</button>').join('') + '</div>';
  openSheet(shead(x ? 'Edit money in' : 'Money in') + (x ? '' : '<div class="seg inout three"><button type="button" data-act="to-spend">Spent</button><button type="button" data-act="to-pay">Pay</button><button type="button" aria-pressed="true">Came in</button></div>') +
    '<form data-form="moneyin" class="stack">' +
    '<div class="field"><label for="mi-amt">How much?</label><input class="input" id="mi-amt" name="amt" inputmode="numeric" placeholder="₹" value="' + (x ? x.amt : '') + '"></div>' +
    '<div class="field"><span class="flabel">What was it?</span>' + seg('kind', x ? x.kind || 'other' : 'gift', IN_KINDS.map(([v, l]) => [v, l])) + '</div>' +
    '<div class="field"><label for="mi-note">From (optional)</label><input class="input" id="mi-note" name="note" placeholder="Office, a friend, family" value="' + esc(x ? x.note || '' : '') + '"></div>' +
    '<div class="field"><label for="mi-date">Date</label><input class="input" type="date" id="mi-date" name="date" value="' + (x ? x.date : dkey(today0())) + '"></div>' +
    '<p class="hint">It adds to this month\'s spending money. Whatever is left on payday goes to your savings jar.</p>' +
    '<div class="btns">' + (x ? '<button class="btn danger" type="button" data-act="del-moneyin">Delete</button>' : '') + '<button class="btn" type="submit">Save</button></div></form>', { editId: x ? x.id : null });
};
/* ---------------- this month: a calm statement, newest first ---------------- */
let monthOff = 0; let monthOpen = false;
const firstCycle = () => cycleFor(parseKey(S.created || dkey(today0())));
const monthCycle = () => { let cyc = cycleFor(today0()); for (let i = 0; i < monthOff; i++) cyc = cycleFor(addDays(cyc.start, -1)); return cyc; };
const renderMonth = () => {
  const cyc = monthCycle(); const isNow = monthOff === 0; const pp = poolParts(cyc);
  const from = dkey(cyc.start); const to = dkey(cyc.end); const inCyc = (x) => x.date >= from && x.date < to;
  const carry = ledger().carryInto[cyc.key] || 0;
  const setAside = pp.rows.reduce((n, x) => n + x.amount, 0);
  const lines = [];
  lines.push({ date: from, ts: 0, label: pp.start ? 'Starting money' : 'Salary', pic: 'money_bag', tone: 'mint', amt: pp.base, act: isNow && !pp.start ? 'pay-other' : '' });
  if (setAside) lines.push({ date: from, ts: 1, label: 'Home, bills and savings', sub: pp.rows.length + ' payments, tap to ' + (monthOpen ? 'hide' : 'see'), pic: 'receipt', tone: 'lav', amt: -setAside, act: 'month-setaside', group: true });
  if (carry) lines.push({ date: from, ts: 2, label: carry < 0 ? 'Overspent last month' : 'Carried over', pic: carry < 0 ? 'hourglass_not_done' : 'coin', tone: carry < 0 ? 'pink' : 'mint', amt: carry });
  S.income.filter(inCyc).forEach((x) => lines.push({ date: x.date, ts: 3, label: x.note || inKind(x.kind)[1], sub: x.note ? inKind(x.kind)[1] : '', pic: IN3D[x.kind] || 'money_bag', tone: 'mint', amt: Number(x.amt), act: 'edit-moneyin', id: x.id }));
  S.jar.out.filter(inCyc).forEach((x) => lines.push({ date: x.date, ts: 4, label: 'From savings jar', pic: 'coin', tone: 'mint', amt: Number(x.amt) }));
  S.spends.filter(inCyc).forEach((sp) => { const c = catOf(sp.cat); const counted = counts(sp);
    lines.push({ date: sp.date, ts: sp.ts || 5, label: sp.note || c.name, sub: c.name + (counted ? '' : sp.fromSavings ? ', from savings' : sp.method === 'card' ? ', on credit card' : ', not counted'), cat: c, amt: -Number(sp.amt), counted, act: 'edit-spend', id: sp.id }); });
  lines.sort((a, b) => (a.date === b.date ? a.ts - b.ts : a.date < b.date ? -1 : 1));
  let bal = 0; lines.forEach((l) => { if (l.counted !== false) bal += l.amt; l.bal = bal; });
  const left = bal; const spent = spentIn(cyc);
  const closed = isNow ? null : ledger().closed.find((x) => x.key === cyc.key);
  const days = {}; lines.slice().reverse().forEach((l) => { (days[l.date] = days[l.date] || []).push(l); });
  const money = (a) => (a > 0 ? '+' : '−') + inr(Math.abs(a));
  const row = (l) => '<button class="srow"' + (l.act ? ' data-act="' + l.act + '"' + (l.id ? ' data-id="' + l.id + '"' : '') : ' disabled') + '>' +
    (l.cat ? catIc(l.cat, 40) : tile3d(l.pic, TONES[l.tone] || TONES.mint, 40)) +
    '<span class="grow"><b>' + esc(l.label) + '</b>' + (l.sub ? '<span>' + esc(l.sub) + '</span>' : '') + '</span>' +
    '<span class="samt"><b class="num' + (l.amt > 0 ? ' plus' : '') + '">' + money(l.amt) + '</b><span>' + (l.counted === false ? 'not counted' : inr(l.bal) + ' left') + '</span></span></button>' +
    (l.group && monthOpen ? '<div class="sitems">' + pp.rows.map((x) => '<button class="row" data-act="edit-item" data-id="' + x.it.id + '">' + itemIc(x.it, 34) + '<span class="grow"><b>' + esc(x.it.name) + '</b><span>' + (x.paid ? 'Paid' : 'Due ' + short(x.due)) + '</span></span><b class="num">' + inr(x.amount) + '</b></button>').join('') + '</div>' : '');
  const cats = Object.entries(spendsBetween(cyc.start, cyc.end).reduce((m, x) => { m[x.cat] = (m[x.cat] || 0) + Number(x.amt); return m; }, {})).sort((a, b) => b[1] - a[1]);
  const top = Math.max(1, ...cats.map((x) => x[1]));
  const label = (k) => { const d = parseKey(k); const n = daysBetween(d, today0()); return (n === 0 ? 'Today' : n === 1 ? 'Yesterday' : DAY[d.getDay()].slice(0, 3) + ', ' + short(d)) + (k === from ? ', payday' : ''); };
  return '<div class="screen">' + backBtn() +
    '<div class="bighead"><div><h1>This month</h1><span class="kicker">' + short(cyc.start) + ' to ' + short(addDays(cyc.end, -1)) + '</span></div>' +
      '<div class="mswitch"><button class="roundbtn" data-act="month-prev" aria-label="Previous month"' + (cyc.start > firstCycle().start ? '' : ' disabled') + '>' + ico('back') + '</button><button class="roundbtn" data-act="month-next" aria-label="Next month"' + (isNow ? ' disabled' : '') + '>' + ico('chev') + '</button></div></div>' +
    '<section class="group padded leftcard"><span class="k">' + (isNow ? 'Left till payday' : 'Left on payday') + '</span><b class="big num' + (left < 0 ? ' over' : '') + '">' + (left < 0 ? '−' + inr(-left) : inr(left)) + '</b>' +
      '<span class="sub">' + (closed ? (closed.toJar ? inr(closed.toJar) + ' went to your savings jar' : closed.over ? inr(closed.over) + ' overspent, taken from the next month' : '') : 'Spent ' + inr(spent) + ' so far') + '</span></section>' +
    (pp.base || lines.length > 1 ? Object.keys(days).map((k) => '<h2 class="dayhead">' + label(k) + '</h2><section class="group">' + days[k].map(row).join('') + '</section>').join('')
      : '<section class="group padded"><p class="sub">Nothing here for this month.</p></section>') +
    (cats.length ? '<h2 class="grouphead">Spending by category</h2><section class="group padded wlist">' + cats.map(([k, v]) => '<div class="wrow">' + catIc(catOf(k), 28) + '<span class="grow"><span class="split"><b>' + esc(catOf(k).name) + '</b><b class="num">' + inr(v) + '</b></span><span class="track"><i class="spent" style="width:' + clamp(v / top * 100, 2, 100) + '%"></i></span></span></div>').join('') + '</section>' : '') +
    '</div>';
};
const silverRate = () => { const m = market().silver || (window.KH_MARKET || {}).silver; return m && Number(m.r999) > 0 ? m : null; };
const silverTotals = () => { const g = silverRate(); const grams = S.silver.reduce((n, x) => n + (Number(x.grams) || 0), 0); return { g, grams, value: g ? grams * g.r999 : 0 }; };
const silverSheet = (x) => {
  simpleSheet(x ? 'Edit silver' : 'Add silver', [{ name: 'note', label: 'What is it?', value: x ? x.note : '', placeholder: 'Anklets' }, { name: 'grams', label: 'Grams', numeric: true, value: x ? x.grams : '', placeholder: 'g' }],
    (d) => { const grams = Number(d.grams); if (!(grams > 0)) return false; const note = String(d.note || '').trim(); if (x) Object.assign(x, { grams, note }); else S.silver.push({ id: uid(), grams, note }); return 'Silver saved'; },
    x ? '<button class="btn danger" type="button" data-act="del-silver">Delete</button>' : '');
  if (x) sheetState.editId = x.id;
};


const emiInfo = (it) => {
  if (!it.end || !it.start) return null;
  const [sy, sm] = it.start.split('-').map(Number); const [ey, em] = it.end.split('-').map(Number);
  const total = (ey - sy) * 12 + (em - sm) + 1; const t = today0();
  let done = 0; for (let i = 0; i < total; i++) { const due = onDay(sy, sm - 1 + i, Number(it.day) || 1); if (due <= t || (it.paid && it.paid[mkey(due)])) done++; }
  const left = Math.max(0, total - done);
  return { total, done: Math.min(done, total), left, freeBy: MON[em - 1] + ' ' + ey, toGo: left * (Number(it.amount) || 0) };
};

const goldTotals = () => { const g = market().gold; const grams = S.gold.reduce((s2, x) => s2 + (Number(x.grams) || 0), 0); const value = g ? S.gold.reduce((s2, x) => s2 + (Number(x.grams) || 0) * goldRate(x.karat), 0) : 0; return { g, grams, value, sell: value * (1 - (Number(S.goldCut) || 0) / 100) }; };
const goldCard = (gt, big) => '<div class="gold' + (big ? ' lg' : '') + '"' + (big ? '' : ' role="button" tabindex="0" data-act="gold"') + '><div class="gl"><span class="gk">' + ico('coin') + 'Gold locker · ' + +gt.grams.toFixed(2) + ' g</span><span class="gv num">' + inr(gt.value) + '</span>' +
  '<span class="gs">' + (gt.g ? '24K ' + inr(gt.g.r24) + '/g · 22K ' + inr(gt.g.r22) + '/g · ' + esc(gt.g.date) : 'Rate unavailable') + '</span>' +
  (S.goldTarget ? '<span class="gtrack" role="img" aria-label="' + Math.round(clamp(gt.grams / S.goldTarget * 100, 0, 100)) + '% of your gold goal"><span style="width:' + clamp(gt.grams / S.goldTarget * 100, 0, 100) + '%"></span></span><span class="gs">' + +gt.grams.toFixed(2) + ' of ' + S.goldTarget + ' g goal</span>' : '') + '</div>' +
  '<div class="gbtns"><button class="gbtn" data-act="gold-calc">' + ico('calc') + 'Calculator</button><button class="gbtn ghost" data-act="add-gold">' + ico('plus') + 'Add gold</button></div></div>';


/* ---------------- settings tab ---------------- */
const renderSettings = () => {
  const sw = (key, label, sub) => '<div class="row"><span class="grow"><b>' + label + '</b><span>' + sub + '</span></span><button class="switch" role="switch" aria-checked="' + !!S.settings[key] + '" aria-label="' + label + '" data-act="toggle-setting" data-key="' + key + '"></button></div>';
  return '<div class="screen">' +
    '<div class="mehead"><span class="me big">' + esc((S.profile.name || '?').charAt(0).toUpperCase()) + '</span><span><b>' + esc(S.profile.name || 'You') + '</b><span>Set once, then forget</span></span></div>' +
    '<h2 class="grouphead">Money</h2><section class="group">' +
    navRow('edit-profile', 'wallet', 'Name and salary', S.profile.salary ? inr(S.profile.salary) + ' a month' : 'Add your salary') +
    navRow('payday', 'cal', 'Payday', esc(payRule())) +
    (S.start ? navRow('clear-start', 'wallet', 'Starting balance', inr(S.start.left) + ', tap to remove') : '') +
    navRow('cats', 'dots', 'Categories', S.cats.length + ' categories') + '</section>' +
    '<h2 class="grouphead">Pings</h2><section class="group">' +
    sw('roast', 'Evening nudge', 'Every night at ' + esc(S.settings.roastTime)) +
    sw('billReminders', 'Bill pings', 'Each bill\'s own reminder, at ' + (S.settings.remindHour || 9) + ' am') + '</section>' +
    (isNative ? '' : '<p class="hint groupnote">Phone notifications work in the Android app.</p>') +
    '<h2 class="grouphead">Ellie</h2><section class="group">' +
    navRow('ai-key', 'pen', 'Google AI', window.LeashAI.getKey() ? 'Connected' : 'Add your free key') + '</section>' +
    '<h2 class="grouphead">Your data</h2><section class="group padded stack"><p class="hint">Your money data stays on this phone. Sentences Leash can\'t understand go to Google AI if you add a key. Save a backup so a new phone isn\'t a fresh start.</p>' +
    '<div class="btns"><button class="btn sm" data-act="export-csv">Export to Excel</button><button class="btn ghost sm" data-act="export-json">Backup file</button></div>' +
    '<button class="btn soft sm" data-act="restore-pick">Restore from a backup</button></section>' +
    '<button class="btn danger" data-act="reset">Erase everything</button></div>';
};
const ordinal = (n) => { n = Number(n) || 1; const s2 = ['th', 'st', 'nd', 'rd']; const v = n % 100; return n + (s2[(v - 20) % 10] || s2[v] || s2[0]); };

/* ---------------- modules ----------------
   Add-ons register themselves in window.LeashModules before app.js loads (see www/modules/).
   A module: { id, title, icon, status: 'soon' | 'live', blurb, summary(api)?, setup(api)?, render(api)? }.
   It gets its own storage via api.store(id), saved with the rest of the data and included in backups. */
const MODS = (window.LeashModules || []).filter((m) => m && m.id && m.title);
const api = Object.freeze({
  get state() { return S; },
  store: (id) => (S.modules[id] = S.modules[id] || {}),
  persist: (msg) => persist(msg),
  inr, esc, ico, short, ordinal, openSheet: (h, st) => openSheet(h, st), closeSheet: () => closeSheet(), shead: (t) => shead(t), toast: (m) => toast(m),
  today: today0, cycleFor, dayCalc, cycItems, nextPaydays,
  nextDue: (it) => occurrences(it, today0(), 1)[0] || null,
  items: (kind) => S.items.filter((it) => !kind || it.kind === kind),
  news: () => (market().news.items || []),
  back: () => goBack()
});
const modSummary = (m) => { try { return (m.summary && m.summary(api)) || ''; } catch (e) { return ''; } };
const renderModule = (id) => {
  const m = MODS.find((x) => x.id === id); let inner = '';
  try { inner = m && m.render ? m.render(api) : ''; } catch (e) { inner = '<p class="empty">This section had a problem loading.</p>'; }
  return '<div class="screen">' + backBtn() + (inner || '<h1 class="title">' + esc(m ? m.title : '') + '</h1><p class="empty">Coming soon.</p>') + '</div>';
};

/* ---------------- detail screens ---------------- */

const renderBills = () => {
  const order = Object.keys(KINDS); const t = today0();
  const items = S.items.slice().sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind) || (Number(a.day) || 0) - (Number(b.day) || 0));
  const monthly = S.items.filter((it) => it.kind !== 'remind').reduce((s2, it) => s2 + (Number(it.amount) || 0), 0);
  const groups = order.map((k) => [k, items.filter((it) => it.kind === k)]).filter(([, l]) => l.length);
  return '<div class="screen">' + backBtn() +
    '<div class="head"><div class="t"><span class="kicker">' + inr(monthly) + ' a month</span><h1 class="title">Bills</h1></div><button class="iconbtn" data-act="new-item" aria-label="Add a bill">' + ico('plus') + '</button></div>' +
    (groups.length ? groups.map(([k, l]) => '<span class="label">' + KINDS[k] + '</span><div class="card">' + l.map((it) => { const nx = occurrences(it, t, 1)[0];
      return '<button class="row" data-act="edit-item" data-id="' + it.id + '"><span class="due"><b>' + (Number(it.day) >= 31 ? 'Last' : it.day) + '</b><span>day</span></span><span class="grow"><b>' + esc(it.name) + '</b><span>' + [Number(it.amount) ? inr(it.amount) : '', nx ? 'next ' + short(nx) : 'ended', it.end ? 'until ' + MON[Number(it.end.slice(5, 7)) - 1] + ' ' + it.end.slice(0, 4) : ''].filter(Boolean).join(' · ') + '</span></span>' + chev + '</button>'; }).join('') + '</div>').join('')
      : '<div class="card padded"><p class="empty">Rent, EMIs, SIPs, subscriptions, money home: add them once and Leash takes them out before your daily number.</p><button class="btn full" data-act="new-item">Add the first one</button></div>') +
    '</div>';
};

const renderCats = () => '<div class="screen">' + backBtn() + '<div class="head"><h1 class="title">Categories</h1><button class="iconbtn" data-act="new-cat" aria-label="New category">' + ico('plus') + '</button></div>' +
  '<div class="card">' + S.cats.map((c) => '<button class="row" data-act="edit-cat" data-id="' + c.id + '">' + catIc(c) + '<span class="grow"><b>' + esc(c.name) + '</b><span>' + S.spends.filter((s2) => s2.cat === c.id).length + ' spends' + (c.withdrawal ? ' · not counted until the cash is spent' : '') + '</span></span>' + chev + '</button>').join('') + '</div></div>';

const tagCls = (t) => (/tax/i.test(t) ? 't-tax' : /sav/i.test(t) ? 't-save' : /gold/i.test(t) ? 't-gold' : '');
const goldRateCard = () => {
  const g = market().gold; if (!g) return '';
  const seen = S.goldSeen && S.goldSeen.prev; const ch = seen ? g.r24 - seen.r24 : 0;
  return '<article class="goldnews"><span class="gk">' + ico('coin') + 'Gold rate · ' + esc(g.date) + (window.KH_LIVE ? ' · live' : '') + '</span><b class="num">24K ' + inr(g.r24) + '/g · 22K ' + inr(g.r22) + '/g</b>' +
    '<p>' + (seen && ch ? '<span class="chg">' + (ch > 0 ? '▲ Up ' : '▼ Down ') + inr(Math.abs(ch)) + '/g</span> since ' + esc(seen.date) + '. ' : 'No change since you last looked. ') +
    (S.gold.length ? 'Your locker is worth ' + inr(goldTotals().value) + '.' : '') + '</p>' +
    '<div class="gbtns row2"><button class="gbtn" data-act="gold-calc">' + ico('calc') + 'Gold calculator</button><button class="gbtn ghost" data-act="gold">Gold locker</button></div></article>';
};
const silverRateCard = () => {
  const g = silverRate(); if (!g) return '';
  return '<article class="goldnews silver"><span class="gk">' + ico('gem') + 'Silver rate · ' + esc(g.date) + '</span><b class="num">' + inr(g.r999) + ' a gram</b>' +
    '<div class="gbtns row2"><button class="gbtn" data-act="silver">Silver locker</button></div></article>';
};
const renderNews = () => {
  const items = (market().news.items || []).map((n) => ({ ...n, id: newsId(n) }));
  const isSaved = (n) => S.saved.some((x) => x.id === n.id);
  const fresh2 = items.filter((n) => !S.read.includes(n.id) && !isSaved(n) && !S.dismissed.includes(n.id));
  const readOnes = items.filter((n) => S.read.includes(n.id) && !isSaved(n) && !S.dismissed.includes(n.id));
  const card = (n, saved) => '<article class="news"><span class="ntag ' + tagCls(n.tag) + '">' + esc(n.tag) + '</span><b>' + esc(n.title) + '</b><p>' + esc(n.body) + '</p>' + (n.you ? '<div class="you">' + esc(n.you) + '</div>' : '') +
    '<div class="acts"><a href="' + esc(safeUrl(n.src)) + '" target="_blank" rel="noopener" data-act="read-news" data-id="' + n.id + '">' + esc(n.srcName || 'Source') + ' ›</a>' +
    (saved ? '<button class="pill" data-act="unsave-news" data-id="' + n.id + '">Remove</button>'
      : '<button class="pill" data-act="save-news" data-id="' + n.id + '">' + ico('bookmark') + 'Save</button><button class="pill" data-act="read-news" data-id="' + n.id + '">Mark read</button><button class="pill" data-act="dismiss-news" data-id="' + n.id + '" aria-label="Dismiss">' + ico('x') + '</button>') + '</div></article>';
  return '<div class="screen">' + backBtn() +
    '<div class="head"><div class="t"><span class="kicker">Updated ' + esc(market().news.updated || '') + '</span><h1 class="title">Money news</h1></div></div>' +
    goldRateCard() +
    silverRateCard() +
    (fresh2.length ? fresh2.map((n) => card(n, false)).join('') : '<div class="card"><p class="empty">You\'re all caught up. New money news shows up here.</p></div>') +
    (S.saved.length ? '<div class="sec"><h2>Saved</h2></div>' + S.saved.map((n) => card(n, true)).join('') : '') +
    (readOnes.length ? '<details class="readlist"><summary>Read (' + readOnes.length + ')</summary><div class="card">' + readOnes.map((n) => '<div class="row"><a class="grow" href="' + esc(safeUrl(n.src)) + '" target="_blank" rel="noopener"><b>' + esc(n.title) + '</b><span>' + esc(n.tag) + ' · ' + esc(n.srcName || '') + '</span></a><button class="pill" data-act="save-news" data-id="' + n.id + '">Save</button></div>').join('') + '</div></details>' : '') +
    '<p class="hint" style="text-align:center">General information, not tax advice.</p></div>';
};

const taxIn = { gross: null, basicPct: 40, npsPct: 0 };
const renderTax = () => {
  if (taxIn.gross == null) taxIn.gross = (Number(S.profile.salary) || 0) * 12;
  const nps = taxIn.gross * taxIn.basicPct / 100 * Math.min(14, taxIn.npsPct) / 100;
  const now0 = newRegimeTax(taxIn.gross).tax; const withN = newRegimeTax(Math.max(0, taxIn.gross - nps)).tax;
  return '<div class="screen">' + backBtn() +
    '<div class="head"><div class="t"><span class="kicker">Tax Year 2026-27 · salaried</span><h1 class="title">Tax</h1></div></div>' +
    '<section class="hero lilac"><span class="k" style="color:var(--on-lilac)">Estimated tax · new regime</span><span class="big mid num">' + inr(now0) + '</span>' +
    '<div class="field"><label for="tx-gross" style="color:var(--on-lilac)">Yearly gross salary</label><input class="input" id="tx-gross" data-tax="gross" inputmode="numeric" value="' + Math.round(taxIn.gross) + '"></div>' +
    '<p class="sub">' + (taxIn.gross <= 1275000 ? 'Up to ₹12.75 lakh gross pays ₹0 after the ₹75,000 standard deduction and the ₹12 lakh rebate. File anyway: it keeps your record clean.' : 'After the ₹75,000 standard deduction, including 4% cess. A rough estimate, not tax advice.') + '</p></section>' +
    '<div class="card padded stack"><b>What still saves tax for you</b><ul class="checklist">' +
    '<li class="yes"><i>✓</i><span><b>Standard deduction ₹75,000.</b> Automatic.</span></li>' +
    '<li class="yes"><i>✓</i><span><b>Employer\'s NPS contribution</b> (80CCD(2)): up to 14% of your basic. Ask HR to move part of your CTC into it.</span></li>' +
    '<li class="yes"><i>✓</i><span><b>₹12 lakh rebate.</b> Taxable income up to ₹12 lakh pays zero, with marginal relief just above it.</span></li>' +
    '<li class="yes"><i>✓</i><span><b>When you leave a job:</b> gratuity (up to ₹20 lakh) and leave encashment (up to ₹25 lakh) stay tax-free.</span></li>' +
    '<li class="no"><i>✕</i><span><b>Doesn\'t count here:</b> 80C (PPF, PLI, ULIP, ELSS), 80D health insurance, HRA, and your own NPS (80CCD(1B)).</span></li></ul></div>' +
    '<div class="card padded stack"><b>Try employer NPS</b>' +
    '<div class="two"><div class="field"><label for="tx-basic">Basic as % of CTC</label><input class="input" id="tx-basic" data-tax="basicPct" inputmode="numeric" value="' + taxIn.basicPct + '"></div>' +
    '<div class="field"><span class="flabel">Employer NPS (% of basic)</span><div class="seg">' + [0, 4, 10, 14].map((n) => '<button aria-pressed="' + (taxIn.npsPct === n) + '" data-act="tax-nps" data-v="' + n + '">' + n + '%</button>').join('') + '</div></div></div>' +
    '<div class="taxbox"><div><span>Today</span><b class="num">' + inr(now0) + '</b><span>tax a year</span></div><div class="' + (withN < now0 ? 'win' : '') + '"><span>With ' + taxIn.npsPct + '% NPS</span><b class="num">' + inr(withN) + '</b><span>' + (withN < now0 ? 'saves ' + inr(now0 - withN) : 'no change') + '</span></div></div>' +
    '<p class="hint">' + (now0 === 0 ? 'You already pay ₹0, so NPS won\'t cut tax right now. It matters once your gross crosses ₹12.75 lakh. ' : '') + (nps ? inr(nps) + ' a year would go into NPS, locked till 60. ' : '') + 'Rough estimate with 4% cess, no surcharge. Confirm with HR or a tax professional.</p></div></div>';
};


const renderEmi = () => {
  const emis = S.items.filter((it) => it.kind === 'emi'); const withInfo = emis.map((it) => ({ it, e: emiInfo(it) }));
  const run = withInfo.filter((x) => x.e && x.e.left > 0); const freed = run.reduce((s2, x) => s2 + (Number(x.it.amount) || 0), 0);
  const last = run.length ? run.reduce((a, b) => (b.e.left > a.e.left ? b : a)) : null;
  return '<div class="screen">' + backBtn() +
    '<div class="head"><div class="t"><span class="kicker">' + (run.length ? inr(run.reduce((s2, x) => s2 + x.e.toGo, 0)) + ' still to pay' : 'Loans and treatment EMIs') + '</span><h1 class="title">EMI payoff</h1></div><button class="iconbtn" data-act="add-item-kind" data-kind="emi" aria-label="Add an EMI">' + ico('plus') + '</button></div>' +
    (withInfo.length ? '<div class="card padded stack">' + withInfo.map(({ it, e }) => e
      ? '<button class="emi" data-act="edit-item" data-id="' + it.id + '"><span class="top"><b>' + esc(it.name) + '</b><span class="num">' + (e.left ? e.left + ' left' : 'Done 🎉') + '</span></span>' +
        '<span class="dots">' + Array.from({ length: Math.min(e.total, 60) }, (_, i) => '<i class="' + (i < e.done ? 'on' : '') + '"></i>').join('') + '</span>' +
        '<span class="split small"><span>' + inr(it.amount) + '/month · ' + (e.left ? 'free by <b>' + e.freeBy + '</b>' : 'paid off') + '</span><span>' + inr(e.toGo) + ' to go</span></span></button>'
      : '<button class="emi" data-act="edit-item" data-id="' + it.id + '"><span class="top"><b>' + esc(it.name) + '</b><span class="muted">' + inr(it.amount) + '/month</span></span><span class="hint">Add its last payment date to see the countdown.</span></button>').join('') + '</div>' +
      (last ? '<div class="note">When the last one ends (' + last.e.freeBy + '), <b>' + inr(freed) + '/month</b> comes back to you. Send it straight to savings before you get ideas.</div>' : '')
      : '<div class="card padded"><p class="empty">No EMIs. Debt-free icon.</p></div>') + '</div>';
};

const renderReminders = () => {
  const t = today0();
  const ones = S.reminders.slice().sort((a, b) => (a.done - b.done) || (a.date < b.date ? -1 : 1));
  const monthly = S.items.filter((it) => it.kind === 'remind');
  return '<div class="screen">' + backBtn() +
    '<div class="head"><div class="t"><span class="kicker">One-off and monthly</span><h1 class="title">Reminders</h1></div><button class="iconbtn" data-act="new-rem" aria-label="Add a reminder">' + ico('plus') + '</button></div>' +
    '<div class="card">' + (ones.length ? ones.map((r) => { const d = parseKey(r.date); const dd = daysBetween(t, d);
      return '<div class="row"><span class="due' + (!r.done && dd <= 7 ? ' soon' : '') + '"><b>' + d.getDate() + '</b><span>' + MON[d.getMonth()] + '</span></span><button class="grow" style="border:0;background:none;padding:0;text-align:left" data-act="edit-rem" data-id="' + r.id + '"><b' + (r.done ? ' style="text-decoration:line-through;color:var(--soft)"' : '') + '>' + esc(r.text) + '</b><span>' + (r.done ? 'Done' : whenTxt(dd)) + '</span></button><button class="pill" aria-pressed="' + !!r.done + '" data-act="rem-done" data-id="' + r.id + '">' + (r.done ? 'Done' : 'Done?') + '</button></div>'; }).join('')
      : '<p class="empty">Things like "turn off ULIP autopay before March" or "renew bike insurance". Leash pings you on the day.</p>') + '</div>' +
    (monthly.length ? '<span class="label">Every month</span><div class="card">' + monthly.map((it) => { const nx = occurrences(it, t, 1)[0]; return '<button class="row" data-act="edit-item" data-id="' + it.id + '"><span class="due"><b>' + (nx ? nx.getDate() : '–') + '</b><span>' + (nx ? MON[nx.getMonth()] : '') + '</span></span><span class="grow"><b>' + esc(it.name) + '</b><span>' + esc(it.note || 'Monthly reminder') + '</span></span>' + chev + '</button>'; }).join('') + '</div>' : '') +
    '</div>';
};



/* ---------------- onboarding ---------------- */
const nextOcc = (day) => { const t = today0(); const d = onDay(t.getFullYear(), t.getMonth(), day); return d >= t ? d : onDay(t.getFullYear(), t.getMonth() + 1, day); };
let onb = { step: 0, fixed: [{ name: 'Home', amount: '', day: 1, kind: 'home' }, { name: 'PG rent', amount: '', day: 1, kind: 'bill' }, { name: 'EMI', amount: '', day: 30, kind: 'emi' }, { name: 'PPF / savings', amount: '', day: 5, kind: 'save' }] };
const renderOnb = () => {
  const dots = '<div class="dots">' + [0, 1].map((i) => '<i class="' + (i <= onb.step ? 'on' : '') + '"></i>').join('') + '</div>';
  if (onb.step === 0) return '<form class="onb" data-form="onb0">' + dots + '<div class="onbface">' + window.ellieSvg('proud', 170) + '</div><h1>Hi, I\'m Ellie!</h1><p class="hint">I take out your bills, loans, savings and money for home, then tell you what\'s safe to spend each day.</p>' +
    '<div class="field"><label for="o-name">What should we call you?</label><input class="input" id="o-name" name="name" autocomplete="given-name" value="' + esc(S.profile.name) + '"></div>' +
    '<div class="field"><label for="o-sal">Monthly salary (in hand)</label><input class="input" id="o-sal" name="salary" inputmode="numeric" placeholder="₹" value="' + (S.profile.salary || '') + '"></div>' +
    paydayFields(S.profile.payday || 1, S.profile.payShift || 'none', false) +
    '<span class="spacer"></span><button class="btn full" type="submit">Next</button><button class="link" type="button" data-act="onb-skip">Skip setup</button></form>';
  if (onb.step === 1) return '<form class="onb" data-form="onb1">' + dots + '<h1>What leaves every month?</h1><p class="hint">Leave a row empty to skip it. You can add more, with end dates and reminders, in the Money tab.</p>' +
    onb.fixed.map((f, i) => '<div class="fixedrow"><div class="field"><label for="f-n' + i + '">Name</label><input class="input" id="f-n' + i + '" name="n' + i + '" value="' + esc(f.name) + '"></div><div class="field"><label for="f-a' + i + '">Amount</label><input class="input" id="f-a' + i + '" name="a' + i + '" inputmode="numeric" placeholder="₹" value="' + esc(f.amount) + '"></div>' + calPicker('d' + i, f.first || dkey(nextOcc(f.day)), 'Next due date') + '</div>').join('') +
    '<span class="spacer"></span><div class="btns"><button class="btn ghost" type="button" data-act="onb-back">Back</button><button class="btn" type="submit">Meet Ellie</button></div></form>';
  return '';
};

/* ---------------- sheets ---------------- */
let sheetState = null;
const openSheet = (html, st) => { sheetState = st || null; const s = $('#sheet'); s.innerHTML = '<div class="grab"></div>' + html; $('#scrim').classList.add('show'); s.classList.add('show'); setTimeout(() => { const f = s.querySelector('[autofocus]'); if (f) f.focus(); }, 350); };
const closeSheet = () => { $('#scrim').classList.remove('show'); $('#sheet').classList.remove('show'); sheetState = null; };
const shead = (t) => '<div class="shead"><h2 id="sheet-title">' + t + '</h2><button class="iconbtn" data-act="close-sheet" aria-label="Close">' + ico('x', 2.2) + '</button></div>';
const num = (v) => Math.max(0, Math.round(Number(String(v || '').replace(/[^\d.]/g, '')) || 0));

const spendSheet = (sp, pre) => {
  const p = pre || {};
  const st = { id: sp ? sp.id : null, amt: sp ? String(sp.amt) : (p.amt ? String(p.amt) : ''), cat: sp ? sp.cat : (p.cat || (S.cats[0] || {}).id),
    note: sp ? sp.note || '' : (p.note || ''), date: sp ? sp.date : (p.date || dkey(today0())), method: sp ? (sp.method || 'upi') : (p.method || 'upi'),
    fromSavings: sp ? !!sp.fromSavings : !!p.fromSavings, catAuto: !sp && !p.cat };
  openSheet('', st); drawSpend();
};
const recentNotes = (prefix) => {
  const m = new Map(); const pf = (prefix || '').trim().toLowerCase();
  S.spends.slice().sort((a, b) => b.ts - a.ts).forEach((s2) => { const n = (s2.note || '').trim(); if (!n) return; const k = n.toLowerCase(); if (pf && !k.startsWith(pf)) return; if (!m.has(k)) m.set(k, { note: n, cat: s2.cat, n: 0 }); m.get(k).n++; });
  return [...m.values()].filter((x) => x.note.toLowerCase() !== pf).sort((a, b) => b.n - a.n).slice(0, 6);
};
const suggHtml = (prefix) => recentNotes(prefix).map((x) => '<button type="button" class="sug" data-act="sug" data-note="' + esc(x.note) + '" data-cat="' + esc(x.cat) + '">' + catIc(catOf(x.cat)) + esc(x.note) + '</button>').join('');
const drawSpend = () => {
  const st = sheetState; const c = dayCalc(today0()); const n = num(st.amt);
  const isToday = st.date === dkey(today0()); const isW = !!catOf(st.cat).withdrawal;
  const prevSp = st.id ? S.spends.find((s2) => s2.id === st.id) : null; const prev = prevSp && counts(prevSp) ? Number(prevSp.amt) : 0;
  const off = st.fromSavings || isW || st.method === 'card';
  const rest = c.left + (isToday ? prev : 0) - (off ? 0 : n);
  const after = !n ? 'Type an amount' : isW ? 'ATM cash: counts when you spend it' : st.method === 'card' ? 'Credit card: counts when the bill is paid' : st.fromSavings ? 'From savings: today\'s number stays put' : !isToday ? 'Logged for ' + short(parseKey(st.date)) : rest >= 0 ? 'Today becomes ' + inr(rest) : inr(-rest) + ' over. Tomorrow shrinks a little.';
  $('#sheet').innerHTML = '<div class="grab"></div>' + shead(st.id ? 'Edit spend' : 'Add a spend') +
    (st.id ? '' : '<div class="seg inout three"><button type="button" aria-pressed="true">Spent</button><button type="button" data-act="to-pay">Pay</button><button type="button" data-act="to-moneyin">Came in</button></div>') +
    '<div class="amtwrap"><span class="amount num' + (n ? '' : ' zero') + '" aria-live="polite">' + inr(n) + '</span><span class="afterpill' + (isToday && n && rest < 0 && !off ? ' bad' : '') + '">' + esc(after) + '</span></div>' +
    '<div class="field"><span class="flabel">Category</span><div class="cats" role="group" aria-label="Category">' + S.cats.map((ct) => '<button class="cat" aria-pressed="' + (st.cat === ct.id) + '" data-act="pick-cat" data-id="' + ct.id + '">' + catIc(ct) + esc(ct.name) + '</button>').join('') + '<button class="cat add" data-act="new-cat"><span class="ic">' + ico('plus') + '</span>New</button></div>' +
    '<p class="hint" id="sp-auto" aria-live="polite"></p></div>' +
    '<div class="field"><span class="flabel">Paid with</span><div class="seg">' + METHODS.map(([v, l]) => '<button type="button" aria-pressed="' + (st.method === v) + '" data-act="pick-method" data-v="' + v + '">' + l + '</button>').join('') + '</div>' +
    (st.method === 'card' ? '<p class="hint">Shows in where it went now, and leaves your money when you pay the card bill.</p>' : '') + '</div>' +
    '<div class="pad">' + ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', 'del'].map((k) => '<button data-act="key" data-k="' + k + '" aria-label="' + (k === 'del' ? 'Delete' : k) + '">' + (k === 'del' ? '⌫' : k) + '</button>').join('') + '</div>' +
    '<details class="more"' + (st.open ? ' open' : '') + '><summary data-act="more-toggle">' + ico('pen') + (st.note || st.fromSavings || !isToday ? esc([st.note, st.fromSavings ? 'from savings' : '', !isToday ? short(parseKey(st.date)) : ''].filter(Boolean).join(' · ')) : 'Note, date, from savings') + '</summary><div class="inner">' +
    '<div class="two"><div class="field"><label for="sp-note">Note (optional)</label><input class="input" id="sp-note" data-bind="note" placeholder="What was it?" value="' + esc(st.note) + '" autocomplete="off"></div><div class="field"><label for="sp-date">Date</label><input class="input" type="date" id="sp-date" data-bind="date" max="' + dkey(today0()) + '" value="' + st.date + '"></div></div>' +
    '<div class="sugs" id="sp-sugg">' + suggHtml(st.note) + '</div>' +
    '<div class="row" style="border:0;padding:0"><span class="grow"><b>Paid from savings</b><span>Big one-offs like gold. Won\'t touch today\'s number.</span></span><button class="switch" role="switch" aria-checked="' + !!st.fromSavings + '" aria-label="Paid from savings" data-act="pick-savings"></button></div>' +

    '</div></details>' +
    '<div class="btns">' + (st.id ? '<button class="btn danger" data-act="del-spend">Delete</button>' : '') + '<button class="btn" data-act="save-spend"' + (n ? '' : ' disabled') + '>' + (st.id ? 'Save' : 'Save spend') + '</button></div>';
};
// While typing a note, pick the likely category (until you choose one yourself) and narrow the suggestions.
const noteTyped = (v) => {
  const st = sheetState; if (!st) return;
  if (st.catAuto) {
    const g = guessCat(v); const hint = $('#sp-auto');
    if (g && g !== st.cat) {
      st.cat = g;
      document.querySelectorAll('#sheet .cat[data-id]').forEach((b) => { b.setAttribute('aria-pressed', b.dataset.id === g); if (b.dataset.id === g) b.scrollIntoView({ block: 'nearest', inline: 'center' }); });
    }
    if (hint) hint.textContent = g ? 'Picked ' + catOf(g).name + ' from your note. Tap another to change it.' : '';
  }
  const box = $('#sp-sugg'); if (box) box.innerHTML = suggHtml(v);
};
const logSpend = (o) => {
  const sp = { id: uid(), amt: o.amt, cat: o.cat, note: (o.note || '').trim(), date: o.date || dkey(today0()), method: catOf(o.cat).withdrawal ? 'cash' : (o.method || 'upi'), fromSavings: !!o.fromSavings, ts: Date.now() };
  S.spends.push(sp); if (o.note) learn(o.note, o.cat); return sp;
};
const spendBanner = (n, sp) => {
  const c = dayCalc(today0());
  if (sp && (sp.fromSavings || sp.method === 'card' || catOf(sp.cat).withdrawal)) { banner('Logged ' + inr(n), sp.fromSavings ? 'From savings, so today\'s number stays ' + inr(c.left) + '.' : sp.method === 'card' ? 'On your credit card. It counts when you pay the card bill.' : 'ATM cash. It counts when you spend it.'); return; }
  banner(c.left >= 0 ? inr(c.left) + ' left today' : inr(-c.left) + ' over today', c.left >= 0 ? 'Logged ' + inr(n) + '. Nicely done.' : 'Logged ' + inr(n) + '. Tomorrow becomes ' + inr(c.tomorrow) + '.');
};

/* ---------------- telling Ellie ---------------- */
const flash = (mood) => { ellieFlash = { mood, at: Date.now() }; setTimeout(() => { if (tab === 'money' && !view && !sheetState) render(); }, 8100); };
const NO_SPEND = /\b(no spend|didn'?t spend|spent nothing|nothing spent)\b/i;
const answerTopic = (topic) => {
  const c = dayCalc(today0());
  if (topic === 'jar') return inr(jarBalance()) + ' is in your savings jar.';
  if (topic === 'payday') { const n = daysBetween(today0(), c.cyc.end); return 'Payday is ' + (n === 1 ? 'tomorrow' : 'in ' + n + ' days') + ', on ' + short(c.cyc.end) + '.'; }
  if (topic === 'spent') return inr(spentIn(c.cyc)) + ' spent this pay period. See Jars for where it went.';
  return (c.left >= 0 ? inr(c.left) + ' is safe today' : inr(-c.left) + ' over today') + ', and ' + inr(Math.max(0, c.pool - spentIn(c.cyc))) + ' left till payday.';
};
const topicOf = (t) => (/jar|sav/i.test(t) ? 'jar' : /payday|salary date|when.*pay/i.test(t) ? 'payday' : /spent|where|went/i.test(t) ? 'spent' : 'left');
const isQuestion = (t) => /\?|^(how|what|when|where|show)\b/i.test(t.trim());
const reactToSpends = (added) => {
  const c = dayCalc(today0()); const total = sum(added); const big = c.pool > 0 && total / c.pool >= 0.25;
  const mood = big ? 'careful' : currentMood(c, today0()); flash(mood === 'proud' ? 'happy' : mood);
  say('ellie', big ? 'That was a big one!' : c.left >= 0 ? 'Got it!' : 'Got it. That went over today.', { rows: spendRows(added), undo: { spends: added.map((x) => x.id) } });
};
const applyPay = (amt, m) => {
  const key = cycleFor(today0()).key; S.paylog[key] = { amount: amt, date: dkey(today0()) };
  const row = { icon: 'wallet', label: 'Pay', amt };
  if (m) { m.text = 'Pay is in! Home and monthly payments are sorted.'; m.rows = [row]; m.undo = { pay: key }; } else say('ellie', 'Pay is in! Home and monthly payments are sorted.', { rows: [row], undo: { pay: key } });
  flash('proud'); persist();
};
const applyActions = (actions) => {
  const added = []; const t = today0();
  actions.forEach((a) => {
    if (a.type === 'spend') {
      if (!a.category || !a.sure) { say('ellie', 'Where did ' + inr(a.amount) + ' go?'); persist(); spendSheet(null, { amt: a.amount, note: a.note || '', date: a.when === 'yesterday' ? dkey(addDays(t, -1)) : dkey(t) }); return; }
      added.push(logSpend({ amt: a.amount, cat: a.category, note: a.note, date: a.when === 'yesterday' ? dkey(addDays(t, -1)) : dkey(t) }));
    } else if (a.type === 'pay') {
      const usual = Number(S.profile.salary) || 0; const nearUsual = !usual || Math.abs(a.amount - usual) / usual <= 0.2;
      if (a.sure && nearUsual) applyPay(a.amount); else say('ellie', 'Is ' + inr(a.amount) + ' your pay coming in?', { ask: true, amt: a.amount });
    } else if (a.type === 'income') {
      sayMoneyIn(addMoneyIn(a.amount, E.moneyInKind(a.note || ''), a.note || ''));
    } else if (a.type === 'no_spend') { S.noSpend[dkey(t)] = true; flash('proud'); say('ellie', 'A no-spend day! You kept all your peanuts.'); }
    else if (a.type === 'question') say('ellie', answerTopic(a.topic));
    else if (a.type === 'paid_bill') { const r = tellLeash('paid ' + (a.note || '')); say('ellie', r.done.length ? r.done.join(', ') + '.' : 'I couldn\'t find that bill.'); }
    else say('ellie', 'I didn\'t catch that. Try "rapido 80".');
  });
  if (added.length) reactToSpends(added);
  persist();
};
const sayMoneyIn = (x) => {
  flash('proud');
  say('ellie', 'Yay, ' + inr(x.amt) + ' extra this month!', { rows: [{ icon: inKind(x.kind)[2], label: x.note || inKind(x.kind)[1], amt: x.amt }], undo: { income: [x.id] } });
};
const AI_ERRORS = { limit: 'Google AI is resting for now.', key: 'Your Google key isn\'t working. Check it in Settings.', offline: 'You look offline.', slow: 'Google AI took too long.', server: 'Google AI had a problem.', empty: 'Google AI had a problem.' };
const tellOffline = (text, why) => {
  if (E.looksLikeMoneyIn(text)) { const m = text.match(/\d[\d,]*/); const amt = m ? num(m[0]) : 0;
    if (amt && E.isSalary(text, amt, Number(S.profile.salary) || 0)) { say('ellie', (why ? why + ' ' : '') + 'Is ' + inr(amt) + ' your pay coming in?', { ask: true, amt }); persist(); return; }
    if (amt) { sayMoneyIn(addMoneyIn(amt, E.moneyInKind(text), E.moneyInNote(text))); persist(); return; } }
  const r = tellLeash(text);
  if (r.added.length) reactToSpends(r.added);
  if (r.done.length) say('ellie', r.done.join(', ') + '.');
  if (r.ask) { say('ellie', 'Where did ' + inr(r.ask.amt) + ' go?'); persist(); spendSheet(null, { amt: r.ask.amt, note: r.ask.note, date: r.ask.date, fromSavings: r.ask.fromSavings, method: r.ask.method }); return; }
  if (!r.added.length && !r.done.length) say('ellie', (why ? why + ' ' : '') + 'Try "rapido 80" or "how much is left?"');
  persist();
};
const tellEllie = async (text) => {
  say('me', text); render();
  if (NO_SPEND.test(text)) { applyActions([{ type: 'no_spend' }]); return; }
  if (isQuestion(text)) { say('ellie', answerTopic(topicOf(text))); persist(); return; }
  const dry = tellLeash(text, true);
  const sortedLocally = !dry.unknown && (!E.looksLikeMoneyIn(text) || !E.isSalary(text, 0, 0));
  if (sortedLocally || !window.LeashAI.getKey()) { tellOffline(text); return; }
  thinking = true; render();
  const res = await window.LeashAI.read(text, S.cats);
  thinking = false;
  if (res.error) { tellOffline(text, AI_ERRORS[res.error]); return; }
  const actions = E.checkActions(res.result, S.cats.map((c) => c.id));
  if (actions.length) applyActions(actions); else tellOffline(text);
};
const aiKeySheet = () => {
  const has = window.LeashAI.getKey();
  openSheet(shead('Google AI') + '<form data-form="aikey" class="stack"><p class="hint">Ellie uses Google AI only for sentences she can\'t sort herself. Your key stays on this phone and is never saved in backups. On Google\'s free plan, your sentences may be used to improve its products.</p>' +
    '<div class="field"><label for="ai-k">Your Google AI key</label><input class="input" id="ai-k" name="key" type="password" autocomplete="off" placeholder="' + (has ? 'Saved' : 'Paste your key') + '"></div>' +
    '<p class="hint" id="ai-msg" role="status"></p><button class="btn full" type="submit">Save and test</button>' + (has ? '<button class="btn danger full" type="button" data-act="ai-remove">Remove key</button>' : '') + '</form>');
};
const saveAiKey = async (d) => {
  const key = String(d.key || '').trim(); const msg = $('#ai-msg');
  if (!key) { if (window.LeashAI.getKey()) closeSheet(); else msg.textContent = 'Paste your key first.'; return; }
  msg.textContent = 'Testing your key...';
  const res = await window.LeashAI.read('coffee 50', S.cats, key);
  if (res.error) { msg.textContent = AI_ERRORS[res.error]; return; }
  window.LeashAI.setKey(key); closeSheet(); persist('Google AI connected');
};
const SPEECH = plugin('SpeechRecognition');
const listen = async () => {
  if (!SPEECH) { const R = window.SpeechRecognition || window.webkitSpeechRecognition; if (!R) { toast('The mic works in the Android app.'); return; }
    const r = new R(); r.lang = 'en-IN'; r.onresult = (e) => tellEllie(e.results[0][0].transcript); r.onerror = () => toast('I couldn\'t hear that. Try again.'); r.start(); return; }
  try {
    const { available } = await SPEECH.available(); if (!available) { toast('Speech isn\'t available on this phone.'); return; }
    const p = await SPEECH.requestPermissions(); if (p.speechRecognition !== 'granted') { toast('Allow the microphone for Leash in Android settings.'); return; }
    const { matches } = await SPEECH.start({ language: 'en-IN', maxResults: 1, partialResults: false, popup: true, prompt: 'Tell Ellie' });
    if (matches && matches[0]) tellEllie(matches[0]); else toast('I couldn\'t hear that. Try again.');
  } catch (e) { toast('I couldn\'t hear that. Try again.'); }
};
// "Tell Leash": plain words in, spends out. "200 rapido, 350 biryani yesterday", "paid rent", "how much left?"
const tellLeash = (text, dry) => {
  const t = today0(); const added = []; const done = []; let ask = null; let reply = ''; let unknown = false;
  text.split(/,|;|\n|\band\b/i).map((x) => x.trim()).filter(Boolean).forEach((chunk) => {
    const low = chunk.toLowerCase();
    const nums = [...chunk.matchAll(/(?:₹|rs\.?\s*|inr\s*)?(\d[\d,]*(?:\.\d+)?)\s*(k\b)?(\s*(?:g|gm|gms|grams?)\b)?/gi)].filter((m) => !m[3]);
    const amt = nums.length ? Math.round(parseFloat(nums[0][1].replace(/,/g, '')) * (nums[0][2] ? 1000 : 1)) : 0;
    if (!amt && /(how much|left|remaining|limit|budget)/.test(low)) { const c = dayCalc(t); reply = (c.left >= 0 ? inr(c.left) + ' left today' : 'Over today by ' + inr(-c.left)) + ', ' + inr(Math.max(0, c.pool - c.before - c.todaySp)) + ' until payday.'; return; }
    if (!amt && /\b(paid|sent)\b/.test(low)) {
      if (dry) return;
      const list = cycItems(cycleFor(t)).filter((x) => !x.paid);
      const hit = list.find((x) => x.it.name.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 2).some((w) => low.includes(w)));
      if (hit) { hit.it.paid = hit.it.paid || {}; hit.it.paid[hit.key] = dkey(t); done.push(esc(hit.it.name) + ' marked ' + (hit.it.kind === 'home' ? 'sent' : 'paid')); }
      return;
    }
    if (!amt) { unknown = true; return; }
    const date = /\byesterday\b/.test(low) ? dkey(addDays(t, -1)) : dkey(t);
    const fromSavings = /\b(from )?savings?\b/.test(low); const method = /\bcash\b/.test(low) ? 'cash' : 'upi';
    let note = chunk.replace(nums[0][0], ' ').replace(/\b(yesterday|today|from savings|savings|in cash|cash|spent|paid|for|on|rs\.?|inr)\b/gi, ' ').replace(/₹/g, ' ').replace(/\s+/g, ' ').trim();
    const cat = guessCat(note) || (/(atm|withdrew|withdraw)/.test(low) && S.cats.some((c) => c.id === 'atm') ? 'atm' : null);
    note = note ? note.charAt(0).toUpperCase() + note.slice(1) : '';
    if (dry) { if (!cat) unknown = true; return; }
    if (!cat) { if (!ask) ask = { amt, note, date, fromSavings, method }; return; }
    if (catOf(cat).name.toLowerCase() === note.toLowerCase()) note = '';
    added.push(logSpend({ amt, cat, note, date, fromSavings, method }));
  });
  return { added, done, ask, reply, unknown };
};

// Bills use calendar dates: the next (or first) due date sets the day it repeats on; an optional last payment date ends it.
const itemSheet = (it, kind) => {
  const x = it || { name: '', amount: '', day: today0().getDate(), kind: kind || 'bill', end: '', start: '', remindBefore: 2, note: '' };
  let first = dkey(today0()); let last = '';
  if (it) {
    const [sy, sm] = (it.start || mkey(today0())).split('-').map(Number); first = dkey(onDay(sy, sm - 1, Number(it.day) || 1));
    if (it.end) { const [ey, em] = it.end.split('-').map(Number); last = dkey(onDay(ey, em - 1, Number(it.day) || 1)); }
  }
  openSheet(shead(it ? 'Edit ' + esc(it.name) : x.kind === 'sub' ? 'Add a subscription' : 'Add money out') +
    '<form data-form="item" class="stack">' +
    '<div class="field"><span class="flabel">Type</span><div class="seg" role="group">' + Object.entries(KINDS).map(([k, v]) => '<button type="button" aria-pressed="' + (x.kind === k) + '" data-act="pick-kind" data-v="' + k + '">' + v + '</button>').join('') + '</div></div>' +
    '<div class="field"><label for="it-name">Name</label><input class="input" id="it-name" name="name" required value="' + esc(x.name) + '" placeholder="' + (x.kind === 'sub' ? 'Netflix, Spotify, gym…' : 'Rent, EMI, PPF, ULIP autopay…') + '"></div>' +
    '<div class="field"><label for="it-amt">Amount each month</label><input class="input" id="it-amt" name="amount" inputmode="numeric" placeholder="₹" value="' + (x.amount || '') + '"></div>' +
    calPicker('first', first, it ? 'First due date' : 'Next due date') +
    '<p class="hint" data-repeat>' + repeatHint(first) + '</p>' +
    calPicker('last', last, 'Last payment (optional)', { empty: 'No end date' }) +
    '<div class="field"><label for="it-rem">Remind me</label><select class="input" id="it-rem" name="remindBefore">' + [[-1, 'No reminder'], [0, 'On the day'], [1, '1 day before'], [2, '2 days before'], [3, '3 days before'], [7, 'A week before']].map(([v, l]) => '<option value="' + v + '"' + (Number(x.remindBefore) === v ? ' selected' : '') + '>' + l + '</option>').join('') + '</select></div>' +
    '<div class="field"><label for="it-note">Note</label><input class="input" id="it-note" name="note" value="' + esc(x.note || '') + '" placeholder="e.g. Cancel before it renews"></div>' +
    '<div class="btns">' + (it ? '<button class="btn danger" type="button" data-act="del-item">Delete</button>' : '') + '<button class="btn" type="submit">Save</button></div></form>', { id: it ? it.id : null, kind: x.kind });
};


const simpleSheet = (title, fields, onSave, extra, hint) => {
  openSheet(shead(title) + '<form data-form="simple" style="display:flex;flex-direction:column;gap:12px">' + fields.map((f) => f.type === 'select'
    ? '<div class="field"><label for="sf-' + f.name + '">' + f.label + '</label><select class="input" id="sf-' + f.name + '" name="' + f.name + '">' + f.groups.map(([g, opts]) => (g ? '<optgroup label="' + esc(g) + '">' : '') + opts.map(([v, l]) => '<option value="' + esc(v) + '"' + (v === f.value ? ' selected' : '') + '>' + esc(l) + '</option>').join('') + (g ? '</optgroup>' : '')).join('') + '</select></div>'
    : f.type === 'seg'
    ? '<div class="field"><span class="flabel">' + f.label + '</span><div class="seg">' + f.options.map(([v, l]) => '<button type="button" aria-pressed="' + (f.value === v) + '" data-act="simple-seg" data-name="' + f.name + '" data-v="' + v + '">' + l + '</button>').join('') + '</div><input type="hidden" name="' + f.name + '" value="' + esc(f.value) + '"></div>'
    : '<div class="field"><label for="sf-' + f.name + '">' + f.label + '</label><input class="input" id="sf-' + f.name + '" name="' + f.name + '" ' + (f.type ? 'type="' + f.type + '" ' : '') + (f.numeric ? 'inputmode="numeric" ' : '') + 'value="' + esc(f.value ?? '') + '"' + (f.placeholder ? ' placeholder="' + esc(f.placeholder) + '"' : '') + '></div>').join('') +
    (hint || '') + '<div class="btns">' + (extra || '') + '<button class="btn" type="submit">Save</button></div></form>', { onSave });
};

const paydaySheet = () => {
  const hist = Object.entries(S.paylog).sort((a, b) => (a[0] < b[0] ? 1 : -1)).slice(0, 6);
  openSheet(shead('Payday') + '<form data-form="payday" class="stack">' + paydayFields(S.profile.payday, S.profile.payShift || 'none', true) +
    '<button class="btn" type="submit">Save payday</button></form>' +
    (hist.length ? '<span class="label">Salary received</span><div class="card" style="background:var(--field)">' + hist.map(([k, pl]) => '<div class="row"><span class="grow"><b>' + inr(pl.amount) + '</b><span>Arrived ' + short(parseKey(pl.date)) + ' · cycle from ' + short(parseKey(k)) + '</span></span></div>').join('') + '</div>' : ''));
};

// "Can I afford it?": how a purchase changes your daily limit for the rest of the pay cycle.
const affordSheet = (amt) => {
  const c = dayCalc(today0());
  openSheet(shead('Can I afford it?') +
    '<div class="field"><label for="af-amt">Price</label><input class="input bigin num" id="af-amt" inputmode="numeric" placeholder="₹" value="' + (amt || '') + '" autofocus autocomplete="off"></div>' +
    '<div class="field"><label for="af-when">When would you buy it?</label><input class="input" type="date" id="af-when" value="' + dkey(today0()) + '" min="' + dkey(today0()) + '" max="' + dkey(addDays(c.cyc.end, -1)) + '"></div>' +
    '<div id="af-out" class="stack" aria-live="polite"></div>', { amt: String(amt || ''), when: dkey(today0()) });
  updateAfford();
};
const affordCalc = (x, when) => {
  const t = today0(); const c = dayCalc(t); const remaining = c.pool - c.before - c.todaySp; // left for daily spending until payday
  if (!when || when === dkey(t)) {
    const restDays = Math.max(0, c.daysLeft - 1);
    return { c, remaining, isToday: true, restDays, from: restDays ? Math.max(0, remaining / restDays) : 0, to: restDays ? Math.max(0, (remaining - x) / restDays) : 0, fits: x <= remaining, inToday: x <= c.left };
  }
  // Planned for a later day this cycle: spread it over every day from today so the day itself isn't a shock.
  return { c, remaining, isToday: false, restDays: c.daysLeft, from: c.limit, to: Math.max(0, (c.pool - c.before - x) / c.daysLeft), fits: x <= remaining + c.todaySp, inToday: false };
};
const updateAfford = () => {
  const out = $('#af-out'); if (!out || !sheetState) return;
  const x = num(sheetState.amt); const c0 = dayCalc(today0());
  if (!x) { out.innerHTML = '<p class="hint">Type a price to see how it changes your daily limit until payday on ' + short(c0.cyc.end) + '.</p>'; return; }
  const r = affordCalc(x, sheetState.when); const c = r.c;
  let cls = 'v-ok'; let head = 'Yes, comfortably'; let body;
  if (!r.fits) { cls = 'v-no'; head = 'Not before payday'; body = 'It\'s ' + inr(x - Math.max(0, r.remaining)) + ' more than you have left to spend until ' + short(c.cyc.end) + '.'; }
  else {
    if (r.isToday && r.inToday) head = 'Yes, it fits in today';
    else if (r.to < r.from * 0.75) { cls = 'v-mid'; head = 'Yes, with a trade-off'; }
    body = r.restDays ? 'Your daily limit will drop from <b>' + inr(r.from) + '</b> to <b>' + inr(r.to) + '</b> for the ' + r.restDays + ' day' + (r.restDays === 1 ? '' : 's') + (r.isToday ? ' after today' : ' until payday') + '.'
      : 'It fits in today\'s ' + inr(c.left) + '. Payday is tomorrow.';
  }
  const max = r.from || 1;
  const cmp = r.fits && r.restDays ? '<div class="cmp" role="img" aria-label="Daily limit ' + inr(r.from) + ' now, ' + inr(r.to) + ' after"><span class="flabel">' + (r.isToday ? 'Daily limit from tomorrow' : 'Daily limit from today') + '</span>' +
    '<div class="r"><span>Now</span><span class="b"><span style="width:100%;background:var(--seg-spend)"></span></span><b class="num">' + inr(r.from) + '</b></div>' +
    '<div class="r"><span>After</span><span class="b"><span style="width:' + clamp(r.to / max * 100, 0, 100) + '%;background:' + (cls === 'v-mid' ? 'var(--seg-bills)' : 'var(--seg-save)') + '"></span></span><b class="num">' + inr(r.to) + '</b></div></div>' : '';
  let next = '';
  if (!r.fits) {
    const nc = cycleFor(c.cyc.end); const np = (Number(S.profile.salary) || 0) - fixedTotal(nc) - goalsMonthly();
    if (np > x) next = '<p class="hint">After payday it fits: next cycle your daily limit would be about ' + inr((np - x) / nc.days) + ' instead of ' + inr(np / nc.days) + '.</p>';
  }
  out.innerHTML = '<div class="verdict ' + cls + '"><b>' + head + '</b>' + body + '</div>' + cmp + next +
    '<div class="btns">' + (r.fits && r.isToday ? '<button class="btn" data-act="af-log">Log it as a spend</button>' : '') + '</div>';
};

// Gold calculator: what a piece costs (gold + making + 3% GST), or roughly what old gold would fetch.
const goldCalcSheet = () => {
  const g = market().gold;
  openSheet(shead('Gold calculator') + '<form data-form="goldcalc" class="stack gcform">' +
    '<div class="field"><span class="flabel">I want to</span><div class="seg"><button type="button" aria-pressed="true" data-act="gc-mode" data-v="buy">Buy</button><button type="button" aria-pressed="false" data-act="gc-mode" data-v="sell">Sell old gold</button></div><input type="hidden" name="mode" value="buy"></div>' +
    '<div class="two"><div class="field"><label for="gc-g">Weight (grams)</label><input class="input" id="gc-g" name="grams" inputmode="decimal" placeholder="10" autofocus></div>' +
    '<div class="field"><label for="gc-k">Purity</label><select class="input" id="gc-k" name="karat"><option value="24">24K · 99.9%</option><option value="22" selected>22K · 91.6%</option><option value="18">18K · 75%</option><option value="14">14K · 58.5%</option></select></div></div>' +
    '<div class="field"><label for="gc-r">24K rate per gram</label><input class="input" id="gc-r" name="rate" inputmode="decimal" value="' + (g ? g.r24 : '') + '"><span class="hint">' + (g ? 'Rate on ' + esc(g.date) + '. Change it to your jeweller\'s rate.' : 'Type your jeweller\'s rate.') + '</span></div>' +
    '<div class="two buyonly"><div class="field"><label for="gc-m">Making charges</label><input class="input" id="gc-m" name="making" inputmode="decimal" value="12"></div>' +
    '<div class="field"><span class="flabel">Charged as</span><div class="seg"><button type="button" aria-pressed="true" data-act="simple-seg" data-v="pct">% of gold</button><button type="button" aria-pressed="false" data-act="simple-seg" data-v="pg">₹ per gram</button></div><input type="hidden" name="mtype" value="pct"></div></div>' +
    '<div class="field sellonly" hidden><label for="gc-d">Jeweller\'s deduction (%)</label><input class="input" id="gc-d" name="deduct" inputmode="decimal" value="3"></div>' +
    '<div id="gc-out" class="gcout" aria-live="polite"></div><div class="btns" id="gc-acts"></div></form>', { gold: true });
  updateGoldCalc();
};
const updateGoldCalc = () => {
  const form = document.querySelector('form[data-form=goldcalc]'); if (!form) return;
  const d = Object.fromEntries(new FormData(form).entries()); const f = (v) => Number(String(v || '').replace(/[^\d.]/g, '')) || 0;
  const grams = f(d.grams); const k = Number(d.karat); const perG = goldRate(k, f(d.rate)); const metal = grams * perG;
  const out = $('#gc-out'); const acts = $('#gc-acts');
  const row = (l, v, cls) => '<div class="row' + (cls ? ' ' + cls : '') + '"><span class="grow"><b>' + l + '</b></span><span class="amt num">' + v + '</span></div>';
  if (!grams || !perG) { out.innerHTML = '<p class="empty">Type a weight to see the price.</p>'; acts.innerHTML = ''; sheetState.gc = null; return; }
  if (d.mode === 'sell') {
    const ded = metal * f(d.deduct) / 100;
    out.innerHTML = row(k + 'K at ' + inr(perG) + '/g × ' + grams + ' g', inr(metal)) + row('Deduction (' + f(d.deduct) + '%)', '−' + inr(ded)) + row('You\'d get about', inr(metal - ded), 'total');
    acts.innerHTML = ''; sheetState.gc = null; return;
  }
  const making = d.mtype === 'pg' ? grams * f(d.making) : metal * f(d.making) / 100;
  const gst = (metal + making) * 0.03; const total = metal + making + gst;
  out.innerHTML = row(k + 'K at ' + inr(perG) + '/g × ' + grams + ' g', inr(metal)) + row('Making charges', inr(making)) + row('GST 3%', inr(gst)) + row('Total price', inr(total), 'total') +
    '<p class="hint" style="padding:0 0 10px">Hallmarking (about ₹45 a piece) is extra. GST is charged on gold plus making.</p>';
  acts.innerHTML = '<button class="btn" type="button" data-act="gc-afford">Can I afford ' + inr(total) + '?</button><button class="btn ghost" type="button" data-act="gc-add">Add to locker</button>';
  sheetState.gc = { total: Math.round(total), grams, karat: String(k) };
};

// Gold piece: add or edit (name, weight, purity, date).
const goldSheet = (x) => {
  simpleSheet(x ? 'Edit gold' : 'Add gold', [
    { name: 'note', label: 'What is it?', value: x ? x.note : '', placeholder: 'Chain, coin, earrings…' },
    { name: 'grams', label: 'Weight (grams)', numeric: true, value: x ? x.grams : '', placeholder: '0' },
    { name: 'karat', label: 'Purity', type: 'seg', value: x ? String(x.karat) : '22', options: [['24', '24K'], ['22', '22K'], ['18', '18K']] },
    { name: 'date', label: 'Bought on', type: 'date', value: x ? x.date || '' : dkey(today0()) }
  ], (d) => { const g = Number(String(d.grams).replace(/[^\d.]/g, '')); if (!g) return false;
    const rec = { grams: g, karat: d.karat, note: (d.note || '').trim(), date: d.date };
    if (x) Object.assign(x, rec); else S.gold.push({ id: uid(), ...rec });
    return x ? 'Saved' : 'Added to your gold locker'; }, x ? '<button class="btn danger" type="button" data-act="del-gold">Remove</button>' : '', '<p class="hint">Most jewellery is 22K; coins and bars are usually 24K.</p>');
  if (x) sheetState.editId = x.id;
};
const reminderSheet = (r) => {
  openSheet(shead(r ? 'Edit reminder' : 'New reminder') + '<form data-form="rem" class="stack">' +
    '<div class="field"><label for="rem-t">Remind me to</label><input class="input" id="rem-t" name="text" required maxlength="80" placeholder="Turn off ULIP autopay" value="' + esc(r ? r.text : '') + '"></div>' +
    calPicker('date', r ? r.date : dkey(addDays(today0(), 7)), 'On', { min: dkey(today0()) }) +
    '<div class="btns">' + (r ? '<button class="btn danger" type="button" data-act="del-rem">Delete</button>' : '') + '<button class="btn" type="submit">Save</button></div></form>', { id: r ? r.id : null });
};
const limitSheet = () => {
  const c = dayCalc(today0()); const left = Math.max(0, c.pool - c.before);
  openSheet(shead('How today\'s number works') + '<div class="whyrows box"><div><span>Spending money this pay cycle</span><b class="num">' + inr(c.pool) + '</b></div><div><span>Spent before today</span><b class="num">−' + inr(c.before) + '</b></div><div class="tot"><span>Left for ' + c.daysLeft + ' day' + (c.daysLeft === 1 ? '' : 's') + '</span><b class="num">' + inr(left) + '</b></div></div>' +
    '<p class="hint">' + inr(left) + ' ÷ ' + c.daysLeft + ' days = <b>' + inr(c.limit) + '</b> for today' + '. Spend less today and every day after gets a little richer. Overspend and they all chip in.</p>' +
    '<p class="hint">Spending money = salary minus bills, EMIs, savings, money home and monthly goals. Spends paid from savings and ATM withdrawals don\'t count.</p><button class="btn full" data-act="close-sheet">Got it</button>');
};
const closeDaySheet = () => {
  const c = dayCalc(today0()); const good = c.left >= 0; const r = roastLine(c);
  openSheet('<div class="report stack"><span class="label" style="margin:0">' + fmtDate(today0()) + '</span><h2>' + (good ? 'You won today' : 'Today won') + '</h2>' +
    '<span class="bigr num ' + (good ? 'good' : 'bad') + '">' + (good ? '+' : '−') + inr(Math.abs(c.left)) + '</span><p class="hint">' + (good ? 'stays in your month for the days ahead' : 'comes out of the days ahead') + '</p>' +
    '<div class="roastbox">' + esc(r.b) + '<br><br>Spent <b>' + inr(c.todaySp) + '</b> of your <b>' + inr(c.limit) + '</b>. Tomorrow\'s number: <b>' + inr(c.tomorrow) + '</b>.</div>' +
    '<button class="btn full" data-act="close-sheet">' + (good ? 'Goodnight, legend' : 'Fair. Got it.') + '</button></div>');
  if (good) setTimeout(popper, 250);
};

/* ---------------- confetti ---------------- */
let parts = []; let raf = 0;
const popper = () => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv = $('#confetti'); if (!cv) return; const cx = cv.getContext('2d');
  const w = innerWidth, h = innerHeight, dpr = Math.min(2, devicePixelRatio || 1); cv.width = w * dpr; cv.height = h * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cols = ['#86b4e4', '#f2ab7e', '#6cc597', '#f3a9c8', '#e3b54a', '#15233a'];
  [[0, h * 0.8, -1], [w, h * 0.8, 1]].forEach(([x, y, dir]) => { for (let i = 0; i < 80; i++) { const a = -Math.PI / 2 + dir * (-0.25 - Math.random() * 0.75), v = 9 + Math.random() * 9;
    parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, w: 5 + Math.random() * 6, h: 8 + Math.random() * 8, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, c: cols[i % cols.length], life: 1 }); } });
  const loop = () => { cx.clearRect(0, 0, w, h);
    parts.forEach((q) => { q.vy += 0.32; q.vx *= 0.985; q.vy *= 0.985; q.x += q.vx; q.y += q.vy; q.rot += q.vr; q.life -= 0.006;
      cx.save(); cx.translate(q.x, q.y); cx.rotate(q.rot); cx.globalAlpha = clamp(q.life * 2, 0, 1); cx.fillStyle = q.c; cx.fillRect(-q.w / 2, -q.h / 2, q.w, q.h * Math.abs(Math.cos(q.rot * 2))); cx.restore(); });
    parts = parts.filter((q) => q.life > 0 && q.y < h + 40); raf = parts.length ? requestAnimationFrame(loop) : 0; if (!raf) cx.clearRect(0, 0, w, h); };
  if (!raf) loop();
};

/* ---------------- render ---------------- */
// One clean light look: white background, pastel cards and 3D icons.
const applyTheme = () => { document.documentElement.dataset.theme = 'light'; };
const asDetail = (html) => html.replace('<div class="screen">', '<div class="screen">' + backBtn());
const VIEWS = { statement: () => renderMonth(), settings: () => asDetail(renderSettings()), allbills: () => renderBills(), cats: () => renderCats(), news: () => renderNews(), tax: () => renderTax(), emi: () => renderEmi(), reminders: () => renderReminders() };
const TAB_VIEWS = { money: () => renderHome(), bills: () => renderBillsTab(), jar: () => renderJarTab(), gold: () => renderGoldTab() };
const tabHead = () => {
  const t = today0(); const g = market().gold;
  const [title, sub, pic] = {
    money: [S.profile.name ? 'Hi, ' + S.profile.name : 'Hi there', DAY[t.getDay()] + ', ' + t.getDate() + ' ' + MONTH[t.getMonth()], 'elephant'],
    bills: ['Bills and EMIs', MONTH[cycMonth(cycleFor(t)).getMonth()], 'spiral_calendar'],
    jar: ['Savings jar', 'Leftover money lives here', 'coin'],
    gold: ['Gold and silver', g ? 'Rates for ' + g.date : 'Your gold and silver', 'gem_stone']
  }[tab];
  return '<header class="tophead"><button class="me" data-act="settings" aria-label="Open settings">' + esc((S.profile.name || '?').charAt(0).toUpperCase()) + '</button>' +
    '<span class="tt"><b>' + esc(title) + '</b><span>' + esc(sub) + '</span></span><img class="hpic" src="icons/' + pic + '.png" alt=""></header>' +
    '<nav class="topnav" aria-label="Main">' + TABS.map(([k, l, i]) => '<button data-tab="' + k + '" data-act="tab"' + (tab === k ? ' aria-current="page"' : '') + '>' + ico(i) + l + '</button>').join('') + '</nav>';
};
const render = () => {
  applyTheme();
  const app = $('#app');
  if (!S.onboarded) { app.innerHTML = renderOnb(); return; }
  let body;
  if (view && view.startsWith('mod:')) body = renderModule(view.slice(4));
  else if (view && VIEWS[view]) body = VIEWS[view]();
  else body = (TAB_VIEWS[tab] || TAB_VIEWS.money)().replace(/^<div class="screen([^"]*)">/, (m) => m + tabHead());
  app.innerHTML = body;
};

/* ---------------- actions ---------------- */
const go = (t) => { if (VIEWS[t]) { openView(t); return; } tab = TAB_VIEWS[t] ? t : 'money'; view = null; stack.length = 0; render(); window.scrollTo(0, 0); };
const openView = (v) => { stack.push({ tab, view }); view = v; render(); window.scrollTo(0, 0); };
const goBack = () => { const p = stack.pop(); if (p) { tab = p.tab; view = p.view; } else view = null; render(); window.scrollTo(0, 0); };
const persist = (msg) => { save(); render(); if (msg) toast(msg); scheduleNotifications(); };

const download = async (name, text, mime) => {
  if (FS && SH) {
    try {
      const r = await FS.writeFile({ path: name, data: text, directory: 'CACHE', encoding: 'utf8' });
      await SH.share({ title: name, files: [r.uri] });
      return;
    } catch (e) { /* fall through to browser download */ }
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: mime })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
};
const csvCell = (v) => { let s2 = String(v ?? ''); if (/^[=+\-@]/.test(s2)) s2 = "'" + s2; return /[",\n]/.test(s2) ? '"' + s2.replace(/"/g, '""') + '"' : s2; };
const exportCsv = () => {
  const rows = [['Date', 'Type', 'Category', 'Paid with', 'Note', 'Amount (INR)']];
  S.spends.slice().sort((a, b) => (a.date < b.date ? -1 : 1)).forEach((sp) => rows.push([sp.date, sp.fromSavings ? 'Spend (from savings)' : 'Spend', catOf(sp.cat).name, sp.method === 'cash' ? 'Cash' : 'UPI / card', sp.note || '', sp.amt]));
  S.items.forEach((it) => Object.keys(it.paid || {}).forEach((k) => rows.push([k, KINDS[it.kind] || 'Bill', '', '', it.name, it.amount])));
  download('leash-' + dkey(today0()) + '.csv', '﻿' + rows.map((r) => r.map(csvCell).join(',')).join('\n'), 'text/csv');
};
// Confetti when a goal crosses 25/50/75/100% (or the emergency fund 1/3/6 months).
const goalMilestone = (g, before) => {
  if (g.kind === 'emergency') { const need = Number(g.need) || 0; if (!need) return ''; const hit = [1, 3, 6].find((m) => before / need < m && Number(g.saved) / need >= m); return hit ? hit + ' month' + (hit > 1 ? 's' : '') + ' covered! 🎉' : ''; }
  const tgt = Number(g.target) || 0; if (!tgt) return ''; const hit = [0.25, 0.5, 0.75, 1].find((m) => before / tgt < m && Number(g.saved) / tgt >= m);
  return hit ? (hit === 1 ? g.name + ': done! 🎉' : Math.round(hit * 100) + '% of ' + g.name + '!') : '';
};

const handlers = {
  tab: (el) => go(el.dataset.tab),
  money: () => go('money'),
  statement: () => openView('statement'),
  allbills: () => openView('allbills'),
  'to-pay': () => handlers['pay-other'](),
  settings: () => go('settings'),
  'close-view': () => goBack(),
  jar: () => go('jar'),
  silver: () => go('gold'),
  'add-silver': () => silverSheet(),
  'edit-silver': (el) => silverSheet(S.silver.find((x) => x.id === el.dataset.id)),
  'del-silver': () => { S.silver = S.silver.filter((x) => x.id !== sheetState.editId); closeSheet(); persist('Silver removed'); },
  'jar-out': () => { const has = jarBalance(); if (has <= 0) { toast('Your jar is empty. It fills up on payday.'); return; }
    simpleSheet('Take out of the jar', [{ name: 'amt', label: 'How much? You have ' + inr(has), numeric: true, placeholder: '₹' }],
      (d) => { const a = num(d.amt); if (!a || a > has) return false; S.jar.out.push({ id: uid(), amt: a, date: dkey(today0()) }); return inr(a) + ' added to your spending money'; }); },
  'clear-start': () => { if (confirm('Remove the starting balance? This pay period will use your salary instead.')) { S.start = null; persist('Starting balance removed'); } },
  'ai-key': () => aiKeySheet(),
  'ai-remove': () => { window.LeashAI.setKey(''); closeSheet(); persist('Google AI removed'); },
  mic: () => listen(),
  'ask-pay': (el) => { const m = S.chat.find((x) => x.id === el.dataset.id); if (!m) return; delete m.ask; applyPay(m.amt, m); },
  'ask-spend': (el) => { const m = S.chat.find((x) => x.id === el.dataset.id); if (!m) return; delete m.ask; m.text = 'Okay, where did it go?'; const amt = m.amt; persist(); spendSheet(null, { amt, note: '' }); },
  'chat-undo': (el) => { const m = S.chat.find((x) => x.id === el.dataset.id); if (!m || !m.undo) return; const u = m.undo;
    S.spends = S.spends.filter((x) => !(u.spends || []).includes(x.id)); S.income = S.income.filter((x) => !(u.income || []).includes(x.id)); if (u.pay) delete S.paylog[u.pay];
    delete m.undo; m.rows = null; m.text = 'Undone.'; persist(); },
  bills: () => go('bills'), cats: () => openView('cats'), news: () => openView('news'), tax: () => openView('tax'),
  emi: () => openView('emi'), reminders: () => openView('reminders'), gold: () => go('gold'),
  module: (el) => openView('mod:' + el.dataset.id),
  'module-soon': (el) => { const m = MODS.find((x) => x.id === el.dataset.id); toast((m && m.blurb ? m.blurb + ' ' : '') + 'Coming soon.'); },
  // spends
  add: () => spendSheet(),
  'to-spend': () => spendSheet(),
  'to-moneyin': () => moneyInSheet(),
  'edit-moneyin': (el) => moneyInSheet(S.income.find((x) => x.id === el.dataset.id)),
  'del-moneyin': () => { S.income = S.income.filter((x) => x.id !== sheetState.editId); closeSheet(); persist('Removed'); },
  'month-prev': () => { if (monthCycle().start > firstCycle().start) { monthOff++; monthOpen = false; render(); } },
  'month-next': () => { monthOff = Math.max(0, monthOff - 1); monthOpen = false; render(); },
  'month-setaside': () => { monthOpen = !monthOpen; render(); },
  'edit-spend': (el) => spendSheet(S.spends.find((x) => x.id === el.dataset.id)),
  'close-sheet': () => closeSheet(),
  key: (el) => { const k = el.dataset.k; let a = sheetState.amt; if (k === 'del') a = a.slice(0, -1); else if (a.length < 7) a = (a === '0' ? '' : a) + k; sheetState.amt = a.replace(/^0+(?=\d)/, ''); drawSpend(); },
  'pick-cat': (el) => { sheetState.cat = el.dataset.id; sheetState.catAuto = false; drawSpend(); },
  'pick-method': (el) => { sheetState.method = el.dataset.v; drawSpend(); },
  'pick-savings': () => { sheetState.fromSavings = !sheetState.fromSavings; sheetState.open = true; drawSpend(); },
  'more-toggle': () => { setTimeout(() => { const d = document.querySelector('#sheet details.more'); if (d && sheetState) sheetState.open = d.open; }, 0); },


  sug: (el) => { Object.assign(sheetState, { note: el.dataset.note, cat: el.dataset.cat, catAuto: false, open: true }); drawSpend(); },
  'save-spend': () => {
    const st = sheetState; const n = num(st.amt); if (!n) return;
    const before = dayCalc(today0()).left; let sp;
    const rec = { amt: n, cat: st.cat, note: st.note.trim(), date: st.date, method: catOf(st.cat).withdrawal ? 'cash' : st.method, fromSavings: !!st.fromSavings };
    if (st.id) { sp = S.spends.find((x) => x.id === st.id); Object.assign(sp, rec); if (rec.note) learn(rec.note, rec.cat); } else sp = logSpend(rec);
    closeSheet(); persist();
    const after = dayCalc(today0()).left;
    if (after < 0 && before >= 0 && counts(sp)) toast('Over today\'s number by ' + inr(-after) + '. Bold choice.'); else spendBanner(n, sp);
  },
  'del-spend': () => { S.spends = S.spends.filter((x) => x.id !== sheetState.id); closeSheet(); persist('Deleted. We never speak of it.'); },

  'no-spend': () => { S.noSpend[dkey(today0())] = true; persist(); flash('proud'); popper(); },
  'limit-info': () => limitSheet(),
  'close-day': () => closeDaySheet(),
  'share-text': async () => { const text = sheetState && sheetState.shareText; if (!text) return; try { if (SH) await SH.share({ text }); else if (navigator.share) await navigator.share({ text }); else { await navigator.clipboard.writeText(text); toast('Copied'); } } catch (e) { /* cancelled */ } },
  afford: () => affordSheet(''),
  'af-log': () => { const x = num(sheetState.amt); spendSheet(null, { amt: x }); },
  // bills
  'new-item': () => itemSheet(),
  'add-item-kind': (el) => itemSheet(null, el.dataset.kind),
  'edit-item': (el) => itemSheet(S.items.find((i) => i.id === el.dataset.id)),
  'pick-kind': (el) => { sheetState.kind = el.dataset.v; el.parentElement.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b === el)); },
  'del-item': () => { S.items = S.items.filter((i) => i.id !== sheetState.id); closeSheet(); persist('Removed'); },
  'toggle-paid': (el) => {
    const it = S.items.find((i) => i.id === el.dataset.id); const key = el.dataset.key || mkey(today0());
    it.paid = it.paid || {}; const nowPaid = !it.paid[key];
    if (nowPaid) it.paid[key] = dkey(today0()); else delete it.paid[key];
    if (/ppf/i.test(it.name)) { const fy = fyKey(parseKey(key + '-01')); S.ppf.put[fy] = Math.max(0, (Number(S.ppf.put[fy]) || 0) + (nowPaid ? 1 : -1) * (Number(it.amount) || 0)); }
    persist();
    if (!nowPaid) { toast('Marked as not paid'); return; }
    const left = cycItems(cycleFor(today0())).filter((x) => !x.paid && x.it.kind !== 'remind');
    if (it.kind === 'emi' && it.end === key) { popper(); toast(it.name + ': last one! You\'re free. 🎉'); }
    else if (!left.length) { popper(); toast('All bills paid this cycle! 🎉'); }
    else toast(it.kind === 'home' ? 'Marked as sent' : it.name + ' paid. One less thing.');
  },
  // reminders
  'new-rem': () => reminderSheet(),
  'edit-rem': (el) => reminderSheet(S.reminders.find((r) => r.id === el.dataset.id)),
  'del-rem': () => { S.reminders = S.reminders.filter((r) => r.id !== sheetState.id); closeSheet(); persist('Reminder deleted'); },
  'rem-done': (el) => { const r = S.reminders.find((x) => x.id === el.dataset.id); r.done = !r.done; persist(r.done ? 'Done. Responsible queen behaviour.' : ''); },
  // goals
  // gold
  'add-gold': () => goldSheet(),
  'edit-gold': (el) => goldSheet(S.gold.find((g) => g.id === el.dataset.id)),
  'del-gold': () => { S.gold = S.gold.filter((g) => g.id !== sheetState.editId); closeSheet(); persist('Removed from the locker'); },
  'gold-cut': (el) => { S.goldCut = Number(el.dataset.v); persist(); },
  'gold-calc': () => goldCalcSheet(),
  'gc-mode': (el) => { const f = el.closest('.field'); f.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === el))); f.querySelector('input').value = el.dataset.v; const sell = el.dataset.v === 'sell'; document.querySelectorAll('#sheet .buyonly').forEach((x) => { x.hidden = sell; }); document.querySelectorAll('#sheet .sellonly').forEach((x) => { x.hidden = !sell; }); updateGoldCalc(); },
  'gc-afford': () => { const gc = sheetState && sheetState.gc; if (gc) affordSheet(gc.total); },
  'gc-add': () => { const gc = sheetState && sheetState.gc; if (!gc) return; S.gold.push({ id: uid(), grams: gc.grams, karat: gc.karat, note: '', date: dkey(today0()) }); closeSheet(); persist('Added ' + gc.grams + ' g to your gold locker'); },
  'gold-goal': () => simpleSheet('Gold goal', [{ name: 'g', label: 'How many grams do you want to own?', numeric: true, value: S.goldTarget || '', placeholder: '20' }], (d) => { S.goldTarget = Number(String(d.g || '').replace(/[^\d.]/g, '')) || 0; return S.goldTarget ? 'Gold goal saved' : 'Gold goal removed'; }),
  // review + tax
  'tax-nps': (el) => { taxIn.npsPct = Number(el.dataset.v); render(); },
  // news
  'save-news': (el) => { const n = (market().news.items || []).map((x) => ({ ...x, id: newsId(x) })).find((x) => x.id === el.dataset.id); if (n && !S.saved.some((x) => x.id === n.id)) S.saved.unshift(n); persist('Saved. It stays until you remove it.'); },
  'unsave-news': (el) => { S.saved = S.saved.filter((x) => x.id !== el.dataset.id); if (!S.read.includes(el.dataset.id)) S.read.push(el.dataset.id); persist(); },
  'read-news': (el) => { const id = el.dataset.id; if (!S.read.includes(id)) S.read.push(id); S.read = S.read.slice(-300); save(); if (el.tagName !== 'A') { render(); toast('Marked as read. It\'s under "Read" at the bottom.'); } else setTimeout(render, 300); },
  'dismiss-news': (el) => { if (!S.dismissed.includes(el.dataset.id)) S.dismissed.push(el.dataset.id); S.dismissed = S.dismissed.slice(-300); persist('Dismissed'); },
  // money sent home
  // payday
  payday: () => paydaySheet(),
  'pay-yes': () => { const cyc = cycleFor(today0()); S.paylog[cyc.key] = { amount: Number(S.profile.salary) || 0, date: dkey(today0()) }; persist(); banner('Salary\'s in 🎉', 'Bills and savings come out first. Today you can spend ' + inr(dayCalc(today0()).left) + '.'); popper(); },
  'pay-other': () => simpleSheet('How much arrived?', [{ name: 'amt', label: 'Salary credited this month', numeric: true, value: S.profile.salary || '', placeholder: '₹' }, { name: 'date', label: 'Arrived on', type: 'date', value: dkey(today0()) }],
    (d) => { const a = num(d.amt); if (!a) return false; S.paylog[cycleFor(today0()).key] = { amount: a, date: d.date || dkey(today0()) }; return 'This month is now planned from ' + inr(a) + '.'; }, '', '<p class="hint">Bonus or a smaller month? Your daily number is worked out from what actually arrived.</p>'),
  'pay-undo': () => { delete S.paylog[cycleFor(today0()).key]; persist('Undone'); },
  // settings
  'edit-profile': () => simpleSheet('Your details', [
    { name: 'name', label: 'Name', value: S.profile.name },
    { name: 'salary', label: 'Monthly salary (in hand)', numeric: true, value: S.profile.salary || '' }
  ], (d) => {
    S.profile.name = (d.name || '').trim(); S.profile.salary = num(d.salary);
    return 'Saved';
  }, '', '<p class="hint">Money for home is a monthly payment in Bills, like rent.</p>'),
  'toggle-setting': (el) => { const k = el.dataset.key; S.settings[k] = !S.settings[k]; persist(); },
  'toggle-extra': (el) => { const k = el.dataset.key; S.features[k] = !S.features[k]; persist(); },
  theme: (el) => { S.settings.theme = el.dataset.v; persist(); },
  'new-cat': () => catSheet(),
  'edit-cat': (el) => catSheet(S.cats.find((c) => c.id === el.dataset.id)),
  'del-cat': () => { const id = sheetState.editId; if (S.spends.some((x) => x.cat === id)) { toast('This category has spends. Rename it instead.'); return; } S.cats = S.cats.filter((c) => c.id !== id); closeSheet(); persist('Category removed'); },
  'simple-seg': (el) => { const f = el.closest('.field'); f.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b === el)); f.querySelector('input[type=hidden]').value = el.dataset.v; updatePaydayPreview(el); if (el.closest('form[data-form=goldcalc]')) updateGoldCalc(); },
  'restore-pick': () => restoreInput.click(),
  'export-csv': () => exportCsv(),
  'export-json': () => download('leash-backup-' + dkey(today0()) + '.json', JSON.stringify(S, null, 1), 'application/json'),
  reset: () => { if (confirm('Erase all Leash data on this device? Make a backup first if you might want it back.')) { S = fresh(); save(); tab = 'money'; view = null; stack.length = 0; render(); } },
  'onb-skip': () => { S.onboarded = true; persist(); },
  'onb-back': () => { onb.step = Math.max(0, onb.step - 1); render(); },
  // calendar picker
  'cp-toggle': (el) => { const pop = el.parentElement.querySelector('.cpop'); const open = pop.hidden; closePickers(); pop.hidden = !open; el.setAttribute('aria-expanded', String(open)); },
  'cp-nav': (el) => {
    const f = el.closest('.cp'); const [y, m] = f.dataset.view.split('-').map(Number); const nv = mkey(new Date(y, m - 1 + Number(el.dataset.dir), 1));
    f.dataset.view = nv; const v = f.querySelector('input[type=hidden]').value;
    f.querySelector('.cpop').innerHTML = calGrid(nv, v, f.dataset.min) + (f.dataset.empty && !f.classList.contains('inline') ? '<button type="button" class="link" data-act="cp-clear">' + esc(f.dataset.empty) + '</button>' : '');
  },
  'cp-pick': (el) => {
    const f = el.closest('.cp'); f.querySelector('input[type=hidden]').value = el.dataset.v;
    f.querySelectorAll('.cpgrid button').forEach((b) => b.setAttribute('aria-pressed', String(b === el)));
    const btn = f.querySelector('.cpbtn'); if (btn) { btn.querySelector('span').textContent = fmtDate(parseKey(el.dataset.v)); f.querySelector('.cpop').hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
    onPicked(f);
  },
  'cp-clear': (el) => { const f = el.closest('.cp'); f.querySelector('input[type=hidden]').value = ''; f.querySelectorAll('.cpgrid button').forEach((b) => b.setAttribute('aria-pressed', 'false')); const btn = f.querySelector('.cpbtn'); btn.querySelector('span').textContent = f.dataset.empty; f.querySelector('.cpop').hidden = true; btn.setAttribute('aria-expanded', 'false'); onPicked(f); }
};

const catSheet = (c) => {
  simpleSheet(c ? 'Edit category' : 'New category', [{ name: 'name', label: 'Name', value: c ? c.name : '', placeholder: 'Chai, gym, gifts…' }], (d) => {
    const name = (d.name || '').trim(); if (!name) return false;
    if (c) c.name = name; else S.cats.push({ id: 'c' + uid(), name, icon: 'dots', c: S.cats.length % CAT_COLORS.length });
    return 'Saved';
  }, c ? '<button class="btn danger" type="button" data-act="del-cat">Delete</button>' : '');
  if (c) sheetState.editId = c.id;
};

/* ---------------- restore ----------------
   The file picker lives outside #app, so the redraw that happens when Android hides and shows Leash
   around the picker can't throw it away before the chosen file arrives. */
const restoreInput = document.createElement('input');
restoreInput.type = 'file'; restoreInput.hidden = true; restoreInput.setAttribute('aria-hidden', 'true');
document.body.appendChild(restoreInput);
const restoreFrom = (f) => {
  const r = new FileReader();
  r.onload = () => {
    let d = null;
    try { d = JSON.parse(String(r.result).replace(/^﻿/, '').trim()); } catch (e) { d = null; }
    if (!d || d.v !== 2 || !Array.isArray(d.spends)) { toast('That file is not a Leash backup.'); return; }
    try { localStorage.setItem(KEY, JSON.stringify(d)); load(); tab = 'money'; view = null; stack.length = 0; persist('Backup restored'); window.scrollTo(0, 0); } catch (e) { toast('The backup could not be restored. Your data is unchanged.'); }
  };
  r.onerror = () => toast('Leash could not open that file. Try saving it to Downloads first.');
  r.readAsText(f);
};
restoreInput.addEventListener('change', () => { const f = restoreInput.files && restoreInput.files[0]; restoreInput.value = ''; if (f) restoreFrom(f); });

/* ---------------- events ---------------- */
document.addEventListener('click', (ev) => {
  if (!ev.target.closest('.cp')) closePickers();
  const el = ev.target.closest('[data-act]'); if (!el) return;
  const fn = handlers[el.dataset.act]; if (!fn) return;
  if (el.tagName !== 'A' && el.tagName !== 'INPUT') ev.preventDefault();
  fn(el, ev);
});
$('#scrim').addEventListener('click', closeSheet);
document.addEventListener('keydown', (ev) => {
  if (ev.key !== 'Escape') return;
  if (document.querySelector('.cp:not(.inline) .cpop:not([hidden])')) { closePickers(); return; }
  if ($('#sheet').classList.contains('show')) closeSheet();
});
document.addEventListener('input', (ev) => {
  const tg = ev.target; const b = tg.dataset && tg.dataset.bind;
  if (b && sheetState) { sheetState[b] = tg.value; if (b === 'date') drawSpend(); else if (b === 'note') noteTyped(tg.value); return; }
  if (tg.id === 'af-amt' && sheetState) { sheetState.amt = tg.value; updateAfford(); return; }
  if (tg.id === 'af-when' && sheetState) { sheetState.when = tg.value; updateAfford(); return; }
  if (tg.closest && tg.closest('form[data-form=goldcalc]')) { updateGoldCalc(); return; }
});
document.addEventListener('change', (ev) => {
  const tg = ev.target;
  if (tg.name === 'payLast') { updatePaydayPreview(tg); return; }
  if (tg.dataset && tg.dataset.tax) { taxIn[tg.dataset.tax] = Math.min(tg.dataset.tax === 'basicPct' ? 100 : 1e9, num(tg.value)); render(); return; }
});
document.addEventListener('submit', (ev) => {
  const form = ev.target; const kind = form.dataset.form; if (!kind) return;
  ev.preventDefault();
  const d = Object.fromEntries(new FormData(form).entries());
  if (kind === 'tell') {
    const text = String(d.t || '').trim(); if (text) tellEllie(text);
    return;
  }
  if (kind === 'aikey') { saveAiKey(d); return; }
  if (kind === 'moneyin') {
    const amt = num(d.amt); if (!amt) { toast('Enter how much came in'); return; }
    const x = sheetState.editId ? S.income.find((y) => y.id === sheetState.editId) : null;
    if (x) Object.assign(x, { amt, kind: d.kind || 'other', note: (d.note || '').trim(), date: d.date || x.date }); else addMoneyIn(amt, d.kind, d.note, d.date);
    closeSheet(); persist(x ? 'Saved' : inr(amt) + ' added to this month'); if (!x) popper(); return;
  }
  if (kind === 'rem') {
    const text = (d.text || '').trim(); if (!text || !d.date) { toast('Add what and when'); return; }
    const st = sheetState; if (st.id) Object.assign(S.reminders.find((r) => r.id === st.id), { text, date: d.date }); else S.reminders.push({ id: uid(), text, date: d.date, done: false });
    closeSheet(); persist('I\'ll remind you on ' + short(parseKey(d.date))); return;
  }
  if (kind === 'afford') { affordSheet(num($('#afford').value) || ''); return; }
  if (kind === 'payday') {
    const p = readPayday(form); S.profile.payday = p.day; S.profile.payShift = p.shift;
    closeSheet(); persist('Payday saved. Your daily number is re-spread to the new date.'); return;
  }
  if (kind === 'onb0') {
    const p = readPayday(form);
    S.profile.name = (d.name || '').trim(); S.profile.salary = num(d.salary); S.profile.payday = p.day; S.profile.payShift = p.shift; S.profile.homePct = 0;
    S.created = dkey(today0());
    S.start = null;
    onb.step = 1; save(); render(); return;
  }
  if (kind === 'onb1') {
    onb.fixed.forEach((f, i) => { f.name = d['n' + i] || f.name; f.amount = d['a' + i]; f.first = d['d' + i] || f.first || dkey(nextOcc(f.day)); });
    const cyc0 = cycleFor(today0());
    onb.fixed.forEach((f) => { if (!num(f.amount)) return;
      const fd = parseKey(f.first || dkey(nextOcc(f.day)));
      const it = { id: uid(), name: f.name, amount: num(f.amount), day: fd.getDate(), kind: f.kind, start: mkey(fd), end: '', remindBefore: 2, paid: {} };
      occIn(it, cyc0).forEach((due) => { if (due < today0()) it.paid[mkey(due)] = 'before-leash'; }); // already happened this month
      S.items.push(it); });
    S.onboarded = true; tab = 'money'; persist(); return;
  }
  if (kind === 'item') {
    const st = sheetState; const fd = parseKey(d.first || dkey(today0()));
    const data = { name: (d.name || '').trim(), amount: num(d.amount), day: fd.getDate(), kind: st.kind, start: mkey(fd), end: d.last ? mkey(parseKey(d.last)) : '', remindBefore: Number(d.remindBefore), note: (d.note || '').trim() };
    if (!data.name) return;
    if (d.last && d.last < d.first) { toast('The last payment is before the first one'); return; }
    if (st.id) Object.assign(S.items.find((i) => i.id === st.id), data); else S.items.push({ id: uid(), paid: {}, ...data });
    closeSheet(); persist(st.id ? 'Saved' : 'Added. Reminders are set.'); return;
  }
  if (kind === 'goal') {
    const st = sheetState;
    const data = st.kind === 'emergency' ? { kind: 'emergency', name: 'Emergency fund', need: num(d.need), targetMonths: clamp(num(d.targetMonths) || 6, 1, 24), saved: num(d.saved), monthly: num(d.monthly), by: d.by || '' }
      : { kind: 'goal', name: (d.name || '').trim(), target: num(d.target), saved: num(d.saved), monthly: num(d.monthly), by: d.by || '', horizon: d.horizon || 'near' };
    if (data.kind === 'goal' && !data.name) return;
    if (d.add) data.saved += num(d.add);
    const old = st.id ? S.goals.find((g) => g.id === st.id) : null; const before = old ? Number(old.saved) || 0 : 0;
    let g; if (old) { Object.assign(old, data); g = old; } else { g = { id: uid(), ...data }; S.goals.push(g); }
    const hit = old ? goalMilestone(g, before) : '';
    closeSheet(); persist(hit || (num(d.add) ? inr(num(d.add)) + ' added. Future you is grinning.' : 'Saved')); if (hit) popper(); return;
  }
  if (kind === 'simple') {
    const r = sheetState && sheetState.onSave ? sheetState.onSave(d) : false;
    if (r === false) { toast('Please fill in the amount'); return; }
    closeSheet(); persist(typeof r === 'string' ? r : 'Saved');
  }
});

/* ---------------- start ---------------- */
const startupBanners = () => {
  if (!S.onboarded) return;
  const t = today0(); const k = dkey(t); if (S.seenBanners[k]) return;
  const soon = []; [cycleFor(t), cycleFor(cycleFor(t).end)].forEach((cyc) => cycItems(cyc).forEach((x) => { const dd = daysBetween(t, x.due); if (!x.paid && dd >= 0 && dd <= 2) soon.push({ ...x, dd }); }));
  S.items.filter((it) => it.kind === 'remind').forEach((it) => occurrences(it, t, 1).forEach((due) => { const dd = daysBetween(t, due); if (dd <= 2) soon.push({ it, due, dd }); }));
  soon.slice(0, 2).forEach((x, i) => setTimeout(() => { const r = reminderText(x.it, x.due); banner(r.title, x.dd === 0 ? 'Due today. ' + r.body : r.body); }, 700 + i * 900));
  S.seenBanners = { [k]: true }; save();
};
// Remember the gold rate between visits so the feed can show how much it moved.
const trackGold = () => {
  const g = market().gold; if (!g || !g.r24) return;
  if (!S.goldSeen || !S.goldSeen.cur) S.goldSeen = { cur: { date: g.date, r24: g.r24 } };
  else if (S.goldSeen.cur.date !== g.date) S.goldSeen = { prev: S.goldSeen.cur, cur: { date: g.date, r24: g.r24 } };
  save();
};
load();
trackGold();
MODS.forEach((m) => { try { if (m.setup) m.setup(api); } catch (e) { /* a broken module never stops the app */ } });
window.Leash = { api, modules: MODS, engine: { cycleFor, dayCalc, paydayFor, nextPaydays, guessCat, tellLeash, emiInfo, jarBalance, ledger, affordCalc, goldRate, goldTotals } };
render();
startupBanners();
refreshMarket();
scheduleNotifications();
const AppP = plugin('App');
if (AppP) AppP.addListener('backButton', () => {
  if ($('#sheet').classList.contains('show')) closeSheet();
  else if (view) goBack();
  else if (tab !== 'money') go('money');
  else AppP.exitApp();
});
document.addEventListener('visibilitychange', () => { if (!document.hidden) { render(); refreshMarket(); } });
})();
