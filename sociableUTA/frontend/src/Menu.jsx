import './Menu.css';

export const Menu = ({ onSelect, onLogout, active }) => {
  return (
    <nav className="navbar">
      <span className="navbar-logo">SociableUTA</span>

      <div className="navbar-menu-row">
        <div className="navbar-left">
          <span
            className={`navbar-link${active === 'calendar' ? ' navbar-link-active' : ''}`}
            onClick={() => onSelect('calendar')}
          >
            Calendar
          </span>

          <span
            className={`navbar-link${active === 'post' ? ' navbar-link-active' : ''}`}
            onClick={() => onSelect('post')}
          >
            Create Post
          </span>

          <span
            className={`navbar-link${active === 'postview' ? ' navbar-link-active' : ''}`}
            onClick={() => onSelect('postview')}
          >
            Post
          </span>

          <span
            className={`navbar-link${active === 'analytics' ? ' navbar-link-active' : ''}`}
            onClick={() => onSelect('analytics')}
          >
            Analytics
          </span>

          <span
            className={`navbar-link${active === 'inbox' ? ' navbar-link-active' : ''}`}
            onClick={() => onSelect('inbox')}
          >
            Inbox
          </span>
        </div>

        <div className="navbar-right">
          <span
            className={`navbar-account${active === 'studentinformation' ? ' navbar-link-active' : ''}`}
            onClick={() => onSelect('studentinformation')}
          >
            Account
          </span>

          <span
            className="navbar-logout"
            onClick={onLogout}
          >
            Logout
          </span>
        </div>
      </div>
    </nav>
  );
}