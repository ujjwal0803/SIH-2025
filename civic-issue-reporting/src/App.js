// App.js
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';
import { userServices } from './firebase/services';
import CityConnect from './components/CityConnect';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setUser(user);
          // Get user profile from Firestore
          const profile = await userServices.getUserProfile(user.uid);
          setUserProfile(profile);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error getting user profile:', error);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error</div>
          <div className="text-gray-600">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show the landing page
  if (!user) {
    return <CityConnect />;
  }

  // If user is authenticated, show the dashboard
  return (
    <Dashboard 
      user={user} 
      userProfile={userProfile} 
      setUser={setUser}
      setUserProfile={setUserProfile}
    />
  );
}

export default App;