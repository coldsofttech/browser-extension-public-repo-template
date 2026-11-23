#!/usr/bin/env node
/**
 * Builds the extension for one or more browsers into dist/<target>/.
 *
 * Usage: node scripts/build.mjs [--target chrome|edge|chromium|firefox|all]
 *                               [--minify] [--watch] [--zip]
 *
 * Chrome, Edge and Chromium share one manifest (manifests/chrome.json); Firefox has its own.
 * --zip also writes artifacts/<name>-<version>-<target>.zip, ready for the stores.
 */
import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import * as esbuild from 'esbuild';
import { buildManifest, TARGETS } from './manifest.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const entries = {
  background: 'src/background/index.ts',
  content: 'src/content/index.ts',
  popup: 'src/popup/popup.ts',
  options: 'src/options/options.ts',
};
const staticFiles = [
  ['src/popup/popup.html', 'popup.html'],
  ['src/popup/popup.css', 'popup.css'],
  ['src/options/options.html', 'options.html'],
  ['src/options/options.css', 'options.css'],
  ['src/assets/icons', 'icons'],
  ['src/_locales', '_locales'],
];

async function readPackage() {
  return JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
}

function bundleOptions(target, minify) {
  return {
    absWorkingDir: root,
    entryPoints: entries,
    outdir: `dist/${target}`,
    bundle: true,
    format: 'iife',
    target: 'es2022',
    minify,
    sourcemap: minify ? false : 'linked',
    logLevel: 'info',
  };
}

async function copyStatic(target) {
  for (const [from, to] of staticFiles) {
    await cp(join(root, from), join(root, 'dist', target, to), { recursive: true });
  }
}

async function build(target, pkg, { minify, watch, zip }) {
  const out = join(root, 'dist', target);
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });
  await copyStatic(target);
  await writeFile(
    join(out, 'manifest.json'),
    `${JSON.stringify(await buildManifest(target, pkg.version), null, 2)}\n`,
  );

  if (watch) {
    const ctx = await esbuild.context(bundleOptions(target, minify));
    await ctx.watch();
    console.log(`Watching ${target}…`);
    return;
  }
  await esbuild.build(bundleOptions(target, minify));

  if (zip) {
    const file = `${pkg.name}-${pkg.version}-${target}.zip`;
    execFileSync(
      'npx',
      [
        'web-ext',
        'build',
        '--source-dir',
        out,
        '--artifacts-dir',
        'artifacts',
        '--filename',
        file,
        '--overwrite-dest',
      ],
      { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' },
    );
  }
}

async function main() {
  const { values } = parseArgs({
    options: {
      target: { type: 'string', default: 'all' },
      minify: { type: 'boolean', default: false },
      watch: { type: 'boolean', default: false },
      zip: { type: 'boolean', default: false },
    },
  });
  const targets = values.target === 'all' ? Object.keys(TARGETS) : [values.target];
  for (const target of targets) {
    if (!(target in TARGETS)) {
      throw new Error(
        `Unknown target "${target}". Use one of: ${Object.keys(TARGETS).join(', ')}, all`,
      );
    }
  }
  const pkg = await readPackage();
  for (const target of targets) await build(target, pkg, values);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
