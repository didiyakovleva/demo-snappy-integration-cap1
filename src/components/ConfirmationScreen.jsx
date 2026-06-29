import { formatMiles } from '../data/mock.js'

/**
 * Shared confirmation screen. `balanceChanged` is false for Flow 3 (funded
 * reward — nothing was spent), true for Flow 1 & 2.
 * `recipientPreview` renders the read-only "this is what they'll see" peek.
 */
export default function ConfirmationScreen({
  funded = false,
  title,
  subtitle,
  balanceChanged = true,
  newBalance,
  milesSpent,
  detailRows = [],
  recipientPreview,
  onDone,
  doneLabel = 'Done',
}) {
  return (
    <div>
      <div className="confirm-wrap">
        <div className={`confirm-check ${funded ? 'funded' : ''}`}>✓</div>
        <div className="confirm-title">{title}</div>
        {subtitle && <div className="confirm-sub">{subtitle}</div>}
      </div>

      <div className="screen-pad" style={{ paddingTop: 0 }}>
        {(balanceChanged || detailRows.length > 0) && (
          <div className="summary-card">
            {detailRows.map((r, i) => (
              <div className="summary-row" key={i}>
                <span className="sr-label">{r.label}</span>
                <span className="sr-value">{r.value}</span>
              </div>
            ))}
            {balanceChanged && milesSpent != null && (
              <div className="summary-row">
                <span className="sr-label">Miles redeemed</span>
                <span className="sr-value deduct">−{formatMiles(milesSpent)}</span>
              </div>
            )}
            {balanceChanged && newBalance != null && (
              <div className="summary-row total">
                <span className="sr-label">New balance</span>
                <span className="sr-value">{formatMiles(newBalance)} miles</span>
              </div>
            )}
            {!balanceChanged && (
              <div className="summary-row total">
                <span className="sr-label">Miles balance</span>
                <span className="sr-value positive">Unchanged · {formatMiles(newBalance)} miles</span>
              </div>
            )}
          </div>
        )}

        {recipientPreview}

        <div className="spacer-md" />
        <button className="btn btn-primary" onClick={onDone}>{doneLabel}</button>
        <div className="spacer-md" />
      </div>
    </div>
  )
}
