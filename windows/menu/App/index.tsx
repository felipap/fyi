import { useEffect } from 'react'
import '../../shared/ipc'
import { Menu, MenuItem, MenuSeparator } from './ui/Menu'

export default function App() {
  useEffect(() => {
    const unsubscribe = window.electronAPI.onIpcEvent(
      'open-settings-tab',
      (tabName: string) => {}
    )

    return unsubscribe
  }, [])

  return (
    <div className="flex flex-col h-screen text-contrast">
      <Menu>
        <MenuItem label="Something that the AI." onClick={() => {}} />
        <MenuSeparator />
        <MenuItem label="Settings..." shortcut="⌘ ," onClick={() => {}} />
        <MenuSeparator />
        <MenuItem disabled label="Version 1.0.0" onClick={() => {}} />
        <MenuItem label="Check for updates..." onClick={() => {}} />
        <MenuItem label="Quit" shortcut="⌘ Q" onClick={() => {}} />
      </Menu>
    </div>
  )
}
