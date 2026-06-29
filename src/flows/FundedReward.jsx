import { useState } from 'react'
import { ScreenHeader } from '../components/Headers.jsx'
import GiftCard from '../components/GiftCard.jsx'
import ConfirmationScreen from '../components/ConfirmationScreen.jsx'
import { FUNDED_OFFER, MOCK_ADDRESS, formatDollars, formatMiles } from '../data/mock.js'

/**
 * Flow 3 — Reward for signing up (INBOUND: funded by Capital One, NO miles spent).
 * Visually distinct: "Funded by Capital One" badge, celebratory framing, and no
 * miles deduction anywhere.
 * Steps: welcome/claim → choose → confirm + ship → confirmation.
 */
export default function FundedReward({ balance, onExit }) {
  const [step, setStep] = useState('welcome')
  const [choice, setChoice] = useState(null)
  const [address, setAddress] = useState(MOCK_ADDRESS)

  // ── Step: welcome / claim ────────────────────────────────────────────────────
  if (step === 'welcome') {
    return (
      <div>
        <ScreenHeader title="Welcome gift" onClose={onExit} />
        <div className="screen-pad">
          <div className="info-banner funded-banner">
            <span className="ib-icon">🎁</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>You've earned a {formatDollars(FUNDED_OFFER.dollars)} gift</div>
              <div style={{ marginTop: 4, opacity: 0.95 }}>{FUNDED_OFFER.blurb}</div>
            </div>
          </div>

          <div className="spacer-md" />
          <div className="info-banner">
            <span className="ib-icon">✅</span>
            <div>
              <span className="funded-badge">Funded by Capital One</span>
              <div style={{ marginTop: 8 }}>
                This is a reward — <strong>no miles are spent</strong>. Your balance of {formatMiles(balance)} miles
                stays exactly as it is. Just pick the gift you'd like from a curated set.
              </div>
            </div>
          </div>
        </div>
        <div className="sticky-footer">
          <button className="btn btn-accent" onClick={() => setStep('choose')}>Claim your gift</button>
        </div>
      </div>
    )
  }

  // ── Step: choose from the funded collection (value fixed & pre-paid) ─────────
  if (step === 'choose') {
    return (
      <div>
        <ScreenHeader title="Choose your gift" onBack={() => setStep('welcome')} onClose={onExit} />
        <div className="screen-pad">
          <div style={{ marginBottom: 12 }}>
            <span className="funded-badge">Funded by Capital One · {formatDollars(FUNDED_OFFER.dollars)}</span>
          </div>
          <div className="section-sub">Pick one — it's already paid for. No miles required.</div>
          <div className="gift-grid">
            {FUNDED_OFFER.items.map((it) => (
              <GiftCard
                key={it.id}
                item={it}
                hidePrice
                selected={choice?.id === it.id}
                onClick={() => setChoice(it)}
              />
            ))}
          </div>
        </div>
        <div className="sticky-footer">
          <button className="btn btn-primary" disabled={!choice} onClick={() => setStep('ship')}>
            {choice ? `Choose ${choice.name}` : 'Select a gift'}
          </button>
        </div>
      </div>
    )
  }

  // ── Step: confirm + ship ─────────────────────────────────────────────────────
  if (step === 'ship') {
    return (
      <div>
        <ScreenHeader title="Confirm & ship" onBack={() => setStep('choose')} onClose={onExit} />
        <div className="screen-pad">
          <div className="summary-card">
            <div className="summary-row">
              <span className="sr-label">Your gift</span>
              <span className="sr-value">{choice.emoji} {choice.name}</span>
            </div>
            <div className="summary-row">
              <span className="sr-label">Value</span>
              <span className="sr-value positive">{formatDollars(FUNDED_OFFER.dollars)} · Funded</span>
            </div>
          </div>

          <div className="field">
            <label>Name</label>
            <input value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} />
          </div>
          <div className="field">
            <label>Address</label>
            <input value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
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
          <button className="btn btn-accent" onClick={() => setStep('confirm')}>Confirm gift</button>
        </div>
      </div>
    )
  }

  // ── Step: confirmation (no balance change) ───────────────────────────────────
  return (
    <ConfirmationScreen
      funded
      title="Your welcome gift is on its way"
      subtitle={`Enjoy your ${choice.name} — and your new ${FUNDED_OFFER.product}. Estimated delivery in 3–5 business days.`}
      balanceChanged={false}
      newBalance={balance}
      detailRows={[
        { label: 'Gift', value: `${choice.emoji} ${choice.name}` },
        { label: 'Value', value: `${formatDollars(FUNDED_OFFER.dollars)} · Funded by Capital One` },
        { label: 'Delivery', value: 'Est. 3–5 business days' },
      ]}
      onDone={onExit}
      doneLabel="Back to Offers"
    />
  )
}
