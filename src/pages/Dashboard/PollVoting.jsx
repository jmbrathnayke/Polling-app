import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from './Dashboard';

const PollVoting = () => {
  const { id: pollId } = useParams(); // Extract 'id' from URL params and rename it to 'pollId'
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchPoll = () => {
      console.log('Current URL:', window.location.href); // Debug
      console.log('Fetching poll with ID:', pollId); // Debug
      try {
        const allPolls = JSON.parse(localStorage.getItem('polls') || '[]');
        console.log('All polls from localStorage:', allPolls); // Debug
        console.log('All poll IDs:', allPolls.map(p => p.id)); // Debug
        const foundPoll = allPolls.find(p => p.id === pollId);
        console.log('Found poll:', foundPoll); // Debug
        
        if (!foundPoll) {
          console.log('Poll not found, staying on error page instead of redirecting'); // Debug
          // Don't redirect, just show the error page
          return;
        }

        // Check if user has already voted
        const userData = JSON.parse(localStorage.getItem('user'));
        const userId = userData?.id;
        const userHasVoted = foundPoll.voters && foundPoll.voters.includes(userId);
        
        setPoll(foundPoll);
        setHasVoted(userHasVoted);
        setShowResults(userHasVoted);
        console.log('Poll loaded successfully:', foundPoll.title); // Debug
      } catch (error) {
        console.error('Error fetching poll:', error);
        // Don't redirect, just show error page
      } finally {
        setIsLoading(false);
      }
    };

    if (pollId) {
      fetchPoll();
    } else {
      console.log('No pollId provided, URL pathname:', window.location.pathname); // Debug
      setIsLoading(false);
    }
  }, [pollId, navigate]);

  const handleOptionChange = (optionIndex) => {
    if (poll.allowMultipleVotes) {
      const newSelectedOptions = [...selectedOptions];
      if (newSelectedOptions.includes(optionIndex)) {
        setSelectedOptions(newSelectedOptions.filter(i => i !== optionIndex));
      } else {
        setSelectedOptions([...newSelectedOptions, optionIndex]);
      }
    } else {
      setSelectedOption(optionIndex);
    }
  };

  const handleSubmitVote = async () => {
    if ((!selectedOption && selectedOption !== 0) && selectedOptions.length === 0) {
      alert('Please select at least one option');
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const userId = userData?.id || `user_${Date.now()}`;

      // Update poll with new vote
      const allPolls = JSON.parse(localStorage.getItem('polls') || '[]');
      const updatedPolls = allPolls.map(p => {
        if (p.id === pollId) {
          const updatedPoll = { ...p };
          
          // Add votes to selected options
          if (poll.allowMultipleVotes) {
            selectedOptions.forEach(optionIndex => {
              updatedPoll.options[optionIndex].votes += 1;
              updatedPoll.totalVotes += 1;
            });
          } else {
            updatedPoll.options[selectedOption].votes += 1;
            updatedPoll.totalVotes += 1;
          }

          // Add user to voters list
          if (!updatedPoll.voters) {
            updatedPoll.voters = [];
          }
          updatedPoll.voters.push(userId);

          return updatedPoll;
        }
        return p;
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

      // Update local state
      setPoll(updatedPolls.find(p => p.id === pollId));
      setHasVoted(true);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Error submitting vote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculatePercentage = (votes, totalVotes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!poll) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.513.645-6.389 1.766" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Poll not found</h2>
          <p className="text-gray-600 mb-6">The poll you're looking for doesn't exist or may have been removed.</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/publicpolls')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Browse Public Polls
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Go to Dashboard
            </button>
          </div>
          
          {/* Debug info - remove in production */}
          <div className="mt-8 p-4 bg-gray-100 rounded-md text-left max-w-md mx-auto">
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Debug Info:</h4>
            <p className="text-xs text-gray-600">Poll ID: {pollId}</p>
            <p className="text-xs text-gray-600">Available polls: {JSON.parse(localStorage.getItem('polls') || '[]').length}</p>
            <button
              onClick={() => {
                console.log('All polls:', JSON.parse(localStorage.getItem('polls') || '[]'));
                console.log('Looking for poll ID:', pollId);
              }}
              className="mt-2 text-xs bg-gray-200 px-2 py-1 rounded"
            >
              Log polls to console
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          {/* Poll Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{poll.title}</h1>
            <p className="text-gray-600">{poll.description}</p>
            
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span>Created by {poll.author}</span>
              <span className="mx-2">•</span>
              <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
              {poll.expiresAt && (
                <>
                  <span className="mx-2">•</span>
                  <span>Expires: {new Date(poll.expiresAt).toLocaleDateString()}</span>
                </>
              )}
            </div>
          </div>

          {/* Voting Interface */}
          {!showResults ? (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cast Your Vote</h2>
              
              {poll.allowMultipleVotes && (
                <p className="text-sm text-blue-600 mb-4">
                  ✓ You can select multiple options
                </p>
              )}

              <div className="space-y-3 mb-6">
                {poll.options.map((option, index) => {
                  const inputId = `option-${poll.id}-${index}`;
                  return (
                    <label 
                      key={index}
                      htmlFor={inputId}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type={poll.allowMultipleVotes ? "checkbox" : "radio"}
                        id={inputId}
                        name="pollOption"
                        value={index}
                        checked={poll.allowMultipleVotes 
                          ? selectedOptions.includes(index)
                          : selectedOption === index
                        }
                        onChange={() => handleOptionChange(index)}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-900">{option.text}</span>
                    </label>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmitVote}
                  disabled={isSubmitting || ((!selectedOption && selectedOption !== 0) && selectedOptions.length === 0)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Vote'}
                </button>
                
                <button
                  onClick={() => setShowResults(true)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  View Results
                </button>
              </div>
            </div>
          ) : (
            /* Results View */
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Poll Results</h2>
                {hasVoted && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    ✓ You've voted
                  </span>
                )}
              </div>

              <div className="space-y-4 mb-6">
                {poll.options.map((option, index) => {
                  const percentage = calculatePercentage(option.votes, poll.totalVotes);
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-900 font-medium">{option.text}</span>
                        <div className="text-sm text-gray-600">
                          {option.votes} votes ({percentage}%)
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total votes: {poll.totalVotes}</span>
                  <span>Participants: {poll.voters?.length || 0}</span>
                </div>
              </div>

              {!hasVoted && (
                <button
                  onClick={() => setShowResults(false)}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Back to Voting
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PollVoting;
