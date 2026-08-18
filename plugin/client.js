return {
  name: 'scrivener-pane-client',
  apply(ctx) {
    const slots = ctx.get('slots')
    const sessions = ctx.get('sessions')
    const layout = ctx.get('layout')
    const timer = ctx.get('timer')
    if (slots === undefined || sessions === undefined) return

    styles.insert([
      '.scr-pane{position:relative;width:100%;height:100%;display:flex;flex-direction:column;background:var(--dsw-specific-sidebar-fill,var(--dsw-alias-bg-base,#1e1e28));border-left:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.08));color:var(--dsw-alias-label-primary,#eee);font-size:14px}',
      '.scr-head{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.08))}',
      '.scr-title{font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary,#eee)}',
      '.scr-x{border:none;background:transparent;color:var(--dsw-alias-label-secondary,#bbb);cursor:pointer;font-size:16px;line-height:1;padding:4px}',
      '.scr-editor{flex:1;overflow:auto;padding:16px;white-space:pre-wrap;line-height:1.7;outline:none;color:var(--dsw-alias-label-primary,#eee)}',
      '.scr-foot{display:flex;align-items:center;gap:8px;padding:8px 14px;border-top:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.08));font-size:12px;color:var(--dsw-alias-label-secondary,#bbb);flex-wrap:wrap}',
      '.scr-btn{border:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.12));background:transparent;color:var(--dsw-alias-label-primary,#eee);border-radius:6px;padding:4px 10px;cursor:pointer;font-size:12px}',
      '.scr-btn:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}',
      '.scr-btn:disabled{opacity:.5;cursor:default}',
      '.scr-status{width:100%;color:var(--dsw-alias-label-tertiary,#999)}',
      '.scr-popup{position:absolute;width:300px;box-sizing:border-box;background:var(--dsw-specific-menu,var(--dsw-alias-bg-overlay,#262635));border:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.12));border-radius:10px;padding:10px;box-shadow:var(--dsw-shadow-lv3,0 8px 24px rgba(0,0,0,.4));display:flex;flex-direction:column;gap:8px;pointer-events:auto;z-index:20}',
      '.scr-popup-row{display:flex;gap:8px}',
      '.scr-popup-row button{flex:1;padding:6px 10px;border-radius:6px;border:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.12));background:transparent;color:var(--dsw-alias-label-primary,#eee);cursor:pointer;font-size:13px}',
      '.scr-popup-row button:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}',
      '.scr-popup-row button:disabled{opacity:.5;cursor:default}',
      '.scr-instr{width:100%;box-sizing:border-box;background:transparent;border:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.12));border-radius:6px;padding:6px 8px;color:var(--dsw-alias-label-primary,#eee);font-size:13px;outline:none}',
      '.scr-toggle{border:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.12));background:transparent;color:var(--dsw-alias-label-primary,#eee);border-radius:6px;padding:4px 10px;cursor:pointer;font-size:12px}'
    ].join('\n'))

    let open = false
    const openListeners = new Set()
    function setPaneOpen(value) {
      open = !!value
      openListeners.forEach(function (fn) { try { fn() } catch (e) {} })
    }
    function usePaneOpen() {
      const pair = React.useState(open)
      React.useEffect(function () {
        const fn = function () { pair[1](open) }
        openListeners.add(fn)
        return function () { openListeners.delete(fn) }
      }, [])
      return pair[0]
    }

    const drafts = new Map()

    function nodeText(node) {
      if (!node || !Array.isArray(node.blocks)) return ''
      let out = ''
      for (let i = 0; i < node.blocks.length; i++) {
        const block = node.blocks[i]
        if (block && block.kind === 'text' && typeof block.text === 'string') out += block.text
      }
      return out
    }

    function stripFence(text) {
      const t = String(text || '').trim()
      const m = /^```[a-zA-Z]*\n([\s\S]*?)\n?```$/.exec(t)
      return m ? m[1] : t
    }

    function maxNodeSeq(snapshot) {
      let seq = -1
      if (snapshot && Array.isArray(snapshot.nodes)) {
        for (let i = 0; i < snapshot.nodes.length; i++) {
          const n = snapshot.nodes[i]
          if (n && typeof n.seq === 'number' && n.seq > seq) seq = n.seq
        }
      }
      return seq
    }

    function Controller(props) {
      const preset = props.useSessions(function (s) {
        if (s.current === undefined) return undefined
        const row = s.byId[s.current]
        return row ? row.agentPreset : undefined
      })
      React.useEffect(function () {
        if (preset !== 'scrivener') return
        setPaneOpen(true)
        let disposeRegistration = function () {}
        if (layout !== undefined) {
          try { layout.openDetails() } catch (e) {}
        }
        disposeRegistration = slots.register({ name: 'details' }, ScrivenerPane)
        return function () {
          disposeRegistration()
          if (layout !== undefined) {
            try { layout.closeDetails() } catch (e) {}
          }
        }
      }, [preset])
      return null
    }

    function ToggleButton(props) {
      const preset = props.useSessions(function (s) {
        const row = props.sessionId !== undefined ? s.byId[props.sessionId] : undefined
        return row ? row.agentPreset : undefined
      })
      const paneOpen = usePaneOpen()
      if (preset !== 'scrivener') return null
      return React.createElement('button', {
        type: 'button',
        className: 'scr-toggle',
        title: 'Toggle the Scrivener editor pane',
        onClick: function () {
          if (layout === undefined) return
          if (paneOpen) {
            try { layout.closeDetails() } catch (e) {}
            setPaneOpen(false)
          } else {
            try { layout.openDetails() } catch (e) {}
            setPaneOpen(true)
          }
        }
      }, paneOpen ? 'Scrivener on' : 'Scrivener')
    }

    function ScrivenerPane(props) {
      const current = props.useSessions(function (s) { return s.current })
      const cwd = props.useSessions(function (s) {
        if (s.current === undefined) return undefined
        const row = s.byId[s.current]
        return row ? row.cwd : undefined
      })

      const editorRef = React.useState({ current: null })[0]
      const panelRef = React.useState({ current: null })[0]
      const pendingRef = React.useState({ current: null })[0]
      const instrRef = React.useState({ current: '' })[0]
      const textPair = React.useState('')
      const text = textPair[0]
      const textRef = React.useState({ current: '' })[0]
      const statusPair = React.useState('')
      const status = statusPair[0]
      const popupPair = React.useState(null)
      const popup = popupPair[0]
      const pendingPair = React.useState(null)
      const pending = pendingPair[0]

      React.useEffect(function () { pendingRef.current = pending }, [pending])
      React.useEffect(function () { textRef.current = text }, [text])

      React.useEffect(function () {
        if (current === undefined) return
        if (drafts.has(current)) { textPair[1](drafts.get(current)); return }
        host.call('scrivener/read', { cwd: cwd === undefined ? null : cwd }).then(function (res) {
          if (res && res.ok && typeof res.text === 'string') {
            drafts.set(current, res.text)
            textPair[1](res.text)
          } else if (res && res.missing) {
            drafts.set(current, '')
            textPair[1]('')
          } else {
            statusPair[1]('load failed: ' + (res && res.error ? res.error : 'unknown'))
          }
        }).catch(function (error) {
          statusPair[1]('load failed: ' + String((error && error.message) || error))
        })
      }, [current, cwd])

      React.useEffect(function () {
        const el = editorRef.current
        if (el === null) return
        if (el.innerText !== text) el.innerText = text
      }, [text])

      React.useEffect(function () {
        if (current === undefined) return
        const binding = sessions.binding(current)
        if (binding === undefined || binding.session === undefined) return
        const session = binding.session
        let lastSeq = maxNodeSeq(session.getSnapshot())
        const unsubscribe = session.subscribe(function () {
          const seq = maxNodeSeq(session.getSnapshot())
          if (seq <= lastSeq) return
          lastSeq = seq
          if (pendingRef.current !== null) return
          const el = editorRef.current
          if (el !== null && typeof document !== 'undefined' && document.activeElement === el) return
          const snap = session.getSnapshot()
          const nodes = snap && Array.isArray(snap.nodes) ? snap.nodes : []
          let best = null
          for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i]
            if (n && n.kind === 'assistant' && n.interrupted !== true && n.messageId !== undefined && typeof n.seq === 'number') {
              if (best === null || n.seq > best.seq) best = n
            }
          }
          const reply = best === null ? '' : stripFence(nodeText(best))
          if (reply !== '') {
            const before = textRef.current
            let next
            if (before.trim() === '') next = reply
            else if (before.trim().endsWith(reply.trim())) next = before
            else next = before.replace(/\s+$/, '') + '\n\n' + reply
            drafts.set(current, next)
            textPair[1](next)
            statusPair[1]('captured the latest reply')
            host.call('scrivener/save', { cwd: cwd === undefined ? null : cwd, sessionId: current, text: next }).catch(function () {})
          } else {
            host.call('scrivener/read', { cwd: cwd === undefined ? null : cwd }).then(function (res) {
              if (res && res.ok && typeof res.text === 'string') {
                drafts.set(current, res.text)
                textPair[1](res.text)
              }
            }).catch(function () {})
          }
        })
        return unsubscribe
      }, [current, cwd])

      React.useEffect(function () {
        if (pending === null || current === undefined) return
        if (pending.sessionId !== current) { pendingPair[1](null); return }
        const binding = sessions.binding(current)
        if (binding === undefined || binding.session === undefined) {
          pendingPair[1](null)
          statusPair[1]('session lost')
          return
        }
        const session = binding.session
        let userSeq = -1
        let settled = false
        const finish = function (ok, reply) {
          if (settled) return
          settled = true
          disposeTimer()
          unsubscribe()
          if (ok) applyReplacement(pendingRef.current.lo, pendingRef.current.hi, reply)
          else {
            pendingRef.current = null
            pendingPair[1](null)
          }
        }
        const disposeTimer = (timer !== undefined && typeof timer.timeout === 'function')
          ? timer.timeout(function () {
              statusPair[1]('timed out waiting for the model reply')
              finish(false)
            }, 180000)
          : function () {}
        const check = function () {
          if (settled) return
          if (pendingRef.current === null || pendingRef.current.sessionId !== current) { finish(false); return }
          const snap = session.getSnapshot()
          const nodes = snap && Array.isArray(snap.nodes) ? snap.nodes : []
          if (userSeq === -1) {
            for (let i = 0; i < nodes.length; i++) {
              const n = nodes[i]
              if (n && n.kind === 'user' && typeof n.seq === 'number' && n.seq > pendingRef.current.lastSeq && n.seq > userSeq) userSeq = n.seq
            }
            if (userSeq === -1) return
          }
          let best = null
          for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i]
            if (n && n.kind === 'assistant' && n.interrupted !== true && n.messageId !== undefined && typeof n.seq === 'number' && n.seq > userSeq) {
              if (best === null || n.seq < best.seq) best = n
            }
          }
          if (best === null) return
          const reply = stripFence(nodeText(best))
          if (reply === '') return
          finish(true, reply)
        }
        const unsubscribe = session.subscribe(check)
        check()
        return function () {
          disposeTimer()
          unsubscribe()
        }
      }, [pending])

      function applyReplacement(lo, hi, reply) {
        const el = editorRef.current
        if (el === null) { pendingPair[1](null); statusPair[1]('editor lost'); return }
        const full = el.innerText || ''
        const next = full.slice(0, lo) + reply + full.slice(hi)
        if (current !== undefined) drafts.set(current, next)
        el.innerText = next
        textPair[1](next)
        pendingRef.current = null
        pendingPair[1](null)
        statusPair[1]('done')
        try {
          if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            const range = document.createRange()
            range.selectNodeContents(el)
            range.collapse(false)
            const sel = window.getSelection()
            if (sel) { sel.removeAllRanges(); sel.addRange(range) }
          }
        } catch (e) {}
      }

      function onInput() {
        const el = editorRef.current
        if (el === null) return
        const t = el.innerText || ''
        if (current !== undefined) drafts.set(current, t)
        textPair[1](t)
      }

      function currentSelection() {
        if (typeof window === 'undefined' || typeof document === 'undefined') return null
        const el = editorRef.current
        if (el === null) return null
        const sel = window.getSelection()
        if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null
        const anchorNode = sel.anchorNode
        if (anchorNode === null || !el.contains(anchorNode)) return null
        const range = sel.getRangeAt(0)
        const selected = range.toString()
        if (selected.trim() === '') return null
        const pre = document.createRange()
        pre.selectNodeContents(el)
        pre.setEnd(sel.anchorNode, sel.anchorOffset)
        const start = pre.toString().length
        const post = document.createRange()
        post.selectNodeContents(el)
        post.setEnd(sel.focusNode, sel.focusOffset)
        const end = post.toString().length
        const panelEl = panelRef.current
        if (panelEl === null) return null
        const pr = panelEl.getBoundingClientRect()
        const rect = range.getBoundingClientRect()
        const selTop = rect.top - pr.top
        const selBottom = rect.bottom - pr.top
        const selLeft = rect.left - pr.left
        const POPUP_W = 300
        const POPUP_H = 130
        let left = Math.round(selLeft - POPUP_W / 2)
        left = Math.min(Math.max(left, 8), Math.max(8, pr.width - POPUP_W - 8))
        let top
        if (selTop - POPUP_H - 8 >= 0) {
          top = Math.round(selTop - POPUP_H - 8)
        } else if (selBottom + 8 + POPUP_H <= pr.height) {
          top = Math.round(selBottom + 8)
        } else {
          top = 8
        }
        return {
          lo: Math.min(start, end),
          hi: Math.max(start, end),
          selected: selected,
          top: top,
          left: left
        }
      }

      function onSelectionEvent() {
        if (pendingRef.current !== null) { popupPair[1](null); return }
        popupPair[1](currentSelection())
      }

      function actionMessage(action, instruction, passage) {
        const templates = {
          refine: 'Refine the following passage from my manuscript: improve the prose while keeping the meaning, tone, and approximate length.',
          rewrite: 'Rewrite the following passage from my manuscript in a fresh style: keep the core meaning but vary the phrasing and sentence rhythm.',
          expand: 'Expand the following passage from my manuscript: add more detail, deepen the description, and significantly increase its length.'
        }
        let msg = templates[action] || templates.refine
        const instr = String(instruction || '').trim()
        if (instr !== '') msg += ' Additional instructions: ' + instr + '.'
        msg += ' Reply with ONLY the transformed passage, no preamble, no commentary, no quotation marks around it.'
        msg += '\n\n---\n' + passage + '\n---'
        return msg
      }

      function runAction(action, instruction) {
        if (pendingRef.current !== null) return
        if (popup === null) { statusPair[1]('select some text first'); return }
        if (current === undefined) { statusPair[1]('no active session'); return }
        const binding = sessions.binding(current)
        if (binding === undefined || binding.session === undefined) { statusPair[1]('session not available'); return }
        const session = binding.session
        const lastSeq = maxNodeSeq(session.getSnapshot())
        const entry = { sessionId: current, lo: popup.lo, hi: popup.hi, lastSeq: lastSeq }
        pendingRef.current = entry
        pendingPair[1](entry)
        popupPair[1](null)
        statusPair[1]('asking the model…')
        session.prompt([{ type: 'text', text: actionMessage(action, instruction, popup.selected) }], 'queue').then(function (result) {
          if (!(result && result.ok)) {
            pendingRef.current = null
            pendingPair[1](null)
            statusPair[1]('send failed: ' + (result && result.error ? (result.error.message || result.error.code) : 'unknown'))
          }
        }).catch(function (error) {
          pendingRef.current = null
          pendingPair[1](null)
          statusPair[1]('send failed: ' + String((error && error.message) || error))
        })
      }

      function saveDraft() {
        statusPair[1]('saving…')
        host.call('scrivener/save', { cwd: cwd === undefined ? null : cwd, sessionId: current, text: text }).then(function (res) {
          if (res && res.ok) statusPair[1]('saved to ' + (res.path || 'draft.md'))
          else statusPair[1]('save failed: ' + (res && res.error ? res.error : 'unknown'))
        }).catch(function (error) {
          statusPair[1]('save failed: ' + String((error && error.message) || error))
        })
      }

      function copyDraft() {
        const t = text || ''
        function ok() { statusPair[1]('copied') }
        function fail() { statusPair[1]('copy failed') }
        try {
          if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(t).then(ok).catch(fail)
            return
          }
        } catch (e) {}
        try {
          const el = editorRef.current
          if (el !== null && typeof document !== 'undefined' && typeof window !== 'undefined') {
            const range = document.createRange()
            range.selectNodeContents(el)
            const sel = window.getSelection()
            if (sel) { sel.removeAllRanges(); sel.addRange(range) }
            if (document.execCommand && document.execCommand('copy')) ok()
            else fail()
            return
          }
        } catch (e) {}
        fail()
      }

      function reloadDraft() {
        host.call('scrivener/read', { cwd: cwd === undefined ? null : cwd }).then(function (res) {
          if (res && res.ok && typeof res.text === 'string') {
            if (current !== undefined) drafts.set(current, res.text)
            textPair[1](res.text)
            statusPair[1]('reloaded')
          } else {
            statusPair[1]('reload failed: ' + (res && res.error ? res.error : 'unknown'))
          }
        }).catch(function (error) {
          statusPair[1]('reload failed: ' + String((error && error.message) || error))
        })
      }

      function onKeyDown(event) {
        if (event && event.key === 'Enter') {
          event.preventDefault()
          try { if (document.execCommand) document.execCommand('insertText', false, '\n') } catch (e) {}
        }
      }

      function onPaste(event) {
        event.preventDefault()
        const data = event.clipboardData ? event.clipboardData.getData('text/plain') : ''
        try { if (document.execCommand) document.execCommand('insertText', false, data) } catch (e) {}
      }

      const words = (text.trim() === '') ? 0 : text.trim().split(/\s+/).length

      const editorEl = React.createElement('div', {
        ref: function (node) { editorRef.current = node },
        className: 'scr-editor',
        contentEditable: pending === null,
        suppressContentEditableWarning: true,
        spellCheck: false,
        onInput: onInput,
        onSelect: onSelectionEvent,
        onMouseUp: onSelectionEvent,
        onKeyUp: onSelectionEvent,
        onKeyDown: onKeyDown,
        onPaste: onPaste
      })

      const popupEl = popup === null ? null : React.createElement('div', {
        className: 'scr-popup',
        style: {
          left: popup.left + 'px',
          top: popup.top + 'px'
        },
        onMouseDown: function (event) { event.preventDefault() }
      },
        React.createElement('div', { className: 'scr-popup-row' },
          React.createElement('button', { type: 'button', disabled: pending !== null, onClick: function () { runAction('refine', instrRef.current) } }, 'Refine'),
          React.createElement('button', { type: 'button', disabled: pending !== null, onClick: function () { runAction('rewrite', instrRef.current) } }, 'Rewrite'),
          React.createElement('button', { type: 'button', disabled: pending !== null, onClick: function () { runAction('expand', instrRef.current) } }, 'Expand')
        ),
        React.createElement('input', {
          className: 'scr-instr',
          placeholder: 'Add instructions…',
          onKeyDown: function (event) {
            event.stopPropagation()
            if (event.key === 'Enter') runAction('refine', instrRef.current)
            if (event.key === 'Escape') popupPair[1](null)
          },
          onInput: function (event) { instrRef.current = event.target.value },
          onMouseDown: function (event) {
            event.preventDefault()
            event.stopPropagation()
            try {
              const el = event.target
              el.focus()
              if (typeof el.setSelectionRange === 'function') {
                const len = el.value.length
                el.setSelectionRange(len, len)
              }
            } catch (e) {}
          }
        })
      )

      const foot = React.createElement('div', { className: 'scr-foot' },
        React.createElement('span', null, words + ' words · ' + text.length + ' chars'),
        React.createElement('button', { className: 'scr-btn', onClick: reloadDraft }, 'Reload'),
        React.createElement('button', { className: 'scr-btn', onClick: copyDraft }, 'Copy'),
        React.createElement('button', { className: 'scr-btn', onClick: saveDraft }, 'Save'),
        React.createElement('span', { className: 'scr-status' }, status)
      )

      return React.createElement('div', {
        ref: function (node) { panelRef.current = node },
        className: 'scr-pane',
        onMouseDown: function (event) {
          const target = event && event.target
          if (target && typeof target.closest === 'function' && target.closest('.scr-popup')) return
          popupPair[1](null)
        }
      },
        React.createElement('div', { className: 'scr-head' },
          React.createElement('span', { className: 'scr-title' }, 'Scrivener editor'),
          React.createElement('button', { type: 'button', className: 'scr-x', onClick: function () {
            setPaneOpen(false)
            if (layout !== undefined) {
              try { layout.closeDetails() } catch (e) {}
            }
          } }, '×')
        ),
        editorEl,
        popupEl,
        foot
      )
    }

    slots.inject('shell.overlay', function () {
      return slots.register({ name: 'shell.overlay', id: 'scrivener-controller', order: 0, label: function () { return 'Scrivener controller' } }, Controller)
    })
    slots.inject('conversation.session.header.actions', function () {
      return slots.register({ name: 'conversation.session.header.actions', id: 'scrivener-toggle', order: 0, label: function () { return 'Scrivener' } }, ToggleButton)
    })
  }
}
