import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from './Dashboard';

const MyPolls = () => {
  const [myPolls, setMyPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'expired'

  useEffect(() => {
    // Fetch user's polls from local storage
    const fetchMyPolls = () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        const savedPolls = localStorage.getItem('userPolls');
        const parsedPolls = savedPolls ? JSON.parse(savedPolls) : [];
        // Filter polls by user ID in a real app
        setMyPolls(parsedPolls);
      } catch (error) {
        console.error('Error fetching polls:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyPolls();
  }, []);

  const deletePoll = (pollId) => {
    // Remove poll from user's polls
    const updatedPolls = myPolls.filter(poll => poll.id !== pollId);
    setMyPolls(updatedPolls);
    localStorage.setItem('userPolls', JSON.stringify(updatedPolls));
    
    // Also remove from all polls
    const allPolls = JSON.parse(localStorage.getItem('polls') || '[]');
    const updatedAllPolls = allPolls.filter(poll => poll.id !== pollId);
    localStorage.setItem('polls', JSON.stringify(updatedAllPolls));
  };

  const getFilteredPolls = () => {
    const now = new Date();
    
    switch (filterStatus) {
      case 'active':
        return myPolls.filter(poll => !poll.expiresAt || new Date(poll.expiresAt) > now);
      case 'expired':
        return myPolls.filter(poll => poll.expiresAt && new Date(poll.expiresAt) <= now);
      default:
        return myPolls;
    }
  };

  const getPollStatus = (poll) => {
    if (!poll.expiresAt) return 'Active';
    
    const now = new Date();
    const expiryDate = new Date(poll.expiresAt);
    
    if (expiryDate <= now) {
      return 'Expired';
    } else {
      return 'Active';
    }
  };

  const filteredPolls = getFilteredPolls();

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Polls</h1>
          <Link 
            to="/createpolls" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Poll
          </Link>
        </div>
        
        {/* Filter tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setFilterStatus('all')}
            className={`py-2 px-4 font-medium ${filterStatus === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`py-2 px-4 font-medium ${filterStatus === 'active' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterStatus('expired')}
            className={`py-2 px-4 font-medium ${filterStatus === 'expired' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Expired
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredPolls.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No polls found</h3>
            <p className="mt-2 text-gray-500">
              {filterStatus === 'all' 
                ? "You haven't created any polls yet." 
                : `You don't have any ${filterStatus} polls.`}
            </p>
            {filterStatus !== 'all' && (
              <button 
                onClick={() => setFilterStatus('all')} 
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                View all polls
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPolls.map(poll => {
              const status = getPollStatus(poll);
              return (
                <div key={poll.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{poll.title}</h3>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Created {new Date(poll.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex">
                      <button 
                        className="text-gray-400 hover:text-blue-500 mr-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => deletePoll(poll.id)}
                        className="text-gray-400 hover:text-red-500"
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

                  {/* Poll stats */}
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-lg font-semibold text-blue-600">{poll.totalVotes}</p>
                      <p className="text-xs text-gray-500">Total Votes</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-lg font-semibold text-blue-600">{poll.options.length}</p>
                      <p className="text-xs text-gray-500">Options</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-lg font-semibold text-blue-600">{poll.voters?.length || 0}</p>
                      <p className="text-xs text-gray-500">Participants</p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      View Results
                    </button>
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

export default MyPolls;