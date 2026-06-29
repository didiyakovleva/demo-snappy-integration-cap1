import StatusBar from './StatusBar.jsx'
import TabBar from './TabBar.jsx'

/**
 * Device chrome wrapper. Renders the maroon status bar (static), a scrollable
 * viewport for screen content, an optional bottom-sheet overlay, and the
 * bottom tab bar (static chrome).
 */
export default function PhoneFrame({ children, sheet, activeTab, onTabSelect, showTabBar = true }) {
  return (
    <div className="phone-frame">
      <StatusBar />
      <div className="viewport">{children}</div>
      {sheet}
      {showTabBar && <TabBar active={activeTab} onSelect={onTabSelect} />}
    </div>
  )
}
