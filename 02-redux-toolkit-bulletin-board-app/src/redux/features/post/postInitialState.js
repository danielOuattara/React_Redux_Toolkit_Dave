import { sub } from "date-fns";

export const postInitialState = [
  {
    id: "1",
    title: "Learning Redux Toolkit",
    content: "I've heard good things.",
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    reactions: {
      thumbsUp: 11,
      wow: 5,
      heart: 2,
      rocket: 3,
      coffee: 2,
    },
    userId: "0",
  },
  {
    id: "2",
    title: "Slices...",
    content: "The more I say slice, the more I want pizza.",
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    reactions: {
      thumbsUp: 12,
      wow: 1,
      heart: 3,
      rocket: 2,
      coffee: 2,
    },
    userId: "1",
  },
];
