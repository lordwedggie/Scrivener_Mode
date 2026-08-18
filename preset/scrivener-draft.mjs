/**
 * Scrivener preset draft tool — the model-facing `scrivener_draft` tool.
 *
 * The model calls this to post generated prose into the session's draft file
 * (`draft.md` in the session workspace), which the Scrivener editor pane reads
 * and edits. `replace` overwrites the whole draft; `append` adds the text at
 * the end of the current draft.
 *
 * Registered against the host `tools` registry; provides no service, so the
 * row needs no isolate realm (same rule as the shipped filesystem tools).
 *
 * NOTE: no `@deepseek-ai/dsh-tools` import here — ESM imports inside a
 * preset-local module resolve from the preset directory, which cannot see the
 * harness packages. The definition below is the raw JSON-Schema form
 * `defineTool` itself compiles to, so `tools.register()` accepts it verbatim.
 */

export const name = 'scrivener-draft'

/** Hard dependencies: the tool registry and the filesystem provider. */
export const inject = ['tools', 'fs']

const PARAMETERS = {
  type: 'object',
  properties: {
    text: {
      type: 'string',
      description: 'The complete passage to place in the draft.',
    },
    mode: {
      type: 'string',
      enum: ['replace', 'append'],
      description: 'replace (default) overwrites the draft; append adds at the end.',
    },
  },
  required: ['text'],
}

const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    ok: { type: 'boolean' },
    path: { type: 'string' },
  },
  required: ['ok', 'path'],
  additionalProperties: false,
}

export function apply(ctx) {
  ctx.tools.register({
    name: 'scrivener_draft',
    description:
      'Post generated prose into the Scrivener editor draft. Use it whenever you wrote a passage the user should see and edit in the right-side editor pane. The text lands in draft.md in the session workspace (replace overwrites the whole draft, append adds to its end).',
    parameters: PARAMETERS,
    output: {
      schema: OUTPUT_SCHEMA,
      render(_args, value) {
        return [{ type: 'text', text: value.ok ? `Draft written to ${value.path}` : `Draft write failed: ${value.path}` }]
      },
    },
    async execute(args, exec) {
      const a = args && typeof args === 'object' ? args : {}
      const session = exec && exec.agent && exec.agent.session
      const cwd = session && session.header && typeof session.header.cwd === 'string'
        ? session.header.cwd
        : undefined
      const target = await ctx.fs.resolve('draft.md', cwd ? { cwd } : {})
      const text = String(a.text || '')

      let content = text
      if (a.mode === 'append') {
        try {
          const existing = await ctx.fs.readText(target)
          content = existing.endsWith('\n') ? existing + text : existing + '\n' + text
        } catch {
          // No existing draft — start fresh.
          content = text
        }
      }

      const policyService = ctx.get('sandboxPolicy')
      const policy = policyService !== undefined && typeof policyService.resolve === 'function'
        ? policyService.resolve(session ? { session } : undefined)
        : undefined
      await ctx.fs.writeText(target, content, undefined, undefined, policy)
      const processPath = typeof ctx.fs.processPath === 'function' ? ctx.fs.processPath(target) : 'draft.md'
      return { ok: true, path: processPath }
    },
  })
}
