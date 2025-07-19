// To share between renderer and main process.

import type { State } from '../../src/store/types'

//
//
// Misc

export type ModelError =
  | 'unknown'
  | 'no-api-key'
  | 'bad-api-key'
  | 'rate-limit'
  | 'no-internet'

//
//
// Available models

export type AvailableModel = 'openai-4o' | 'openai-4o-mini'

export const AVAILABLE_MODELS: { name: string; value: AvailableModel }[] = [
  { name: 'OpenAI 4o mini', value: 'openai-4o' },
]

//
//
// IPC types

// Methods shared between window.electronAPI and ipcRenderer/ipcMain. These
// methods are usually just wrappers around the ipcMain/ipcRenderer methods.
type SharedIpcMethods = {
  getState: () => Promise<State>
  setPartialState: (state: Partial<State>) => Promise<void>
  listenToggleDarkMode: (callback: (isDarkMode: boolean) => void) => void
  getSystemTheme: () => Promise<string>
  setWindowHeight: (height: number, animate?: boolean) => Promise<void>
  getWindowHeight: () => Promise<number>
  closeWindow: () => void
  minimizeWindow: () => void
  zoomWindow: () => void
  openExternal: (url: string) => Promise<void>
  clearActiveCapture: () => Promise<void>
  openGithubDiscussion: () => Promise<void>
  openSystemSettings: () => Promise<void>
  validateModelKey: (model: AvailableModel, key: string) => Promise<boolean>
  setAutoLaunch: (enable: boolean) => Promise<void>
  getAutoLaunch: () => Promise<boolean>
  openSettings: (tab?: string) => Promise<void>
  isAppPackaged: () => Promise<boolean>
}

export type IpcMainMethods = SharedIpcMethods & {
  'dark-mode:toggle': () => Promise<boolean>
  'dark-mode:system': () => Promise<void>
}

export type ExposedElectronAPI = SharedIpcMethods & {
  // Listen for background action completion
  onBackgroundActionCompleted: (
    callback: (actionName: string) => void
  ) => () => void
  onIpcEvent: (
    channel: string,
    callback: (...args: any[]) => void
  ) => () => void
  onStateChange: (callback: (state: State) => void) => () => void
}
