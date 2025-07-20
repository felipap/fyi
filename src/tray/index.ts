// This file is a huge mess, please help.

import assert from 'assert'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
  Tray,
  app,
  nativeImage,
  nativeTheme,
} from 'electron'
import { getImagePath, isTruthy } from '../lib/utils'
import { hasFinishedOnboardingSteps } from '../store'
import { onClickCheckForUpdates, updaterState } from '../updater'
import { prefWindow, menuWindow } from '../windows'

type TrayConfig = {
  id: string
}

const TRAYS: TrayConfig[] = []

dayjs.extend(relativeTime)

export function createTray() {
  assert(prefWindow)
  assert(menuWindow)

  // For a real app, you'd use a proper icon file
  // tray = new Tray(path.join(__dirname, "../../icon.png"))

  const iconPath = getImagePath(`tray-default.png`)
  const icon = nativeImage.createFromPath(iconPath)
  // if you want to resize it, be careful, it creates a copy
  const trayIcon = icon.resize({ width: 18, quality: 'best' })
  // here is the important part (has to be set on the resized version)
  trayIcon.setTemplateImage(true)

  const tray = new Tray(trayIcon)

  // Set up theme change listener
  nativeTheme.on('updated', () => {
    // No need to update menu since we're not using context menu
  })

  // Add click handlers
  tray.on('click', () => {
    // Left click shows the menuWindow
    if (menuWindow) {
      if (menuWindow.isVisible()) {
        menuWindow.hide()
      } else {
        // Get tray bounds to position the window underneath
        const trayBounds = tray.getBounds()

        // Position the window under the tray
        // On macOS, tray is typically in the top-right menu bar
        const x = trayBounds.x - menuWindow.getBounds().width + trayBounds.width
        const y = trayBounds.y + trayBounds.height

        menuWindow.setPosition(x, y)
        menuWindow.show()
        menuWindow.focus()
      }
    }
  })

  tray.on('right-click', () => {
    // Right click shows the context menu
    const contextMenu = Menu.buildFromTemplate(buildTrayMenu())
    tray.popUpContextMenu(contextMenu)
  })

  function buildTrayMenu() {
    let template: (MenuItemConstructorOptions | MenuItem | false)[] = []
    if (!hasFinishedOnboardingSteps()) {
    } else {
      template.push({
        label: 'Something that the AI.',
        // click: () => {
        //   screenCapture.triggerCaptureAssessAndNudge()
        //   // ipcMain.emit('captureNow', null)
        //   updateTrayMenu()
        // },
      })
      template.push({ type: 'separator' })
    }

    template = template.concat([
      {
        label: 'Settings...',
        accelerator: 'CmdOrCtrl+,',
        click: () => {
          prefWindow!.show()
        },
      },
      { type: 'separator' },
      {
        label: `Version ${app.getVersion()}${app.isPackaged ? '' : ' (dev)'}`,
        enabled: false,
      },
    ])

    if (updaterState === 'downloaded') {
      template.push({
        label: 'Quit & install update',
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          app.quit()
        },
      })
    } else {
      template.push({
        enabled: updaterState !== 'downloading',
        label:
          updaterState === 'downloading'
            ? 'Downloading update...'
            : 'Check for updates...',
        click: async () => {
          await onClickCheckForUpdates()
        },
      })
      template.push({
        label: 'Quit',
        sublabel: '⌘Q',
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          // app.isQuitting = true // Do we need this?
          app.quit()
        },
      })
    }

    return template.filter(isTruthy)
  }

  // Set initial tooltip
  tray.setToolTip('Buddy\nWhat!')

  return tray
}
