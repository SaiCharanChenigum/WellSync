// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
