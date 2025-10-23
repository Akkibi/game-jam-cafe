import { create } from "zustand";

type Store = {
  isPaused: boolean;
  isSlowed: boolean;
  score: number;
  setScore: (n: number) => void;
  game_status:
    | "intro"
    | "tutorial"
    | "infinite_room_1" // Steam Wand
    | "infinite_room_2" // Steam Wand + CoffeeGrinder
    | "infinite_room_3" // Steam Wand + CoffeeGrinder + Cascades
    | "infinite_room_4" // Steam Wand + CoffeeGrinder + Cascades + Tsunami
    | "game_over";
  caffeineLvl: number;
  playerSmashed: boolean;
  setGameStatus: (
    status:
      | "intro"
      | "tutorial"
      | "infinite_room_1"
      | "infinite_room_2"
      | "infinite_room_3"
      | "game_over",
  ) => void;
  setCaffeineLvl: (n: number) => void;
  setPlayerSmashed: (n: boolean) => void;
  isGameOver: boolean;
};

export const useStore = create<Store>((set) => ({
  score: 0,
  isPaused: true,
  isSlowed: true,
  setIsPaused: (n: boolean) => set(() => ({ isPaused: n })),
  setIsSlowed: (n: boolean) => set(() => ({ isSlowed: n })),
  setScore: (n) => set(() => ({ score: n })),
  game_status: "tutorial",
  caffeineLvl: 50,
  playerSmashed: false,
  setGameStatus: (status) => set(() => ({ game_status: status })),
  setCaffeineLvl: (n) => set(() => ({ caffeineLvl: n })),
  setPlayerSmashed: (n) => set(() => ({ playerSmashed: n })),
  isGameOver: false,
}));
