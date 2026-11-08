/* Leash module: Subscriptions.
   Modules register themselves here before app.js loads; the core lists them under You → More in Leash
   and opens render() as its own screen. Subscriptions are ordinary monthly bills of kind "sub", so they
   already come out of the salary before the daily number, get reminders, and show up in Money. */
(window.LeashModules = window.LeashModules || []).push({
  id: 'subscriptions',
  title: 'Subscriptions',
  icon: 'repeat',
  status: 'live',
  blurb: 'Every OTT, app and gym plan in one place, with a nudge before it renews.',
  summary(api) {
    const subs = api.items('sub'); if (!subs.length) return '';
    const m = subs.reduce((s, x) => s + (Number(x.amount) || 0), 0);
    return subs.length + ' active · ' + api.inr(m) + ' a month';
  },
  render(api) {
    const subs = api.items('sub').map((it) => ({ it, next: api.nextDue(it) })).sort((a, b) => (a.next || Infinity) - (b.next || Infinity));
    const live = subs.filter((x) => x.next);
    const m = live.reduce((s, x) => s + (Number(x.it.amount) || 0), 0);
    const add = '<button class="iconbtn" data-act="add-item-kind" data-kind="sub" aria-label="Add a subscription">' + api.ico('plus') + '</button>';
    return '<div class="head"><div class="t"><span class="kicker">' + api.inr(m) + ' a month · ' + api.inr(m * 12) + ' a year</span><h1 class="title">Subscriptions</h1></div>' + add + '</div>' +
      (subs.length
        ? '<div class="card">' + subs.map(({ it, next }) => '<button class="row" data-act="edit-item" data-id="' + api.esc(it.id) + '"><span class="ic" style="background:var(--field)">' + api.ico('repeat') + '</span>' +
          '<span class="grow"><b>' + api.esc(it.name) + '</b><span>' + (next ? 'Renews ' + api.short(next) : 'Ended') + '</span></span><span class="amt num">' + api.inr(it.amount) + '</span></button>').join('') + '</div>'
        : '<div class="card padded"><p class="empty">Add Netflix, Spotify, the gym, iCloud… Each becomes a monthly bill with a reminder before it renews.</p><button class="btn full" data-act="add-item-kind" data-kind="sub">Add a subscription</button></div>') +
      '<p class="hint">Subscriptions come out of your salary before your daily number, like any other bill. Set a "last payment" date when you plan to cancel.</p>';
  }
});
