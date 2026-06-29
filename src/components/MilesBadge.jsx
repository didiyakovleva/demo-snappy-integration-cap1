import { milesForDollars, formatMiles, formatDollars } from '../data/mock.js'

/**
 * Renders a value both ways: "$100 · 10,000 miles".
 * Cardholders think in miles; gifts are priced in dollars — always show both.
 */
export default function MilesBadge({ dollars, miles, size, inverse }) {
  const m = miles ?? milesForDollars(dollars)
  const classes = ['miles-badge']
  if (size === 'large') classes.push('large')
  if (inverse) classes.push('inverse')
  return (
    <span className={classes.join(' ')}>
      {dollars != null && <span className="mb-dollars">{formatDollars(dollars)}</span>}
      {dollars != null && <span className="mb-sep">·</span>}
      <span className="mb-miles">{formatMiles(m)} miles</span>
    </span>
  )
}
