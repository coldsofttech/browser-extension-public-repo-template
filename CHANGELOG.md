# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Cross-browser Manifest V3 extension template for Chrome, Edge, Chromium and Firefox, with a background worker, content script, popup and options page.
- Build script producing one package per browser, with strict TypeScript, ESLint, Prettier and Vitest unit tests.
- Chromium integration tests and `web-ext lint` for the Firefox build in CI.
- Release workflow that attaches packages to the GitHub release and can upload to the Chrome, Edge and Firefox stores.
