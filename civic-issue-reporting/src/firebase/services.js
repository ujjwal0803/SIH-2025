// src/firebase/services.js
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  getDocs, 
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

// Page Content Services
export const pageServices = {
  // Get page data
  getPageData: async (pageId) => {
    try {
      const docRef = doc(db, 'pages', pageId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: docSnap.data() };
      } else {
        return { success: false, error: 'Page not found' };
      }
    } catch (error) {
      console.error('Error fetching page data:', error);
      return { success: false, error: error.message };
    }
  },

  // Update page data
  updatePageData: async (pageId, data) => {
    try {
      const docRef = doc(db, 'pages', pageId);
      await updateDoc(docRef, data);
      return { success: true };
    } catch (error) {
      console.error('Error updating page data:', error);
      return { success: false, error: error.message };
    }
  },

  // Set page data (create or overwrite)
  setPageData: async (pageId, data) => {
    try {
      const docRef = doc(db, 'pages', pageId);
      await setDoc(docRef, data);
      return { success: true };
    } catch (error) {
      console.error('Error setting page data:', error);
      return { success: false, error: error.message };
    }
  },

  // Listen to page data changes (real-time)
  listenToPageData: (pageId, callback) => {
    const docRef = doc(db, 'pages', pageId);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ success: true, data: doc.data() });
      } else {
        callback({ success: false, error: 'Page not found' });
      }
    }, (error) => {
      console.error('Error listening to page data:', error);
      callback({ success: false, error: error.message });
    });
  }
};

// User Services
export const userServices = {
  // Create user profile
  createUserProfile: async (userId, userData) => {
    try {
      const docRef = doc(db, 'users', userId);
      await setDoc(docRef, {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Error creating user profile:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: docSnap.data() };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { success: false, error: error.message };
    }
  },

  // Update user profile
  updateUserProfile: async (userId, userData) => {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        ...userData,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: error.message };
    }
  }
};

// Issue Services
export const issueServices = {
  // Create new issue
  createIssue: async (issueData) => {
    try {
      const docRef = await addDoc(collection(db, 'issues'), {
        ...issueData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating issue:', error);
      return { success: false, error: error.message };
    }
  },

  // Get issues by user
  getUserIssues: async (userId) => {
    try {
      const q = query(
        collection(db, 'issues'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const issues = [];
      querySnapshot.forEach((doc) => {
        issues.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: issues };
    } catch (error) {
      console.error('Error fetching user issues:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all issues (for admin/staff)
  getAllIssues: async (statusFilter = null, limitCount = 50) => {
    try {
      let q = query(
        collection(db, 'issues'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (statusFilter) {
        q = query(
          collection(db, 'issues'),
          where('status', '==', statusFilter),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        );
      }

      const querySnapshot = await getDocs(q);
      const issues = [];
      querySnapshot.forEach((doc) => {
        issues.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: issues };
    } catch (error) {
      console.error('Error fetching all issues:', error);
      return { success: false, error: error.message };
    }
  },

  // Update issue status
  updateIssueStatus: async (issueId, status, updatedBy = null) => {
    try {
      const updateData = {
        status,
        updatedAt: new Date()
      };
      
      if (updatedBy) {
        updateData.updatedBy = updatedBy;
      }

      const docRef = doc(db, 'issues', issueId);
      await updateDoc(docRef, updateData);
      return { success: true };
    } catch (error) {
      console.error('Error updating issue status:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete issue
  deleteIssue: async (issueId) => {
    try {
      const docRef = doc(db, 'issues', issueId);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting issue:', error);
      return { success: false, error: error.message };
    }
  },

  // Listen to issues changes (real-time)
  listenToIssues: (callback, statusFilter = null) => {
    let q = query(
      collection(db, 'issues'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    if (statusFilter) {
      q = query(
        collection(db, 'issues'),
        where('status', '==', statusFilter),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
    }

    return onSnapshot(q, (querySnapshot) => {
      const issues = [];
      querySnapshot.forEach((doc) => {
        issues.push({ id: doc.id, ...doc.data() });
      });
      callback({ success: true, data: issues });
    }, (error) => {
      console.error('Error listening to issues:', error);
      callback({ success: false, error: error.message });
    });
  }
};

// Configuration Services
export const configServices = {
  // Get app configuration
  getAppConfig: async () => {
    try {
      const docRef = doc(db, 'config', 'app');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: docSnap.data() };
      } else {
        return { success: false, error: 'Config not found' };
      }
    } catch (error) {
      console.error('Error fetching app config:', error);
      return { success: false, error: error.message };
    }
  },

  // Update app configuration
  updateAppConfig: async (configData) => {
    try {
      const docRef = doc(db, 'config', 'app');
      await updateDoc(docRef, {
        ...configData,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating app config:', error);
      return { success: false, error: error.message };
    }
  }
};

const services = {
  pageServices,
  userServices,
  issueServices,
  configServices
};

export default services;