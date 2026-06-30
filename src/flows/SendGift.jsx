import { useState } from 'react'
import { ScreenHeader } from '../components/Headers.jsx'
import GiftCard from '../components/GiftCard.jsx'
import MilesBadge from '../components/MilesBadge.jsx'
import ConfirmationScreen from '../components/ConfirmationScreen.jsx'
import { COLLECTIONS, CARDHOLDER, milesForDollars, formatMiles } from '../data/mock.js'
import { useCurrency } from '../currency.js'

/**
 * Flow 1 — Send a gift collection (OUTBOUND: cardholder spends their own miles/points).
 * Steps: choose collection → set value → recipient + message → review → confirm.
 */
export default function SendGift({ balance, onSpend, onExit }) {
  const { unit, label, unitSingular } = useCurrency()
  const [step, setStep] = useState('collection')
  const [collection, setCollection] = useState(null)
  const [recipient, setRecipient] = useState({ name: '', email: '', note: '', sender: CARDHOLDER.firstName })

  const cost = collection ? milesForDollars(collection.dollars) : 0
  const insufficient = cost > balance
  const newBalance = balance - cost

  // ── Step: choose a collection ──────────────────────────────────────────────
  if (step === 'collection') {
    return (
      <div>
        <ScreenHeader title="Send a gift" onClose={onExit} />
        <div className="screen-pad">
          <div className="section-sub">
            Spend {unit} to send a gift. The recipient chooses what they want from the
            collection — we handle the rest.
          </div>
          <div className="gift-grid">
            {COLLECTIONS.map((c) => (
              <GiftCard
                key={c.id}
                item={c}
                onClick={() => { setCollection(c); setStep('value') }}
              />
            ))}
          </div>
          <div className="demo-note">Rate shown is 1 {unitSingular} = $0.01, for demo purposes.</div>
        </div>
      </div>
    )
  }

  // ── Step: set the gift value ────────────────────────────────────────────────
  if (step === 'value') {
    return (
      <div>
        <ScreenHeader title="Gift value" onBack={() => setStep('collection')} onClose={onExit} />
        <div className="screen-pad">
          <GiftCard item={collection} />
          <div className="spacer-md" />
          <div className="section-sub">{collection.blurb}</div>

          {/* Preview of what's inside — the recipient picks one of these */}
          {collection.items?.length > 0 && (
            <>
              <div className="preview-heading">What's inside</div>
              <div className="preview-note">{recipient.name ? `${recipient.name} chooses` : 'They choose'} one of these from the {collection.title} collection.</div>
              <div className="collection-preview">
                {collection.items.map((it, i) => (
                  <div className="cp-item" key={i}>
                    <div className="cp-thumb" style={{ background: `hsl(${collection.hue} 30% 90%)` }}>
                      <span className="cp-emoji" aria-hidden="true">{it.emoji}</span>
                      {it.img && <img className="gift-img" src={it.img} alt={it.name} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} />}
                    </div>
                    <div className="cp-name">{it.name}</div>
                  </div>
                ))}
              </div>
              <div className="spacer-md" />
            </>
          )}

          <div className="summary-card">
            <div className="summary-row">
              <span className="sr-label">Gift value</span>
              <span className="sr-value"><MilesBadge dollars={collection.dollars} /></span>
            </div>
            <div className="summary-row">
              <span className="sr-label">Your balance</span>
              <span className="sr-value">{formatMiles(balance)} {unit}</span>
            </div>
            <div className="summary-row total">
              <span className="sr-label">Balance after</span>
              <span className={`sr-value ${insufficient ? 'deduct' : ''}`}>
                {insufficient ? `Not enough ${unit}` : `${formatMiles(newBalance)} ${unit}`}
              </span>
            </div>
          </div>

          {insufficient && (
            <div className="balance-strip insufficient">
              <span className="bs-label">You need {formatMiles(cost - balance)} more {unit}</span>
            </div>
          )}
        </div>
        <div className="sticky-footer">
          <button
            className="btn btn-primary"
            disabled={insufficient}
            onClick={() => setStep('recipient')}
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  // ── Step: recipient + message ────────────────────────────────────────────────
  if (step === 'recipient') {
    const canContinue = recipient.name.trim() && recipient.email.trim()
    return (
      <div>
        <ScreenHeader title="Who's it for?" onBack={() => setStep('value')} onClose={onExit} />
        <div className="screen-pad">
          <div className="field">
            <label>Recipient name</label>
            <input
              value={recipient.name}
              placeholder="e.g. Jordan Lee"
              onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Delivery email</label>
            <input
              type="email"
              value={recipient.email}
              placeholder="jordan@example.com"
              onChange={(e) => setRecipient({ ...recipient, email: e.target.value })}
            />
            <div className="field-hint">We'll email them a link to choose their gift.</div>
          </div>
          <div className="field">
            <label>Personal note <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}>(optional)</span></label>
            <textarea
              value={recipient.note}
              placeholder="Add a short message…"
              maxLength={200}
              onChange={(e) => setRecipient({ ...recipient, note: e.target.value })}
            />
          </div>
          <div className="field">
            <label>From <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}>(optional)</span></label>
            <input
              value={recipient.sender}
              placeholder="Your name"
              onChange={(e) => setRecipient({ ...recipient, sender: e.target.value })}
            />
          </div>
        </div>
        <div className="sticky-footer">
          <button className="btn btn-primary" disabled={!canContinue} onClick={() => setStep('review')}>
            Review gift
          </button>
        </div>
      </div>
    )
  }

  // ── Step: review & confirm ───────────────────────────────────────────────────
  if (step === 'review') {
    return (
      <div>
        <ScreenHeader title="Review & confirm" onBack={() => setStep('recipient')} onClose={onExit} />
        <div className="screen-pad">
          <div className="summary-card">
            <div className="summary-row">
              <span className="sr-label">Collection</span>
              <span className="sr-value">{collection.title}</span>
            </div>
            <div className="summary-row">
              <span className="sr-label">Value</span>
              <span className="sr-value"><MilesBadge dollars={collection.dollars} /></span>
            </div>
            <div className="summary-row">
              <span className="sr-label">To</span>
              <span className="sr-value">{recipient.name}<br />{recipient.email}</span>
            </div>
            {recipient.note && (
              <div className="summary-row">
                <span className="sr-label">Message</span>
                <span className="sr-value" style={{ fontWeight: 400, fontStyle: 'italic' }}>"{recipient.note}"</span>
              </div>
            )}
            <div className="summary-row">
              <span className="sr-label">{label} deducted</span>
              <span className="sr-value deduct">−{formatMiles(cost)}</span>
            </div>
            <div className="summary-row total">
              <span className="sr-label">New balance</span>
              <span className="sr-value">{formatMiles(newBalance)} {unit}</span>
            </div>
          </div>
        </div>
        <div className="sticky-footer">
          <button
            className="btn btn-primary"
            onClick={() => { onSpend(cost); setStep('confirm') }}
          >
            Send gift
          </button>
        </div>
      </div>
    )
  }

  // ── Step: confirmation ───────────────────────────────────────────────────────
  return (
    <ConfirmationScreen
      title="Your gift is on its way"
      subtitle={`We emailed ${recipient.name} a link to choose their gift from the ${collection.title} collection.`}
      balanceChanged
      milesSpent={cost}
      newBalance={balance /* already decremented by onSpend */}
      detailRows={[
        { label: 'Collection', value: collection.title },
        { label: 'Value', value: <MilesBadge dollars={collection.dollars} /> },
        { label: 'Recipient', value: recipient.email },
      ]}
      recipientPreview={
        <div className="preview-peek">
          <div className="pp-label">This is what {recipient.name || 'they'} will see</div>
          <div className="pp-body">
            <div className="pp-gift">{collection.emoji}</div>
            <div className="pp-headline">{recipient.sender || 'A friend'} sent you a gift!</div>
            {recipient.note && <div className="pp-msg">"{recipient.note}"</div>}
            <div className="pp-cta">Choose your gift ›</div>
          </div>
        </div>
      }
      onDone={onExit}
      doneLabel="Back to Rewards"
    />
  )
}
