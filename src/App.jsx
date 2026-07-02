import { useState } from 'react'
import PhoneFrame from './components/PhoneFrame.jsx'
import BottomSheet from './components/BottomSheet.jsx'
import ListRow from './components/ListRow.jsx'
import { NavyHeader } from './components/Headers.jsx'
import SendGift from './flows/SendGift.jsx'
import ShopForSelf from './flows/ShopForSelf.jsx'
import FundedReward from './flows/FundedReward.jsx'
import GiftMoment from './flows/GiftMoment.jsx'
import { CARDHOLDER, ACCOUNTS, FUNDED_OFFER, QUICKSILVER_OFFER, formatMiles, formatDollars } from './data/mock.js'
import { CurrencyContext, useCurrency, currencyFromAccount } from './currency.js'

// Featured products shown in the "Treat yourself" promo card.
const PROMO_PRODUCTS = [
  { emoji: '🎧', hue: 210, img: '/products/earbuds.jpg' },
  { emoji: '🧶', hue: 25, img: '/products/throw.jpg' },
  { emoji: '☕', hue: 22, img: '/products/coffee.jpg' },
  { emoji: '💐', hue: 320, img: '/products/thinking.jpg' },
]

// Existing Capital One redeem options (from the screenshots) — static chrome.
const EXISTING_REDEEM = [
  { icon: '✈️', title: 'Book a trip', desc: 'Redeem with your travel booking site, the smarter way to book flights, hotels and rental cars.' },
  { icon: '🔁', title: 'Transfer rewards', desc: 'Transfer your rewards to one of your travel loyalty programs.' },
  { icon: '🧾', title: 'Cover travel purchases', desc: 'Get reimbursed for a recent travel purchase.' },
  { icon: '🎟️', title: 'Book entertainment', desc: "Use your rewards on 1,000's of sporting events, concerts & more with Capital One Entertainment." },
  { icon: '🅿️', title: 'Redeem with PayPal', desc: 'Use rewards to check out at millions of online stores with PayPal.' },
  { icon: '🛍️', title: 'Shop with Amazon', desc: 'Pay for your Amazon.com orders by applying your rewards at checkout.' },
  { icon: '🎁', title: 'Get gift cards', desc: 'Spend your rewards on digital or physical gift cards with some of your favorite merchants.' },
]

export default function App() {
  // Per-account balances so the selected card's reward currency & value are accurate.
  const [balances, setBalances] = useState(
    Object.fromEntries(ACCOUNTS.map((a) => [a.id, a.miles])),
  )
  const [tab, setTab] = useState('home')
  const [rewardsView, setRewardsView] = useState('benefits') // 'benefits' | 'redeem'
  const [accountId, setAccountId] = useState(ACCOUNTS[0].id)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [flow, setFlow] = useState(null) // null | 'send' | 'shop' | 'funded' | 'moment'
  const [fundedOffer, setFundedOffer] = useState(FUNDED_OFFER) // which offer the funded flow claims

  const account = ACCOUNTS.find((a) => a.id === accountId)
  const balance = balances[accountId]
  const cur = currencyFromAccount(account) // { label, unit, unitSingular } for the active card

  const spend = (amount) => setBalances((prev) => ({ ...prev, [accountId]: prev[accountId] - amount }))

  // Launch a flow; for the funded flow, choose which offer to claim.
  const launchFlow = (f, offer) => {
    if (f === 'funded') setFundedOffer(offer || FUNDED_OFFER)
    setFlow(f)
  }

  const goTab = (t) => {
    setTab(t)
    setRewardsView('benefits')
    setSheetOpen(false)
  }

  const exitFlow = () => {
    setFlow(null)
    // Outbound flows return to the Redeem list; funded returns to Offers;
    // the SMS gift moment returns Home (it started outside the app).
    if (flow === 'funded') { setTab('offers') }
    else if (flow === 'moment') { setTab('home') }
    else { setTab('rewards'); setRewardsView('redeem') }
  }

  // ── Active flow takes over the whole viewport ──────────────────────────────
  if (flow) {
    const flowEl =
      flow === 'send' ? <SendGift balance={balance} onSpend={spend} onExit={exitFlow} /> :
      flow === 'shop' ? <ShopForSelf balance={balance} onSpend={spend} onExit={exitFlow} /> :
      flow === 'moment' ? <GiftMoment onPick={() => setFlow('send')} onShop={() => setFlow('shop')} onExit={exitFlow} /> :
      <FundedReward balance={balance} offer={fundedOffer} onExit={exitFlow} />
    return (
      <CurrencyContext.Provider value={cur}>
        <Stage><PhoneFrame showTabBar={false}>{flowEl}</PhoneFrame></Stage>
      </CurrencyContext.Provider>
    )
  }

  // ── Account-select bottom sheet ────────────────────────────────────────────
  const sheet = sheetOpen ? (
    <BottomSheet title="Select account" onClose={() => setSheetOpen(false)}>
      {ACCOUNTS.map((a) => (
        <button
          key={a.id}
          className="acct-row"
          onClick={() => { setAccountId(a.id); setSheetOpen(false); setTab('rewards'); setRewardsView('redeem') }}
        >
          <span className="acct-art">{a.name.split(' ')[0].toUpperCase()}</span>
          <span className="acct-body">
            <span className="acct-name">{a.name} ····{a.last4}</span>
            <span className="acct-sub">{formatMiles(balances[a.id])} {a.currency}</span>
          </span>
          <span className={`radio ${accountId === a.id ? 'checked' : ''}`} />
        </button>
      ))}
    </BottomSheet>
  ) : null

  // ── Screen content per tab ─────────────────────────────────────────────────
  let content
  if (tab === 'home') {
    content = <HomeScreen onOpenRewards={() => goTab('rewards')} onLaunch={launchFlow} />
  } else if (tab === 'offers') {
    content = (
      <OffersScreen
        onClaimQuicksilver={() => launchFlow('funded', QUICKSILVER_OFFER)}
        onClaimWelcome={() => launchFlow('funded', FUNDED_OFFER)}
      />
    )
  } else if (tab === 'rewards' && rewardsView === 'redeem') {
    content = (
      <RedeemList
        account={account}
        balance={balance}
        onClose={() => setRewardsView('benefits')}
        onSend={() => setFlow('send')}
        onShop={() => setFlow('shop')}
      />
    )
  } else if (tab === 'rewards') {
    content = <RewardsBenefits balance={balance} onRedeem={() => setSheetOpen(true)} onTreatYourself={() => setFlow('shop')} />
  } else {
    content = <PlaceholderTab tab={tab} />
  }

  return (
    <CurrencyContext.Provider value={cur}>
      <Stage>
        <PhoneFrame sheet={sheet} activeTab={tab} onTabSelect={goTab}>
          {content}
        </PhoneFrame>
      </Stage>
    </CurrencyContext.Provider>
  )
}

/* ───────────────────────── Stage wrapper (outside phone) ───────────────────── */
function Stage({ children }) {
  return (
    <>
      <div className="stage-caption">
        <strong>Capital One — Rewards integration demo.</strong> Clickable prototype, mock data only.
        The gifting experience adopts Capital One's look and feel; warmth comes from the gifts.
      </div>
      {children}
    </>
  )
}

/* ───────────────────────── Home shell + dev flow-picker ────────────────────── */
function HomeScreen({ onOpenRewards, onLaunch }) {
  return (
    <div className="screen-pad">
      <div className="section-label" style={{ marginTop: 4 }}>Good morning, {CARDHOLDER.firstName}</div>
      <div className="section-sub">Welcome back to your Capital One app.</div>

      <div className="balance-strip" style={{ cursor: 'pointer' }} onClick={onOpenRewards}>
        <span className="bs-label">Rewards balance</span>
        <span className="bs-value">{formatMiles(CARDHOLDER.startingBalance)} points ›</span>
      </div>

      <button className="btn btn-primary" onClick={onOpenRewards}>Go to Rewards</button>

      <div className="dev-menu">
        <div className="dm-label">Demo · jump into a flow</div>
        <div className="dm-btns">
          <button className="dm-btn" onClick={() => onLaunch('moment')}>
            <span className="dm-emoji">💬</span> Flow 1 — Monthly gift moment (SMS)
          </button>
          <button className="dm-btn" onClick={() => onLaunch('send')}>
            <span className="dm-emoji">🎁</span> Flow 2 — Send a gift collection
          </button>
          <a
            className="dm-btn"
            href="https://capitalone-giftassistance.lovable.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="dm-emoji">🛎️</span> Flow 3 — Redeem with premium concierge
            <span className="dm-external" aria-hidden="true">↗</span>
          </a>
          <button className="dm-btn" onClick={() => onLaunch('shop')}>
            <span className="dm-emoji">🛍️</span> Flow 4 — Shop a gift for yourself
          </button>
          <button className="dm-btn" onClick={() => onLaunch('funded')}>
            <span className="dm-emoji">🎉</span> Flow 5 — Reward for signing up (funded)
          </button>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── Rewards & Benefits ──────────────────────────────── */
function RewardsBenefits({ balance, onRedeem, onTreatYourself }) {
  const { label, unit } = useCurrency()
  return (
    <div>
      <div className="app-header light">Rewards &amp; Benefits</div>
      <div className="screen-pad">
        <div className="rb-balance">{formatMiles(balance)}</div>
        <div className="rb-balance-label">{label}</div>
        <div className="spacer-md" />
        <button className="btn btn-primary" onClick={onRedeem}>Redeem</button>

        <div className="section-label">Elevate your lifestyle</div>

        {/* Featured gift promo — promoted first, above the travel card */}
        <button className="feature-promo" onClick={onTreatYourself}>
          <div className="sp-hero">
            <span className="sp-featured">★ Featured</span>
            {PROMO_PRODUCTS.map((p, i) => (
              <div
                key={i}
                className="sp-thumb"
                style={{ background: `linear-gradient(150deg, hsl(${p.hue} 45% 88%) 0%, hsl(${p.hue} 38% 74%) 100%)` }}
              >
                <span className="gp-emoji" aria-hidden="true">{p.emoji}</span>
                <img className="gift-img" src={p.img} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              </div>
            ))}
          </div>
          <div className="sp-body">
            <div className="sp-title">Treat yourself</div>
            <div className="sp-sub">Turn your {unit} into curated gifts — picked by you, delivered to your door.</div>
            <span className="sp-cta">Redeem now</span>
          </div>
        </button>

        <div className="spacer-md" />

        {/* Travel — toned down so the featured gift card leads */}
        <div className="promo-card muted">
          <span className="promo-tag">Travel &amp; lounges</span>
          <div className="promo-title">Explore travel and lounges</div>
          <div className="promo-sub">Earn unlimited rewards on flights, stays and cars, and explore our network of premium lounges.</div>
        </div>
        <div className="mini-grid">
          <div className="mini-card">
            <span className="mc-tag">Entertainment</span>
            <div className="mc-title">View events</div>
            <div className="mc-sub">Access tickets across sports, music and more.</div>
          </div>
          <div className="mini-card">
            <span className="mc-tag">Dining</span>
            <div className="mc-title">Browse tables</div>
            <div className="mc-sub">Book hard-to-get reservations set aside for cardholders.</div>
          </div>
        </div>
        <div className="spacer-md" />
      </div>
    </div>
  )
}

/* ───────────────────────── Redeem list (with 2 new gifting rows) ───────────── */
function RedeemList({ account, balance, onClose, onSend, onShop }) {
  const { unit, unitSingular } = useCurrency()
  return (
    <div>
      <NavyHeader accountLabel={account.name.toUpperCase()} last4={account.last4} balance={balance} onClose={onClose} />
      <div className="screen-pad">
        <div className="list-card">
          {EXISTING_REDEEM.map((r) => (
            <ListRow key={r.title} icon={r.icon} title={r.title} description={r.desc} onClick={() => {}} />
          ))}

          {/* ── Insertion point: two new gifting rows ── */}
          <ListRow
            tag="New"
            icon="🎀"
            title="Send a gift"
            description={`Use ${unit} to send a curated gift someone gets to choose.`}
            onClick={onSend}
          />
          <ListRow
            tag="New"
            icon="🛍️"
            title="Shop gifts for yourself"
            description={`Spend ${unit} on a gift, shipped to you.`}
            onClick={onShop}
          />

          <ListRow icon="💵" title="Redeem for cash" description="Use rewards to get cash back." onClick={() => {}} />
        </div>
        <div className="demo-note">
          New gifting rows embedded in Capital One's redeem list. Every value shows
          $ and {unit} (1 {unitSingular} = $0.01, demo rate).
        </div>
        <div className="spacer-md" />
      </div>
    </div>
  )
}

/* ───────────────────────── Offers tab (Flow 3 entry) ───────────────────────── */
function OffersScreen({ onClaimQuicksilver, onClaimWelcome }) {
  const { unit } = useCurrency()
  return (
    <div>
      <div className="app-header light">Offers</div>
      <div className="screen-pad">
        {/* Acquisition offer — Quicksilver card, $200 gift, with gift options shown inside */}
        <button className="feature-promo" onClick={onClaimQuicksilver}>
          <div className="sp-hero">
            <span className="sp-featured">{formatDollars(QUICKSILVER_OFFER.dollars)} gift</span>
            {QUICKSILVER_OFFER.items.slice(0, 4).map((it, i) => (
              <div
                key={i}
                className="sp-thumb"
                style={{ background: `linear-gradient(150deg, hsl(${it.hue} 45% 88%) 0%, hsl(${it.hue} 38% 74%) 100%)` }}
              >
                <span className="gp-emoji" aria-hidden="true">{it.emoji}</span>
                <img className="gift-img" src={it.img} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              </div>
            ))}
          </div>
          <div className="sp-body">
            <span className="sp-tag">New cardholder offer</span>
            <div className="sp-title" style={{ fontSize: 19, lineHeight: 1.25 }}>
              Sign up for the Quicksilver Rewards card, get a {formatDollars(QUICKSILVER_OFFER.dollars)} gift
            </div>
            <div className="sp-sub">Choose your welcome gift from the set above — funded by Capital One, no {unit} required.</div>
            <span className="sp-cta">See your gift options</span>
          </div>
        </button>

        <div className="spacer-md" />

        <button className="promo-card" style={{ width: '100%', textAlign: 'left', cursor: 'pointer', background: 'linear-gradient(150deg, #0a7d52 0%, #095f57 100%)' }} onClick={onClaimWelcome}>
          <span className="promo-tag">Welcome reward</span>
          <div className="promo-title">You've earned a {formatDollars(FUNDED_OFFER.dollars)} gift 🎁</div>
          <div className="promo-sub">Funded by Capital One for opening your new {FUNDED_OFFER.product}. No {unit} required — tap to claim.</div>
        </button>

        <div className="spacer-md" />
        <div className="info-banner">
          <span className="ib-icon">💡</span>
          <div>This is an <strong>inbound, funded</strong> gift — Capital One pays, you just claim it. Distinct from spending your own {unit} on the Redeem list.</div>
        </div>

        <div className="section-label">More offers</div>
        <div className="mini-grid">
          <div className="mini-card">
            <span className="mc-tag">Dining</span>
            <div className="mc-title">5% back</div>
            <div className="mc-sub">At select local restaurants this month.</div>
          </div>
          <div className="mini-card">
            <span className="mc-tag">Travel</span>
            <div className="mc-title">Bonus points</div>
            <div className="mc-sub">On your next booking through Capital One Travel.</div>
          </div>
        </div>
        <div className="spacer-md" />
      </div>
    </div>
  )
}

/* ───────────────────────── Placeholder tabs (Help / Profile) ───────────────── */
function PlaceholderTab({ tab }) {
  const label = tab.charAt(0).toUpperCase() + tab.slice(1)
  return (
    <div>
      <div className="app-header light">{label}</div>
      <div className="screen-pad" style={{ textAlign: 'center', color: 'var(--color-text-secondary)', paddingTop: 60 }}>
        <div style={{ fontSize: 40 }}>{tab === 'help' ? '💬' : '👤'}</div>
        <div className="spacer-md" />
        {label} isn't part of this demo. Try <strong>Rewards</strong> or <strong>Offers</strong>.
      </div>
    </div>
  )
}
