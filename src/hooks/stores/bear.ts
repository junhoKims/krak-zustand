import { createActions, createSelectors } from "../../libs/zustand";

type BearState = {
  bears: number;
  actions: {
    increase: () => void;
  };
};

export const useBearStore = createSelectors(
  createActions<BearState>((set) => ({
    bears: 0,
    actions: {
      increase: () => set((state) => ({ bears: state.bears + 1 })),
    },
  }))
);
