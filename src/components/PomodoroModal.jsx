import { Icons, formatTime } from '../shared'

function PomodoroModal({ 
  time, 
  isRunning, 
  onToggle, 
  onReset, 
  onClose, 
  activeTask, 
  tasks, 
  onSelectTask 
}) {

  return (
    <div className="modal-overlay">
      <div className="modal-content pomodoro-modal">
        <div className="modal-header">
          <h2>Focus Session</h2>
          <button className="close-btn" onClick={onClose}>
            <Icons.X />
          </button>
        </div>

        <div className="timer-display">
          {formatTime(time)}
        </div>

        <div className="timer-controls">
          <button className="control-btn" onClick={onToggle}>
            {isRunning ? <Icons.Pause /> : <Icons.Play />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button className="control-btn" onClick={onReset}>
            <Icons.RotateCcw />
            Reset
          </button>
        </div>

        <div className="active-task-display">
          <p>Currently focusing on:</p>
          <h3>{activeTask ? activeTask.title : 'No task selected'}</h3>
        </div>

        <div className="task-select-section">
          <p>Change focus task:</p>
          <select 
            value={activeTask?.id || ''} 
            onChange={(e) => {
              const task = tasks.find(t => t.id === parseInt(e.target.value))
              onSelectTask(task)
            }}
          >
            <option value="">Select a task...</option>
            {tasks.map(task => (
              <option key={task.id} value={task.id}>{task.title}</option>
            ))}
          </select>
        </div>

        <div className="pomodoro-info">
          <p>Focus for 25 minutes to earn 25 bonus points! 🚀</p>
        </div>
      </div>
    </div>
  )
}

export default PomodoroModal
