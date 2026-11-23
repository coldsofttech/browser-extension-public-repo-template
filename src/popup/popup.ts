import { api } from '../shared/api';
import { translateDocument } from '../shared/i18n';
import { getSettings, saveSettings } from '../shared/settings';

translateDocument();

const enabled = document.querySelector<HTMLInputElement>('#enabled');
const options = document.querySelector<HTMLAnchorElement>('#options');

if (enabled) {
  void getSettings().then((settings) => {
    enabled.checked = settings.enabled;
  });
  enabled.addEventListener('change', () => {
    void saveSettings({ enabled: enabled.checked });
  });
}

options?.addEventListener('click', (event) => {
  event.preventDefault();
  void api.runtime.openOptionsPage();
});
