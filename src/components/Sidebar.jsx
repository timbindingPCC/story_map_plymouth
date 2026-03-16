export default function Sidebar({ open, onToggle }) {
  return (
    <>
      <aside className={`sidebar${open ? ' sidebar--open' : ''}`}>
        <div className="sidebar-inner">
          <div className="sidebar-header">
            <h1 className="sidebar-title">Plymouth Story Map</h1>
            <p className="sidebar-subtitle">
              Click the map to mark locations and capture notes for collective analysis.
            </p>
          </div>

          <section className="sidebar-section">
            <h2 className="sidebar-section-title">How to use</h2>
            <ol className="sidebar-steps">
              <li className="sidebar-step">
                <span className="step-number">1</span>
                <div className="step-body">
                  <strong>Enter add mode</strong>
                  <p>Click the <em>+ Add point</em> button at the top of the map. The cursor will change to a crosshair.</p>
                </div>
              </li>
              <li className="sidebar-step">
                <span className="step-number">2</span>
                <div className="step-body">
                  <strong>Click a location</strong>
                  <p>Click anywhere on the map to place a marker at that spot.</p>
                </div>
              </li>
              <li className="sidebar-step">
                <span className="step-number">3</span>
                <div className="step-body">
                  <strong>Add details</strong>
                  <p>A form will appear — give your location a title and any relevant notes, then click <em>Save</em>.</p>
                </div>
              </li>
              <li className="sidebar-step">
                <span className="step-number">4</span>
                <div className="step-body">
                  <strong>View saved locations</strong>
                  <p>Click any <span className="dot-sample" /> red dot on the map to read its title and notes.</p>
                </div>
              </li>
            </ol>
          </section>

          <section className="sidebar-section">
            <h2 className="sidebar-section-title">Tips</h2>
            <ul className="tool-list">
              <li><span className="tool-icon">+</span> <span>Click <strong>+ Add point</strong> to enter add mode, then click the map</span></li>
              <li><span className="tool-icon">✕</span> <span>Click <strong>✕ Cancel</strong> or press the button again to exit without adding</span></li>
              <li><span className="tool-icon">●</span> <span>Click any red dot to view its saved details</span></li>
            </ul>
          </section>

          <div className="sidebar-note">
            All entries are saved automatically. Data is not visible to other users in real time — it is collected for analysis only.
          </div>
        </div>
      </aside>

      {/* Toggle button — sits on the edge of the sidebar */}
      <button
        className="sidebar-toggle"
        onClick={onToggle}
        aria-label={open ? 'Close sidebar' : 'Open sidebar'}
        style={{ left: open ? 'var(--sidebar-width)' : '0' }}
      >
        {open ? '‹' : '›'}
      </button>
    </>
  )
}
