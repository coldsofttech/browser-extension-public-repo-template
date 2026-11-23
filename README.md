# browser-extension-public-repo-template

[![CI](https://github.com/coldsofttech/browser-extension-public-repo-template/actions/workflows/ci.yml/badge.svg)](https://github.com/coldsofttech/browser-extension-public-repo-template/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/coldsofttech/browser-extension-public-repo-template)](LICENSE)

A ready-to-use starting point for public browser extensions on GitHub. One TypeScript codebase builds a Manifest V3 extension for **Chrome, Edge, Chromium and Firefox**, with tests, linting, packaging, releases and the community and security files a public repository needs.

## What you get

- A working example: background worker, content script, popup and options page that share settings through `storage`
- Builds for Chrome, Edge, Chromium and Firefox from one source tree, with per-browser manifests
- Strict TypeScript, ESLint and Prettier, with the checks running before every commit and in CI
- Unit tests, plus integration tests that load the built extension into a real Chromium
- `web-ext lint` on the Firefox build, and store-ready zips for every browser
- Releases that attach the packages to GitHub and can upload to the Chrome, Edge and Firefox stores
- Contribution, conduct, support and security-reporting guidelines
- Issue forms, a pull request template and automated dependency updates

## Getting started

1. Click **Use this template** on GitHub and create your new repository.
2. Run the **Init** workflow from the Actions tab and merge the pull request it opens. This fills in your owner and repository name.
3. Replace the example extension and set your name, description, permissions and icons. See the [development guide](docs/development.md).
4. Add your contact details in `CODE_OF_CONDUCT.md`, delete `.github/workflows/init.yml`, and replace this description.
5. Apply the repository protections by following the [setup guide](docs/repo-setup.md).
6. Install dependencies and commit checks:

   ```bash
   npm ci
   pip install pre-commit && pre-commit install --hook-type pre-commit --hook-type post-commit
   ```

## Install the extension

| Browser | From a store | From source |
| --- | --- | --- |
| Chrome | Chrome Web Store (add your link) | Load `dist/chrome` unpacked |
| Edge | Microsoft Edge Add-ons (add your link) | Load `dist/edge` unpacked |
| Chromium | Chrome Web Store (add your link) | Load `dist/chromium` unpacked |
| Firefox | Firefox Add-ons (add your link) | Load `dist/firefox/manifest.json` as a temporary add-on |

Each [release](../../releases) also has a zip per browser. See [development](docs/development.md#loading-the-extension) for step-by-step loading instructions.

## Usage

The example extension shows a banner on `https://example.com/*`. Click the toolbar icon to switch it on or off, and open the options page to change the message.

> Replace this section with a short walkthrough of what your extension does.

## Development

```bash
git clone https://github.com/coldsofttech/browser-extension-public-repo-template.git
cd browser-extension-public-repo-template
npm ci
npm run build
npm test
```

See the [development guide](docs/development.md) for loading the extension, testing and packaging, [browser support](docs/browser-support.md) for how the builds differ, and [publishing](docs/publishing.md) for releases and stores.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Please report security issues privately as described in [SECURITY.md](SECURITY.md).

## License

Released under the [MIT License](LICENSE).
