import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { authServices, issueServices } from '../firebase/services';

const Dashboard = ({ user, userProfile, setUser, setUserProfile }) => {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({
    totalIssues: 0,
    pendingIssues: 0,
    inProgressIssues: 0,
    resolvedIssues: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const allIssues = await issueServices.getAllIssues();
      setIssues(allIssues);
      
      // Calculate stats
      const newStats = {
        totalIssues: allIssues.length,
        pendingIssues: allIssues.filter(issue => issue.status === 'pending').length,
        inProgressIssues: allIssues.filter(issue => issue.status === 'in-progress').length,
        resolvedIssues: allIssues.filter(issue => issue.status === 'resolved').length
      };
      setStats(newStats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authServices.logout();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        className="bg-white shadow-sm border-b"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">CityConnect</span>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{userProfile?.name || user.email}</span>
              </div>
              <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {userProfile?.role || 'citizen'}
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <motion.div 
          className="flex space-x-1 bg-white p-1 rounded-lg mb-8 w-fit"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'issues', label: 'Issues', icon: '📋' },
            { id: 'report', label: 'Report Issue', icon: '➕' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Stats Cards */}
        {activeTab === 'dashboard' && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {[
              { label: 'Total Issues', value: stats.totalIssues, color: 'bg-blue-500', icon: '📊' },
              { label: 'Pending', value: stats.pendingIssues, color: 'bg-yellow-500', icon: '⏳' },
              { label: 'In Progress', value: stats.inProgressIssues, color: 'bg-purple-500', icon: '🔄' },
              { label: 'Resolved', value: stats.resolvedIssues, color: 'bg-green-500', icon: '✅' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-white rounded-lg shadow p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center">
                  <div className={`${stat.color} text-white p-3 rounded-lg mr-4`}>
                    <span className="text-xl">{stat.icon}</span>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Issues List */}
        {(activeTab === 'dashboard' || activeTab === 'issues') && (
          <motion.div 
            className="bg-white rounded-lg shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Issues</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {issues.slice(0, activeTab === 'dashboard' ? 5 : issues.length).map((issue, index) => (
                <motion.div
                  key={issue.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{issue.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                          {issue.status}
                        </span>
                        <span className={`text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                          {issue.priority} priority
                        </span>
                        <span className="text-xs text-gray-500">
                          {issue.createdAt?.toDate?.()?.toLocaleDateString() || 'Just now'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {issues.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No issues reported yet</p>
                  <button
                    onClick={() => setActiveTab('report')}
                    className="mt-4 text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Report your first issue
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Report Issue Form */}
        {activeTab === 'report' && (
          <motion.div 
            className="bg-white rounded-lg shadow p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Report New Issue</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief title for the issue"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Select category</option>
                  <option>Road & Transportation</option>
                  <option>Water & Sanitation</option>
                  <option>Electricity</option>
                  <option>Waste Management</option>
                  <option>Public Safety</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Detailed description of the issue"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Select priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Address or location of the issue"
                />
              </div>
              
              <motion.button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Submit Issue Report
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;