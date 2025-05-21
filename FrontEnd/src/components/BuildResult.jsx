import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext'; // Import auth context

function BuildResult({ isDarkMode, toggleTheme }) {
  const { user } = useAuth(); // Get user from auth context
  const location = useLocation();
  const navigate = useNavigate();

  console.log("BuildResult received location state:", location.state); // Log received state

  const { buildRecommendation, useCase: locationUseCase } = location.state || { 
    buildRecommendation: null,
    useCase: 'Custom'
  };

  // Log the extracted values
  console.log("Extracted buildRecommendation:", buildRecommendation);
  console.log("Extracted useCase:", locationUseCase);

  const [activeTab, setActiveTab] = useState('components');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [error, setError] = useState('');

  // Update the buildName initialization to use the saved build name if available
  const [buildName, setBuildName] = useState(() => {
    // First check if it's a saved build from buildRecommendation
    if (buildRecommendation?.buildName) {
      return buildRecommendation.buildName;
    }
    
    // Then check if viewing from saved builds
    if (location.state?.savedBuild?.buildName) {
      return location.state.savedBuild.buildName;
    }
  
    // For new builds, format the name based on use case
    const useCase = location.state?.useCase;
    if (!useCase) return 'Custom Build';
  
    const formattedUseCase = useCase
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    return `${formattedUseCase} Build`;
  });

  // Add this after the buildName state initialization
  console.log("Build name initialized as:", buildName);
  console.log("BuildRecommendation build name:", buildRecommendation?.buildName);

  // Modify the redirect logic
  if (!buildRecommendation) {
    return (
      <main className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--primary)] dark:text-[var(--text-primary)] transition-colors duration-300">
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-red-700 dark:text-red-400">
                Failed to load build data. Please try again.
              </p>
            </div>
            <button 
              onClick={() => navigate('/saved-builds')} 
              className="mt-4 text-[var(--accent)] hover:underline"
            >
              ← Back to Saved Builds
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Update handleSaveBuild to include logging:
  const handleSaveBuild = async () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    try {
      setSaving(true);
      setSaveError('');

      const useCase = location.state?.useCase;
      console.log("UseCase before saving:", useCase); // Log useCase before saving

      const payload = {
        buildName: buildName,
        summary: buildRecommendation.summary,
        components: buildRecommendation.components,
        totalCost: buildRecommendation.totalCost,
        compatibilityNotes: buildRecommendation.compatibilityNotes,
        reviewComponents: buildRecommendation.reviewComponents || [],
        youtubeReviews: buildRecommendation.youtubeReviews || [],
        useCase: useCase
      };

      console.log("Saving build with payload:", payload); // Log save payload

      const response = await fetch("http://localhost:11822/builds/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log("Save response:", data); // Log save response

      if (!response.ok) {
        throw new Error(data.message || "Failed to save build");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving build:", error);
      setSaveError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Set document properties
      doc.setProperties({
        title: `${buildName} - PC Build Quotation`,
        author: 'AI-Powered PC Builder',
        subject: 'Custom PC Build Configuration',
        keywords: 'PC Build, Custom Configuration'
      });
      
      // Add logo/header styling
      doc.setFillColor(246, 94, 74); // Your accent color
      doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
      
      // Add header
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('PC Build Quotation', 20, 25);
      
      // Reset text color for content
      doc.setTextColor(33, 33, 33);
      
      // Add build details
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Build Details', 20, 50);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const buildDetails = [
        `Build Name: ${buildName}`,
        `Use Case: ${location.state?.useCase || buildRecommendation.useCase || 'Custom'}`,
        `Total Cost: ₹${buildRecommendation.totalCost.toLocaleString()}`,
        `Date: ${new Date().toLocaleDateString('en-IN', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })}`
      ];
      
      buildDetails.forEach((detail, index) => {
        doc.text(detail, 20, 65 + (index * 10));
      });
      
      // Add summary section
      doc.setFont('helvetica', 'bold');
      doc.text('Build Summary', 20, 110);
      doc.setFont('helvetica', 'normal');
      const splitSummary = doc.splitTextToSize(buildRecommendation.summary, 170);
      doc.text(splitSummary, 20, 120);

      // Add components table with improved styling
      autoTable(doc, {
        startY: 140,
        head: [['Component', 'Name', 'Specifications', 'Price']],
        body: buildRecommendation.components.map(component => [
          component.type,
          component.name,
          component.specs,
          `₹${component.price.toLocaleString()}`
        ]),
        theme: 'striped',
        headStyles: {
          fillColor: [246, 94, 74],
          fontSize: 12,
          fontStyle: 'bold',
          halign: 'left'
        },
        bodyStyles: {
          fontSize: 10,
          lineColor: [220, 220, 220]
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 40 },
          2: { cellWidth: 'auto' },
          3: { cellWidth: 30, halign: 'right' }
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        }
      });

      // Add compatibility notes
      const finalY = doc.lastAutoTable.finalY + 20;
      doc.setFont('helvetica', 'bold');
      doc.text('Compatibility Notes', 20, finalY);
      doc.setFont('helvetica', 'normal');
      const splitNotes = doc.splitTextToSize(buildRecommendation.compatibilityNotes, 170);
      doc.text(splitNotes, 20, finalY + 10);

      // Add footer with page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageHeight = doc.internal.pageSize.height;
        
        // Add footer box
        doc.setFillColor(246, 94, 74, 0.1);
        doc.rect(0, pageHeight - 25, doc.internal.pageSize.width, 25, 'F');
        
        // Add footer text
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Generated by AI-Powered PC Builder', 20, pageHeight - 10);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 40, pageHeight - 10);
      }

      // Save the PDF
      const fileName = `${buildName.replace(/\s+/g, '_')}_PC_Build_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF');
    }
  };

  // Add these options to handleExportPDF if you want to customize further
  const customizePDF = (doc) => {
    // Add custom font
    doc.setFont('helvetica');
    
    // Add custom colors
    doc.setTextColor(33, 33, 33);
    
    // Add border to pages
    doc.rect(10, 10, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 20);
    
    // Add page numbers
    const pages = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.text(`Page ${i} of ${pages}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    }
  };

  // Replace the share button with export button
  const ExportButton = () => (
    <button 
      onClick={handleExportPDF}
      className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex-1 flex items-center justify-center"
    >
      <svg 
        className="w-5 h-5 mr-1" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Export Build
    </button>
  );

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
                  <span className="font-medium text-[var(--primary)] dark:text-[var(--primary)]">Total Cost:</span>
                  <span className="font-bold text-xl text-[var(--primary)] dark:text-[var(--primary)]">₹{buildRecommendation.totalCost.toLocaleString()}</span>
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
          <div className="mt-6">
            {/* Build name input for saving */}
            {user && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Build Name
                </label>
                <input
                  type="text"
                  value={buildName}
                  onChange={(e) => setBuildName(e.target.value)}
                  className="border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 w-full bg-[var(--card-background)] text-[var(--text-primary)]"
                  placeholder="Enter a name for your build"
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleSaveBuild}
                disabled={saving}
                className={`bg-[var(--accent)] text-white py-2 px-4 rounded-md hover:bg-[var(--accent-hover)] transition-colors flex-1 flex items-center justify-center ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                    </svg>
                    Save This Build
                  </>
                )}
              </button>
              <ExportButton />
            </div>
          </div>

          {/* Success message */}
          {saveSuccess && (
            <div className="mt-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Build saved successfully! You can view it in your saved builds.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {saveError && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    {saveError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Not logged in message */}
          {!user && (
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <span className="font-medium">Note:</span> Log in to save this build to your account.
                <a href="/login" className="ml-2 underline font-medium">
                  Login now
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default BuildResult;