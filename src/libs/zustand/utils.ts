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

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

/**
 * store의 state를 selector를 통해 아토믹하게 접근할 수 있도록 만들어주는 함수
 *
 * @example
 * // 함수를 사용하여 selector로 직접 state에 접근할 수 있는 store를 리턴
 * export const useBearStore = createSelectors(
 *   createActions<BearState>(set => ({
 *     bears: 0,
 *     increase: by => set(state => ({ bears: state.bears + by })),
 *   }))
 * );
 *
 * // selector 접근 가능해진 store를 사용하여 state 가져오기
 * const bears = useBearStore.use.bears()
 * const increment = useBearStore.use.increment()
 */
export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};

  Object.keys(store.getState()).forEach(k => {
    // @ts-ignore
    store.use[k] = () => store(s => s[k as keyof typeof s]);
  });

  return store;
};
