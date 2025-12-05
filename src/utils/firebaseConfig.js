import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase config (from your google-services.json)
const firebaseConfig = {
  apiKey: "AIzaSyCXUnSdvpzIgD-hSPSgMQ7r7sdKVDI7F4g",
  authDomain: "smart-habit-coach.firebaseapp.com",
  projectId: "smart-habit-coach",
  storageBucket: "smart-habit-coach.firebasestorage.app",
  messagingSenderId: "996225833430",
  appId: "1:996225833430:android:cacd3a69a0be8551b1ec77",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };

export default app;
