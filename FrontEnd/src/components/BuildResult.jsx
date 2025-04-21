import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function BuildResult({ isDarkMode, toggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { buildRecommendation } = location.state || { buildRecommendation: null };
  const [activeTab, setActiveTab] = useState('components');

  // If no build recommendation, redirect back to the landing page
  if (!buildRecommendation) {
    navigate('/');
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--primary)] dark:text-[var(--text-primary)] transition-colors duration-300">
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button 
            onClick={() => navigate('/')} 
            className="mb-6 flex items-center text-[var(--accent)] hover:underline"
          >
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
            Back to Builder
          </button>

          {/* Main content */}
          <div className="bg-[var(--card-background)] rounded-lg shadow-md overflow-hidden">
            {/* Build summary header */}
            <div className="bg-[var(--accent)] text-white p-6">
              <h1 className="text-2xl font-bold">Your Custom PC Build</h1>
              <p className="mt-2">{buildRecommendation.summary}</p>
              <div className="mt-4 bg-white bg-opacity-20 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Cost:</span>
                  <span className="font-bold text-xl">₹{buildRecommendation.totalCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Tab navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('components')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === 'components'
                      ? 'border-[var(--accent)] text-[var(--accent)]'
                      : 'border-transparent text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Components
                </button>
                <button
                  onClick={() => setActiveTab('compatibility')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === 'compatibility'
                      ? 'border-[var(--accent)] text-[var(--accent)]'
                      : 'border-transparent text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Compatibility
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === 'reviews'
                      ? 'border-[var(--accent)] text-[var(--accent)]'
                      : 'border-transparent text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Video Reviews
                </button>
              </nav>
            </div>

            {/* Tab content */}
            <div className="p-6">
              {activeTab === 'components' && (
                <div className="space-y-6">
                  {buildRecommendation.components.map((component, index) => (
                    <div 
                      key={index} 
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded-md mb-2">
                            {component.type}
                          </span>
                          <h3 className="text-lg font-semibold">{component.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {component.specs}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-[var(--accent)]">
                            ₹{component.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <h4 className="text-sm font-medium mb-1">Why this component?</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {component.rationale}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'compatibility' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Compatibility Check</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {buildRecommendation.compatibilityNotes}
                  </p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-8">
                  {buildRecommendation.youtubeReviews && buildRecommendation.youtubeReviews.length > 0 ? (
                    buildRecommendation.youtubeReviews.map((review, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800">
                          <h3 className="font-medium">{review.component} Review</h3>
                        </div>
                        <div className="aspect-w-16 aspect-h-9">
                          <iframe
                            src={`https://www.youtube.com/embed/${review.videoId}`}
                            title={review.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-64"
                          ></iframe>
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium text-sm mb-1">{review.title}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{review.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500 dark:text-gray-400">No video reviews available</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Save & Share buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button className="bg-[var(--accent)] text-white py-2 px-4 rounded-md hover:bg-[var(--accent-hover)] transition-colors flex-1">
              Save This Build
            </button>
            <button className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex-1">
              Share This Build
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default BuildResult;