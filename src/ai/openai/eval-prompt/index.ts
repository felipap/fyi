import { OpenAI } from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'
import { log, warn } from '../oai-logger'
import { Result, safeOpenAIStructuredCompletion } from '../utils'

const OutputStruct = z.object({
  result: z.string().describe('The result of the prompt.'),
})

export type Output = z.infer<typeof OutputStruct>

export async function evalPromptFromOpenAI(
  client: OpenAI,
  prompt: string
): Promise<Result<Output>> {
  const res = await safeOpenAIStructuredCompletion<Output>(client, {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: `Prompt: "${prompt}"`,
      },
    ],
    temperature: 0.2,
    response_format: zodResponseFormat(OutputStruct, 'EvalPrompt'),
  })

  if ('error' in res) {
    warn('[ai/eval-prompt] Error evaluating prompt', res)
    return res
  }

  log('[ai/eval-prompt] result', res)

  return res
}

// Keep in sync with nudge/src/lib/ai/eval-prompt/direct.ts
const SYSTEM_PROMPT = `
Do what the user tells you to do.
`.trim()
