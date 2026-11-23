# Browser support

One TypeScript codebase targets Manifest V3 in four browsers.

| Browser | Build | Background | Minimum version | Tested in CI |
| --- | --- | --- | --- | --- |
| Chrome | `dist/chrome` | Service worker | 114 | Chromium (integration), manifest checks |
| Edge | `dist/edge` | Service worker | 114 (Chromium-based) | Same build as Chrome; manifest checks |
| Chromium | `dist/chromium` | Service worker | 114 | Chromium (integration) |
| Firefox | `dist/firefox` | Event page (`background.scripts`) | 140 desktop, 142 Android | `web-ext lint`, manifest checks |

The Chrome, Edge and Chromium builds have identical contents. They are built separately so each store gets its own clearly named package. Edge accepts a Chrome extension unchanged.

Firefox 140 and 142 are the first versions that understand `data_collection_permissions`, which addons.mozilla.org now requires. Lower `strict_min_version` in `manifests/firefox.json` only if you also support older versions and accept the lint warning.

## How the builds differ

`scripts/build.mjs` merges `manifests/base.json` with an overlay:

| File | Used by | Adds |
| --- | --- | --- |
| `manifests/chrome.json` | Chrome, Edge, Chromium | `background.service_worker`, `minimum_chrome_version` |
| `manifests/firefox.json` | Firefox | `background.scripts`, `browser_specific_settings` (add-on ID, minimum versions, data collection) |

Chrome does not accept `background.scripts` and Firefox does not run `background.service_worker`, so each build gets only its own. Add other browser-only keys to the matching overlay.

## Writing code that runs everywhere

- Import `api` from `src/shared/api.ts` instead of using `chrome` or `browser` directly. In Manifest V3 both return promises.
- Event pages (Firefox) and service workers (Chromium) are stopped when idle. Keep no state in memory: use `storage`, and register listeners at the top level.
- Use `chrome.storage.sync` for settings. Browsers fall back to local storage when sync is off.
- Request only the permissions you use. Prefer `activeTab` over broad host permissions.
- Check [MDN's browser compatibility tables](https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs) before using an API. The Chromium side panel, offscreen documents and `declarativeNetRequest` limits all differ in Firefox.

## Not covered by automated tests

The integration test loads the extension in Chromium only. Firefox is checked statically with `web-ext lint`, which catches manifest and API problems but not runtime behavior. Test Firefox by hand with `npx web-ext run`, or add your own end-to-end tests with a tool that can drive Firefox with an installed temporary add-on.
