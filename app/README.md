# Leash

Your salary, one calm number a day, looked after by Ellie the baby elephant.

Bills, loans, savings and your home share come out first. What's left is split across the days until payday. Spend less today and every day after gets a little more. Overspend and they all get a little less.

## What's inside

Three tabs, one job each:

- **Today**: Ellie, safe to spend today, and a chat. Type or speak ("rapido 80 and blinkit 450"), and Leash sorts it.
- **Jars**: what's left till payday and a grid of tiles for everything else. Gold and silver tiles are shiny and show the latest rate.
- **Learn**: Explain Like I'm 5 cards, plus money news.

Settings holds the rest. Under **Extras**, each feature has its own switch: gold locker, silver locker, savings jar, goals and PPF, EMI payoff, month review, subscriptions, reminders, streaks, "Can I afford it?", money news and the tax helper. Switched-off extras disappear from the tile grids. With the jar off, leftover money still builds up quietly and returns when it's switched on.

## Money rules

The rules live in `www/engine.js` and are covered by `tests/engine.test.js`. Run them with `npm test`.

- A pay period runs from one payday to the day before the next. A last-day payday on a weekend moves to the Friday before.
- Every monthly item counts exactly once per pay period, whichever day it is due.
- Safe to spend = money left ÷ days left.
- The home share is a percentage of the pay that actually arrived.
- On payday, what's left moves to the savings jar. Overspending comes off the next pay period.
- **Take out** moves jar money back into spending money.

## Telling Ellie

Leash sorts known words on the phone. If a sentence is unclear and you've added a key, only that sentence and the category names go to Google AI (`www/ai.js`). The balance, salary and loans are never sent. `checkActions` in the engine validates every answer, and the app does all the maths. Offline, Leash falls back to word matching and asks when it isn't sure.

The Google key is stored only on the phone and left out of backups. On Google's free tier, sentences may be used to improve Google's products.

## Modules

Add-ons live in `www/modules/` and register themselves before `app.js` loads:

```js
(window.LeashModules = window.LeashModules || []).push({
  id: 'subscriptions', title: 'Subscriptions', icon: 'repeat', status: 'live', // or 'soon'
  blurb: 'One line for the You tab',
  summary(api) { return '3 active · ₹897 a month'; },  // optional live subtitle
  setup(api) {},                                       // optional, runs once at start
  render(api) { return '<h1 class="title">…</h1>'; }   // its own screen
});
```

`api` gives a module the data (`api.state`, `api.items(kind)`, `api.news()`), its own saved storage (`api.store(id)`), the money engine (`api.dayCalc`, `api.cycleFor`, `api.nextDue`) and UI helpers (`api.openSheet`, `api.toast`, `api.inr`, `api.esc`, `api.ico`). Buttons with `data-act="add-item-kind" data-kind="sub"` and `data-act="edit-item"` reuse the core bill sheet.

- `subscriptions.js`: live, lists subscriptions with renewal dates and the monthly and yearly total.

## Build the APK

Push this folder to `main`. The **Leash Horizon APK** workflow (`.github/workflows/leash-v2.yml`) runs the tests, builds the app, and adds `leash-horizon.apk` to the `leash-latest` release. Download and install it (allow "install unknown apps" for your file manager once).

Locally, with Android Studio installed:

```
npm install
npm run android:init   # first time only
npm run android:apk    # APK in android/app/build/outputs/apk/debug/
```

Try it in a browser: `npm run serve`, then open http://localhost:8080.

## Live gold rates and news

`www/market.js` holds a snapshot. To make the app fetch fresh data, put a public https URL that serves `{"gold": {...}, "news": {...}}` in `window.KH_MARKET_URL`.

## Files

- `www/index.html`, `www/styles.css`, `www/app.js`: the app (plain JS, no build step)
- `www/engine.js`: money rules
- `www/ellie.js`, `www/learn.js`, `www/ai.js`: Ellie, the cards and Google AI
- `www/modules/`: add-on modules (Subscriptions)
- `www/market.js`: gold and news snapshot
- `www/vendor/capacitor.js`: Capacitor core (copied by `npm run vendor`)
- `assets/`: app icon and splash, turned into Android sizes by `@capacitor/assets`
- `capacitor.config.json`: app id `com.joshnaj.kharcha`

## Leash 3D (November 2026)

- **Tabs** sit in a bar at the top: Money, Bills, Jar and Gold. The round initial at the top left opens Settings.
- **Money** shows what's safe to spend today in a jar, what went out and came in, and where it went, biggest first.
- **Bills** marks each payment green (paid), yellow (to pay) or red (due tomorrow, today or late). Tap the pill to mark it paid.
- **Credit card spends** show in where it went, but only leave your money when the card bill is paid.
- **Home** is a fixed monthly payment like rent. The old home share percentage is gone.
- **3D icons** are Microsoft Fluent Emoji (MIT licence, see `www/icons/LICENSE-fluent-emoji.txt`).
- Removed: the Learn tab, the extras switches, and the dark theme.
