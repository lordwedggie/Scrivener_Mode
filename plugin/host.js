return {
  name: 'scrivener-pane-host',
  apply(ctx) {
    const fs = ctx.get('fs')
    const sessions = ctx.get('sessions')
    const policyService = ctx.get('sandboxPolicy')

    function pickFile(a) {
      if (a && a.file === 'images.md') return 'images.md'
      if (a && a.file === 'videos.md') return 'videos.md'
      return 'draft.md'
    }

    harness.handle('scrivener/read', async (args) => {
      const a = args && typeof args === 'object' ? args : {}
      if (fs === undefined) return { ok: false, error: 'fs service unavailable' }
      try {
        const cwd = typeof a.cwd === 'string' ? a.cwd : undefined
        const target = await fs.resolve(pickFile(a), cwd ? { cwd } : {})
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
        const file = pickFile(a)
        const target = await fs.resolve(file, cwd ? { cwd } : {})
        let policy
        if (policyService !== undefined && typeof policyService.resolve === 'function') {
          let session
          if (sessions !== undefined && typeof sessions.get === 'function' && typeof a.sessionId === 'string') {
            try {
              session = sessions.get(a.sessionId)
            } catch {
              session = undefined
            }
          }
          try {
            policy = policyService.resolve(session ? { session: session } : undefined)
          } catch {
            policy = undefined
          }
        }
        // Fallback: when the session lookup or the policy fold fails, fence the
        // write to the pane's own cwd (the pane only writes inside the session
        // workspace). Without this, the fs backend defaults to workspace-write
        // rooted at the process cwd and every save gets denied.
        if (policy === undefined || typeof policy.workspaceRoot !== 'string' || policy.workspaceRoot === '') {
          policy = { mode: 'workspace-write', workspaceRoot: cwd }
        }
        await fs.writeText(target, text, undefined, undefined, policy)
        return { ok: true, path: typeof fs.processPath === 'function' ? fs.processPath(target) : file }
      } catch (error) {
        return { ok: false, error: String((error && error.message) || error) }
      }
    })
  }
}
