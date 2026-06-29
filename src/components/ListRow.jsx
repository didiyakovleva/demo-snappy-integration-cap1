/**
 * Redeem-list row: leading icon, title, gray description, trailing chevron.
 * Matches Capital One's existing Redeem rows. `snappy` flags a Snappy-introduced
 * row (adds a subtle "Snappy" tag).
 */
export default function ListRow({ icon, title, description, onClick, snappy = false }) {
  return (
    <button className={`list-row ${snappy ? 'snappy-row' : ''}`} onClick={onClick}>
      <span className="lr-icon">{icon}</span>
      <span className="lr-body">
        <span className="lr-title">{title}</span>
        <span className="lr-desc">{description}</span>
      </span>
      <span className="lr-chevron">›</span>
    </button>
  )
}
