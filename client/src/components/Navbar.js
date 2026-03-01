import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">Blog<span>App</span></Link>
      <div className="nav-right">
        <Link to="/blogs/new" className="btn btn-primary btn-sm">+ New Blog</Link>
        <span className="nav-email">{user?.email}</span>
        {user?.profileImage
          ? <img src={user.profileImage} className="nav-avatar" alt="Profile" />
          : <div className="nav-avatar-placeholder">👤</div>
        }
        <button className="btn btn-ghost btn-sm" onClick={logout} style={{color:'#aaa'}}>Logout</button>
      </div>
    </nav>
  );
}
