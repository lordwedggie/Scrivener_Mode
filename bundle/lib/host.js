import { appendFileSync } from 'node:fs'
import { join } from 'node:path'

export const name = 'scr-pane-host'
export const inject = ['webServer']

function dbg(message) {
  try {
    appendFileSync(join(process.env.USERPROFILE ?? '.', '.dsh', 'scr-api-debug.log'), new Date().toISOString() + ' ' + message + '\n')
  } catch (error) {
    // debug log is best-effort
  }
}

/**
 * Scrivener pane host half (durable web bundle).
 * Serves the pane's per-workspace file reads/writes over /scr-api:
 *   GET  /scr-api/read?file=<draft.md|images.md|videos.md>&cwd=<...>
 *   POST /scr-api/save  { cwd, sessionId, file, text }
 */
export function apply(ctx) {
  const fs = ctx.get('fs')
  const sessions = ctx.get('sessions')
  const policyService = ctx.get('sandboxPolicy')

  function pickFile(file) {
    if (file === 'images.md') return 'images.md'
    if (file === 'videos.md') return 'videos.md'
    return 'draft.md'
  }

  function json(res, code, body) {
    try {
      res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' })
      res.end(JSON.stringify(body))
    } catch (error) {
      // response already ended
    }
  }

  async function readBody(req) {
    let raw = ''
    for await (const chunk of req) raw += chunk
    if (raw === '') return {}
    try { return JSON.parse(raw) } catch (error) { return {} }
  }

  /**
   * Resolve the sandbox policy for the calling session. When the live-session
   * lookup or the policy fold fails, fall back to a workspace-write policy
   * rooted at the cwd the pane itself supplied (the pane only ever writes
   * inside the session workspace, so this is the safe floor).
   */
  function resolvePolicy(sessionId, cwd) {
    let policy
    if (policyService !== undefined && typeof policyService.resolve === 'function') {
      let session
      if (sessions !== undefined && typeof sessions.get === 'function' && typeof sessionId === 'string') {
        try {
          session = sessions.get(sessionId)
        } catch (error) {
          dbg('sessions.get threw: ' + String(error && error.message))
        }
      }
      dbg('save sessionId=' + String(sessionId) + ' found=' + String(session !== undefined) + (session !== undefined && session.header ? ' headerCwd=' + String(session.header.cwd) : ''))
      try {
        policy = policyService.resolve(session !== undefined ? { session } : undefined)
        dbg('resolved policy: ' + JSON.stringify({ mode: policy.mode, workspaceRoot: policy.workspaceRoot }))
      } catch (error) {
        dbg('policy resolve threw: ' + String(error && error.message))
        policy = undefined
      }
    }
    if (policy === undefined || typeof policy.workspaceRoot !== 'string' || policy.workspaceRoot === '') {
      policy = { mode: 'workspace-write', workspaceRoot: cwd }
      dbg('fallback policy: ' + JSON.stringify(policy))
    }
    return policy
  }

  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: '/scr-api',
    handler: async (req, res) => {
      try {
        const url = new URL(req.url ?? '/', 'http://x')
        const path = url.pathname
        if (path === '/scr-api/read') {
          if (fs === undefined) return json(res, 500, { ok: false, error: 'fs service unavailable' })
          try {
            const cwd = url.searchParams.get('cwd') || undefined
            const file = pickFile(url.searchParams.get('file') || '')
            const target = await fs.resolve(file, cwd ? { cwd } : {})
            const info = await fs.stat(target)
            if (info === undefined) return json(res, 200, { ok: true, text: '', missing: true })
            const text = await fs.readText(target)
            return json(res, 200, { ok: true, text })
          } catch (error) {
            return json(res, 500, { ok: false, error: String((error && error.message) || error) })
          }
        }
        if (path === '/scr-api/save' && req.method === 'POST') {
          if (fs === undefined) return json(res, 500, { ok: false, error: 'fs service unavailable' })
          try {
            const body = await readBody(req)
            const cwd = typeof body.cwd === 'string' && body.cwd !== '' ? body.cwd : undefined
            const text = typeof body.text === 'string' ? body.text : ''
            const file = pickFile(typeof body.file === 'string' ? body.file : '')
            const target = await fs.resolve(file, cwd ? { cwd } : {})
            const policy = resolvePolicy(body.sessionId, cwd)
            await fs.writeText(target, text, undefined, undefined, policy)
            dbg('save ok: file=' + file + ' cwd=' + String(cwd))
            return json(res, 200, { ok: true, path: typeof fs.processPath === 'function' ? fs.processPath(target) : file })
          } catch (error) {
            dbg('save failed: ' + String((error && error.message) || error))
            return json(res, 500, { ok: false, error: String((error && error.message) || error) })
          }
        }
        return json(res, 404, { ok: false, error: 'not found' })
      } catch (error) {
        return json(res, 500, { ok: false, error: String((error && error.message) || error) })
      }
    }
  }), 'scr-pane: /scr-api routes')
}
