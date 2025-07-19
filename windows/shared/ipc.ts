import { useEffect, useRef, useState } from 'react'
import { State } from '../../src/store/types'
import { AvailableModel, ExposedElectronAPI } from './shared-types'

declare global {
  interface Window {
    electronAPI: ExposedElectronAPI
  }
}

export async function getState() {
  return await window.electronAPI.getState()
}

export async function setAutoLaunch(enable: boolean) {
  return await window.electronAPI.setAutoLaunch(enable)
}

export async function getAutoLaunch() {
  return await window.electronAPI.getAutoLaunch()
}

export async function openSettings(tab?: string) {
  return await window.electronAPI.openSettings(tab)
}

export async function setWindowHeight(height: number, animate = false) {
  return await window.electronAPI.setWindowHeight(height, animate)
}

export async function getWindowHeight() {
  return await window.electronAPI.getWindowHeight()
}

export async function validateModelKey(model: AvailableModel, key: string) {
  return await window.electronAPI.validateModelKey(model, key)
}

export async function openExternal(url: string) {
  return await window.electronAPI.openExternal(url)
}

export async function openGithubDiscussion() {
  return await window.electronAPI.openGithubDiscussion()
}

export async function openSystemSettings() {
  return await window.electronAPI.openSystemSettings()
}

//

export function closeWindow() {
  window.electronAPI.closeWindow()
}

export function minimizeWindow() {
  window.electronAPI.minimizeWindow()
}

export function zoomWindow() {
  window.electronAPI.zoomWindow()
}

// State

export async function clearActiveCapture() {
  return await window.electronAPI.clearActiveCapture()
}

export async function setPartialState(state: Partial<State>) {
  return await window.electronAPI.setPartialState(state)
}

export function useBackendState() {
  const [state, setState] = useState<State | null>(null)
  const stateRef = useRef<State | null>(null)

  useEffect(() => {
    async function load() {
      const state = await window.electronAPI.getState()
      stateRef.current = state
      setState(state)
    }
    load()

    // Subscribe to state changes
    const unsubscribe = window.electronAPI.onStateChange((newState) => {
      stateRef.current = newState
      setState(newState)
    })

    // Cleanup subscription on unmount
    return () => {
      unsubscribe()
    }
  }, [])

  return {
    state,
    stateRef,
    setPartialState,
  }
}
