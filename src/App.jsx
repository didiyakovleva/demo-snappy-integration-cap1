import { useState } from 'react'
import PhoneFrame from './components/PhoneFrame.jsx'
import BottomSheet from './components/BottomSheet.jsx'
import ListRow from './components/ListRow.jsx'
import { NavyHeader } from './components/Headers.jsx'
import SendGift from './flows/SendGift.jsx'
import ShopForSelf from './flows/ShopForSelf.jsx'
import FundedReward from './flows/FundedReward.jsx'
import { CARDHOLDER, ACCOUNTS, FUNDED_OFFER, formatMiles, formatDollars } from './data/mock.js'

// Existing Capital One redeem options (from the screenshots) — static chrome.
const EXISTING_REDEEM = [
  { icon: '✈️', title: 'Book a trip', desc: 'Redeem with your travel booking site, the smarter way to book flights, hotels and rental cars.' },
  { icon: '🔁', title: 'Transfer rewards', desc: 'Transfer miles to rack up rewards with one of your travel loyalty programs.' },
  { icon: '🧾', title: 'Cover travel purchases', desc: 'Get reimbursed for a recent travel purchase.' },
  { icon: '🎟️', title: 'Book entertainment', desc: "Use your rewards on 1,000's of sporting events, concerts & more with Capital One Entertainment." },
  { icon: '🅿️', title: 'Redeem with PayPal', desc: 'Use rewards to check out at millions of online stores with PayPal.' },
  { icon: '🛍️', title: 'Shop with Amazon', desc: 'Pay for your Amazon.com orders by applying your rewards at checkout.' },
  { icon: '🎁', title: 'Get gift cards', desc: 'Spend your rewards on digital or physical gift cards with some of your favorite merchants.' },
]

export default function App() {
  const [balance, setBalance] = useState(CARDHOLDER.startingBalance)
  const [tab, setTab] = useState('home')
  const [rewardsView, setRewardsView] = useState('benefits') // 'benefits' | 'redeem'
  const [account, setAccount] = useState(ACCOUNTS[0])
  const [sheetOpen, setSheetOpen] = useState(false)
  const [flow, setFlow] = useState(null) // null | 'send' | 'shop' | 'funded'

  const spend = (miles) => setBalance((b) => b - miles)

  const goTab = (t) => {
    setTab(t)
    setRewardsView('benefits')
    setSheetOpen(false)
  }

  const exitFlow = () => {
    setFlow(null)
    // Outbound flows return to the Redeem list; funded returns to Offers.
    if (flow === 'funded') { setTab('offers') }
    else { setTab('rewards'); setRewardsView('redeem') }
  }

  // ── Active flow takes over the whole viewport ──────────────────────────────
  if (flow) {
    const flowEl =
      flow === 'send' ? <SendGift balance={balance} onSpend={spend} onExit={exitFlow} /> :
      flow === 'shop' ? <ShopForSelf balance={balance} onSpend={spend} onExit={exitFlow} /> :
      <FundedReward balance={balance} onExit={exitFlow} />
    return <Stage><PhoneFrame showTabBar={false}>{flowEl}</PhoneFrame></Stage>
  }

  // ── Account-select bottom sheet ────────────────────────────────────────────
  const sheet = sheetOpen ? (
    <BottomSheet title="Select account" onClose={() => setSheetOpen(false)}>
      {ACCOUNTS.map((a) => (
        <button
          key={a.id}
          className="acct-row"
          onClick={() => { setAccount(a); setSheetOpen(false); setTab('rewards'); setRewardsView('redeem') }}
        >
          <span className="acct-art">{a.name.split(' ')[0].toUpperCase()}</span>
          <span className="acct-body">
            <span className="acct-name">{a.name} ····{a.last4}</span>
            <span className="acct-sub">{formatMiles(a.primary ? balance : a.miles)} {a.currency}</span>
          </span>
          <span className={`radio ${account.id === a.id ? 'checked' : ''}`} />
        </button>
      ))}
    </BottomSheet>
  ) : null

  // ── Screen content per tab ─────────────────────────────────────────────────
  let content
  if (tab === 'home') {
    content = <HomeScreen onOpenRewards={() => goTab('rewards')} onLaunch={setFlow} />
  } else if (tab === 'offers') {
    content = <OffersScreen onClaim={() => setFlow('funded')} />
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
    content = <RewardsBenefits balance={balance} onRedeem={() => setSheetOpen(true)} />
  } else {
    content = <PlaceholderTab tab={tab} />
  }

  return (
    <Stage>
      <PhoneFrame sheet={sheet} activeTab={tab} onTabSelect={goTab}>
        {content}
      </PhoneFrame>
    </Stage>
  )
}

/* ───────────────────────── Stage wrapper (outside phone) ───────────────────── */
function Stage({ children }) {
  return (
    <>
      <div className="stage-caption">
        <strong>Snappy × Capital One — Rewards integration demo.</strong> Clickable prototype, mock data only.
        Snappy wears Capital One's chrome; warmth comes from the gifts.
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
        <span className="bs-value">{formatMiles(CARDHOLDER.startingBalance)} miles ›</span>
      </div>

      <button className="btn btn-primary" onClick={onOpenRewards}>Go to Rewards</button>

      <div className="dev-menu">
        <div className="dm-label">Demo · jump into a flow</div>
        <div className="dm-btns">
          <button className="dm-btn" onClick={() => onLaunch('send')}>
            <span className="dm-emoji">🎁</span> Flow 1 — Send a gift collection
          </button>
          <button className="dm-btn" onClick={() => onLaunch('shop')}>
            <span className="dm-emoji">🛍️</span> Flow 2 — Shop a gift for yourself
          </button>
          <button className="dm-btn" onClick={() => onLaunch('funded')}>
            <span className="dm-emoji">🎉</span> Flow 3 — Reward for signing up (funded)
          </button>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── Rewards & Benefits ──────────────────────────────── */
function RewardsBenefits({ balance, onRedeem }) {
  return (
    <div>
      <div className="app-header light">Rewards &amp; Benefits</div>
      <div className="screen-pad">
        <div className="rb-balance">{formatMiles(balance)}</div>
        <div className="rb-balance-label">Miles</div>
        <div className="spacer-md" />
        <button className="btn btn-primary" onClick={onRedeem}>Redeem</button>

        <div className="section-label">Elevate your lifestyle</div>
        <div className="promo-card">
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

/* ───────────────────────── Redeem list (with 2 Snappy rows) ────────────────── */
function RedeemList({ account, balance, onClose, onSend, onShop }) {
  return (
    <div>
      <NavyHeader accountLabel={account.name.toUpperCase()} last4={account.last4} balance={balance} onClose={onClose} />
      <div className="screen-pad">
        <div className="list-card">
          {EXISTING_REDEEM.map((r) => (
            <ListRow key={r.title} icon={r.icon} title={r.title} description={r.desc} onClick={() => {}} />
          ))}

          {/* ── Snappy insertion point: two new gifting rows ── */}
          <ListRow
            snappy
            icon="🎀"
            title="Send a gift"
            description="Use miles to send a curated gift someone gets to choose."
            onClick={onSend}
          />
          <ListRow
            snappy
            icon="🛍️"
            title="Shop gifts for yourself"
            description="Spend miles on a gift, shipped to you."
            onClick={onShop}
          />

          <ListRow icon="💵" title="Redeem for cash" description="Use rewards to get cash back." onClick={() => {}} />
        </div>
        <div className="demo-note">
          Gifting rows are Snappy, embedded in Capital One's redeem list. Every value shows
          $ and miles (1 mile = $0.01, demo rate).
        </div>
        <div className="spacer-md" />
      </div>
    </div>
  )
}

/* ───────────────────────── Offers tab (Flow 3 entry) ───────────────────────── */
function OffersScreen({ onClaim }) {
  return (
    <div>
      <div className="app-header light">Offers</div>
      <div className="screen-pad">
        <button className="promo-card" style={{ width: '100%', textAlign: 'left', cursor: 'pointer', background: 'linear-gradient(150deg, #0a7d52 0%, #095f57 100%)' }} onClick={onClaim}>
          <span className="promo-tag">New · Welcome reward</span>
          <div className="promo-title">You've earned a {formatDollars(FUNDED_OFFER.dollars)} gift 🎁</div>
          <div className="promo-sub">Funded by Capital One for opening your new {FUNDED_OFFER.product}. No miles required — tap to claim.</div>
        </button>

        <div className="spacer-md" />
        <div className="info-banner">
          <span className="ib-icon">💡</span>
          <div>This is an <strong>inbound, funded</strong> gift — Capital One pays, you just claim it. Distinct from spending your own miles on the Redeem list.</div>
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
            <div className="mc-title">Bonus miles</div>
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
