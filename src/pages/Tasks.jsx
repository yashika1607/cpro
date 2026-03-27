import { Icons, CATEGORIES } from '../shared'
import TaskCard from '../components/TaskCard'

function Tasks({ 
  searchQuery, 
  setSearchQuery, 
  filterCategory, 
  setFilterCategory, 
  filterPriority, 
  setFilterPriority, 
  activeTab, 
  setActiveTab, 
  getFilteredTasks,
  setShowAddModal,
  toggleComplete,
  deleteTask,
  setEditingTask,
  togglePin
}) {
  return (
    <div className="screen tasks-screen">
      <header className="header">
        <h1>All Tasks</h1>
        <button className="add-task-btn" onClick={() => setShowAddModal(true)}>
          <Icons.Plus />
        </button>
      </header>
      
      {/* Search & Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <Icons.Search />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-row">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
            ))}
          </select>
          
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="all">All Priorities</option>
            <option value="high">🔥 High</option>
            <option value="medium">⚡ Medium</option>
            <option value="low">🍃 Low</option>
          </select>
        </div>
        
        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${activeTab === 'today' ? 'active' : ''}`} onClick={() => setActiveTab('today')}>
            Today
          </button>
          <button className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>
            Upcoming
          </button>
          <button className={`tab ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>
            Completed
          </button>
        </div>
      </div>
      
      {/* Task List */}
      <div className="task-list">
        {getFilteredTasks().map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={() => toggleComplete(task.id)}
            onDelete={() => deleteTask(task.id)}
            onEdit={() => setEditingTask(task)}
            onPin={() => togglePin(task.id)}
          />
        ))}
        {getFilteredTasks().length === 0 && (
          <div className="empty-state">
            <p>No tasks found 🫠</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Tasks
