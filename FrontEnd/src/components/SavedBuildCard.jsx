import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SavedBuildCard({ build, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const viewBuild = async () => {
    try {
      const response = await fetch(`http://localhost:11822/builds/${build._id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch build details");
      }
      
      const buildData = await response.json();
      navigate('/build-result', { state: { buildRecommendation: buildData } });
    } catch (error) {
      console.error("Error fetching build details:", error);
      alert("Failed to load build details. Please try again.");
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent triggering viewBuild

    if (!window.confirm("Are you sure you want to delete this build?")) return;

    try {
      setDeleting(true);
      const response = await fetch(`http://localhost:11822/builds/${build._id}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete build");
      }

      if (onDelete) onDelete(build._id);
    } catch (error) {
      console.error("Error deleting build:", error);
      alert("Failed to delete build. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div 
      className="bg-[var(--config-bg)] rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow relative flex flex-col gap-3"
      onClick={viewBuild}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h5 className="font-bold text-[var(--text-primary)] truncate pr-6">{build.buildName}</h5>
        <span className="text-xs text-[var(--text-secondary)] whitespace-nowrap">
          ₹{build.totalCost.toLocaleString()} • {build.useCase || ''}
        </span>
      </div>

      {/* Components Section */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        {build.components
          .filter(c => ['CPU', 'GPU', 'RAM', 'Storage'].includes(c.type))
          .slice(0, 4)
          .map((component, idx) => (
            <div key={idx} className="flex flex-col">
              <p className="text-[var(--text-secondary)]">{component.type}:</p>
              <p className="font-medium text-[var(--text-primary)] truncate">{component.name}</p>
            </div>
          ))
        }
      </div>

      {/* Footer Section */}
      <div className="flex justify-between items-center text-xs text-[var(--text-secondary)]">
        <span>{new Date(build.createdAt).toLocaleDateString()}</span>
        <button 
          className="text-gray-400 hover:text-red-500 p-1"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default SavedBuildCard;