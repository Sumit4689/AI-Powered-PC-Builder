import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu';

function Navbar({ isDarkMode, toggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-[var(--card-background)] shadow-md py-4 px-4 md:px-6 lg:px-16 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center">
          <svg
            className="w-6 h-6 text-[var(--accent)] mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
            ></path>
          </svg>
          <span className="font-bold text-lg text-[var(--text-primary)]">AI-PC-Builder</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
            Home
          </Link>
          <Link to="/how-it-works" className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
            How it Works
          </Link>
          <Link to="/benchmarks" className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
            Benchmarks
          </Link>
          {user && (
            <Link to="/saved-builds" className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
              Saved Builds
            </Link>
          )}
          <button
            onClick={toggleTheme}
            className="relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
            style={{ backgroundColor: isDarkMode ? 'var(--primary, #1f2937)' : 'var(--background-secondary, #e5e7eb)' }}
            aria-label="Toggle theme"
          >
            <span className="sr-only">Toggle dark mode</span>
            <span 
              className={`
                pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}
              `}
            >
              {/* Sun icon */}
              <span 
                className={`
                  absolute inset-0 flex h-full w-full items-center justify-center transition-opacity
                  ${isDarkMode ? 'opacity-0' : 'opacity-100'}
                `}
              >
                <svg className="h-3 w-3 text-[var(--accent)]" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="5" />
                </svg>
              </span>
              
              {/* Moon icon */}
              <span 
                className={`
                  absolute inset-0 flex h-full w-full items-center justify-center transition-opacity
                  ${isDarkMode ? 'opacity-100' : 'opacity-0'}
                `}
              >
                <svg className="h-3 w-3 text-[var(--accent)]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              </span>
            </span>
          </button>
          
          {user ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <Link
              to="/login"
              className="bg-[var(--accent)] hover:bg-[#f65e4a] text-white px-4 py-2 rounded-md transition-colors"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Navigation Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-[var(--text-primary)] rounded-lg hover:bg-[var(--background-secondary)] transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-[var(--card-background)] border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col p-4 space-y-4">
            <Link
              to="/"
              className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/how-it-works"
              className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              How it Works
            </Link>
            <Link
              to="/benchmarks"
              className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
            >
              Benchmarks
            </Link>

            {user && (
              <Link
                to="/saved-builds"
                className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Saved Builds
              </Link>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-primary)]">Dark Mode</span>
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                style={{ backgroundColor: isDarkMode ? 'var(--primary, #1f2937)' : 'var(--background-secondary, #e5e7eb)' }}
                aria-label="Toggle theme"
              >
                <span className="sr-only">Toggle dark mode</span>
                <span 
                  className={`
                    pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                    ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}
                  `}
                >
                  {/* Sun icon */}
                  <span 
                    className={`
                      absolute inset-0 flex h-full w-full items-center justify-center transition-opacity
                      ${isDarkMode ? 'opacity-0' : 'opacity-100'}
                    `}
                  >
                    <svg className="h-3 w-3 text-[var(--accent)]" fill="currentColor" viewBox="0 0 20 20">
                      <circle cx="10" cy="10" r="5" />
                    </svg>
                  </span>
                  
                  {/* Moon icon */}
                  <span 
                    className={`
                      absolute inset-0 flex h-full w-full items-center justify-center transition-opacity
                      ${isDarkMode ? 'opacity-100' : 'opacity-0'}
                    `}
                  >
                    <svg className="h-3 w-3 text-[var(--accent)]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  </span>
                </span>
              </button>
            </div>
            
            {user ? (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[var(--accent)] rounded-full flex items-center justify-center text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-[var(--text-primary)]">{user.name}</span>
                </div>
                <Link
                  to="/profile"
                  className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-red-500 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-[var(--accent)] hover:bg-[#f65e4a] text-white px-4 py-2 rounded-md transition-colors inline-block text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
