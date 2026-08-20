window.__ModuleLoader__.load({
	id: "scr-pane",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		var react = require("react");

		const CSS = [
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
			'.scr-toggle{border:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.12));background:transparent;color:var(--dsw-alias-label-primary,#eee);border-radius:6px;padding:4px 10px;cursor:pointer;font-size:12px}',
			'.scr-files{flex:1;overflow:auto;padding:10px;display:flex;flex-direction:column;gap:8px}',
			'.scr-breadcrumbs{display:flex;flex-wrap:wrap;align-items:center;gap:4px;font-size:12px;color:var(--dsw-alias-label-secondary,#bbb)}',
			'.scr-crumb{background:transparent;border:none;color:inherit;cursor:pointer;padding:2px 4px;border-radius:4px;font-size:12px}',
			'.scr-crumb:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}',
			'.scr-file-list{display:flex;flex-direction:column;gap:2px}',
			'.scr-file-row{display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;color:var(--dsw-alias-label-primary,#eee);font-size:13px}',
			'.scr-file-row:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}',
			'.scr-file-kind{width:16px;text-align:center;color:var(--dsw-alias-label-tertiary,#999)}',
			'.scr-file-size{margin-left:auto;color:var(--dsw-alias-label-tertiary,#999);font-size:11px}',
			'.scr-file-preview{flex:1;overflow:auto;white-space:pre-wrap;background:var(--dsw-alias-bg-module-platform,rgba(255,255,255,.03));border:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.08));border-radius:8px;padding:10px;font-size:12px;line-height:1.6;color:var(--dsw-alias-label-primary,#eee)}',
			'.scr-empty{color:var(--dsw-alias-label-tertiary,#999);font-size:12px;padding:8px}'
		].join('\n');
		const tagId = "scr-pane/pane.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "scr-pane";
			tag.dataset.pluginCss = tagId;
			tag.textContent = CSS;
			document.head.appendChild(tag);
		}

		function apiRead(cwd, file) {
			const qs = '?file=' + encodeURIComponent(file) + '&cwd=' + encodeURIComponent(cwd === undefined ? '' : cwd);
			return fetch('/scr-api/read' + qs).then(function (r) { return r.json(); });
		}

		function apiList(cwd, path) {
			const qs = '?path=' + encodeURIComponent(path === undefined ? '' : path) + '&cwd=' + encodeURIComponent(cwd === undefined ? '' : cwd);
			return fetch('/scr-api/list' + qs).then(function (r) { return r.json(); });
		}
		function apiSave(cwd, sessionId, file, text) {
			return fetch('/scr-api/save', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ cwd: cwd === undefined ? null : cwd, sessionId: sessionId, file: file, text: text })
			}).then(function (r) { return r.json(); });
		}

		let open = false;
		const openListeners = new Set();
		function setPaneOpen(value) {
			open = !!value;
			openListeners.forEach(function (fn) { try { fn(); } catch (e) {} });
		}
		function usePaneOpen() {
			const pair = react.useState(open);
			react.useEffect(function () {
				const fn = function () { pair[1](open); };
				openListeners.add(fn);
				return function () { openListeners.delete(fn); };
			}, []);
			return pair[0];
		}

		const drafts = new Map();
		const dirtyTabs = new Set();
		const insertRanges = new Map();
		const selectionMemory = new Map();
		const scrollMemory = new Map();
		let pluginCtx = undefined;
		// messageIds of chat-only prompt replies already routed to the Image/Video
		// tabs. The auto-feed must never append these to the story tab.
		const promptReplyIds = new Set();

		function rangesFor(sessionId, tabKey) {
			if (sessionId === undefined) return [];
			let obj = insertRanges.get(sessionId);
			if (obj === undefined) {
				obj = { story: [], image: [], video: [] };
				insertRanges.set(sessionId, obj);
			}
			return obj[tabKey];
		}

		function nodeText(node) {
			if (!node || !Array.isArray(node.blocks)) return '';
			let out = '';
			for (let i = 0; i < node.blocks.length; i++) {
				const block = node.blocks[i];
				if (block && block.kind === 'text' && typeof block.text === 'string') out += block.text;
			}
			return out;
		}

		function stripFence(text) {
			const t = String(text || '');
			const m = /^\s*```[a-zA-Z]*\s*\n([\s\S]*?)\n\s*```\s*$/.exec(t);
			if (m !== null) return m[1];
			return t;
		}

		// A chat-only prompt reply must never land in the story tab. Image prompts
		// are required to begin with "A cinematic" and video prompts with
		// "integrated_multimodal_description:", so those prefixes are a reliable
		// prompt marker even when no pending action is tracked (chat-typed
		// requests, pane remounts, or late replies arriving after a timeout).
		function isPromptReplyText(text) {
			const stripped = String(text || '').trim().replace(/^["'\u2018\u2019\u201c\u201d\s]+/, '').toLowerCase();
			return stripped.indexOf('a cinematic') === 0 || stripped.indexOf('integrated_multimodal_description:') === 0;
		}

		function maxNodeSeq(snapshot) {
			let seq = -1;
			if (snapshot && Array.isArray(snapshot.nodes)) {
				for (let i = 0; i < snapshot.nodes.length; i++) {
					const n = snapshot.nodes[i];
					if (n && typeof n.seq === 'number' && n.seq > seq) seq = n.seq;
				}
			}
			return seq;
		}

		function fileForTab(t) {
			if (t === 'image') return 'images.md';
			if (t === 'video') return 'videos.md';
			return 'draft.md';
		}

		function renderEditor(el, textValue, sessionId, tabKey) {
			if (el === null || typeof document === 'undefined') return;
			if (el.innerText === textValue) return;
			el.textContent = '';
			const ranges = rangesFor(sessionId, tabKey).slice().sort(function (a, b) { return a.lo - b.lo; });
			if (ranges.length === 0) {
				el.textContent = textValue;
				return;
			}
			let pos = 0;
			for (let k = 0; k < ranges.length; k++) {
				const r = ranges[k];
				if (r.hi <= r.lo || r.lo < pos) continue;
				if (r.lo > textValue.length) break;
				const hi = Math.min(r.hi, textValue.length);
				if (r.lo > pos) el.appendChild(document.createTextNode(textValue.slice(pos, r.lo)));
				const span = document.createElement('span');
				span.className = 'scr-ins';
				span.appendChild(document.createTextNode(textValue.slice(r.lo, hi)));
				el.appendChild(span);
				pos = hi;
			}
			if (pos < textValue.length) el.appendChild(document.createTextNode(textValue.slice(pos)));
		}

		function rangeFromOffsets(el, lo, hi) {
			try {
				const nodes = [];
				(function collect(node) {
					if (node.nodeType === 3) { nodes.push(node); return; }
					for (let i = 0; i < node.childNodes.length; i++) collect(node.childNodes[i]);
				})(el);
				let pos = 0;
				let startNode = null;
				let startOff = 0;
				let endNode = null;
				let endOff = 0;
				for (let i = 0; i < nodes.length; i++) {
					const len = nodes[i].data.length;
					if (startNode === null && pos + len >= lo) { startNode = nodes[i]; startOff = lo - pos; }
					if (pos + len >= hi) { endNode = nodes[i]; endOff = hi - pos; break; }
					pos += len;
				}
				if (startNode === null || endNode === null) return null;
				const range = document.createRange();
				range.setStart(startNode, startOff);
				range.setEnd(endNode, endOff);
				return range;
			} catch (e) {
				return null;
			}
		}

		function placePopup(range, panelEl) {
			const pr = panelEl.getBoundingClientRect();
			const rect = range.getBoundingClientRect();
			const selTop = rect.top - pr.top;
			const selBottom = rect.bottom - pr.top;
			const selLeft = rect.left - pr.left;
			const POPUP_W = 300;
			const POPUP_H = 160;
			let left = Math.round(selLeft - POPUP_W / 2);
			left = Math.min(Math.max(left, 8), Math.max(8, pr.width - POPUP_W - 8));
			let top;
			if (selTop - POPUP_H - 8 >= 0) top = Math.round(selTop - POPUP_H - 8);
			else if (selBottom + 8 + POPUP_H <= pr.height) top = Math.round(selBottom + 8);
			else top = 8;
			return { top: top, left: left };
		}

		function joinRelPath(base, name) {
			return base === '' ? name : base + '/' + name;
		}

		function parentRelPath(path) {
			const i = path.lastIndexOf('/');
			return i === -1 ? '' : path.slice(0, i);
		}

		function formatSize(bytes) {
			if (typeof bytes !== 'number') return '';
			if (bytes < 1024) return bytes + ' B';
			if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
			return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
		}

		function FilesBrowser(props) {
			const [path, setPath] = react.useState('');
			const [entries, setEntries] = react.useState([]);
			const [preview, setPreview] = react.useState(null);
			const [status, setStatus] = react.useState('');

			react.useEffect(function () {
				if (props.cwd === undefined) {
					setEntries([]);
					setPreview(null);
					setStatus('no workspace');
					return;
				}
				let alive = true;
				apiList(props.cwd, path).then(function (res) {
					if (!alive) return;
					if (res && res.ok && Array.isArray(res.entries)) {
						setEntries(res.entries);
						setStatus('');
					} else {
						setEntries([]);
						setStatus('cannot list: ' + (res && res.error ? res.error : 'unknown'));
					}
				}).catch(function (error) {
					if (!alive) return;
					setEntries([]);
					setStatus('cannot list: ' + String((error && error.message) || error));
				});
				return function () { alive = false; };
			}, [props.cwd, path]);

			function openEntry(entry) {
				if (entry.kind === 'dir') {
					setPath(joinRelPath(path, entry.name));
					setPreview(null);
					setStatus('');
					return;
				}
				apiRead(props.cwd, joinRelPath(path, entry.name)).then(function (res) {
					if (res && res.ok && typeof res.text === 'string') {
						setPreview({ name: entry.name, text: res.text });
						setStatus('');
					} else {
						setPreview(null);
						setStatus('cannot open file');
					}
				}).catch(function (error) {
					setPreview(null);
					setStatus('cannot open file: ' + String((error && error.message) || error));
				});
			}

			const crumbs = [];
			const segs = path === '' ? [] : path.split('/');
			crumbs.push(react.createElement('button', { key: '__root', type: 'button', className: 'scr-crumb', onClick: function () { setPath(''); setPreview(null); } }, 'Workspace'));
			let acc = '';
			for (let i = 0; i < segs.length; i++) {
				acc = acc === '' ? segs[i] : acc + '/' + segs[i];
				const target = acc;
				crumbs.push(react.createElement('span', { key: 'slash' + i }, '/'));
				crumbs.push(react.createElement('button', { key: target, type: 'button', className: 'scr-crumb', onClick: (function (t) { return function () { setPath(t); setPreview(null); }; })(target) }, segs[i]));
			}

			const rows = entries.map(function (entry) {
				const kind = entry.kind === 'dir' ? '📁' : entry.kind === 'file' ? '📄' : '•';
				return react.createElement('div', {
					key: entry.name,
					className: 'scr-file-row',
					onClick: function () { openEntry(entry); }
				},
					react.createElement('span', { className: 'scr-file-kind' }, kind),
					react.createElement('span', null, entry.name),
					typeof entry.size === 'number' ? react.createElement('span', { className: 'scr-file-size' }, formatSize(entry.size)) : null
				);
			});

			const listEl = rows.length === 0 && status === ''
				? react.createElement('div', { className: 'scr-empty' }, 'empty folder')
				: react.createElement('div', { className: 'scr-file-list' }, rows);

			const previewEl = preview === null ? null : react.createElement('div', null,
				react.createElement('div', { className: 'scr-breadcrumbs' }, react.createElement('span', null, preview.name)),
				react.createElement('div', { className: 'scr-file-preview' }, preview.text)
			);

			return react.createElement('div', { className: 'scr-files' },
				react.createElement('div', { className: 'scr-breadcrumbs' }, crumbs),
				listEl,
				status !== '' ? react.createElement('div', { className: 'scr-empty' }, status) : null,
				previewEl
			);
		}

		function FilesPane(props) {
			const cwd = props.useSessions(function (s) {
				if (s.current === undefined) return undefined;
				const row = s.byId[s.current];
				return row ? row.cwd : undefined;
			});
			return react.createElement('div', { className: 'scr-pane' },
				react.createElement('div', { className: 'scr-tabs' },
					react.createElement('button', { type: 'button', className: 'scr-tab scr-tab-active' }, 'Files')
				),
				react.createElement(FilesBrowser, { cwd: cwd })
			);
		}

		function Controller(props) {
			const preset = props.useSessions(function (s) {
				if (s.current === undefined) return undefined;
				const row = s.byId[s.current];
				return row ? row.agentPreset : undefined;
			});
			const sessionId = props.useSessions(function (s) { return s.current; });
			// Every mode gets the right column: Scrivener keeps its editor tabs,
			// every other mode gets the read-only Files browser.
			react.useEffect(function () {
				const layout = pluginCtx.get('layout');
				const Pane = preset === 'scrivener' ? ScrivenerPane : FilesPane;
				setPaneOpen(true);
				if (layout !== undefined) {
					try { layout.openDetails(); } catch (e) {}
				}
				const disposeRegistration = pluginCtx.slots.register({ name: 'details', priority: -3 }, Pane);
				return function () {
					disposeRegistration();
				};
			}, [preset]);
			// The shipped shell closes the details column on session switch;
			// re-open it on every session change for every mode.
			react.useEffect(function () {
				setPaneOpen(true);
				const layout = pluginCtx.get('layout');
				if (layout !== undefined) {
					try { layout.openDetails(); } catch (e) {}
				}
			}, [preset, sessionId]);
			return null;
		}

		function ToggleButton(props) {
			const preset = props.useSessions(function (s) {
				const row = props.sessionId !== undefined ? s.byId[props.sessionId] : undefined;
				return row ? row.agentPreset : undefined;
			});
			const paneOpen = usePaneOpen();
			const label = preset === 'scrivener' ? 'Scrivener' : 'Files';
			return react.createElement('button', {
				type: 'button',
				className: 'scr-toggle',
				title: 'Toggle the right-side pane',
				onClick: function () {
					const layout = pluginCtx.get('layout');
					if (layout === undefined) return;
					if (paneOpen) {
						try { layout.closeDetails(); } catch (e) {}
						setPaneOpen(false);
					} else {
						try { layout.openDetails(); } catch (e) {}
						setPaneOpen(true);
					}
				}
			}, paneOpen ? (label + ' on') : label);
		}

		function ScrivenerPane(props) {
			const current = props.useSessions(function (s) { return s.current; });
			const cwd = props.useSessions(function (s) {
				if (s.current === undefined) return undefined;
				const row = s.byId[s.current];
				return row ? row.cwd : undefined;
			});

			const editorRef = react.useState({ current: null })[0];
			const panelRef = react.useState({ current: null })[0];
			const pendingRef = react.useState({ current: null })[0];
			const instrRef = react.useState({ current: '' })[0];
			const textsPair = react.useState({ story: '', image: '', video: '' });
			const texts = textsPair[0];
			const textsRef = react.useState({ current: texts })[0];
			const tabPair = react.useState('story');
			const tab = tabPair[0];
			const text = tab === 'files' ? '' : texts[tab];
			const statusPair = react.useState('');
			const status = statusPair[0];
			const popupPair = react.useState(null);
			const popup = popupPair[0];
			const pendingPair = react.useState(null);
			const pending = pendingPair[0];
			const confirmPair = react.useState(false);
			const confirm = confirmPair[0];
			const scrollContextRef = react.useState({ current: { session: undefined, tab: undefined } })[0];

			react.useEffect(function () { pendingRef.current = pending; }, [pending]);
			react.useEffect(function () { textsRef.current = texts; }, [texts]);

			function setText(key, value, sessionId) {
				const sid = sessionId === undefined ? current : sessionId;
				const next = Object.assign({}, textsRef.current);
				next[key] = value;
				textsRef.current = next;
				textsPair[1](next);
				if (sid !== undefined) {
					if (!drafts.has(sid)) drafts.set(sid, { story: '', image: '', video: '' });
					drafts.get(sid)[key] = value;
				}
			}

			react.useEffect(function () {
				if (current === undefined) return;
				const c = drafts.has(current) ? drafts.get(current) : { story: '', image: '', video: '' };
				const next = Object.assign({}, c);
				textsRef.current = next;
				textsPair[1](next);
			}, [current]);

			react.useEffect(function () {
				return function () {
					const el = editorRef.current;
					const ctxNow = scrollContextRef.current;
					if (el === null || ctxNow.session === undefined) return;
					let mem = scrollMemory.get(ctxNow.session);
					if (mem === undefined) {
						mem = { story: 0, image: 0, video: 0 };
						scrollMemory.set(ctxNow.session, mem);
					}
					mem[ctxNow.tab] = el.scrollTop;
				};
			}, []);

			react.useEffect(function () {
				if (current === undefined || tab === 'files') return;
				const key = current + '|' + tab;
				if (dirtyTabs.has(key)) return;
				apiRead(cwd, fileForTab(tab)).then(function (res) {
					if (res && res.ok && typeof res.text === 'string') {
						const cachedText = textsRef.current[tab] || '';
						if (cachedText === '' || res.text.trim() !== cachedText.trim()) {
							setText(tab, res.text, current);
							dirtyTabs.delete(key);
							if (cachedText.trim() !== '' && res.text.trim() !== cachedText.trim()) statusPair[1]('reconciled ' + fileForTab(tab));
						}
					} else if (res && res.missing) {
						setText(tab, '', current);
						dirtyTabs.delete(key);
					} else {
						statusPair[1]('load failed: ' + (res && res.error ? res.error : 'unknown'));
					}
				}).catch(function (error) {
					statusPair[1]('load failed: ' + String((error && error.message) || error));
				});
			}, [current, cwd, tab]);

			react.useEffect(function () {
				const el = editorRef.current;
				if (el === null) return;
				const prev = scrollContextRef.current;
				// Only capture when the DOM actually holds the previous context's
				// content — right after a remount the editor is briefly empty and
				// its clamped scrollTop (0) must not overwrite the saved position.
				if (prev.session !== undefined && el.innerText !== '') {
					let mem = scrollMemory.get(prev.session);
					if (mem === undefined) {
						mem = { story: 0, image: 0, video: 0 };
						scrollMemory.set(prev.session, mem);
					}
					mem[prev.tab] = el.scrollTop;
				}
				scrollContextRef.current = { session: current, tab: tab };
				if (el.innerText !== text) renderEditor(el, text, current, tab);
				if (current !== undefined) {
					const mem = scrollMemory.get(current);
					el.scrollTop = mem !== undefined ? (mem[tab] || 0) : 0;
				}
			}, [text, current, tab]);

			react.useEffect(function () {
				const el = editorRef.current;
				if (el === null || typeof document === 'undefined' || current === undefined) return;
				const mem = selectionMemory.get(current);
				if (mem === undefined || mem.tab !== tab) {
					popupPair[1](null);
					return;
				}
				const full = texts[tab] || '';
				let lo = mem.lo;
				let hi = mem.hi;
				if (full.slice(lo, hi) !== mem.selected) {
					const idx = full.indexOf(mem.selected);
					if (idx === -1) { popupPair[1](null); return; }
					lo = idx;
					hi = idx + mem.selected.length;
				}
				const range = rangeFromOffsets(el, lo, hi);
				if (range === null) { popupPair[1](null); return; }
				markSelectionRange(range);
				const panelEl = panelRef.current;
				if (panelEl === null) { popupPair[1](null); return; }
				const pos = placePopup(range, panelEl);
				popupPair[1]({ lo: lo, hi: hi, selected: mem.selected, top: pos.top, left: pos.left, range: range });
			}, [current, tab, text]);

			react.useEffect(function () {
				if (current === undefined) return;
				const binding = pluginCtx.sessions.binding(current);
				if (binding === undefined || binding.session === undefined) return;
				const session = binding.session;
				let lastSeq = maxNodeSeq(session.getSnapshot());
				const unsubscribe = session.subscribe(function () {
					const seq = maxNodeSeq(session.getSnapshot());
					if (seq <= lastSeq) return;
					lastSeq = seq;
					if (pendingRef.current !== null) return;
					const el = editorRef.current;
					if (el !== null && typeof document !== 'undefined' && document.activeElement === el) return;
					const snap = session.getSnapshot();
					const nodes = snap && Array.isArray(snap.nodes) ? snap.nodes : [];
					let best = null;
					for (let i = 0; i < nodes.length; i++) {
						const n = nodes[i];
						if (n && n.kind === 'assistant' && n.interrupted !== true && n.messageId !== undefined && typeof n.seq === 'number') {
							if (promptReplyIds.has(n.messageId)) {
								promptReplyIds.delete(n.messageId);
								continue;
							}
							if (isPromptReplyText(nodeText(n))) continue;
							if (best === null || n.seq > best.seq) best = n;
						}
					}
					const reply = best === null ? '' : stripFence(nodeText(best));
					apiRead(cwd, 'draft.md').then(function (res) {
						if (res && res.ok && typeof res.text === 'string') {
							const fileText = res.text;
							const before = textsRef.current.story;
							if (fileText !== '' && fileText.trim() !== before.trim()) {
								setText('story', fileText, current);
								dirtyTabs.delete(current + '|story');
								statusPair[1]('loaded from draft.md');
								return;
							}
						}
						if (reply !== '') {
							const r = reply.trim();
							if (r !== '') {
								const before = textsRef.current.story;
								let next;
								if (before.trim() === '') next = r;
								else if (before.trim().endsWith(r)) next = before;
								else next = before.replace(/\s+$/, '') + '\n\n' + r;
								setText('story', next, current);
								statusPair[1]('captured the latest reply');
								apiSave(cwd, current, 'draft.md', next).then(function (saveRes) {
									if (saveRes && saveRes.ok) dirtyTabs.delete(current + '|story');
								}).catch(function () {});
							}
						}
					}).catch(function () {
						if (reply !== '') {
							const r = reply.trim();
							if (r !== '') {
								const before = textsRef.current.story;
								let next;
								if (before.trim() === '') next = r;
								else if (before.trim().endsWith(r)) next = before;
								else next = before.replace(/\s+$/, '') + '\n\n' + r;
								setText('story', next, current);
								statusPair[1]('captured the latest reply');
							}
						}
					});
				});
				return unsubscribe;
			}, [current, cwd]);

			react.useEffect(function () {
				if (pending === null || current === undefined) return;
				if (pending.sessionId !== current) { pendingPair[1](null); return; }
				const binding = pluginCtx.sessions.binding(current);
				if (binding === undefined || binding.session === undefined) {
					pendingPair[1](null);
					statusPair[1]('session lost');
					return;
				}
				const session = binding.session;
				let userSeq = -1;
				let settled = false;
				const finish = function (ok, reply, messageId) {
					if (settled) return;
					settled = true;
					disposeTimer();
					unsubscribe();
					const entry = pendingRef.current;
					if (!ok || entry === null) {
						pendingRef.current = null;
						pendingPair[1](null);
						return;
					}
					if (entry.chatOnly) {
						const trimmed = String(reply || '').trim();
						if (entry.action === 'video') {
							const lower = trimmed.toLowerCase();
							if (lower.indexOf('overall_soundscape') === -1 || lower.indexOf('non_diegetic_music') === -1 || trimmed.length < 80) {
								redoOnce(entry, session, 'Your video prompt reply is incomplete: it must contain all three labeled sections — "integrated_multimodal_description:", "overall_soundscape:", and "non_diegetic_music:" — each fully developed. It must include every dialogue line from the scene verbatim and full audio detail. Output the complete three-part prompt again, from the beginning, nothing omitted, beginning with the exact text "integrated_multimodal_description:". Do not stop early.', 'reply is missing audio sections — asking for a complete redo…');
								return;
							}
						} else if (entry.action === 'image') {
							if (trimmed.length < 30 || /^[,;:.…"']/.test(trimmed)) {
								redoOnce(entry, session, 'Your image prompt reply was truncated or incomplete. Output the complete image prompt again, from the very beginning, nothing omitted, written as a single flowing paragraph of natural-language prose beginning with the exact text "A cinematic". Do not stop early.', 'reply was a fragment — asking for a complete redo…');
								return;
							}
						}
						if (messageId !== undefined && messageId !== null) promptReplyIds.add(messageId);
						storePrompt(entry, reply);
						return;
					}
					applyReplacement(entry, reply);
				};
				const timerService = pluginCtx.get('timer');
				const disposeTimer = (timerService !== undefined && typeof timerService.timeout === 'function')
					? timerService.timeout(function () {
							const entry = pendingRef.current;
							if (entry !== null && entry.chatOnly && entry.redone !== true) {
								redoOnce(entry, session, actionMessage(entry.action, entry.instruction, entry.selected), 'no reply yet — re-asking the model…');
								return;
							}
							statusPair[1]('timed out waiting for the model reply');
							finish(false);
						}, pending.chatOnly ? 420000 : 180000)
					: function () {};
				const check = function () {
					if (settled) return;
					if (pendingRef.current === null || pendingRef.current.sessionId !== current) { finish(false); return; }
					const snap = session.getSnapshot();
					const nodes = snap && Array.isArray(snap.nodes) ? snap.nodes : [];
					if (userSeq === -1) {
						for (let i = 0; i < nodes.length; i++) {
							const n = nodes[i];
							if (n && n.kind === 'user' && typeof n.seq === 'number' && n.seq > pendingRef.current.lastSeq && n.seq > userSeq) userSeq = n.seq;
						}
						if (userSeq === -1) return;
					}
					let best = null;
					for (let i = 0; i < nodes.length; i++) {
						const n = nodes[i];
						if (n && n.kind === 'assistant' && n.interrupted !== true && n.messageId !== undefined && typeof n.seq === 'number' && n.seq > userSeq) {
							if (best === null || n.seq < best.seq) best = n;
						}
					}
					if (best === null) return;
					const reply = stripFence(nodeText(best));
					if (reply.trim() === '') return;
					finish(true, reply, best.messageId);
				};
				const unsubscribe = session.subscribe(check);
				check();
				return function () {
					disposeTimer();
					unsubscribe();
				};
			}, [pending]);

			function redoOnce(entry, session, text, statusMsg) {
				if (entry.redone) {
					pendingRef.current = null;
					pendingPair[1](null);
					statusPair[1]('still incomplete after retry — giving up');
					return;
				}
				entry.redone = true;
				entry.lastSeq = maxNodeSeq(session.getSnapshot());
				pendingRef.current = entry;
				pendingPair[1](Object.assign({}, entry));
				statusPair[1](statusMsg);
				session.prompt([{ type: 'text', text: text }], 'queue').catch(function () {});
			}

			function storePrompt(entry, reply) {
				const key = entry.action === 'image' ? 'image' : 'video';
				const file = key === 'image' ? 'images.md' : 'videos.md';
				const firstLine = String(entry.selected || '').split('\n').map(function (s) { return s.trim(); }).filter(Boolean)[0] || '';
				const excerpt = firstLine.length > 80 ? firstLine.slice(0, 80) + '…' : firstLine;
				const header = excerpt === '' ? '## Prompt' : '## ' + excerpt;
				const trimmed = String(reply || '').trim();
				const before = (textsRef.current[key] || '').trimEnd();
				const piece = before === '' ? header + '\n\n' + trimmed : before + '\n\n' + header + '\n\n' + trimmed;
				setText(key, piece, current);
				if (current !== undefined) {
					const dkey = current + '|' + key;
					dirtyTabs.add(dkey);
					apiSave(cwd, current, file, piece).then(function (res) {
						if (res && res.ok) {
							dirtyTabs.delete(dkey);
							statusPair[1]('stored in ' + (key === 'image' ? 'Image' : 'Video') + ' tab · also in chat');
						} else {
							statusPair[1]('store failed: ' + (res && res.error ? res.error : 'unknown'));
						}
					}).catch(function (error) {
						statusPair[1]('store failed: ' + String((error && error.message) || error));
					});
				}
				// A chat-only action must never touch the story: revert any change
				// that leaked in during the request (e.g. a stray capture).
				if (entry.storyBefore !== undefined && textsRef.current.story !== entry.storyBefore) {
					setText('story', entry.storyBefore, current);
					if (current !== undefined) {
						apiSave(cwd, current, 'draft.md', entry.storyBefore).catch(function () {});
						statusPair[1]('stored in ' + (key === 'image' ? 'Image' : 'Video') + ' tab · also in chat · story restored');
					}
				}
				pendingRef.current = null;
				pendingPair[1](null);
			}

			function applyReplacement(entry, reply) {
				const t = entry.tab || 'story';
				const full = textsRef.current[t] || '';
				let lo = entry.lo;
				let hi = entry.hi;
				const selected = typeof entry.selected === 'string' ? entry.selected : '';
				if (selected !== '' && full.slice(lo, hi) !== selected) {
					const idx = full.indexOf(selected);
					if (idx !== -1) { lo = idx; hi = idx + selected.length; }
				}
				let lead = '';
				let i = lo;
				while (i < hi && /\s/.test(full.charAt(i))) { lead += full.charAt(i); i++; }
				let trail = '';
				let j = hi - 1;
				while (j >= lo && /\s/.test(full.charAt(j))) { trail = full.charAt(j) + trail; j--; }
				let r = String(reply || '').replace(/^[ \t\r\n]+/, '').replace(/[ \t\r\n]+$/, '');
				const inserted = lead + r + trail;
				const next = full.slice(0, lo) + inserted + full.slice(hi);
				setText(t, next, current);
				if (current !== undefined) {
					dirtyTabs.add(current + '|' + t);
					const rs = rangesFor(current, t);
					const delta = inserted.length - (hi - lo);
					for (let k = 0; k < rs.length; k++) {
						const range = rs[k];
						if (range.lo >= hi) { range.lo += delta; range.hi += delta; }
						else if (range.hi > lo) { range.lo = -1; range.hi = -1; }
					}
					const kept = rs.filter(function (range) { return range.hi > range.lo && range.lo >= 0; });
					kept.push({ lo: lo, hi: lo + inserted.length });
					insertRanges.get(current)[t] = kept;
				}
				pendingRef.current = null;
				pendingPair[1](null);
				statusPair[1]('done');
			}

			function onEditorScroll() {
				const el = editorRef.current;
				if (el === null || current === undefined) return;
				let mem = scrollMemory.get(current);
				if (mem === undefined) {
					mem = { story: 0, image: 0, video: 0 };
					scrollMemory.set(current, mem);
				}
				mem[tab] = el.scrollTop;
			}

			function onInput() {
				const el = editorRef.current;
				if (el === null) return;
				const t = el.innerText || '';
				const next = Object.assign({}, textsRef.current);
				next[tab] = t;
				textsRef.current = next;
				textsPair[1](next);
				if (current !== undefined) {
					if (!drafts.has(current)) drafts.set(current, { story: '', image: '', video: '' });
					drafts.get(current)[tab] = t;
					dirtyTabs.add(current + '|' + tab);
					const obj = insertRanges.get(current);
					if (obj !== undefined) obj[tab] = [];
				}
			}

			function unmarkSelection() {
				try {
					if (typeof window !== 'undefined' && window.CSS && window.CSS.highlights && typeof window.CSS.highlights.delete === 'function') {
						window.CSS.highlights.delete('scr-sel');
					}
				} catch (e) {}
				const el = editorRef.current;
				if (el === null || typeof document === 'undefined') return;
				try {
					const marks = el.querySelectorAll('.scr-sel');
					for (let i = 0; i < marks.length; i++) {
						const span = marks[i];
						const parent = span.parentNode;
						if (parent === null) continue;
						while (span.firstChild !== null) parent.insertBefore(span.firstChild, span);
						parent.removeChild(span);
					}
					el.normalize();
				} catch (e) {}
			}

			function markSelectionRange(range) {
				try {
					if (typeof window !== 'undefined' && typeof window.Highlight === 'function' && window.CSS && window.CSS.highlights && typeof window.CSS.highlights.set === 'function') {
						const highlight = new window.Highlight(range);
						window.CSS.highlights.set('scr-sel', highlight);
						return;
					}
				} catch (e) {}
				const el = editorRef.current;
				if (el === null || typeof document === 'undefined') return;
				unmarkSelection();
				try {
					const span = document.createElement('span');
					span.className = 'scr-sel';
					const fragment = range.extractContents();
					span.appendChild(fragment);
					range.insertNode(span);
					el.normalize();
				} catch (e) {}
			}

			function isSelectionInsideMark() {
				const el = editorRef.current;
				if (el === null || typeof window === 'undefined') return false;
				try {
					const sel = window.getSelection();
					if (!sel || sel.anchorNode === null) return false;
					const an = sel.anchorNode;
					const node = an.nodeType === 3 ? an.parentElement : an;
					return node !== null && typeof node.closest === 'function' && node.closest('.scr-sel') !== null;
				} catch (e) {
					return false;
				}
			}

			function currentSelection() {
				if (typeof window === 'undefined' || typeof document === 'undefined') return null;
				const el = editorRef.current;
				if (el === null) return null;
				const sel = window.getSelection();
				if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null;
				const anchorNode = sel.anchorNode;
				if (anchorNode === null || !el.contains(anchorNode)) return null;
				const range = sel.getRangeAt(0);
				const selected = range.toString();
				if (selected.trim() === '') return null;
				const pre = document.createRange();
				pre.selectNodeContents(el);
				pre.setEnd(sel.anchorNode, sel.anchorOffset);
				const start = pre.toString().length;
				const post = document.createRange();
				post.selectNodeContents(el);
				post.setEnd(sel.focusNode, sel.focusOffset);
				const end = post.toString().length;
				const panelEl = panelRef.current;
				if (panelEl === null) return null;
				const pos = placePopup(range, panelEl);
				return {
					lo: Math.min(start, end),
					hi: Math.max(start, end),
					selected: selected,
					top: pos.top,
					left: pos.left,
					range: range
				};
			}

			function onSelectionEvent() {
				if (pendingRef.current !== null) { popupPair[1](null); return; }
				if (isSelectionInsideMark()) return;
				const sel = currentSelection();
				if (sel === null) {
					unmarkSelection();
					popupPair[1](null);
					if (current !== undefined) selectionMemory.delete(current);
					return;
				}
				markSelectionRange(sel.range);
				popupPair[1](sel);
				if (current !== undefined) selectionMemory.set(current, { tab: tab, lo: sel.lo, hi: sel.hi, selected: sel.selected });
			}

			function dismissPopup() {
				unmarkSelection();
				popupPair[1](null);
				if (current !== undefined) selectionMemory.delete(current);
			}

			function selectTab(t) {
				confirmPair[1](false);
				tabPair[1](t);
			}

			function actionMessage(action, instruction, passage) {
				const templates = {
					refine: 'Refine the following passage from my manuscript: improve the prose while keeping the meaning, tone, and approximate length.',
					rewrite: 'Rewrite the following passage from my manuscript in a fresh style: keep the core meaning but vary the phrasing and sentence rhythm.',
					expand: 'Expand the following passage from my manuscript: add more detail, deepen the description, and significantly increase its length.',
					image: 'First load the `krea2-prompt-suite` skill by calling the `skill` tool with that exact name, and follow its workflow to build the prompt. Then generate a detailed Krea2 t2i (text-to-image) prompt from the following scene in my story. Your reply must begin with the exact text "A cinematic" and nothing before it. Describe the subject, appearance, setting, art style, lighting, color palette, camera angle, and mood. Output ONLY the final prompt itself, written as a single flowing paragraph of natural-language prose with no labels or headings — do not include the skill\'s other output sections (no positive constraints, negative prompt, suggested settings, assumptions, or JSON). IMPORTANT: do NOT output JSON, code, or parameter lists — never include width, height, resolution, or any setting numbers.',
					video: 'First load the `h3-prompt-writing` skill by calling the `skill` tool with that exact name and follow its base-mode (T2VA) structure. There are no reference images in this request, so do not add a first/last-frame alignment line. Then generate a detailed MiniMax H3 (video + native audio) prompt from the following scene in my story. This request overrides your usual brief-chat behavior: brevity is forbidden, and you must write the complete prompt in full without stopping early. Your reply must begin with the exact text "integrated_multimodal_description:" and nothing before it. Output ONLY the prompt, written as flowing natural-language prose. IMPORTANT: do NOT output JSON, code, or parameter lists — never include resolution, fps, duration, or any setting numbers. Use the official structure with exactly three labeled parts, ALL three required and fully developed: (1) "integrated_multimodal_description:" — [Shot 1] has no timestamp; later shots use the official cut notation such as [Shot 2] At 00:04.500, the camera cuts to …, covering subject, appearance, action, camera movement (motion type + amplitude + speed), pacing, dialogue verbatim inside <d>[Language] …</d> with speaker IDs such as (S1), and shot sequence; (2) "overall_soundscape:" — diegetic audio: ambient sound and physical sounds, without repeating dialogue; (3) "non_diegetic_music:" — the score: instrumentation, tempo, rhythm, and dynamics. Match the total timeline to the requested 4-15 seconds and never use community timecode formats.'
				};
				let msg = templates[action] || templates.refine;
				const instr = String(instruction || '').trim();
				if (instr !== '') msg += ' Additional instructions: ' + instr + '.';
				msg += ' Reply with ONLY the prompt — no preamble, no commentary, no quotation marks around the whole prompt. Write plain prose only, never JSON or parameter lists. Do not call scrivener_draft for this request.';
				msg += '\n\n---\n' + passage + '\n---';
				return msg;
			}

			function runAction(action, instruction) {
				if (pendingRef.current !== null) return;
				if (popup === null) { statusPair[1]('select some text first'); return; }
				if (current === undefined) { statusPair[1]('no active session'); return; }
				const binding = pluginCtx.sessions.binding(current);
				if (binding === undefined || binding.session === undefined) { statusPair[1]('session not available'); return; }
				const session = binding.session;
				const lastSeq = maxNodeSeq(session.getSnapshot());
				const chatOnly = action === 'image' || action === 'video';
				const entry = { sessionId: current, lo: popup.lo, hi: popup.hi, selected: popup.selected, lastSeq: lastSeq, chatOnly: chatOnly, action: action, tab: tab, instruction: instruction, redone: false, storyBefore: textsRef.current.story };
				pendingRef.current = entry;
				pendingPair[1](entry);
				unmarkSelection();
				popupPair[1](null);
				if (current !== undefined) selectionMemory.delete(current);
				statusPair[1]('asking the model…');
				session.prompt([{ type: 'text', text: actionMessage(action, instruction, popup.selected) }], 'queue').then(function (result) {
					if (!(result && result.ok)) {
						pendingRef.current = null;
						pendingPair[1](null);
						statusPair[1]('send failed: ' + (result && result.error ? (result.error.message || result.error.code) : 'unknown'));
					}
				}).catch(function (error) {
					pendingRef.current = null;
					pendingPair[1](null);
					statusPair[1]('send failed: ' + String((error && error.message) || error));
				});
			}

			function saveDraft() {
				const t = tab;
				statusPair[1]('saving…');
				apiSave(cwd, current, fileForTab(t), texts[t]).then(function (res) {
					if (res && res.ok) {
						if (current !== undefined) dirtyTabs.delete(current + '|' + t);
						statusPair[1]('saved to ' + (res.path || fileForTab(t)));
					} else statusPair[1]('save failed: ' + (res && res.error ? res.error : 'unknown'));
				}).catch(function (error) {
					statusPair[1]('save failed: ' + String((error && error.message) || error));
				});
			}

			function clearDraft() {
				confirmPair[1](false);
				unmarkSelection();
				popupPair[1](null);
				if (current !== undefined) selectionMemory.delete(current);
				const t = tab;
				setText(t, '', current);
				if (current !== undefined) dirtyTabs.add(current + '|' + t);
				statusPair[1]('clearing ' + fileForTab(t) + '…');
				apiSave(cwd, current, fileForTab(t), '').then(function (res) {
					if (res && res.ok) {
						if (current !== undefined) dirtyTabs.delete(current + '|' + t);
						statusPair[1](fileForTab(t) + ' cleared');
					} else statusPair[1]('clear failed: ' + (res && res.error ? res.error : 'unknown'));
				}).catch(function (error) {
					statusPair[1]('clear failed: ' + String((error && error.message) || error));
				});
			}

			function copyDraft() {
				const t = text || '';
				function ok() { statusPair[1]('copied'); }
				function fail() { statusPair[1]('copy failed'); }
				try {
					if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
						navigator.clipboard.writeText(t).then(ok).catch(fail);
						return;
					}
				} catch (e) {}
				try {
					const el = editorRef.current;
					if (el !== null && typeof document !== 'undefined' && typeof window !== 'undefined') {
						const range = document.createRange();
						range.selectNodeContents(el);
						const sel = window.getSelection();
						if (sel) { sel.removeAllRanges(); sel.addRange(range); }
						if (document.execCommand && document.execCommand('copy')) ok();
						else fail();
						return;
					}
				} catch (e) {}
				fail();
			}

			function reloadDraft() {
				const t = tab;
				apiRead(cwd, fileForTab(t)).then(function (res) {
					if (res && res.ok && typeof res.text === 'string') {
						setText(t, res.text, current);
						if (current !== undefined) dirtyTabs.delete(current + '|' + t);
						statusPair[1]('reloaded');
					} else {
						statusPair[1]('reload failed: ' + (res && res.error ? res.error : 'unknown'));
					}
				}).catch(function (error) {
					statusPair[1]('reload failed: ' + String((error && error.message) || error));
				});
			}

			function onKeyDown(event) {
				if (event && event.key === 'Enter') {
					event.preventDefault();
					try { if (document.execCommand) document.execCommand('insertText', false, '\n'); } catch (e) {}
				}
			}

			function onPaste(event) {
				event.preventDefault();
				const data = event.clipboardData ? event.clipboardData.getData('text/plain') : '';
				try { if (document.execCommand) document.execCommand('insertText', false, data); } catch (e) {}
			}

			const words = (text.trim() === '') ? 0 : text.trim().split(/\s+/).length;

			const editorEl = tab === 'files'
				? react.createElement(FilesBrowser, { cwd: cwd })
				: react.createElement('div', {
					ref: function (node) { editorRef.current = node; },
					className: 'scr-editor',
					contentEditable: pending === null,
					suppressContentEditableWarning: true,
					spellCheck: false,
					onInput: onInput,
					onScroll: onEditorScroll,
					onSelect: onSelectionEvent,
					onMouseUp: onSelectionEvent,
					onKeyUp: onSelectionEvent,
					onKeyDown: onKeyDown,
					onPaste: onPaste
				});

			const tabBar = react.createElement('div', { className: 'scr-tabs' },
				react.createElement('button', { type: 'button', className: tab === 'story' ? 'scr-tab scr-tab-active' : 'scr-tab', onClick: function () { selectTab('story'); } }, 'Story'),
				react.createElement('button', { type: 'button', className: tab === 'image' ? 'scr-tab scr-tab-active' : 'scr-tab', onClick: function () { selectTab('image'); } }, 'Image'),
				react.createElement('button', { type: 'button', className: tab === 'video' ? 'scr-tab scr-tab-active' : 'scr-tab', onClick: function () { selectTab('video'); } }, 'Video'),
				react.createElement('button', { type: 'button', className: tab === 'files' ? 'scr-tab scr-tab-active' : 'scr-tab', onClick: function () { selectTab('files'); } }, 'Files')
			);

			const popupEl = popup === null ? null : react.createElement('div', {
				className: 'scr-popup',
				style: {
					left: popup.left + 'px',
					top: popup.top + 'px'
				},
				onMouseDown: function (event) {
					const target = event && event.target;
					if (target && typeof target.closest === 'function' && target.closest('.scr-instr')) return;
					event.preventDefault();
				}
			},
				react.createElement('div', { className: 'scr-popup-row' },
					react.createElement('button', { type: 'button', disabled: pending !== null, onClick: function () { runAction('refine', instrRef.current); } }, 'Refine'),
					react.createElement('button', { type: 'button', disabled: pending !== null, onClick: function () { runAction('rewrite', instrRef.current); } }, 'Rewrite'),
					react.createElement('button', { type: 'button', disabled: pending !== null, onClick: function () { runAction('expand', instrRef.current); } }, 'Expand')
				),
				react.createElement('div', { className: 'scr-popup-row' },
					react.createElement('button', { type: 'button', disabled: pending !== null, onClick: function () { runAction('image', instrRef.current); } }, 'Image Prompt'),
					react.createElement('button', { type: 'button', disabled: pending !== null, onClick: function () { runAction('video', instrRef.current); } }, 'Video Prompt')
				),
				react.createElement('input', {
					className: 'scr-instr',
					placeholder: 'Add instructions…',
					onKeyDown: function (event) {
						event.stopPropagation();
						if (event.key === 'Enter') runAction('refine', instrRef.current);
						if (event.key === 'Escape') dismissPopup();
					},
					onInput: function (event) { instrRef.current = event.target.value; }
				})
			);

			const confirmEl = confirm ? react.createElement('div', { className: 'scr-confirm' },
				react.createElement('div', { className: 'scr-confirm-text' }, 'Clear ' + fileForTab(tab) + '? This empties this tab and overwrites ' + fileForTab(tab) + ' with empty content.'),
				react.createElement('div', { className: 'scr-popup-row' },
					react.createElement('button', { type: 'button', onClick: function () { confirmPair[1](false); } }, 'Cancel'),
					react.createElement('button', { type: 'button', onClick: clearDraft }, 'Clear')
				)
			) : null;

			const foot = tab === 'files'
				? react.createElement('div', { className: 'scr-foot' },
					react.createElement('span', { className: 'scr-status' }, status)
				)
				: react.createElement('div', { className: 'scr-foot' },
					react.createElement('span', null, words + ' words · ' + text.length + ' chars'),
					react.createElement('button', { className: 'scr-btn', onClick: reloadDraft }, 'Reload'),
					react.createElement('button', { className: 'scr-btn', onClick: copyDraft }, 'Copy'),
					react.createElement('button', { className: 'scr-btn', onClick: saveDraft }, 'Save'),
					react.createElement('button', { className: 'scr-btn', disabled: pending !== null, onClick: function () { confirmPair[1](true); } }, 'Clear'),
					react.createElement('span', { className: 'scr-status' }, status)
				);

			return react.createElement('div', {
				ref: function (node) { panelRef.current = node; },
				className: 'scr-pane',
				onMouseDown: function (event) {
					const target = event && event.target;
					if (target && typeof target.closest === 'function' && target.closest('.scr-confirm')) return;
					confirmPair[1](false);
				}
			},
				tabBar,
				editorEl,
				popupEl,
				confirmEl,
				foot
			);
		}

		function apply(ctx) {
			pluginCtx = ctx;
			ctx.slots.inject('shell.overlay', function () {
				return ctx.slots.register({ name: 'shell.overlay', id: 'scr-pane-controller', order: 0, label: function () { return 'Scrivener controller'; } }, Controller);
			});
			ctx.slots.inject('conversation.session.header.actions', function () {
				return ctx.slots.register({ name: 'conversation.session.header.actions', id: 'scr-pane-toggle', order: 0, label: function () { return 'Scrivener'; } }, ToggleButton);
			});
		}

		const name = "scr-pane-client";
		const inject = ["slots", "sessions"];
		exports.name = name;
		exports.inject = inject;
		exports.apply = apply;
		return module.exports;
	}
});
