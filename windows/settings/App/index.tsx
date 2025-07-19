import { useEffect, useState } from 'react'
import { Nav, Tab } from './Nav'
import { General } from './general'
import { ModelTab } from './model'

export default function App() {
  const [tab, setTab] = useState<Tab>('general')

  // Don't change this until user reloads the settings window.

  useEffect(() => {
    const unsubscribe = window.electronAPI.onIpcEvent(
      'open-settings-tab',
      (tabName: string) => {
        if (tabName === 'general' || tabName === 'model') {
          setTab(tabName as Tab)
        }
      }
    )

    return unsubscribe
  }, [])

  return (
    <div className="flex flex-col h-screen text-contrast">
      <Nav tab={tab} onTabChange={setTab} />
      <div className="overflow-scroll bg-background h-full flex w-full select-none">
        <div className="w-full">
          {tab === 'general' && <General />}
          {tab === 'model' && <ModelTab />}
        </div>
      </div>
    </div>
  )
}
