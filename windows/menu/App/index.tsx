import { useEffect, useState } from 'react'
import { openSettings, useBackendState } from '../../shared/ipc'
import { withBoundary } from '../../shared/ui/withBoundary'
import { Menu, MenuItem, MenuSeparator } from './ui/Menu'

function useNuggetState(id: string | undefined) {
  const { state } = useBackendState()
  const nugget = state?.nuggets.find((nugget) => nugget.id === id)

  return { nugget }
}

export default function App() {
  const [nuggetId, setNuggetId] = useState<string | null>('1')

  useEffect(() => {
    const unsubscribe = window.electronAPI.onIpcEvent(
      'set-nugget-id',
      (id: string) => {
        setNuggetId(id)
      }
    )
    return unsubscribe
  }, [])

  registerGlobalShortcuts()

  if (!nuggetId) {
    return <div>Waiting for nugget information...</div>
  }

  return (
    <div className="flex flex-col h-screen text-contrast [app-region:drag] bg-white/50 dark:bg-transparent">
      <NuggetMenu nuggetId={nuggetId} />
    </div>
  )
}

interface MenuProps {
  nuggetId: string
}

const NuggetMenu = withBoundary(({ nuggetId }: MenuProps) => {
  const { nugget } = useNuggetState(nuggetId)

  return (
    <Menu>
      <MenuItem label={nugget?.prompt ?? ''} onClick={() => {}} />
      <MenuSeparator />
      <MenuItem
        label={nugget?.lastResult ?? '--'}
        onClick={() => {}}
        className="flex-1 items-start"
      />
      <MenuSeparator />
      <MenuItem label="Quit" shortcut="⌘ Q" onClick={() => {}} />
      <MenuItem disabled label={`ID: ${nuggetId}`} />
    </Menu>
  )
})

function registerGlobalShortcuts() {
  // Register cmd+, for settings.

  useEffect(() => {
    function onSettingsShortcut() {
      openSettings()
    }

    document.addEventListener('keydown', onSettingsShortcut)

    return () => {
      document.removeEventListener('keydown', onSettingsShortcut)
    }
  }, [])
}
