/* Bundled snapshot of gold rates and money news, used when the app is offline or no live feed is set.
   Refreshed by the daily scheduled task; the app also caches the last live copy it fetched. */
window.KH_MARKET = {
  silver: { r999: 210, date: "6 Nov 2026", src: "https://www.policybazaar.com/silver-rate/", srcName: "Policybazaar" },
  gold: { r24: 14152, r22: 12962, date: "5 Nov 2026", src: "https://cleartax.in/gold-rate-india", srcName: "ClearTax" },
  news: {
    updated: "6 Nov 2026",
    items: [
      { tag: "Banking", title: "RBI raises the repo rate by 0.25% to 5.50%", body: "The Monetary Policy Committee raised the repo rate on 7 October 2026 and moved its stance from neutral to calibrated tightening.", you: "Floating-rate home loan EMIs may creep up. The silver lining: FD rates could follow.", src: "https://www.scconline.com/blog/post/2026/10/09/rbi-hikes-repo-rate-to-5-50-percent-october-2026/", srcName: "SCC Online" },
      { tag: "Gold", title: "24K gold is at ₹14,152 a gram", body: "On 5 November 2026, 24K gold was quoted at ₹14,152 per gram and 22K at ₹12,962 per gram.", you: "Jewellery prices add making charges and GST on top of this rate.", src: "https://cleartax.in/gold-rate-india", srcName: "ClearTax" },
      { tag: "Income tax", title: "Missed your ITR? The belated return deadline is 31 December 2026", body: "A belated return for AY 2026-27 can generally be filed until 31 December 2026. A revised return can be filed until 31 March 2027 or until assessment is completed, whichever comes first.", you: "Haven't filed yet? Do it before New Year's Eve, not on it.", src: "https://upstox.com/news/personal-finance/tax/income-tax-calendar-2026-all-important-tax-deadlines-from-august-to-december-taxpayers-should-know/article-198687/", srcName: "Upstox" },
      { tag: "Income tax", title: "Income up to ₹12 lakh is effectively tax-free under the new regime", body: "Slabs are unchanged for Tax Year 2026-27, and the Section 87A rebate of up to ₹60,000 still applies.", you: "With the ₹75,000 standard deduction, a gross salary up to ₹12.75 lakh pays zero tax.", src: "https://cleartax.in/s/income-tax-changes-from-april-2026", srcName: "ClearTax" },
      { tag: "Savings", title: "PPF stays at 7.1% for October–December 2026", body: "Small savings rates were left unchanged for the quarter.", you: "Deposit before the 5th of each month so that month earns interest.", src: "https://www.freepressjournal.in/business/small-savings-interest-rates-unchanged-for-oct-dec-ppf-at-71-per-cent-nsc-at-77-pc", srcName: "Free Press Journal" },
      { tag: "Income tax", title: "The Income-tax Act, 2025 is now in force", body: "\"Tax Year\" replaces the separate Financial Year and Assessment Year labels from 1 April 2026.", you: "Same idea, new forms. Your next return is filed under the new Act.", src: "https://cleartax.in/s/income-tax-changes-from-april-2026", srcName: "ClearTax" },
      { tag: "GST", title: "GST runs on two main rates: 5% and 18%", body: "A 40% rate applies to specified luxury and \"demerit\" goods. No new rate change started on 1 April 2026.", you: "Gold carries its own 3% GST on top of making charges.", src: "https://www.bajajfinserv.in/gst-news-and-updates", srcName: "Bajaj Finserv" }
    ]
  }
};
/* Live feed: market.json in the public Joshnaj/leash-data repo, refreshed every morning by the "Kharcha daily gold rate & money news" scheduled task.
   Same shape as KH_MARKET above. If it can't be reached, the app keeps its last copy or this snapshot. */
window.KH_MARKET_URL = "https://raw.githubusercontent.com/Joshnaj/leash-data/main/market.json";
