// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildManifest, TARGETS } from '../../scripts/manifest.mjs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { version: string };
const targets = Object.keys(TARGETS);

interface Manifest {
  manifest_version: number;
  version: string;
  background: { service_worker?: string; scripts?: string[] };
  browser_specific_settings?: { gecko?: { id?: string } };
}

describe.each(targets)('manifest for %s', (target) => {
  it('is Manifest V3 with the package version', async () => {
    const manifest = (await buildManifest(target, pkg.version)) as unknown as Manifest;
    expect(manifest.manifest_version).toBe(3);
    expect(manifest.version).toBe(pkg.version);
  });

  it('uses the background style the browser supports', async () => {
    const manifest = (await buildManifest(target, pkg.version)) as unknown as Manifest;
    if (target === 'firefox') {
      expect(manifest.background.scripts).toEqual(['background.js']);
      expect(manifest.background.service_worker).toBeUndefined();
      expect(manifest.browser_specific_settings?.gecko?.id).toBeTruthy();
    } else {
      expect(manifest.background.service_worker).toBe('background.js');
      expect(manifest.background.scripts).toBeUndefined();
      expect(manifest.browser_specific_settings).toBeUndefined();
    }
  });
});
