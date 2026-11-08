/* Explain Like I'm 5 cards. Facts were checked on 3 Nov 2026; rules can change. */
window.LEASH_CARDS = [
  {
    id: 'money-in-out',
    title: 'Money in, money out',
    lines: [
      'Money in is anything that comes to you.',
      'Money out is anything that leaves you.',
      'Payday is just the biggest money in.',
    ],
    remember: 'If you know what came in and what went out, you know what is left.',
  },
  {
    id: 'emi',
    title: 'What is an EMI?',
    lines: [
      'A big cost is like a big cake that is too hard to eat at once.',
      'A loan cuts it into small equal slices. You eat one slice each month.',
      'Each slice also has a little extra, called interest.',
    ],
    remember: 'EMI means a fixed monthly slice of a loan, plus interest.',
  },
  {
    id: 'interest',
    title: 'What is interest?',
    lines: [
      'Interest is rent for money.',
      'When you borrow, you pay the rent.',
      'When you save, the bank pays the rent to you.',
    ],
    remember: 'Borrowing costs you interest. Saving earns you interest.',
  },
  {
    id: 'itr',
    title: 'What is ITR?',
    lines: [
      'ITR means Income Tax Return.',
      'It is a yearly note to the government that says what you earned and what tax you paid.',
      'If too much tax was taken, you can get the extra back. That is a refund.',
    ],
    remember: 'For salaried people the usual last date is 31 July, but check each year. Filing late can cost a fee.',
  },
  {
    id: 'ppf',
    title: 'What is PPF?',
    lines: [
      'PPF is a locked money box backed by the government.',
      'You can put in ₹500 to ₹1.5 lakh each financial year.',
      'It stays locked for 15 years, with some early withdrawal allowed from the 5th year.',
    ],
    remember: 'The government sets the interest every 3 months, and it is tax-free.',
  },
  {
    id: 'pli',
    title: 'What is PLI?',
    lines: [
      'PLI means Postal Life Insurance, from India Post.',
      'You pay a small amount regularly. This is called a premium.',
      'If you pass away, your family gets the money. Many plans also pay you at the end.',
    ],
    remember: 'PLI protects your family first. What it pays depends on your plan.',
  },
  {
    id: 'ulip',
    title: 'What is a ULIP?',
    lines: [
      'A ULIP is insurance and investing in one box.',
      'Part of your money pays for cover and charges. The rest is invested.',
      'The invested part can go up or down.',
    ],
    remember: 'A ULIP is locked for 5 years, and leaving early has a cost.',
  },
  {
    id: 'gold-karat',
    title: '22K or 24K gold?',
    lines: [
      'Karat tells you how pure the gold is, out of 24 parts.',
      '24K is almost pure, about 99.9%. It is soft, so it bends.',
      '22K is about 91.6% gold, mixed with other metals to make it strong for jewellery.',
    ],
    remember: 'Jewellery also has making charges and tax on top of the gold rate.',
  },
  {
    id: 'emergency',
    title: 'The rainy day jar',
    lines: [
      'Life sends surprises, like a broken phone or a hospital bill.',
      'A rainy day jar is money you touch only for surprises.',
      'Many people aim for 3 to 6 months of living costs.',
    ],
    remember: 'With a rainy day jar, a surprise does not have to become a new loan.',
  },
  {
    id: 'compound',
    title: 'The money snowball',
    lines: [
      'Roll a small snowball down a hill. It picks up more snow and grows.',
      'Money can do this too. Your interest starts earning interest.',
      'The longer it rolls, the bigger it gets.',
    ],
    remember: 'This is called compounding. Time helps it more than anything else.',
  },
  {
    id: 'inflation',
    title: 'Why prices go up',
    lines: [
      'A chocolate that costs ₹10 now may cost ₹15 later.',
      'Your ₹10 did not change, but it buys less.',
      'This slow rise in prices is called inflation.',
    ],
    remember: 'Money kept idle slowly buys less. That is one reason people save and invest.',
  },
  {
    id: 'sip',
    title: 'What is a SIP?',
    lines: [
      'A SIP is like feeding a piggy bank the same amount every month.',
      'The money goes into a mutual fund by itself, so you do not have to remember.',
      'The value can go up and down.',
    ],
    remember: 'A SIP builds a habit, but it does not promise a profit.',
  },
]

window.LEASH_CARD_PICS = {
 "money-in-out": "<path d=\"M100 44c0-8 80-8 80 0v60c0 12-80 12-80 0z\" fill=\"#fff\" stroke=\"#6C5CE0\" stroke-width=\"4\" /> <ellipse cx=\"140\" cy=\"44\" rx=\"40\" ry=\"8\" fill=\"#FFD66E\" stroke=\"#6C5CE0\" stroke-width=\"4\" /> <path d=\"M40 50h44m-12-12 12 12-12 12\" fill=\"none\" stroke=\"#2E9E6B\" stroke-width=\"7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /> <path d=\"M196 78h44m-12-12 12 12-12 12\" fill=\"none\" stroke=\"#E65C8B\" stroke-width=\"7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /> <text x=\"62\" y=\"84\" text-anchor=\"middle\" font-size=\"19\" font-weight=\"800\" fill=\"#2E9E6B\">In</text> <text x=\"218\" y=\"56\" text-anchor=\"middle\" font-size=\"19\" font-weight=\"800\" fill=\"#E65C8B\">Out</text>",
 "emi": "<path d=\"M50 92a36 36 0 1 1 72 0z\" fill=\"#FFB3CB\" stroke=\"#6C5CE0\" stroke-width=\"4\" /> <path d=\"M144 72h20m-8-8 8 8-8 8\" fill=\"none\" stroke=\"#6C5CE0\" stroke-width=\"6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /> <g fill=\"#FFB3CB\" stroke=\"#6C5CE0\" stroke-width=\"3\"><path d=\"M180 92l10-30 10 30z\" /><path d=\"M204 92l10-30 10 30z\" /><path d=\"M228 92l10-30 10 30z\" /></g> <text x=\"214\" y=\"116\" text-anchor=\"middle\" font-size=\"19\" font-weight=\"800\" fill=\"#43349F\">Month 1, 2, 3</text>",
 "interest": "<path d=\"M60 72 96 42l36 30v38H60z\" fill=\"#fff\" stroke=\"#6C5CE0\" stroke-width=\"4\" stroke-linejoin=\"round\" /> <circle cx=\"96\" cy=\"84\" r=\"15\" fill=\"#FFD66E\" stroke=\"#E7AE2E\" stroke-width=\"3\" /> <text x=\"96\" y=\"90\" text-anchor=\"middle\" font-size=\"19\" font-weight=\"800\" fill=\"#6B4A00\">₹</text> <text x=\"206\" y=\"62\" text-anchor=\"middle\" font-size=\"19\" font-weight=\"800\" fill=\"#43349F\">Rent</text> <text x=\"206\" y=\"84\" text-anchor=\"middle\" font-size=\"19\" font-weight=\"800\" fill=\"#43349F\">for money</text>",
 "itr": "<rect x=\"56\" y=\"22\" width=\"76\" height=\"92\" rx=\"8\" fill=\"#fff\" stroke=\"#6C5CE0\" stroke-width=\"4\" /> <path d=\"M70 46h48M70 62h48M70 78h30\" stroke=\"#A9B8EE\" stroke-width=\"6\" stroke-linecap=\"round\" /> <path d=\"M150 68h38m-12-12 12 12-12 12\" fill=\"none\" stroke=\"#6C5CE0\" stroke-width=\"6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /> <path d=\"M206 96V62l22-22 22 22v34z\" fill=\"#D7F4E3\" stroke=\"#2E9E6B\" stroke-width=\"4\" stroke-linejoin=\"round\" /> <text x=\"228\" y=\"86\" text-anchor=\"middle\" font-size=\"19\" font-weight=\"800\" fill=\"#1D5B3E\">Tax</text>",
 "ppf": "<rect x=\"84\" y=\"46\" width=\"112\" height=\"66\" rx=\"12\" fill=\"#FFD66E\" stroke=\"#6C5CE0\" stroke-width=\"4\" /> <path d=\"M116 46V32a24 24 0 0 1 48 0v14\" fill=\"none\" stroke=\"#6C5CE0\" stroke-width=\"7\" /> <circle cx=\"140\" cy=\"74\" r=\"8\" fill=\"#6C5CE0\" /><rect x=\"136\" y=\"76\" width=\"8\" height=\"18\" rx=\"3\" fill=\"#6C5CE0\" /> <text x=\"232\" y=\"86\" text-anchor=\"middle\" font-size=\"19\" font-weight=\"800\" fill=\"#43349F\">15 years</text>",
 "pli": "<path d=\"M52 62a62 34 0 0 1 124 0z\" fill=\"#FF8FB1\" stroke=\"#6C5CE0\" stroke-width=\"4\" /> <path d=\"M114 62v44q0 10 12 10\" fill=\"none\" stroke=\"#6C5CE0\" stroke-width=\"5\" stroke-linecap=\"round\" /> <path d=\"M204 104c-34-22-22-48-4-40 2 1 3 3 4 5 1-2 2-4 4-5 18-8 30 18-4 40z\" fill=\"#E65C8B\" /> <text x=\"204\" y=\"44\" text-anchor=\"middle\" font-size=\"19\" font-weight=\"800\" fill=\"#43349F\">Family</text>",
 "ulip": "<rect x=\"44\" y=\"30\" width=\"192\" height=\"76\" rx=\"14\" fill=\"#fff\" stroke=\"#6C5CE0\" stroke-width=\"4\" /> <path d=\"M140 30v76\" stroke=\"#6C5CE0\" stroke-width=\"4\" /> <path d=\"M72 62a20 12 0 0 1 40 0zM92 62v22\" fill=\"#FF8FB1\" stroke=\"#6C5CE0\" stroke-width=\"3\" /> <path d=\"M156 88l16-16 14 10 22-30\" fill=\"none\" stroke=\"#2E9E6B\" stroke-width=\"6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />",
 "gold-karat": "<path d=\"M46 96l14-40h52l14 40z\" fill=\"#FFD66E\" stroke=\"#B8860B\" stroke-width=\"4\" stroke-linejoin=\"round\" /> <text x=\"86\" y=\"84\" text-anchor=\"middle\" font-size=\"19\" font-weight=\"800\" fill=\"#6B4A00\">24K</text> <circle cx=\"196\" cy=\"74\" r=\"36\" fill=\"none\" stroke=\"#FFD66E\" stroke-width=\"12\" /> <circle cx=\"196\" cy=\"74\" r=\"36\" fill=\"none\" stroke=\"#B8860B\" stroke-width=\"2\" /> <text x=\"196\" y=\"82\" text-anchor=\"middle\" font-size=\"19\" font-weight=\"800\" fill=\"#6B4A00\">22K</text>",
 "emergency": "<path d=\"M92 58a34 24 0 0 1 8-40 38 28 0 0 1 72 6 26 18 0 0 1 2 34z\" fill=\"#fff\" stroke=\"#6C5CE0\" stroke-width=\"4\" /> <g stroke=\"#6FB7E9\" stroke-width=\"5\" stroke-linecap=\"round\"><path d=\"M92 72l-5 13M116 72l-5 13M172 72l-5 13M196 72l-5 13\" /></g> <path d=\"M124 74c0-5 36-5 36 0v38c0 7-36 7-36 0z\" fill=\"#D7F4E3\" stroke=\"#6C5CE0\" stroke-width=\"4\" /> <circle cx=\"142\" cy=\"96\" r=\"9\" fill=\"#FFD66E\" stroke=\"#E7AE2E\" stroke-width=\"2\" />",
 "compound": "<path d=\"M24 110C96 104 170 76 262 40v76H24z\" fill=\"#fff\" stroke=\"#A9B8EE\" stroke-width=\"3\" /> <circle cx=\"68\" cy=\"92\" r=\"9\" fill=\"#C9D4FA\" stroke=\"#6C5CE0\" stroke-width=\"3\" /> <circle cx=\"126\" cy=\"70\" r=\"15\" fill=\"#C9D4FA\" stroke=\"#6C5CE0\" stroke-width=\"3\" /> <circle cx=\"198\" cy=\"38\" r=\"24\" fill=\"#C9D4FA\" stroke=\"#6C5CE0\" stroke-width=\"3\" />",
 "inflation": "<rect x=\"60\" y=\"72\" width=\"44\" height=\"30\" rx=\"5\" fill=\"#8B5E3C\" /> <path d=\"M124 87h34m-11-11 11 11-11 11\" fill=\"none\" stroke=\"#6C5CE0\" stroke-width=\"6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /> <rect x=\"178\" y=\"72\" width=\"44\" height=\"30\" rx=\"5\" fill=\"#8B5E3C\" /> <text x=\"82\" y=\"58\" text-anchor=\"middle\" font-size=\"19\" font-weight=\"800\" fill=\"#43349F\">₹10</text> <text x=\"200\" y=\"58\" text-anchor=\"middle\" font-size=\"19\" font-weight=\"800\" fill=\"#E65C8B\">₹15</text>",
 "sip": "<g fill=\"#FFD66E\" stroke=\"#B8860B\" stroke-width=\"3\"> <rect x=\"52\" y=\"86\" width=\"40\" height=\"16\" rx=\"6\" /><rect x=\"100\" y=\"86\" width=\"40\" height=\"16\" rx=\"6\" /><rect x=\"100\" y=\"68\" width=\"40\" height=\"16\" rx=\"6\" /> <rect x=\"148\" y=\"86\" width=\"40\" height=\"16\" rx=\"6\" /><rect x=\"148\" y=\"68\" width=\"40\" height=\"16\" rx=\"6\" /><rect x=\"148\" y=\"50\" width=\"40\" height=\"16\" rx=\"6\" /> <rect x=\"196\" y=\"86\" width=\"40\" height=\"16\" rx=\"6\" /><rect x=\"196\" y=\"68\" width=\"40\" height=\"16\" rx=\"6\" /><rect x=\"196\" y=\"50\" width=\"40\" height=\"16\" rx=\"6\" /><rect x=\"196\" y=\"32\" width=\"40\" height=\"16\" rx=\"6\" /> </g> <text x=\"72\" y=\"118\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"800\" fill=\"#43349F\">Month 1</text> <text x=\"216\" y=\"118\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"800\" fill=\"#43349F\">Month 4</text>"
};
