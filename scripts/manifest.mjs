import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Build targets and the manifest overlay each one uses. Chrome, Edge and Chromium share one. */
export const TARGETS = {
  chrome: 'chrome',
  edge: 'chrome',
  chromium: 'chrome',
  firefox: 'firefox',
};

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function readJson(path) {
  return JSON.parse(await readFile(join(root, path), 'utf8'));
}

/** Combines the shared manifest with the browser-specific one; the version comes from package.json. */
export async function buildManifest(target, version) {
  const base = await readJson('manifests/base.json');
  const overlay = await readJson(`manifests/${TARGETS[target]}.json`);
  return { ...base, ...overlay, version };
}
