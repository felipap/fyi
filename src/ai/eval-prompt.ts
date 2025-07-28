import { log } from '../lib/logger'
// import { evalPromptFromNudgeAPI } from './cloud/goal-feedback'
import { BackendClient } from './models'
import { evalPromptFromOpenAI } from './openai/eval-prompt'
import { Result } from './openai/utils'

export type PromptResult = {
  result: string
}

export type PromptResultResult = Result<PromptResult>

export async function evalPrompt(
  client: BackendClient,
  prompt: string
): Promise<PromptResultResult> {
  log('client.provider', client.provider)

  if (client.provider === 'nudge') {
    throw Error('Not implemented')
    // return await evalPromptFromOpenAI(prompt)
  }

  return await evalPromptFromOpenAI(client.openAiClient, prompt)
}
