import { Workout } from "~/types";

export const workouts: Workout[] = [
  {
    id: "1",
    name: "Shoulders",
    exercises: [
      {
        id: "exercise-1",
        name: "YITW",
        description: "Do something about it",
        sets: 2,
        repsPerSet: 5,
        durationPerRepSeconds: 5,
      },
      {
        id: "exercise-2",
        name: "Twist and Stretch Back",
        description: "Lorem Ipsum",
        sets: 4,
        repsPerSet: 5,
        durationPerRepSeconds: 5,
      },
    ],
  },
  {
    id: "2",
    name: "Legs",
    exercises: [],
  },
  {
    id: "3",
    name: "Arms",
    exercises: [],
  },
  {
    id: "4",
    name: "Chest",
    exercises: [],
  },
];
