import { api } from './api';

export type Settings = {
  /** Whether the content script shows its banner. */
  enabled: boolean;
  /** Text shown in the banner. */
  message: string;
};

export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  message: 'Hello from the browser extension template!',
};

export const MAX_MESSAGE_LENGTH = 200;

/** Turns whatever is in storage into valid settings, falling back to defaults field by field. */
export function normalizeSettings(raw: unknown): Settings {
  const value = (typeof raw === 'object' && raw !== null ? raw : {}) as Partial<
    Record<keyof Settings, unknown>
  >;
  const message =
    typeof value.message === 'string' && value.message.trim() !== ''
      ? value.message.trim().slice(0, MAX_MESSAGE_LENGTH)
      : DEFAULT_SETTINGS.message;
  return {
    enabled: typeof value.enabled === 'boolean' ? value.enabled : DEFAULT_SETTINGS.enabled,
    message,
  };
}

export async function getSettings(): Promise<Settings> {
  return normalizeSettings(await api.storage.sync.get(DEFAULT_SETTINGS));
}

export async function saveSettings(patch: Partial<Settings>): Promise<Settings> {
  const next = normalizeSettings({ ...(await getSettings()), ...patch });
  await api.storage.sync.set(next);
  return next;
}

/** Calls `listener` with the new settings whenever they change in sync storage. */
export function onSettingsChanged(listener: (settings: Settings) => void): void {
  api.storage.onChanged.addListener((_changes, area) => {
    if (area === 'sync') void getSettings().then(listener);
  });
}
