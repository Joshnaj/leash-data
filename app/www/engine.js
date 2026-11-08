/* Leash money rules. Pure functions only, so they can be tested without the app. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LeashEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const onDay = (y, m, day) => {
    const lastDay = new Date(y, m + 1, 0).getDate();
    return new Date(y, m, Math.min(day, lastDay));
  };
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const isWeekend = (d) => d.getDay() === 0 || d.getDay() === 6;
  const daysBetween = (a, b) => Math.round((new Date(b.getFullYear(), b.getMonth(), b.getDate()) - new Date(a.getFullYear(), a.getMonth(), a.getDate())) / 86400000);

  // Day 31 means the last day of the month. The weekend rule moves payday to the Friday before or the Monday after.
  const paydayFor = (y, m, day, shift) => {
    let d = onDay(y, m, Math.min(31, Math.max(1, Number(day) || 1)));
    if (shift === 'before') while (isWeekend(d)) d = addDays(d, -1);
    else if (shift === 'after') while (isWeekend(d)) d = addDays(d, 1);
    return d;
  };

  // A pay period runs from one payday up to the day before the next.
  // payMonth counts periods one by one, which is what keeps each bill to exactly one period.
  const cycleFor = (date, day, shift) => {
    const y = date.getFullYear();
    let m = date.getMonth();
    for (let g = 0; g < 3 && paydayFor(y, m, day, shift) > date; g++) m--;
    for (let g = 0; g < 3 && paydayFor(y, m + 1, day, shift) <= date; g++) m++;
    const start = paydayFor(y, m, day, shift);
    const end = paydayFor(y, m + 1, day, shift);
    return { start, end, days: daysBetween(start, end), payMonth: { y, m } };
  };

  // Every monthly item lands in exactly one pay period, whichever day of the month it is due.
  const dueInCycle = (cyc, itemDay, payday) => {
    const day = Number(itemDay) || 1;
    const after = day < (Number(payday) || 1) ? 1 : 0;
    return onDay(cyc.payMonth.y, cyc.payMonth.m + after, day);
  };

  const homeShare = (salary, percent) => Math.round((Number(salary) || 0) * (Number(percent) || 0) / 100);

  // Your rule: money left divided by days left. Unspent money spreads over the remaining days by itself.
  const dailyLimit = (pool, spentBefore, daysLeft) => Math.max(0, pool - spentBefore) / Math.max(1, daysLeft);

  /* Closing finished pay periods: what's left goes to the savings jar. What's overspent comes off the next period.
     periods: [{ key, pool, spent }] oldest first. */
  const closePeriods = (periods) => {
    let jar = 0;
    let carry = 0;
    const carryInto = {};
    const closed = [];
    periods.forEach((p) => {
      carryInto[p.key] = carry;
      const left = p.pool + carry - p.spent;
      if (left > 0) { jar += left; carry = 0; closed.push({ key: p.key, toJar: left, over: 0 }); }
      else { carry = left; closed.push({ key: p.key, toJar: 0, over: -left }); }
    });
    return { jar, carry, carryInto, closed };
  };

  const MONEY_IN = /\b(salary|pay ?day|pay came|got paid|paycheck|bonus|incentive|refund|cashback|credited|received|income|reimburs\w*|gift(ed)?|gave me|sent me|won)\b|\bgot\b.*\bfrom\b/i;
  const SALARY = /\b(salary|pay ?day|pay came|got paid|paycheck)\b/i;
  const looksLikeMoneyIn = (text) => MONEY_IN.test(String(text || ''));
  // Only salary words, or an amount close to the usual salary, count as pay. Everything else is extra money this month.
  const isSalary = (text, amount, usual) => SALARY.test(String(text || '')) || (usual > 0 && amount > 0 && Math.abs(amount - usual) / usual <= 0.2);
  const moneyInKind = (text) => { const t = String(text || '').toLowerCase();
    if (/bonus|incentive/.test(t)) return 'bonus'; if (/cashback|refund|reimburs/.test(t)) return 'cashback';
    if (/gift|gave me|sent me|from (mom|dad|amma|nanna|friend|family|office|company|work|bro|sis)/.test(t)) return 'gift'; return 'other'; };
  const moneyInNote = (text) => { const m = String(text || '').match(/\bfrom ([a-z][a-z ]{1,24})/i); return m ? 'From ' + m[1].trim() : ''; };

  /* AI answers are checked here before they can touch your money. Anything doubtful becomes "unclear". */
  const ACTION_TYPES = ['spend', 'pay', 'income', 'no_spend', 'paid_bill', 'question', 'unclear'];
  const QUESTION_TOPICS = ['left', 'spent', 'jar', 'payday'];
  const MAX_AMOUNT = 10000000;
  const checkActions = (raw, categoryIds) => {
    const list = raw && Array.isArray(raw.actions) ? raw.actions : [];
    return list.slice(0, 10).map((a) => {
      if (!a || !ACTION_TYPES.includes(a.type)) return { type: 'unclear' };
      const amount = Math.round(Number(a.amount));
      const validAmount = Number.isFinite(amount) && amount > 0 && amount <= MAX_AMOUNT;
      const sure = Number(a.confidence) >= 0.7;
      if (['spend', 'pay', 'income'].includes(a.type) && !validAmount) return { type: 'unclear' };
      const out = { type: a.type, sure };
      if (validAmount) out.amount = amount;
      if (a.type === 'spend') {
        out.category = categoryIds.includes(a.category) ? a.category : null;
        out.when = a.when === 'yesterday' ? 'yesterday' : 'today';
      }
      if (a.note) out.note = String(a.note).slice(0, 60);
      if (a.type === 'question') out.topic = QUESTION_TOPICS.includes(a.topic) ? a.topic : 'left';
      return out;
    });
  };

  /* Ellie's mood comes from how fast the money is going compared with how much of the period has passed. */
  const moodFor = ({ pool, spent, left, daysPassed, days, noSpendToday }) => {
    if (left < 0 || (pool > 0 && pool - spent <= 0)) return 'worried';
    if (pool > 0 && spent / pool >= 0.9) return 'worried';
    if (noSpendToday) return 'proud';
    if (pool > 0 && spent / pool > daysPassed / Math.max(1, days) + 0.2) return 'careful';
    return 'happy';
  };

  const unlockedCards = (checkIns, total) => Math.min(total, 1 + Math.floor((Number(checkIns) || 0) / 2));

  return { onDay, addDays, daysBetween, paydayFor, cycleFor, dueInCycle, homeShare, dailyLimit, closePeriods, looksLikeMoneyIn, isSalary, moneyInKind, moneyInNote, checkActions, moodFor, unlockedCards };
});
