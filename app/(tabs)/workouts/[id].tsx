import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { ScrollView, View } from "react-native";
import getWorkout from "~/api/getWorkout";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { DurationExercise, Exercise } from "~/types";

export default function SpecificWorkOutRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  const { data, isPending } = useQuery({
    queryKey: ["workouts", id],
    queryFn: ({ queryKey }) => getWorkout(queryKey[1]),
  });

  useLayoutEffect(() => {
    if (isPending) {
      navigation.setOptions({ title: "Loading Workout..." });
      return;
    }

    if (!data) {
      navigation.setOptions({ title: "Workout not Found!" });
      return;
    }

    navigation.setOptions({ title: data.name });
  }, [navigation, data]);

  if (isPending) {
    return (
      <View className="p-4">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View className="p-4">
        <Text>No workout found...</Text>
      </View>
    );
  }

  if (data.exercises.length === 0) {
    return (
      <View className="p-4 flex flex-col gap-4 flex-1 h-full w-full">
        <View className="flex-grow flex items-center justify-center flex-col gap-2">
          <Text className="text-center text-xl font-semibold">
            No exercises
          </Text>
          <Button>
            <Text>Add an Exercise</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className="flex flex-col gap-2 flex-1 h-full w-full">
      <View className="flex flex-row justify-between items-center px-4 pt-4">
        <Text className="text-lg text-muted-foreground">
          {data.exercises.length} exercises
        </Text>
        <View className="flex flex-row gap-2">
          <Button variant="secondary">
            <Text>Edit</Text>
          </Button>
          <Button variant="destructive">
            <Text>Delete</Text>
          </Button>
        </View>
      </View>
      <ScrollView
        className="flex-grow"
        contentContainerClassName="flex gap-4 p-4"
        horizontal
        centerContent
      >
        {data.exercises.map((exercise) => (
          <View
            key={exercise.id}
            className="p-4 border border-muted-foreground rounded-md"
          >
            <Text className="font-mono flex-grow">
              {JSON.stringify(exercise, null, 2)}
            </Text>
            <Text className="font-bold">{exercise.name}</Text>
            <Text className="text-muted-foreground">
              {exercise.description}
            </Text>
            <Text>
              {exercise.sets} sets, {exercise.repsPerSet} per set
              {hasDuration(exercise) && (
                <Text>, {exercise.durationPerRepSeconds} seconds per rep</Text>
              )}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View className="flex flex-col gap-4 p-4">
        <Button>
          <Text>Start Exercise</Text>
        </Button>
      </View>
    </View>
  );
}

function hasDuration(exercise: Exercise): exercise is DurationExercise {
  return exercise.hasOwnProperty("durationPerRepSeconds");
}
