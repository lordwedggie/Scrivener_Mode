return {
  name: 'scrivener-pane-host',
  apply(ctx) {
    const fs = ctx.get('fs')
    const sessions = ctx.get('sessions')
    const policyService = ctx.get('sandboxPolicy')

    harness.handle('scrivener/read', async (args) => {
      const a = args && typeof args === 'object' ? args : {}
      if (fs === undefined) return { ok: false, error: 'fs service unavailable' }
      try {
        const cwd = typeof a.cwd === 'string' ? a.cwd : undefined
        const target = await fs.resolve('draft.md', cwd ? { cwd } : {})
        const info = await fs.stat(target)
        if (info === undefined) return { ok: true, text: '', missing: true }
        const text = await fs.readText(target)
        return { ok: true, text: text }
      } catch (error) {
        return { ok: false, error: String((error && error.message) || error) }
      }
    })

    harness.handle('scrivener/save', async (args) => {
      const a = args && typeof args === 'object' ? args : {}
      if (fs === undefined) return { ok: false, error: 'fs service unavailable' }
      try {
        const cwd = typeof a.cwd === 'string' && a.cwd !== '' ? a.cwd : undefined
        const text = typeof a.text === 'string' ? a.text : ''
        const target = await fs.resolve('draft.md', cwd ? { cwd } : {})
        let policy
        if (policyService !== undefined && typeof policyService.resolve === 'function') {
          let session
          if (sessions !== undefined && typeof sessions.get === 'function' && typeof a.sessionId === 'string') {
            session = sessions.get(a.sessionId)
          }
          try {
            policy = policyService.resolve(session ? { session: session } : undefined)
          } catch {
            policy = undefined
          }
        }
        await fs.writeText(target, text, undefined, undefined, policy)
        return { ok: true, path: typeof fs.processPath === 'function' ? fs.processPath(target) : 'draft.md' }
      } catch (error) {
        return { ok: false, error: String((error && error.message) || error) }
      }
    })
  }
}
