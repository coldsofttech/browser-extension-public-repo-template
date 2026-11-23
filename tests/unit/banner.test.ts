import { afterEach, describe, expect, it } from 'vitest';
import { BANNER_ID, hideBanner, showBanner } from '../../src/content/banner';

afterEach(() => {
  document.documentElement.innerHTML = '<head></head><body></body>';
});

describe('banner', () => {
  it('adds a banner with the message', () => {
    showBanner(document, 'Hello');
    const host = document.getElementById(BANNER_ID);
    expect(host?.shadowRoot?.querySelector('.banner')?.textContent).toBe('Hello');
  });

  it('updates the existing banner instead of adding another', () => {
    showBanner(document, 'One');
    showBanner(document, 'Two');
    expect(document.querySelectorAll(`#${BANNER_ID}`)).toHaveLength(1);
    expect(
      document.getElementById(BANNER_ID)?.shadowRoot?.querySelector('.banner')?.textContent,
    ).toBe('Two');
  });

  it('removes the banner', () => {
    showBanner(document, 'Hello');
    hideBanner(document);
    expect(document.getElementById(BANNER_ID)).toBeNull();
  });

  it('does nothing when there is no banner to hide', () => {
    expect(() => {
      hideBanner(document);
    }).not.toThrow();
  });
});
