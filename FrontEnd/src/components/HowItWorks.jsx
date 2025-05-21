import Navbar from './Navbar';

function HowItWorks({ isDarkMode, toggleTheme }) {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] transition-colors duration-300">
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Hero Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">How It Works</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover how our AI-powered system helps you build the perfect PC
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-12 px-4 md:px-8 lg:px-16 bg-[var(--card-background)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Building Your PC in 4 Simple Steps</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-[var(--accent)] rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Set Your Requirements</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Input your budget, primary use case, and preferences for components
              </p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-[var(--accent)] rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our AI analyzes thousands of components to find the perfect combination
              </p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-[var(--accent)] rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Get Recommendations</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Review your custom build with detailed component explanations
              </p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-[var(--accent)] rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Save & Export</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Save your build or export it as a PDF for future reference
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Meet the Team</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-[var(--accent)] rounded-full mb-4 flex items-center justify-center">
                <span className="text-4xl text-white font-bold">S</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Sumit Patil</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Roll No: MCA24056</p>
            </div>

            {/* Team Member 2 */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-[var(--accent)] rounded-full mb-4 flex items-center justify-center">
                <span className="text-4xl text-white font-bold">S</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Roshan Goghare</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Roll No: MCA24063</p>
            </div>

            {/* Team Member 3 */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-[var(--accent)] rounded-full mb-4 flex items-center justify-center">
                <span className="text-4xl text-white font-bold">S</span>
              </div>
              <h3 className="text-xl font-bold mb-2">[Friend's Name]</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Roll No: MCA24055</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Project Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-[var(--card-background)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">About the Project</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            This project was developed as part of our Semester 2 Mini Project at [Your College Name]. 
            Our goal was to create an AI-powered solution that simplifies the PC building process 
            for both beginners and enthusiasts.
          </p>
          <div className="inline-flex items-center text-[var(--accent)]">
            <span className="mr-2">Made with</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
            <span className="ml-2">by Our Team</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HowItWorks;