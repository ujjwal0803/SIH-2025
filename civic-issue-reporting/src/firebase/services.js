/* eslint-disable no-unused-vars */
// services.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from './firebase';

// Authentication Services
export const authServices = {
  // Register user
  register: async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Add user data to Firestore
      await addDoc(collection(db, 'users'), {
        uid: userCredential.user.uid,
        email: email,
        ...userData,
        createdAt: new Date(),
        role: userData.role || 'citizen'
      });
      
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser: () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, 
        user => {
          unsubscribe();
          resolve(user);
        },
        reject
      );
    });
  }
};

// Issues/Reports Services
export const issueServices = {
  // Create new issue report
  createIssue: async (issueData) => {
    try {
      const docRef = await addDoc(collection(db, 'issues'), {
        ...issueData,
        createdAt: new Date(),
        status: 'pending',
        priority: issueData.priority || 'medium',
        votes: 0,
        comments: []
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  // Get all issues
  getAllIssues: async (filters = {}) => {
    try {
      let q = collection(db, 'issues');
      
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }
      
      q = query(q, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      const issues = [];
      
      querySnapshot.forEach((doc) => {
        issues.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return issues;
    } catch (error) {
      throw error;
    }
  },

  // Update issue status
  updateIssueStatus: async (issueId, newStatus, updateData = {}) => {
    try {
      const issueRef = doc(db, 'issues', issueId);
      await updateDoc(issueRef, {
        status: newStatus,
        updatedAt: new Date(),
        ...updateData
      });
    } catch (error) {
      throw error;
    }
  },

  // Add comment to issue
  addComment: async (issueId, comment) => {
    try {
      const issueRef = doc(db, 'issues', issueId);
      
      // First get the current issue to update comments array
      const issueSnap = await getDocs(query(collection(db, 'issues'), where('__name__', '==', issueId)));
      const issueData = issueSnap.docs[0].data();
      
      const updatedComments = [...(issueData.comments || []), {
        ...comment,
        timestamp: new Date()
      }];
      
      await updateDoc(issueRef, {
        comments: updatedComments,
        updatedAt: new Date()
      });
    } catch (error) {
      throw error;
    }
  },

  // Subscribe to real-time updates
  subscribeToIssues: (callback, filters = {}) => {
    let q = collection(db, 'issues');
    
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    q = query(q, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const issues = [];
      querySnapshot.forEach((doc) => {
        issues.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(issues);
    });
  }
};

// File Upload Services
export const storageServices = {
  // Upload file
  uploadFile: async (file, path) => {
    try {
      const fileRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      throw error;
    }
  },

  // Upload multiple files
  uploadMultipleFiles: async (files, path) => {
    try {
      const uploadPromises = files.map(file => 
        storageServices.uploadFile(file, path)
      );
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      throw error;
    }
  }
};

// User Services
export const userServices = {
  // Get user profile
  getUserProfile: async (uid) => {
    try {
      const q = query(collection(db, 'users'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        return {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data()
        };
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userId, updateData) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updateData,
        updatedAt: new Date()
      });
    } catch (error) {
      throw error;
    }
  },

  // Get all staff/admin users
  getStaffUsers: async () => {
    try {
      const q = query(
        collection(db, 'users'), 
        where('role', 'in', ['admin', 'staff'])
      );
      const querySnapshot = await getDocs(q);
      const staff = [];
      
      querySnapshot.forEach((doc) => {
        staff.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return staff;
    } catch (error) {
      throw error;
    }
  }
};

// Analytics Services
export const analyticsServices = {
  // Get dashboard stats
  getDashboardStats: async () => {
    try {
      const issuesSnapshot = await getDocs(collection(db, 'issues'));
      const issues = [];
      
      issuesSnapshot.forEach((doc) => {
        issues.push(doc.data());
      });
      
      const stats = {
        totalIssues: issues.length,
        pendingIssues: issues.filter(i => i.status === 'pending').length,
        inProgressIssues: issues.filter(i => i.status === 'in-progress').length,
        resolvedIssues: issues.filter(i => i.status === 'resolved').length,
        categoryBreakdown: {},
        priorityBreakdown: {}
      };
      
      // Calculate category and priority breakdowns
      issues.forEach(issue => {
        // Category breakdown
        if (stats.categoryBreakdown[issue.category]) {
          stats.categoryBreakdown[issue.category]++;
        } else {
          stats.categoryBreakdown[issue.category] = 1;
        }
        
        // Priority breakdown
        if (stats.priorityBreakdown[issue.priority]) {
          stats.priorityBreakdown[issue.priority]++;
        } else {
          stats.priorityBreakdown[issue.priority] = 1;
        }
      });
      
      return stats;
    } catch (error) {
      throw error;
    }
  }
};