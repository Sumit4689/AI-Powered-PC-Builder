import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import SavedBuildCard from './SavedBuildCard';
import { useAuth } from '../context/AuthContext';
import BuildService from '../services/BuildService';

function SavedBuilds({ isDarkMode, toggleTheme }) {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBuilds = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Use the BuildService to fetch user builds
        const data = await BuildService.getUserBuilds();
        setBuilds(data);
      } catch (err) {
        console.error('Error fetching builds:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBuilds();
  }, [user, navigate]);

  const handleDeleteBuild = (buildId) => {
    setBuilds(builds.filter(build => build._id !== buildId));
  };

  const viewSavedBuild = async (build) => {
    try {
      navigate('/build-result', { 
        state: { 
          buildRecommendation: build,
          useCase: build.useCase, // Pass the saved use case
          savedBuild: {
            buildName: build.buildName // Pass the saved build name
          }
        } 
      });
    } catch (error) {
      console.error('Error viewing build:', error);
      setError('Error viewing build details');
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--primary)] dark:text-[var(--text-primary)] transition-colors duration-300">
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Saved PC Builds</h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        ) : builds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {builds.map((build) => (
              <SavedBuildCard key={build._id} build={build} onDelete={handleDeleteBuild} />
            ))}
          </div>
        ) : (
          <div className="bg-[var(--card-background)] rounded-lg p-20 text-center">
            <svg 
              className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="1" 
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">You don't have any saved builds yet.</p>
            <button 
              onClick={() => navigate('/')} 
              className="bg-[var(--accent)] text-white py-2 px-4 rounded-md hover:bg-[var(--accent-hover)] transition-colors inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Create a New Build
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default SavedBuilds;