/** Static bottom tab bar: Home · Rewards · Help · Offers · Profile. */
const TABS = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'rewards', label: 'Rewards', icon: '🎁' },
  { id: 'help', label: 'Help', icon: '💬' },
  { id: 'offers', label: 'Offers', icon: '🛒' },
  { id: 'profile', label: 'Profile', icon: '👤' },
]

export default function TabBar({ active = 'rewards', onSelect }) {
  return (
    <div className="tab-bar">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`tab-item ${active === t.id ? 'active' : ''}`}
          onClick={() => onSelect && onSelect(t.id)}
        >
          <span className="tab-icon">{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  )
}
