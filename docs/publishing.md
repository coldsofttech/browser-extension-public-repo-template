# Publishing

Releases are created from GitHub. The `release.yml` workflow builds one package per browser, attaches the zips to the release, and can upload them to each store.

## Release steps

1. Bump `version` in `package.json` and update `CHANGELOG.md` in a pull request.
2. After it merges, publish a GitHub release tagged `v<version>`. The workflow fails if the tag and version differ.
3. The `build` job tests and packages every browser, then the `attach` job adds these files to the release:

   - `<name>-<version>-chrome.zip`
   - `<name>-<version>-edge.zip`
   - `<name>-<version>-chromium.zip`
   - `<name>-<version>-firefox.zip`

The first submission to each store is manual: create the listing, upload the zip, and fill in descriptions, screenshots and the privacy policy. Automated uploads work only for later versions.

## Automated store uploads

Each store job is off by default. To turn one on, set a repository variable to `true` (Settings > Secrets and variables > Actions > Variables) and add the secrets to the matching environment. The settings script creates the environments and limits them to `v*` tags.

| Store | Variable | Environment | Secrets |
| --- | --- | --- | --- |
| Chrome Web Store | `PUBLISH_CHROME` | `chrome-web-store` | `CHROME_EXTENSION_ID`, `CHROME_CLIENT_ID`, `CHROME_CLIENT_SECRET`, `CHROME_REFRESH_TOKEN` |
| Microsoft Edge Add-ons | `PUBLISH_EDGE` | `edge-add-ons` | `EDGE_PRODUCT_ID`, `EDGE_CLIENT_ID`, `EDGE_API_KEY` |
| Firefox Add-ons (AMO) | `PUBLISH_FIREFOX` | `firefox-amo` | `AMO_JWT_ISSUER`, `AMO_JWT_SECRET` |

How to get the credentials:

- **Chrome:** follow the [Chrome Web Store API guide](https://developer.chrome.com/docs/webstore/using-api) to create an OAuth client and refresh token. The job uses [chrome-webstore-upload-cli](https://github.com/fregante/chrome-webstore-upload-cli).
- **Edge:** in Partner Center, open Publish API and create API credentials. See the [Edge Add-ons API docs](https://learn.microsoft.com/microsoft-edge/extensions/publish/api/using-addons-api).
- **Firefox:** create API keys at [addons.mozilla.org](https://addons.mozilla.org/developers/addon/api/key/). The job runs `web-ext sign --channel listed` with `store/amo-metadata.json` and uploads a source archive, because AMO reviewers need the source of bundled code. Fill in the metadata file before the first run.

> The store upload jobs are provided as a starting point and have not been run against live store accounts. Test them with a throwaway extension before relying on them.

## Review requirements

- **Firefox:** the source archive must build the submitted package. `npm ci && npm run package` does. State the Node.js version (see `.nvmrc`) in the review notes.
- **Chrome and Edge:** explain each permission and host pattern in the listing. Broad host permissions slow review.
- All stores require a privacy policy if you handle user data. The Firefox manifest declares `data_collection_permissions` as `none`: change it if your extension collects data.
