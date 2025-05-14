// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { initializeAuth, getReactNativePersistence, signInAnonymously } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCi3tXzzEtjb-LKXKlotfu2gRQyWA93JvE',
  authDomain: 'wellsync-329ba.firebaseapp.com',
  databaseURL: 'https://wellsync-329ba-default-rtdb.firebaseio.com',
  projectId: 'wellsync-329ba',
  storageBucket: 'wellsync-329ba.appspot.com',
  messagingSenderId: '630670860318',
  appId: '1:630670860318:ios:27629bf922648fee02ce0f',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Sign in anonymously
signInAnonymously(auth)
  .then((userCredential) => {
    console.log('Anonymous user UID:', userCredential.user.uid);
  })
  .catch((error) => {
    console.error('Anonymous sign-in error:', error);
  });

// Initialize Realtime Database
const db = getDatabase(app);

export { db, auth };
