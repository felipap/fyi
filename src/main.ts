import 'source-map-support/register'

import { app, BrowserWindow } from 'electron'
import started from 'electron-squirrel-startup'
import { setupIPC } from './ipc'
import { getImagePath } from './lib/utils'
import { startNuggets } from './tray'
import { createMenuWindow, createSettingsWindow, prefWindow } from './windows'

// if (app.isPackaged) {
//   SentryInit({
//     dsn: 'https://df66516e528e1e116926f9631fca55f3@o175888.ingest.us.sentry.io/4509567206555648',
//     release: app.getVersion(),
//     ipcMode: IPCMode.Classic,
//   })
// }

app.setAboutPanelOptions({
  applicationName: `FYI ${app.isPackaged ? '' : '(dev)'}`,
  copyright: 'Copyright © 2025 FYI',
  version: app.getVersion(),
  // authors: ['Felipe Aragão <faragaop@gmail.com>'],
  credits: 'Felipe Aragão @feliparagao',
  website: 'https://github.com/faragao/fyi',
  iconPath: getImagePath('original.png'),
})

async function onInit() {
  setupIPC()
  createMenuWindow()
  createSettingsWindow()
  startNuggets()

  // Hide dock icon on macOS initially (Settings window starts hidden)
  if (process.platform === 'darwin') {
    app.dock.hide()
  }

  // MCP (later)
  // export const mcpApp = createMcpApp()
  // mcpApp.listen(3040, () => {
  //   console.log('MCP Stateless Streamable HTTP Server listening on port 3040')
  // })
}

// Function to handle app quitting
async function quitApp() {
  console.log('Will quit.')

  // if (!app.isPackaged) {
  //   const { response } = await dialog.showMessageBox({
  //     type: "question",
  //     buttons: ["Yes", "No"],
  //     title: "Confirm",
  //     message: "Are you sure you want to quit?",
  //   })

  //   if (response === 1) return // User clicked "No"
  // }

  app.isQuitting = true
  app.quit()
  process.exit(0)
}

//
//
//
//

// Declare `isQuitting`
declare global {
  namespace Electron {
    interface App {
      isQuitting?: boolean
    }
  }
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit()
}

app.setAppUserModelId(app.getName())

// Prevent multiple instances of the app
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  console.log('Did not get lock. Quitting.')
  quitApp()
} else {
  app.on('second-instance', (event, commandLine) => {
    // Someone tried to run a second instance, focus our window instead
    if (prefWindow) {
      if (prefWindow.isMinimized()) {
        prefWindow.restore()
      }
      prefWindow.focus()
    }

    // // Protocol handler for win32
    // // argv: ["electron.exe", "--", "buddy://auth/callback?session_token=..."]
    // if (process.platform === 'win32') {
    //   const url = commandLine.pop()
    //   if (url) {
    //     handleProtocolCallback(url)
    //   }
    // }
  })
}

app.whenReady().then(() => {
  onInit()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    quitApp()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createSettingsWindow()
  }
})

// Before app quits
app.on('before-quit', () => {
  app.isQuitting = true
})
