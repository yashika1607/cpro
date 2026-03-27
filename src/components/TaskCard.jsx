import { Icons, CATEGORIES, PRIORITIES } from '../shared'
import './TaskCard.css'

function TaskCard({ task, onToggle, onDelete, onEdit, onPin }) {
  const category = CATEGORIES.find(c => c.id === task.category)
  
  return (
    <div className={`task-card ${task.completed ? 'completed' : ''} ${task.pinned ? 'pinned' : ''}`}>
      <div className="task-card-header">
        <div className="task-main">
          <button className={`task-checkbox ${task.completed ? 'checked' : ''}`} onClick={onToggle}>
            {task.completed && <Icons.Check />}
          </button>
          
          <div className="task-content">
            <div className="task-title-row">
              <h3 className={task.completed ? 'completed-text' : ''}>{task.title}</h3>
              {task.pinned && <span className="pin-indicator"><Icons.Pin /></span>}
            </div>
            
            {task.description && <p className="task-description">{task.description}</p>}
            
            <div className="task-meta-row">
              <span className="category-badge" style={{ background: category?.color }}>
                {category?.icon} {category?.name}
              </span>
              
              <span className="priority-badge" style={{ color: PRIORITIES[task.priority].color }}>
                {PRIORITIES[task.priority].label}
              </span>
              
              <span className="due-datetime">
                <Icons.Calendar /> {new Date(task.dueDate).toLocaleDateString()}
                <Icons.Clock /> {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
        
        <div className="task-actions">
          <button className="action-btn pin" onClick={onPin} title={task.pinned ? 'Unpin' : 'Pin'}>
            <Icons.Pin />
          </button>
          <button className="action-btn edit" onClick={onEdit}>
            <Icons.Edit />
          </button>
          <button className="action-btn delete" onClick={onDelete}>
            <Icons.Trash />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskCard
