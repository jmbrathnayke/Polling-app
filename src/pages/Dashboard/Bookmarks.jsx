import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from './Dashboard';

const Bookmarks = () => {
  const [bookmarkedPolls, setBookmarkedPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch bookmarked polls from local storage
    const fetchBookmarkedPolls = () => {
      try {
        const savedBookmarks = localStorage.getItem('bookmarkedPolls');
        const parsedBookmarks = savedBookmarks ? JSON.parse(savedBookmarks) : [];
        setBookmarkedPolls(parsedBookmarks);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarkedPolls();
  }, []);

  const removeFromBookmarks = (pollId) => {
    if (!confirm('Are you sure you want to remove this poll from your bookmarks?')) {
      return;
    }
    
    try {
      const updatedBookmarks = bookmarkedPolls.filter(poll => poll.id !== pollId);
      setBookmarkedPolls(updatedBookmarks);
      localStorage.setItem('bookmarkedPolls', JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error('Error removing bookmark:', error);
      alert('Failed to remove bookmark. Please try again.');
    }
  };

  const clearAllBookmarks = () => {
    if (!confirm('Are you sure you want to remove all bookmarks? This action cannot be undone.')) {
      return;
    }
    
    try {
      setBookmarkedPolls([]);
      localStorage.setItem('bookmarkedPolls', JSON.stringify([]));
    } catch (error) {
      console.error('Error clearing bookmarks:', error);
      alert('Failed to clear bookmarks. Please try again.');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Bookmarked Polls</h1>
          {bookmarkedPolls.length > 0 && (
            <button 
              onClick={clearAllBookmarks}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm"
            >
              Clear All Bookmarks
            </button>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : bookmarkedPolls.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No bookmarked polls</h3>
            <p className="mt-2 text-gray-500">You haven't bookmarked any polls yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarkedPolls.map(poll => (
              <div key={poll.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{poll.title}</h3>
                    <p className="text-sm text-gray-500">Created by {poll.author} • {new Date(poll.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button 
                    onClick={() => removeFromBookmarks(poll.id)}
                    className="text-gray-400 hover:text-red-500 transition"
                    title="Remove from bookmarks"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="mt-4">
                  <p className="text-gray-700">{poll.description}</p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">
                    {poll.totalVotes} votes • {poll.options.length} options
                    {poll.expiresAt && (
                      <span> • Expires: {new Date(poll.expiresAt).toLocaleDateString()}</span>
                    )}
                  </div>
                  <Link 
                    to={`/poll/${poll.id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    View Poll
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Bookmarks;