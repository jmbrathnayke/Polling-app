import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from './Dashboard';
import { createSamplePolls, createSampleUser } from '../../utils/sampleData';

const DashboardHome = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalPolls: 0,
    totalVotes: 0,
    activePolls: 0,
    bookmarkedPolls: 0
  });

  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Calculate statistics
    const calculateStats = () => {
      const userPolls = JSON.parse(localStorage.getItem('userPolls') || '[]');
      const bookmarkedPolls = JSON.parse(localStorage.getItem('bookmarkedPolls') || '[]');
      const allPolls = JSON.parse(localStorage.getItem('polls') || '[]');
      
      const now = new Date();
      const activePolls = userPolls.filter(poll => 
        !poll.expiresAt || new Date(poll.expiresAt) > now
      );

      const totalVotes = userPolls.reduce((total, poll) => total + poll.totalVotes, 0);

      setStats({
        totalPolls: userPolls.length,
        totalVotes: totalVotes,
        activePolls: activePolls.length,
        bookmarkedPolls: bookmarkedPolls.length
      });
    };

    calculateStats();
  }, []);

  const handleCreateSampleData = () => {
    createSampleUser();
    createSamplePolls();
    // Refresh the page to show updated data
    window.location.reload();
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your polls today.
          </p>
          
          {/* Debug button - remove in production */}
          <div className="mt-4 space-x-2">
            <button
              onClick={handleCreateSampleData}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              🔧 Create Sample Data (For Testing)
            </button>
            <Link
              to="/poll/poll_sample_1"
              className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
            >
              🔗 Test Direct Poll Link
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Polls</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPolls}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Votes</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVotes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Active Polls</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.activePolls}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Bookmarks</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.bookmarkedPolls}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/createpolls"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Create New Poll</h3>
                  <p className="text-sm text-gray-500">Start gathering opinions</p>
                </div>
              </Link>

              <Link
                to="/mypolls"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">View My Polls</h3>
                  <p className="text-sm text-gray-500">Manage your polls</p>
                </div>
              </Link>

              <Link
                to="/publicpolls"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Browse Public Polls</h3>
                  <p className="text-sm text-gray-500">Vote on community polls</p>
                </div>
              </Link>

              <Link
                to="/votedpolls"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Voted Polls</h3>
                  <p className="text-sm text-gray-500">See polls you've participated in</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No recent activity</h3>
              <p className="mt-2 text-gray-500">Create your first poll to get started!</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
