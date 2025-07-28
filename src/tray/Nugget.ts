// This file is a huge mess, please help.

import assert from 'assert'
import {
  app,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
  nativeImage,
  nativeTheme,
  Tray,
} from 'electron'
import { getAiBackendClient } from '../ai'
import { evalPrompt } from '../ai/eval-prompt'
import { getImagePath, isTruthy } from '../lib/utils'
import { getState, hasFinishedOnboardingSteps, setPartialState } from '../store'
import { NuggetState } from '../store/types'
import { onClickCheckForUpdates, updaterState } from '../updater'
import { menuWindow, prefWindow } from '../windows'

export class Nugget {
  tray: Tray

  constructor(public state: NuggetState) {
    this.tray = this.createTray()
  }

  // evaluate
  async loop() {
    const aiClient = getAiBackendClient()
    if (!aiClient) {
      return
    }

    const res = await evalPrompt(aiClient, this.state.prompt)
    console.log('res is', res)
    if ('error' in res) {
      this.#updateState({
        lastResultError: res.error,
        lastRunAt: new Date(),
      })
      return
    }

    this.#updateState({
      lastResult: res.data.result,
      lastRunAt: new Date(),
    })

    console.log(res.data)
  }

  #updateState(state: Partial<Omit<NuggetState, 'id'>>) {
    setPartialState({
      nuggets: getState().nuggets.map((nugget) =>
        nugget.id === this.state.id ? { ...nugget, ...state } : nugget
      ),
    })
  }

  createTray() {
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
          const x =
            trayBounds.x - menuWindow.getBounds().width + trayBounds.width
          const y = trayBounds.y + trayBounds.height

          menuWindow.setPosition(x, y)
          menuWindow.show()
          menuWindow.focus()
          menuWindow!.webContents.send('set-nugget-id', this.state.id)
        }
      }
    })

    tray.on('right-click', () => {
      // Right click shows the context menu
      const contextMenu = Menu.buildFromTemplate(
        buildGenericTrayMenu(this.state)
      )
      tray.popUpContextMenu(contextMenu)
    })

    // Set initial tooltip
    tray.setToolTip('Buddy!')

    return tray
  }
}

export function startNuggetLoop(nugget: Nugget) {
  function outer() {
    try {
      nugget.loop()
    } catch (error) {
      console.error(error)
    }

    setTimeout(outer, nugget.state.frequencyMs) // TODO: use a better timer.
  }

  outer()
}

function buildGenericTrayMenu(nuggetState: NuggetState) {
  let template: (MenuItemConstructorOptions | MenuItem | false)[] = []
  if (!hasFinishedOnboardingSteps()) {
  } else {
    // template.push({ type: 'separator' })
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
