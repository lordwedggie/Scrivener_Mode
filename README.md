# Scrivener Mode

A novel-writing mode for the DeepSeek Harness (DSH). It adds a **Scrivener mode** agent preset plus a right-side editor pane that appears only in Scrivener sessions. Generated prose flows into the pane automatically; select any passage to Refine, Rewrite, or Expand it with optional instructions.

## What you get

- **Scrivener mode** — a selectable agent preset with a novelist persona and a `scrivener_draft` tool.
- **Mode-specific editor pane** — lives in the built-in right `details` column (real layout column with a drag seam, no overlap with chat). It renders only while the active session runs the `scrivener` preset; every other session keeps the normal tool-details panel.
- **Auto-feed** — every finalized assistant reply is merged into the editor (appended, or fills an empty pane) and auto-saved to `draft.md` in the session workspace. No special prompt needed.
- **Selection popup** — select text in the pane to get Refine / Rewrite / Expand buttons plus an instructions input. The action submits the selection + instructions to the model and replaces the selection with the transformed reply.
- **Footer** — word/char count, Reload, Copy, Save.

## Contents

```
preset/                     The agent preset (copy into $DSH_HOME/.agent-presets/scrivener/)
  agent.cordis.yml          Composition: standard catalog + novelist persona + draft tool row
  preset.yml                Display metadata ("Scrivener mode")
  scrivener-draft.mjs       Model-facing scrivener_draft tool (writes draft.md)
plugin/                     The editor pane plugin source (dynamic Cordis plugin halves)
  host.js                   Host half: scrivener/read + scrivener/save RPC over draft.md
  client.js                 Client half: gated details-column pane, popup, auto-feed
```

## Install (preset — durable)

Copy the `preset/` directory to `%DSH_HOME%/.agent-presets/scrivener/` (default `C:\Users\<you>\.dsh\.agent-presets\scrivener\`). The mode appears in the new-session preset picker and in Settings → Agent presets. Validate by mounting a probe plugin that calls `ctx.agentPresets.standingKeyFor('scrivener')`; it must return normally.

## Install (editor pane — dynamic plugin)

The pane is a dynamic Cordis plugin, so it is **process-local**: it must be (re)run after every DSH restart or page refresh.

1. In a DSH session (Creator mode recommended), define a Plugin with both halves — the contents of `plugin/host.js` and `plugin/client.js` are the exact function bodies for `code.host` and `code.client`.
2. Run the Package and approve it in the web GUI.

After approval, open a session on **Scrivener mode**: the pane appears in the right column, the drag seam between chat and pane resizes it, and replies auto-feed into the editor.

## Known limitations

- **Reboots/refresh wipe the pane** — inherent to dynamic plugins; re-run the package (this README's Install section). A durable static `dsh.client` bundle in the web profile is the roadmap fix.
- **Tool details in Scrivener sessions** — while a Scrivener session is active, the right column is the editor, so clicking a tool row does not show the tool-details panel there (tool output still renders as cards in chat). An Editor/Tool-details tab is a possible refinement.
- The pane was developed and verified against DSH 0.1.0-rc.6; APIs may drift in newer harness versions.

## License

MIT
