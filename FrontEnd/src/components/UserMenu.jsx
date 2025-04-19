import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
      >
        <div className="w-8 h-8 bg-[var(--accent)] rounded-full flex items-center justify-center text-white">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="hidden md:block">{user.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[var(--card-background)] rounded-md shadow-lg py-1 z-10">
          <a
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Profile
          </a>
          <a
            href="/saved-builds"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Saved Builds
          </a>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;