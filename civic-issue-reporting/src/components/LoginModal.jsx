/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authServices } from '../firebase/services';

const LoginModal = ({ isOpen, onClose, userType = 'citizen' }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: '',
    department: '', // For staff/admin
    employeeId: '' // For staff/admin
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      throw new Error('Email and password are required');
    }

    if (!isLogin) {
      if (!formData.name) {
        throw new Error('Name is required');
      }
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      if (userType === 'citizen' && (!formData.phone || !formData.address)) {
        throw new Error('Phone and address are required for citizens');
      }
      if ((userType === 'admin' || userType === 'staff') && (!formData.department || !formData.employeeId)) {
        throw new Error('Department and Employee ID are required for staff/admin');
      }
    }
  };

  // Mock version for testing without Firebase
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    validateForm();

    // Mock authentication - for testing only
    const mockCredentials = {
      'citizen@test.com': { password: 'test123', role: 'citizen', name: 'Test Citizen' },
      'admin@test.com': { password: 'admin123', role: 'admin', name: 'Test Admin' },
      'staff@test.com': { password: 'staff123', role: 'staff', name: 'Test Staff' }
    };

    if (isLogin) {
      // Mock login
      const user = mockCredentials[formData.email];
      if (!user || user.password !== formData.password) {
        throw new Error('Invalid email or password');
      }
      
      // Simulate successful login
      setTimeout(() => {
        console.log('Mock login successful:', user);
        resetForm();
        onClose();
        setLoading(false);
      }, 1000);
      
    } else {
      // Mock registration
      if (mockCredentials[formData.email]) {
        throw new Error('User already exists');
      }
      
      // Simulate successful registration
      setTimeout(() => {
        console.log('Mock registration successful');
        resetForm();
        onClose();
        setLoading(false);
      }, 1500);
    }

  } catch (error) {
    console.error('Authentication error:', error);
    setError(error.message || 'An error occurred. Please try again.');
    setLoading(false);
  }
};

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
      address: '',
      department: '',
      employeeId: ''
    });
    setError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    resetForm();
  };

  const getUserTypeConfig = () => {
    switch (userType) {
      case 'admin':
        return {
          title: 'Administrator',
          color: 'green',
          icon: '⚙️',
          description: 'Access administrative dashboard and manage system'
        };
      case 'staff':
        return {
          title: 'Staff Member',
          color: 'gray',
          icon: '👷',
          description: 'Handle and resolve reported civic issues'
        };
      default:
        return {
          title: 'Citizen',
          color: 'blue',
          icon: '👤',
          description: 'Report issues and track their resolution'
        };
    }
  };

  const config = getUserTypeConfig();

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${
            config.color === 'blue' ? 'from-blue-500 to-blue-600' :
            config.color === 'green' ? 'from-green-500 to-green-600' :
            'from-gray-600 to-gray-700'
          } text-white p-6 rounded-t-2xl`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{config.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                  </h2>
                  <p className="text-white/80 text-sm">
                    {config.title} • {isLogin ? 'Sign In' : 'Register'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-white/70 text-sm mt-2">{config.description}</p>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            {error && (
              <motion.div
                className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-700 text-sm font-medium">{error}</span>
                </div>
              </motion.div>
            )}

            {/* Registration Fields */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                {userType === 'citizen' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="+91 9876543210"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                        placeholder="Enter your complete address"
                      />
                    </div>
                  </>
                )}

                {(userType === 'admin' || userType === 'staff') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department *
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select Department</option>
                        <option value="public-works">Public Works</option>
                        <option value="sanitation">Sanitation</option>
                        <option value="traffic">Traffic Management</option>
                        <option value="utilities">Utilities</option>
                        <option value="administration">Administration</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employee ID *
                      </label>
                      <input
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="EMP001"
                      />
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your email address"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full ${
                config.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600' :
                config.color === 'green' ? 'bg-green-500 hover:bg-green-600' :
                'bg-gray-600 hover:bg-gray-700'
              } disabled:opacity-50 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center`}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </motion.button>

            {/* Toggle Login/Register */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600 mb-3">
                {isLogin 
                  ? "Don't have an account?" 
                  : 'Already have an account?'
                }
              </p>
              <button
                type="button"
                onClick={toggleMode}
                className={`${
                  config.color === 'blue' ? 'text-blue-500 hover:text-blue-600' :
                  config.color === 'green' ? 'text-green-500 hover:text-green-600' :
                  'text-gray-600 hover:text-gray-700'
                } font-medium transition-colors`}
              >
                {isLogin ? 'Create new account' : 'Sign in instead'}
              </button>
            </div>

            {/* Forgot Password */}
            {isLogin && (
              <div className="text-center">
                <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  Forgot your password?
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoginModal;