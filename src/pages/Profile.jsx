import { THEMES, BADGES } from '../shared'

function Profile({ userSettings, setUserSettings, stats, lazyMode, setLazyMode }) {
  return (
    <div className="screen profile-screen">
      <header className="header">
        <h1>Profile & Settings</h1>
      </header>
      
      <div className="profile-header">
        <div className="profile-avatar">{userSettings.avatar}</div>
        <h2>{userSettings.name || 'Set Your Name'}</h2>
        <p className="points-display">⭐ {stats.totalPoints} points</p>
      </div>
      
      {/* Badges Section */}
      <div className="badges-section">
        <h3>Your Badges</h3>
        <div className="badges-grid">
          {BADGES.map(badge => (
            <div 
              key={badge.id} 
              className={`badge ${stats.badges.includes(badge.id) ? 'unlocked' : 'locked'}`}
            >
              <span className="badge-icon">{badge.icon}</span>
              <span className="badge-name">{badge.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Settings Sections */}
      <div className="settings-section">
        <h3>Appearance</h3>
        
        <div className="setting-item">
          <label>Theme</label>
          <div className="theme-selector">
            {Object.entries(THEMES).map(([key, theme]) => (
              <button
                key={key}
                className={`theme-option ${userSettings.theme === key ? 'active' : ''}`}
                onClick={() => setUserSettings(prev => ({ ...prev, theme: key }))}
                style={{ background: theme.bg }}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Profile</h3>
        <div className="setting-item">
          <label>Your Name</label>
          <input
            type="text"
            value={userSettings.name}
            onChange={(e) => setUserSettings(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter your name"
          />
        </div>
        
        <div className="setting-item">
          <label>Avatar</label>
          <div className="avatar-selector">
            {['😎', '🤓', '😊', '😄', '🤩', '😇', '🦸', '🦹'].map(av => (
              <button
                key={av}
                className={`avatar-option ${userSettings.avatar === av ? 'active' : ''}`}
                onClick={() => setUserSettings(prev => ({ ...prev, avatar: av }))}
              >
                {av}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Modes</h3>
        <div className="setting-item">
          <label>Lazy Mode</label>
          <button 
            className={`toggle-btn ${lazyMode ? 'active' : ''}`}
            onClick={() => setLazyMode(!lazyMode)}
          >
            {lazyMode ? 'ON' : 'OFF'}
          </button>
        </div>
        {lazyMode && (
          <p className="mode-description">Shows only one task at a time for maximum focus</p>
        )}
      </div>
    </div>
  )
}

export default Profile
