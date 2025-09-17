import { Link, Stack, useRouter } from "expo-router";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Dimensions, View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import goSound from "~/assets/audio/go.mp3";
import readySound from "~/assets/audio/ready.mp3";
import { Button } from "~/components/ui/button";
import useSound from "~/hooks/use-sound";
import hasDurationPerRep from "~/lib/has-duration-per-rep";
import hasRestBetweenReps from "~/lib/has-rest-between-reps";
import { ClipboardCheck } from "~/lib/icons/ClipboardCheck";
import { Pencil } from "~/lib/icons/Pencil";
import { Volume2 } from "~/lib/icons/Volume2";
import { VolumeX } from "~/lib/icons/VolumeOff";
import { Workout } from "~/types";

import BottomControls from "./bottom-controls";
import ExerciseListNavigation from "./exercise-list-navigation";
import ExerciseStateDisplay from "./exercise-state-display";
import LoadingWorkoutPage from "./loading";
import useExerciseControls from "./use-exercise-controls";
import { STATES } from "./use-exercise-controls/constants";
import { getDurationForTimer } from "./use-exercise-controls/utils";
import WorkoutProgressIndicator from "./workout-progress-indicator";

const width = Dimensions.get("window").width;
export default function WorkoutStartPage({
	workout: { id: workoutId, exercises, name }
}: {
	workout: Workout;
}) {
	const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
	const currentExercise = useMemo(() => {
		return exercises[currentExerciseIndex];
	}, [exercises, currentExerciseIndex]);

	const ref = useRef<ICarouselInstance>(null);
	const handleGoToPreviousExercise = useCallback(
		() =>
			ref.current?.scrollTo({
				index: currentExerciseIndex - 1,
				animated: true
			}),
		[currentExerciseIndex]
	);

	const router = useRouter();
	const handleGoToNextExercise = useCallback(() => {
		if (currentExerciseIndex === exercises.length - 1) {
			return router.push(`/workouts/${workoutId}/complete`);
		}
		ref.current?.scrollTo({
			index: currentExerciseIndex + 1,
			animated: true
		});
	}, [currentExerciseIndex, exercises.length, router, workoutId]);

	const [isMuted, setIsMuted] = useState(false);
	const goSoundPlayer = useSound(goSound, isMuted);
	const readySoundPlayer = useSound(readySound, isMuted);

	const handleTimerUpdate = useCallback(
		({
			remainingTimeMs,
			totalDurationMs
		}: {
			remainingTimeMs: number;
			totalDurationMs: number;
		}) => {
			if (
				remainingTimeMs < Math.min(3000, totalDurationMs - 1000) // make sure readySound and goSound do not play at the same time
			) {
				readySoundPlayer.play();
			}
		},
		[readySoundPlayer]
	);

	const {
		state,
		currentRep,
		currentSet,
		isTimerRunning,
		changeRep,
		changeSet,
		toggleTimer,
		remainingTimeMs,
		restart
	} = useExerciseControls({
		exercise: currentExercise,
		onTimerComplete: goSoundPlayer.play,
		onTimerUpdate: handleTimerUpdate,
		onExerciseComplete: handleGoToNextExercise
	});

	const previousExerciseIndex = useRef(0);
	useLayoutEffect(() => {
		// only restart if currentExerciseIndex changes
		if (previousExerciseIndex.current !== currentExerciseIndex) {
			restart();
		}

		previousExerciseIndex.current = currentExerciseIndex;
	}, [currentExerciseIndex, restart]);

	const [areArrowsDisabled, setAreArrowsDisabled] = useState(false);
	return (
		<View className="flex flex-1 flex-col items-center justify-between">
			<Stack.Screen
				options={{
					title: name,
					headerRight: () => {
						return (
							<View className="flex flex-row items-center justify-center">
								<Button
									variant="ghost"
									className="flex flex-row gap-2"
									onPress={() => setIsMuted((c) => !c)}
								>
									{isMuted ? (
										<VolumeX className="text-foreground" />
									) : (
										<Volume2 className="text-foreground" />
									)}
								</Button>
								<Link
									href={`/workouts/${workoutId}/exercises/${currentExercise.id}/edit`}
									asChild
								>
									<Button
										variant="ghost"
										className="flex flex-row gap-2"
									>
										<Pencil className="text-foreground" />
									</Button>
								</Link>
								<Link
									href={`/workouts/${workoutId}/complete`}
									asChild
								>
									<Button
										variant="ghost"
										className="flex flex-row gap-2"
									>
										<ClipboardCheck className="text-foreground" />
									</Button>
								</Link>
							</View>
						);
					}
				}}
			></Stack.Screen>
			<WorkoutProgressIndicator
				totalExercises={exercises.length}
				currentExerciseIndex={currentExerciseIndex}
			/>
			<ExerciseListNavigation
				currentExerciseName={currentExercise.name}
				previousButtonDisabled={
					currentExerciseIndex === 0 || areArrowsDisabled
				}
				onGoToPrevious={handleGoToPreviousExercise}
				nextButtonDisabled={
					currentExerciseIndex === exercises.length - 1 ||
					areArrowsDisabled
				}
				onGoToNext={handleGoToNextExercise}
			/>
			<Carousel
				ref={ref}
				width={width}
				data={exercises}
				scrollAnimationDuration={150}
				onScrollStart={() => setAreArrowsDisabled(true)}
				onScrollEnd={() => setAreArrowsDisabled(false)}
				onSnapToItem={setCurrentExerciseIndex}
				height={500}
				loop={false}
				windowSize={3}
				renderItem={({ item: exercise, index }) => {
					const isActiveExercise = index === currentExerciseIndex;
					return (
						<ExerciseStateDisplay
							key={exercise.id}
							exercise={exercise}
							isRunning={
								isActiveExercise ? isTimerRunning : false
							}
							remainingTimeMs={
								isActiveExercise
									? remainingTimeMs
									: getDurationForTimer(
											exercise,
											STATES.READY
										) * 1000
							}
							state={isActiveExercise ? state : STATES.READY}
							currentRep={isActiveExercise ? currentRep : 1}
							currentSet={isActiveExercise ? currentSet : 1}
						/>
					);
				}}
			/>
			<BottomControls
				currentSet={currentSet}
				currentRep={currentRep}
				totalReps={currentExercise.reps}
				totalSets={currentExercise.sets}
				isTimerRunning={isTimerRunning}
				onSetChange={changeSet}
				onRepChange={changeRep}
				repChangeDisabled={
					!hasDurationPerRep(currentExercise) &&
					!hasRestBetweenReps(currentExercise)
				}
				onStart={toggleTimer}
			/>
		</View>
	);
}

WorkoutStartPage.Loading = LoadingWorkoutPage;
