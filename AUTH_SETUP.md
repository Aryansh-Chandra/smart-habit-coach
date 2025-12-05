# Authentication Setup Guide

Your Smart Habit Coach app now has **Firebase Authentication** integrated! Here's what was added:

## 📋 What's Implemented

### 1. **Auth Context** (`src/utils/AuthContext.js`)
- Manages user state across the app
- Provides auth functions: `signUp`, `signIn`, `logOut`
- Listens for Firebase auth state changes
- Custom `useAuth()` hook for easy access in components

### 2. **Firebase Config** (`src/utils/firebaseConfig.js`)
- Initializes Firebase with your credentials (currently has placeholder values)

### 3. **Login Screen** (`src/screens/LoginScreen.js`)
- Email/password input
- Error handling and loading states
- Link to signup for new users

### 4. **Signup Screen** (`src/screens/SignUpScreen.js`)
- Email/password creation
- Password confirmation validation
- Password length requirement (6+ chars)
- Link to login for existing users

### 5. **Conditional Navigation** (`src/navigation/AppNavigator.js`)
- Shows auth screens (Login/SignUp) if user is NOT logged in
- Shows app screens (Main/AddHabit/EditHabit) if user IS logged in
- Loading spinner while checking auth state

### 6. **User-Scoped Data** (`src/storage/HabitStorage.js`)
- All methods now require `userId` parameter
- Habits stored with key format: `@habits_${userId}` and `@habit_logs_${userId}`
- Each user's data is completely isolated

### 7. **Updated Screens**
All screens updated to:
- Import `useAuth()` hook
- Get current `user` from auth context
- Pass `user.uid` to HabitStorage methods
- HomeScreen, AddHabitScreen, EditHabitScreen, InsightsScreen, SettingsScreen

### 8. **Enhanced Settings**
- Display current logged-in email
- "Log Out" button that clears user session
- "Reset All Data" only clears user's own data

## ⚙️ Setup Required

### **IMPORTANT: Configure Firebase**

You need to set up a Firebase project and replace the placeholder config:

1. **Create Firebase project**: https://console.firebase.google.com/
2. **Enable Authentication**: 
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider
3. **Get your config**:
   - Project Settings > General > Web API Key section
   - Copy the config values

4. **Update** `src/utils/firebaseConfig.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID",
   };
   ```

## 🧪 Testing the Flow

1. **First Launch**: App shows Login/SignUp screens
2. **Sign Up**: Create new account → automatically logged in → redirects to Main
3. **Add Habits**: Your habits are now user-specific
4. **Log Out**: Settings screen → "Log Out" → back to Login
5. **Log Back In**: Use your email/password

## 🔄 Data Migration

If you had habits from before auth was added:
- They're stored in old `@habits` and `@habit_logs` keys
- After auth, new habits are stored in user-specific keys
- Old data remains but won't be shown (since no userId matches it)
- You can manually migrate by exporting old data if needed

## 📦 Database Structure

```
Firebase Auth User:
├── uid: "abc123def456..."
├── email: "user@example.com"
└── password: (hashed by Firebase)

AsyncStorage:
├── @habits_abc123def456: [
│   { id, name, description, reminder..., completedDates, streak }
│ ]
└── @habit_logs_abc123def456: [
    { habitId, date, timestamp }
  ]
```

## 🔐 Security Notes

- **Client-side**: Passwords never stored locally
- **Firebase**: Handles password hashing and storage
- **Rules**: Set up Firestore Security Rules if adding backend sync (optional)
- **SSL**: Firebase enforces HTTPS

## 🚀 Future Enhancements

1. **Cloud Sync**: Use Firebase Firestore to sync habits across devices
2. **Social Auth**: Add Google/Apple sign-in
3. **Password Reset**: Add "Forgot Password" email flow
4. **Account Deletion**: Add button to delete account and all data
5. **Profile**: Add user profile screen with avatar, preferences

## 📝 API Reference

### `useAuth()` hook:
```javascript
const { user, loading, error, signUp, signIn, logOut } = useAuth();
```

### `HabitStorage` methods (all require userId):
```javascript
HabitStorage.getHabits(userId)
HabitStorage.saveHabit(userId, habitData)
HabitStorage.updateHabit(userId, habitData)
HabitStorage.deleteHabit(userId, habitId)
HabitStorage.markHabitCompleted(userId, habitId, dateString)
HabitStorage.unmarkHabitCompleted(userId, habitId, dateString)
HabitStorage.getHabitLogs(userId)
```

---

**Next Steps**: Set up your Firebase project, update the config, and test the auth flow! 🎉
