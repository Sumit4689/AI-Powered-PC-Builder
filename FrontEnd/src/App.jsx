import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LoginSignup from "./components/loginSignup"
import LandingPage from "./components/landingPage"
import './index.css'
import './styles/theme.css'

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
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
        <Route path="/login" element={<LoginSignup isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
        <Route path="/how-it-works" element={<Navigate to="/" />} /> {/* Placeholder - create actual component later */}
        <Route path="/features" element={<Navigate to="/" />} /> {/* Placeholder - create actual component later */}
        <Route path="/pricing" element={<Navigate to="/" />} /> {/* Placeholder - create actual component later */}
        <Route path="*" element={<Navigate to="/" />} /> {/* Handle 404 cases */}
      </Routes>
    </Router>
  )
}

export default App
