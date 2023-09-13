import { createActions, createSelectors } from "@/libs/zustand";

type BearState = {
  bears: number;
};

type BearAction = {
  actions: {
    increase: () => void;
    clear: () => void;
  };
};

type BearStore = BearState & BearAction;

const INITIAL_STATES: BearState = {
  bears: 0,
};

export const useBearStore = createSelectors(
  createActions<BearStore>((set) => ({
    ...INITIAL_STATES,
    actions: {
      increase: () => set((state) => ({ bears: state.bears + 1 })),
      clear: () => set(() => INITIAL_STATES),
    },
  }))
);
