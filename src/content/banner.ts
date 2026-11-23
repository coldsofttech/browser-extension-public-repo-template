export const BANNER_ID = 'browser-extension-template-banner';

/** Shows (or updates) a banner at the top of the page. It lives in a shadow root so page styles cannot affect it. */
export function showBanner(doc: Document, message: string): void {
  let host = doc.getElementById(BANNER_ID);
  if (!host) {
    host = doc.createElement('div');
    host.id = BANNER_ID;
    const shadow = host.attachShadow({ mode: 'open' });
    const style = doc.createElement('style');
    style.textContent = `
      .banner {
        position: fixed; top: 0; left: 0; right: 0; z-index: 2147483647;
        padding: 6px 12px; font: 14px/1.4 system-ui, sans-serif;
        color: #fff; background: #1a73e8; text-align: center;
      }
    `;
    const banner = doc.createElement('div');
    banner.className = 'banner';
    shadow.append(style, banner);
    doc.documentElement.append(host);
  }
  const banner = host.shadowRoot?.querySelector('.banner');
  if (banner) banner.textContent = message;
}

export function hideBanner(doc: Document): void {
  doc.getElementById(BANNER_ID)?.remove();
}
