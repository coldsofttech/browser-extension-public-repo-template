/**
 * Browser-neutral access to the WebExtension API.
 *
 * Firefox exposes the promise-based API as `browser`; Chrome, Edge and other Chromium browsers
 * expose `chrome`, which also returns promises in Manifest V3. Import `api` instead of using
 * either global directly, so the same code runs everywhere.
 */
type Api = typeof chrome;

declare const browser: Api | undefined;

export const api: Api = typeof browser === 'undefined' ? chrome : browser;
