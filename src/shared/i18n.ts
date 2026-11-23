import { api } from './api';

/** Looks up a string from `_locales/<lang>/messages.json`, returning the key if it is missing. */
export function t(key: string): string {
  return api.i18n.getMessage(key) || key;
}

/** Fills every element carrying `data-i18n="<key>"` with its translated text. */
export function translateDocument(root: ParentNode = document): void {
  for (const element of root.querySelectorAll<HTMLElement>('[data-i18n]')) {
    element.textContent = t(element.dataset.i18n ?? '');
  }
}
