# Scrivener pane — durable web bundle

This is the **permanent install** of the Scrivener editor pane: a dual-face
profile bundle (`dsh.bundle.patch` + `dsh.client`) that loads natively on every
page load, so the pane survives refreshes and DSH restarts. It replaced the
dynamic Cordis plugin (sources kept under `plugin/` for reference).

Live copy on this machine: `C:\Users\xuchuang\.dsh\profiles\web\scr-pane\`
(linked into the profile as `file:./scr-pane` and listed in
`dsh.profile.bundles`).

## Files

- `package.json` — exports `.` (host) and `./client`; `dsh.bundle.patch` and
  `dsh.client` declarations. Client inject lists ROSTER packages only
  (dsh-client-runtime, dsh-client-ui-layout, dsh-client-ui-conversation).
- `cordis.patch.yml` — one dual-face row: `- id: scr-pane, name: 'scr-pane'`.
- `lib/host.js` — node half: `/scr-api/read` (GET) and `/scr-api/save` (POST)
  file routes over the webServer service, with defensive sandbox-policy
  resolution (falls back to workspace-write rooted at the caller's cwd) and a
  debug log at `~/.dsh/scr-api-debug.log`.
- `lib/client.js` — browser half: the full pane (Story/Image/Video tabs,
  selection popup, auto-feed, persistence maps, fragment auto-repair). Registers
  into the `details` slot at priority -3 only while the active session's preset
  is `scrivener`, and re-opens the column on every session switch.

## Installing / updating the live copy

1. Edit the files in `C:\Users\xuchuang\.dsh\profiles\web\scr-pane\`.
2. pnpm **copies** `file:` deps — refresh the link:
   `Remove-Item node_modules\scr-pane -Recurse -Force; pnpm install --offline`
   (in `C:\Users\xuchuang\.dsh\profiles\web`).
3. Client-only changes: a page refresh picks them up (served `no-cache`).
   Host changes: restart DSH (`Restart-DSH.bat` on the desktop).

Rollback: remove `"scr-pane"` from `dsh.profile.bundles` in the profile
`package.json`, delete `node_modules\scr-pane`, reinstall, restart.
