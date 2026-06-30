/*
 * Mock data for the prototype. ALL fictional.
 * No real names, real card numbers, or data from the Capital One screenshots.
 */

// Illustrative redemption rate — demo only.
export const MILES_PER_DOLLAR = 100 // 1 mile = $0.01  →  $1 = 100 miles

export const milesForDollars = (dollars) => Math.round(dollars * MILES_PER_DOLLAR)

// Fictional cardholder + account
export const CARDHOLDER = {
  firstName: 'Alex',
  fullName: 'Alex Rivera',
  startingBalance: 46763, // points
}

export const ACCOUNTS = [
  { id: 'rewards', name: 'Rewards Card', last4: '2395', miles: 46763, currency: 'Points', primary: true },
  { id: 'everyday', name: 'Everyday Card', last4: '8841', miles: 12940, currency: 'Points', primary: false },
]

// Flow 1 — gift collections (by occasion / value tier)
// Each collection holds the items the recipient gets to choose from (preview).
export const COLLECTIONS = [
  {
    id: 'thankyou', title: 'Thank You', occasion: 'Thank You', emoji: '🌿', img: '/products/thankyou.jpg', dollars: 50, hue: 158,
    blurb: 'A curated set of cozy picks to say thanks.',
    items: [
      { name: 'Hand-Poured Soy Candle', emoji: '🕯️', img: '/products/candle.jpg' },
      { name: 'Single-Origin Coffee Kit', emoji: '☕', img: '/products/coffee.jpg' },
      { name: 'Loose-Leaf Tea Sampler', emoji: '🍵', img: '/products/teaset.jpg' },
      { name: 'Artisan Chocolate Box', emoji: '🍫', img: '/products/chocolate.jpg' },
    ],
  },
  {
    id: 'birthday', title: 'Happy Birthday', occasion: 'Birthday', emoji: '🎂', img: '/products/birthday.jpg', dollars: 75, hue: 28,
    blurb: 'Celebrate them with a choice of joyful gifts.',
    items: [
      { name: 'Portable Speaker', emoji: '🔊', img: '/products/speaker.jpg' },
      { name: 'Artisan Chocolate Box', emoji: '🍫', img: '/products/chocolate.jpg' },
      { name: 'Hand-Poured Soy Candle', emoji: '🕯️', img: '/products/candle.jpg' },
      { name: 'Potted Monstera', emoji: '🪴', img: '/products/plant.jpg' },
    ],
  },
  {
    id: 'congrats', title: 'Congrats', occasion: 'Congrats', emoji: '🎉', img: '/products/congrats.jpg', dollars: 100, hue: 268,
    blurb: 'Mark the milestone with something memorable.',
    items: [
      { name: 'Wireless Earbuds', emoji: '🎧', img: '/products/earbuds.jpg' },
      { name: 'Chunky Knit Throw', emoji: '🧶', img: '/products/throw.jpg' },
      { name: 'Single-Origin Coffee Kit', emoji: '☕', img: '/products/coffee.jpg' },
      { name: 'Artisan Chocolate Box', emoji: '🍫', img: '/products/chocolate.jpg' },
    ],
  },
  {
    id: 'thinking', title: 'Thinking of You', occasion: 'Just Because', emoji: '💐', img: '/products/thinking.jpg', dollars: 60, hue: 330,
    blurb: 'A warm pick-me-up, no occasion needed.',
    items: [
      { name: 'Hand-Poured Soy Candle', emoji: '🕯️', img: '/products/candle.jpg' },
      { name: 'Aroma Diffuser Set', emoji: '🌸', img: '/products/diffuser.jpg' },
      { name: 'Loose-Leaf Tea Sampler', emoji: '🍵', img: '/products/teaset.jpg' },
      { name: 'Artisan Chocolate Box', emoji: '🍫', img: '/products/chocolate.jpg' },
    ],
  },
  {
    id: 'welcomehome', title: 'Welcome Home', occasion: 'New Home', emoji: '🏡', img: '/products/welcomehome.jpg', dollars: 125, hue: 200,
    blurb: 'Housewarming favorites they get to choose.',
    items: [
      { name: 'Chunky Knit Throw', emoji: '🧶', img: '/products/throw.jpg' },
      { name: 'Potted Monstera', emoji: '🪴', img: '/products/plant.jpg' },
      { name: 'Hand-Poured Soy Candle', emoji: '🕯️', img: '/products/candle.jpg' },
      { name: 'Aroma Diffuser Set', emoji: '🌸', img: '/products/diffuser.jpg' },
    ],
  },
  {
    id: 'cheers', title: 'Cheers', occasion: 'Celebration', emoji: '🥂', img: '/products/cheers.jpg', dollars: 150, hue: 45,
    blurb: 'Premium treats for a special toast.',
    items: [
      { name: 'Portable Speaker', emoji: '🔊', img: '/products/speaker.jpg' },
      { name: 'Wireless Earbuds', emoji: '🎧', img: '/products/earbuds.jpg' },
      { name: 'Artisan Chocolate Box', emoji: '🍫', img: '/products/chocolate.jpg' },
      { name: 'Single-Origin Coffee Kit', emoji: '☕', img: '/products/coffee.jpg' },
    ],
  },
]

// Flow 2 — individual catalog items
export const CATEGORIES = ['All', 'Home', 'Tech', 'Wellness', 'Food']

export const CATALOG = [
  { id: 'candle',    name: 'Hand-Poured Soy Candle', category: 'Home',     emoji: '🕯️', img: '/products/candle.jpg',    dollars: 38,  hue: 35,  desc: 'A slow-burning soy candle with notes of cedar and amber. Hand-poured in small batches.' },
  { id: 'throw',     name: 'Chunky Knit Throw',      category: 'Home',     emoji: '🧶', img: '/products/throw.jpg',     dollars: 89,  hue: 25,  desc: 'An oversized, machine-washable knit throw in warm oatmeal. The everyday-luxury blanket.' },
  { id: 'earbuds',   name: 'Wireless Earbuds',       category: 'Tech',     emoji: '🎧', img: '/products/earbuds.jpg',   dollars: 129, hue: 210, desc: 'Compact true-wireless earbuds with active noise cancellation and an all-day charging case.' },
  { id: 'charger',   name: '3-in-1 Charging Stand',  category: 'Tech',     emoji: '🔌', img: '/products/charger.jpg',   dollars: 65,  hue: 200, desc: 'Charge phone, watch, and earbuds at once on a single minimalist walnut-and-aluminum stand.' },
  { id: 'diffuser',  name: 'Aroma Diffuser Set',     category: 'Wellness', emoji: '🌸', img: '/products/diffuser.jpg',  dollars: 54,  hue: 320, desc: 'Ultrasonic diffuser with a starter set of three essential-oil blends for calm, focus, and sleep.' },
  { id: 'yogamat',   name: 'Cork Yoga Mat',          category: 'Wellness', emoji: '🧘', img: '/products/yogamat.jpg',   dollars: 78,  hue: 150, desc: 'Naturally grippy cork-top mat over a recycled-rubber base. Eco-friendly and non-slip.' },
  { id: 'coffee',    name: 'Single-Origin Coffee Kit', category: 'Food',   emoji: '☕', img: '/products/coffee.jpg',    dollars: 45,  hue: 22,  desc: 'Three rotating single-origin roasts with a pour-over dripper and brewing guide.' },
  { id: 'chocolate', name: 'Artisan Chocolate Box',  category: 'Food',     emoji: '🍫', img: '/products/chocolate.jpg', dollars: 42,  hue: 18,  desc: 'A dozen hand-finished bonbons from a small-batch chocolatier. Gift-boxed.' },
  { id: 'plant',     name: 'Potted Monstera',        category: 'Home',     emoji: '🪴', img: '/products/plant.jpg',     dollars: 58,  hue: 140, desc: 'A live, easy-care monstera in a matte ceramic pot. Ships ready to display.' },
  { id: 'speaker',   name: 'Portable Speaker',       category: 'Tech',     emoji: '🔊', img: '/products/speaker.jpg',   dollars: 99,  hue: 230, desc: 'Pocket-sized waterproof speaker with surprisingly big sound and 16-hour battery life.' },
  { id: 'teaset',    name: 'Loose-Leaf Tea Sampler', category: 'Food',     emoji: '🍵', img: '/products/teaset.jpg',    dollars: 36,  hue: 95,  desc: 'Eight loose-leaf teas in a keepsake tin with an infuser. From green to herbal.' },
  { id: 'robe',      name: 'Waffle Spa Robe',        category: 'Wellness', emoji: '🛁', img: '/products/robe.jpg',      dollars: 84,  hue: 195, desc: 'Lightweight waffle-weave robe in soft white cotton. The at-home spa upgrade.' },
]

// Flow 3 — one funded welcome gift from Capital One
export const FUNDED_OFFER = {
  id: 'welcome100',
  title: '$100 Welcome Gift',
  dollars: 100,
  product: 'Savings account',
  blurb: 'Thanks for opening your new Savings account. Pick a welcome gift on us — no points required.',
  // The funded collection the cardholder chooses from (value fixed & pre-paid)
  items: [
    { id: 'f-throw',   name: 'Chunky Knit Throw',     emoji: '🧶', img: '/products/throw.jpg',   hue: 25,  desc: 'Oversized, machine-washable knit throw in warm oatmeal.' },
    { id: 'f-earbuds', name: 'Wireless Earbuds',      emoji: '🎧', img: '/products/earbuds.jpg', hue: 210, desc: 'True-wireless earbuds with active noise cancellation.' },
    { id: 'f-coffee',  name: 'Coffee Lover Bundle',   emoji: '☕', img: '/products/coffee.jpg',  hue: 22,  desc: 'Single-origin beans, a pour-over dripper, and two mugs.' },
    { id: 'f-spa',     name: 'Spa Day at Home Set',   emoji: '🛁', img: '/products/spa.jpg',     hue: 195, desc: 'Waffle robe, diffuser, and a trio of bath soaks.' },
  ],
}

// Acquisition offer — open a new Quicksilver Rewards card, claim a funded $200 gift.
export const QUICKSILVER_OFFER = {
  id: 'quicksilver200',
  title: '$200 Welcome Gift',
  dollars: 200,
  product: 'Quicksilver Rewards card',
  blurb: 'Open a new Quicksilver Rewards card and choose a $200 welcome gift, on us — no points required.',
  items: [
    { id: 'q-earbuds',   name: 'Wireless Earbuds',     emoji: '🎧', img: '/products/earbuds.jpg',   hue: 210, desc: 'True-wireless earbuds with active noise cancellation.' },
    { id: 'q-speaker',   name: 'Portable Speaker',     emoji: '🔊', img: '/products/speaker.jpg',   hue: 230, desc: 'Waterproof speaker with big sound and 16-hour battery.' },
    { id: 'q-throw',     name: 'Chunky Knit Throw',    emoji: '🧶', img: '/products/throw.jpg',     hue: 25,  desc: 'Oversized, machine-washable knit throw in warm oatmeal.' },
    { id: 'q-spa',       name: 'Spa Day at Home Set',  emoji: '🛁', img: '/products/spa.jpg',       hue: 195, desc: 'Waffle robe, diffuser, and a trio of bath soaks.' },
    { id: 'q-coffee',    name: 'Coffee Lover Bundle',  emoji: '☕', img: '/products/coffee.jpg',    hue: 22,  desc: 'Single-origin beans, a pour-over dripper, and two mugs.' },
    { id: 'q-chocolate', name: 'Artisan Chocolate Box', emoji: '🍫', img: '/products/chocolate.jpg', hue: 18, desc: 'A dozen hand-finished bonbons, gift-boxed.' },
  ],
}

// Pre-filled mock shipping address (editable in UI) — fictional
export const MOCK_ADDRESS = {
  name: 'Alex Rivera',
  line1: '742 Maple Avenue',
  line2: 'Apt 4B',
  city: 'Austin',
  state: 'TX',
  zip: '78704',
}

export const formatMiles = (n) => n.toLocaleString('en-US')
export const formatDollars = (n) => `$${n.toLocaleString('en-US')}`
