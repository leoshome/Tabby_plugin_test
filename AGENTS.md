# AGENTS.md

## Repo structure

Two independent Tabby plugins in one repo:

| Plugin | Directory | Entry | Build |
|--------|-----------|-------|-------|
| `tabby-script-runner` | `src/` (root) | `src/index.ts` | `npm run build` |
| `tabby-notepad-btn` | `notepad-btn/` | `notepad-btn/src/index.ts` | `cd notepad-btn && npx webpack --mode production` |

Each has its own `package.json`, `webpack.config.js`, `tsconfig.json`.

## Tabby plugin architecture

- Plugins are Angular (`@angular/core` ^15) modules targeting `node` (Electron renderer).
- UMD output (`libraryTarget: 'umd'`), externalizing `rxjs`, `@angular/*`, `@ng-bootstrap/*`, `tabby-*`.
- Key extension points from `tabby-core`:
  - `ToolbarButtonProvider` — add toolbar buttons (with submenus)
  - `ConfigProvider` — default config
  - `AppService` — access current active tab
  - `LogService` — logging
- From `tabby-terminal`: `TerminalDecorator` — attach to terminal tabs, `BaseTerminalTabComponent`
- From `tabby-electron`: `ElectronService` — wraps Electron APIs (`dialog`, `shell`, `clipboard`, etc.)
- From `tabby-settings`: `SettingsTabProvider` — add settings panel tabs

## Key details

- `ElectronService.dialog.showOpenDialog()` returns `{ canceled, filePaths }` — use for file pickers.
- `ElectronService.dialog.showMessageBox({ message })` — use for alerts instead of `alert()` (browser `alert()` is unreliable in Tabby's Electron renderer).
- `BaseTerminalTabComponent.sendInput(text)` sends text to the terminal session.
- Terminal session output is exposed as `session.output$` (RxJS Observable).
- Angular constructor injection works; services from `tabby-electron`/`tabby-core` are available globally when Tabby loads the plugin.
- Dynamic `require()` (for user script files) produces webpack warnings — expected, not errors.
- **Avoid `LogService.info()` after `await`** — logging after promise continuation can crash silently in the async generator. Use `fs.appendFileSync()` for diagnostic logging instead.
- **Don't use `nativeRequire.resolve()` / `nativeRequire.cache`** for loading user scripts — webpack's `require` lacks these. Use `fs.readFileSync()` + `new Function('module', 'exports', code)` to load user `.js` scripts.
- **Use `eval('require')` for native Node require** — webpack with `target: 'node'` can mangle `__non_webpack_require__`, but `eval('require')` reliably accesses the real Node `require`.
- **`output$` emits data ending with `\n`** — always filter empty lines after `.split('\n')` before picking the last line.

## Build & deploy

```bash
# Root plugin (tabby-script-runner)
npm install
npm run build          # → dist/index.js
npm run dev            # watch mode

# notepad-btn plugin
cd notepad-btn && npm install
cd notepad-btn && npx webpack --mode production  # → notepad-btn/dist/index.js
```

Staging directories (`staging/`, `notepad-btn/staging/`) hold deployable package manifests. After building, copy `dist/` output into the corresponding staging folder.

To install in Tabby, copy the staging folder into Tabby's plugins directory:
```
%APPDATA%\tabby\plugins\node_modules\tabby-notepad-btn\
%APPDATA%\tabby\plugins\node_modules\tabby-script-runner\
```

## Conventions

- No comments in code unless the user requests them.
- Run `npm run build` after changes to verify compilation.
- `.gitignore` excludes `node_modules/`, `dist/`, `staging/`, `*.js.map`, `*.d.ts`.
