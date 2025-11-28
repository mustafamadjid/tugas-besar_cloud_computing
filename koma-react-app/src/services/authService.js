import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import api from './api';

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Google Sign In untuk Buyer
export const googleSignInBuyer = async () => {
  try {
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    
    // Kirim ke backend untuk verifikasi dan create/update user
    const response = await api.post('/api/auth/buyer', { idToken });
    
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      localStorage.setItem('role', response.data.data.role);
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
};

// Google Sign In untuk Promoter
export const googleSignInPromoter = async () => {
  try {
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    
    // Kirim ke backend untuk verifikasi dan create/update user
    const response = await api.post('/api/auth/promoter', { idToken });
    
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      localStorage.setItem('role', response.data.data.role);
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    return true;
  } catch (error) {
    console.error('Logout Error:', error);
    throw error;
  }
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Get current role
export const getCurrentRole = () => {
  return localStorage.getItem('role');
};

export { auth };
