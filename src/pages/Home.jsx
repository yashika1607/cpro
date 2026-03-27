import { Icons, PRIORITIES, CATEGORIES, formatDate, formatDateTime } from '../shared'

function Home({ userSettings, stats, progress, todayTasks, toggleComplete }) {
  const dailyTop3 = todayTasks.slice(0, 3)

  return (
    <div className="screen home-screen">
      <header className="header">
        <div className="user-greeting">
          <span className="avatar">{userSettings.avatar}</span>
          <div>
            <h1>Welcome back{userSettings.name ? `, ${userSettings.name}` : ''}!</h1>
            <p className="date">{formatDate(new Date())}</p>
          </div>
        </div>
        <div className="streak-badge">
          <Icons.Fire />
          <span>{stats.streak} day streak</span>
        </div>
      </header>
      
      {/* Progress Card */}
      <div className="progress-card">
        <div className="progress-header">
          <h2>Today's Progress</h2>
          <span className="progress-percentage">{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="progress-subtitle">
          {todayTasks.filter(t => !t.completed).length} tasks remaining
        </p>
      </div>
      
      {/* Daily Top 3 */}
      {dailyTop3.length > 0 && (
        <div className="top-tasks-section">
          <h3 className="section-title">✨ Daily Top 3</h3>
          <div className="top-tasks-list">
            {dailyTop3.map((task, index) => (
              <div key={task.id} className="top-task-item" style={{ borderLeftColor: PRIORITIES[task.priority].color }}>
                <span className="task-number">{index + 1}</span>
                <div className="task-info">
                  <h4>{task.title}</h4>
                  <p className="task-meta">
                    <span className="category-tag" style={{ background: CATEGORIES.find(c => c.id === task.category)?.color }}>
                      {CATEGORIES.find(c => c.id === task.category)?.icon} {task.category}
                    </span>
                    <span className="time-tag">
                      <Icons.Clock /> {formatDateTime(task.dueDate)}
                    </span>
                  </p>
                </div>
                <button className="check-btn" onClick={() => toggleComplete(task.id)}>
                  <Icons.Check />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-box">
          <div className="stat-icon"><Icons.Trophy /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalPoints}</span>
            <span className="stat-label">Total Points</span>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon"><Icons.Star /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.badges.length}</span>
            <span className="stat-label">Badges Earned</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
