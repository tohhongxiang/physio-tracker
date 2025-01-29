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

# Resources

- https://www.reactnative.express/app/project_structure
- https://orm.drizzle.team/docs/get-started/expo-new
- https://medium.com/@rutikpanchal121/building-a-robust-form-in-react-native-with-react-hook-form-and-zod-for-validation-7583678970c3
- https://rnr-docs.vercel.app/getting-started/introduction/
- https://github.com/drizzle-team/drizzle-studio-expo
- https://gunnartorfis.github.io/sonner-native/toast
- https://stackoverflow.com/questions/52817922/typescript-return-type-depending-on-parameter
