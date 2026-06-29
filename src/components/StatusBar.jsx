/** Static iOS-style status bar in Capital One maroon. */
export default function StatusBar() {
  return (
    <div className="status-bar">
      <div className="sb-left">
        <span>●●●●●</span>
        <span>AT&amp;T</span>
        <span>📶</span>
      </div>
      <div className="sb-time">9:48 AM</div>
      <div className="sb-right">
        <span>81%</span>
        <span>🔋</span>
      </div>
    </div>
  )
}
