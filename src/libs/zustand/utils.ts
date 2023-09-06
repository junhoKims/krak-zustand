import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Mutate, StateCreator, StoreApi, StoreMutatorIdentifier, UseBoundStore } from 'zustand';

/**
 * 개발환경에서는 devtools를 포함한 state 및 action에 대한 Creater를 리턴.
 *
 * 라이브환경에서는 devtools 없이 순수 Creater를 리턴.
 *
 * @example
 * // 0. 기본 사용
 * export const useBearStore = createActions<BearState>(set => ({
 *   bears: 0,
 *   increase: by => set(state => ({ bears: state.bears + by })),
 * }));
 *
 * // 1. 미들웨어를 포함
 * export const useBearStore = create<BearState>()(
 *   persist(
 *     createActions(set => ({
 *       bears: 0,
 *       increase: by => set(state => ({ bears: state.bears + by })),
 *       increment: () => set(state => ({ bears: state.bears + 1 })),
 *     })),
 *     { name: 'user-StoreName' }
 *   )
 * );
 */
export const createActions = <T, Mos extends [StoreMutatorIdentifier, unknown][] = []>(
  initializer: StateCreator<T, [], Mos>
): UseBoundStore<Mutate<StoreApi<T>, [...Mos]>> => {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    return create(devtools(initializer) as StateCreator<T, [], Mos>);
  }

  return create(initializer);
};

export const createSelectors = {}