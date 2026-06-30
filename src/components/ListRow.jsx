/**
 * Redeem-list row: leading icon, title, gray description, trailing chevron.
 * Matches Capital One's existing Redeem rows. Pass `tag` (e.g. "New") to mark a
 * freshly added row with a small pill.
 */
export default function ListRow({ icon, title, description, onClick, tag }) {
  return (
    <button className="list-row" onClick={onClick}>
      <span className="lr-icon">{icon}</span>
      <span className="lr-body">
        <span className="lr-title">
          {title}
          {tag && <span className="lr-tag">{tag}</span>}
        </span>
        <span className="lr-desc">{description}</span>
      </span>
      <span className="lr-chevron">›</span>
    </button>
  )
}
