import { useState } from 'react'
import { ScreenHeader } from '../components/Headers.jsx'
import ListRow from '../components/ListRow.jsx'
import Confetti from '../components/Confetti.jsx'
import { GIFT_MOMENT, formatMiles, formatDollars } from '../data/mock.js'
import { useCurrency } from '../currency.js'

/**
 * Flow 5 — The monthly gift moment (SMS-triggered).
 * Capital One already texts when the statement is ready; we add one warm line
 * and a link. The tap deep-links straight into the gift-moment reveal — no
 * login wall — then routes into the existing flows (pick / shop / save).
 * This flow is the doorway; the rooms (Flows 1 & 2) already exist.
 */
export default function GiftMoment({ onPick, onShop, onExit }) {
  const { unit } = useCurrency()
  const [step, setStep] = useState('lock') // lock → moment → saved
  const [tier, setTier] = useState('high') // demo toggle: high | low

  const pts = GIFT_MOMENT.tiers[tier]
  const dollars = Math.round(pts / 100)
  const ready = pts >= GIFT_MOMENT.threshold
  const goalDollars = Math.round(GIFT_MOMENT.threshold / 100)

  // Same template, different warmth.
  const smsBody = ready
    ? `Your ${GIFT_MOMENT.month} statement is ready. You've got a ${formatDollars(dollars)} gift moment waiting — tap to open 🎁`
    : `Your ${GIFT_MOMENT.month} statement is ready. Your gift is growing — you're almost there 🌱`

  // ── Step: mock lock screen / SMS ─────────────────────────────────────────────
  if (step === 'lock') {
    return (
      <div className="lock-screen">
        <div className="ls-time">9:48</div>
        <div className="ls-date">Tuesday, July 15</div>

        <button className="ls-notif" onClick={() => setStep('moment')}>
          <span className="ln-head">
            <span className="ln-app">C1</span>
            <span>MESSAGES · CAPITAL ONE</span>
            <span className="ln-time">now</span>
          </span>
          <span className="ln-title">Capital One</span>
          <span className="ln-body">{smsBody}</span>
        </button>

        <div className="ls-hint">Tap the message to open the gift moment</div>

        <div className="ls-toggle">
          <span>Demo · tier:</span>
          <button className={`chip ${tier === 'high' ? 'active' : ''}`} onClick={() => setTier('high')}>High balance</button>
          <button className={`chip ${tier === 'low' ? 'active' : ''}`} onClick={() => setTier('low')}>Low balance</button>
          <button className="ls-exit" onClick={onExit}>Exit</button>
        </div>
      </div>
    )
  }

  // ── Step: saved for later ────────────────────────────────────────────────────
  if (step === 'saved') {
    return (
      <div>
        <div className="confirm-wrap">
          <div className="confirm-check">✓</div>
          <div className="confirm-title">Saved for later</div>
          <div className="confirm-sub">
            Your {formatDollars(dollars)} gift moment stays put and keeps growing with every swipe.
            We'll wrap it up again next month. 🌱
          </div>
        </div>
        <div className="screen-pad" style={{ paddingTop: 0 }}>
          <button className="btn btn-primary" onClick={onExit}>Done</button>
        </div>
      </div>
    )
  }

  // ── Step: the gift moment reveal ─────────────────────────────────────────────
  return (
    <div>
      {ready && <Confetti />}
      <ScreenHeader title={`Your ${GIFT_MOMENT.month} gift moment`} onBack={() => setStep('lock')} onClose={onExit} />

      <div className="moment-hero">
        <div className="moment-emoji" aria-hidden="true">{ready ? '🎁' : '🌱'}</div>
        <div className="moment-amount">{formatDollars(dollars)}</div>
        <div className="section-sub" style={{ marginTop: 4 }}>
          {formatMiles(pts)} {unit} earned this month, wrapped up as a gift.
        </div>
        {!ready && (
          <div className="moment-progress">
            <div className="progress"><span style={{ width: `${Math.min(100, (pts / GIFT_MOMENT.threshold) * 100)}%` }} /></div>
            <div className="progress-label">{formatDollars(dollars)} of {formatDollars(goalDollars)} — almost there</div>
          </div>
        )}
      </div>

      <div className="screen-pad" style={{ paddingTop: 8 }}>
        <div className="list-card">
          <ListRow
            icon="🎁"
            title="Pick a gift"
            description="Send a curated collection someone gets to choose from."
            onClick={onPick}
          />
          <ListRow
            icon="🛍️"
            title="Shop for yourself"
            description={`Spend your ${unit} on something for you.`}
            onClick={onShop}
          />
          <ListRow
            icon="⏳"
            title="Save it for later"
            description="Let this month's moment keep growing."
            onClick={() => setStep('saved')}
          />
        </div>
        <div className="demo-note">
          Deep-linked from the statement-ready text — no login wall, the moment opens already loaded.
        </div>
      </div>
    </div>
  )
}
