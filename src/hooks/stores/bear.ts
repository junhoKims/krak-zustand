import { createActions } from "../../libs/zustand";

type BearState = {
  bears: number;
  actions: {
    increase: () => void;
  };
};

export const useBearStore = createActions<BearState>((set) => ({
  bears: 0,
  actions: {
    increase: () => set((state) => ({ bears: state.bears + 1 })),
  },
}));
