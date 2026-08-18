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
      '.scr-tabs{display:flex;gap:2px;padding:10px 10px 0;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.08))}',
      '.scr-tab{flex:1;border:1px solid transparent;border-bottom:none;background:transparent;color:var(--dsw-alias-label-secondary,#bbb);border-radius:6px 6px 0 0;padding:6px 0;cursor:pointer;font-size:13px}',
      '.scr-tab:hover{color:var(--dsw-alias-label-primary,#eee);background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}',
      '.scr-tab-active{color:var(--dsw-alias-label-primary,#eee);background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.05));border-color:var(--dsw-alias-border-l2,rgba(255,255,255,.14))}',
      '.scr-editor{flex:1;overflow:auto;padding:16px;white-space:pre-wrap;line-height:1.7;outline:none;color:var(--dsw-alias-label-primary,#eee)}',
      '.scr-ins{color:var(--dsw-static-blue-450,#7db1ff)}',
      '.scr-sel{background:rgba(255,166,44,.28);border-radius:2px}',
      '::highlight(scr-sel){background-color:rgba(255,166,44,.32);color:inherit}',
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
      '.scr-confirm{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:300px;box-sizing:border-box;background:var(--dsw-specific-menu,var(--dsw-alias-bg-overlay,#262635));border:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.12));border-radius:10px;padding:12px;box-shadow:var(--dsw-shadow-lv3,0 8px 24px rgba(0,0,0,.4));display:flex;flex-direction:column;gap:10px;pointer-events:auto;z-index:30}',
      '.scr-confirm-text{font-size:13px;line-height:1.5;color:var(--dsw-alias-label-primary,#eee)}',
      '.scr-confirm .scr-popup-row button:last-child{color:#ffb08a;border-color:rgba(255,150,110,.45)}',
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
    const dirtyTabs = new Set()

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
      const t = String(text || '')
      const m = /^\s*```[a-zA-Z]*\s*\n([\s\S]*?)\n\s*```\s*$/.exec(t)
      if (m !== null) return m[1]
      return t
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

    function escapeHtml(text) {
      return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    }

    function toHtml(text) {
      return escapeHtml(text).replace(/\n/g, '<br>')
    }

    function fileForTab(t) {
      if (t === 'image') return 'images.md'
      if (t === 'video') return 'videos.md'
      return 'draft.md'
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
      const textsPair = React.useState({ story: '', image: '', video: '' })
      const texts = textsPair[0]
      const textsRef = React.useState({ current: texts })[0]
      const tabPair = React.useState('story')
      const tab = tabPair[0]
      const text = texts[tab]
      const statusPair = React.useState('')
      const status = statusPair[0]
      const popupPair = React.useState(null)
      const popup = popupPair[0]
      const pendingPair = React.useState(null)
      const pending = pendingPair[0]
      const confirmPair = React.useState(false)
      const confirm = confirmPair[0]

      React.useEffect(function () { pendingRef.current = pending }, [pending])
      React.useEffect(function () { textsRef.current = texts }, [texts])

      function setText(key, value, sessionId) {
        const sid = sessionId === undefined ? current : sessionId
        const next = Object.assign({}, textsRef.current)
        next[key] = value
        textsRef.current = next
        textsPair[1](next)
        if (sid !== undefined) {
          if (!drafts.has(sid)) drafts.set(sid, { story: '', image: '', video: '' })
          drafts.get(sid)[key] = value
        }
      }

      React.useEffect(function () {
        if (current === undefined) return
        const c = drafts.has(current) ? drafts.get(current) : { story: '', image: '', video: '' }
        const next = Object.assign({}, c)
        textsRef.current = next
        textsPair[1](next)
      }, [current])

      React.useEffect(function () {
        if (current === undefined) return
        const key = current + '|' + tab
        if (dirtyTabs.has(key)) return
        host.call('scrivener/read', { cwd: cwd === undefined ? null : cwd, file: fileForTab(tab) }).then(function (res) {
          if (res && res.ok && typeof res.text === 'string') {
            const cachedText = textsRef.current[tab] || ''
            if (cachedText === '' || res.text.trim() !== cachedText.trim()) {
              setText(tab, res.text, current)
              dirtyTabs.delete(key)
              if (cachedText.trim() !== '' && res.text.trim() !== cachedText.trim()) statusPair[1]('reconciled ' + fileForTab(tab))
            }
          } else if (res && res.missing) {
            setText(tab, '', current)
            dirtyTabs.delete(key)
          } else {
            statusPair[1]('load failed: ' + (res && res.error ? res.error : 'unknown'))
          }
        }).catch(function (error) {
          statusPair[1]('load failed: ' + String((error && error.message) || error))
        })
      }, [current, cwd, tab])

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
          host.call('scrivener/read', { cwd: cwd === undefined ? null : cwd, file: 'draft.md' }).then(function (res) {
            if (res && res.ok && typeof res.text === 'string') {
              const fileText = res.text
              const before = textsRef.current.story
              if (fileText !== '' && fileText.trim() !== before.trim()) {
                setText('story', fileText, current)
                dirtyTabs.delete(current + '|story')
                statusPair[1]('loaded from draft.md')
                return
              }
            }
            if (reply !== '') {
              const r = reply.trim()
              if (r !== '') {
                const before = textsRef.current.story
                let next
                if (before.trim() === '') next = r
                else if (before.trim().endsWith(r)) next = before
                else next = before.replace(/\s+$/, '') + '\n\n' + r
                setText('story', next, current)
                statusPair[1]('captured the latest reply')
                host.call('scrivener/save', { cwd: cwd === undefined ? null : cwd, sessionId: current, file: 'draft.md', text: next }).then(function (saveRes) {
                  if (saveRes && saveRes.ok) dirtyTabs.delete(current + '|story')
                }).catch(function () {})
              }
            }
          }).catch(function () {
            if (reply !== '') {
              const r = reply.trim()
              if (r !== '') {
                const before = textsRef.current.story
                let next
                if (before.trim() === '') next = r
                else if (before.trim().endsWith(r)) next = before
                else next = before.replace(/\s+$/, '') + '\n\n' + r
                setText('story', next, current)
                statusPair[1]('captured the latest reply')
              }
            }
          })
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
          const entry = pendingRef.current
          if (!ok || entry === null) {
            pendingRef.current = null
            pendingPair[1](null)
            return
          }
          if (entry.chatOnly) {
            const trimmed = String(reply || '').trim()
            if (entry.action === 'video') {
              const lower = trimmed.toLowerCase()
              if (lower.indexOf('overall_soundscape') === -1 || lower.indexOf('non_diegetic_music') === -1 || trimmed.length < 80) {
                redoOnce(entry, session, 'Your video prompt reply is incomplete: it must contain all three labeled sections — "integrated_multimodal_description:", "overall_soundscape:", and "non_diegetic_music:" — each fully developed. It must include every dialogue line from the scene verbatim and full audio detail. Output the complete three-part prompt again, from the beginning, nothing omitted, beginning with the exact text "integrated_multimodal_description:". Do not stop early.', 'reply is missing audio sections — asking for a complete redo…')
                return
              }
            } else if (entry.action === 'image') {
              if (trimmed.length < 30 || /^[,;:.…"']/.test(trimmed)) {
                redoOnce(entry, session, 'Your image prompt reply was truncated or incomplete. Output the complete image prompt again, from the very beginning, nothing omitted, written as a single flowing paragraph of natural-language prose beginning with the exact text "A cinematic". Do not stop early.', 'reply was a fragment — asking for a complete redo…')
                return
              }
            }
            storePrompt(entry, reply)
            return
          }
          applyReplacement(entry, reply)
        }
        const disposeTimer = (timer !== undefined && typeof timer.timeout === 'function')
          ? timer.timeout(function () {
              const entry = pendingRef.current
              if (entry !== null && entry.chatOnly && entry.redone !== true) {
                redoOnce(entry, session, actionMessage(entry.action, entry.instruction, entry.selected), 'no reply yet — re-asking the model…')
                return
              }
              statusPair[1]('timed out waiting for the model reply')
              finish(false)
            }, pending.chatOnly ? 420000 : 180000)
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
          if (reply.trim() === '') return
          finish(true, reply)
        }
        const unsubscribe = session.subscribe(check)
        check()
        return function () {
          disposeTimer()
          unsubscribe()
        }
      }, [pending])

      function redoOnce(entry, session, text, statusMsg) {
        if (entry.redone) {
          pendingRef.current = null
          pendingPair[1](null)
          statusPair[1]('still incomplete after retry — giving up')
          return
        }
        entry.redone = true
        entry.lastSeq = maxNodeSeq(session.getSnapshot())
        pendingRef.current = entry
        pendingPair[1](Object.assign({}, entry))
        statusPair[1](statusMsg)
        session.prompt([{ type: 'text', text: text }], 'queue').catch(function () {})
      }

      function storePrompt(entry, reply) {
        const key = entry.action === 'image' ? 'image' : 'video'
        const file = key === 'image' ? 'images.md' : 'videos.md'
        const firstLine = String(entry.selected || '').split('\n').map(function (s) { return s.trim() }).filter(Boolean)[0] || ''
        const excerpt = firstLine.length > 80 ? firstLine.slice(0, 80) + '…' : firstLine
        const header = excerpt === '' ? '## Prompt' : '## ' + excerpt
        const trimmed = String(reply || '').trim()
        const before = (textsRef.current[key] || '').trimEnd()
        const piece = before === '' ? header + '\n\n' + trimmed : before + '\n\n' + header + '\n\n' + trimmed
        setText(key, piece, current)
        if (current !== undefined) {
          const dkey = current + '|' + key
          dirtyTabs.add(dkey)
          host.call('scrivener/save', { cwd: cwd === undefined ? null : cwd, sessionId: current, file: file, text: piece }).then(function (res) {
            if (res && res.ok) {
              dirtyTabs.delete(dkey)
              statusPair[1]('stored in ' + (key === 'image' ? 'Image' : 'Video') + ' tab · also in chat')
            } else {
              statusPair[1]('store failed: ' + (res && res.error ? res.error : 'unknown'))
            }
          }).catch(function (error) {
            statusPair[1]('store failed: ' + String((error && error.message) || error))
          })
        }
        pendingRef.current = null
        pendingPair[1](null)
      }

      function applyReplacement(entry, reply) {
        const t = entry.tab || 'story'
        const el = editorRef.current
        const full = textsRef.current[t] || ''
        let lo = entry.lo
        let hi = entry.hi
        const selected = typeof entry.selected === 'string' ? entry.selected : ''
        if (selected !== '' && full.slice(lo, hi) !== selected) {
          const idx = full.indexOf(selected)
          if (idx !== -1) { lo = idx; hi = idx + selected.length }
        }
        let lead = ''
        let i = lo
        while (i < hi && /\s/.test(full.charAt(i))) { lead += full.charAt(i); i++ }
        let trail = ''
        let j = hi - 1
        while (j >= lo && /\s/.test(full.charAt(j))) { trail = full.charAt(j) + trail; j-- }
        let r = String(reply || '').replace(/^[ \t\r\n]+/, '').replace(/[ \t\r\n]+$/, '')
        const inserted = lead + r + trail
        const next = full.slice(0, lo) + inserted + full.slice(hi)
        setText(t, next, current)
        if (current !== undefined) dirtyTabs.add(current + '|' + t)
        if (tab === t && el !== null) {
          try {
            el.innerHTML = toHtml(next.slice(0, lo)) + '<span class="scr-ins">' + toHtml(inserted) + '</span>' + toHtml(next.slice(lo + inserted.length))
          } catch (e) {
            el.innerText = next
          }
        }
        pendingRef.current = null
        pendingPair[1](null)
        statusPair[1]('done')
        try {
          if (typeof window !== 'undefined' && typeof document !== 'undefined' && el !== null) {
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
        const next = Object.assign({}, textsRef.current)
        next[tab] = t
        textsRef.current = next
        textsPair[1](next)
        if (current !== undefined) {
          if (!drafts.has(current)) drafts.set(current, { story: '', image: '', video: '' })
          drafts.get(current)[tab] = t
          dirtyTabs.add(current + '|' + tab)
        }
      }

      function unmarkSelection() {
        try {
          if (typeof window !== 'undefined' && window.CSS && window.CSS.highlights && typeof window.CSS.highlights.delete === 'function') {
            window.CSS.highlights.delete('scr-sel')
          }
        } catch (e) {}
        const el = editorRef.current
        if (el === null || typeof document === 'undefined') return
        try {
          const marks = el.querySelectorAll('.scr-sel')
          for (let i = 0; i < marks.length; i++) {
            const span = marks[i]
            const parent = span.parentNode
            if (parent === null) continue
            while (span.firstChild !== null) parent.insertBefore(span.firstChild, span)
            parent.removeChild(span)
          }
          el.normalize()
        } catch (e) {}
      }

      function markSelectionRange(range) {
        try {
          if (typeof window !== 'undefined' && typeof window.Highlight === 'function' && window.CSS && window.CSS.highlights && typeof window.CSS.highlights.set === 'function') {
            const highlight = new window.Highlight(range)
            window.CSS.highlights.set('scr-sel', highlight)
            return
          }
        } catch (e) {}
        const el = editorRef.current
        if (el === null || typeof document === 'undefined') return
        unmarkSelection()
        try {
          const span = document.createElement('span')
          span.className = 'scr-sel'
          const fragment = range.extractContents()
          span.appendChild(fragment)
          range.insertNode(span)
          el.normalize()
        } catch (e) {}
      }

      function isSelectionInsideMark() {
        const el = editorRef.current
        if (el === null || typeof window === 'undefined') return false
        try {
          const sel = window.getSelection()
          if (!sel || sel.anchorNode === null) return false
          const an = sel.anchorNode
          const node = an.nodeType === 3 ? an.parentElement : an
          return node !== null && typeof node.closest === 'function' && node.closest('.scr-sel') !== null
        } catch (e) {
          return false
        }
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
        const POPUP_H = 160
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
          left: left,
          range: range
        }
      }

      function onSelectionEvent() {
        if (pendingRef.current !== null) { popupPair[1](null); return }
        if (isSelectionInsideMark()) return
        const sel = currentSelection()
        if (sel === null) {
          unmarkSelection()
          popupPair[1](null)
          return
        }
        markSelectionRange(sel.range)
        popupPair[1](sel)
      }

      function dismissPopup() {
        unmarkSelection()
        popupPair[1](null)
      }

      function selectTab(t) {
        dismissPopup()
        confirmPair[1](false)
        tabPair[1](t)
      }

      function actionMessage(action, instruction, passage) {
        const templates = {
          refine: 'Refine the following passage from my manuscript: improve the prose while keeping the meaning, tone, and approximate length.',
          rewrite: 'Rewrite the following passage from my manuscript in a fresh style: keep the core meaning but vary the phrasing and sentence rhythm.',
          expand: 'Expand the following passage from my manuscript: add more detail, deepen the description, and significantly increase its length.',
          image: 'Generate a detailed Krea2 t2i (text-to-image) prompt from the following scene in my story. Your reply must begin with the exact text "A cinematic" and nothing before it. Describe the subject, appearance, setting, art style, lighting, color palette, camera angle, and mood. Output ONLY the prompt itself, written as a single flowing paragraph of natural-language prose with no labels or headings. IMPORTANT: do NOT output JSON, code, or parameter lists — never include width, height, resolution, or any setting numbers.',
          video: 'Generate a detailed MiniMax H3 (video + native audio) prompt from the following scene in my story. This request overrides your usual brief-chat behavior: brevity is forbidden, and you must write the complete prompt in full without stopping early. Your reply must begin with the exact text "integrated_multimodal_description:" and nothing before it. Output ONLY the prompt, written as flowing natural-language prose. IMPORTANT: do NOT output JSON, code, or parameter lists — never include resolution, fps, duration, or any setting numbers. Structure the prompt in exactly three labeled parts, ALL three required and fully developed: (1) "integrated_multimodal_description:" — shot-by-shot cinematic visuals with timestamps within a 4-15 second timeline (e.g., [Shot 1] …, [Shot 2] At 00:04.500, cut to …), covering subject, appearance, action, camera movement, pacing, and shot sequence; (2) "overall_soundscape:" — the diegetic audio: ambient sound, physical sounds, and ALL dialogue lines from the scene verbatim, timed to the visuals; (3) "non_diegetic_music:" — the score: mood, tempo, and instruments.'
        }
        let msg = templates[action] || templates.refine
        const instr = String(instruction || '').trim()
        if (instr !== '') msg += ' Additional instructions: ' + instr + '.'
        msg += ' Reply with ONLY the prompt — no preamble, no commentary, no quotation marks around the whole prompt. Write plain prose only, never JSON or parameter lists. Do not call scrivener_draft for this request.'
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
        const chatOnly = action === 'image' || action === 'video'
        const entry = { sessionId: current, lo: popup.lo, hi: popup.hi, selected: popup.selected, lastSeq: lastSeq, chatOnly: chatOnly, action: action, tab: tab, instruction: instruction, redone: false }
        pendingRef.current = entry
        pendingPair[1](entry)
        unmarkSelection()
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
        const t = tab
        statusPair[1]('saving…')
        host.call('scrivener/save', { cwd: cwd === undefined ? null : cwd, sessionId: current, file: fileForTab(t), text: texts[t] }).then(function (res) {
          if (res && res.ok) {
            if (current !== undefined) dirtyTabs.delete(current + '|' + t)
            statusPair[1]('saved to ' + (res.path || fileForTab(t)))
          } else statusPair[1]('save failed: ' + (res && res.error ? res.error : 'unknown'))
        }).catch(function (error) {
          statusPair[1]('save failed: ' + String((error && error.message) || error))
        })
      }

      function clearDraft() {
        confirmPair[1](false)
        unmarkSelection()
        const t = tab
        setText(t, '', current)
        if (current !== undefined) dirtyTabs.add(current + '|' + t)
        statusPair[1]('clearing ' + fileForTab(t) + '…')
        host.call('scrivener/save', { cwd: cwd === undefined ? null : cwd, sessionId: current, file: fileForTab(t), text: '' }).then(function (res) {
          if (res && res.ok) {
            if (current !== undefined) dirtyTabs.delete(current + '|' + t)
            statusPair[1](fileForTab(t) + ' cleared')
          } else statusPair[1]('clear failed: ' + (res && res.error ? res.error : 'unknown'))
        }).catch(function (error) {
          statusPair[1]('clear failed: ' + String((error && error.message) || error))
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
        const t = tab
        host.call('scrivener/read', { cwd: cwd === undefined ? null : cwd, file: fileForTab(t) }).then(function (res) {
          if (res && res.ok && typeof res.text === 'string') {
            setText(t, res.text, current)
            if (current !== undefined) dirtyTabs.delete(current + '|' + t)
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

      const tabBar = React.createElement('div', { className: 'scr-tabs' },
        React.createElement('button', { type: 'button', className: tab === 'story' ? 'scr-tab scr-tab-active' : 'scr-tab', onClick: function () { selectTab('story') } }, 'Story'),
        React.createElement('button', { type: 'button', className: tab === 'image' ? 'scr-tab scr-tab-active' : 'scr-tab', onClick: function () { selectTab('image') } }, 'Image'),
        React.createElement('button', { type: 'button', className: tab === 'video' ? 'scr-tab scr-tab-active' : 'scr-tab', onClick: function () { selectTab('video') } }, 'Video')
      )

      const popupEl = popup === null ? null : React.createElement('div', {
        className: 'scr-popup',
        style: {
          left: popup.left + 'px',
          top: popup.top + 'px'
        },
        onMouseDown: function (event) {
          const target = event && event.target
          if (target && typeof target.closest === 'function' && target.closest('.scr-instr')) return
          event.preventDefault()
        }
      },
        React.createElement('div', { className: 'scr-popup-row' },
          React.createElement('button', { type: 'button', disabled: pending !== null, onClick: function () { runAction('refine', instrRef.current) } }, 'Refine'),
          React.createElement('button', { type: 'button', disabled: pending !== null, onClick: function () { runAction('rewrite', instrRef.current) } }, 'Rewrite'),
          React.createElement('button', { type: 'button', disabled: pending !== null, onClick: function () { runAction('expand', instrRef.current) } }, 'Expand')
        ),
        React.createElement('div', { className: 'scr-popup-row' },
          React.createElement('button', { type: 'button', disabled: pending !== null, onClick: function () { runAction('image', instrRef.current) } }, 'Image Prompt'),
          React.createElement('button', { type: 'button', disabled: pending !== null, onClick: function () { runAction('video', instrRef.current) } }, 'Video Prompt')
        ),
        React.createElement('input', {
          className: 'scr-instr',
          placeholder: 'Add instructions…',
          onKeyDown: function (event) {
            event.stopPropagation()
            if (event.key === 'Enter') runAction('refine', instrRef.current)
            if (event.key === 'Escape') dismissPopup()
          },
          onInput: function (event) { instrRef.current = event.target.value }
        })
      )

      const confirmEl = confirm ? React.createElement('div', { className: 'scr-confirm' },
        React.createElement('div', { className: 'scr-confirm-text' }, 'Clear ' + fileForTab(tab) + '? This empties this tab and overwrites ' + fileForTab(tab) + ' with empty content.'),
        React.createElement('div', { className: 'scr-popup-row' },
          React.createElement('button', { type: 'button', onClick: function () { confirmPair[1](false) } }, 'Cancel'),
          React.createElement('button', { type: 'button', onClick: clearDraft }, 'Clear')
        )
      ) : null

      const foot = React.createElement('div', { className: 'scr-foot' },
        React.createElement('span', null, words + ' words · ' + text.length + ' chars'),
        React.createElement('button', { className: 'scr-btn', onClick: reloadDraft }, 'Reload'),
        React.createElement('button', { className: 'scr-btn', onClick: copyDraft }, 'Copy'),
        React.createElement('button', { className: 'scr-btn', onClick: saveDraft }, 'Save'),
        React.createElement('button', { className: 'scr-btn', disabled: pending !== null, onClick: function () { dismissPopup(); confirmPair[1](true) } }, 'Clear'),
        React.createElement('span', { className: 'scr-status' }, status)
      )

      return React.createElement('div', {
        ref: function (node) { panelRef.current = node },
        className: 'scr-pane',
        onMouseDown: function (event) {
          const target = event && event.target
          if (target && typeof target.closest === 'function' && (target.closest('.scr-popup') || target.closest('.scr-confirm') || target.closest('.scr-tab'))) return
          dismissPopup()
          confirmPair[1](false)
        }
      },
        tabBar,
        editorEl,
        popupEl,
        confirmEl,
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
