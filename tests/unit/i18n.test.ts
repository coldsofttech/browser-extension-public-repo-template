import { describe, expect, it, vi } from 'vitest';

vi.stubGlobal('chrome', {
  i18n: { getMessage: (key: string) => (key === 'known' ? 'Translated' : '') },
});

const { t, translateDocument } = await import('../../src/shared/i18n');

describe('i18n', () => {
  it('returns the translation, or the key when missing', () => {
    expect(t('known')).toBe('Translated');
    expect(t('unknown')).toBe('unknown');
  });

  it('translates elements marked with data-i18n', () => {
    document.body.innerHTML = '<span data-i18n="known"></span><span data-i18n="other"></span>';
    translateDocument();
    expect(document.body.textContent).toBe('Translatedother');
  });
});
