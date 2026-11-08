const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../www/engine.js');

const D = (y, m, d) => new Date(y, m - 1, d, 12);
const ymd = (d) => [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');
const LAST = 31;

test('last-day payday moves to Friday when it falls on a weekend', () => {
  assert.equal(ymd(E.paydayFor(2026, 9, LAST, 'before')), '2026-10-30'); // Saturday
  assert.equal(ymd(E.paydayFor(2027, 0, LAST, 'before')), '2027-1-29'); // Sunday
  assert.equal(ymd(E.paydayFor(2026, 10, LAST, 'before')), '2026-11-30'); // Monday stays
});

test('a pay period runs from one payday to the next', () => {
  const c = E.cycleFor(D(2026, 11, 3), LAST, 'before');
  assert.equal(ymd(c.start), '2026-10-30');
  assert.equal(ymd(c.end), '2026-11-30');
  assert.equal(c.days, 31);
  assert.equal(ymd(E.cycleFor(D(2026, 11, 30), LAST, 'before').start), '2026-11-30');
  assert.equal(ymd(E.cycleFor(D(2026, 11, 29), LAST, 'before').start), '2026-10-30');
});

test('your rule: split by days left, and unspent money spreads forward', () => {
  assert.equal(E.dailyLimit(30000, 0, 30), 1000);
  assert.equal(Math.round(E.dailyLimit(30000, 0, 29)), 1034);
  assert.equal(Math.round(E.dailyLimit(30000, 1500, 29)), 983); // overspending lowers later days
  assert.equal(E.dailyLimit(30000, 31000, 10), 0);
});

test('every bill day counts exactly once in every pay period, across five years', () => {
  for (const [payday, shift] of [[LAST, 'before'], [LAST, 'after'], [LAST, 'none'], [1, 'before'], [15, 'before'], [28, 'none'], [30, 'before']]) {
    for (let day = 1; day <= 31; day++) {
      const seen = new Set();
      let d = D(2026, 1, 15);
      for (let i = 0; i < 60; i++) {
        const cyc = E.cycleFor(d, payday, shift);
        const due = E.dueInCycle(cyc, day, payday);
        const month = due.getFullYear() * 12 + due.getMonth();
        assert.ok(!seen.has(month), `day ${day} payday ${payday} ${shift} repeated a month`);
        if (seen.size) assert.ok(seen.has(month - 1), `day ${day} payday ${payday} ${shift} skipped a month`);
        seen.add(month);
        d = cyc.end;
      }
    }
  }
});

test('home share follows the actual pay', () => {
  assert.equal(E.homeShare(100000, 46), 46000);
  assert.equal(E.homeShare(0, 46), 0);
});

test('leftover goes to the jar on payday', () => {
  const r = E.closePeriods([{ key: 'a', pool: 30000, spent: 28000 }]);
  assert.equal(r.jar, 2000);
  assert.equal(r.carry, 0);
});

test('overspending comes off the next pay period, then the jar fills again', () => {
  const r = E.closePeriods([{ key: 'a', pool: 30000, spent: 33000 }, { key: 'b', pool: 30000, spent: 20000 }]);
  assert.equal(r.carryInto.b, -3000);
  assert.equal(r.jar, 7000);
});

test('overspending can run across more than one period', () => {
  const r = E.closePeriods([{ key: 'a', pool: 100, spent: 300 }, { key: 'b', pool: 100, spent: 0 }]);
  assert.equal(r.carry, -100);
  assert.equal(r.jar, 0);
});

test('money-in words are noticed', () => {
  assert.ok(E.looksLikeMoneyIn('payday - 10000'));
  assert.ok(E.looksLikeMoneyIn('salary came 40000'));
  assert.ok(!E.looksLikeMoneyIn('rapido 80'));
});

test('AI answers cannot do anything unsafe', () => {
  const cats = ['food', 'travel'];
  assert.deepEqual(E.checkActions({ actions: [{ type: 'delete_everything' }] }, cats), [{ type: 'unclear' }]);
  assert.deepEqual(E.checkActions({ actions: [{ type: 'spend', amount: -5, confidence: 1 }] }, cats), [{ type: 'unclear' }]);
  assert.deepEqual(E.checkActions({ actions: [{ type: 'pay', amount: 'lots', confidence: 1 }] }, cats), [{ type: 'unclear' }]);
  assert.deepEqual(E.checkActions(null, cats), []);
  assert.equal(E.checkActions({ actions: [{ type: 'spend', amount: 90, category: 'nope', confidence: 1 }] }, cats)[0].category, null);
  assert.equal(E.checkActions({ actions: [{ type: 'spend', amount: 90, category: 'food', confidence: 0.4 }] }, cats)[0].sure, false);
  assert.equal(E.checkActions({ actions: [{ type: 'spend', amount: 90, category: 'food', when: 'yesterday', confidence: 1 }] }, cats)[0].when, 'yesterday');
});

test('Ellie reacts to the pace of spending', () => {
  const base = { pool: 30000, daysPassed: 10, days: 30, noSpendToday: false };
  assert.equal(E.moodFor({ ...base, spent: 9000, left: 21000 }), 'happy');
  assert.equal(E.moodFor({ ...base, spent: 20000, left: 10000 }), 'careful');
  assert.equal(E.moodFor({ ...base, spent: 28000, left: 2000 }), 'worried');
  assert.equal(E.moodFor({ ...base, spent: 31000, left: -1000 }), 'worried');
  assert.equal(E.moodFor({ ...base, spent: 1000, left: 29000, noSpendToday: true }), 'proud');
});

test('learning cards unlock with check-ins', () => {
  assert.equal(E.unlockedCards(0, 12), 1);
  assert.equal(E.unlockedCards(4, 12), 3);
  assert.equal(E.unlockedCards(100, 12), 12);
});

test('gifts and bonuses are extra money, not salary', () => {
  assert.ok(E.looksLikeMoneyIn('gift 2000 from office'));
  assert.ok(E.looksLikeMoneyIn('got 500 from friend'));
  assert.ok(!E.isSalary('gift 2000 from office', 2000, 110000));
  assert.ok(!E.isSalary('income 2000', 2000, 110000));
  assert.ok(E.isSalary('salary came 110000', 110000, 110000));
  assert.ok(E.isSalary('credited 108000', 108000, 110000));
  assert.equal(E.moneyInKind('gift 2000 from office'), 'gift');
  assert.equal(E.moneyInKind('bonus 5000'), 'bonus');
  assert.equal(E.moneyInKind('cashback 120'), 'cashback');
  assert.equal(E.moneyInKind('income 300'), 'other');
  assert.equal(E.moneyInNote('gift 2000 from office'), 'From office');
});

test('extra money in a month reaches the jar on payday', () => {
  const r = E.closePeriods([{ key: 'a', pool: 13667 + 2000, spent: 10000 }]);
  assert.equal(r.jar, 5667);
});
