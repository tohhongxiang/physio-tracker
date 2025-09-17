# Installation Instructions

Follow instructions [here](https://reactnative.dev/docs/set-up-your-environment) to set up the environment for React Native.

Then install the project's dependencies.

```sh
yarn
```

And start developing with one of the commands (use development build)

```sh
yarn run dev:android # Run development for android
yarn run dev:ios # Run development for ios

yarn start # Starting normal development
```

## Applying Database Changes

When changing the database schema, run this command before starting the application in development mode:

```sh
npx drizzle-kit generate
```

# Build

Make sure `eas` is installed.

```sh
npm install -g eas-cli
```

Then build the app for the correct `profile` and `platform`. Check `eas.json` for more details regarding each profile.

```sh
eas build --profile preview --platform android # Build for previewing on android
eas build --profile preview --platform ios # Build for previewing on android

eas build --profile production --platform android # Build for production on android
eas build --profile production --platform ios # Build for production on ios
```

# Features to Implement

[] Pinned workouts
[] Settings tab 
- Audio and sound settings 
  - Enable/disable timer completion sounds and countdown warning sounds 
  - Adjust volume level for workout sounds 
  - Enable/disable haptic feedback for timer events 
  - Custom sound selection 
- Timer and workout settings 
  - Default timer duration 
  - Countdown warning time 
  - Auto start next exercise 
- Exercise and weight settings 
  - Default weight unit 
  - Default sets and reps 
  - Set user's body weight for %BW calculations?? 
  - Exercise display order?? 
- Appearance settings 
  - Theme 
  - Color scheme 
  - Timer display style 
  - Data and privacy settings 
  - Data export 
  - Data import 
- Backup settings 
  - Clear data 
  - Analytics 
  - App behavior settings 
  - Keep screen on 
  - Auto-pause on phone calls 
  - Startup screen: Choose which tab to open when launching the application 
  - Calendar and scheduling 
  - Week start day 
  - Date format 
  - Workout reminders 
  - Goal tracking
[] Able to mute sound
[] Haptic feedback for workout start

# Resources

- https://www.reactnative.express/app/project_structure
- https://orm.drizzle.team/docs/get-started/expo-new
- https://medium.com/@rutikpanchal121/building-a-robust-form-in-react-native-with-react-hook-form-and-zod-for-validation-7583678970c3
- https://rnr-docs.vercel.app/getting-started/introduction/
- https://github.com/drizzle-team/drizzle-studio-expo
- https://orm.drizzle.team/docs/connect-expo-sqlite
- https://gunnartorfis.github.io/sonner-native/toast
- https://stackoverflow.com/questions/52817922/typescript-return-type-depending-on-parameter
- https://tkdodo.eu/blog/practical-react-query
