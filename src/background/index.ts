import { api } from '../shared/api';
import { badgeFor } from '../shared/badge';
import { t } from '../shared/i18n';
import {
  DEFAULT_SETTINGS,
  getSettings,
  onSettingsChanged,
  type Settings,
} from '../shared/settings';

// Runs as a service worker in Chrome, Edge and Chromium, and as an event page in Firefox. Neither
// keeps state in memory between events, so always read from storage and register listeners at the
// top level.

async function updateBadge(settings: Settings): Promise<void> {
  const badge = badgeFor(settings.enabled, { on: t('badgeOn'), off: t('badgeOff') });
  await api.action.setBadgeText({ text: badge.text });
  await api.action.setBadgeBackgroundColor({ color: badge.color });
}

api.runtime.onInstalled.addListener((details) => {
  void (async () => {
    if (details.reason === 'install') {
      // Seed defaults once; later reads fall back to them anyway.
      await api.storage.sync.set({ ...DEFAULT_SETTINGS, message: t('defaultBannerMessage') });
    }
    await updateBadge(await getSettings());
  })();
});

// The worker restarts often, so re-apply the badge on browser start as well.
api.runtime.onStartup.addListener(() => {
  void getSettings().then(updateBadge);
});

onSettingsChanged((settings) => {
  void updateBadge(settings);
});
