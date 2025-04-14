import Navbar from "./Navbar"

import { useState } from "react"

function LandingPage({ isDarkMode, toggleTheme }) {
  const [budget, setBudget] = useState(1500);
  const [useCase, setUseCase] = useState('Gaming');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleStartBuilding = () => {
    console.log('Starting to build with budget:', budget, 'for use case:', useCase);
    // Add your build logic here
  };

  return (
    <main className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--primary)] dark:text-[var(--text-primary)] transition-colors duration-300">
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Hero Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 opacity-0 animate-fade-in">
          Build Your Dream PC with <span className="text-[var(--accent)]">AI</span>
        </h1>
        <p className="text-lg md:text-xl max-w-3xl text-gray-500 dark:text-gray-400 mb-12 opacity-0 animate-fade-in delay-200">
          Our intelligent system recommends the perfect components based on your budget, use case, and preferences — all
          powered by advanced AI.
        </p>
      </section>

      {/* Builder Section */}
      <section className="px-4 md:px-8 lg:px-16 py-8 flex flex-col md:flex-row gap-8 max-w-7xl mx-auto w-full">
        {/* PC Builder Form */}
        <div className="flex-1 rounded-xl shadow-md p-6 transition-all duration-300 bg-[var(--card-background)] opacity-0 animate-slide-up">
          <h2 className="text-2xl font-bold mb-6">Start Building Your Custom PC</h2>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="font-medium">Your Budget</label>
              <span className="text-[var(--accent)] font-bold">₹{budget}</span>
            </div>
            <input
              type="range"
              min="40000"
              max="500000"
              step="2000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
            />
            <div className="flex justify-between mt-1 text-sm text-gray-500 dark:text-gray-400">
              <span>₹40000</span>
              <span>₹500000</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="font-medium block mb-2">Primary Use Case</label>
            <div className="relative">
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 transition-all duration-300 bg-[var(--card-background)] appearance-none pr-8"
              >
                <option>Gaming</option>
                <option>Video Editing</option>
                <option>3D Rendering</option>
                <option>Office Work</option>
                <option>Streaming</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-[var(--accent)] flex items-center text-sm font-medium"
            >
              <span className="mr-1">{showAdvanced ? "▼" : "►"}</span>
              Show advanced preferences
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4 opacity-0 animate-fade-in">
                <div>
                  <label className="font-medium block mb-2">Preferred CPU Brand</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input type="radio" name="cpu" className="mr-2 accent-[var(--accent)]" defaultChecked />
                      <span>No Preference</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="cpu" className="mr-2 accent-[var(--accent)]" />
                      <span>AMD</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="cpu" className="mr-2 accent-[var(--accent)]" />
                      <span>Intel</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="font-medium block mb-2">Preferred GPU Brand</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input type="radio" name="gpu" className="mr-2 accent-[var(--accent)]" defaultChecked />
                      <span>No Preference</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="gpu" className="mr-2 accent-[var(--accent)]" />
                      <span>NVIDIA</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="gpu" className="mr-2 accent-[var(--accent)]" />
                      <span>AMD</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="font-medium block mb-2">Resolution</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input type="radio" name="resolution" className="mr-2 accent-[var(--accent)]" defaultChecked />
                      <span>HD(1080p)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="resolution" className="mr-2 accent-[var(--accent)]" />
                      <span>2K(1440p)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="resolution" className="mr-2 accent-[var(--accent)]" />
                      <span>4K(2160p)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="font-medium block mb-2">Extra peripherals</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input type="checkbox" name="peripherals" className="mr-2 accent-[var(--accent)]" />
                      <span>Monitor</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" name="peripherals" className="mr-2 accent-[var(--accent)]" />
                      <span>Mouse</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" name="peripherals" className="mr-2 accent-[var(--accent)]" />
                      <span>Keboard</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleStartBuilding}
            className="bg-[var(--accent)] hover:bg-[#f65e4a] text-white font-medium py-2 px-4 rounded-md transition-all duration-300 w-full flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Start Building
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            Our AI will analyze thousands of components to find your perfect build
          </p>
        </div>

        {/* Saved Configurations */}
        <div className="flex-1 rounded-xl shadow-md p-6 transition-all duration-300 bg-[var(--card-background)] opacity-0 animate-slide-up delay-200">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#102542] rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[var(--accent)]"
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
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">Login to Access Your Builds</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
            Sign in to save your custom PC configurations and access them from anywhere
          </p>

          <a href="/login" className="bg-[var(--accent)] hover:bg-[#f65e4a] text-white font-medium py-2 px-4 rounded-md transition-all duration-300 w-full block text-center mb-8">
            Login / Sign Up
          </a>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-2">
            <h3 className="text-lg font-medium mb-4">Example Configuration</h3>

            <div className="bg-[var(--config-bg)] rounded-lg p-4 mb-4 text-[var(--text-primary)]">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-[var(--text-primary)]">Gaming Beast</h4>
                <span className="text-sm text-[var(--text-secondary)]">$1500 • Gaming</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-[var(--text-secondary)]">CPU:</p>
                  <p className="font-medium text-[var(--text-primary)]">AMD Ryzen 7</p>
                </div>
                <div>
                  <p className="text-[var(--text-secondary)]">GPU:</p>
                  <p className="font-medium text-[var(--text-primary)]">NVIDIA RTX 3070</p>
                </div>
                <div>
                  <p className="text-[var(--text-secondary)]">RAM:</p>
                  <p className="font-medium text-[var(--text-primary)]">32GB DDR4</p>
                </div>
                <div>
                  <p className="text-[var(--text-secondary)]">Storage:</p>
                  <p className="font-medium text-[var(--text-primary)]">1TB NVMe SSD</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 md:px-8 lg:px-16 py-16 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose AI-Powered PC Builder?</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="rounded-xl shadow-md p-6 transition-all duration-300 bg-[var(--card-background)] flex flex-col items-center text-center opacity-0 animate-fade-in">
            <div className="w-12 h-12 bg-[var(--config-bg)] rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">AI-Powered Recommendations</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Our advanced AI analyzes thousands of components to recommend the perfect combination for your needs and
              budget.
            </p>
          </div>

          <div className="rounded-xl shadow-md p-6 transition-all duration-300 bg-[var(--card-background)] flex flex-col items-center text-center opacity-0 animate-fade-in delay-300">
            <div className="w-12 h-12 bg-[var(--config-bg)] rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Compatibility Guaranteed</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Every build is checked for component compatibility, ensuring your system works perfectly from day one.
            </p>
          </div>

          <div className="rounded-xl shadow-md p-6 transition-all duration-300 bg-[var(--card-background)] flex flex-col items-center text-center opacity-0 animate-fade-in delay-400">
            <div className="w-12 h-12 bg-[var(--config-bg)] rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Budget Optimization</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Get the best possible performance for your specific budget, with options to prioritize the components that
              matter most to you.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-4 md:px-8 lg:px-16 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
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
            <span className="font-bold">AI-Powered-PC-Builder</span>
          </div>

          <div className="flex space-x-6">
            <a href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-[var(--accent)] transition-colors">
              Terms
            </a>
            <a href="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-[var(--accent)] transition-colors">
              Privacy
            </a>
            <a href="/contact" className="text-gray-500 dark:text-gray-400 hover:text-[var(--accent)] transition-colors">
              Contact
            </a>
          </div>

          <div className="mt-4 md:mt-0 text-sm text-gray-500 dark:text-gray-400">
            © 2025 AI-Powered-PC-Builder. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}

export default LandingPage