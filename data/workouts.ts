import { Workout } from "~/types";

export const workouts: Workout[] = [
	{
		id: "1",
		name: "Shoulders",
		description:
			"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
		exercises: [
			{
				id: "exercise-1",
				name: "YITW",
				description: "Do something about it",
				sets: 2,
				repsPerSet: 5,
				durationPerRepSeconds: 5,
				restBetweenRepsSeconds: 10,
				restBetweenSetsSeconds: 0
			},
			{
				id: "exercise-2",
				name: "Twist and Stretch Back",
				description: "Lorem Ipsum",
				sets: 2,
				repsPerSet: 5,
				durationPerRepSeconds: 5,
				restBetweenRepsSeconds: 10,
				restBetweenSetsSeconds: 15
			},
			{
				id: "exercise-3",
				name: "Banded Internal Rotation",
				description: "Use resistance band to help",
				sets: 2,
				repsPerSet: 10,
				restBetweenSetsSeconds: 10,
				restBetweenRepsSeconds: 0,
				durationPerRepSeconds: 0
			},
			{
				id: "exercise-4",
				name: "Test",
				description: "Bling bang bang born",
				sets: 1,
				repsPerSet: 1,
				restBetweenSetsSeconds: 10,
				restBetweenRepsSeconds: 0,
				durationPerRepSeconds: 0
			}
		]
	},
	{
		id: "2",
		name: "Legs",
		description: "",
		exercises: [
			{
				id: "exercise-5",
				name: "Leg raises",
				description: "I do what I want",
				sets: 4,
				repsPerSet: 10,
				restBetweenRepsSeconds: 0,
				restBetweenSetsSeconds: 0,
				durationPerRepSeconds: 0
			}
		]
	},
	{
		id: "3",
		name: "Arms",
		description: "",
		exercises: []
	},
	{
		id: "4",
		name: "Chest",
		description: "",
		exercises: []
	}
];
