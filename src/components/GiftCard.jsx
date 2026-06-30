import MilesBadge from './MilesBadge.jsx'

/**
 * Photo, title, and $ + miles price. Used in both the collection grid (Flow 1/3)
 * and the catalog grid (Flow 2). Photos are gradient placeholders with an emoji
 * stand-in (no network assets — keeps the demo fully offline).
 */
export default function GiftCard({ item, onClick, selected = false, hidePrice = false }) {
  const hue = item.hue ?? 210
  const photoStyle = {
    background: `linear-gradient(150deg, hsl(${hue} 45% 88%) 0%, hsl(${hue} 38% 74%) 100%)`,
  }
  return (
    <button className={`gift-card ${selected ? 'selected' : ''}`} onClick={onClick}>
      <div className="gift-photo" style={photoStyle}>
        {item.occasion && <span className="gp-occasion">{item.occasion}</span>}
        {/* emoji sits behind as a fallback; the photo covers it once loaded */}
        <span className="gp-emoji" aria-hidden="true">{item.emoji}</span>
        {item.img && (
          <img
            className="gift-img"
            src={item.img}
            alt={item.title || item.name || ''}
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        )}
      </div>
      <div className="gc-body">
        <div className="gc-title">{item.title || item.name}</div>
        {item.category && <div className="gc-sub">{item.category}</div>}
        {!hidePrice && item.dollars != null && (
          <div className="gc-price">
            <MilesBadge dollars={item.dollars} />
          </div>
        )}
      </div>
    </button>
  )
}
