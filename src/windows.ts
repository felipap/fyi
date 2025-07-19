import { app, BrowserWindow, screen } from 'electron'
import path from 'node:path'
import { getImagePath } from './lib/utils'

declare const PREF_WINDOW_VITE_DEV_SERVER_URL: string
declare const PREF_WINDOW_VITE_NAME: string

export let prefWindow: BrowserWindow | null = null

declare const MENU_WINDOW_VITE_DEV_SERVER_URL: string
declare const MENU_WINDOW_VITE_NAME: string

export let menuWindow: BrowserWindow | null = null

export function createMenuWindow() {
  const primaryDisplay = screen.getPrimaryDisplay()

  const windowWidth = 260
  const windowHeight = 200
  const edgeOffset = 5

  const win = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    minHeight: windowHeight,
    minWidth: windowWidth,
    resizable: false,
    frame: false,
    transparent: true,
    vibrancy: 'fullscreen-ui',
    show: true,
    alwaysOnTop: true,
    x:
      primaryDisplay.workArea.x +
      primaryDisplay.workArea.width -
      windowWidth -
      edgeOffset,
    y: primaryDisplay.workArea.y + edgeOffset,
    webPreferences: {
      preload: path.join(__dirname, '../renderer/preload.js'),
      webSecurity: false,
    },
  })

  win.on('show', () => {
    onChangeAnyWindowVisibility()
  })

  win.on('hide', () => {
    onChangeAnyWindowVisibility()
  })

  // Hide window when it loses focus
  // win.on('blur', () => {
  //   win.hide()
  // })

  // In development, the default icon is Electron's. So we override it.
  if (!app.isPackaged) {
    // app.dock.setIcon('images/icon-development.png')
  }

  // -----

  // and load the index.html of the app.
  if (MENU_WINDOW_VITE_DEV_SERVER_URL) {
    win.loadURL(MENU_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(
      path.join(__dirname, `../renderer/${MENU_WINDOW_VITE_NAME}/index.html`)
    )
  }

  // Hide window to tray on close instead of quitting
  win.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault()
      win.hide()
      return false
    }
    return true
  })

  menuWindow = win

  return win
}

export function createSettingsWindow() {
  const windowWidth = 600
  const windowHeight = 500

  const win = new BrowserWindow({
    // show: !app.isPackaged,
    show: false,
    // alwaysOnTop: true,
    width: windowWidth,
    height: windowHeight,
    minHeight: windowHeight,
    minWidth: windowWidth,
    center: true,
    resizable: false,
    frame: false,
    transparent: true,
    vibrancy: 'fullscreen-ui',
    webPreferences: {
      preload: path.join(__dirname, '../renderer/preload.js'),
      webSecurity: false,
    },
  })

  if (!app.isPackaged) {
    app.dock.setIcon(getImagePath('icon-production.png'))
  }

  // and load the index.html of the app.
  if (PREF_WINDOW_VITE_DEV_SERVER_URL) {
    win.loadURL(PREF_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(
      path.join(__dirname, `../renderer/${PREF_WINDOW_VITE_NAME}/index.html`)
    )
  }

  win.on('show', () => {
    onChangeAnyWindowVisibility()
  })

  win.on('hide', () => {
    onChangeAnyWindowVisibility()
  })

  // Hide window to tray on close instead of quitting
  win.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault()
      win.hide()
      return false
    }
    return true
  })

  prefWindow = win
  return win
}

function onChangeAnyWindowVisibility() {
  const isAnyVisible = prefWindow?.isVisible()

  if (process.platform === 'darwin') {
    if (isAnyVisible) {
      app.dock.show()
    } else {
      app.dock.hide()
    }
  }
}
