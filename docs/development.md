# Development

Requires Node.js 22 or newer (see `.nvmrc`).

## Layout

```text
manifests/             base.json plus one overlay per browser family
src/background/        service worker (Chrome, Edge, Chromium) / event page (Firefox)
src/content/           content script injected into matching pages
src/popup/             toolbar popup
src/options/           options page
src/shared/            code shared by all of the above (API shim, settings, i18n)
src/_locales/          translations (messages.json per language)
src/assets/icons/      toolbar and store icons: replace the placeholders
scripts/build.mjs      builds every target into dist/<target>/
tests/unit/            Vitest unit tests with coverage (80% minimum)
tests/integration/     Playwright tests that load the built extension into Chromium
store/                 metadata used when uploading to stores
```

The example extension shows a banner on `https://example.com/*`. Pages, permissions and behavior are placeholders: replace them with your own. After creating a repo from this template:

1. Set `name`, `description` and `version` in `package.json`. The version is copied into every manifest.
2. Edit `manifests/base.json`: permissions, `content_scripts.matches`, icons. Keep permissions to the minimum.
3. Change the name and description in `src/_locales/en/messages.json`, and replace the icons.
4. Set your own add-on ID in `manifests/firefox.json`. Run **Init** first so it uses your owner and repository name.
5. Replace the example code.

## Commands

```bash
npm ci                     # install dependencies
npm run build              # build all targets into dist/
npm run build:firefox      # build one target: chrome, edge, chromium or firefox
npm run dev                # rebuild on change (all targets, no minify)
npm run package            # minified builds and store-ready zips in artifacts/
npm test                   # unit tests with coverage
npm run test:integration   # build, then run the Chromium tests
npm run lint               # ESLint (strict, type-aware)
npm run typecheck          # TypeScript
npm run format             # Prettier
npm run lint:ext           # Mozilla's web-ext lint on dist/firefox
```

Integration tests need a Chromium that Playwright can launch: run `npx playwright install chromium` once, or set `CHROMIUM_PATH` to an existing browser.

## Loading the extension

Build first (`npm run build`), then load the folder for your browser.

| Browser | Folder | Steps |
| --- | --- | --- |
| Chrome | `dist/chrome` | `chrome://extensions`, enable **Developer mode**, **Load unpacked** |
| Edge | `dist/edge` | `edge://extensions`, enable **Developer mode**, **Load unpacked** |
| Chromium | `dist/chromium` | `chrome://extensions`, enable **Developer mode**, **Load unpacked** |
| Firefox | `dist/firefox` | `about:debugging#/runtime/this-firefox`, **Load Temporary Add-on**, pick `manifest.json` |

You can also run Firefox with automatic reloads: `npx web-ext run --source-dir dist/firefox`. Keep `npm run dev` running in another terminal.

## Pre-commit hooks

```bash
pip install pre-commit
pre-commit install --hook-type pre-commit --hook-type post-commit
```

Hooks run gitleaks, file hygiene, markdownlint, actionlint, Prettier, ESLint, `tsc` and the unit tests. Sweepito scans and cleans up generated files.

## Continuous integration

The `ci` workflow runs four jobs: `lint` (pre-commit, including Prettier, ESLint and `tsc`), `test` (unit tests on Node.js 22 and 24 on Ubuntu, and 22 on Windows and macOS), `integration` (the built extension in Chromium) and `build` (packages for every browser, plus `web-ext lint` on the Firefox build). A final `ci` job gates on all four and is the single required check in the branch ruleset.
