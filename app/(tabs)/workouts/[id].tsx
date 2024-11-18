import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { workouts } from "~/data/workouts";

export default function SpecificWorkOutRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    const title = workouts.find((workout) => workout.id === id)?.name;
    if (!title) {
      return;
    }

    navigation.setOptions({ title });
  }, [navigation]);

  return (
    <View className="p-4">
      <Text>Specific {id}</Text>
      <Text className="font-mono">{JSON.stringify(workouts, null, 2)}</Text>
    </View>
  );
}
