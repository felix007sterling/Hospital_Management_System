import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const linksByRole = {
  patient: [
    { to: '/', label: 'Dashboard' },
    { to: '/doctors', label: 'Find Doctors' },
    { to: '/appointments', label: 'My Appointments' },
    { to: '/records', label: 'Medical Records' },
    { to: '/prescriptions', label: 'Prescriptions' },
    { to: '/invoices', label: 'Billing' }
  ],
  doctor: [
    { to: '/', label: 'Dashboard' },
    { to: '/schedule', label: 'My Schedule' },
    { to: '/patients', label: 'Patients' }
  ],
  admin: [
    { to: '/', label: 'Dashboard' },
    { to: '/manage-doctors', label: 'Doctors' },
    { to: '/manage-patients', label: 'Patients' },
    { to: '/all-appointments', label: 'Appointments' },
    { to: '/reports', label: 'Reports' }
  ]
};

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = linksByRole[user?.role] || [];

  return (
    <div className="app-shell">
      <header className="topnav glass">
        <NavLink to="/" className="brand">MedCore</NavLink>
        <nav className="nav-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="nav-right">
          <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <span className="role-chip">{user?.role}</span>
          <span className="user-chip">{user?.name}</span>
          <button className="secondary logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main className="content">{children}</main>
    </div>
  );
};

export default Layout;
