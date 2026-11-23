import { beforeEach, describe, expect, it, vi } from 'vitest';

const store: Record<string, unknown> = {};
const listeners: ((changes: object, area: string) => void)[] = [];

vi.stubGlobal('chrome', {
  storage: {
    sync: {
      get: vi.fn((defaults: Record<string, unknown>) => Promise.resolve({ ...defaults, ...store })),
      set: vi.fn((values: Record<string, unknown>) => {
        Object.assign(store, values);
        return Promise.resolve();
      }),
    },
    onChanged: { addListener: (fn: (changes: object, area: string) => void) => listeners.push(fn) },
  },
});

const {
  DEFAULT_SETTINGS,
  MAX_MESSAGE_LENGTH,
  getSettings,
  normalizeSettings,
  onSettingsChanged,
  saveSettings,
} = await import('../../src/shared/settings');

beforeEach(() => {
  for (const key of Object.keys(store)) Reflect.deleteProperty(store, key);
});

describe('normalizeSettings', () => {
  it('returns defaults for missing or invalid input', () => {
    expect(normalizeSettings(undefined)).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings('nope')).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings({ enabled: 'yes', message: 42 })).toEqual(DEFAULT_SETTINGS);
  });

  it('keeps valid values and trims the message', () => {
    expect(normalizeSettings({ enabled: false, message: '  hi  ' })).toEqual({
      enabled: false,
      message: 'hi',
    });
  });

  it('falls back to the default for a blank message', () => {
    expect(normalizeSettings({ message: '   ' }).message).toBe(DEFAULT_SETTINGS.message);
  });

  it('caps the message length', () => {
    const { message } = normalizeSettings({ message: 'x'.repeat(MAX_MESSAGE_LENGTH + 50) });
    expect(message).toHaveLength(MAX_MESSAGE_LENGTH);
  });
});

describe('storage helpers', () => {
  it('reads defaults when storage is empty', async () => {
    expect(await getSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('merges a patch and persists the result', async () => {
    const saved = await saveSettings({ enabled: false });
    expect(saved).toEqual({ ...DEFAULT_SETTINGS, enabled: false });
    expect(store).toEqual(saved);
  });

  it('notifies on sync storage changes only', async () => {
    const listener = vi.fn();
    onSettingsChanged(listener);
    const [handler] = listeners;
    handler?.({}, 'local');
    expect(listener).not.toHaveBeenCalled();
    handler?.({}, 'sync');
    await vi.waitFor(() => {
      expect(listener).toHaveBeenCalledWith(DEFAULT_SETTINGS);
    });
  });
});
