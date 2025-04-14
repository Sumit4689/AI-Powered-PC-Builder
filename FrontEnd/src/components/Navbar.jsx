import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";

export default function Navbar({ isDarkMode, toggleTheme }) {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="bg-[var(--card-background)] border-b border-gray-200 dark:border-[var(--primary)] sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg
                className="w-6 h-6 text-[#f87060] mr-2"
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
              <span className="font-bold text-[var(--text-primary)]">AI-Powered-PC-Builder</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/how-it-works"
              className="text-[var(--primary)] dark:text-[var(--text-primary)] hover:text-orange-500 dark:hover:text-orange-500 transition-colors"
            >
              How It Works
            </Link>
            <Link
              to="/features"
              className="text-[var(--primary)] dark:text-[var(--text-primary)] hover:text-orange-500 dark:hover:text-orange-500 transition-colors"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="text-[var(--primary)] dark:text-[var(--text-primary)] hover:text-orange-500 dark:hover:text-orange-500 transition-colors"
            >
              Pricing
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {mounted && isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link to="/login" className="bg-[var(--accent)] hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-all duration-300">
              Login / Signup
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 mr-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
              aria-label="Toggle theme"
            >
              {mounted && isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--background)] border-b border-gray-200 dark:border-[var(--primary)]" style={{ animation: "fadeIn 0.5s ease-in-out" }}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/how-it-works"
              className="block px-3 py-2 rounded-md text-base font-medium text-[var(--primary)] dark:text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              to="/features"
              className="block px-3 py-2 rounded-md text-base font-medium text-[var(--primary)] dark:text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="block px-3 py-2 rounded-md text-base font-medium text-[var(--primary)] dark:text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium bg-orange-500 text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login / Signup
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
