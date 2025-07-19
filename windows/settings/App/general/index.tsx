import { openExternal, openGithubDiscussion } from '../../../shared/ipc'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { Hr } from '../ui'
import { DoubleNudgeInput } from './DoubleNudgeInput'
import { FrequencyInput } from './FrequencyInput'
import { LaunchOnStartup } from './LaunchOnStartup'

export const General = withBoundary(() => {
  return (
    <main className="flex flex-col justify-between h-full p-4 text-[13px] w-full">
      {/* <About />z */}
      <div className="flex flex-col gap-4">
        <section>
          <FrequencyInput />
        </section>
        <Hr />
        <section>
          <DoubleNudgeInput />
        </section>
        <Hr />
        <section>
          <LaunchOnStartup />
        </section>
      </div>
      <div className="flex-1"></div>
      <div>
        <NeedHelpFooter />
      </div>
    </main>
  )
})

function About() {
  return (
    <section className="flex flex-col gap-1 items-start">
      <header className="mb-2 flex flex-col gap-0.5">
        <div className="flex flex-row items-center">
          <h2 className="text-[18px] font-medium text-black">Nudge</h2>
        </div>

        <p className="">AI that nudges you to stay focused.</p>

        <p>
          By{' '}
          <button
            onClick={() => openExternal('https://pi.engineering')}
            className="text-link"
          >
            pi.engineering
          </button>
        </p>
      </header>

      <div className="flex flex-row gap-2 items-center justify-between">
        <p>Version 1.0</p>
        <button
          onClick={() => openExternal('https://github.com/felipap/fyi')}
          className="text-link "
        >
          GitHub repo
        </button>
      </div>
    </section>
  )
}

export function NeedHelpFooter() {
  return (
    <div className="text-secondary">
      Need help? Ask questions on{' '}
      <button
        onClick={() => {
          openGithubDiscussion()
        }}
        className="text-link hover:underline"
      >
        GitHub
      </button>
      .
    </div>
  )
}
