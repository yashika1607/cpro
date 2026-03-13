import { useState, useEffect } from 'react'
import { Plus, Trash2, Check, ClipboardList, Edit2, X, Save, Flag, User, Palette } from 'lucide-react'
import "./App.css";

const PRIORITIES = {
  low: { color: '#22c55e', label: 'Low', bg: '#dcfce7' },
  medium: { color: '#f59e0b', label: 'Medium', bg: '#fef3c7' },
  high: { color: '#ef4444', label: 'High', bg: '#fee2e2' }
}

const BG_COLORS = [
  { name: 'Purple', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Blue', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: 'Green', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { name: 'Orange', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { name: 'Dark', value: 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)' }
]

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [inputValue, setInputValue] = useState('')
  const [priority, setPriority] = useState('medium')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [editPriority, setEditPriority] = useState('medium')
  
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || ''
  })
  const [bgColor, setBgColor] = useState(() => {
    return localStorage.getItem('bgColor') || BG_COLORS[0].value
  })
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    localStorage.setItem('userName', userName)
  }, [userName])

  useEffect(() => {
    localStorage.setItem('bgColor', bgColor)
  }, [bgColor])

  const addTodo = () => {
    if (inputValue.trim() === '') return
    
    const newTodo = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
      priority: priority,
      createdAt: new Date().toISOString()
    }
    
    setTodos([newTodo, ...todos])
    setInputValue('')
    setPriority('medium')
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const startEditing = (todo) => {
    setEditingId(todo.id)
    setEditValue(todo.text)
    setEditPriority(todo.priority || 'medium')
  }

  const saveEdit = () => {
    if (editValue.trim() === '') return
    setTodos(todos.map(todo => 
      todo.id === editingId 
        ? { ...todo, text: editValue.trim(), priority: editPriority }
        : todo
    ))
    setEditingId(null)
    setEditValue('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const clearAll = () => {
    if (todos.length === 0) return
    if (confirm('Clear all tasks?')) {
      setTodos([])
    }
  }

  const markAll = () => {
    const allDone = todos.every(t => t.completed)
    setTodos(todos.map(t => ({ ...t, completed: !allDone })))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  }).filter(todo => todo.text.toLowerCase().includes(search.toLowerCase()))

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length

  return (
    <>
      <style>{`body { background: ${bgColor}; }`}</style>
      <div className="todo-container">
      <div className="todo-header">
        <div className="header-top">
          <h1>{userName ? `${userName}'s Todo List` : 'Todo List'}</h1>
          <button 
            className="settings-btn"
            onClick={() => setShowSettings(!showSettings)}
          >
            <User size={20} />
          </button>
        </div>
        <p>Stay organized and get things done</p>
        
        {showSettings && (
          <div className="settings-panel">
            <div className="setting-item">
              <label><User size={14} /> Your Name:</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="setting-item">
              <label><Palette size={14} /> Background:</label>
              <div className="color-options">
                {BG_COLORS.map((color) => (
                  <button
                    key={color.value}
                    className={`color-btn ${bgColor === color.value ? 'active' : ''}`}
                    style={{ background: color.value }}
                    onClick={() => setBgColor(color.value)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            <div className="setting-item">
              <label>🔎 Search tasks:</label>
              <input
                type="text"
                placeholder="Type to filter..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="todo-input-section">
        <div className="todo-input-container">
          <input
            type="text"
            className="todo-input"
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <select 
            className="priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button className="add-btn" onClick={addTodo}>
            <Plus size={24} />
          </button>
        </div>
        <div className="priority-labels">
          <span className="priority-label low"><Flag size={12} /> Low</span>
          <span className="priority-label medium"><Flag size={12} /> Medium</span>
          <span className="priority-label high"><Flag size={12} /> High</span>
        </div>
      </div>

      <div className="filter-container">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button 
          className="filter-btn"
          onClick={markAll}
          title="Toggle all"
        >
          {completedCount === totalCount && totalCount > 0 ? 'Unmark all' : 'Mark all'}
        </button>
        <button 
          className="filter-btn"
          onClick={clearAll}
          title="Clear all"
        >
          Clear all
        </button>
      </div>

      <ul className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <ClipboardList size={48} />
            <p>No tasks found</p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <li 
              key={todo.id} 
              className={`todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority || 'medium'}`}
            >
              <div 
                className={`checkbox ${todo.completed ? 'checked' : ''}`}
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.completed && <Check size={16} color="white" />}
              </div>
              
              {editingId === todo.id ? (
                <div className="edit-container">
                  <input
                    type="text"
                    className="edit-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                    autoFocus
                  />
                  <select 
                    className="edit-priority-select"
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <button className="save-btn" onClick={saveEdit}>
                    <Save size={18} />
                  </button>
                  <button className="cancel-btn" onClick={cancelEdit}>
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="todo-content">
                    <span className="priority-badge" style={{ 
                      backgroundColor: PRIORITIES[todo.priority || 'medium'].bg,
                      color: PRIORITIES[todo.priority || 'medium'].color
                    }}>
                      <Flag size={10} />
                      {PRIORITIES[todo.priority || 'medium'].label}
                    </span>
                    <span className="todo-text">{todo.text}</span>
                  </div>
                  <div className="todo-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => startEditing(todo)}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>

      {totalCount > 0 && (
        <div className="stats">
          <span>{totalCount - completedCount} items left</span>
          {completedCount > 0 && (
            <button className="clear-completed" onClick={clearCompleted}>
              Clear completed ({completedCount})
            </button>
          )}
        </div>
      )}
    </div>
    </>
  )
}

export default App
