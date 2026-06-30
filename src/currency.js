import { createContext, useContext } from 'react'

/**
 * Reward currency carried through the redeem flow. Driven by the selected
 * account (e.g. Rewards Card → Miles, Everyday Card → Points) so every screen
 * speaks the same currency.
 *   label        — capitalized plural, e.g. "Miles" / "Points"
 *   unit         — lowercase plural,  e.g. "miles" / "points"
 *   unitSingular — lowercase singular, e.g. "mile"  / "point"
 */
const DEFAULT = { label: 'Miles', unit: 'miles', unitSingular: 'mile' }

export const CurrencyContext = createContext(DEFAULT)
export const useCurrency = () => useContext(CurrencyContext)

export function currencyFromAccount(account) {
  const label = account?.currency || DEFAULT.label
  const unit = label.toLowerCase()
  return { label, unit, unitSingular: unit.replace(/s$/, '') }
}
