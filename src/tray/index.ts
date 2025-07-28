import { log } from '../lib/logger'
import { getState } from '../store'
import { Nugget, startNuggetLoop } from './Nugget'

const nuggets: Nugget[] = []

// setPartialState({
//   nuggets: [
//     {
//       id: '1',
//       createdAt: new Date(),
//       prompt: 'What is the weather in Tokyo?',
//       frequencyMs: 60 * 1000, // Every 1 min
//     },
//     {
//       id: '2',
//       createdAt: new Date(),
//       prompt: 'What is the weather in Tokyo?',
//       frequencyMs: 60 * 1000, // Every 1 min
//     },
//   ],
// })

export function startNuggets() {
  for (const state of getState().nuggets) {
    const nugget = new Nugget(state)
    nuggets.push(nugget)
  }

  for (const nugget of nuggets) {
    log('[tray] Starting nugget loop', nugget.state.id)
    startNuggetLoop(nugget)
  }
}
