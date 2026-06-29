import { useState } from 'react'
import { ScreenHeader } from '../components/Headers.jsx'
import GiftCard from '../components/GiftCard.jsx'
import MilesBadge from '../components/MilesBadge.jsx'
import ConfirmationScreen from '../components/ConfirmationScreen.jsx'
import { CATALOG, CATEGORIES, MOCK_ADDRESS, milesForDollars, formatMiles } from '../data/mock.js'

/**
 * Flow 2 — Shop a gift for yourself (OUTBOUND: cardholder spends own miles).
 * Lightest path — no recipient or message step.
 * Steps: browse → item detail → shipping → review → confirm.
 */
export default function ShopForSelf({ balance, onSpend, onExit }) {
  const [step, setStep] = useState('browse')
  const [category, setCategory] = useState('All')
  const [item, setItem] = useState(null)
  const [address, setAddress] = useState(MOCK_ADDRESS)

  const cost = item ? milesForDollars(item.dollars) : 0
  const insufficient = cost > balance
  const newBalance = balance - cost
  const shown = category === 'All' ? CATALOG : CATALOG.filter((i) => i.category === category)
  const photoStyle = (hue) => ({
    background: `linear-gradient(150deg, hsl(${hue} 45% 88%) 0%, hsl(${hue} 38% 74%) 100%)`,
  })

  // ── Step: browse catalog ─────────────────────────────────────────────────────
  if (step === 'browse') {
    return (
      <div>
        <ScreenHeader title="Shop gifts for yourself" onClose={onExit} />
        <div className="screen-pad-tight">
          <div className="chips">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`chip ${category === c ? 'active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="screen-pad" style={{ paddingTop: 0 }}>
          <div className="balance-strip">
            <span className="bs-label">Your balance</span>
            <span className="bs-value">{formatMiles(balance)} miles</span>
          </div>
          <div className="gift-grid">
            {shown.map((i) => (
              <GiftCard key={i.id} item={i} onClick={() => { setItem(i); setStep('detail') }} />
            ))}
          </div>
          <div className="demo-note">Rate shown is 1 mile = $0.01, for demo purposes.</div>
        </div>
      </div>
    )
  }

  // ── Step: item detail ────────────────────────────────────────────────────────
  if (step === 'detail') {
    return (
      <div>
        <ScreenHeader title="" onBack={() => setStep('browse')} onClose={onExit} />
        <div className="screen-pad" style={{ paddingTop: 0 }}>
          <div className="detail-photo" style={photoStyle(item.hue)}>{item.emoji}</div>
          <div className="detail-name">{item.name}</div>
          <div style={{ marginTop: 8 }}><MilesBadge dollars={item.dollars} size="large" /></div>
          <div className="detail-desc">{item.desc}</div>
          <div className="spacer-md" />
          <div className="balance-strip">
            <span className="bs-label">After redeeming</span>
            <span className="bs-value">
              {insufficient ? 'Not enough miles' : `${formatMiles(newBalance)} miles left`}
            </span>
          </div>
        </div>
        <div className="sticky-footer">
          <button
            className="btn btn-primary"
            disabled={insufficient}
            onClick={() => setStep('shipping')}
          >
            Redeem with miles
          </button>
        </div>
      </div>
    )
  }

  // ── Step: shipping (pre-filled, editable, shipped to self) ───────────────────
  if (step === 'shipping') {
    return (
      <div>
        <ScreenHeader title="Ship to" onBack={() => setStep('detail')} onClose={onExit} />
        <div className="screen-pad">
          <div className="field">
            <label>Name</label>
            <input value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} />
          </div>
          <div className="field">
            <label>Address</label>
            <input value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
          </div>
          <div className="field">
            <label>Apt / Unit</label>
            <input value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} />
          </div>
          <div className="field" style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 2 }}>
              <label>City</label>
              <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
            </div>
            <div style={{ flex: 1 }}>
              <label>State</label>
              <input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
            </div>
            <div style={{ flex: 1 }}>
              <label>ZIP</label>
              <input value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
            </div>
          </div>
        </div>
        <div className="sticky-footer">
          <button className="btn btn-primary" onClick={() => setStep('review')}>Continue</button>
        </div>
      </div>
    )
  }

  // ── Step: review & confirm ───────────────────────────────────────────────────
  if (step === 'review') {
    return (
      <div>
        <ScreenHeader title="Review & confirm" onBack={() => setStep('shipping')} onClose={onExit} />
        <div className="screen-pad">
          <div className="summary-card">
            <div className="summary-row">
              <span className="sr-label">Item</span>
              <span className="sr-value">{item.name}</span>
            </div>
            <div className="summary-row">
              <span className="sr-label">Price</span>
              <span className="sr-value"><MilesBadge dollars={item.dollars} /></span>
            </div>
            <div className="summary-row">
              <span className="sr-label">Ship to</span>
              <span className="sr-value">{address.name}<br />{address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />{address.city}, {address.state} {address.zip}</span>
            </div>
            <div className="summary-row">
              <span className="sr-label">Miles redeemed</span>
              <span className="sr-value deduct">−{formatMiles(cost)}</span>
            </div>
            <div className="summary-row total">
              <span className="sr-label">New balance</span>
              <span className="sr-value">{formatMiles(newBalance)} miles</span>
            </div>
          </div>
        </div>
        <div className="sticky-footer">
          <button className="btn btn-primary" onClick={() => { onSpend(cost); setStep('confirm') }}>
            Redeem
          </button>
        </div>
      </div>
    )
  }

  // ── Step: confirmation ───────────────────────────────────────────────────────
  return (
    <ConfirmationScreen
      title="On its way to you"
      subtitle={`Your ${item.name} ships to ${address.city}. Estimated delivery in 3–5 business days.`}
      balanceChanged
      milesSpent={cost}
      newBalance={balance /* already decremented by onSpend */}
      detailRows={[
        { label: 'Item', value: item.name },
        { label: 'Price', value: <MilesBadge dollars={item.dollars} /> },
        { label: 'Delivery', value: 'Est. 3–5 business days' },
      ]}
      onDone={onExit}
      doneLabel="Back to Rewards"
    />
  )
}
