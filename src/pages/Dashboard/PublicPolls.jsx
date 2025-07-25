import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from './Dashboard';

const PublicPolls = () => {
  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'recent'

  useEffect(() => {
    const fetchPublicPolls = () => {
      try {
        const allPolls = JSON.parse(localStorage.getItem('polls') || '[]');
        const publicPolls = allPolls.filter(poll => poll.isPublic);
        setPolls(publicPolls);
      } catch (error) {
        console.error('Error fetching public polls:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicPolls();
  }, []);

  const getFilteredPolls = () => {
    const now = new Date();
    
    switch (filter) {
      case 'active':
        return polls.filter(poll => !poll.expiresAt || new Date(poll.expiresAt) > now);
      case 'recent':
        return polls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return polls;
    }
  };

  const getPollStatus = (poll) => {
    if (!poll.expiresAt) return 'Active';
    
    const now = new Date();
    const expiryDate = new Date(poll.expiresAt);
    
    return expiryDate <= now ? 'Expired' : 'Active';
  };

  const hasUserVoted = (poll) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const userId = userData?.id;
    return poll.voters && poll.voters.includes(userId);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  const filteredPolls = getFilteredPolls();

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Public Polls</h1>
        </div>

        {/* Filter tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`py-2 px-4 font-medium ${filter === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            All Polls
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`py-2 px-4 font-medium ${filter === 'active' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('recent')}
            className={`py-2 px-4 font-medium ${filter === 'recent' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Recent
          </button>
        </div>

        {filteredPolls.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No public polls found</h3>
            <p className="mt-2 text-gray-500">
              {filter === 'all' 
                ? "No public polls have been created yet." 
                : `No ${filter} polls available.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPolls.map(poll => {
              const status = getPollStatus(poll);
              const userVoted = hasUserVoted(poll);
              
              return (
                <div key={poll.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{poll.title}</h3>
                        <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                          status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {status}
                        </span>
                        {userVoted && (
                          <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            ✓ Voted
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{poll.description}</p>
                      <div className="text-sm text-gray-500">
                        Created by {poll.author} • {new Date(poll.createdAt).toLocaleDateString()}
                        {poll.expiresAt && (
                          <span> • Expires: {new Date(poll.expiresAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Poll Preview */}
                  <div className="mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {poll.options.slice(0, 4).map((option, index) => (
                        <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {option.text}
                        </div>
                      ))}
                      {poll.options.length > 4 && (
                        <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded text-center">
                          +{poll.options.length - 4} more options
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Poll Stats */}
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <span>{poll.totalVotes} votes</span>
                      <span>{poll.options.length} options</span>
                      <span>{poll.voters?.length || 0} participants</span>
                    </div>
                    
                    <Link
                      to={`/poll/${poll.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      {userVoted ? 'View Results' : 'Vote Now'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PublicPolls;
