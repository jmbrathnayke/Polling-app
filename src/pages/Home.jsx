import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [featuredPolls, setFeaturedPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated');
      setIsAuthenticated(auth === 'true');
    };

    const fetchFeaturedPolls = () => {
      try {
        // In a real app, this would be an API call to get trending or featured polls
        const allPolls = JSON.parse(localStorage.getItem('polls') || '[]');
        
        // Get up to 3 public polls sorted by total votes
        const publicPolls = allPolls
          .filter(poll => poll.isPublic)
          .sort((a, b) => b.totalVotes - a.totalVotes)
          .slice(0, 3);
          
        setFeaturedPolls(publicPolls);
      } catch (error) {
        console.error('Error fetching featured polls:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    fetchFeaturedPolls();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
              <h1 className="ml-2 text-2xl font-bold text-blue-600">PollWise</h1>
            </div>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</a>
                </li>
                {isAuthenticated ? (
                  <li>
                    <Link to="/dashboard" className="font-medium text-blue-600 hover:text-blue-500">Dashboard</Link>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link to="/login" className="font-medium text-gray-600 hover:text-gray-900">Login</Link>
                    </li>
                    <li>
                      <Link to="/register" className="font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">Sign Up</Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Create & Share Polls With Ease
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                PollWise makes it simple to create polls, gather opinions, and analyze results. Perfect for teams, events, or just asking friends.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link 
                    to="/createpolls" 
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 shadow-md text-center"
                  >
                    Create Your First Poll
                  </Link>
                ) : (
                  <Link 
                    to="/register" 
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 shadow-md text-center"
                  >
                    Get Started For Free
                  </Link>
                )}
                <a 
                  href="#how-it-works" 
                  className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-50 shadow-md text-center"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-blue-200 rounded-lg transform rotate-3"></div>
                <div className="absolute inset-0 bg-blue-100 rounded-lg transform -rotate-3"></div>
                <div className="relative bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Sample Poll: Favorite Programming Language</h3>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                      <input type="radio" name="sample" className="h-4 w-4 text-blue-600" />
                      <span className="ml-3 text-gray-700">JavaScript</span>
                    </label>
                    <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                      <input type="radio" name="sample" className="h-4 w-4 text-blue-600" />
                      <span className="ml-3 text-gray-700">Python</span>
                    </label>
                    <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                      <input type="radio" name="sample" className="h-4 w-4 text-blue-600" />
                      <span className="ml-3 text-gray-700">Java</span>
                    </label>
                    <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                      <input type="radio" name="sample" className="h-4 w-4 text-blue-600" />
                      <span className="ml-3 text-gray-700">Go</span>
                    </label>
                  </div>
                  <button className="mt-4 w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
                    Vote
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Features That Make Polling Simple</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to create effective polls and get actionable insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Creation</h3>
              <p className="text-gray-600">
                Create custom polls in seconds with our intuitive interface. Add multiple choice options, set expiration dates, and customize privacy settings.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Results</h3>
              <p className="text-gray-600">
                Watch responses roll in with real-time updates. View detailed analytics, visualize data with charts, and export results in multiple formats.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Sharing</h3>
              <p className="text-gray-600">
                Share polls via direct links, embed on websites, or send through email. Control who can vote with optional authentication settings.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <div id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How PollWise Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Create, share, and analyze polls in just a few simple steps.
            </p>
          </div>
          </div>
          
          <div className="relative">
            {/* Step connector line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 transform -translate-x-1/2"></div>
            
            {/* Steps */}
            <div className="space-y-12 relative">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0">
                  <div className="text-center md:text-right">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Create Your Poll</h3>
                    <p className="text-gray-600">
                      Sign up for a free account, then use our easy poll creator to design your perfect poll. Add questions, customize options, and set your preferences.
                    </p>
                  </div>
                </div>
                <div className="md:w-12 md:flex md:justify-center relative">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg z-10">
                    1
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0 md:order-3">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                </div>
                <div className="md:w-12 md:flex md:justify-center relative md:order-2">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg z-10">
                    2
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12 md:order-1">
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Share With Your Audience</h3>
                    <p className="text-gray-600">
                      Share your poll with a simple link, embed it on your website, or send it directly to participants. Control who can vote and how they authenticate.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0">
                  <div className="text-center md:text-right">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Collect Responses</h3>
                    <p className="text-gray-600">
                      Watch as responses come in real-time. PollWise prevents duplicate voting and ensures accurate results with our secure voting system.
                    </p>
                  </div>
                </div>
                <div className="md:w-12 md:flex md:justify-center relative">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg z-10">
                    3
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0 md:order-3">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="md:w-12 md:flex md:justify-center relative md:order-2">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg z-10">
                    4
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12 md:order-1">
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Analyze Results</h3>
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
  );
};

export default Home;

                    