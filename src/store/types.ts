import { AvailableModel } from '../../windows/shared/shared-types'

export type ModelSelection = {
  name: AvailableModel
  key: string | null
  validatedAt: string | null
}

export type NuggetState = {
  id: string
  createdAt: Date
  prompt: string
  frequencyMs: number
  lastRunAt: Date | null
  lastResult: string | null
  lastResultError: string | null
}

export type State = {
  firstOpenedAt: string // date
  lastClosedAt: string | null
  // When true, we'll ignore `modelSelection` and send screenshots to Nudge
  // server.
  useNudgeCloud: boolean
  modelSelection: ModelSelection | null
  // ⬇️ This can't live in the state because it's a system setting.
  // autoLaunch: boolean
  // frontend things
  events?: {
    firstOpenedAt?: Date
    finishedOnboardingAt?: Date
  }
  nuggets: NuggetState[]
}

export const DEFAULT_STATE: State = {
  firstOpenedAt: new Date().toISOString(),
  lastClosedAt: null,
  // settings
  useNudgeCloud: false, // Important to start with false.
  modelSelection: null,
  // frontend things
  nuggets: [],
}
