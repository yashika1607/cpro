import { useState } from 'react'
import { Icons, CATEGORIES, PRIORITIES } from '../shared'
import './TaskModal.css'

function TaskModal({ task, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    category: task?.category || 'study',
    dueDate: task?.dueDate || new Date().toISOString().slice(0, 16),
  })
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    onSave(formData)
  }
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'Add New Task'}</h2>
          <button className="close-btn" onClick={onClose}>
            <Icons.X />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What needs to be done?"
              autoFocus
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add details..."
              rows={3}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <div className="priority-selector">
                {Object.entries(PRIORITIES).map(([key, data]) => (
                  <button
                    key={key}
                    type="button"
                    className={`priority-option ${formData.priority === key ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, priority: key }))}
                    style={{ borderColor: formData.priority === key ? data.color : 'transparent' }}
                  >
                    {data.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Due Date & Time</label>
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal
