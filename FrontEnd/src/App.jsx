import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LoginSignup from "./components/loginSignup"
import LandingPage from "./components/landingPage"
import BuildResult from "./components/BuildResult"
import SavedBuilds from "./components/SavedBuilds"
import HowItWorks from './components/HowItWorks';
import ProtectedRoute from "./components/ProtectedRoute"
import './index.css'
import './styles/theme.css'
import { AuthProvider } from './context/AuthContext';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)").matches
    const storedTheme = localStorage.getItem("theme")
    const initialTheme = storedTheme || (darkModePreference ? "dark" : "light")
    
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark")
      setIsDarkMode(true)
    }
  }, [])

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
    setIsDarkMode(!isDarkMode)
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
          <Route path="/login" element={<LoginSignup isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
          <Route 
            path="/how-it-works" 
            element={<HowItWorks isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} 
          />
          <Route path="/build-result" element={<BuildResult isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
          <Route 
            path="/saved-builds" 
            element={
              <ProtectedRoute>
                <SavedBuilds isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            } 
          />
          <Route path="/how-it-works" element={<Navigate to="/" />} /> {/* Placeholder - create actual component later */}
          <Route path="/features" element={<Navigate to="/" />} /> {/* Placeholder - create actual component later */}
          <Route path="/pricing" element={<Navigate to="/" />} /> {/* Placeholder - create actual component later */}
          <Route path="/profile" element={<Profile isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} /> {/* Handle 404 cases */}
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
