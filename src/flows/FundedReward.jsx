import { useState } from 'react'
import { ScreenHeader } from '../components/Headers.jsx'
import GiftCard from '../components/GiftCard.jsx'
import ConfirmationScreen from '../components/ConfirmationScreen.jsx'
import { FUNDED_OFFER, MOCK_ADDRESS, formatDollars, formatMiles } from '../data/mock.js'
import { useCurrency } from '../currency.js'

/**
 * Flow 3 — Reward for signing up (INBOUND: funded by Capital One, NO miles/points spent).
 * Visually distinct: "Funded by Capital One" badge, celebratory framing, and no
 * balance deduction anywhere. `offer` selects which funded offer to claim.
 * Steps: welcome/claim → choose → confirm + ship → confirmation.
 */
export default function FundedReward({ balance, onExit, offer = FUNDED_OFFER }) {
  const { unit } = useCurrency()
  const [step, setStep] = useState('welcome')
  const [choice, setChoice] = useState(null)
  const [address, setAddress] = useState(MOCK_ADDRESS)

  // ── Step: welcome / claim ────────────────────────────────────────────────────
  if (step === 'welcome') {
    return (
      <div>
        <ScreenHeader title="Welcome gift" onClose={onExit} />

        {/* Hero image — credit card / celebratory gift, with the headline overlaid */}
        <div className="cover funded-cover">
          <span className="cover-emoji" aria-hidden="true">🎁</span>
          {offer.hero && (
            <img className="cover-img" src={offer.hero} alt="" onError={(e) => { e.currentTarget.style.display = 'none' }} />
          )}
          <span className="funded-badge cover-badge">Funded by Capital One</span>
          <div className="cover-overlay">
            <div className="cover-title">You've earned a {formatDollars(offer.dollars)} gift</div>
            <div className="cover-sub">{offer.blurb}</div>
          </div>
        </div>

        <div className="screen-pad">
          <div className="info-banner">
            <span className="ib-icon">✅</span>
            <div>
              This is a reward — <strong>no {unit} are spent</strong>. Your balance of{' '}
              {formatMiles(balance)} {unit} stays exactly as it is — just pick the gift you'd like.
            </div>
          </div>

          {/* Preview the curated set they'll choose from */}
          <div className="preview-heading" style={{ marginTop: 18 }}>Pick from gifts like these</div>
          <div className="funded-strip">
            {offer.items.map((it) => (
              <div
                key={it.id}
                className="fs-thumb"
                style={{ background: `linear-gradient(150deg, hsl(${it.hue} 45% 88%) 0%, hsl(${it.hue} 38% 74%) 100%)` }}
              >
                <span className="gp-emoji" aria-hidden="true">{it.emoji}</span>
                {it.img && <img className="gift-img" src={it.img} alt={it.name} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} />}
              </div>
            ))}
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
            <span className="funded-badge">Funded by Capital One · {formatDollars(offer.dollars)}</span>
          </div>
          <div className="section-sub">Pick one — it's already paid for. No {unit} required.</div>
          <div className="gift-grid">
            {offer.items.map((it) => (
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
              <span className="sr-value positive">{formatDollars(offer.dollars)} · Funded</span>
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
      subtitle={`Enjoy your ${choice.name} — and your new ${offer.product}. Estimated delivery in 3–5 business days.`}
      balanceChanged={false}
      newBalance={balance}
      detailRows={[
        { label: 'Gift', value: `${choice.emoji} ${choice.name}` },
        { label: 'Value', value: `${formatDollars(offer.dollars)} · Funded by Capital One` },
        { label: 'Delivery', value: 'Est. 3–5 business days' },
      ]}
      onDone={onExit}
      doneLabel="Back to Offers"
    />
  )
}
