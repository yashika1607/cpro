import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import TaskModal from './components/TaskModal'
import PomodoroModal from './components/PomodoroModal'
import Home from './pages/Home'
import Tasks from './pages/Tasks'
import Profile from './pages/Profile'
import { THEMES, BADGES } from './shared'

function App() {
  // App State
  const [currentScreen, setCurrentScreen] = useState('home')
  const [tasks, setTasks] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  
  // User Settings
  const [userSettings, setUserSettings] = useState({
    name: '',
    avatar: '😎',
    theme: 'gradient',
  })
  
  // Gamification
  const [stats, setStats] = useState({
    streak: 0,
    totalPoints: 0,
    badges: [],
    lastLoginDate: null,
    tasksCompletedToday: 0,
  })
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [activeTab, setActiveTab] = useState('today')
  
  // Pomodoro
  const [showPomodoro, setShowPomodoro] = useState(false)
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [activePomodoroTask, setActivePomodoroTask] = useState(null)
  
  // Lazy Mode
  const [lazyMode, setLazyMode] = useState(false)
  
  // Initialize streak on mount
  useEffect(() => {
    const today = new Date().toDateString()
    const lastLogin = stats.lastLoginDate ? new Date(stats.lastLoginDate).toDateString() : null
    
    if (lastLogin !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastLogin === yesterday.toDateString()) {
        setStats(prev => ({ ...prev, streak: prev.streak + 1, lastLoginDate: new Date().toISOString() }))
      } else if (lastLogin !== today) {
        setStats(prev => ({ ...prev, streak: 1, lastLoginDate: new Date().toISOString() }))
      }
    }
  }, [])
  
  // Check badges
  useEffect(() => {
    const newBadges = []
    const completedCount = tasks.filter(t => t.completed).length
    
    BADGES.forEach(badge => {
      if (!stats.badges.includes(badge.id)) {
        if (badge.type === 'streak' && stats.streak >= badge.requirement) {
          newBadges.push(badge.id)
        } else if (!badge.type && completedCount >= badge.requirement) {
          newBadges.push(badge.id)
        }
      }
    })
    
    if (newBadges.length > 0) {
      setStats(prev => ({ ...prev, badges: [...prev.badges, ...newBadges] }))
    }
  }, [tasks, stats.streak, stats.badges])
  
  // Pomodoro timer
  useEffect(() => {
    let interval = null
    if (isTimerRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(prev => prev - 1)
      }, 1000)
    } else if (pomodoroTime === 0) {
      setIsTimerRunning(false)
      setStats(prev => ({ ...prev, totalPoints: prev.totalPoints + 25 }))
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, pomodoroTime])
  
  // Helper Functions
  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      completed: false,
      pinned: false,
      createdAt: new Date().toISOString(),
    }
    setTasks(prev => [newTask, ...prev])
  }
  
  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }
  
  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }
  
  const toggleComplete = (id) => {
    const task = tasks.find(t => t.id === id)
    if (task && !task.completed) {
      const points = task.priority === 'high' ? 15 : task.priority === 'medium' ? 10 : 5
      setStats(prev => ({ 
        ...prev, 
        totalPoints: prev.totalPoints + points,
        tasksCompletedToday: prev.tasksCompletedToday + 1
      }))
    }
    updateTask(id, { completed: !task.completed })
  }
  
  const togglePin = (id) => {
    const task = tasks.find(t => t.id === id)
    updateTask(id, { pinned: !task.pinned })
  }
  
  // Filtered Tasks
  const getFilteredTasks = () => {
    let filtered = [...tasks]
    
    // Search
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.category === filterCategory)
    }
    
    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(t => t.priority === filterPriority)
    }
    
    // Tab filters
    const today = new Date().toDateString()
    if (activeTab === 'today') {
      filtered = filtered.filter(t => {
        const taskDate = new Date(t.dueDate).toDateString()
        return taskDate === today && !t.completed
      })
    } else if (activeTab === 'upcoming') {
      filtered = filtered.filter(t => {
        const taskDate = new Date(t.dueDate)
        return taskDate > new Date() && !t.completed
      })
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(t => t.completed)
    }
    
    // Sort: pinned first, then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
    
    return filtered
  }
  
  const todayTasks = tasks.filter(t => {
    const taskDate = new Date(t.dueDate).toDateString()
    return taskDate === new Date().toDateString() && !t.completed
  })
  
  const progress = todayTasks.length > 0 
    ? ((todayTasks.length - todayTasks.filter(t => !t.completed).length) / todayTasks.length) * 100 
    : 0
  
  return (
    <div className={`app ${userSettings.darkMode ? 'dark-mode' : ''}`} style={{ background: THEMES[userSettings.theme].bg }}>
      {/* Main Content */}
      <main className="main-content">
        {currentScreen === 'home' && (
          <Home 
            userSettings={userSettings}
            stats={stats}
            progress={progress}
            todayTasks={todayTasks}
            toggleComplete={toggleComplete}
          />
        )}
        
        {currentScreen === 'tasks' && (
          <Tasks 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            getFilteredTasks={getFilteredTasks}
            setShowAddModal={setShowAddModal}
            toggleComplete={toggleComplete}
            deleteTask={deleteTask}
            setEditingTask={setEditingTask}
            togglePin={togglePin}
          />
        )}
        
        {currentScreen === 'profile' && (
          <Profile 
            userSettings={userSettings}
            setUserSettings={setUserSettings}
            stats={stats}
            lazyMode={lazyMode}
            setLazyMode={setLazyMode}
          />
        )}
      </main>
      
      {/* Bottom Navigation */}
      <Navbar 
        currentScreen={currentScreen} 
        onNavigate={setCurrentScreen}
        onAddTask={() => setShowAddModal(true)}
      />
      
      {/* Add/Edit Task Modal */}
      {(showAddModal || editingTask) && (
        <TaskModal
          task={editingTask}
          onClose={() => { setShowAddModal(false); setEditingTask(null) }}
          onSave={(taskData) => {
            if (editingTask) {
              updateTask(editingTask.id, taskData)
            } else {
              addTask(taskData)
            }
            setShowAddModal(false)
            setEditingTask(null)
          }}
        />
      )}
      
      {/* Pomodoro Modal */}
      {showPomodoro && (
        <PomodoroModal
          time={pomodoroTime}
          isRunning={isTimerRunning}
          onToggle={() => setIsTimerRunning(!isTimerRunning)}
          onReset={() => setPomodoroTime(25 * 60)}
          onClose={() => setShowPomodoro(false)}
          activeTask={activePomodoroTask}
          tasks={tasks.filter(t => !t.completed)}
          onSelectTask={(task) => setActivePomodoroTask(task)}
        />
      )}
    </div>
  )
}

export default App
