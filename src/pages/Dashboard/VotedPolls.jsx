import React, { useState, useEffect } from 'react';
import DashboardLayout from './Dashboard';

const VotedPolls = () => {
  const [votedPolls, setVotedPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [isViewingResults, setIsViewingResults] = useState(false);

  useEffect(() => {
    // Fetch voted polls
    const fetchVotedPolls = () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        const userId = userData?.id;
        
        // Get all polls from local storage
        const allPolls = JSON.parse(localStorage.getItem('polls') || '[]');
        
        // Filter for polls where the user has voted
        const userVotedPolls = allPolls.filter(poll => 
          poll.voters && poll.voters.includes(userId)
        );
        
        // Check which polls are bookmarked
        const bookmarkedPolls = JSON.parse(localStorage.getItem('bookmarkedPolls') || '[]');
        const bookmarkedPollIds = bookmarkedPolls.map(poll => poll.id);
        
        // Add isBookmarked flag to each poll
        const pollsWithBookmarkInfo = userVotedPolls.map(poll => ({
          ...poll,
          isBookmarked: bookmarkedPollIds.includes(poll.id)
        }));
        
        setVotedPolls(pollsWithBookmarkInfo);
      } catch (error) {
        console.error('Error fetching voted polls:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVotedPolls();
  }, []);

  const toggleBookmark = (pollId) => {
    // Get bookmarked polls from local storage
    const bookmarkedPolls = JSON.parse(localStorage.getItem('bookmarkedPolls') || '[]');
    
    // Check if poll is already bookmarked
    const isBookmarked = bookmarkedPolls.some(poll => poll.id === pollId);
    
    if (isBookmarked) {
      // Remove from bookmarks
      const updatedBookmarks = bookmarkedPolls.filter(poll => poll.id !== pollId);
      localStorage.setItem('bookmarkedPolls', JSON.stringify(updatedBookmarks));
    } else {
      // Add to bookmarks
      const pollToBookmark = votedPolls.find(poll => poll.id === pollId);
      localStorage.setItem('bookmarkedPolls', JSON.stringify([...bookmarkedPolls, pollToBookmark]));
    }
    
    // Update state to reflect changes
    const updatedPolls = votedPolls.map(poll => {
      if (poll.id === pollId) {
        return { ...poll, isBookmarked: !isBookmarked };
      }
      return poll;
    });
    
    setVotedPolls(updatedPolls);
  };

  const removeVoteFromPoll = (pollId) => {
    if (!confirm('Are you sure you want to remove your vote from this poll? This action cannot be undone.')) {
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const userId = userData?.id;

      // Get all polls
      const allPolls = JSON.parse(localStorage.getItem('polls') || '[]');
      
      // Find the poll and remove user's vote
      const updatedPolls = allPolls.map(poll => {
        if (poll.id === pollId) {
          const updatedPoll = { ...poll };
          
          // Remove user from voters list
          if (updatedPoll.voters) {
            updatedPoll.voters = updatedPoll.voters.filter(voterId => voterId !== userId);
          }
          
          // Note: We can't easily determine which specific options the user voted for
          // In a real app, this would be tracked in the database
          // For now, we'll just remove the user from the voters list
          // The vote counts remain unchanged to prevent data inconsistency
          
          return updatedPoll;
        }
        return poll;
      });

      // Save updated polls
      localStorage.setItem('polls', JSON.stringify(updatedPolls));

      // Update user polls if this is user's own poll
      const userPolls = JSON.parse(localStorage.getItem('userPolls') || '[]');
      const updatedUserPolls = userPolls.map(p => {
        if (p.id === pollId) {
          return updatedPolls.find(up => up.id === pollId);
        }
        return p;
      });
      localStorage.setItem('userPolls', JSON.stringify(updatedUserPolls));

      // Remove from voted polls list
      const updatedVotedPolls = votedPolls.filter(poll => poll.id !== pollId);
      setVotedPolls(updatedVotedPolls);

      // Also remove from bookmarks if it was bookmarked
      const bookmarkedPolls = JSON.parse(localStorage.getItem('bookmarkedPolls') || '[]');
      const updatedBookmarks = bookmarkedPolls.filter(poll => poll.id !== pollId);
      localStorage.setItem('bookmarkedPolls', JSON.stringify(updatedBookmarks));

    } catch (error) {
      console.error('Error removing vote:', error);
      alert('Failed to remove vote. Please try again.');
    }
  };

  const viewPollResults = (poll) => {
    setSelectedPoll(poll);
    setIsViewingResults(true);
  };

  const closeResults = () => {
    setSelectedPoll(null);
    setIsViewingResults(false);
  };

  const calculatePercentage = (votes, totalVotes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Polls You've Voted On</h1>
        
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : votedPolls.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No voted polls</h3>
            <p className="mt-2 text-gray-500">You haven't voted on any polls yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {votedPolls.map(poll => (
              <div key={poll.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{poll.title}</h3>
                    <p className="text-sm text-gray-500">Created by {poll.author} • {new Date(poll.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => toggleBookmark(poll.id)}
                      className={`${poll.isBookmarked ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}`}
                      title={poll.isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => removeVoteFromPoll(poll.id)}
                      className="text-gray-400 hover:text-red-500"
                      title="Remove your vote from this poll"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-700">{poll.description}</p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">
                    {poll.totalVotes} votes • {poll.options.length} options
                  </div>
                  <button 
                    onClick={() => viewPollResults(poll)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    View Results
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Results Modal */}
        {isViewingResults && selectedPoll && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-800">{selectedPoll.title}</h2>
                  <button onClick={closeResults} className="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <p className="text-gray-600 mb-6">{selectedPoll.description}</p>
                
                <div className="space-y-4">
                  {selectedPoll.options.map((option, index) => {
                    const percentage = calculatePercentage(option.votes, selectedPoll.totalVotes);
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">{option.text}</span>
                          <span className="text-gray-700 font-medium">{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-500">{option.votes} votes</div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Total votes: {selectedPoll.totalVotes}</span>
                    <span>
                      {selectedPoll.expiresAt 
                        ? `Expires: ${new Date(selectedPoll.expiresAt).toLocaleDateString()}` 
                        : 'No expiration date'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VotedPolls; 