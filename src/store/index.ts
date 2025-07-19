import { create, StoreApi } from 'zustand'
import { persist } from 'zustand/middleware'
import { fileStore } from './backend'
import type { State } from './types'
import { DEFAULT_STATE } from './types'

export * from './types'

export const store = create<State>()(
  persist((set, get, store: StoreApi<State>) => DEFAULT_STATE, {
    name: 'store',
    storage: {
      getItem: (name) => {
        const value = fileStore.get(name)
        return value
      },
      setItem: (name, value) => {
        fileStore.set(name, value)
      },
      removeItem: (name) => {
        fileStore.delete(name)
      },
    },
  })
)

//
//
//
//
//
//
//
//
//

export const setPartialState = (partial: Partial<State>) => {
  store.setState(partial)
}

export const getState = () => store.getState()

//
//
//
// Session

export function hasFinishedOnboardingSteps() {
  const state = store.getState()

  const hasOpenAiKey = !!state.modelSelection?.key
  const isUsingCloud = state.useNudgeCloud

  return hasOpenAiKey || isUsingCloud
}
