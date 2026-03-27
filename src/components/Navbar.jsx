import { Icons } from '../shared'
import './Navbar.css'

function Navbar({ currentScreen, onNavigate, onAddTask }) {
  return (
    <nav className="bottom-nav">
      <button className={`nav-btn ${currentScreen === 'home' ? 'active' : ''}`} onClick={() => onNavigate('home')}>
        <Icons.Home />
        <span>Home</span>
      </button>
      
      <button className={`nav-btn ${currentScreen === 'tasks' ? 'active' : ''}`} onClick={() => onNavigate('tasks')}>
        <Icons.List />
        <span>Tasks</span>
      </button>
      
      <button className="nav-btn add-btn" onClick={onAddTask}>
        <Icons.Plus />
      </button>
      
      <button className={`nav-btn ${currentScreen === 'profile' ? 'active' : ''}`} onClick={() => onNavigate('profile')}>
        <Icons.User />
        <span>Profile</span>
      </button>
    </nav>
  )
}

export default Navbar
