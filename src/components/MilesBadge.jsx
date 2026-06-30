import { milesForDollars, formatMiles, formatDollars } from '../data/mock.js'
import { useCurrency } from '../currency.js'

/**
 * Renders a value both ways: "$100 · 10,000 miles".
 * Cardholders think in their reward currency; gifts are priced in dollars —
 * always show both. The currency word follows the selected account.
 */
export default function MilesBadge({ dollars, miles, size, inverse }) {
  const { unit } = useCurrency()
  const m = miles ?? milesForDollars(dollars)
  const classes = ['miles-badge']
  if (size === 'large') classes.push('large')
  if (inverse) classes.push('inverse')
  return (
    <span className={classes.join(' ')}>
      {dollars != null && <span className="mb-dollars">{formatDollars(dollars)}</span>}
      {dollars != null && <span className="mb-sep">·</span>}
      <span className="mb-miles">{formatMiles(m)} {unit}</span>
    </span>
  )
}
