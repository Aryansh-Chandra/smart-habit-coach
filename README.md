# Smart Habit Coach 🎯

A mobile app to build and track daily habits with streaks, reminders, and insights. Built with React Native and Expo.

## Features ✨

- **Create Habits** - Add custom habits with descriptions
- **Track Daily** - Check off habits each day with visual feedback
- **Streak System** - Build consecutive day streaks and maintain motivation
- **Daily Reminders** - Get push notifications at scheduled times (development build only)
- **Insights** - View habit completion history with charts
- **Persistent Storage** - All data saved locally on your phone
- **Settings** - Reset all data when needed

## Tech Stack 🛠️

- **React Native** - Cross-platform mobile framework
- **Expo** - Development and deployment platform
- **React Navigation** - Screen navigation and tab management
- **Formik & Yup** - Form handling and validation
- **AsyncStorage** - Local phone database
- **Expo Notifications** - Push notifications (local scheduling)
- **React Native Chart Kit** - Data visualization

## Installation & Setup 🚀

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Expo CLI: `npm install -g eas-cli`
- Expo account: https://expo.dev (free)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aryansh-Chandra/smart-habit-coach.git
   cd smart-habit-coach
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the dev server**
   ```bash
   npm start
   ```

4. **Choose your option:**
   - **Option A: Expo Go (simple, no notifications)**
     - Install [Expo Go](https://expo.dev/client) app on your phone
     - Scan the QR code
     - App works but no push notifications
   
   - **Option B: Development Build (full features with notifications)**
     ```bash
     eas login
     eas build --profile development --platform android
     npx expo start --dev-client
     ```

## Project Structure 📁

```
smart-habit-coach/
├── src/
│   ├── navigation/           # Navigation setup
│   ├── screens/              # UI screens (Home, Add, Edit, Insights, Settings)
│   ├── storage/              # Phone database (AsyncStorage)
│   └── utils/                # Notifications service
├── assets/                   # Images and icons
├── app.json                  # Expo configuration
├── eas.json                  # Build profiles
├── package.json              # Dependencies
├── CODEBASE_GUIDE.md        # Detailed code documentation
└── README.md                 # This file
```

## How It Works 🔄

### Creating a Habit
1. Tap the **"+"** floating button
2. Enter habit name and optional description
3. Optionally enable daily reminder and set time
4. Tap "Create Habit"

### Tracking Daily
1. View habit on home screen
2. Tap checkbox to mark complete for today
3. Streak increases if completed consecutively
4. Checkbox resets tomorrow

### Reminders (Dev Build Only)
1. Enable "Enable Reminder" when creating/editing habit
2. Set time (24-hour format, e.g., 09:00)
3. Save habit
4. Notification fires daily at that time
5. Works even when app is closed

## Features in Detail 📋

- **Habit Creation**: Add habits with name, description, and optional daily reminders
- **Daily Tracking**: Check off habits completed each day
- **Streak Calculation**: Automatic calculation of consecutive completion days
- **Persistent Storage**: All habits and history saved locally on device
- **Reminders**: Daily push notifications at scheduled times (requires dev build)
- **Insights**: Charts showing habit completion history
- **Settings**: Reset all data option

## Data Stored Locally 💾

All data is stored on your phone using AsyncStorage:
- Habit details (name, description, reminder settings)
- Completed dates for each habit
- Streak information
- Notification IDs

No cloud sync or server - 100% local and private.

## Development Guide 📚

See `CODEBASE_GUIDE.md` for detailed documentation on:
- React Native fundamentals
- Hooks and state management
- Navigation architecture
- File-by-file code breakdown
- How data flows through the app

## Building for Production 📦

```bash
# Create production build
eas build --platform android

# Build will be ready for Google Play Store
```

## Troubleshooting 🔧

**Q: App crashes on Expo Go**
- A: Notifications aren't supported in Expo Go. Use dev build instead.

**Q: Notifications not working**
- A: Make sure you're using dev build, not Expo Go. Check phone notification settings.

**Q: Habit data disappeared**
- A: Data is stored locally. Uninstalling the app clears data.

## Contributing 🤝

Feel free to fork, submit issues, and make pull requests!





---

**Turn small actions into big wins. Smart Habit Coach tracks your streaks, reminds you at the right time, and shows insights that keep you motivated every day.**
