import { Stack } from "expo-router";
import NavigationHeader from "~/components/NavigationHeader";

export default function WorkoutsTabLayout() {
  return (
    <Stack
      screenOptions={{
        header: (props) => (
          <NavigationHeader
            title={props.options.title ?? props.route.name}
            back={props.back}
          />
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: "Workouts" }} />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
