import MilesBadge from './MilesBadge.jsx'
import { formatMiles } from '../data/mock.js'
import { useCurrency } from '../currency.js'

/** Light header bar with optional back arrow, centered title, optional close. */
export function ScreenHeader({ title, onBack, onClose }) {
  return (
    <div className="app-header light">
      {onBack && <button className="header-back" onClick={onBack} aria-label="Back">‹</button>}
      {title}
      {onClose && <button className="header-close" onClick={onClose} aria-label="Close">×</button>}
    </div>
  )
}

/**
 * Navy card-style header (VentureOne-style) showing the account label, optional
 * balance, and a close button. Used on the Redeem list and flow entry screens.
 */
export function NavyHeader({ accountLabel, last4, balance, onClose, children }) {
  const { label } = useCurrency()
  return (
    <div className="navy-header">
      <div className="nh-top">
        <span>{accountLabel}</span>
        {last4 && <span className="nh-acct">····{last4}</span>}
        {onClose && <button className="header-close" onClick={onClose} aria-label="Close">×</button>}
      </div>
      {balance != null && (
        <>
          <div className="nh-balance">{formatMiles(balance)}</div>
          <div className="nh-balance-label">{label}</div>
        </>
      )}
      {children}
    </div>
  )
}

export { MilesBadge }
