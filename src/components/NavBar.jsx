import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await auth.signOut();
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container">
      <a class="navbar-brand" href="#">Library</a>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                to="/post"
                className="nav-link"
                aria-current={pathname === '/post' ? 'page' : undefined}
              >
                Post
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/booking"
                className="nav-link"
                aria-current={pathname === '/booking' ? 'page' : undefined}
              >
                Booking
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/profile"
                className="nav-link"
                aria-current={pathname === '/profile' ? 'page' : undefined}
              >
                Profile
              </Link>
            </li>
          </ul>
          {/* <span class="navbar-text">Navbar text with an inline element</span> */}
          <button onClick={handleLogout} class="btn btn-outline-secondary">
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}
